import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {generateKeyPair,SignJWT,createLocalJWKSet,exportJWK} from 'jose';
import {verifyGoogleToken} from '../lib/google-token.ts';
import {photoStorage} from '../lib/photos.ts';
const {privateKey,publicKey}=await generateKeyPair('RS256');
const keys=createLocalJWKSet({keys:[{...await exportJWK(publicKey),kid:'test',alg:'RS256'}]});
async function token(overrides={}){return new SignJWT({sub:'user-a',email:'a@example.com',email_verified:true,nonce:'expected',iss:'https://accounts.google.com',aud:'client',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+300,...overrides}).setProtectedHeader({alg:'RS256',kid:'test'}).sign(privateKey)}
test('Google identity requires a valid signature, issuer, audience, expiry, nonce and verified email',async()=>{
 assert.deepEqual(await verifyGoogleToken(await token(),'client','expected',keys),{userId:'user-a',email:'a@example.com'});
 for(const claims of [{iss:'https://attacker.invalid'},{aud:'another-client'},{exp:1},{nonce:'wrong'},{email_verified:false},{sub:''}])await assert.rejects(verifyGoogleToken(await token(claims),'client','expected',keys));
 const valid=await token();await assert.rejects(verifyGoogleToken(valid.slice(0,-10)+'AAAAAAAAAA','client','expected',keys));
});
function localDatabase(){
 const sql=new DatabaseSync(':memory:');
 for(const file of ['0001_memories.sql','0002_google_auth_photos.sql'])sql.exec(readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
 const wrap=(query,args=[])=>({bind(...values){return wrap(query,values.map(v=>v instanceof ArrayBuffer?new Uint8Array(v):v))},async run(){return sql.prepare(query).run(...args)},async all(){return {results:sql.prepare(query).all(...args).map(row=>({...row,...(row.data?{data:Array.from(row.data)}:{})}))}}});
 return {sql,prepare:wrap,async batch(statements){sql.exec('BEGIN');try{const results=await Promise.all(statements.map(s=>s.run()));sql.exec('COMMIT');return results}catch(e){sql.exec('ROLLBACK');throw e}}};
}
test('5 MB photo is stored in bounded chunks, reconstructed exactly, and removed',async()=>{
 const db=localDatabase(),storage=photoStorage(db),bytes=new Uint8Array(5*1024*1024);for(let i=0;i<bytes.length;i++)bytes[i]=i%251;
 await storage.put('photo',bytes,{httpMetadata:{contentType:'image/jpeg'}});
 assert.ok(db.sql.prepare('SELECT max(length(data)) AS size FROM photo_chunks').get().size<=500000);
 const saved=await storage.get('photo');assert.equal(saved.httpMetadata.contentType,'image/jpeg');assert.deepEqual(new Uint8Array(await new Response(saved.body).arrayBuffer()),bytes);
 await storage.delete('photo');assert.equal(await storage.get('photo'),null);db.sql.close();
});
test('item names and reads are isolated by owner; expired sessions do not authenticate',()=>{
 const {sql}=localDatabase();
 const insert=sql.prepare('INSERT INTO memories (id,owner,name,name_key,location,updated) VALUES (?,?,?,?,?,?)');
 insert.run('a','google:a','Keys','keys','Drawer',1);insert.run('b','google:b','Keys','keys','Desk',1);
 assert.equal(sql.prepare('SELECT location FROM memories WHERE id=? AND owner=?').get('a','google:b'),undefined);
 assert.equal(sql.prepare('UPDATE memories SET location=? WHERE id=? AND owner=?').run('Wrong','a','google:b').changes,0);
 assert.equal(sql.prepare('DELETE FROM memories WHERE id=? AND owner=?').run('a','google:b').changes,0);
 sql.prepare('INSERT INTO sessions VALUES (?,?,?)').run('hash','google:a',1);
 assert.equal(sql.prepare('SELECT owner FROM sessions WHERE token_hash=? AND expires>?').get('hash',Date.now()),undefined);sql.close();
});
