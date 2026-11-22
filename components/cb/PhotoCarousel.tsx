'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Photo = { src: string; es: string; en: string; width: number; height: number };

/** One large photo at a time, swipe on mobile, arrows on desktop, caption under each photo. */
export default function PhotoCarousel({ photos, locale }: { photos: Photo[]; locale: 'es' | 'en' }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const en = locale === 'en';

  function go(next: number) {
    const el = track.current;
    if (!el) return;
    const target = (next + photos.length) % photos.length;
    const slide = el.children[target] as HTMLElement | undefined;
    if (slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    setIndex(target);
  }

  function onScroll() {
    const el = track.current;
    if (!el) return;
    const width = (el.children[0] as HTMLElement | undefined)?.offsetWidth || 1;
    const current = Math.round(el.scrollLeft / (width + 16));
    if (current !== index) setIndex(Math.max(0, Math.min(photos.length - 1, current)));
  }

  return (
    <div className="cb-carousel" aria-roledescription="carousel" aria-label={en ? 'Real tour photos' : 'Fotos reales del tour'}>
      <div className="cb-carousel-track" ref={track} onScroll={onScroll}>
        {photos.map((p, i) => (
          <figure key={p.src} className="cb-carousel-slide" aria-roledescription="slide" aria-label={`${i + 1} / ${photos.length}`}>
            <Image src={p.src} alt={p[locale]} width={p.width} height={p.height} sizes="(max-width: 760px) 88vw, 760px" loading={i === 0 ? 'eager' : 'lazy'} style={p.height > p.width ? { objectPosition: 'center 12%' } : undefined} />
            <figcaption>{p[locale]}</figcaption>
          </figure>
        ))}
      </div>
      <div className="cb-carousel-bar">
        <button type="button" onClick={() => go(index - 1)} aria-label={en ? 'Previous photo' : 'Foto anterior'}><ChevronLeft size={22} /></button>
        <div className="cb-carousel-dots">
          {photos.map((p, i) => <button type="button" key={p.src} className={i === index ? 'is-on' : ''} onClick={() => go(i)} aria-label={`${en ? 'Photo' : 'Foto'} ${i + 1}`} />)}
        </div>
        <span className="cb-carousel-count">{index + 1} / {photos.length}</span>
        <button type="button" onClick={() => go(index + 1)} aria-label={en ? 'Next photo' : 'Foto siguiente'}><ChevronRight size={22} /></button>
      </div>
    </div>
  );
}
