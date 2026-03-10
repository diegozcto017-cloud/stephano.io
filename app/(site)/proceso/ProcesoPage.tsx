'use client';

import { motion } from 'framer-motion';
import styles from '@/styles/pages.module.css';

const steps = [
    {
        num: '01',
        title: 'Diagnóstico Estratégico',
        desc: 'Analizamos tu negocio, objetivos y audiencia para definir la arquitectura digital ideal. Levantamos requerimientos técnicos y funcionales.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
    },
    {
        num: '02',
        title: 'Arquitectura y Diseño',
        desc: 'Diseñamos la estructura del sistema, flujos de usuario, wireframes y prototipos. Definimos stack tecnológico y plan de implementación.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
    },
    {
        num: '03',
        title: 'Desarrollo Profesional',
        desc: 'Construimos con código limpio, modular y escalable. Entregas incrementales con revisiones en cada fase para mantener alineación.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
    },
    {
        num: '04',
        title: 'Automatización e Integraciones',
        desc: 'Conectamos herramientas, configuramos flujos automatizados y optimizamos procesos para eliminar trabajo manual.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
    },
    {
        num: '05',
        title: 'Lanzamiento y Optimización',
        desc: 'Desplegamos en producción, configuramos analytics y monitoreo. Iteramos basados en datos reales para optimizar resultados.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M22 17l-10 5-10-5M12 12v10" /></svg>
    },
];

export default function ProcesoPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <span className={styles.pageLabel}>Proceso</span>
                    <h1 className={styles.pageTitle}>Cómo trabajamos</h1>
                    <p className={styles.pageSubtitle}>
                        Un proceso estructurado en 5 etapas que garantiza claridad, calidad y resultados.
                    </p>
                </div>

                <div className={styles.timeline}>
                    {steps.map((step, i) => (
                        <motion.div key={step.num} className={styles.timelineItem}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}>
                            <div className={styles.timelineNum}>{step.num}</div>
                            <div className={styles.timelineContent}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '16px',
                                    color: 'var(--accent-primary)'
                                }}>
                                    <div style={{
                                        background: 'rgba(0, 102, 255, 0.08)',
                                        border: '1px solid rgba(0, 102, 255, 0.2)',
                                        borderRadius: '10px',
                                        width: '44px',
                                        height: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {step.icon}
                                    </div>
                                    <h3 className={styles.cardTitle} style={{ margin: 0 }}>{step.title}</h3>
                                </div>
                                <p className={styles.cardDesc}>{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.p className={styles.timelineNote}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    Cada fase incluye revisiones y cronograma definido desde el inicio.
                </motion.p>
            </div>
        </div >
    );
}
