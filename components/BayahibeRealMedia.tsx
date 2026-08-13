import Image from 'next/image';
import { Camera, PlayCircle } from 'lucide-react';

const photos = [
  '/buggy/bayahibe/buggy-lodo-bayahibe.jpg',
  '/buggy/bayahibe/convoy-lodo-bayahibe.jpg',
  '/buggy/bayahibe/buggy-canaveral-bayahibe.jpg',
  '/buggy/bayahibe/parada-cana-azucar-bayahibe.jpg',
  '/buggy/bayahibe/viajeros-buggy-bayahibe.jpg',
  '/buggy/bayahibe/rio-chavon-bayahibe.jpg',
];

export default function BayahibeRealMedia({ locale }: { locale: 'es' | 'en' }) {
  const isEn = locale === 'en';
  return (
    <section className="section bayahibe-real-media" aria-labelledby="bayahibe-real-media-title">
      <div className="wrap section-head">
        <span className="kicker"><Camera size={16} /> {isEn ? 'Real Bayahibe tour' : 'Tour real de Bayahibe'}</span>
        <h2 id="bayahibe-real-media-title">{isEn ? 'See the actual buggies, mud and route.' : 'Mira los buggies, el lodo y la ruta reales.'}</h2>
        <p>{isEn ? 'Original footage from the Bayahibe and La Romana operation—not stock images from another destination.' : 'Material original de la operación de Bayahibe y La Romana, no imágenes genéricas de otro destino.'}</p>
      </div>
      <div className="wrap bayahibe-media-video">
        <div><span><PlayCircle size={18} /> {isEn ? '47-second real preview' : 'Vista real de 47 segundos'}</span><b>{isEn ? 'Bayahibe buggy experience' : 'Experiencia buggy Bayahibe'}</b></div>
        <video controls playsInline preload="metadata" poster={photos[0]}>
          <source src="/buggy/bayahibe/tour-buggy-bayahibe.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="wrap bayahibe-real-gallery">
        {photos.map((photo, index) => (
          <Image key={photo} src={photo} alt={isEn ? `Real Bayahibe buggy tour photo ${index + 1}` : `Foto real del tour en buggy de Bayahibe ${index + 1}`} width={1280} height={854} sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw" />
        ))}
      </div>
    </section>
  );
}
