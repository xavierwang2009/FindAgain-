/** Copy on browsers that permit it; leave a visible, selected link otherwise. */
export async function copyLink(text:string,field:HTMLInputElement|null):Promise<'copied'|'manual'>{
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return 'copied'}}catch{/* Embedded browsers can reject clipboard access. */}
 if(!field)return 'manual';
 try{field.focus();field.select();field.setSelectionRange(0,text.length);if(document.execCommand?.('copy'))return 'copied'}catch{/* The selected link remains available to copy manually. */}
 return 'manual';
}
