import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

export const metadata: Metadata = {
  title: 'Desarrollo Web Heredia Costa Rica — Sitios que Generan Negocio | Stephano.io',
  description: 'Desarrollo web profesional en Heredia, Costa Rica. Sitios modernos para empresas en Santo Domingo, San Pablo, Belén y toda la provincia. Desde $350 USD.',
  keywords: [
    'desarrollo web heredia',
    'diseño web heredia costa rica',
    'pagina web heredia',
    'agencia web heredia',
    'crear pagina web heredia',
    'web heredia costa rica',
  ],
  alternates: { canonical: 'https://stephano.io/desarrollo-web-heredia' },
  openGraph: {
    title: 'Desarrollo Web en Heredia — Sitios que Generan Negocio',
    description: 'Diseño y desarrollo web para empresas en Heredia. Santo Domingo, San Pablo, Belén y toda la provincia. Desde $350 USD.',
    url: 'https://stephano.io/desarrollo-web-heredia',
    siteName: 'Stephano.io',
    locale: 'es_CR',
    type: 'website',
  },
};

export default function DesarrolloWebHeredia() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '140px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section__label">Heredia · Costa Rica</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '16px', marginBottom: '24px', color: '#fff' }}>
            Desarrollo Web en Heredia —<br />Sitios que Generan Negocio
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Heredia es una de las provincias con mayor crecimiento empresarial de Costa Rica.
            Diseñamos sitios web que posicionan tu negocio local online y te traen clientes de forma consistente.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cotizar" className={glass.btnPrimary}>Solicitar Presupuesto Gratis</Link>
            <Link href="/servicios" className={glass.btnGlass}>Ver Servicios →</Link>
          </div>
        </div>
      </section>

      {/* Zones */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Cobertura provincial</span>
            <h2 className="section__title">Toda Heredia, un solo equipo</h2>
          </div>
          <div className={styles.cardGrid}>
            {[
              { icon: '🏫', title: 'Heredia Centro y Santo Domingo', desc: 'El corazón universitario y comercial de la provincia. Ideal para negocios que buscan proyección regional y nacional.' },
              { icon: '🏭', title: 'Belén y La Ribera', desc: 'Zona de zonas francas y empresas tecnológicas. Desarrollamos plataformas web robustas para empresas del sector industrial y tech.' },
              { icon: '🌳', title: 'San Pablo, Barva y Santa Bárbara', desc: 'Comunidades en crecimiento con gran potencial. Negocios de servicios, comercios locales y emprendimientos que necesitan presencia digital.' },
            ].map((z, i) => (
              <div key={i} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
                <div className={styles.cardIcon}>{z.icon}</div>
                <h3 className={styles.cardTitle}>{z.title}</h3>
                <p className={styles.cardDesc}>{z.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__label">¿Por qué Stephano.io?</span>
            <h2 className="section__title">Lo que nos hace diferentes</h2>
          </div>
          <div className={styles.cardGrid}>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>🌐</div>
              <h3 className={styles.cardTitle}>SEO local en Heredia</h3>
              <p className={styles.cardDesc}>
                Optimizamos tu sitio para que aparezca cuando alguien busca tu servicio en Heredia en Google.
                Perfil de Google Business, keywords locales y contenido geoetiquetado.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>📅</div>
              <h3 className={styles.cardTitle}>Entrega en tiempo real</h3>
              <p className={styles.cardDesc}>
                Sabemos que tu tiempo vale. Cumplimos los plazos acordados con actualizaciones semanales del
                progreso. Sin excusas, sin retrasos injustificados.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>💬</div>
              <h3 className={styles.cardTitle}>Soporte en español</h3>
              <p className={styles.cardDesc}>
                Comunicación directa por WhatsApp, correo o videollamada en español. Sin barreras de idioma
                ni diferencia horaria. Somos costarricenses hablando con costarricenses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Precios transparentes</span>
            <h2 className="section__title">Inversión clara desde el inicio</h2>
          </div>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>Landing Page</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$350</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>Diseño personalizado</li>
                <li>SEO local Heredia</li>
                <li>Formulario de contacto</li>
                <li>Google Maps integrado</li>
                <li>Entrega en 5–7 días</li>
              </ul>
              <Link href="/cotizar" className={glass.btnGlass}>Cotizar</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingFeatured}`}>
              <span className={styles.pricingBadge}>Más popular</span>
              <h3 className={styles.pricingTitle}>Sitio Corporativo</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$450</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>Hasta 8 páginas</li>
                <li>Blog y noticias</li>
                <li>SEO on-page completo</li>
                <li>Panel de administración</li>
                <li>Entrega en 10–14 días</li>
              </ul>
              <Link href="/cotizar" className={glass.btnPrimary}>Cotizar</Link>
            </div>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>Web App / CRM</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$1,500</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>Sistema a medida</li>
                <li>Autenticación de usuarios</li>
                <li>Dashboard de reportes</li>
                <li>API integrada</li>
                <li>Escalable a futuro</li>
              </ul>
              <Link href="/cotizar" className={glass.btnGlass}>Cotizar</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: '760px' }}>
          <div className="section__header">
            <h2 className="section__title">Preguntas frecuentes</h2>
          </div>
          <div className={styles.faqList}>
            {[
              {
                q: '¿Trabajan solo con empresas grandes en Heredia?',
                a: 'No. Atendemos desde emprendedores y pymes hasta empresas medianas. El tamaño no importa — lo que importa es que tengas un objetivo claro y ganas de crecer digitalmente.',
              },
              {
                q: '¿Pueden ayudarme a aparecer en Google Maps en Heredia?',
                a: 'Sí. Configuramos o optimizamos tu perfil de Google Business Profile para que aparezcas en el mapa cuando alguien busca tu servicio cerca de tu ubicación en Heredia.',
              },
              {
                q: '¿Ofrecen reuniones presenciales en Heredia?',
                a: 'Trabajamos principalmente de forma remota, pero podemos coordinar reuniones presenciales en la zona bajo previa coordinación. La mayoría de proyectos avanza perfectamente por videollamada.',
              },
              {
                q: '¿Cuánto tarda en verse resultados de SEO?',
                a: 'El SEO técnico del sitio es inmediato — el sitio estará indexado y optimizado desde el lanzamiento. Los resultados de posicionamiento orgánico se notan entre 30 y 90 días, dependiendo de la competencia en tu nicho.',
              },
              {
                q: '¿Pueden integrar WhatsApp Business en mi sitio?',
                a: 'Sí. Integramos botón flotante de WhatsApp, formularios que envían mensajes al WhatsApp Business y automatizaciones para respuesta inmediata a consultas desde el sitio.',
              },
            ].map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <div style={{ padding: '20px 24px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.q}</div>
                <div className={styles.faqAnswer}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Empieza hoy, resultados en semanas
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Sin contratos largos. Sin sorpresas. Resultados garantizados.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cotizar" className={glass.btnPrimary}>Cotizar mi proyecto ahora →</Link>
            <a href="https://wa.me/50671164454" target="_blank" rel="noopener noreferrer" className={glass.btnGlass}>
              WhatsApp: +506 7116-4454
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
