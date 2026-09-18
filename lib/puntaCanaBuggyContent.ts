import type { BuggyProduct } from './buggyProducts';

export type BuggyContentLocale = 'es' | 'en';

type ItineraryStep = {
  time: string;
  title: string;
  description: string;
};

export type PuntaCanaBuggyContent = {
  summary: string;
  activityDuration: string;
  totalDuration: string;
  pickup: string;
  included: string[];
  notIncluded: string[];
  requirements: string[];
  bring: string[];
  itinerary: ItineraryStep[];
  faqs: Array<[string, string]>;
  routeHeading: string;
  routeNote: string;
};

const ES: Omit<PuntaCanaBuggyContent, 'summary'> = {
  activityDuration: 'Aproximadamente 2.5-3 horas entre conducción y paradas',
  totalDuration: 'Reserva aproximadamente 4 horas contando recogida y regreso',
  pickup:
    'Incluye transporte compartido desde hoteles y puntos seleccionados de Bávaro, Punta Cana, Cabeza de Toro y Macao. Cap Cana y Uvero Alto pueden tener suplemento. Tras reservar confirmamos por WhatsApp el punto y la hora exactos; algunos hoteles, villas y apartamentos usan un punto cercano.',
  included: [
    'Recogida y regreso compartidos desde las zonas cubiertas',
    'Buggy reservado según modalidad individual, doble o familiar',
    'Combustible durante el recorrido',
    'Guía y acompañamiento del convoy',
    'Orientación de seguridad antes de conducir',
    'Casco y equipo de seguridad requerido',
    'Ruta todoterreno por caminos rurales de Macao',
    'Parada cultural con degustaciones locales del operador',
    'Parada en cueva o cenote y visita a Playa Macao según la ruta confirmada'
  ],
  notIncluded: [
    'Alimentos y bebidas no indicados como incluidos',
    'Pañuelos, gafas, calzado y ropa para la actividad',
    'Toalla y artículos personales',
    'Fotografías y videos profesionales',
    'Recuerdos y compras a vendedores externos',
    'Propinas, que son opcionales',
    'Daños causados por conducción irresponsable o incumplimiento de las instrucciones'
  ],
  requirements: [
    'El conductor debe tener 18 años o más, saber conducir y presentar identificación o licencia válida si el operador la solicita.',
    'Los acompañantes menores deben viajar con un adulto y cumplir la edad y condiciones confirmadas para el vehículo.',
    'No se permite conducir después de consumir alcohol o sustancias que afecten la capacidad.',
    'No se recomienda para embarazadas ni personas con problemas graves de espalda, cuello, corazón o movilidad.',
    'Cada conductor debe permanecer en el convoy, respetar la distancia, la velocidad y las señales del guía.',
    'La ruta puede cambiar por lluvia, inundación, estado del camino, oleaje o instrucciones de seguridad.',
    'El cambio de conductor sólo se realiza con autorización del guía y cuando ambos cumplen los requisitos.'
  ],
  bring: [
    'Ropa cómoda y una muda que pueda mojarse o llenarse de polvo y barro',
    'Calzado cerrado o sandalias seguras que no se desprendan',
    'Gafas protectoras o de sol y pañuelo para el polvo',
    'Protector solar biodegradable',
    'Traje de baño y toalla',
    'Documento de identidad y licencia del conductor si aplica',
    'Funda impermeable para teléfono y objetos personales',
    'Efectivo opcional para fotos, bebidas o recuerdos'
  ],
  itinerary: [
    { time: '30-75 min antes', title: 'Recogida', description: 'Transporte compartido desde el hotel o punto confirmado. La ventana depende de la zona y las demás recogidas.' },
    { time: '10-20 min', title: 'Llegada y registro', description: 'Organización del grupo, comprobación de la reserva y asignación del buggy según la modalidad pagada.' },
    { time: '10-15 min', title: 'Orientación de seguridad', description: 'Explicación del vehículo, casco, reglas del convoy, distancia segura y señales del guía.' },
    { time: '45-75 min acumulados', title: 'Conducción todoterreno', description: 'Ruta guiada por caminos rurales de Macao con polvo, agua o barro según el clima.' },
    { time: '20-30 min', title: 'Parada cultural', description: 'Visita a una casa típica o rancho dominicano para conocer el café, el cacao, el tabaco y la mamajuana, su preparación y las tradiciones locales. Las degustaciones ofrecidas por el operador forman parte de la parada; las compras son opcionales y los productos con alcohol se reservan a los adultos.' },
    { time: '20-30 min', title: 'Cueva o cenote', description: 'La cueva contiene un cenote de agua dulce al que se accede por escaleras. Baja con cuidado y sigue al personal. Bañarse es opcional y depende de las condiciones del lugar; puedes disfrutar la visita sin entrar al agua. No se promete ni se exige realizar saltos.' },
    { time: '20-40 min', title: 'Playa Macao', description: 'Disfruta el paisaje de arena clara y aguas azules de Macao. Puedes caminar por la playa, tomar fotografías o descansar durante la parada. El oleaje puede ser fuerte: el baño depende del estado del mar y de las indicaciones del guía.' },
    { time: 'Variable', title: 'Regreso', description: 'Tramo final al rancho, devolución del equipo y transporte compartido al punto de recogida.' }
  ],
  faqs: [
    ['¿El precio es por persona o por buggy?', 'El precio publicado es por vehículo: individual para 1, doble para 2 o familiar para hasta 4 personas. El resumen de reserva muestra vehículos y total antes del pago.'],
    ['¿Cuánto dura el tour?', 'La conducción y las paradas suelen ocupar unas 2.5-3 horas. Con recogida y regreso, reserva aproximadamente 4 horas; tráfico y zona pueden ampliar el total.'],
    ['¿Necesito licencia para conducir?', 'El conductor debe tener 18 años o más, saber conducir y presentar identificación o licencia válida si el operador la solicita al registrarse.'],
    ['¿Podemos cambiar de conductor?', 'Sólo cuando el guía lo autorice y ambos conductores cumplen los requisitos. El cambio nunca debe hacerse durante la marcha.'],
    ['¿Me voy a ensuciar?', 'Sí. Puede haber polvo, charcos y barro. Usa ropa que pueda ensuciarse y lleva una muda seca.'],
    ['¿Visitamos cenote y Playa Macao?', 'La operación de Punta Cana incluye una parada de agua y Playa Macao. El orden, tiempo y posibilidad de baño pueden cambiar por seguridad y condiciones del día.'],
    ['¿La recogida está incluida?', 'Sí, en las zonas cubiertas. Cap Cana, Uvero Alto y otras áreas pueden tener suplemento, mostrado o confirmado antes de completar la reserva.'],
    ['¿Pueden participar niños?', 'Pueden viajar como acompañantes con un adulto si cumplen la edad y condiciones confirmadas para el buggy. No conducen.'],
    ['¿Qué ocurre si llueve?', 'La actividad puede operar con lluvia ligera. La ruta cambia o se cancela si el camino, una inundación o el clima crean un riesgo.'],
    ['¿Las fotografías están incluidas?', 'No. Los paquetes de fotos y recuerdos son compras opcionales de proveedores externos.']
  ],
  routeHeading: 'Macao: caminos rurales, parada cultural, cueva y playa.',
  routeNote: 'Los tiempos y el orden son orientativos. La seguridad, el clima, el estado del camino y el oleaje pueden modificar la ruta.'
};

const EN: Omit<PuntaCanaBuggyContent, 'summary'> = {
  activityDuration: 'Approximately 2.5-3 hours of driving and stops',
  totalDuration: 'Allow approximately 4 hours including pickup and return',
  pickup: 'Shared transportation is included from selected hotels and meeting points in Bavaro, Punta Cana, Cabeza de Toro and Macao. Cap Cana and Uvero Alto may carry a surcharge. After booking, WhatsApp confirms the exact time and point; some hotels, villas and apartments use a nearby meeting point.',
  included: ['Shared pickup and return from covered areas', 'Reserved single, double or family buggy', 'Fuel during the route', 'Guide and convoy support', 'Safety briefing before driving', 'Helmet and required safety equipment', 'Off-road route through Macao countryside', 'Cultural stop with operator-provided local tastings', 'Cave or cenote stop and Macao Beach visit according to the confirmed route'],
  notIncluded: ['Food and drinks not listed as included', 'Bandana, goggles, footwear and activity clothing', 'Towel and personal items', 'Professional photos and videos', 'Souvenirs and purchases from outside vendors', 'Optional tips', 'Damage caused by irresponsible driving or ignoring instructions'],
  requirements: ['Drivers must be 18 or older, know how to drive and show valid ID or a driver license if requested by the operator.', 'Children ride as passengers with a responsible adult and must meet the confirmed age and vehicle conditions.', 'Driving after consuming alcohol or impairing substances is prohibited.', 'Not recommended for pregnant travelers or people with serious back, neck, heart or mobility conditions.', 'Drivers must stay in the convoy and follow the guide’s distance, speed and signal instructions.', 'The route can change due to rain, flooding, road conditions, surf or safety instructions.', 'Driver changes require guide approval and both drivers must meet all requirements.'],
  bring: ['Comfortable clothes and a change that can get wet, dusty or muddy', 'Closed shoes or secure sandals', 'Protective glasses or sunglasses and a dust bandana', 'Biodegradable sunscreen', 'Swimsuit and towel', 'ID and driver license when applicable', 'Waterproof phone and personal-item pouch', 'Optional cash for photos, drinks or souvenirs'],
  itinerary: [
    { time: '30-75 min before', title: 'Pickup', description: 'Shared transport from the confirmed hotel or meeting point. The window depends on the zone and other pickups.' },
    { time: '10-20 min', title: 'Arrival and check-in', description: 'Reservation check, group organization and buggy assignment for the paid option.' },
    { time: '10-15 min', title: 'Safety briefing', description: 'Vehicle controls, helmet, convoy rules, safe distance and guide signals.' },
    { time: '45-75 min total', title: 'Off-road driving', description: 'Guided route on Macao rural roads with dust, water or mud depending on weather.' },
    { time: '20-30 min', title: 'Cultural stop', description: 'Visit a traditional Dominican home or ranch to learn about coffee, cacao, tobacco and mamajuana, their preparation and local traditions. Operator-provided tastings are part of the stop; purchases are optional and alcoholic products are for adults only.' },
    { time: '20-30 min', title: 'Cave or cenote', description: 'The cave contains a freshwater cenote reached by steps. Take care going down and follow staff instructions. Swimming is optional and depends on site conditions; you can enjoy the visit without entering the water. Jumping is neither promised nor required.' },
    { time: '20-40 min', title: 'Macao Beach', description: 'Enjoy the pale sand and blue water of Macao. Walk along the beach, take photos or relax during the stop. Surf can be strong: swimming depends on sea conditions and guide instructions.' },
    { time: 'Variable', title: 'Return', description: 'Final drive to the ranch, equipment return and shared transportation to the confirmed pickup point.' }
  ],
  faqs: [
    ['Is the price per person or per buggy?', 'The listed price is per vehicle: single for 1, double for 2 or family for up to 4 guests. The booking summary shows vehicles and total before payment.'],
    ['How long does the tour take?', 'Driving and stops normally take 2.5-3 hours. Allow about 4 hours with pickup and return; traffic and zone can extend the total.'],
    ['Do I need a driver license?', 'Drivers must be 18 or older, know how to drive and show valid ID or a driver license if the operator requests it at check-in.'],
    ['Can we change drivers?', 'Only with guide approval and when both drivers meet the requirements. Never change drivers while the buggy is moving.'],
    ['Will I get dirty?', 'Yes. Expect dust, puddles and mud. Wear clothes that can get dirty and bring a dry change.'],
    ['Do we visit a cenote and Macao Beach?', 'The Punta Cana operation includes a water stop and Macao Beach. Order, duration and swimming may change for safety and daily conditions.'],
    ['Is pickup included?', 'Yes in covered zones. Cap Cana, Uvero Alto and other areas may have a surcharge shown or confirmed before completing the booking.'],
    ['Can children participate?', 'Children may ride as passengers with a responsible adult when they meet the confirmed age and buggy conditions. They do not drive.'],
    ['What happens if it rains?', 'The activity may run in light rain. The route changes or cancels if roads, flooding or weather create a safety risk.'],
    ['Are photos included?', 'No. Photo packages and souvenirs are optional purchases from outside providers.']
  ],
  routeHeading: 'Macao countryside, cultural stop, cave and beach.',
  routeNote: 'Times and order are approximate. Safety, weather, road conditions and surf may change the route.'
};

export function getPuntaCanaBuggyContent(product: BuggyProduct, locale: BuggyContentLocale): PuntaCanaBuggyContent {
  const base = locale === 'en' ? EN : ES;
  const summary = locale === 'en'
    ? `${product.title} is the ${product.capacityLabel.toLowerCase()} option for the same guided Punta Cana route. After pickup and a safety briefing, drive in convoy through Macao countryside, stop for Dominican culture and tastings, cool down at the cave or cenote, and continue to Macao Beach before returning to the ranch and hotel.`
    : `${product.title} es la modalidad para ${product.capacityLabel.toLowerCase()} dentro de la misma ruta guiada de Punta Cana. Después de la recogida y la orientación de seguridad, conducirás en convoy por el campo de Macao, visitarás una parada cultural con degustaciones, la cueva o cenote y Playa Macao antes de regresar al rancho y al hotel.`;
  return { ...base, summary };
}
