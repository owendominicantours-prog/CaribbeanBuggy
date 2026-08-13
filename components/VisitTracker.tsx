'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const visitorKey = 'caribbean_buggy_visitor';

function visitorId() {
  try {
    const existing = localStorage.getItem(visitorKey);
    if (existing) return existing;
    const created = crypto.randomUUID();
    localStorage.setItem(visitorKey, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

export default function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) return;
    fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, visitorId: visitorId() }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);
  return null;
}
