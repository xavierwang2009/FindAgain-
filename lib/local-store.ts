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
