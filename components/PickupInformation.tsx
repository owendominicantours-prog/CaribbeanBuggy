import { pickupPolicy, type PickupLocale } from "../lib/pickupPolicy";

export function PickupInformation({ locale, compact = false }: { locale: PickupLocale; compact?: boolean }) {
  const t = pickupPolicy[locale];
  if (compact) return <div className="pickup-policy-note"><strong>{t.coverage}</strong><p>{t.meeting}</p><small>{t.other}</small></div>;
  return <section className="pickup-policy" aria-label={t.title}>
    <h2>{t.title}</h2><p className="pickup-policy-lead">{t.coverage}</p>
    <ul className="pickup-policy-zones" aria-label={t.title}>{t.zones.map(zone => <li key={zone}>{zone}</li>)}</ul>
    <p>{t.clarify}</p><div className="pickup-policy-meeting"><strong>KFC · Downtown · Coco Bongo</strong><p>{t.meeting}</p></div>
    <div className="pickup-policy-grid"><div><h3>{t.includedTitle}</h3><ul>{t.items.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3>{t.excludedTitle}</h3><p>{t.excluded}</p></div></div>
    <p className="pickup-policy-timing">{t.timing}</p><small>{t.other}</small>
  </section>;
}
