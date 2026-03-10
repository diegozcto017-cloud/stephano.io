'use client';

import { useState } from 'react';
import styles from '@/styles/pages.module.css';
import glass from '@/styles/glass.module.css';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

const WHATSAPP_NUMBER = '50671164454';

const SOLUTION_OPTIONS = [
    { value: 'landing', label: 'Landing Page de Conversión' },
    { value: 'ecommerce', label: 'E-commerce Premium' },
    { value: 'sistema', label: 'Sistema Web Personalizado' },
    { value: 'optimizacion', label: 'Optimización / Mantenimiento' },
    { value: 'consultoria', label: 'Consultoría Técnica' },
];

export default function ContactoPage() {
    const [form, setForm] = useState({ nombre: '', email: '', tipo_proyecto: '', mensaje: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const update = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!form.nombre.trim() || form.nombre.trim().length < 2) newErrors.nombre = 'Ingresa tu nombre completo';
        if (!form.email.trim()) {
            newErrors.email = 'Ingresa tu correo electrónico';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'El correo debe incluir una "@" y un dominio válido';
        }
        if (!form.tipo_proyecto) newErrors.tipo_proyecto = 'Selecciona un tipo de solución';
        if (!form.mensaje.trim()) newErrors.mensaje = 'Cuéntanos sobre tu objetivo';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const tipoLabel = SOLUTION_OPTIONS.find(o => o.value === form.tipo_proyecto)?.label || form.tipo_proyecto;

        const msg = [
            `*SOLICITUD DE CONSULTORÍA | STEPHANO.IO*`,
            `---------------------------------------`,
            `CLIENTE: ${form.nombre.trim()}`,
            `EMAIL: ${form.email.trim()}`,
            `PROYECTO: ${tipoLabel}`,
            `---------------------------------------`,
            `DETALLES DEL DESAFÍO:`,
            `${form.mensaje.trim()}`
        ].join('\n');

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    return (
        <div className={styles.page} style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* ── Header ── */}
                <ScrollReveal>
                    <div className={styles.pageHeader}>
                        <span className={styles.pageLabel}>Contacto Directo</span>
                        <h1 className={styles.pageTitle}>
                            Diseñemos tu próximo <br />
                            <span className="text-gradient">sistema digital</span>
                        </h1>
                        <p className={styles.pageSubtitle}>
                            Estamos listos para transformar tu visión en una ventaja competitiva.
                            Completa el formulario y te contactaremos por WhatsApp de inmediato.
                        </p>
                    </div>
                </ScrollReveal>

                <div className={styles.contactGrid}>
                    {/* ── Info Column ── */}
                    <ScrollReveal>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactInfoItem}>
                                <div style={{
                                    background: 'rgba(37, 211, 102, 0.08)',
                                    border: '1px solid rgba(37, 211, 102, 0.2)',
                                    borderRadius: '12px',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#25D366',
                                    flexShrink: 0
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                                </div>
                                <div>
                                    <div className={styles.contactInfoTitle}>WhatsApp Business</div>
                                    <div style={{ color: '#25D366', fontWeight: 500, marginBottom: '4px' }}>Respuesta inmediata</div>
                                    <div className={styles.contactInfoDesc}>Lunes a Viernes, 9:00 - 18:00 (GMT-6)</div>
                                </div>
                            </div>

                            <div className={styles.contactInfoItem}>
                                <div style={{
                                    background: 'rgba(0, 102, 255, 0.08)',
                                    border: '1px solid rgba(0, 102, 255, 0.2)',
                                    borderRadius: '12px',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent-blue)',
                                    flexShrink: 0
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                </div>
                                <div>
                                    <div className={styles.contactInfoTitle}>Canal Oficial</div>
                                    <div style={{ color: '#ffffff', fontWeight: 500, marginBottom: '4px' }}>info@stephano.io</div>
                                    <div className={styles.contactInfoDesc}>Consultas generales y soporte técnico.</div>
                                </div>
                            </div>

                            <div className={styles.contactInfoItem}>
                                <div style={{
                                    background: 'rgba(0, 102, 255, 0.08)',
                                    border: '1px solid rgba(0, 102, 255, 0.2)',
                                    borderRadius: '12px',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent-blue)',
                                    flexShrink: 0
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                </div>
                                <div>
                                    <div className={styles.contactInfoTitle}>Compromiso de Respuesta</div>
                                    <div style={{ color: '#ffffff', fontWeight: 500, marginBottom: '4px' }}>Máximo 24 horas</div>
                                    <div className={styles.contactInfoDesc}>Priorizamos calidad y detalle en cada respuesta.</div>
                                </div>
                            </div>

                            <div className={glass.glassCardCompact} style={{ borderColor: 'rgba(0, 102, 255, 0.15)', marginTop: '8px' }}>
                                <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#ffffff' }}>¿Buscas algo específico?</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    Si ya tienes un presupuesto definido o un documento de requerimientos,
                                    menciónalo en el mensaje para agilizar el proceso de diagnóstico.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* ── Form Column ── */}
                    <ScrollReveal delay={0.15}>
                        <form className={`${glass.glassCard} ${styles.form}`} onSubmit={handleSubmit} style={{ padding: '40px' }}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Nombre completo *</label>
                                    <input className={glass.glassInput} required value={form.nombre}
                                        onChange={(e) => update('nombre', e.target.value)} placeholder="Ej. Juan Pérez" />
                                    {errors.nombre && <span className={styles.formError}>{errors.nombre}</span>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Correo *</label>
                                    <input className={glass.glassInput} type="email" required value={form.email}
                                        onChange={(e) => update('email', e.target.value)} placeholder="tu@empresa.com" />
                                    {errors.email && <span className={styles.formError}>{errors.email}</span>}
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Tipo de Solución *</label>
                                <select className={glass.glassInput} required value={form.tipo_proyecto}
                                    onChange={(e) => update('tipo_proyecto', e.target.value)}>
                                    <option value="">Selecciona una opción...</option>
                                    {SOLUTION_OPTIONS.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                                {errors.tipo_proyecto && <span className={styles.formError}>{errors.tipo_proyecto}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Cuéntanos sobre tu objetivo *</label>
                                <textarea className={glass.glassTextarea} required value={form.mensaje}
                                    onChange={(e) => update('mensaje', e.target.value)}
                                    placeholder="Describe brevemente el desafío que quieres resolver..." rows={5} />
                                {errors.mensaje && <span className={styles.formError}>{errors.mensaje}</span>}
                            </div>

                            <button type="submit" className={glass.btnPrimary}
                                style={{ width: '100%', marginTop: '8px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Iniciar Consultoría por WhatsApp
                            </button>

                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>
                                Serás redirigido a WhatsApp con tu mensaje prellenado.
                            </p>
                        </form>
                    </ScrollReveal>
                </div>

                {/* ── FAQ Section ── */}
                <ScrollReveal>
                    <div style={{ marginTop: '100px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: 700 }}>Preguntas frecuentes</h2>
                        </div>
                        <div className={styles.cardGrid}>
                            <div className={glass.glassCardCompact}>
                                <h4 style={{ marginBottom: '10px', color: '#ffffff' }}>¿Tienen costos fijos?</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    No. Cada proyecto es único. Cotizamos basándonos en la complejidad técnica y el valor estratégico.
                                </p>
                            </div>
                            <div className={glass.glassCardCompact}>
                                <h4 style={{ marginBottom: '10px', color: '#ffffff' }}>¿Cuánto tarda un desarrollo?</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    Una landing page puede estar lista en 1-2 semanas. Sistemas complejos de 4 a 12 semanas.
                                </p>
                            </div>
                            <div className={glass.glassCardCompact}>
                                <h4 style={{ marginBottom: '10px', color: '#ffffff' }}>¿Ofrecen mantenimiento?</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    Sí. Planes de acompañamiento continuo para que tu sistema esté siempre optimizado y seguro.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
