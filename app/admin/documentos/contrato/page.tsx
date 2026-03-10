'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';

function ContratoContent() {
    const searchParams = useSearchParams();
    const previewRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        clientEmail: searchParams.get('email') || '',
        clientCompany: searchParams.get('empresa') || '',
        projectType: searchParams.get('proyecto') || '',
        scope: '',
        deliverables: '',
        timeline: '',
        price: '',
        paymentTerms: '50% al inicio, 50% al finalizar',
        startDate: new Date().toISOString().split('T')[0],
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
            pdf.save(`Contrato_${form.clientName.replace(/\s+/g, '_')}.pdf`);
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
                <h1 className={styles.adminPageTitle}>Generador de Contrato</h1>
                <p className={styles.adminPageDesc}>Completa los campos y genera un contrato oficial premium.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
                {/* Form */}
                <div className={styles.detailCard} style={{ alignSelf: 'start' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Datos del Contrato</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label className={styles.detailLabel}>Nombre del Cliente</label>
                            <input className={styles.adminInput} value={form.clientName} onChange={(e) => update('clientName', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Empresa</label>
                            <input className={styles.adminInput} value={form.clientCompany} onChange={(e) => update('clientCompany', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Email</label>
                            <input className={styles.adminInput} value={form.clientEmail} onChange={(e) => update('clientEmail', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Tipo de Proyecto</label>
                            <input className={styles.adminInput} value={form.projectType} onChange={(e) => update('projectType', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Alcance del Proyecto</label>
                            <textarea className={styles.adminTextarea} value={form.scope} onChange={(e) => update('scope', e.target.value)} rows={3} placeholder="Describe el alcance..." />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Entregables</label>
                            <textarea className={styles.adminTextarea} value={form.deliverables} onChange={(e) => update('deliverables', e.target.value)} rows={3} placeholder="Lista de entregables..." />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Inversión Total</label>
                            <input className={styles.adminInput} value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="$0.00" />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Generar Contrato PDF'}
                        </button>
                    </div>
                </div>

                {/* Live Preview (A4 Dark Mode Sync) */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        Documento Oficial (A4 Dark)
                    </div>
                    <div ref={previewRef} style={{
                        background: '#000000',
                        color: '#ffffff',
                        width: '100%',
                        minHeight: '842px',
                        padding: '70px',
                        fontFamily: 'Inter, sans-serif'
                    }}>
                        {/* Header Branding */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '40px' }}>
                            <div>
                                <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0, textTransform: 'uppercase' }}>CONTRATO DE<br />SERVICIOS DIGITALES</h1>
                                <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '10px' }}>OFFICIAL CONTRACT · {today}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end', marginBottom: '5px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 900, background: 'linear-gradient(135deg, #0066FF, #00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stephano.io</div>
                                </div>
                                <div style={{ fontSize: '11px', opacity: 0.4 }}>Ingeniería de Software Premium</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ marginBottom: '40px' }}>
                            <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '15px' }}>01 / LAS PARTES</h4>
                            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
                                El presente contrato se celebra entre <strong>Stephano.io</strong> (&quot;El Proveedor&quot;) y <strong>{form.clientName || '[Nombre del Cliente]'}</strong>
                                {form.clientCompany && <>, representante de <strong>{form.clientCompany}</strong></>} (&quot;El Cliente&quot;).
                            </p>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '15px' }}>02 / OBJETO Y PROYECTO</h4>
                            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
                                Desarrollo integral de un proyecto tipo <strong>{form.projectType || 'Software a Medida'}</strong> diseñado bajo estándares de alto rendimiento.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
                            <div>
                                <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '15px' }}>03 / ALCANCE TÉCNICO</h4>
                                <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#fff', whiteSpace: 'pre-wrap' }}>{form.scope || 'Por definir...'}</div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '15px' }}>04 / ENTREGABLES</h4>
                                <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#fff', whiteSpace: 'pre-wrap' }}>{form.deliverables || 'Por definir...'}</div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '60px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontSize: '11px', opacity: 0.6, letterSpacing: '0.2em' }}>05 / INVERSIÓN TOTAL</h4>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#00E5FF' }}>{form.price || '$0.00'}</div>
                            </div>
                            <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '10px' }}>Condiciones: {form.paymentTerms}</p>
                        </div>

                        {/* Signatures */}
                        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', paddingTop: '40px' }}>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700 }}>STEPHANO.IO</div>
                                <div style={{ fontSize: '10px', opacity: 0.3 }}>Firma Autorizada</div>
                            </div>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700 }}>{form.clientName.toUpperCase() || 'CLIENTE'}</div>
                                <div style={{ fontSize: '10px', opacity: 0.3 }}>Firma del Cliente</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '60px', textAlign: 'center', opacity: 0.2, fontSize: '10px', letterSpacing: '0.1em' }}>
                            STEPHANO.IO — DIGITAL ENGINEERING SUITE — {new Date().getFullYear()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ContratoPage() {
    return (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>}>
            <ContratoContent />
        </Suspense>
    );
}
