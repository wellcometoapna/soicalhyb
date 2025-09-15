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
    // 1) Exchange code -> short-lived token
    const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID!,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/instagram',
        code,
      }),
    });

    const token = await tokenRes.json();
    if (!token.access_token || !token.user_id) {
      throw new Error(`Token exchange failed: ${JSON.stringify(token)}`);
    }

    // 2) (Optional but recommended) Exchange to long-lived token
    //    Keeps the connection stable beyond ~1 hour.
    const longRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(process.env.INSTAGRAM_CLIENT_SECRET!)}&access_token=${encodeURIComponent(token.access_token)}`
    );
    const longData = await longRes.json();
    const accessToken = longData.access_token || token.access_token;
    const expiresInSec = longData.expires_in || token.expires_in || 3600;

    // 3) Fetch user profile (Basic Display via Graph)
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${encodeURIComponent(accessToken)}`
    );
    const me = await meRes.json();
    if (!me.id) throw new Error(`Failed to fetch user: ${JSON.stringify(me)}`);

    // 4) Save to DB (match your schema)
    const { error } = await supabase.from('social_accounts').upsert({
      user_id: state,
      platform: 'instagram',
      platform_user_id: String(me.id),      // ✅ NOT NULL
      username: me.username || null,
      display_name: me.username || null,
      profile_image_url: null,              // Basic Display doesn't return avatar here
      access_token: accessToken,
      token_expires_at: new Date(Date.now() + expiresInSec * 1000).toISOString(),
      account_data: me,
      is_active: true,
    });

    if (error) throw error;

    return NextResponse.redirect(new URL('/dashboard?connected=instagram', request.url));
  } catch (err) {
    console.error('Instagram OAuth error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_failed', request.url));
  }
}
