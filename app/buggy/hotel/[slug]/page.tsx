import { notFound, permanentRedirect } from 'next/navigation';
import {
  getHotelBuggyLanding,
  hotelBuggyLandings,
  hotelBuggyPath,
} from '../../../../lib/hotelBuggyLandings';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return hotelBuggyLandings.map((hotel) => ({ slug: hotel.slug }));
}

export default async function LegacyHotelBuggyPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = getHotelBuggyLanding(slug);
  if (!hotel) notFound();

  permanentRedirect(hotelBuggyPath(hotel.slug, 'es'));
}
