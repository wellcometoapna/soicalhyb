import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '@/utils/pkce';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get('state') || 'default';

  // Generate PKCE values
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  // Build Twitter OAuth URL
  const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${
    process.env.TWITTER_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/twitter'
  )}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;

  // Save verifier in cookie
  const response = NextResponse.redirect(url);
  response.cookies.set('twitter_code_verifier', verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 5, // 5 min
  });

  return response;
}
