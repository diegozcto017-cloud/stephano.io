'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' as const },
    }),
};

const industries = [
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20L12 2z" /></svg>, name: 'Belleza', desc: 'Reservas online, catálogo de servicios y captación de clientes automatizada.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" /></svg>, name: 'Restaurantes', desc: 'Menú digital, pedidos online y sistema de reservaciones integrado.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172l-1.414 1.414L3 1.243 1.586 2.657 7.172 8.243 5.757 9.657 11.343 15.243l-1.414 1.414 5.586 5.586 1.414-1.414L22.515 26.4 24 25l-5.586-5.586 1.414-1.414-5.586-5.586 1.414-1.414-5.586-5.586z" /></svg>, name: 'Mascotas', desc: 'Gestión de citas, historial de pacientes y captación de nuevos clientes.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>, name: 'Clínicas', desc: 'Agendamiento, historial clínico digital y comunicación automatizada.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>, name: 'Inmobiliarias', desc: 'Catálogo de propiedades, filtros avanzados y captación de prospectos.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>, name: 'Talleres', desc: 'Gestión de órdenes, seguimiento de trabajos y cotizaciones automáticas.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="5" /><path d="M11 21a8 8 0 0 0-8-8M21 21a8 8 0 0 0-8-8" /></svg>, name: 'Repuestos', desc: 'E-commerce especializado con búsqueda por modelo y gestión de inventario.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5L17.5 17.5M2 2l20 20M7 21a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1 1 1 0 0 0 1 1h3a1 1 0 0 0 1-1zM22 3a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1 1 1 0 0 0 1 1h3a1 1 0 0 0 1-1z" /></svg>, name: 'Gimnasios', desc: 'Membresías, reserva de clases y seguimiento de clientes.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>, name: 'Academias', desc: 'Cursos online, inscripciones y plataforma de contenido educativo.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>, name: 'Retail', desc: 'Tienda digital con catálogo, pasarelas de pago y logística integrada.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>, name: 'Ferreterías', desc: 'Catálogo con búsqueda por categoría, cotizaciones y pedidos online.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17" /></svg>, name: 'Hoteles', desc: 'Sistema de reservas, disponibilidad en tiempo real y gestión de huéspedes.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, name: 'Abogados', desc: 'Presencia digital profesional, captación de casos y gestión de consultas.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="9" y1="21" x2="9" y2="10" /><line x1="15" y1="21" x2="15" y2="10" /></svg>, name: 'Contadores', desc: 'Portal de clientes, documentos compartidos y comunicación estructurada.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M21 9H3M9 21V9M15 21V9" /></svg>, name: 'Constructoras', desc: 'Portafolio de proyectos, cotizaciones online y seguimiento de obras.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, name: 'Distribuidores', desc: 'Catálogo B2B, gestión de pedidos y seguimiento de entregas.' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, name: 'Eventos', desc: 'Tickets online, registro de asistentes y landing pages de eventos.' },
];

export default function SolucionesPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Soluciones</span>
                    <h1 className={styles.pageTitle}>Soluciones por industria</h1>
                    <p className={styles.pageSubtitle}>
                        Cada industria tiene necesidades específicas. Diseñamos infraestructura digital adaptada a tu operación.
                    </p>
                </div>

                <div className={styles.cardGrid}>
                    {industries.map((ind, i) => (
                        <motion.div key={ind.name} className={styles.card} custom={i}
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={styles.cardIcon}>{ind.icon}</div>
                            <h3 className={styles.cardTitle}>{ind.name}</h3>
                            <p className={styles.cardDesc}>{ind.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <div style={{ background: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.18)', borderRadius: 16, padding: '24px 32px', marginBottom: 'var(--space-xl)', maxWidth: 640, margin: '0 auto var(--space-xl)' }}>
                        <div style={{ fontSize: 28, marginBottom: 10 }}>🎯</div>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--font-lg)', marginBottom: 8 }}>
                            ¿Querés ver cómo se vería tu negocio?
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', lineHeight: 1.6, marginBottom: 16 }}>
                            En tu cotización podés solicitar una demostración interactiva personalizada — verás exactamente cómo se vería la página de tu negocio antes de tomar cualquier decisión.
                        </p>
                        <Link href="/cotizar" className={glass.btnPrimary} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            Solicitar demo en mi cotización →
                        </Link>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-base)' }}>
                        Si tu industria no aparece aquí, Stephano puede diseñar una solución personalizada.
                    </p>
                    <Link href="/contacto" className={glass.btnPrimary}>Contactar</Link>
                </motion.div>
            </div>
        </div>
    );
}
