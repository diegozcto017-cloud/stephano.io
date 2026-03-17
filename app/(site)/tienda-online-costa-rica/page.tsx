import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

export const metadata: Metadata = {
  title: 'Tienda Online Costa Rica — E-commerce sin Comisiones | Stephano.io',
  description: 'Crea tu tienda online en Costa Rica. Vende 24/7 sin pagar comisiones por venta. E-commerce a medida con carrito, pagos y panel de gestión. Desde $1,200 USD.',
  keywords: [
    'tienda online costa rica',
    'ecommerce costa rica',
    'tienda virtual costa rica',
    'vender en linea costa rica',
    'crear tienda online costa rica',
    'plataforma ecommerce costa rica',
  ],
  alternates: { canonical: 'https://stephano.io/tienda-online-costa-rica' },
  openGraph: {
    title: 'Tienda Online en Costa Rica — Vende 24/7 sin Comisiones',
    description: 'E-commerce profesional en Costa Rica. Sin comisiones por venta, con tu propia plataforma. Desde $1,200 USD.',
    url: 'https://stephano.io/tienda-online-costa-rica',
    siteName: 'Stephano.io',
    locale: 'es_CR',
    type: 'website',
  },
};

export default function TiendaOnlineCostaRica() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: '140px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section__label">E-commerce Premium</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '16px', marginBottom: '24px', color: '#fff' }}>
            Tienda Online en Costa Rica —<br />Vende 24/7 sin Comisiones
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Tu propia tienda online, sin depender de Marketplace ni pagar comisión por cada venta.
            Carrito, checkout, pasarela de pagos y panel de gestión de pedidos — todo tuyo desde el día uno.
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
              <div className={styles.cardIcon}>💰</div>
              <h3 className={styles.cardTitle}>0% de comisión por venta</h3>
              <p className={styles.cardDesc}>
                A diferencia de Etsy, Amazon o Marketplace de Facebook, con tu propia tienda te quedas con el 100%
                de cada venta. El costo de desarrollo se recupera rápidamente.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>📦</div>
              <h3 className={styles.cardTitle}>Gestión total del negocio</h3>
              <p className={styles.cardDesc}>
                Panel de administración para gestionar productos, inventario, pedidos, clientes y descuentos.
                Control total en un solo lugar, accesible desde cualquier dispositivo.
              </p>
            </div>
            <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
              <div className={styles.cardIcon}>🔒</div>
              <h3 className={styles.cardTitle}>Pagos locales e internacionales</h3>
              <p className={styles.cardDesc}>
                Integramos SINPE Móvil, tarjetas de crédito/débito, PayPal y Stripe. Tus clientes pagan
                como prefieren — tú recibes sin fricción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Funcionalidades</span>
            <h2 className="section__title">Todo lo que tu tienda necesita</h2>
          </div>
          <div className={styles.cardGrid}>
            {[
              { icon: '🛒', title: 'Carrito y checkout optimizado', desc: 'Proceso de compra simplificado que reduce el abandono de carrito y aumenta la tasa de conversión.' },
              { icon: '📱', title: '100% adaptable a móvil', desc: 'Más del 70% de compras en Costa Rica se hacen desde el celular. Tu tienda luce perfecta en cualquier pantalla.' },
              { icon: '🔍', title: 'SEO para productos', desc: 'Cada producto con URL amigable, meta tags y estructura optimizada para aparecer en Google Shopping.' },
              { icon: '📊', title: 'Analytics integrado', desc: 'Ve qué productos se ven más, cuánto duran los clientes en el sitio y desde dónde llegan.' },
              { icon: '💌', title: 'Email marketing', desc: 'Correos automáticos de confirmación, abandono de carrito y campañas de promoción integradas.' },
              { icon: '⭐', title: 'Reviews y valoraciones', desc: 'Sistema de reseñas de clientes que aumenta la confianza y mejora el posicionamiento orgánico.' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '32px' }}>
                <div className={styles.cardIcon}>{f.icon}</div>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardDesc}>{f.desc}</p>
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
              <h3 className={styles.pricingTitle}>Tienda Básica</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$1,200</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>Hasta 100 productos</li>
                <li>Carrito y checkout</li>
                <li>1 pasarela de pago</li>
                <li>Panel de pedidos</li>
                <li>Entrega en 21 días</li>
              </ul>
              <Link href="/cotizar" className={glass.btnGlass}>Cotizar</Link>
            </div>
            <div className={`${styles.pricingCard} ${styles.pricingFeatured}`}>
              <span className={styles.pricingBadge}>Más completo</span>
              <h3 className={styles.pricingTitle}>Tienda Avanzada</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$1,800</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>Productos ilimitados</li>
                <li>Múltiples pasarelas de pago</li>
                <li>SINPE Móvil integrado</li>
                <li>Sistema de cupones</li>
                <li>Reviews y wishlist</li>
              </ul>
              <Link href="/cotizar" className={glass.btnPrimary}>Cotizar</Link>
            </div>
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>Tienda Enterprise</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.pricingFrom}>Desde</span>
                <span className={styles.pricingAmount}>$2,500</span>
                <span className={styles.pricingCurrency}>USD</span>
              </div>
              <ul className={styles.pricingIncludes}>
                <li>Multi-vendor o multi-tienda</li>
                <li>ERP / inventario avanzado</li>
                <li>App móvil opcional</li>
                <li>API para integraciones</li>
                <li>Soporte dedicado</li>
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
                q: '¿Puedo vender con SINPE Móvil en mi tienda?',
                a: 'Sí. Integramos SINPE Móvil como método de pago nativo. El cliente ve el número en el checkout, hace la transferencia y el sistema confirma el pedido automáticamente.',
              },
              {
                q: '¿Necesito conocimientos técnicos para administrar mi tienda?',
                a: 'No. El panel de administración es intuitivo — agregar productos, editar precios, ver pedidos y gestionar inventario es tan fácil como usar redes sociales. Incluimos capacitación post-entrega.',
              },
              {
                q: '¿Cuánto tiempo tarda en estar lista la tienda?',
                a: 'La tienda básica está lista entre 21 y 28 días hábiles. La tienda avanzada puede tomar entre 30 y 45 días dependiendo del volumen de productos y las integraciones requeridas.',
              },
              {
                q: '¿Puedo migrar productos desde otra plataforma?',
                a: 'Sí. Si ya tienes productos en otra plataforma, hacemos la migración de datos sin costo adicional para proyectos de tienda avanzada.',
              },
              {
                q: '¿La tienda aparece en Google Shopping?',
                a: 'Sí. Configuramos el feed de productos para Google Merchant Center, lo que permite que tus productos aparezcan en búsquedas de Google Shopping orgánico y campañas de Performance Max.',
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
