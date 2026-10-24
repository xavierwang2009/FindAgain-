import { cookies } from 'next/headers';
import { env } from 'cloudflare:workers';
import { database } from './store';
export const SESSION_COOKIE='__Host-findagain-session';
export const FLOW_COOKIE='__Host-findagain-oauth';
export const cookieOptions={httpOnly:true,secure:true,sameSite:'lax' as const,path:'/'};
export const sessionSeconds=30*24*60*60;
export function authConfig(){
 const config=env as unknown as {GOOGLE_CLIENT_ID?:string;GOOGLE_CLIENT_SECRET?:string;APP_ORIGIN?:string};
 if(!config.GOOGLE_CLIENT_ID||!config.GOOGLE_CLIENT_SECRET||!config.APP_ORIGIN)throw Error('Google sign-in is not configured');
 return {clientId:config.GOOGLE_CLIENT_ID,clientSecret:config.GOOGLE_CLIENT_SECRET,origin:new URL(config.APP_ORIGIN).origin};
}
export function randomToken(){return Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url')}
export async function hashToken(token:string){return Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))).toString('base64url')}
export async function getUser(){
 const token=(await cookies()).get(SESSION_COOKIE)?.value;
 if(!token||!/^[A-Za-z0-9_-]{43}$/.test(token))return null;
 return database().prepare('SELECT owner AS userId FROM sessions WHERE token_hash = ? AND expires > ?').bind(await hashToken(token),Date.now()).first<{userId:string}>();
}
