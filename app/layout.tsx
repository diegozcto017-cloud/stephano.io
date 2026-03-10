import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '@/styles/globals.css';
import Background from '@/components/Background/Background';
import ScrollProgress from '@/components/ScrollProgress/ScrollProgress';
import CookieBanner from '@/components/CookieBanner/CookieBanner';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Stephano',
  url: 'https://stephano.io',
  logo: 'https://stephano.io/logo.png',
  description: 'Ingeniería digital de alto rendimiento. Sistemas web, landing pages de alta conversión, e-commerce premium y automatizaciones estratégicas.',
  priceRange: '$$',
  areaServed: { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: 14.6, longitude: -90.5 }, geoRadius: '10000' },
  sameAs: ['https://linkedin.com/company/stephano', 'https://instagram.com/stephano.io'],
  contactPoint: { '@type': 'ContactPoint', email: 'info@stephano.io', contactType: 'sales', availableLanguage: ['Spanish', 'English'] },
};

export const metadata: Metadata = {
  title: {
    default: 'Stephano.io — Digital Engineering & Premium Systems',
    template: '%s | Stephano.io',
  },
  description:
    'Especialistas en ingeniería digital. Desarrollamos sistemas, landing pages de alta conversión y automatizaciones que escalan tu negocio.',
  keywords: [
    'ingeniería digital',
    'desarrollo de sistemas',
    'proyectos web premium',
    'automatización de negocios',
    'landing pages de alta conversión',
    'software a medida',
    'consultoría tecnológica',
  ],
  authors: [{ name: 'Stephano Team', url: 'https://stephano.io' }],
  creator: 'Stephano',
  publisher: 'Stephano',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Stephano.io — Digital Engineering',
    description: 'Transformamos negocios con sistemas digitales de alto impacto.',
    url: 'https://stephano.io',
    siteName: 'Stephano.io',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stephano.io — Digital Engineering',
    description: 'Sistemas digitales que atraen y convierten.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://stephano.io'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={GeistSans.className} suppressHydrationWarning>
        <ScrollProgress />
        <Background />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
