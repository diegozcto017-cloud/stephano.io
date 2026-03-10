'use client';

import Link from 'next/link';
import styles from './home.module.css';
import glass from '@/styles/glass.module.css';
import LeadCTA from '@/components/LeadCTA/LeadCTA';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import WordRotate from '@/components/WordRotate/WordRotate';
import AuroraText from '@/components/AuroraText/AuroraText';
import { UXTrends } from '@/components/UXTrends/UXTrends';
import TechStack from '@/components/TechStack/TechStack';

const serviceCategories = [
  {
    title: 'Arquitectura de Alto Impacto',
    items: [
      {
        id: 'landing',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
        title: 'Landing Pages Estratégicas',
        desc: 'No es solo una página; es una herramienta de conversión diseñada para vender 24/7.'
      },
      {
        id: 'ecommerce',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
        title: 'E-commerce Premium',
        desc: 'Tiendas digitales de alto rendimiento con gestión integrada y enfoque en el ROI.'
      },
      {
        id: 'redesign',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
        title: 'Rediseño Estratégico',
        desc: 'Evolucionamos tu web desactualizada en un sistema digital que compite en el mercado actual.'
      },
    ]
  },
  {
    title: 'Crecimiento y Rendimiento',
    items: [
      {
        id: 'speed',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
        title: 'Optimización de Velocidad',
        desc: 'Reducción drástica de tiempos de carga para eliminar el abandono de usuarios.'
      },
      {
        id: 'seo',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
        title: 'SEO de Visibilidad',
        desc: 'Estructura técnica optimizada para que tu negocio sea la primera opción en Google.'
      },
      {
        id: 'maintenance',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
        title: 'Mantenimiento Experto',
        desc: 'Continuidad operativa, backups y actualizaciones para que nunca dejes de operar.'
      },
    ]
  }
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <ScrollReveal>
            <div style={{ marginBottom: '24px' }}>
              <span style={{
                padding: '8px 16px',
                borderRadius: '100px',
                background: 'rgba(0, 102, 255, 0.1)',
                border: '1px solid rgba(0, 102, 255, 0.3)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--accent-cyan)'
              }}>
                Ingeniería Digital de Alto Rendimiento
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className={styles.heroTitle}>
              Sistemas digitales que{' '}<br />
              <WordRotate
                words={['atraen', 'convierten', 'escalan', 'modernizan', 'dominan']}
                duration={2800}
                gradient
              />.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className={styles.heroDesc}>
              ¿Tu negocio necesita presencia digital que impacte? Diseñamos plataformas de alto rendimiento que capturan atención, generan confianza y convierten visitantes en clientes reales.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/cotizar" className={glass.btnPrimary}>
                Potencia Tu Negocio
              </Link>
              <Link href="/servicios" className={glass.btnGlass}>
                Explorar Soluciones →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h2 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '16px' }}>
                Arquitectura que{' '}
                <AuroraText colors={['#00E5FF', '#0066FF', '#0099FF']} speed={0.8}>impulsa resultados</AuroraText>
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
                Cada solución es un sistema de precisión, construido para maximizar tu crecimiento y eliminar fricciones digitales.
              </p>
            </div>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
            {serviceCategories.map((cat) => (
              <div key={cat.title}>
                <ScrollReveal>
                  <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '8px 20px',
                      borderRadius: '100px',
                      background: 'rgba(0, 102, 255, 0.08)',
                      border: '1px solid rgba(0, 102, 255, 0.2)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--accent-cyan)',
                      letterSpacing: '0.03em',
                    }}>
                      {cat.title}
                    </span>
                  </div>
                </ScrollReveal>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px'
                }}>
                  {cat.items.map((item, i) => (
                    <ScrollReveal key={item.id} delay={i * 0.1}>
                      <div className={styles.serviceCard}>
                        <div className={styles.serviceIcon}>{item.icon}</div>
                        <h4 className={styles.serviceTitle}>{item.title}</h4>
                        <p className={styles.serviceDesc}>{item.desc}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UX/UI Trends 2026 Section ── */}
      <UXTrends />

      {/* ── Engineering Authority Section ── */}
      <TechStack />

      <LeadCTA />
    </>
  );
}
