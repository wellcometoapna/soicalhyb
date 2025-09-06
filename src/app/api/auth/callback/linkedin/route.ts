import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../../supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  if (!code || !state) {
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }

  const supabase = await createClient();
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/linkedin',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(tokenData.error_description);
    }

    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileResponse.json();

    const displayName = `${profileData.firstName?.localized?.en_US || ''} ${profileData.lastName?.localized?.en_US || ''}`.trim();

    // Save to database
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: state,
        platform: 'linkedin',
        platform_user_id: profileData.id,
        username: displayName,
        display_name: displayName,
        profile_image_url: profileData.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
        access_token: tokenData.access_token,
        token_expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
        account_data: profileData,
        is_active: true,
      });

    if (error) throw error;

    return NextResponse.redirect(new URL('/dashboard?connected=linkedin', request.url));
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }
}