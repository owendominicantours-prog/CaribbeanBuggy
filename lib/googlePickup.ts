import 'server-only';
import bindings from './googlePickupBindings.json';
import {hotelBuggyLandings} from './hotelBuggyLandings';
import {areaForHotel,normalizeText} from './pickupLookup';

export type GooglePickup={id:string;name:string;address:string;mapsUrl:string;areaId?:string;calculatorZone?:string};
export type PickupRegion='punta-cana'|'la-romana';
const region=(v:string):PickupRegion=>{if(v!=='punta-cana'&&v!=='la-romana')throw Error('Choose the experience departure area.');return v;};
export async function googlePickupLocations(query:string,searchRegion:string,resolve=false,locale='es'):Promise<GooglePickup[]>{
 const q=String(query||'').trim();if(q.length<3||q.length>300)return [];
 const candidates=resolve?bindings.bindings.filter(x=>x.slug===q||normalizeText(x.name)===normalizeText(q)):[];const known=new Set(candidates.map(x=>x.placeId)).size===1?candidates[0]:null;
 const response=await fetch('https://proactivitis.com/api/transfers/v2/locations?'+new URLSearchParams({provider:'google',query:known?'google:'+known.placeId:q,region:region(searchRegion),locale,...(resolve?{resolve:'1'}:{})}),{cache:'no-store',signal:AbortSignal.timeout(15000)});
 const data=await response.json();if(!response.ok)throw Error('Search and select an accommodation in the departure area.');
 return (data.locations||[]).filter((x:{googlePlaceId?:string;locationSource?:string})=>x.googlePlaceId||x.locationSource==='coordinates').map((x:{id:string;slug:string;name:string;zoneName?:string;googlePlaceId?:string;googleMapsUrl?:string})=>{
  const binding=bindings.bindings.find(b=>b.placeId===x.googlePlaceId),hotel=hotelBuggyLandings.find(h=>normalizeText(h.name)===normalizeText(x.name)||binding&&normalizeText(h.name)===normalizeText(binding.name)),area=hotel?areaForHotel(hotel):null;
  return {id:x.googlePlaceId?'google:'+x.googlePlaceId:x.slug,name:x.name,address:x.zoneName||'',mapsUrl:x.googleMapsUrl||'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:x.name,...(x.googlePlaceId?{query_place_id:x.googlePlaceId}:{})}),...(area?{areaId:area.id,calculatorZone:area.calculatorZone}:{})};
 });
}
export async function verifyGooglePickup(ref:string,searchRegion:PickupRegion,locale='es'){
 const places=await googlePickupLocations(ref,searchRegion,true,locale);if(places.length!==1)throw Error('Choose your exact accommodation from Google.');return places[0];
}
