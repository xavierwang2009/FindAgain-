import type {Item} from './items';
type RecordItem=Omit<Item,'photo'> & {nameKey:string;photo?:Blob};
let opened:Promise<IDBDatabase>|null=null;
function database(){
 if(!opened)opened=new Promise<IDBDatabase>((resolve,reject)=>{
  const request=indexedDB.open('findagain-device',1);
  request.onupgradeneeded=()=>{const store=request.result.createObjectStore('items',{keyPath:'id'});store.createIndex('nameKey','nameKey',{unique:true})};
  request.onerror=()=>{opened=null;reject(request.error)};
  request.onblocked=()=>{opened=null;reject(Error('Close other FindAgain tabs and try again.'))};
  request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();opened=null};resolve(db)};
 });
 return opened;
}
function publicItem(row:RecordItem):Item{return {id:row.id,name:row.name,location:row.location,updated:row.updated,photo:!!row.photo}}
export async function listItems():Promise<Item[]>{
 const db=await database();
 return new Promise((resolve,reject)=>{const tx=db.transaction('items','readonly'),request=tx.objectStore('items').getAll();tx.oncomplete=()=>resolve((request.result as RecordItem[]).sort((a,b)=>b.updated-a.updated).map(publicItem));tx.onabort=()=>reject(tx.error)});
}
export async function getPhoto(id:string):Promise<Blob|null>{
 const db=await database();
 return new Promise((resolve,reject)=>{const tx=db.transaction('items','readonly'),request=tx.objectStore('items').get(id);tx.oncomplete=()=>resolve(request.result?.photo||null);tx.onabort=()=>reject(tx.error)});
}
export async function saveItem(input:{id?:string;name:string;location:string;photo?:Blob}):Promise<Item>{
 const name=input.name.trim(),location=input.location.trim(),nameKey=name.toLowerCase();
 if(!name||!location||name.length>80||location.length>300)throw Error('Add an item (up to 80 characters) and place (up to 300 characters).');
 const db=await database();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('items','readwrite'),store=tx.objectStore('items'),request=store.getAll();let result:RecordItem;let failure:Error|null=null;
  request.onsuccess=()=>{
   const rows=request.result as RecordItem[],sameName=rows.find(row=>row.nameKey===nameKey),existing=input.id?rows.find(row=>row.id===input.id):sameName;
   if(input.id&&!existing)failure=Error('This item no longer exists. Refresh and try again.');
   if(input.id&&sameName&&sameName.id!==input.id)failure=Error('You already have an item with that name. Please use a different name.');
   if(failure){tx.abort();return}
   result={id:existing?.id||crypto.randomUUID(),name,nameKey,location,updated:Date.now(),photo:input.photo||existing?.photo};store.put(result);
  };
  tx.oncomplete=()=>resolve(publicItem(result));tx.onabort=()=>reject(failure||tx.error||Error('Could not save on this device.'));
 });
}
export async function removeItem(id:string){
 const db=await database();
 return new Promise<void>((resolve,reject)=>{const tx=db.transaction('items','readwrite');tx.objectStore('items').delete(id);tx.oncomplete=()=>resolve();tx.onabort=()=>reject(tx.error)});
}
export function storageError(error:unknown){return error instanceof DOMException&&error.name==='QuotaExceededError'?'This browser’s storage is full. Remove an old item or photo and try again.':error instanceof Error?error.message:'Browser storage is unavailable. Allow site storage and try again.'}

export async function exportBackup():Promise<string>{
 const db=await database();
 const rows=await new Promise<RecordItem[]>((resolve,reject)=>{const tx=db.transaction('items','readonly'),request=tx.objectStore('items').getAll();tx.oncomplete=()=>resolve(request.result);tx.onabort=()=>reject(tx.error)});
 const items=await Promise.all(rows.map(async row=>{
  let photo:null|{type:string;data:string}=null;
  if(row.photo){const bytes=new Uint8Array(await row.photo.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));photo={type:row.photo.type,data:btoa(binary)}}
  return {name:row.name,location:row.location,updated:row.updated,photo};
 }));
 return JSON.stringify({format:'findagain-backup',version:1,exportedAt:new Date().toISOString(),items});
}
export async function restoreBackup(text:string):Promise<{added:number;skipped:number}>{
 let data:any;try{data=JSON.parse(text)}catch{throw Error('This is not a valid FindAgain backup file.')}
 if(data?.format!=='findagain-backup'||data.version!==1||!Array.isArray(data.items))throw Error('Choose a FindAgain backup exported by this app.');
 // Validate every record before opening a write transaction; invalid files change nothing.
 const rows:RecordItem[]=data.items.map((item:any)=>{
  if(typeof item?.name!=='string'||!item.name.trim()||item.name.length>80||typeof item.location!=='string'||!item.location.trim()||item.location.length>300||!Number.isSafeInteger(item.updated)||item.updated<0)throw Error('The backup contains an invalid item. Nothing was restored.');
  let photo:Blob|undefined;
  if(item.photo!=null){
   if(!['image/jpeg','image/png','image/webp','image/gif'].includes(item.photo.type)||typeof item.photo.data!=='string')throw Error('The backup contains an invalid photo. Nothing was restored.');
   try{photo=new Blob([Uint8Array.from(atob(item.photo.data),c=>c.charCodeAt(0))],{type:item.photo.type})}catch{throw Error('The backup contains a damaged photo. Nothing was restored.')}
  }
  return {id:crypto.randomUUID(),name:item.name.trim(),nameKey:item.name.trim().toLowerCase(),location:item.location.trim(),updated:item.updated,photo};
 });
 const db=await database();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('items','readwrite'),store=tx.objectStore('items'),request=store.getAll();let added=0,skipped=0;
  request.onsuccess=()=>{const names=new Set((request.result as RecordItem[]).map(row=>row.nameKey));for(const row of rows){if(names.has(row.nameKey)){skipped++;continue}names.add(row.nameKey);store.add(row);added++}};
  tx.oncomplete=()=>resolve({added,skipped});tx.onabort=()=>reject(tx.error||Error('Restore failed. No items were changed.'));
 });
}
