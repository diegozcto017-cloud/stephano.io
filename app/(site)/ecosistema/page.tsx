'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.05, duration: 0.5, ease: 'easeOut' as const },
    }),
};

const industries = [
    { id: 'restaurante', name: 'Restaurante / Soda', emoji: '🍽️', color: '#e85d04', tagline: 'POS, comandas, menú QR' },
    { id: 'cafeteria', name: 'Cafetería', emoji: '☕', color: '#6F4E37', tagline: 'Menú QR, órdenes rápidas' },
    { id: 'pasteleria', name: 'Pastelería', emoji: '🍰', color: '#FFB6C1', tagline: 'Pedidos especiales, vitrina' },
    { id: 'unas', name: 'Salón de Uñas', emoji: '💅', color: '#E91E63', tagline: 'Agenda manicure y diseños' },
    { id: 'salon', name: 'Salón de Belleza', emoji: '💇', color: '#ec4899', tagline: 'Agenda, comisiones, lealtad' },
    { id: 'serigrafia', name: 'Serigrafía / Bordado', emoji: '👕', color: '#00A8E8', tagline: 'Catálogo y producción' },
    { id: 'macrobiotica', name: 'Macrobiótica', emoji: '🌿', color: '#2D5A27', tagline: 'Suplementos e inventario' },
    { id: 'dental', name: 'Clínica Dental', emoji: '🦷', color: '#0284c7', tagline: 'Expediente, agenda, odontograma' },
    { id: 'medico', name: 'Médicos / Clínica', emoji: '🩺', color: '#0d9488', tagline: 'Citas, expediente y recetas' },
    { id: 'veterinaria', name: 'Veterinaria', emoji: '🐾', color: '#65a30d', tagline: 'Historia clínica, vacunas' },
    { id: 'taller-autos', name: 'Taller de Autos', emoji: '🚗', color: '#374151', tagline: 'Órdenes de servicio, historial' },
    { id: 'gimnasio', name: 'Gimnasio / Fitness', emoji: '💪', color: '#16a34a', tagline: 'Membresías, acceso QR' },
    { id: 'bienesraices', name: 'Bienes Raíces', emoji: '🏠', color: '#1d4ed8', tagline: 'Catálogo y CRM Inmobiliario' },
    { id: 'tienda', name: 'Tienda / Boutique', emoji: '🛍️', color: '#db2777', tagline: 'Catálogo moda, envíos' },
    { id: 'abogados', name: 'Bufete Abogados', emoji: '⚖️', color: '#1e40af', tagline: 'Casos, documentos, agenda' },
    { id: 'ferreteria', name: 'Ferretería', emoji: '🔧', color: '#d97706', tagline: 'Inventario y ventas' },
];

const mainServices = [
    {
        title: 'Landings Estratégicas',
        price: 'desde $300',
        desc: 'Convertí visitantes en clientes con páginas de alto impacto optimizadas para Google y redes sociales.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /></svg>,
    },
    {
        title: 'Sistemas de Gestión (ERP/CRM)',
        price: 'desde $1,500',
        desc: 'Automatizá tu operación: inventarios, agendas, expedientes y caja centralizada en un solo lugar.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    },
    {
        title: 'E-commerce Profesional',
        price: 'desde $1,200',
        desc: 'Vendé 24/7 con pasarelas de pago locales e internacionales, gestión de stock y logística.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
    },
];

const caseStudies = [
    {
        title: 'SaaS de Gestión Empresarial',
        result: 'Reducción del 40% en tiempo administrativo.',
        category: 'Sistema Elite',
    },
    {
        title: 'E-commerce Moda Premium',
        result: '120% incremento en ventas online.',
        category: 'E-commerce',
    },
    {
        title: 'Automatización Logística',
        result: 'Ahorro de 25 horas semanales.',
        category: 'Automatización',
    },
];

export default function EcosistemaPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                {/* Header Section */}
                <div className={styles.pageHeader}>
                    <motion.span className={styles.pageLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        Ecosistema Stephano.io
                    </motion.span>
                    <motion.h1 className={styles.pageTitle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        Ingeniería Digital de Alto Rendimiento
                    </motion.h1>
                    <p className={styles.pageSubtitle}>
                        Fusionamos diseño premium con arquitectura de software robusta para transformar cualquier tipo de negocio en una potencia digital.
                    </p>
                </div>

                {/* Section 1: Services Types */}
                <div style={{ marginBottom: 'var(--space-4xl)' }}>
                    <div className={styles.sectionHeader}>
                        <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: '#fff' }}>¿Cómo te ayudamos a crecer?</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Elegí el nivel de potencia que tu negocio necesita.</p>
                    </div>
                    <div className={styles.cardGrid}>
                        {mainServices.map((s, i) => (
                            <motion.div key={s.title} className={styles.card} custom={i}
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                                style={{ border: '1px solid rgba(0,102,255,0.15)', background: 'rgba(0,102,255,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                    <div className={styles.cardIcon} style={{ background: 'rgba(0,102,255,0.1)', color: 'var(--accent-primary)' }}>{s.icon}</div>
                                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-primary)', background: 'rgba(0,102,255,0.1)', padding: '4px 12px', borderRadius: 100 }}>{s.price}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{s.title}</h3>
                                <p className={styles.cardDesc}>{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Industries (28 Niches) */}
                <div style={{ marginBottom: 'var(--space-4xl)' }}>
                    <div className={styles.sectionHeader}>
                        <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: '#fff' }}>Soluciones por Industria</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Experiencias personalizadas para más de 28 sectores comerciales.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                        {industries.map((ind, i) => (
                            <motion.div key={ind.name} custom={i}
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ fontSize: 24, background: ind.color + '15', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${ind.color}33` }}>
                                    {ind.emoji}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{ind.name}</h4>
                                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, marginTop: 2 }}>{ind.tagline}</p>
                                </div>
                            </motion.div>
                        ))}
                        <div style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.1), transparent)', border: '1px dashed rgba(0,102,255,0.3)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600 }}>+ 12 Industrias más →</span>
                        </div>
                    </div>
                </div>

                {/* Section 3: Portfolio Highlights */}
                <div style={{ marginBottom: 'var(--space-4xl)' }}>
                    <div className={styles.sectionHeader}>
                        <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: '#fff' }}>Impacto Real</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Casos de estudio que demuestran nuestra capacidad de ejecución.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                        {caseStudies.map((cs, i) => (
                            <motion.div key={cs.title} custom={i}
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                                style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 20, padding: 24 }}>
                                <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{cs.category}</span>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '8px 0 12px' }}>{cs.title}</h3>
                                <div style={{ background: 'rgba(0,200,100,0.06)', border: '1px solid rgba(0,200,100,0.15)', borderRadius: 10, padding: '8px 12px', color: '#00c864', fontSize: 13, fontWeight: 600 }}>
                                    📈 {cs.result}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div style={{ textAlign: 'center', padding: 'var(--space-4xl) 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <h2 style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>¿Listo para el siguiente nivel?</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
                        No solo hacemos páginas web. Construimos la infraestructura digital que tu negocio necesita para dominar su mercado.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        <Link href="/cotizar" className={glass.btnPrimary} style={{ padding: '14px 32px' }}>Cotizar Proyecto</Link>
                        <Link href="/contacto" className={glass.btnSecondary} style={{ padding: '14px 32px' }}>Hablar con un experto</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
