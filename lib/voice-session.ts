/** One speech session. Collect all results and finish before playing a reply. */
export function voiceSession(recognition:any,callbacks:{onText:(text:string,final:boolean)=>void;onDone:(text:string)=>void;onError:(message:string)=>void;onListening:(active:boolean)=>void}){
 let text='',closed=false,failed=false,stopRequested=false;
 let deadline:ReturnType<typeof setTimeout>|undefined,fallback:ReturnType<typeof setTimeout>|undefined;
 const clear=()=>{clearTimeout(deadline);clearTimeout(fallback)};
 function finish(){if(closed)return;closed=true;clear();callbacks.onListening(false);if(failed)return;if(text.trim())callbacks.onDone(text.trim());else callbacks.onError('No words received. Try Voice again, or use your keyboard’s microphone and tap Find.');}
 function stop(){if(closed||stopRequested)return;stopRequested=true;fallback=setTimeout(()=>{try{recognition.abort()}catch{}finish()},1200);try{recognition.stop()}catch{try{recognition.abort()}catch{}finish()}}
 recognition.interimResults=true;recognition.continuous=false;
 recognition.onstart=()=>{if(!closed)callbacks.onListening(true)};
 recognition.onresult=(event:any)=>{if(closed)return;const parts:string[]=[];let final=false;for(let i=0;i<event.results.length;i++){const result=event.results[i];if(result?.[0]?.transcript)parts.push(result[0].transcript);if(result?.isFinal)final=true}text=parts.join(' ').trim();if(text)callbacks.onText(text,final);if(final)stop()};
 recognition.onend=finish;
 recognition.onerror=(event:any)=>{if(closed)return;if(event.error==='aborted'&&stopRequested){finish();return}failed=true;callbacks.onError(event.error==='not-allowed'||event.error==='service-not-allowed'?'Microphone access is blocked. Use the keyboard microphone or type and tap Find.':event.error==='network'?'Voice connection failed. Try again or type the item.':'No clear speech received. Try again or type the item.');finish()};
 return {start(){callbacks.onListening(true);deadline=setTimeout(stop,20000);try{recognition.start()}catch{failed=true;callbacks.onError('Microphone could not start. Try typing instead.');finish()}},stop,abort(){if(closed)return;closed=true;clear();try{recognition.abort()}catch{}callbacks.onListening(false)}};
}
