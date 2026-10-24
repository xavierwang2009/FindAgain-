"use client";

import {useEffect,useRef,useState,type CSSProperties,type PointerEvent} from 'react';
import './sculpture.css';
import {RotateCw,Pause,Play} from 'lucide-react';

const layers=Array.from({length:25},(_,index)=>index);

export default function Sculpture(){
 const [paused,setPaused]=useState(false);
 const [reduced,setReduced]=useState(false);
 const [rotation,setRotation]=useState(0);
 const stage=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduced(preference.matches);
  update();preference.addEventListener('change',update);
  return ()=>preference.removeEventListener('change',update);
 },[]);
 function move(event:PointerEvent<HTMLDivElement>){
  if(paused||reduced||event.pointerType==='touch')return;
  const bounds=event.currentTarget.getBoundingClientRect();
  stage.current?.style.setProperty('--sculpture-pointer-x',`${((event.clientX-bounds.left)/bounds.width-.5)*18}deg`);
  stage.current?.style.setProperty('--sculpture-pointer-y',`${((event.clientY-bounds.top)/bounds.height-.5)*-12}deg`);
 }
 function reset(){
  stage.current?.style.setProperty('--sculpture-pointer-x','0deg');
  stage.current?.style.setProperty('--sculpture-pointer-y','0deg');
 }
 return <div className="fa-sculpture" data-paused={paused||reduced}>
  <div className="fa-sculpture-stage" ref={stage} onPointerMove={move} onPointerLeave={reset} aria-hidden="true" style={{'--sculpture-turn':`${rotation}deg`} as CSSProperties}>
   <div className="fa-sculpture-halo"/>
   <div className="fa-sculpture-orbit fa-sculpture-orbit-back"/>
   <div className="fa-sculpture-pedestal"><span/></div>
   <div className="fa-sculpture-shadow"/>
   <div className="fa-sculpture-float"><div className="fa-sculpture-perspective"><div className="fa-sculpture-key">
    {layers.map(index=><div key={index} className={`fa-sculpture-layer${index===24?' fa-sculpture-face':''}`} style={{'--sculpture-depth':`${index-12}px`,'--sculpture-metal':`${19+index*.9}%`} as CSSProperties}><span className="fa-sculpture-ring"/><span className="fa-sculpture-collar"/><span className="fa-sculpture-shaft"/><span className="fa-sculpture-tooth fa-sculpture-tooth-one"/><span className="fa-sculpture-tooth fa-sculpture-tooth-two"/></div>)}
    <span className="fa-sculpture-engraving">f.</span>
   </div></div></div>
   <div className="fa-sculpture-orbit fa-sculpture-orbit-front"/>
   <div className="fa-sculpture-satellite"><span/></div>
   <span className="fa-sculpture-star fa-sculpture-star-one"/><span className="fa-sculpture-star fa-sculpture-star-two"/>
  </div>
  <div className="fa-sculpture-controls">
   <button type="button" onClick={()=>setRotation(value=>value+45)} aria-label="Rotate the key sculpture"><RotateCw aria-hidden="true"/> Rotate</button>
   {!reduced&&<button type="button" aria-pressed={paused} onClick={()=>{setPaused(value=>!value);reset()}}>{paused?<Play aria-hidden="true"/>:<Pause aria-hidden="true"/>} {paused?'Resume motion':'Pause motion'}</button>}
  </div>
 </div>;
}
