import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const instrument = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Techruise — Let your business cruise',
    template: '%s — Techruise',
  },
  description:
    'Techruise builds fast, animated, AI-powered websites, intelligent agents and custom software. Premium design, 3D motion and AI built in — let your business cruise.',
};

export const viewport: Viewport = {
  themeColor: '#060A13',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrument.variable} bg-base font-sans text-ink antialiased`}
      >
        {/* Marks JS availability before first paint — gates the intro overlay so
            content is never hidden when scripts are disabled. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        {children}
      </body>
    </html>
  );
}
