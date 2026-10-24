import { env } from 'cloudflare:workers';
import { photoStorage } from './photos';
export function database():D1Database {const db=(env as unknown as {DB?:D1Database}).DB;if(!db)throw new Error('Database unavailable');return db;}
export function bucket(){return photoStorage(database());}
export function publicItem(r:any){return {id:r.id,name:r.name,location:r.location,updated:r.updated,photo:!!r.photo_key};}
export const privateHeaders={'Cache-Control':'private, no-store'};
export function reply(data:unknown,status=200){return Response.json(data,{status,headers:privateHeaders});}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return origin===new URL(req.url).origin;}
