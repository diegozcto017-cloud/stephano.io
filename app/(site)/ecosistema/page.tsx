'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.04, duration: 0.5, ease: 'easeOut' as const },
    }),
};

const industries = [
    { name: 'Restaurante / Soda', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" /></svg>, tagline: 'Caja del día, gestión de pedidos y menú digital.' },
    { name: 'Cafetería', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" /></svg>, tagline: 'Venta rápida, menú QR y control de ingredientes.' },
    { name: 'Pastelería', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>, tagline: 'Encargos especiales y vitrina de productos.' }, // Generic for now, we'll refine
    { name: 'Salón de Uñas', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13h18M3 7h18M3 19h18" /></svg>, tagline: 'Agenda de citas y catálogo de diseños.' },
    { name: 'Salón de Belleza', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>, tagline: 'Control de citas, servicios y fidelización.' },
    { name: 'Barbería', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>, tagline: 'Turnos online y recordatorios automáticos.' },
    { name: 'Serigrafía / Bordado', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>, tagline: 'Control de pedidos y estados de producción.' },
    { name: 'Macrobiótica', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s-8 4-8 10 4 10 8 10 8-4 8-10-4-10-8-10z" /></svg>, tagline: 'Venta de suplementos y control de inventario.' },
    { name: 'Clínica Dental', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>, tagline: 'Agenda, expedientes y control de pagos.' },
    { name: 'Médicos / Especialista', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>, tagline: 'Citas online, recetas y historial clínico.' },
    { name: 'Veterinaria', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s-8 4-8 10 4 10 8 10 8-4 8-10-4-10-8-10z" /></svg>, tagline: 'Ficha de mascotas, vacunas y recordatorios.' },
    { name: 'Taller de Autos', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>, tagline: 'Servicios mecánicos y seguimiento por WhatsApp.' },
    { name: 'Taller de Motos', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>, tagline: 'Repuestos, mecánica y órdenes de trabajo.' },
    { name: 'Gimnasio / Fitness', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5L17.5 17.5M2 2l20 20" /></svg>, tagline: 'Membresías, pagos mensuales y accesos.' },
    { name: 'Bienes Raíces', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>, tagline: 'Catálogo de propiedades y gestión de prospectos.' },
    { name: 'Arquitectura', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>, tagline: 'Portafolio de proyectos y gestión de obras.' },
    { name: 'Contadores', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>, tagline: 'Gestión de documentos e impuestos por cliente.' },
    { name: 'Abogados', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>, tagline: 'Seguimiento de casos y repositorio legal.' },
    { name: 'Ferretería', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>, tagline: 'Caja de ventas, stock masivo y proformas.' },
    { name: 'Farmacia', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>, tagline: 'Venta rápida, entregas sugeridas y stock.' },
    { name: 'Tienda / Boutique', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>, tagline: 'Control de tallas, colores e inventario.' },
    { name: 'Consultoría', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, tagline: 'Gestión de proyectos, horas y facturación.' },
    { name: 'Constructoras', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><path d="M12 2v20M2 12h20" /></svg>, tagline: 'Avance de obra, costos y presupuestos.' },
    { name: 'Repuestos', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1" /></svg>, tagline: 'Catálogo inteligente y búsqueda por modelo.' },
    { name: 'Eventos', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, tagline: 'Reservas, registro y venta de entradas.' },
    { name: 'Distribuidores', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /></svg>, tagline: 'Pedidos mayoristas y logística de entrega.' },
    { name: 'Academias', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>, tagline: 'Inscripciones, pagos y control de alumnos.' },
    { name: 'Hoteles', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17" /></svg>, tagline: 'Reservas online y gestión de huéspedes.' },
];

const capabilities = [
    {
        title: 'Administración de Ventas',
        desc: 'Sincronizá tu caja, controlá tus ingresos diarios y gestioná pagos de clientes de forma simple.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
    },
    {
        title: 'Gestión de Clientes (CRM)',
        desc: 'Base de datos inteligente para conocer a tus clientes, sus preferencias y automatizar promociones.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    },
    {
        title: 'Pagos e Integraciones',
        desc: 'Aceptá pagos locales, conectá WhatsApp e integrá las herramientas que ya usás en tu negocio.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8" cy="7" r="4" /><path d="M22 3.13a4 4 0 0 1 0 7.75" /></svg>
    }
];


export default function EcosistemaPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                {/* Hero section refined */}
                <header className={styles.pageHeader}>
                    <motion.span 
                        className={styles.pageLabel} 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ background: 'rgba(0, 102, 255, 0.05)', color: 'var(--accent-secondary)', border: '1px solid rgba(0, 102, 255, 0.2)' }}
                    >
                        Ingeniería Digital & Sistemas de Gestión
                    </motion.span>
                    <motion.h1 
                        className={styles.pageTitle} 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }}
                        style={{ letterSpacing: '-0.04em', fontWeight: 800 }}
                    >
                        El Ecosistema <span style={{ color: 'var(--accent-primary)' }}>Stephano.io</span>
                    </motion.h1>
                    <p className={styles.pageSubtitle} style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>
                        No solo creamos páginas web de alta gama; construimos la infraestructura digital que centraliza tus pagos, clientes y administración.
                    </p>
                </header>

                {/* Section: Comprehensive Capabilities */}
                <section style={{ marginBottom: 'var(--space-4xl)' }}>
                    <div className={styles.cardGrid}>
                        {capabilities.map((cap, i) => (
                            <motion.div 
                                key={cap.title} 
                                className={styles.card} 
                                custom={i}
                                initial="hidden" 
                                whileInView="visible" 
                                viewport={{ once: true }} 
                                variants={fadeUp}
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                <div style={{ color: 'var(--accent-primary)', marginBottom: 20 }}>{cap.icon}</div>
                                <h3 className={styles.cardTitle}>{cap.title}</h3>
                                <p className={styles.cardDesc} style={{ color: 'var(--text-secondary)' }}>{cap.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Section: All 28 Industries simplified aesthetics */}
                <section style={{ marginBottom: 'var(--space-4xl)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                        <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: '#fff' }}>Soluciones por Industria</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Estructuras prediseñadas y personalizadas para cada sector comercial.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                        {industries.map((ind, i) => (
                            <motion.div 
                                key={ind.name} 
                                custom={i}
                                initial="hidden" 
                                whileInView="visible" 
                                viewport={{ once: true }} 
                                variants={fadeUp}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(0,102,255,0.3)' }}
                                style={{ 
                                    background: 'rgba(255,255,255,0.015)', 
                                    border: '1px solid rgba(255,255,255,0.04)', 
                                    borderRadius: 16, 
                                    padding: '20px', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    gap: 12,
                                    cursor: 'default',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {ind.icon}
                                    </div>
                                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{ind.name}</h4>
                                </div>
                                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.6 }}>{ind.tagline}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Final Call to Action Refined */}
                <motion.div 
                    style={{ textAlign: 'center', padding: 'var(--space-4xl) 0' }}
                    initial={{ opacity: 0 }} 
                    whileInView={{ opacity: 1 }} 
                    viewport={{ once: true }}
                >
                    <h2 style={{ fontSize: 'var(--font-4xl)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>Lleve su negocio al estándar Elite</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 40, maxWidth: 640, margin: '0 auto 40px', fontSize: '1.1rem' }}>
                        No se conforme con una página web estática. Integre un sistema de ingeniería que trabaje para usted 24/7.
                    </p>
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/cotizar" className={glass.btnPrimary} style={{ padding: '16px 40px', fontSize: '1rem' }}>Cotizar Mi Sistema</Link>
                        <Link href="/contacto" className={glass.btnSecondary} style={{ padding: '16px 40px', fontSize: '1rem' }}>Consultoría Estratégica</Link>
                    </div>
                </motion.div>
            </div>
            
            <style jsx>{`
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
            `}</style>
        </div>
    );
}
