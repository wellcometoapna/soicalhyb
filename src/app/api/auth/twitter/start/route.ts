import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '@/utils/pkce';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'default';

  const verifier = generateCodeVerifier(64);
  const challenge = await generateCodeChallenge(verifier);

  const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${
    process.env.TWITTER_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/twitter'
  )}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;

  const res = NextResponse.redirect(authUrl);

  // 🔑 Make cookie dev-friendly
  res.cookies.set('twitter_code_verifier', verifier, {
    httpOnly: true,
    secure: false,   // ❌ FIX for localhost (must be false, otherwise cookie not set)
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 5,
  });

  return res;
}
