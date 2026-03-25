'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';
import DocumentPage from '@/components/AdminDocument/DocumentPage';

function ReporteContent() {
    const searchParams = useSearchParams();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [generating, setGenerating] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        month: new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' }),
        overview: 'Este mes nos enfocamos en optimizar la arquitectura del servidor y mejorar el SEO core. Los resultados muestran un incremento significativo en la velocidad de carga.',
        growth: '+15%',
        newReviews: '5',
        leads: '20',
        achievements: '- Refactorización de componentes críticos\n- Implementación de nuevas API routes\n- Optimización de imágenes y assets',
        insights: 'Recomendamos iniciar la fase de marketing de contenidos para capitalizar la mejora en el ranking de Google.',
        nextSteps: '- Implementación de sistema de analíticas avanzado\n- Módulo de suscripciones\n- Integración con CRM externo',
        dateToday: new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
    });

    const update = (field: string, value: string) => setForm({ ...form, [field]: value });

    const downloadPDF = async () => {
        setGenerating(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF('p', 'mm', 'letter');
            
            for (let i = 0; i < pageRefs.current.length; i++) {
                const page = pageRefs.current[i];
                if (!page) continue;
                
                const canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#000000',
                    logging: false,
                    onclone: (clonedDoc) => {
                        const element = clonedDoc.getElementById('pdf-page-' + i);
                        if (element) {
                            element.style.margin = '0';
                            element.style.boxShadow = 'none';
                        }
                    }
                });
                
                const imgData = canvas.toDataURL('image/png', 1.0);
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, 0, 215.9, 279.4, undefined, 'FAST');
            }
            
            pdf.save(`Reporte_${form.clientName.replace(/\s+/g, '_')}_${form.month}.pdf`);
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
                <div className={styles.detailCard} style={{ alignSelf: 'start' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Datos del Reporte</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label className={styles.detailLabel}>Nombre del Cliente</label>
                            <input className={styles.adminInput} value={form.clientName} onChange={(e) => update('clientName', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Mes del Reporte</label>
                            <input className={styles.adminInput} value={form.month} onChange={(e) => update('month', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Resumen Ejecutivo</label>
                            <textarea className={styles.adminTextarea} value={form.overview} onChange={(e) => update('overview', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Crecimiento (Ej: +15%)</label>
                            <input className={styles.adminInput} value={form.growth} onChange={(e) => update('growth', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Nuevas Reseñas Google</label>
                            <input className={styles.adminInput} value={form.newReviews} onChange={(e) => update('newReviews', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Total Leads</label>
                            <input className={styles.adminInput} value={form.leads} onChange={(e) => update('leads', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Logros Alcanzados</label>
                            <textarea className={styles.adminTextarea} value={form.achievements} onChange={(e) => update('achievements', e.target.value)} rows={4} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Áreas de Oportunidad / Insights</label>
                            <textarea className={styles.adminTextarea} value={form.insights} onChange={(e) => update('insights', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Próximos Pasos</label>
                            <textarea className={styles.adminTextarea} value={form.nextSteps} onChange={(e) => update('nextSteps', e.target.value)} rows={2} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Fecha de Emisión</label>
                            <input className={styles.adminInput} value={form.dateToday} onChange={(e) => update('dateToday', e.target.value)} />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Descargar Reporte Mensual'}
                        </button>
                    </div>
                </div>

                {/* Live Preview - Page Based (NO NESTED SCROLL) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', background: 'rgba(0,0,0,0.1)', padding: '20px', borderRadius: '12px' }}>
                    
                    {/* PAGE 1: Monthly Overview */}
                    <div ref={(el) => { pageRefs.current[0] = el; }} id="pdf-page-0">
                        <DocumentPage pageNumber={1} total={2}>
                            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0, color: '#ffffff' }}>REPORTE<br /><span>MENSUAL</span></h1>
                                    <div style={{ fontSize: '13px', opacity: 0.4, marginTop: '10px', letterSpacing: '0.2em' }}>{form.month.toUpperCase()} · PERFORMANCE SUMMARY</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', opacity: 0.4, marginBottom: '5px' }}>PREPARADO PARA</div>
                                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{form.clientName || 'Cliente'}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '60px' }}>
                                <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '20px' }}>RESUMEN EJECUTIVO</h3>
                                <div style={{ fontSize: '15px', lineHeight: 1.8, background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {form.overview}
                                </div>
                            </div>

                            <div style={{ marginTop: '60px' }}>
                                <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '20px' }}>MÉTRICAS CLAVE</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: '10px' }}>CRECIMIENTO</div>
                                        <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{form.growth}</div>
                                    </div>
                                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: '10px' }}>RESEÑAS GOOGLE</div>
                                        <div style={{ fontSize: '24px', fontWeight: 900 }}>{form.newReviews}</div>
                                    </div>
                                    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: '10px' }}>TOTAL LEADS</div>
                                        <div style={{ fontSize: '24px', fontWeight: 900 }}>{form.leads}</div>
                                    </div>
                                </div>
                            </div>
                        </DocumentPage>
                    </div>

                    {/* PAGE 2: Insights & Strategies */}
                    <div ref={(el) => { pageRefs.current[1] = el; }} id="pdf-page-1">
                        <DocumentPage pageNumber={2} total={2}>
                            <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '30px' }}>ANÁLISIS E INSIGHTS</h3>
                            
                            <div style={{ marginBottom: '40px' }}>
                                <h4 style={{ fontSize: '12px', opacity: 0.4, marginBottom: '15px' }}>LOGROS ALCANZADOS</h4>
                                <div style={{ fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.8)' }}>{form.achievements}</div>
                            </div>

                            <div style={{ padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
                                <h4 style={{ fontSize: '12px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '15px' }}>ÁREAS DE OPORTUNIDAD</h4>
                                <div style={{ fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.8)' }}>{form.insights}</div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '20px' }}>PRÓXIMOS PASOS</h3>
                                <div style={{ fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.8)' }}>{form.nextSteps}</div>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <div style={{ fontSize: '11px', opacity: 0.3 }}>EMITIDO EL {form.dateToday} · STEPHANO.IO PERFORMANCE DIVISION</div>
                            </div>
                        </DocumentPage>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReporteMensualPage() {
    return (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>}>
            <ReporteContent />
        </Suspense>
    );
}
