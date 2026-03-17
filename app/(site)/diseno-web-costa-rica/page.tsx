import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

export const metadata: Metadata = {
  title: 'Diseño Web Costa Rica — Sitios que Convierten | Stephano.io',
  description: 'Diseño web profesional en Costa Rica. Creamos sitios modernos, rápidos y optimizados que convierten visitas en clientes reales. Desde $350 USD.',
  keywords: [
    'diseño web costa rica',
    'desarrollo web costa rica',
    'agencia web costa rica',
    'paginas web costa rica',
    'diseño web profesional',
    'crear pagina web costa rica',
  ],
  alternates: { canonical: 'https://stephano.io/diseno-web-costa-rica' },
  openGraph: {
    title: 'Diseño Web en Costa Rica que Convierte Visitas en Clientes',
    description: 'Diseño web profesional en Costa Rica. Sitios modernos, rápidos y optimizados. Desde $350 USD.',
    url: 'https://stephano.io/diseno-web-costa-rica',
    siteName: 'Stephano.io',
    locale: 'es_CR',
    type: 'website',
  },
};

export default function DisenoWebCostaRica() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '140px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section__label">Agencia Web #1 Costa Rica</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '16px', marginBottom: '24px', color: '#fff' }}>
            Diseño Web en Costa Rica que Convierte<br />Visitas en Clientes
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Creamos sitios web modernos, rápidos y diseñados para vender. No solo diseño bonito —
            arquitectura digital que genera leads, credibilidad y ventas reales para tu negocio en Costa Rica.
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
              <div className={styles.cardIcon}>⚡</div>
              <h3 className={styles.cardTitle}>Velocidad real</h3>
              <p className={styles.cardDesc}>
                Sitios con Core Web Vitals en verde. Carga en menos de 2 segundos en móvil y desktop.
                Google premia la velocidad — nosotros la entregamos.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>📈</div>
              <h3 className={styles.cardTitle}>Diseño orientado a resultados</h3>
              <p className={styles.cardDesc}>
                Cada sección, cada botón y cada texto está pensado para convertir. No hacemos arte —
                hacemos herramientas de ventas digitales para tu empresa costarricense.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>🇨🇷</div>
              <h3 className={styles.cardTitle}>Somos locales</h3>
              <p className={styles.cardDesc}>
                Entendemos el mercado costarricense. Horario local, comunicación en español y facturas
                válidas en Costa Rica. Soporte real sin intermediarios.
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
                <li>Optimización SEO básica</li>
                <li>Formulario de contacto</li>
                <li>Adaptable a móvil</li>
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
                <li>SEO on-page completo</li>
                <li>Blog integrado</li>
                <li>Panel de administración</li>
                <li>Entrega en 10–14 días</li>
              </ul>
              <Link href="/cotizar" className={glass.btnPrimary}>Cotizar</Link>
            </div>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>E-commerce</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$1,200</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>Catálogo de productos</li>
                <li>Carrito y checkout</li>
                <li>Pasarela de pagos</li>
                <li>Panel de pedidos</li>
                <li>Entrega en 21–30 días</li>
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
                q: '¿Cuánto tarda en estar lista mi página web?',
                a: 'Depende del tipo de proyecto. Una landing page tarda entre 5 y 7 días hábiles. Un sitio corporativo entre 10 y 14 días. Proyectos más complejos como e-commerce o web apps tienen un timeline personalizado.',
              },
              {
                q: '¿El precio incluye el hosting y dominio?',
                a: 'El presupuesto cubre el diseño y desarrollo. Hosting y dominio se cotizan por separado según tus necesidades, o puedes usar tu proveedor actual. Te asesoramos sin costo adicional.',
              },
              {
                q: '¿Puedo actualizar el contenido yo mismo?',
                a: 'Sí. Todos los sitios corporativos incluyen un panel de administración intuitivo. No necesitas saber programar para actualizar textos, imágenes o agregar entradas de blog.',
              },
              {
                q: '¿Trabajan con empresas fuera de San José?',
                a: 'Absolutamente. Atendemos clientes en todo Costa Rica — Heredia, Alajuela, Cartago, Liberia, Pérez Zeledón y más. Todo el proceso es 100% remoto y sin costo adicional por ubicación.',
              },
              {
                q: '¿Qué pasa si necesito cambios después de la entrega?',
                a: 'Incluimos un período de ajustes post-entrega. También ofrecemos planes de mantenimiento mensual desde $100 USD que incluyen actualizaciones, backups y soporte prioritario.',
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
