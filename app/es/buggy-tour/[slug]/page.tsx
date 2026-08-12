import { notFound } from 'next/navigation';
import HotelBuggyTourPage from '../../../../components/HotelBuggyTourPage';
import { siteUrl } from '../../../../lib/buggyProducts';
import {
  getHotelBuggyLanding,
  hotelBuggyLandings,
  hotelBuggyUrl,
} from '../../../../lib/hotelBuggyLandings';
import { buildHotelBuggyJsonLd, getHotelBuggySeoCopy } from '../../../../lib/hotelBuggySeo';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return hotelBuggyLandings.map((hotel) => ({ slug: hotel.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const hotel = getHotelBuggyLanding(slug);
  if (!hotel) return {};

  const canonical = hotelBuggyUrl(hotel.slug, 'es');
  const copy = getHotelBuggySeoCopy(hotel, 'es');

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        es: canonical,
        en: hotelBuggyUrl(hotel.slug, 'en'),
        'x-default': canonical,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: canonical,
      images: [`${siteUrl}/buggy/doble.jpeg`],
    },
  };
}

export default async function SpanishHotelBuggyTourPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = getHotelBuggyLanding(slug);
  if (!hotel) notFound();

  const canonical = hotelBuggyUrl(hotel.slug, 'es');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHotelBuggyJsonLd(hotel, 'es')) }}
      />
      <HotelBuggyTourPage hotel={hotel} canonical={canonical} locale="es" />
    </>
  );
}
