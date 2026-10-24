export type Item={id:string;name:string;location:string;updated:number;photo:boolean};
const aliases:Record<string,string>={spectacles:'glasses',eyeglasses:'glasses',eyewear:'glasses',specs:'glasses',glass:'glasses',cellphone:'phone',mobile:'phone',smartphone:'phone',cell:'phone',keys:'key',glasses:'glasses',television:'tv',controller:'remote',remotes:'remote'};
const stop=new Set(['where','s','is','are','was','were','my','the','a','an','did','do','i','put','leave','left','please','find','me','can','could','you','remember','it','on','in','at','of','to','last','have','seen','tell','looking','for','locate']);
export function searchWords(s:string){return s.normalize('NFKC').toLowerCase().replace(/眼鏡/g,'眼镜').replace(/鑰匙/g,'钥匙').replace(/(?:请问|請問|帮我|幫我|找一下|找找|我的|在哪裡|在哪里|在哪儿|在哪|放在|哪里|哪裡|什么地方|什麼地方|请|請|找|呢|啊)/g,' ').replace(/[^\p{L}\p{N} ]/gu,' ').split(/\s+/).filter(w=>w&&!stop.has(w)).map(w=>aliases[w]||(/^[a-z]+s$/.test(w)&&!w.endsWith('ss')?w.slice(0,-1):w))}
function closeWord(a:string,b:string){if(a===b)return true;if(a.endsWith('s'))a=a.slice(0,-1);if(b.endsWith('s'))b=b.slice(0,-1);if(a.length<4||b.length<4||Math.abs(a.length-b.length)>1)return false;let i=0,j=0,edits=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue}if(++edits>1)return false;if(a.length>=b.length)i++;if(b.length>=a.length)j++}return edits+(i<a.length||j<b.length?1:0)<=1}
function ranked(items:Item[],q:string){const terms=searchWords(q);if(!terms.length)return [];return items.map(i=>{const nameWords=searchWords(i.name),placeWords=searchWords(i.location);let covered=0;const score=terms.reduce((s,w)=>{if(nameWords.includes(w)){covered++;return s+8}if(nameWords.some(t=>closeWord(t,w))){covered++;return s+4}if(placeWords.includes(w))return s+1;return s},0);return {i,score,complete:covered===terms.length}}).filter(x=>x.score>0).sort((a,b)=>Number(b.complete)-Number(a.complete)||b.score-a.score||b.i.updated-a.i.updated)}
export function match(items:Item[],q:string){if(!q.trim())return items;return ranked(items,q).map(x=>x.i)}
export type FindAnswer={kind:'found'|'possible'|'choices'|'missing'|'empty';text:string;items:Item[]};
export function answerFind(items:Item[],q:string):FindAnswer{
 if(!searchWords(q).length)return {kind:'empty',text:'Which item are you looking for?',items:[]};
 const matches=ranked(items,q);if(!matches.length)return {kind:'missing',text:'I haven’t found a saved place for that item. Try another name.',items:[]};
 const complete=matches.filter(m=>m.complete);const best=complete.length?complete:matches;const candidates=best.map(m=>m.i);
 if(candidates.length>1)return {kind:'choices',text:`I found ${candidates.length} possible items. Which one do you mean?`,items:candidates};
 const item=candidates[0];return {kind:complete.length?'found':'possible',text:`${complete.length?'':'Possible match. '}Last saved place for ${item.name}: ${item.location}.`,items:[item]};
}
export function parseMemory(text:string){
 const cleaned=text.trim().replace(/[.!]$/,'').replace(/^(?:please\s+)?remember(?:\s+that)?\s+/i,'').replace(/^(?:I(?:’ve|'ve| have)?\s+)?(?:put|left|placed|keep|kept|stored)\s+/i,'').replace(/^(?:my|the)\s+/i,'');
 const m=cleaned.match(/^(.+?)\s+(in|on|at|under|inside|beside|behind|near|by|next to|into|above|below)\s+(.+)$/i);
 if(m){const name=m[1].replace(/\s+(?:is|are|was|were)$/i,'').trim();return name?{name,location:m[2]+' '+m[3]}:null;}
 const pair=cleaned.match(/^([^,;]+)[,;]\s*(.+)$/);if(pair)return {name:pair[1].trim(),location:pair[2].trim()};
 return null;
}
