'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';
import DocumentPage from '@/components/AdminDocument/DocumentPage';

function GraciasContent() {
    const searchParams = useSearchParams();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [generating, setGenerating] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        message: '¡Estamos en vivo! Ha sido un viaje increíble transformar tu visión en una realidad digital de alto rendimiento. Gracias por confiar en Stephano. Tu éxito es nuestra mejor referencia. Nos vemos en la próxima fase de escalabilidad.',
        date: new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
    });

    const update = (field: string, value: string) => setForm({ ...form, [field]: value });

    const downloadPDF = async () => {
        setGenerating(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF('p', 'mm', 'letter');
            
            const page = pageRefs.current[0];
            if (!page) throw new Error('Page reference not found for PDF generation.');
            
            const canvas = await html2canvas(page, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#000000',
                logging: false,
                onclone: (clonedDoc) => {
                    const element = clonedDoc.getElementById('pdf-page-0');
                    if (element) {
                        element.style.margin = '0';
                        element.style.boxShadow = 'none';
                    }
                }
            });
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            pdf.addImage(imgData, 'PNG', 0, 0, 215.9, 279.4, undefined, 'FAST');
            
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
                            <label className={styles.detailLabel}>Mensaje de Agradecimiento</label>
                            <textarea className={styles.adminTextarea} value={form.message} onChange={(e) => update('message', e.target.value)} rows={6} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Fecha de Entrega</label>
                            <input className={styles.adminInput} value={form.date} onChange={(e) => update('date', e.target.value)} />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Generar PDF Final'}
                        </button>
                    </div>
                </div>

                                {/* Live Preview - Page Based (NO NESTED SCROLL) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', background: 'rgba(0,0,0,0.1)', padding: '20px', borderRadius: '12px' }}>
                    
                    {/* PAGE 1: Thanks */}
                    <div ref={(el) => { pageRefs.current[0] = el; }} id="pdf-page-0">
                        <DocumentPage pageNumber={1} total={1}>
                            <div style={{ marginTop: '60px', textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', opacity: 0.3, letterSpacing: '0.5em', marginBottom: '20px' }}>THANK YOU</div>
                                <h1 style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-0.05em', margin: 0, lineHeight: 1, color: '#ffffff' }}>GRACIAS POR<br /><span>CONFIAR</span></h1>
                                <div style={{ marginTop: '30px', height: '1px', width: '80px', background: '#FFFFFF', margin: '0 auto' }}></div>
                            </div>

                            <div style={{ marginTop: '80px', textAlign: 'center' }}>
                                <p style={{ fontSize: '24px', fontWeight: 300, color: '#fff', marginBottom: '40px' }}>Estimado(a) <strong>{form.clientName || 'Cliente'}</strong>,</p>
                                <div style={{ fontSize: '18px', lineHeight: 2, color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', whiteSpace: 'pre-wrap' }}>
                                    {form.message}
                                </div>
                            </div>

                            <div style={{ marginTop: '80px', textAlign: 'center' }}>
                                <div style={{ display: 'inline-block', padding: '30px 50px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ fontSize: '12px', opacity: 0.4, marginBottom: '10px' }}>FECHA DE CIERRE</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{form.date}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '40px' }}>
                                <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginBottom: '10px' }}>Stephano.io</div>
                                <div style={{ fontSize: '12px', opacity: 0.3 }}>Innovación y Excelencia Digital</div>
                            </div>
                        </DocumentPage>
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
