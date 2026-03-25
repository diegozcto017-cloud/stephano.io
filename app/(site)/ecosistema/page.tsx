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
    { name: 'Restaurante / Soda', emoji: '🍽️', tagline: 'Caja del día, gestión de pedidos y menú digital.' },
    { name: 'Cafetería', emoji: '☕', tagline: 'Venta rápida, menú QR y control de ingredientes.' },
    { name: 'Pastelería', emoji: '🍰', tagline: 'Encargos especiales y vitrina de productos.' },
    { name: 'Salón de Uñas', emoji: '💅', tagline: 'Agenda de citas y catálogo de diseños.' },
    { name: 'Salón de Belleza', emoji: '💇', tagline: 'Control de citas, servicios y fidelización.' },
    { name: 'Barbería', emoji: '✂️', tagline: 'Turnos online y recordatorios automáticos.' },
    { name: 'Serigrafía / Bordado', emoji: '👕', tagline: 'Control de pedidos y estados de producción.' },
    { name: 'Macrobiótica', emoji: '🌿', tagline: 'Venta de suplementos y control de inventario.' },
    { name: 'Clínica Dental', emoji: '🦷', tagline: 'Agenda, expedientes y control de pagos.' },
    { name: 'Médicos / Especialista', emoji: '🩺', tagline: 'Citas online, recetas y historial clínico.' },
    { name: 'Veterinaria', emoji: '🐾', tagline: 'Ficha de mascotas, vacunas y recordatorios.' },
    { name: 'Taller de Autos', emoji: '🚗', tagline: 'Servicios mecánicos y seguimiento por WhatsApp.' },
    { name: 'Taller de Motos', emoji: '🏍️', tagline: 'Repuestos, mecánica y órdenes de trabajo.' },
    { name: 'Gimnasio / Fitness', emoji: '💪', tagline: 'Membresías, pagos mensuales y accesos.' },
    { name: 'Bienes Raíces', emoji: '🏠', tagline: 'Catálogo de propiedades y gestión de prospectos.' },
    { name: 'Arquitectura', emoji: '📐', tagline: 'Portafolio de proyectos y gestión de obras.' },
    { name: 'Contadores', emoji: '📊', tagline: 'Gestión de documentos e impuestos por cliente.' },
    { name: 'Abogados', emoji: '⚖️', tagline: 'Seguimiento de casos y repositorio legal.' },
    { name: 'Ferretería', emoji: '🔧', tagline: 'Caja de ventas, stock masivo y proformas.' },
    { name: 'Farmacia', emoji: '💊', tagline: 'Venta rápida, entregas sugeridas y stock.' },
    { name: 'Tienda / Boutique', emoji: '🛍️', tagline: 'Control de tallas, colores e inventario.' },
    { name: 'Consultoría', emoji: '🏢', tagline: 'Gestión de proyectos, horas y facturación.' },
    { name: 'Constructoras', emoji: '🏗️', tagline: 'Avance de obra, costos y presupuestos.' },
    { name: 'Repuestos', emoji: '⚙️', tagline: 'Catálogo inteligente y búsqueda por modelo.' },
    { name: 'Eventos', emoji: '🎟️', tagline: 'Reservas, registro y venta de entradas.' },
    { name: 'Distribuidores', emoji: '🚚', tagline: 'Pedidos mayoristas y logística de entrega.' },
    { name: 'Academias', emoji: '🎓', tagline: 'Inscripciones, pagos y control de alumnos.' },
    { name: 'Hoteles', emoji: '🏨', tagline: 'Reservas online y gestión de huéspedes.' },
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

const trustedLogos = [
    { name: 'Global Tech CR', industry: 'Consultoría' },
    { name: 'Terra Nova BI', industry: 'Bienes Raíces' },
    { name: 'Lumina Aesthetic', industry: 'Estética' },
    { name: 'Stark Logistics', industry: 'Distribución' },
    { name: 'Pacific Gourmet', industry: 'Restaurante' },
    { name: 'Nexus Architecture', industry: 'Diseño' },
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
                                    <div style={{ fontSize: 22 }}>{ind.emoji}</div>
                                    <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{ind.name}</h4>
                                </div>
                                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.6 }}>{ind.tagline}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Section: Partnerships / Trusted By (Mockup environment) */}
                <section style={{ marginBottom: 'var(--space-4xl)', padding: 'var(--space-3xl) 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            Trusted Collaborators & Partners
                        </span>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
                            * Ambiente de Pruebas — Próximamente Colaboraciones Oficiales Publicadas
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-2xl)', opacity: 0.5, filter: 'grayscale(1)' }}>
                        {trustedLogos.map((logo) => (
                            <div key={logo.name} style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>{logo.name}</div>
                                <div style={{ fontSize: 9, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{logo.industry}</div>
                            </div>
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
