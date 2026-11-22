import type { Metadata } from 'next';
import HotelsDirectory, { hotelsDirectoryMeta } from '../../../components/cb/HotelsDirectory';

export function generateMetadata(): Metadata {
  const meta = hotelsDirectoryMeta('en');
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: meta.canonical, languages: meta.languages },
    openGraph: { title: meta.title, description: meta.description, url: meta.canonical, siteName: 'Caribbean Buggy', images: ['/buggy/galeria/buggy-azul-charco-punta-cana.webp'], type: 'website' },
  };
}

export default function Page() {
  return <HotelsDirectory locale="en" />;
}
