type LanguageSwitchProps = {
  current: 'es' | 'en';
  esHref: string;
  enHref: string;
};

export default function LanguageSwitch({ current, esHref, enHref }: LanguageSwitchProps) {
  return (
    <nav className="language-switch" aria-label="Cambiar idioma">
      <a className={current === 'es' ? 'active' : ''} href={esHref}>ES</a>
      <a className={current === 'en' ? 'active' : ''} href={enHref}>EN</a>
    </nav>
  );
}
