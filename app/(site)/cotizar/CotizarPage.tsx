'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';

// --- Pricing Logic Constants (Freelance Entry Strategy) ---
const BASE_RATES = {
    landing: 300,
    redesign: 400,
    portfolio: 400,
    ecommerce: 1000,
    webapp: 1200,
    mobile: 1800,
    ai: 600,
    enterprise: 1500,
    outsourcing: 2500
};

const FEATURES = {
    admin: 400,
    auth: 200,
    db: 250,
    api: 200,
    design_premium: 300,
    copywriting: 150,
    seo: 150,
    maintenance: 100
};

const PAGE_MULTIPLIER = {
    '1': 0,
    '2-5': 150,
    '6-10': 300,
    '10+': 600
};

const URGENCY_MULTIPLIER = {
    standard: 1,
    priority: 1.3,
    express: 1.7
};

export default function CotizarPage() {
    const [step, setStep] = useState(1);
    const [selections, setSelections] = useState({
        type: 'landing',
        features: [] as string[],
        pages: '1',
        urgency: 'standard',
        design: 'standard'
    });

    const [estimate, setEstimate] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        url_proyecto: '',
        empresa: '',
        mensaje: '',
        error: ''
    });

    // Calculate estimate in real-time
    useEffect(() => {
        let total = BASE_RATES[selections.type as keyof typeof BASE_RATES] || 0;

        selections.features.forEach(f => {
            total += FEATURES[f as keyof typeof FEATURES] || 0;
        });

        if (selections.design === 'premium') {
            total += FEATURES.design_premium;
        }

        total += PAGE_MULTIPLIER[selections.pages as keyof typeof PAGE_MULTIPLIER] || 0;
        total *= URGENCY_MULTIPLIER[selections.urgency as keyof typeof URGENCY_MULTIPLIER] || 1;

        setEstimate(Math.round(total));
    }, [selections]);

    const handleFeatureToggle = (f: string) => {
        setSelections(prev => ({
            ...prev,
            features: prev.features.includes(f)
                ? prev.features.filter(item => item !== f)
                : [...prev.features, f]
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const scopeSummary = `
PROYECTO: ${selections.type.toUpperCase()}
COMPONENTES: ${selections.features.join(', ') || 'Básico'}
DISEÑO: ${selections.design}
VOLUMEN: ${selections.pages} páginas
URGENCIA: ${selections.urgency}
ESTIMADO: $${estimate}

NOTAS: ${formData.mensaje}
        `;

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    email: formData.email,
                    telefono: formData.telefono,
                    url_proyecto: formData.url_proyecto,
                    empresa: formData.empresa,
                    tipo_proyecto: selections.type,
                    presupuesto_rango: `$${estimate}`,
                    urgencia: selections.urgency,
                    mensaje: scopeSummary
                })
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                setFormData({ ...formData, error: 'Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        // Formatear texto premium para WhatsApp
        const waText = encodeURIComponent(`*ESTIMACIÓN DE PROYECTO | STEPHANO.IO*
---------------------------------------

Se ha generado una nueva configuración de arquitectura digital con los siguientes detalles técnicos:

*DATOS DEL CLIENTE*
- Nombre: ${formData.nombre}
- Empresa: ${formData.empresa || 'N/A'}
- Email: ${formData.email}

*ESPECIFICACIONES TÉCNICAS*
- Núcleo: ${selections.type.toUpperCase()}
- Componentes: ${selections.features.join(', ') || 'Base'}
- Volumen: ${selections.pages} secciones
- Urgencia: ${selections.urgency.toUpperCase()}

*INVERSIÓN ESTIMADA*
Inversión Base: $${estimate}

¿Podemos programar una sesión de diagnóstico para validar estos requerimientos?`);
        const waLink = `https://wa.me/50671164454?text=${waText}`;

        return (
            <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={glass.glassCard}
                    style={{ textAlign: 'center', padding: 'var(--space-3xl)', maxWidth: '600px' }}
                >
                    <div style={{ color: 'var(--accent-primary)', marginBottom: 'var(--space-xl)' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    </div>
                    <h2 className={styles.pageTitle}>¡Alcance Capturado con Éxito!</h2>
                    <p className={styles.pageSubtitle}>
                        Hemos recibido el desglose técnico de tu arquitectura digital. Te enviamos una copia a <strong>{formData.email}</strong>.
                    </p>

                    <div style={{ margin: 'var(--space-2xl) 0', padding: 'var(--space-xl)', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ fontSize: '14px', marginBottom: 'var(--space-md)', opacity: 0.8 }}>Contacto Estratégico Directo</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', textAlign: 'left', fontSize: '13px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ opacity: 0.5, color: 'var(--accent-primary)' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                </span>
                                <a href="mailto:info@stephano.io" style={{ color: 'var(--accent)', textDecoration: 'none' }}>info@stephano.io</a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ opacity: 0.5, color: 'var(--accent-primary)' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                </span>
                                <span>+506 7116-4454</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <a href={waLink} target="_blank" rel="noopener noreferrer" className={glass.btnPrimary} style={{ background: '#25D366', borderColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 3.5Z" /></svg>
                            <span>Enviar resumen por WhatsApp</span>
                        </a>
                        <Link href="/" className={glass.btnGlass}>Volver al Inicio</Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
                    <span className={styles.pageLabel}>Constructor de Alcance</span>
                    <h1 className={styles.pageTitle}>Cotiza tu Arquitectura Digital</h1>
                    <p className={styles.pageSubtitle}>
                        Configura las piezas de tu sistema y obtén un estimado basado en complejidad y horas de ingeniería.
                    </p>
                </div>

                <div className={styles.cardGrid} style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
                    {/* --- Steps Container --- */}
                    <div className={glass.glassCard} style={{ padding: 'var(--space-2xl)' }}>

                        {/* Progress Bar */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-2xl)' }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <div key={s} style={{
                                    flex: 1, height: '4px', borderRadius: '2px',
                                    background: s <= step ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                                    transition: 'background 0.3s'
                                }} />
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>1. ¿Qué tipo de plataforma necesitas?</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        {[
                                            { id: 'landing', label: 'Landing Page', desc: 'Página única de alta conversión.' },
                                            { id: 'redesign', label: 'Rediseño Estratégico', desc: 'Transformación de sitio existente.' },
                                            { id: 'webapp', label: 'Web Application', desc: 'Dashboard, CRM o herramienta interna.' },
                                            { id: 'mobile', label: 'Mobile App (iOS/Android)', desc: 'Aplicación nativa escalable.' },
                                            { id: 'ai', label: 'AI Automation', desc: 'Chatbots inteligentes y flujos IA.' },
                                            { id: 'enterprise', label: 'Enterprise Audit', desc: 'Análisis profundo de arquitectura.' },
                                            { id: 'outsourcing', label: 'Team Outsourcing', desc: 'Ingeniería dedicada por mes.' },
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setSelections({ ...selections, type: opt.id })}
                                                className={selections.type === opt.id ? glass.glassButtonPrimary : glass.glassCard}
                                                style={{ textAlign: 'left', padding: 'var(--space-lg)', cursor: 'pointer', border: selections.type === opt.id ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)' }}
                                            >
                                                <div style={{ fontWeight: 800 }}>{opt.label}</div>
                                                <div style={{ fontSize: 'var(--font-xs)', opacity: 0.6 }}>{opt.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 'var(--space-3xl)', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button onClick={nextStep} className={glass.btnPrimary}>Siguiente Paso →</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>2. Funcionalidades de Ingeniería</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                        {[
                                            { id: 'admin', label: 'Panel de Administración', desc: 'Gestión de contenidos y data.' },
                                            { id: 'auth', label: 'Sistema de Usuarios', desc: 'Login, perfiles y seguridad.' },
                                            { id: 'seo', label: 'Optimización SEO/Velocidad', desc: 'Carga rápida y visibilidad en Google.' },
                                            { id: 'maintenance', label: 'Mantenimiento Mensual', desc: 'Soporte, backups y actualizaciones.' },
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleFeatureToggle(opt.id)}
                                                className={selections.features.includes(opt.id) ? glass.glassButtonPrimary : glass.glassCard}
                                                style={{ textAlign: 'left', padding: 'var(--space-lg)', cursor: 'pointer', border: selections.features.includes(opt.id) ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)' }}
                                            >
                                                <div style={{ fontWeight: 800 }}>{opt.label}</div>
                                                <div style={{ fontSize: 'var(--font-xs)', opacity: 0.6 }}>{opt.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 'var(--space-3xl)', display: 'flex', justifyContent: 'space-between' }}>
                                        <button onClick={prevStep} className={glass.btnGlass}>Atrás</button>
                                        <button onClick={nextStep} className={glass.btnPrimary}>Siguiente Paso →</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>3. Volumen y Diseño</h3>
                                    <div style={{ marginBottom: 'var(--space-2xl)' }}>
                                        <label style={{ display: 'block', marginBottom: 'var(--space-md)', opacity: 0.6 }}>Número estimado de pantallas/secciones</label>
                                        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                            {['1', '2-5', '6-10', '10+'].map(num => (
                                                <button
                                                    key={num} onClick={() => setSelections({ ...selections, pages: num })}
                                                    style={{
                                                        flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                                        background: selections.pages === num ? 'var(--accent)' : 'transparent',
                                                        color: 'white', cursor: 'pointer', fontWeight: 700
                                                    }}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 'var(--space-md)', opacity: 0.6 }}>Nivel de acabado visual</label>
                                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                            <button
                                                onClick={() => setSelections({ ...selections, design: 'standard' })}
                                                style={{ flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: selections.design === 'standard' ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left' }}
                                            >
                                                <div style={{ fontWeight: 800 }}>Mínimo Viable</div>
                                                <div style={{ fontSize: 'var(--font-xs)', opacity: 0.5 }}>Efectivo y limpio.</div>
                                            </button>
                                            <button
                                                onClick={() => setSelections({ ...selections, design: 'premium' })}
                                                style={{ flex: 1, padding: '20px', borderRadius: '12px', border: selections.design === 'premium' ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)', background: selections.design === 'premium' ? 'rgba(0,102,255,0.1)' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left' }}
                                            >
                                                <div style={{ fontWeight: 800, color: 'var(--accent)' }}>Digital High-End</div>
                                                <div style={{ fontSize: 'var(--font-xs)', opacity: 0.5 }}>Liquid glass, animaciones y UX de lujo.</div>
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 'var(--space-3xl)', display: 'flex', justifyContent: 'space-between' }}>
                                        <button onClick={prevStep} className={glass.btnGlass}>Atrás</button>
                                        <button onClick={nextStep} className={glass.btnPrimary}>Siguiente Paso →</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>4. Tiempos de Entrega</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                        {[
                                            { id: 'standard', label: 'Estándar (2-4 semanas)', desc: 'Ritmo normal de ingeniería.', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
                                            { id: 'priority', label: 'Prioridad (1-2 semanas)', desc: 'Enfoque dedicado y sprints rápidos. (+50%)', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
                                            { id: 'express', label: 'Express (Entrega Inmediata)', desc: 'Operación 24/7 para deadline crítico. (+100%)', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /><path d="M13 2l9 10h-9l1 8-10-12h9l-1-8z" opacity="0.3" /></svg> },
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setSelections({ ...selections, urgency: opt.id })}
                                                style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '12px', border: selections.urgency === opt.id ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)', background: selections.urgency === opt.id ? 'rgba(0,102,255,0.05)' : 'transparent', color: 'white', cursor: 'pointer', textAlign: 'left' }}
                                            >
                                                <div style={{ color: 'var(--accent-primary)' }}>{opt.icon}</div>
                                                <div>
                                                    <div style={{ fontWeight: 800 }}>{opt.label}</div>
                                                    <div style={{ fontSize: 'var(--font-xs)', opacity: 0.5 }}>{opt.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 'var(--space-3xl)', display: 'flex', justifyContent: 'space-between' }}>
                                        <button onClick={prevStep} className={glass.btnGlass}>Atrás</button>
                                        <button onClick={nextStep} className={glass.btnPrimary}>Revisar Resumen →</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 5 && (
                                <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <h3 style={{ marginBottom: 'var(--space-xl)' }}>5. Datos de contacto</h3>

                                    {/* Error Message Display */}
                                    {formData.error && (
                                        <div style={{ background: 'rgba(255,50,50,0.1)', color: '#ffaaaa', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(255,50,50,0.2)' }}>
                                            ⚠️ {formData.error}
                                        </div>
                                    )}

                                    <form
                                        onSubmit={(e) => {
                                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                            if (!formData.nombre || !formData.email) {
                                                e.preventDefault();
                                                setFormData({ ...formData, error: 'Por favor completa los campos obligatorios (*).' });
                                                return;
                                            }
                                            if (!emailRegex.test(formData.email)) {
                                                e.preventDefault();
                                                setFormData({ ...formData, error: 'Por favor ingresa un correo válido (debe contener @ y un dominio).' });
                                                return;
                                            }
                                            setFormData({ ...formData, error: '' });
                                            handleSubmit(e);
                                        }}
                                        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
                                    >
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                            <input
                                                type="text" placeholder="Tu Nombre *" required className={glass.glassInput}
                                                value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                            />
                                            <input
                                                type="email" placeholder="Correo *" required className={glass.glassInput}
                                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                            <input
                                                type="tel" placeholder="Teléfono / WhatsApp" className={glass.glassInput}
                                                value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                            />
                                            <input
                                                type="text" placeholder="Empresa / Marca" className={glass.glassInput}
                                                value={formData.empresa} onChange={e => setFormData({ ...formData, empresa: e.target.value })}
                                            />
                                        </div>
                                        <input
                                            type="url" placeholder="URL de tu sitio actual (si existe)" className={glass.glassInput}
                                            value={formData.url_proyecto} onChange={e => setFormData({ ...formData, url_proyecto: e.target.value })}
                                        />
                                        <textarea
                                            placeholder="Cuéntanos brevemente sobre tu idea o negocio..." rows={4} className={glass.glassInput}
                                            value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                                        />
                                        <div style={{ marginTop: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <button type="button" onClick={prevStep} className={glass.btnGlass}>Atrás</button>
                                            <button type="submit" disabled={loading} className={glass.btnPrimary}>
                                                {loading ? 'Procesando...' : 'Confirmar e Iniciar'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* --- Live Summary Sidebar --- */}
                    <aside className={glass.glassCard} style={{ position: 'sticky', top: '100px', padding: 'var(--space-xl)', background: 'rgba(0,102,255,0.02)', border: '1px solid rgba(0,102,255,0.1)' }}>
                        <h4 style={{ fontSize: '12px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-xl)' }}>Resumen de Configuración</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                                <div style={{ fontSize: '10px', opacity: 0.5 }}>NÚCLEO</div>
                                <div style={{ fontWeight: 700 }}>{selections.type.toUpperCase()}</div>
                            </div>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                                <div style={{ fontSize: '10px', opacity: 0.5 }}>COMPONENTES</div>
                                <div style={{ fontSize: '11px' }}>{selections.features.length > 0 ? selections.features.join(' + ') : 'Base'}</div>
                            </div>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                                <div style={{ fontSize: '10px', opacity: 0.5 }}>VOLUMEN</div>
                                <div style={{ fontWeight: 700 }}>{selections.pages} Secciones</div>
                            </div>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                                <div style={{ fontSize: '10px', opacity: 0.5 }}>TIEMPO</div>
                                <div style={{ fontWeight: 700 }}>{selections.urgency.toUpperCase()}</div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', background: 'rgba(0,194,255,0.05)', padding: 'var(--space-xl)', borderRadius: '12px', border: '1px solid rgba(0,194,255,0.2)' }}>
                            <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px' }}>INVERSIÓN ESTIMADA</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)' }}>${estimate}</div>
                            <div style={{ fontSize: '9px', opacity: 0.4, marginTop: '8px' }}>Basado en tarifa Freelance-to-Pro</div>
                        </div>

                        <p style={{ fontSize: '10px', opacity: 0.4, marginTop: 'var(--space-xl)', textAlign: 'center', lineHeight: 1.4 }}>
                            * Este es un estimado de ingeniería. El costo final se ajustará tras una llamada de descubrimiento.
                        </p>
                    </aside>
                </div>
            </div>
        </div>
    );
}
