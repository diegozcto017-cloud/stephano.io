import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

export const metadata: Metadata = {
  title: 'Páginas Web para Empresas Costa Rica desde $350 | Stephano.io',
  description: 'Páginas web profesionales para empresas en Costa Rica. Presencia digital que genera confianza, atrae clientes y diferencia tu marca de la competencia. Desde $350 USD.',
  keywords: [
    'pagina web empresas costa rica',
    'pagina web para empresa costa rica',
    'sitio web empresas costa rica',
    'presencia digital costa rica',
    'web corporativa costa rica',
    'diseño web pyme costa rica',
  ],
  alternates: { canonical: 'https://stephano.io/pagina-web-empresas-costa-rica' },
  openGraph: {
    title: 'Páginas Web para Empresas en Costa Rica desde $350',
    description: 'Presencia digital profesional para tu empresa en Costa Rica. Sitios modernos que generan confianza y atraen clientes. Desde $350 USD.',
    url: 'https://stephano.io/pagina-web-empresas-costa-rica',
    siteName: 'Stephano.io',
    locale: 'es_CR',
    type: 'website',
  },
};

export default function PaginaWebEmpresasCostaRica() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '140px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section__label">Presencia Digital Profesional</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '16px', marginBottom: '24px', color: '#fff' }}>
            Páginas Web para Empresas<br />en Costa Rica desde $350
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            En Costa Rica, el 87% de las personas investiga un negocio en Google antes de comprar.
            Si no tienes presencia digital profesional, le estás regalando esos clientes a tu competencia.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/cotizar" className={glass.btnPrimary}>Solicitar Presupuesto Gratis</Link>
            <Link href="/servicios" className={glass.btnGlass}>Ver Servicios →</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container">
          <div className={styles.cardGrid}>
            {[
              { stat: '5–7 días', label: 'Tiempo de entrega landing page' },
              { stat: '$350', label: 'Inversión inicial mínima' },
              { stat: '100%', label: 'Proyectos entregados a tiempo' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '40px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '8px' }}>{s.stat}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s.label}</div>
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
              <div className={styles.cardIcon}>🏆</div>
              <h3 className={styles.cardTitle}>Calidad sin intermediarios</h3>
              <p className={styles.cardDesc}>
                No subcontratamos. El equipo que diseña y programa tu sitio es el mismo que lo entrega
                y da soporte. Responsabilidad total de inicio a fin.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>📊</div>
              <h3 className={styles.cardTitle}>Resultados medibles</h3>
              <p className={styles.cardDesc}>
                Cada proyecto incluye configuración de Google Analytics para que puedas ver cuántas visitas
                recibes, de dónde vienen y qué acciones toman en tu sitio.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>🇨🇷</div>
              <h3 className={styles.cardTitle}>Contexto costarricense</h3>
              <p className={styles.cardDesc}>
                Entendemos el mercado local: cómo compran los ticos, qué les genera confianza y qué palabras
                usan para buscar en Google. Diseñamos con ese conocimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__label">¿Para quién es?</span>
            <h2 className="section__title">Empresas que ya hemos ayudado</h2>
          </div>
          <div className={styles.cardGrid}>
            {[
              { icon: '🦷', title: 'Clínicas y consultorios', desc: 'Médicos, dentistas, psicólogos y especialistas que quieren atraer pacientes sin depender de referidos.' },
              { icon: '🏗️', title: 'Construcción e inmobiliaria', desc: 'Constructoras, arquitectos e inmobiliarias que necesitan mostrar proyectos y capturar interesados.' },
              { icon: '⚖️', title: 'Despachos y consultoras', desc: 'Abogados, contadores, consultores financieros que necesitan credibilidad digital para cerrar contratos.' },
              { icon: '🍽️', title: 'Restaurantes y gastronomía', desc: 'Menú online, reservas, delivery y presencia en Google Maps para llegar a más comensales.' },
              { icon: '🎓', title: 'Academias y educación', desc: 'Escuelas de idiomas, academias de danza, coaching y cursos que quieren inscripciones online.' },
              { icon: '🏋️', title: 'Fitness y bienestar', desc: 'Gimnasios, estudios de yoga, spas y centros de bienestar con agenda de clases y membresías.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
                <div className={styles.cardIcon}>{s.icon}</div>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
              </div>
            ))}
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
                <li>Página de presentación</li>
                <li>Formulario de contacto</li>
                <li>SEO básico</li>
                <li>Enlace a WhatsApp</li>
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
                <li>Múltiples páginas</li>
                <li>Blog de contenidos</li>
                <li>SEO on-page completo</li>
                <li>Google Business setup</li>
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
                <li>Carrito y pagos online</li>
                <li>SINPE Móvil integrado</li>
                <li>Panel de pedidos</li>
                <li>Entrega en 21–28 días</li>
              </ul>
              <Link href="/cotizar" className={glass.btnGlass}>Cotizar</Link>
            </div>
          </div>
          <p className={styles.pricingDisclaimer}>
            Todos los proyectos incluyen diseño responsivo, certificado SSL y 30 días de soporte post-lanzamiento.
          </p>
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
                q: '¿Mi empresa realmente necesita una página web si ya tengo redes sociales?',
                a: 'Sí. Las redes sociales son rentadas — si la plataforma cambia el algoritmo o cierra, pierdes tu audiencia. Un sitio web es tuyo para siempre. Además, Google no indexa bien el contenido de redes sociales para búsquedas locales.',
              },
              {
                q: '¿Qué incluye el precio de $350?',
                a: 'Incluye diseño personalizado, desarrollo, adaptación a móvil, formulario de contacto, enlace a WhatsApp y configuración básica de SEO. Solo necesitas pagar el hosting y dominio por separado ($10–20 USD/mes).',
              },
              {
                q: '¿Cuánto tiempo tarda el proceso completo?',
                a: 'El proceso completo tiene tres fases: descubrimiento (1–2 días), diseño y desarrollo (5–14 días según el proyecto) y revisiones finales (1–3 días). Al completar cada fase, apruebas antes de continuar.',
              },
              {
                q: '¿Me ayudan con el contenido y las fotos?',
                a: 'Sí. Ofrecemos asesoría de copywriting y podemos usar fotografía de stock de alta calidad si no tienes fotos propias. Para el plan corporativo, también podemos crear el copy de cada sección.',
              },
              {
                q: '¿Qué pasa si quiero agregar funciones después?',
                a: 'Construimos con escalabilidad en mente. Puedes comenzar con una landing page y escalar a sitio corporativo, e-commerce o web app según crezca tu negocio. Las integraciones adicionales se cotizan por módulo.',
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
