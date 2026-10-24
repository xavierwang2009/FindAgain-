import 'fake-indexeddb/auto';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {listItems,saveItem,getPhoto,removeItem} from '../lib/local-store.ts';
test('device storage persists text and photos across a new connection, supports updates and removes photos with items',async()=>{
 const photo=new Blob(['local photo bytes'],{type:'image/jpeg'});
 const saved=await saveItem({name:'Keys',location:'Drawer',photo});
 assert.equal(saved.photo,true);
 const reopened=await import('../lib/local-store.ts?new-connection');
 assert.equal((await reopened.listItems())[0].location,'Drawer');
 assert.equal(await (await reopened.getPhoto(saved.id)).text(),'local photo bytes');
 const updated=await saveItem({name:'  KEYS  ',location:'Shelf'});
 assert.equal(updated.id,saved.id);assert.equal((await listItems()).length,1);assert.equal(updated.photo,true);
 await removeItem(saved.id);assert.deepEqual(await listItems(),[]);assert.equal(await getPhoto(saved.id),null);
});
test('invalid inputs and duplicate edits do not overwrite records',async()=>{
 await assert.rejects(saveItem({name:'',location:'Drawer'}));
 const a=await saveItem({name:'Glasses',location:'Desk'}),b=await saveItem({name:'Wallet',location:'Bag'});
 await assert.rejects(saveItem({id:a.id,name:'Wallet',location:'Wrong place'}));
 await assert.rejects(saveItem({id:'missing',name:'Other',location:'Other'}));
 assert.equal((await listItems()).find(i=>i.id===a.id).location,'Desk');
 await removeItem(a.id);await removeItem(b.id);
});
test('concurrent saves of the same name use one record',async()=>{
 const [a,b]=await Promise.all([saveItem({name:'Phone',location:'Desk'}),saveItem({name:'Phone',location:'Shelf'})]);
 assert.equal(a.id,b.id);assert.equal((await listItems()).length,1);await removeItem(a.id);
});
