'use client';

import FunnelOffer from './FunnelOffer';

/** Home hero calculator: the first step of the funnel. */
export default function QuickQuote({ locale }: { locale: 'es' | 'en' }) {
  return <FunnelOffer locale={locale} title={locale === 'en' ? 'Check your price' : 'Calcula tu precio'} source={{ pageType: 'home', slug: locale }} />;
}
