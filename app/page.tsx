import HomePage, { buildHomeSchema } from '../components/HomePage';

const schema = buildHomeSchema('es');

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <HomePage locale="es" />
    </>
  );
}
