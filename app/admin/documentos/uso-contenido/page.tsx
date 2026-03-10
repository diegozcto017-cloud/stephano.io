'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';

function UsoContenidoContent() {
    const searchParams = useSearchParams();
    const previewRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        vision: 'Convertir la marca en una autoridad técnica indiscutible en el mercado regional mediante un lenguaje visual y escrito de vanguardia.',
        toneVoice: 'Profesional, Directo, Tecnológico. Evitamos tecnicismos innecesarios pero mantenemos una postura de experto.',
        visualHierarchy: '1. Propuesta de Valor (H1)\n2. Beneficios de Negocio (H2)\n3. Evidencia Técnica (P)',
        contentStrategy: '- Publicación semanal de casos de éxito\n- Enfoque en LinkedIn para B2B\n- Newsletter técnico mensual'
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
            pdf.save(`Guia_Contenido_${form.clientName.replace(/\s+/g, '_')}.pdf`);
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
                <h1 className={styles.adminPageTitle}>Guía de Uso de Contenido</h1>
                <p className={styles.adminPageDesc}>Instrucciones estratégicas para que el cliente gestione su nueva marca Stephano.io.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
                <div className={styles.detailCard} style={{ alignSelf: 'start' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Estrategia de Contenido</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label className={styles.detailLabel}>Cliente</label>
                            <input className={styles.adminInput} value={form.clientName} onChange={(e) => update('clientName', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Visión de Comunicación</label>
                            <textarea className={styles.adminTextarea} value={form.vision} onChange={(e) => update('vision', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Tono y Voz</label>
                            <textarea className={styles.adminTextarea} value={form.toneVoice} onChange={(e) => update('toneVoice', e.target.value)} rows={2} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Jerarquía de Mensajes</label>
                            <textarea className={styles.adminTextarea} value={form.visualHierarchy} onChange={(e) => update('visualHierarchy', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Plan de Acción</label>
                            <textarea className={styles.adminTextarea} value={form.contentStrategy} onChange={(e) => update('contentStrategy', e.target.value)} rows={3} />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Generar Guía PDF'}
                        </button>
                    </div>
                </div>

                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        Guía de Identidad Digital
                    </div>
                    <div ref={previewRef} style={{ background: '#000000', color: '#ffffff', width: '100%', minHeight: '842px', padding: '70px', fontFamily: 'Inter, sans-serif' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '80px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px' }}>
                            <div>
                                <h1 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>CONTENT GUIDE</h1>
                                <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '5px' }}>STEPHANO BRAND SYSTEMS · {new Date().getFullYear()}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg, #0066FF, #00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stephano.io</div>
                                <div style={{ fontSize: '11px', opacity: 0.4 }}>Creative & Engineering Suite</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '60px' }}>
                            <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '15px' }}>LA VISIÓN</h4>
                            <p style={{ fontSize: '18px', lineHeight: 1.6, fontWeight: 700, color: '#00E5FF' }}>{form.vision}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '60px' }}>
                            <div>
                                <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '15px' }}>TONO Y VOZ</h4>
                                <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>{form.toneVoice}</div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '15px' }}>JERARQUÍA VISUAL</h4>
                                <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap' }}>{form.visualHierarchy}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '20px' }}>ESTRATEGIA DE CANALES</h4>
                            <div style={{ fontSize: '15px', lineHeight: 2, color: '#fff', borderLeft: '1px solid #0066FF', paddingLeft: '25px', whiteSpace: 'pre-wrap' }}>{form.contentStrategy}</div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '100px', display: 'flex', gap: '15px', alignItems: 'center', opacity: 0.3 }}>
                            <div style={{ width: '40px', height: '1px', background: '#0066FF' }}></div>
                            <div style={{ fontSize: '11px' }}>STEPHANO.IO — DIGITAL ENGINEERING & DESIGN</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UsoContenidoPage() {
    return (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>}>
            <UsoContenidoContent />
        </Suspense>
    );
}
