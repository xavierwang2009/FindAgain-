import {useEffect,useState} from 'react';
import {getPhoto} from '@/lib/local-store';
export default function LocalPhoto({id,updated,alt,className}:{id:string;updated:number;alt:string;className?:string}){
 const [url,setUrl]=useState('');
 useEffect(()=>{let active=true,objectUrl='';setUrl('');getPhoto(id).then(blob=>{if(active&&blob){objectUrl=URL.createObjectURL(blob);setUrl(objectUrl)}}).catch(()=>{});return()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl)}},[id,updated]);
 return url?<img src={url} alt={alt} className={className}/>:<span className={className} aria-label={alt}>Photo unavailable</span>;
}
