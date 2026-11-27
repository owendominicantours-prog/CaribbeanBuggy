'use client';
import {useEffect,useRef,useState,useId} from 'react';
import type {GooglePickup,PickupRegion} from '../../lib/googlePickup';

export default function GooglePickupField({value,selected,initialValue,initialRef,region,locale,label,placeholder,onChange,onSelect}:{value:string;selected:GooglePickup|null;initialValue?:string;initialRef?:string;region:PickupRegion;locale:string;label:string;placeholder:string;onChange:(v:string)=>void;onSelect:(v:GooglePickup)=>void}){
 const id=useId();
 const [items,setItems]=useState<GooglePickup[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState('');const initial=useRef(false),generation=useRef(0),callbacks=useRef({onSelect});callbacks.current={onSelect};
 const es=locale!=='en';
 useEffect(()=>{
  if(selected||value.trim().length<3){setItems([]);setBusy(false);return;}
  const abort=new AbortController(),stamp=++generation.current,exact=!!initialValue&&!initial.current&&value===initialValue;
  const timer=setTimeout(async()=>{setBusy(true);setError('');try{const r=await fetch('/api/google-pickup?'+new URLSearchParams({q:exact?initialRef||value:value,region,locale,...(exact?{resolve:'1'}:{})}),{signal:abort.signal,cache:'no-store'});const d=await r.json();if(abort.signal.aborted||stamp!==generation.current)return;if(!r.ok)throw Error('search');initial.current=true;if(exact&&d.locations?.length===1)callbacks.current.onSelect(d.locations[0]);else setItems(d.locations||[]);}catch{if(!abort.signal.aborted&&stamp===generation.current){initial.current=true;setError(es?'Busca y selecciona el alojamiento exacto.':'Search and select your exact accommodation.');setItems([]);}}finally{if(!abort.signal.aborted&&stamp===generation.current)setBusy(false);}},exact?0:300);
  return()=>{clearTimeout(timer);abort.abort();};
 },[value,selected,region,locale,initialValue,initialRef,es]);
 async function choose(item:GooglePickup){const stamp=++generation.current;setBusy(true);setError('');try{const r=await fetch('/api/google-pickup?'+new URLSearchParams({q:item.id,region,locale,resolve:'1'}),{cache:'no-store'}),d=await r.json();if(stamp!==generation.current)return;if(!r.ok||d.locations?.length!==1)throw Error('selection');onSelect(d.locations[0]);setItems([]);}catch{if(stamp===generation.current)setError(es?'Selecciona un lugar en la zona de salida.':'Choose a place in the departure area.');}finally{if(stamp===generation.current)setBusy(false);}}
 return <div><div className="cb-search"><input value={value} placeholder={placeholder} aria-label={label} autoComplete="off" role="combobox" aria-controls={id} aria-expanded={!selected&&items.length>0} aria-autocomplete="list" onChange={e=>{generation.current++;onChange(e.target.value);}}/></div>{!selected&&items.length>0&&<ul id={id} role="listbox" className="cb-suggestions">{items.map(item=><li key={item.id}><button role="option" aria-selected={false} disabled={busy} type="button" onClick={()=>void choose(item)}><b>{item.name}</b><span>{item.address}</span></button></li>)}</ul>}{busy&&<p className="cb-hint" role="status">{es?'Buscando ubicación…':'Looking up location…'}</p>}{error&&<p role="alert" className="cb-hint">{error}</p>}<p className="cb-hint">Google Maps{selected?' · '+(es?'Recogida según las condiciones del tour.':'Pickup follows the tour conditions.'):''}</p></div>;
}
