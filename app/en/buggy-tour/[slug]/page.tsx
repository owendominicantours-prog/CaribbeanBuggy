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

  const canonical = hotelBuggyUrl(hotel.slug, 'en');
  const copy = getHotelBuggySeoCopy(hotel, 'en');

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        es: hotelBuggyUrl(hotel.slug, 'es'),
        'x-default': hotelBuggyUrl(hotel.slug, 'es'),
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

export default async function EnglishHotelBuggyTourPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = getHotelBuggyLanding(slug);
  if (!hotel) notFound();

  const canonical = hotelBuggyUrl(hotel.slug, 'en');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHotelBuggyJsonLd(hotel, 'en')) }}
      />
      <HotelBuggyTourPage hotel={hotel} canonical={canonical} locale="en" />
    </>
  );
}
