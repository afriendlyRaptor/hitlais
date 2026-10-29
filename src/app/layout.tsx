import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'HITLAIS',
  description: 'Human-in-the-loop sentence selection for AI-generated summaries',
  icons: { icon: '/icon.png' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <body>{children}</body>
    </html>
  );
}
