import { products } from '../lib/buggyProducts';

export default function VehicleComparison({locale}:{locale:'es'|'en'}){
  const en=locale==='en';
  return <section className="section vehicle-comparison"><div className="wrap">
    <span className="kicker">{en?'PRICE BY VEHICLE':'PRECIO POR VEHÍCULO'}</span>
    <h2>{en?'Compare single, double and family buggy prices':'Compara precios de buggy individual, doble y familiar'}</h2>
    <p>{en?'Choose your destination first: Punta Cana visits the Macao trails, cenote and beach; Bayahibe has its own countryside and Chavón River route. They are separate excursions.':'Elige primero el destino: Punta Cana recorre Macao, cenote y playa; Bayahibe tiene su propia ruta rural y río Chavón. Son excursiones distintas.'}</p>
    <div className="buyer-table-scroll"><table><thead><tr><th scope="col">{en?'Destination / vehicle':'Destino / vehículo'}</th><th scope="col">{en?'Seats':'Plazas'}</th><th scope="col">{en?'Total USD':'Total USD'}</th><th scope="col">{en?'Reserve':'Reservar'}</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><th scope="row">{p.id.startsWith('bayahibe-')?'Bayahibe':'Punta Cana'} · {en?(p.capacityNumber===1?'Single':p.capacityNumber===2?'Double':'Family'):(p.capacityNumber===1?'Individual':p.capacityNumber===2?'Doble':'Familiar')}</th><td>{p.capacityNumber}</td><td>US${p.promo}</td><td><a href={`${en?'/en':''}/buggy/${p.id}`}>{en?'View this buggy':'Ver este buggy'} →</a></td></tr>)}</tbody></table></div>
    <h3>{en?'Five guests: select the vehicles you actually want':'Cinco pasajeros: elige los vehículos que quieres'}</h3>
    <p>{en?'In Punta Cana, five single buggies cost US$250. Two doubles and one single cost US$170. One family and one single also cost US$170. Empty seats do not reduce the vehicle price. Confirm your quantities and enough seats for everyone before paying; the system never silently changes your selection.':'En Punta Cana, cinco individuales cuestan US$250. Dos dobles y un individual cuestan US$170. Un familiar y un individual también suman US$170. Las plazas vacías no reducen el precio del vehículo. Confirma las cantidades y plazas para todos antes de pagar; el sistema nunca cambia tu selección sin avisarte.'}</p>
    <a className="faq-all-link" href={en?'/en/guides/single-vs-double-vs-family-buggy':'/guias/buggy-individual-doble-familiar-comparar'}>{en?'Read the vehicle comparison guide':'Leer la guía para elegir vehículo'} →</a>
  </div></section>;
}
