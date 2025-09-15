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
    // 1. Exchange code for access token
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
    if (tokenData.error) throw new Error(tokenData.error_description);

    // 2. Get user info from OpenID Connect endpoint
    const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = await userInfoResponse.json();

    // 3. Prepare fields
    const displayName = userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim();

    // 4. Save to database
    const { error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: state,
        platform: 'linkedin',
        platform_user_id: userInfo.sub, // ✅ use OpenID "sub" as LinkedIn ID
        username: displayName,
        display_name: displayName,
        profile_image_url: userInfo.picture,
        access_token: tokenData.access_token,
        token_expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
        account_data: userInfo,
        is_active: true,
      });

    if (error) throw error;

    return NextResponse.redirect(new URL('/dashboard?connected=linkedin', request.url));
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }
}

