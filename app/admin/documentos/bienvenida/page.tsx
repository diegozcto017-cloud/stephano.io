'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';

function WelcomeContent() {
    const searchParams = useSearchParams();
    const previewRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        projectName: searchParams.get('proyecto') || 'Proyecto Digital Premium',
        portalLink: 'https://notion.so/stephano/portal-cliente-123456',
        overview: 'Este es el comienzo de tu transformación digital. En este portal encontrarás todo el material gráfico, accesos técnicos y seguimiento en tiempo real de tu proyecto.',
        nextSteps: '1. Revisión de Briefing\n2. Acceso a carpetas compartidas\n3. Sesión de kickoff estratégica',
        technicalDetails: 'Arquitectura: Next.js 15, Supabase, Tailwind CSS\nHosting: Vercel / Cloudflare\nDesign: Figma Premium Suite',
        contactEmail: 'diegozcto017@gmail.com',
        contactPhone: '+506 7116-4454'
    });

    const update = (field: string, value: string) => setForm({ ...form, [field]: value });

    const downloadPDF = async () => {
        if (!previewRef.current) return;
        setGenerating(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');
            const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: '#000000' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Welcome_${form.clientName.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
        }
        setGenerating(false);
    };

    const today = new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className={styles.adminContainer}>
            <div className={styles.adminPageHeader}>
                <div style={{ marginBottom: '16px' }}>
                    <Link href={clientId ? `/admin/clientes/${clientId}` : '/admin/clientes'} className={styles.btnGhost} style={{ fontSize: '13px', padding: '6px 0', border: 'none', background: 'none' }}>
                        ← Volver a Clientes
                    </Link>
                </div>
                <h1 className={styles.adminPageTitle}>Bienvenida al Cliente</h1>
                <p className={styles.adminPageDesc}>Configura el documento de onboarding para tu nuevo cliente.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
                {/* Form */}
                <div className={styles.detailCard} style={{ alignSelf: 'start' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Configuración de Bienvenida</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label className={styles.detailLabel}>Nombre del Cliente</label>
                            <input className={styles.adminInput} value={form.clientName} onChange={(e) => update('clientName', e.target.value)} placeholder="Ej: Juan Pérez" />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Nombre del Proyecto</label>
                            <input className={styles.adminInput} value={form.projectName} onChange={(e) => update('projectName', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Link al Portal (Notion/Link)</label>
                            <input className={styles.adminInput} value={form.portalLink} onChange={(e) => update('portalLink', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Resumen del Proyecto</label>
                            <textarea className={styles.adminTextarea} value={form.overview} onChange={(e) => update('overview', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Próximos Pasos</label>
                            <textarea className={styles.adminTextarea} value={form.nextSteps} onChange={(e) => update('nextSteps', e.target.value)} rows={4} />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Generar PDF de Bienvenida'}
                        </button>
                    </div>
                </div>

                {/* Live Preview (Dark Aesthetic) */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        Vista Previa (A4 Dark Mode)
                    </div>
                    <div ref={previewRef} style={{
                        background: '#000000',
                        color: '#ffffff',
                        width: '100%',
                        minHeight: '842px', // A4 aspect ratio base
                        padding: '60px',
                        fontFamily: 'SF Pro Display, Inter, sans-serif'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px' }}>
                            <div>
                                <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase' }}>WELCOME</h1>
                                <p style={{ fontSize: '14px', opacity: 0.5, marginTop: '5px' }}>ONBOARDING PACK · {today}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg, #0066FF, #00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stephano.io</div>
                                <div style={{ fontSize: '12px', opacity: 0.4 }}>Ingeniería Digital de Élite</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ marginBottom: '50px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>Hola, {form.clientName || '[Nombre del Cliente]'}</h2>
                            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', maxWidth: '600px' }}>
                                Todo nuestro equipo te da una cordial bienvenida. Estamos emocionados por iniciar la construcción de <strong>{form.projectName}</strong>.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '50px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '15px', textTransform: 'uppercase' }}>Portal del Cliente</h4>
                                <p style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '15px', color: 'rgba(255,255,255,0.7)' }}>
                                    Accede a tu panel centralizado en Notion para ver avances, archivos y cronograma.
                                </p>
                                <div style={{ fontSize: '12px', color: '#00E5FF', fontWeight: 600 }}>{form.portalLink}</div>
                            </div>
                            <div style={{ padding: '20px 0' }}>
                                <h4 style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '15px', textTransform: 'uppercase' }}>Soporte Directo</h4>
                                <div style={{ fontSize: '14px', marginBottom: '10px' }}>{form.contactEmail}</div>
                                <div style={{ fontSize: '14px' }}>{form.contactPhone}</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '50px' }}>
                            <h4 style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '20px', textTransform: 'uppercase' }}>Propósito del Proyecto</h4>
                            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap' }}>{form.overview}</p>
                        </div>

                        <div style={{ marginBottom: '80px' }}>
                            <h4 style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '20px', textTransform: 'uppercase' }}>Próximos Hitos</h4>
                            <div style={{ fontSize: '14px', lineHeight: 2, color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap' }}>{form.nextSteps}</div>
                        </div>

                        {/* Footer */}
                        <div style={{ marginTop: 'auto', textAlign: 'center', opacity: 0.2, fontSize: '11px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px' }}>
                            documento oficial de stephano.io — ingeniería digital premium — todos los derechos reservados © {new Date().getFullYear()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function WelcomePage() {
    return (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>}>
            <WelcomeContent />
        </Suspense>
    );
}
