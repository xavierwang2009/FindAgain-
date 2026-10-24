import { cookies } from 'next/headers';
import { authConfig,randomToken,hashToken,FLOW_COOKIE,cookieOptions } from '@/lib/auth';
export async function GET(){
 try{
  const {clientId,origin}=authConfig();
  const flow={state:randomToken(),nonce:randomToken(),verifier:randomToken(),expires:Date.now()+600000};
  (await cookies()).set(FLOW_COOKIE,Buffer.from(JSON.stringify(flow)).toString('base64url'),{...cookieOptions,maxAge:600});
  const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search=new URLSearchParams({client_id:clientId,redirect_uri:origin+'/auth/callback',response_type:'code',scope:'openid email profile',state:flow.state,nonce:flow.nonce,code_challenge:await hashToken(flow.verifier),code_challenge_method:'S256',prompt:'select_account'}).toString();
  return new Response(null,{status:302,headers:{Location:url.toString(),'Cache-Control':'no-store'}});
 }catch{return new Response('Google sign-in is not ready. Please try again later.',{status:503,headers:{'Cache-Control':'no-store'}})}
}
