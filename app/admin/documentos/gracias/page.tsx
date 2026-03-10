'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';

function GraciasContent() {
    const searchParams = useSearchParams();
    const previewRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        celebration: '¡Estamos en vivo! Ha sido un viaje increíble transformar tu visión en una realidad digital de alto rendimiento.',
        assetsLink: 'https://drive.google.com/stephano/assets/final-pack-2026',
        supportPlan: 'Cuentas con 30 días de soporte prioritario gratuito y monitorización 24/7 de estabilidad.',
        finalNote: 'Gracias por confiar en Stephano. Tu éxito es nuestra mejor referencia. Nos vemos en la próxima fase de escalabilidad.'
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
            pdf.save(`Gracias_${form.clientName.replace(/\s+/g, '_')}.pdf`);
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
                <h1 className={styles.adminPageTitle}>Documento de Agradecimiento</h1>
                <p className={styles.adminPageDesc}>Envía un cierre profesional y celebra el éxito del proyecto con la marca Stephano.io.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
                <div className={styles.detailCard} style={{ alignSelf: 'start' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Cierre de Proyecto</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label className={styles.detailLabel}>Cliente</label>
                            <input className={styles.adminInput} value={form.clientName} onChange={(e) => update('clientName', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Mensaje de Celebración</label>
                            <textarea className={styles.adminTextarea} value={form.celebration} onChange={(e) => update('celebration', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Link de Entrega Final</label>
                            <input className={styles.adminInput} value={form.assetsLink} onChange={(e) => update('assetsLink', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Plan de Soporte Post-Lanzamiento</label>
                            <textarea className={styles.adminTextarea} value={form.supportPlan} onChange={(e) => update('supportPlan', e.target.value)} rows={2} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Nota Final de Gratitud</label>
                            <textarea className={styles.adminTextarea} value={form.finalNote} onChange={(e) => update('finalNote', e.target.value)} rows={3} />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Generar PDF Final'}
                        </button>
                    </div>
                </div>

                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        Documento de Despedida
                    </div>
                    <div ref={previewRef} style={{ background: '#000000', color: '#ffffff', width: '100%', minHeight: '842px', padding: '100px 70px', fontFamily: 'Inter, sans-serif', position: 'relative' }}>

                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                            <div style={{ fontSize: '14px', opacity: 0.3, letterSpacing: '0.4em', marginBottom: '20px' }}>PROJECT COMPLETE</div>
                            <h1 style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-0.05em', margin: 0, lineHeight: 0.9 }}>THANK YOU</h1>
                            <div style={{ marginTop: '20px', height: '2px', width: '40px', background: '#0066FF', margin: '20px auto' }}></div>
                        </div>

                        <div style={{ marginBottom: '60px' }}>
                            <p style={{ fontSize: '20px', lineHeight: 1.6, color: '#fff', fontWeight: 300, textAlign: 'center' }}>
                                Estimado <strong>{form.clientName || 'Cliente'}</strong>,
                            </p>
                            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: '600px', margin: '20px auto' }}>
                                {form.celebration}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '60px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.1em', marginBottom: '10px' }}>ENTREGA FINAL</h4>
                                <div style={{ fontSize: '12px', color: '#00E5FF', wordBreak: 'break-all' }}>{form.assetsLink}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ fontSize: '11px', opacity: 0.3, letterSpacing: '0.1em', marginBottom: '10px' }}>SOPORTE</h4>
                                <div style={{ fontSize: '12px', color: '#fff' }}>{form.supportPlan}</div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <div style={{ fontSize: '18px', fontStyle: 'italic', fontWeight: 300, color: 'rgba(255,255,255,0.9)' }}>
                                &quot;{form.finalNote}&quot;
                            </div>
                        </div>

                        <div style={{ position: 'absolute', bottom: '60px', left: '0', right: '0', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 900, background: 'linear-gradient(135deg, #0066FF, #00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '5px' }}>Stephano.io</div>
                            <div style={{ fontSize: '10px', opacity: 0.2 }}>DIGITAL ENGINEERING EXCELLENCE · {new Date().getFullYear()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GraciasPage() {
    return (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>}>
            <GraciasContent />
        </Suspense>
    );
}
