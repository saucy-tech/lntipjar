'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to prevent hydration errors with window object
const TipJar = dynamic(() => import('./TipJar'), { ssr: false });

export default function TipJarWrapper() {
  return <TipJar />;
}