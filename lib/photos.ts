// Store bounded chunks so photos stay below D1's per-row size limit.
export function photoStorage(db:D1Database){
 return {
  async put(key:string,bytes:Uint8Array,options:{httpMetadata:{contentType:string}}){
   const statements=[];
   for(let offset=0,part=0;offset<bytes.length;offset+=500000,part++)statements.push(db.prepare('INSERT INTO photo_chunks (photo_key,part,content_type,data) VALUES (?,?,?,?)').bind(key,part,options.httpMetadata.contentType,bytes.slice(offset,offset+500000).buffer));
   await db.batch(statements);
  },
  async get(key:string){
   const {results}=await db.prepare('SELECT content_type,data FROM photo_chunks WHERE photo_key = ? ORDER BY part').bind(key).all<{content_type:string;data:number[]}>();
   if(!results.length)return null;
   const body=new Blob(results.map(row=>new Uint8Array(row.data)),{type:results[0].content_type});
   return {body:body.stream(),httpMetadata:{contentType:results[0].content_type}};
  },
  async delete(key:string){await db.prepare('DELETE FROM photo_chunks WHERE photo_key = ?').bind(key).run()},
 };
}
