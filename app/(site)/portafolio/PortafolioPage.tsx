'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/pages.module.css';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
    }),
};

const projects = [
    {
        title: 'Plataforma SaaS de Gestión Empresarial',
        category: 'Sistema Personalizado',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
        objective: 'Centralizar operaciones de una empresa con múltiples sedes en un solo sistema web.',
        solution: 'Plataforma modular con dashboards en tiempo real, facturación, inventario y usuarios con roles diferenciados.',
        result: 'Reducción del 40% en tiempo administrativo y visibilidad completa de operaciones.',
        tech: ['Next.js', 'PostgreSQL', 'Prisma', 'Docker'],
    },
    {
        title: 'E-commerce de Moda Premium',
        category: 'E-commerce',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
        objective: 'Crear una tienda digital para una marca de moda con experiencia de compra premium.',
        solution: 'Tienda con catálogo visual, carrito optimizado, Stripe integrado y panel admin completo.',
        result: '120% incremento en ventas online en los primeros 3 meses. Tasa de abandono reducida un 35%.',
        tech: ['React', 'Node.js', 'Stripe', 'Redis'],
    },
    {
        title: 'Landing Page para Clínica Estética',
        category: 'Landing Page',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
        objective: 'Generar leads cualificados para servicios de medicina estética.',
        solution: 'Landing optimizada para conversión con formularios inteligentes, WhatsApp integration y SEO local.',
        result: '85 leads mensuales con una tasa de conversión del 12%.',
        tech: ['Next.js', 'Framer Motion', 'WhatsApp API'],
    },
    {
        title: 'Sistema de Automatización Logística',
        category: 'Automatización',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
        objective: 'Eliminar procesos manuales en la cadena de distribución de un grupo empresarial.',
        solution: 'Pipeline automatizado con integraciones API, alertas en tiempo real y dashboard centralizado.',
        result: 'Reducción del 60% en errores operativos y ahorro de 25 horas semanales por sede.',
        tech: ['Node.js', 'PostgreSQL', 'Webhooks', 'Cron'],
    },
];

export default function PortafolioPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Portafolio</span>
                    <h1 className={styles.pageTitle}>Trabajo que habla por sí mismo</h1>
                    <p className={styles.pageSubtitle}>
                        Casos de estudio que reflejan nuestro enfoque en arquitectura sólida y resultados medibles.
                    </p>
                </div>

                <div className={styles.caseStudies}>
                    {projects.map((project, i) => (
                        <motion.div key={project.title} className={styles.caseStudy} custom={i}
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <div className={styles.caseStudyMockup}>
                                <div className={`${styles.mockupPlaceholder} ${styles[`mockup${i + 1}`]}`}>
                                    <span>{project.category}</span>
                                    {/* Simulated UI Elements */}
                                    <div className={styles.mockupUI}>
                                        <div className={styles.uiBar} />
                                        <div className={styles.uiGrid}>
                                            <div className={styles.uiItem} />
                                            <div className={styles.uiItem} />
                                            <div className={styles.uiItem} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.caseStudyContent}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'rgba(0, 102, 255, 0.08)',
                                    padding: '4px 12px',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(0, 102, 255, 0.15)',
                                    color: 'var(--accent-primary)',
                                    fontSize: 'var(--font-xs)',
                                    fontWeight: 600
                                }}>
                                    {project.icon}
                                    {project.category}
                                </div>
                                <h3 className={styles.cardTitle} style={{ marginTop: '12px' }}>{project.title}</h3>
                                <div className={styles.caseStudyDetail}>
                                    <h4>Objetivo</h4>
                                    <p>{project.objective}</p>
                                </div>
                                <div className={styles.caseStudyDetail}>
                                    <h4>Solución</h4>
                                    <p>{project.solution}</p>
                                </div>
                                <div className={styles.caseStudyDetail}>
                                    <h4>Resultado</h4>
                                    <p>{project.result}</p>
                                </div>
                                <div className={styles.cardBadges}>
                                    {project.tech.map((t) => <span key={t} className={styles.badge}>{t}</span>)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
