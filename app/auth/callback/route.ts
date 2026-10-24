import { cookies } from 'next/headers';
import { authConfig,randomToken,hashToken,FLOW_COOKIE,SESSION_COOKIE,cookieOptions,sessionSeconds } from '@/lib/auth';
import { verifyGoogleToken } from '@/lib/google-token';
import { database } from '@/lib/store';
export async function GET(req:Request){
 const jar=await cookies(),saved=jar.get(FLOW_COOKIE)?.value;
 jar.set(FLOW_COOKIE,'',{...cookieOptions,maxAge:0});
 try{
  const url=new URL(req.url),code=url.searchParams.get('code');
  if(!saved||!code||url.searchParams.has('error'))throw Error('Missing authorization');
  const flow=JSON.parse(Buffer.from(saved,'base64url').toString());
  if(!flow.state||flow.state!==url.searchParams.get('state')||!(flow.expires>Date.now())||typeof flow.verifier!=='string'||typeof flow.nonce!=='string')throw Error('Invalid authorization');
  const {clientId,clientSecret,origin}=authConfig();
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:clientId,client_secret:clientSecret,code,code_verifier:flow.verifier,grant_type:'authorization_code',redirect_uri:origin+'/auth/callback'})});
  if(!response.ok)throw Error('Token exchange failed');
  const tokens=await response.json() as {id_token?:string};
  if(!tokens.id_token)throw Error('Missing identity');
  const user=await verifyGoogleToken(tokens.id_token,clientId,flow.nonce);
  const token=randomToken(),db=database(),previous=jar.get(SESSION_COOKIE)?.value;
  const statements=[db.prepare('DELETE FROM sessions WHERE expires <= ?').bind(Date.now())];
  if(previous)statements.push(db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await hashToken(previous)));
  statements.push(db.prepare('INSERT INTO sessions (token_hash,owner,expires) VALUES (?,?,?)').bind(await hashToken(token),'google:'+user.userId,Date.now()+sessionSeconds*1000));
  await db.batch(statements);
  jar.set(SESSION_COOKIE,token,{...cookieOptions,maxAge:sessionSeconds});
  return new Response(null,{status:303,headers:{Location:'/','Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
 }catch{return new Response(null,{status:303,headers:{Location:'/signin?error=1','Cache-Control':'no-store','Referrer-Policy':'no-referrer'}})}
}
