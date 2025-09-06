import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  
  if (!platform) {
    return NextResponse.json({ error: 'Platform is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // OAuth URLs for different platforms
  const oauthUrls = {
    facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/facebook')}&scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish&response_type=code&state=${user.id}`,
    
    instagram: `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/instagram')}&scope=user_profile,user_media&response_type=code&state=${user.id}`,
    
    linkedin: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/linkedin')}&scope=w_member_social,r_liteprofile,r_emailaddress&state=${user.id}`,
    
    twitter: `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback/twitter')}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=${user.id}&code_challenge=challenge&code_challenge_method=plain`
  };

  const authUrl = oauthUrls[platform as keyof typeof oauthUrls];
  
  if (!authUrl) {
    return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
  }

  return NextResponse.json({ authUrl });
}