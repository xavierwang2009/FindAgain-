import { env } from 'cloudflare:workers';
export function database():D1Database {const db=(env as unknown as {DB?:D1Database}).DB;if(!db)throw new Error('Database unavailable');return db;}
export function bucket():R2Bucket {const b=(env as unknown as {BUCKET?:R2Bucket}).BUCKET;if(!b)throw new Error('Photo storage unavailable');return b;}
export function publicItem(r:any){return {id:r.id,name:r.name,location:r.location,updated:r.updated,photo:!!r.photo_key};}
export const privateHeaders={'Cache-Control':'private, no-store'};
export function reply(data:unknown,status=200){return Response.json(data,{status,headers:privateHeaders});}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return !origin||origin===new URL(req.url).origin;}
