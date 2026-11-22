// SEO funnel attribution: which page brought the visitor, and which page they were on when they booked.
// Stored only in the visitor's own browser (first touch 30 days, session landing) and sent with the booking
// so the admin record shows the page that sold. No personal data, only paths and the referring site.
export type Attribution = {
  firstPage?: string;
  firstReferrer?: string;
  firstAt?: string;
  sessionPage?: string;
  sessionReferrer?: string;
  bookingPage?: string;
};

const FIRST_KEY = 'cb_first_touch';
const SESSION_KEY = 'cb_session_landing';
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function clean(value: string) {
  try {
    const url = new URL(value, window.location.origin);
    return (url.origin === window.location.origin ? url.pathname : `${url.hostname}${url.pathname}`).slice(0, 200);
  } catch {
    return '';
  }
}

export function recordLanding() {
  if (typeof window === 'undefined') return;
  const page = clean(window.location.href);
  const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? clean(document.referrer) : '';
  try {
    const stored = JSON.parse(window.localStorage.getItem(FIRST_KEY) || 'null') as { page: string; referrer: string; at: string } | null;
    if (!stored || Date.now() - new Date(stored.at).getTime() > THIRTY_DAYS) {
      window.localStorage.setItem(FIRST_KEY, JSON.stringify({ page, referrer, at: new Date().toISOString() }));
    }
  } catch { /* storage blocked: attribution is optional */ }
  try {
    if (!window.sessionStorage.getItem(SESSION_KEY)) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ page, referrer }));
  } catch { /* storage blocked */ }
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  const out: Attribution = { bookingPage: clean(window.location.href) };
  try {
    const first = JSON.parse(window.localStorage.getItem(FIRST_KEY) || 'null');
    if (first) { out.firstPage = first.page; out.firstReferrer = first.referrer || undefined; out.firstAt = first.at; }
  } catch { /* ignore */ }
  try {
    const session = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || 'null');
    if (session) { out.sessionPage = session.page; out.sessionReferrer = session.referrer || undefined; }
  } catch { /* ignore */ }
  return out;
}
