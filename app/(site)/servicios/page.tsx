'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const },
    }),
};

const services = [
    {
        icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>, title: 'Landing Pages Estratégicas',
        desc: 'Páginas de alto impacto diseñadas para captar leads y convertir visitantes en clientes. Estructura persuasiva, velocidad optimizada y enfoque en resultados medibles.',
        problem: 'Tu negocio tiene presencia digital pero no genera contactos ni ventas.',
        includes: ['Diseño UX/UI estratégico', 'Copywriting persuasivo', 'Formularios optimizados', 'SEO on-page', 'Analytics integrado', 'Responsive completo'],
        result: 'Incremento medible en captación de leads y tasa de conversión.',
        time: '2–3 semanas', payment: 'Pago inicial + entrega',
    },
    {
        icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>, title: 'E-commerce',
        desc: 'Tiendas digitales completas con gestión de productos, pasarelas de pago seguras, inventario y logística integrada.',
        problem: 'Necesitas vender online con un sistema profesional y escalable.',
        includes: ['Catálogo de productos', 'Carrito de compras', 'Pasarelas de pago (Stripe, PayPal)', 'Gestión de inventario', 'Panel administrativo', 'Correos transaccionales'],
        result: 'Canal de ventas digital operativo y optimizado para conversión.',
        time: '4–6 semanas', payment: '50% anticipo + 50% entrega',
    },
    {
        icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>, title: 'Automatización e Integraciones',
        desc: 'Conexión de herramientas, flujos automatizados y eliminación de procesos manuales repetitivos.',
        problem: 'Procesos desconectados que consumen tiempo y generan errores.',
        includes: ['Integración de APIs', 'CRM automation', 'WhatsApp Business API', 'Email automation', 'Webhooks y triggers', 'Dashboards de monitoreo'],
        result: 'Operación digitalizada con flujos eficientes y datos centralizados.',
        time: '2–4 semanas', payment: 'Por fase o proyecto completo',
    },
    {
        icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>, title: 'Páginas Corporativas',
        desc: 'Presencia digital profesional que transmite autoridad, solidez e identidad de marca. Diseño premium alineado a tu posicionamiento.',
        problem: 'Tu empresa no tiene presencia digital profesional o está desactualizada.',
        includes: ['Diseño corporativo premium', 'Hasta 8 secciones', 'Blog (opcional)', 'SEO completo', 'Formulario de contacto', 'Responsive + performance'],
        result: 'Imagen digital profesional que genera confianza y autoridad.',
        time: '3–4 semanas', payment: 'Pago inicial + entrega',
    },
    {
        icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>, title: 'Aplicaciones Móviles',
        desc: 'Proyecto avanzado bajo análisis técnico previo. No recomendado para todos los modelos de negocio.',
        problem: 'Tu modelo de negocio requiere una experiencia nativa móvil.',
        includes: ['UI/UX diseño nativo', 'Backend completo', 'Preparación para publicación (iOS/Android)', 'Soporte inicial post-lanzamiento'],
        result: 'Aplicación móvil profesional lista para App Store y Google Play.',
        time: '8–12 semanas', payment: 'Por fases con hitos definidos',
    },
];

export default function ServiciosPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Servicios</span>
                    <h1 className={styles.pageTitle}>Soluciones de ingeniería digital</h1>
                    <p className={styles.pageSubtitle}>
                        Cada proyecto es diseñado con arquitectura sólida y los estándares más altos de la industria.
                    </p>
                </div>

                <div className={styles.servicesList}>
                    {services.map((s, i) => (
                        <motion.div key={s.title} className={styles.serviceBlock} custom={i}
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={styles.serviceBlockHeader}>
                                <span className={styles.serviceBlockIcon}>{s.icon}</span>
                                <div>
                                    <h2 className={styles.serviceBlockTitle}>{s.title}</h2>
                                    <p className={styles.serviceBlockDesc}>{s.desc}</p>
                                </div>
                            </div>

                            <div className={styles.serviceBlockGrid}>
                                <div className={styles.serviceBlockSection}>
                                    <h4>Qué problema resuelve</h4>
                                    <p>{s.problem}</p>
                                </div>
                                <div className={styles.serviceBlockSection}>
                                    <h4>Qué incluye</h4>
                                    <ul>{s.includes.map((item) => <li key={item}>• {item}</li>)}</ul>
                                </div>
                                <div className={styles.serviceBlockSection}>
                                    <h4>Resultado esperado</h4>
                                    <p>{s.result}</p>
                                </div>
                                <div className={styles.serviceBlockMeta}>
                                    <div><strong>Tiempo estimado:</strong> {s.time}</div>
                                    <div><strong>Modalidad:</strong> {s.payment}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
                    <Link href="/diagnostico" className={glass.btnPrimary}>Iniciar Diagnóstico</Link>
                </div>
            </div>
        </div>
    );
}
