'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function textOf(element: HTMLElement) {
  return element.dataset.trackLabel || element.textContent?.replace(/\s+/g, ' ').trim() || undefined;
}

export default function AnalyticsEvents() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const element = (event.target as Element | null)?.closest<HTMLElement>('a, button');
      if (!element) return;

      const href = element instanceof HTMLAnchorElement ? element.href : undefined;
      const explicitEvent = element.dataset.trackEvent;
      const isWhatsApp = href?.includes('wa.me/');
      const isProduct = element.closest('.product-card, .related-grid, .tour-related');
      const isHotel = element.closest('.hotel-link-grid');
      const opensBooking = element.matches('.header-cta, .detail-floating-cta, .tour-photo-count, .tour-price-card a');

      const eventName = explicitEvent
        || (isWhatsApp ? 'whatsapp_click' : undefined)
        || (isProduct ? 'product_click' : undefined)
        || (isHotel ? 'hotel_landing_click' : undefined)
        || (opensBooking ? 'booking_cta_click' : undefined);

      if (!eventName) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        link_text: textOf(element),
        link_url: href,
        location: element.dataset.trackLocation || element.closest('header, section, footer')?.className || 'page',
        product_id: element.dataset.productId,
        hotel_slug: element.dataset.hotelSlug,
        page_path: window.location.pathname,
        page_language: window.location.pathname.startsWith('/en') ? 'en' : 'es',
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
