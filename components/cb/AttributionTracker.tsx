'use client';

import { useEffect } from 'react';
import { recordLanding } from '../../lib/attribution';

export default function AttributionTracker() {
  useEffect(() => { recordLanding(); }, []);
  return null;
}
