import HomePage, { buildHomeSchema } from '../../components/HomePage';
import { siteUrl } from '../../lib/buggyProducts';

export const metadata = {
  alternates: {
    canonical: siteUrl,
    languages: { en: `${siteUrl}/en`, es: siteUrl, 'x-default': siteUrl },
  },
};

const schema = buildHomeSchema('es');

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <HomePage locale="es" />
    </>
  );
}
