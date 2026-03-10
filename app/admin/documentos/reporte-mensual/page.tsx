'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';

function MonthlyReportContent() {
    const searchParams = useSearchParams();
    const previewRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        reportMonth: new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' }),
        summary: 'Este mes nos enfocamos en optimizar la arquitectura del servidor y mejorar el SEO core. Los resultados muestran un incremento significativo en la velocidad de carga.',
        metrics: 'Velocidad de Carga: +15%\nSalud SEO: 98%\nUptime: 100%',
        workDone: '- Refactorización de componentes críticos\n- Implementación de nuevas API routes\n- Optimización de imágenes y assets',
        futureWork: '- Implementación de sistema de analíticas avanzado\n- Módulo de suscripciones\n- Integración con CRM externo',
        strategicNote: 'Recomendamos iniciar la fase de marketing de contenidos para capitalizar la mejora en el ranking de Google.'
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
            pdf.save(`Reporte_${form.clientName.replace(/\s+/g, '_')}_${form.reportMonth.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
        }
        setGenerating(false);
    };

    return (
        <div className={styles.adminContainer}>
            <div className={styles.adminPageHeader}>
                <div style={{ marginBottom: '16px' }}>
                    <Link href={clientId ? `/admin/clientes/${clientId}` : '/admin/clientes'} className={styles.btnGhost} style={{ fontSize: '13px', padding: '6px 0', border: 'none', background: 'none' }}>
                        ← Volver a Clientes
                    </Link>
                </div>
                <h1 className={styles.adminPageTitle}>Reporte Mensual</h1>
                <p className={styles.adminPageDesc}>Genera un reporte de rendimiento y avances para tus clientes con la marca Stephano.io.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
                {/* Form */}
                <div className={styles.detailCard} style={{ alignSelf: 'start' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Datos del Reporte</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label className={styles.detailLabel}>Nombre del Cliente</label>
                            <input className={styles.adminInput} value={form.clientName} onChange={(e) => update('clientName', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Mes del Reporte</label>
                            <input className={styles.adminInput} value={form.reportMonth} onChange={(e) => update('reportMonth', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Resumen Ejecutivo</label>
                            <textarea className={styles.adminTextarea} value={form.summary} onChange={(e) => update('summary', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Métricas Clave (Una por línea)</label>
                            <textarea className={styles.adminTextarea} value={form.metrics} onChange={(e) => update('metrics', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Trabajo Realizado</label>
                            <textarea className={styles.adminTextarea} value={form.workDone} onChange={(e) => update('workDone', e.target.value)} rows={4} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Próximo Mes</label>
                            <textarea className={styles.adminTextarea} value={form.futureWork} onChange={(e) => update('futureWork', e.target.value)} rows={3} />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Descargar Reporte Mensual'}
                        </button>
                    </div>
                </div>

                {/* Live Preview (Dark Aesthetic) */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        Vista Previa Reporte Mensual
                    </div>
                    <div ref={previewRef} style={{
                        background: '#000000',
                        color: '#ffffff',
                        width: '100%',
                        minHeight: '842px',
                        padding: '60px',
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px' }}>
                            <div>
                                <h1 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>MONTHLY REPORT</h1>
                                <p style={{ fontSize: '14px', opacity: 0.5, marginTop: '5px', textTransform: 'uppercase' }}>Stephano.io · {form.reportMonth}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg, #0066FF, #00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stephano.io</div>
                                <div style={{ fontSize: '12px', opacity: 0.4 }}>Performance Engineering</div>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <div style={{ marginBottom: '60px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderLeft: '4px solid #0066FF', paddingLeft: '15px' }}>Resumen Ejecutivo</h3>
                            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{form.summary}</p>
                        </div>

                        {/* Metrics Grid */}
                        <div style={{ marginBottom: '60px' }}>
                            <h4 style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '20px', textTransform: 'uppercase' }}>Métricas de Rendimiento</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                {form.metrics.split('\n').map((m, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '11px', opacity: 0.4, marginBottom: '10px' }}>{m.split(':')[0]}</div>
                                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#00E5FF' }}>{m.split(':')[1] || '---'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
                            <div>
                                <h4 style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '20px', textTransform: 'uppercase' }}>Hitos Completados</h4>
                                <div style={{ fontSize: '14px', lineHeight: 2, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap' }}>{form.workDone}</div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '20px', textTransform: 'uppercase' }}>Plan Estratégico Próximo</h4>
                                <div style={{ fontSize: '14px', lineHeight: 2, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap' }}>{form.futureWork}</div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(0,102,255,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(0,102,255,0.2)' }}>
                            <h4 style={{ fontSize: '12px', opacity: 0.6, letterSpacing: '0.1em', marginBottom: '15px', textTransform: 'uppercase', color: '#00E5FF' }}>Nota Estratégica</h4>
                            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>&quot;{form.strategicNote}&quot;</p>
                        </div>

                        <div style={{ marginTop: 'auto', textAlign: 'center', opacity: 0.2, fontSize: '10px', paddingTop: '60px' }}>
                            STEPHANO.IO — MONITORIZACIÓN Y RENDIMIENTO — © {new Date().getFullYear()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReporteMensualPage() {
    return (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>}>
            <MonthlyReportContent />
        </Suspense>
    );
}
