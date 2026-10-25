import 'fake-indexeddb/auto';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {saveItem,listItems,removeItem,getPhoto,exportBackup,restoreBackup} from '../lib/local-store.ts';
test('backup round trip preserves photos, dates and locations; restore never overwrites duplicates',async()=>{
 const saved=await saveItem({name:'Keys',location:'Drawer',photo:new Blob(['photo bytes'],{type:'image/jpeg'})});
 const backup=await exportBackup();await removeItem(saved.id);
 assert.deepEqual(await restoreBackup(backup),{added:1,skipped:0});
 const [restored]=await listItems();assert.equal(restored.updated,saved.updated);assert.equal(restored.location,'Drawer');assert.equal(await(await getPhoto(restored.id)).text(),'photo bytes');
 await saveItem({name:'Keys',location:'New place'});
 assert.deepEqual(await restoreBackup(backup),{added:0,skipped:1});assert.equal((await listItems())[0].location,'New place');
});
test('malformed backup cannot partially import valid preceding records',async()=>{
 const before=await listItems();
 await assert.rejects(restoreBackup('not json'));
 await assert.rejects(restoreBackup(JSON.stringify({format:'findagain-backup',version:1,items:[{name:'Wallet',location:'Bag',updated:1,photo:null},{name:'bad'}]})));
 await assert.rejects(restoreBackup(JSON.stringify({format:'findagain-backup',version:1,items:[{name:'Photo',location:'Bag',updated:1,photo:{type:'image/svg+xml',data:'abc'}}]})));
 assert.deepEqual(await listItems(),before);
});
