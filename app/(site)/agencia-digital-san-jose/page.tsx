import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

export const metadata: Metadata = {
  title: 'Agencia Digital San José Costa Rica — Stephano.io',
  description: 'Agencia digital en San José, Costa Rica. Diseño web, e-commerce y marketing digital para empresas en Escazú, Santa Ana, Sabana, Curridabat y más. Resultados reales.',
  keywords: [
    'agencia digital san jose costa rica',
    'agencia web san jose',
    'diseño web san jose',
    'marketing digital san jose',
    'agencia digital escazu',
    'agencia web costa rica',
  ],
  alternates: { canonical: 'https://stephano.io/agencia-digital-san-jose' },
  openGraph: {
    title: 'Agencia Digital en San José, Costa Rica',
    description: 'Diseño web y marketing digital para empresas en San José. Escazú, Santa Ana, Sabana, Curridabat y toda la GAM.',
    url: 'https://stephano.io/agencia-digital-san-jose',
    siteName: 'Stephano.io',
    locale: 'es_CR',
    type: 'website',
  },
};

export default function AgenciaDigitalSanJose() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '140px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section__label">San José · Costa Rica</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '16px', marginBottom: '24px', color: '#fff' }}>
            Agencia Digital en San José,<br />Costa Rica
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Somos la agencia digital de referencia en la Gran Área Metropolitana. Diseño web, e-commerce,
            landing pages y marketing digital para empresas en Escazú, Santa Ana, Sabana, Curridabat y todo San José.
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
            <span className="section__label">Cobertura local</span>
            <h2 className="section__title">Atendemos toda la GAM</h2>
          </div>
          <div className={styles.cardGrid}>
            {[
              { icon: '🏙️', title: 'Escazú y Santa Ana', desc: 'La zona empresarial premium de Costa Rica. Trabajamos con startups, consultoras y empresas del sector financiero y tecnológico.' },
              { icon: '🌆', title: 'San José Centro y Sabana', desc: 'El corazón comercial del país. Desde pymes locales hasta corporaciones con presencia nacional e internacional.' },
              { icon: '🏘️', title: 'Curridabat y Los Yoses', desc: 'Zona de crecimiento acelerado. Restaurantes, clínicas, inmobiliarias y negocios de servicios que quieren destacar digitalmente.' },
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
              <div className={styles.cardIcon}>🤝</div>
              <h3 className={styles.cardTitle}>Trato directo</h3>
              <p className={styles.cardDesc}>
                Hablas directamente con quien diseña y desarrolla tu proyecto. Sin account managers ni intermediarios.
                Comunicación clara y respuesta en horas, no días.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>📋</div>
              <h3 className={styles.cardTitle}>Proceso estructurado</h3>
              <p className={styles.cardDesc}>
                Discovery → Diseño → Desarrollo → QA → Lanzamiento. Cada fase con entregables claros y tu aprobación
                antes de avanzar. Sin sorpresas al final.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>⚙️</div>
              <h3 className={styles.cardTitle}>Stack moderno</h3>
              <p className={styles.cardDesc}>
                Next.js, TypeScript y bases de datos modernas. Sitios rápidos, seguros y preparados para escalar.
                No WordPress de los 2010s — tecnología 2025.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Servicios</span>
            <h2 className="section__title">¿Qué podemos hacer por tu empresa?</h2>
          </div>
          <div className={styles.cardGrid}>
            {[
              { icon: '💻', title: 'Diseño Web', price: 'Desde $350', desc: 'Sitios corporativos, portfolios y landing pages que reflejan la calidad de tu marca.' },
              { icon: '🛍️', title: 'E-commerce', price: 'Desde $1,200', desc: 'Tiendas online completas con carrito, pagos y gestión de inventario.' },
              { icon: '⚡', title: 'Web Apps', price: 'Desde $1,500', desc: 'CRMs, dashboards y plataformas a medida para automatizar tu operación.' },
              { icon: '📲', title: 'Marketing Digital', price: 'Consultar', desc: 'Google Ads, Meta Ads y SEO para traer clientes que ya están buscando lo que ofreces.' },
              { icon: '🤖', title: 'Automatizaciones', price: 'Desde $500', desc: 'Flujos automáticos que ahorran horas de trabajo manual cada semana.' },
              { icon: '🔧', title: 'Mantenimiento', price: '$100/mes', desc: 'Backups, actualizaciones y soporte técnico para que tu sitio nunca se detenga.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
                <div className={styles.cardIcon}>{s.icon}</div>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '8px' }}>{s.price}</p>
                <p className={styles.cardDesc}>{s.desc}</p>
              </div>
            ))}
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
                q: '¿Tienen oficina física en San José?',
                a: 'Operamos de forma remota, lo que nos permite ofrecer precios competitivos sin los costos de una oficina. Podemos reunirnos virtualmente por Meet o Zoom, o presencialmente bajo coordinación previa.',
              },
              {
                q: '¿Trabajan con empresas internacionales con sede en San José?',
                a: 'Sí. Tenemos experiencia trabajando con multinacionales y empresas con operaciones en múltiples países. Facturas en dólares y procesos adaptados a equipos internacionales.',
              },
              {
                q: '¿Ofrecen servicios de SEO local para San José?',
                a: 'Sí. Configuramos tu perfil de Google Business, optimizamos para búsquedas locales como "empresa + San José" y generamos contenido que posiciona en la zona geográfica de tu negocio.',
              },
              {
                q: '¿Cuál es el tiempo de respuesta típico?',
                a: 'Respondemos en menos de 4 horas hábiles de lunes a viernes. Los clientes con plan de mantenimiento tienen soporte prioritario con respuesta en menos de 2 horas.',
              },
              {
                q: '¿Puedo pagar en colones?',
                a: 'Sí. Aceptamos pago en colones costarricenses con el tipo de cambio del día BCCR, transferencia SINPE Móvil o depósito bancario. También USD por SWIFT o PayPal.',
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
