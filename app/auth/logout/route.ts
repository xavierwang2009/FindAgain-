import { cookies } from 'next/headers';
import { SESSION_COOKIE,cookieOptions,hashToken } from '@/lib/auth';
import { database,sameOrigin } from '@/lib/store';
export async function POST(req:Request){
 if(!sameOrigin(req))return new Response('Request not allowed',{status:403});
 const jar=await cookies(),token=jar.get(SESSION_COOKIE)?.value;
 if(token)await database().prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await hashToken(token)).run();
 jar.set(SESSION_COOKIE,'',{...cookieOptions,maxAge:0});
 return new Response(null,{status:303,headers:{Location:'/signin','Cache-Control':'no-store'}});
}
