import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../../supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const codeVerifier = request.cookies.get('twitter_code_verifier')?.value;

  if (!code || !state || !codeVerifier) {
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }

  const supabase = await createClient();

  try {
    // Prepare Basic Auth
    const basicAuth = Buffer.from(
      `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
    ).toString('base64');

    // 1) Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`, // 🔑 Required
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/twitter',
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      console.error('Twitter token exchange failed', tokenData);
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const accessToken: string = tokenData.access_token;

    // 2) Fetch user profile
    const profileResponse = await fetch(
      'https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const profileData = await profileResponse.json();
    if (profileData.errors) {
      throw new Error(profileData.errors?.[0]?.detail || 'Failed to fetch Twitter profile');
    }

    const userData = profileData.data;

    // 3) Save to database
    const { error } = await supabase.from('social_accounts').upsert({
      user_id: state,
      platform: 'twitter',
      platform_user_id: userData.id,
      username: userData.username,
      display_name: userData.name,
      profile_image_url: userData.profile_image_url,
      access_token: accessToken,
      refresh_token: tokenData.refresh_token,
      token_expires_at: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : null,
      account_data: userData,
      is_active: true,
    });

    if (error) throw error;

    return NextResponse.redirect(new URL('/dashboard?connected=twitter', request.url));
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }
}
