import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../../supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // This is the user ID
  
  if (!code || !state) {
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }

  const supabase = await createClient();
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/facebook',
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(tokenData.error.message);
    }

    // Get user profile
    const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${tokenData.access_token}`);
    const profileData = await profileResponse.json();

    // Save to database
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: state,
        platform: 'facebook',
        platform_user_id: profileData.id,
        username: profileData.name,
        display_name: profileData.name,
        profile_image_url: profileData.picture?.data?.url,
        access_token: tokenData.access_token,
        token_expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
        account_data: profileData,
        is_active: true,
      });

    if (error) throw error;

    return NextResponse.redirect(new URL('/dashboard?connected=facebook', request.url));
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }
}