import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

export const metadata: Metadata = {
  title: 'Landing Pages Costa Rica — Alta Conversión | Stephano.io',
  description: 'Landing pages de alta conversión en Costa Rica. Diseñadas para capturar leads y vender. Desde $350 USD. Entrega en 5–7 días. ROI medible.',
  keywords: [
    'landing page costa rica',
    'pagina de aterrizaje costa rica',
    'landing page conversion',
    'diseño landing page',
    'pagina de ventas costa rica',
    'crear landing page costa rica',
  ],
  alternates: { canonical: 'https://stephano.io/landing-page-costa-rica' },
  openGraph: {
    title: 'Landing Pages de Alta Conversión en Costa Rica',
    description: 'Landing pages diseñadas para convertir. Captura leads y vende más desde el día uno. Desde $350 USD.',
    url: 'https://stephano.io/landing-page-costa-rica',
    siteName: 'Stephano.io',
    locale: 'es_CR',
    type: 'website',
  },
};

export default function LandingPageCostaRica() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '140px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section__label">Desde $350 USD</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '16px', marginBottom: '24px', color: '#fff' }}>
            Landing Pages de Alta Conversión<br />en Costa Rica
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Una landing page bien construida puede duplicar o triplicar tus ventas.
            Diseñamos páginas enfocadas en un solo objetivo: que el visitante tome acción — compre, llame o deje sus datos.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cotizar" className={glass.btnPrimary}>Solicitar Presupuesto Gratis</Link>
            <Link href="/servicios" className={glass.btnGlass}>Ver Servicios →</Link>
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
              <div className={styles.cardIcon}>🎯</div>
              <h3 className={styles.cardTitle}>Un objetivo, una página</h3>
              <p className={styles.cardDesc}>
                Cada landing page tiene un solo llamado a la acción. Sin distracciones, sin menú, sin fugas.
                El usuario entra y solo tiene una decisión: convertir.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>🔬</div>
              <h3 className={styles.cardTitle}>Basado en datos</h3>
              <p className={styles.cardDesc}>
                Integramos Google Analytics, Meta Pixel y herramientas de heatmap para que veas exactamente
                qué funciona. Decisiones con datos, no intuición.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>🚀</div>
              <h3 className={styles.cardTitle}>Lista para anuncios</h3>
              <p className={styles.cardDesc}>
                Nuestras landing pages están optimizadas para campañas de Google Ads y Meta Ads.
                Quality Score alto, menor costo por clic y mejor retorno de inversión.
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
              <h3 className={styles.pricingTitle}>Landing Básica</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$350</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>1 página completa</li>
                <li>Formulario de captura</li>
                <li>Diseño mobile-first</li>
                <li>SEO básico</li>
                <li>Entrega en 5 días</li>
              </ul>
              <Link href="/cotizar" className={glass.btnGlass}>Cotizar</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingFeatured}`}>
              <span className={styles.pricingBadge}>Recomendado</span>
              <h3 className={styles.pricingTitle}>Landing Premium</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$550</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>Copy persuasivo incluido</li>
                <li>Secciones de prueba social</li>
                <li>Video hero o animaciones</li>
                <li>Pixel y Analytics</li>
                <li>A/B testing setup</li>
              </ul>
              <Link href="/cotizar" className={glass.btnPrimary}>Cotizar</Link>
            </div>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>Landing + Ads</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$850</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>Landing premium</li>
                <li>Campaña Google o Meta</li>
                <li>Configuración de audiencias</li>
                <li>Primer mes de optimización</li>
                <li>Reporte mensual de resultados</li>
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
                q: '¿Qué diferencia hay entre una landing page y un sitio web normal?',
                a: 'Un sitio web tiene múltiples páginas y múltiples objetivos. Una landing page está diseñada para una sola campaña y un solo objetivo de conversión. Elimina distracciones y guía al visitante hacia una única acción: comprar, registrarse o contactarte.',
              },
              {
                q: '¿En cuánto tiempo puedo tener mi landing page lista?',
                a: 'La landing básica está lista en 5 días hábiles. La versión premium con copy y animaciones puede tomar hasta 8 días. Si tienes urgencia, contáctanos por WhatsApp para evaluar tiempos acelerados.',
              },
              {
                q: '¿Funciona para cualquier tipo de negocio?',
                a: 'Sí. Hemos creado landing pages para clínicas dentales, academias de idiomas, constructoras, restaurantes, coaches y tiendas. Si tienes algo que ofrecer, una landing bien diseñada puede ayudarte a vendero.',
              },
              {
                q: '¿Puedo conectarla a mis campañas de Facebook o Google?',
                a: 'Absolutamente. Todas las landing pages incluyen integración de Meta Pixel, Google Tag Manager y Google Analytics. También podemos conectar formularios a tu CRM o enviar leads directo a tu WhatsApp.',
              },
              {
                q: '¿Ofrecen mantenimiento o actualizaciones?',
                a: 'Sí. Tenemos un plan de mantenimiento desde $100 USD/mes que incluye actualizaciones de contenido, monitoreo de velocidad y soporte técnico prioritario.',
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
