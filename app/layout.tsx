import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '@/styles/globals.css';
import Background from '@/components/Background/Background';
import ScrollProgress from '@/components/ScrollProgress/ScrollProgress';
import CookieBanner from '@/components/CookieBanner/CookieBanner';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  name: 'Stephano.io',
  url: 'https://stephano.io',
  logo: 'https://stephano.io/icon.png',
  description: 'Agencia de desarrollo web premium en Costa Rica. Creamos landing pages de alta conversión, tiendas en línea, sistemas CRM y automatizaciones para empresas costarricenses.',
  priceRange: '$$',
  telephone: '+50671164454',
  email: 'info@stephano.io',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'San José',
    addressRegion: 'San José',
    addressCountry: 'CR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 9.9281,
    longitude: -84.0907,
  },
  areaServed: { '@type': 'Country', name: 'Costa Rica' },
  openingHours: 'Mo-Fr 08:00-18:00',
  sameAs: ['https://wa.me/50671164454', 'https://instagram.com/stephano.io'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+50671164454',
    contactType: 'sales',
    availableLanguage: ['Spanish', 'English'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Desarrollo Web Costa Rica',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Landing Page Costa Rica', description: 'Landing pages de alta conversión desde $350 USD' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tienda en Línea Costa Rica', description: 'E-commerce premium desde $1,200 USD' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sistema CRM Costa Rica', description: 'Sistemas CRM y Web Apps a medida desde $1,500 USD' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automatización Empresarial', description: 'Automatizaciones y flujos digitales desde $500 USD' } },
    ],
  },
};

export const metadata: Metadata = {
  title: {
    default: 'Stephano.io — Digital Engineering & Premium Systems',
    template: '%s | Stephano.io',
  },
  description:
    'Especialistas en ingeniería digital. Desarrollamos sistemas, landing pages de alta conversión y automatizaciones que escalan tu negocio.',
  keywords: [
    'agencia web Costa Rica',
    'desarrollo web Costa Rica',
    'diseño web San José Costa Rica',
    'landing page Costa Rica',
    'tienda en línea Costa Rica',
    'e-commerce Costa Rica',
    'sistema CRM Costa Rica',
    'automatización empresas Costa Rica',
    'sitio web empresas costarricenses',
    'agencia digital Costa Rica',
    'aplicaciones web Costa Rica',
    'software a medida Costa Rica',
    'ingeniería digital',
    'landing pages de alta conversión',
    'consultoría tecnológica Costa Rica',
    'Stephano.io',
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
    title: 'Stephano.io — Agencia Web #1 en Costa Rica',
    description: 'Desarrollamos landing pages, e-commerce, sistemas CRM y automatizaciones para empresas en Costa Rica. Desde $350 USD.',
    url: 'https://stephano.io',
    siteName: 'Stephano.io',
    locale: 'es_CR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stephano.io — Agencia Web Costa Rica',
    description: 'Landing pages, e-commerce y sistemas digitales que hacen crecer tu negocio en Costa Rica.',
  },
  alternates: {
    canonical: 'https://stephano.io',
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
