'use client';

import dynamic from 'next/dynamic';

// The study runs entirely in the browser (localStorage, wouter), so skip SSR.
const App = dynamic(() => import('~/App'), { ssr: false });

export default function ClientApp() {
  return <App />;
}
