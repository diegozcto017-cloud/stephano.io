'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';
import DocumentPage from '@/components/AdminDocument/DocumentPage';

function ContratoContent() {
    const searchParams = useSearchParams();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
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
        date: new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }),
        contractDetails: ''
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
            
            pdf.save(`Contrato_${form.clientName.replace(/\s+/g, '_') || 'Cliente'}.pdf`);
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
                        <div>
                            <label className={styles.detailLabel}>Términos de Pago</label>
                            <input className={styles.adminInput} value={form.paymentTerms} onChange={(e) => update('paymentTerms', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Cronograma / Timeline</label>
                            <input className={styles.adminInput} value={form.timeline} onChange={(e) => update('timeline', e.target.value)} placeholder="Ej: 4 semanas" />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Fecha del Contrato</label>
                            <input className={styles.adminInput} value={form.date} onChange={(e) => update('date', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Detalles del Contrato</label>
                            <textarea className={styles.adminTextarea} value={form.contractDetails} onChange={(e) => update('contractDetails', e.target.value)} rows={5} placeholder="Describe el objeto del contrato..." />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Generar Contrato PDF'}
                        </button>
                    </div>
                </div>

                {/* Live Preview - Page Based (NO NESTED SCROLL) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', background: 'rgba(0,0,0,0.1)', padding: '20px', borderRadius: '12px' }}>
                    
                    {/* PAGE 1: Parties */}
                    <div ref={(el) => { pageRefs.current[0] = el; }} id="pdf-page-0">
                        <DocumentPage pageNumber={1} total={3}>
                            <div style={{ marginTop: '40px', textAlign: 'left' }}>
                                <div style={{ fontSize: '13px', opacity: 0.3, letterSpacing: '0.4em', marginBottom: '15px' }}>OFFICIAL AGREEMENT</div>
                                <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0, lineHeight: 1.1, color: '#ffffff' }}>CONTRATO DE<br /><span>SERVICIOS</span></h1>
                                <div style={{ marginTop: '30px', height: '1px', width: '60px', background: '#FFFFFF' }}></div>
                            </div>

                            <div style={{ marginTop: '60px' }}>
                                <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '20px' }}>IDENTIFICACIÓN DE LAS PARTES</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', opacity: 0.4, marginBottom: '5px' }}>EL PRESTADOR</div>
                                        <div style={{ fontSize: '15px', fontWeight: 700 }}>Stephano.io</div>
                                        <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '5px' }}>Engineering & Digital Strategy Agency</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', opacity: 0.4, marginBottom: '5px' }}>EL CLIENTE</div>
                                        <div style={{ fontSize: '15px', fontWeight: 700 }}>{form.clientName || '[Nombre del Cliente]'}</div>
                                        <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '5px' }}>{form.clientCompany || '[Empresa]'}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '60px' }}>
                                <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '20px' }}>OBJETO DEL CONTRATO</h3>
                                <div style={{ fontSize: '15px', lineHeight: 1.8, background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {form.contractDetails || 'Desarrollo de proyecto digital según especificaciones técnicas adjuntas.'}
                                </div>
                            </div>
                        </DocumentPage>
                    </div>

                    {/* PAGE 2: Timeline & Payment */}
                    <div ref={(el) => { pageRefs.current[1] = el; }} id="pdf-page-1">
                        <DocumentPage pageNumber={2} total={3}>
                            <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '30px' }}>CRONOGRAMA Y TÉRMINOS ECONÓMICOS</h3>
                            
                            <div style={{ marginBottom: '40px' }}>
                                <h4 style={{ fontSize: '12px', opacity: 0.4, marginBottom: '15px' }}>CRONOGRAMA DE ENTREGA</h4>
                                <div style={{ fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.8)' }}>{form.timeline || 'Por definir...'}</div>
                            </div>

                            <div style={{ padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ fontSize: '12px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '15px' }}>CONDICIONES DE PAGO</h4>
                                <div style={{ fontSize: '14px', lineHeight: 2, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.8)' }}>{form.paymentTerms}</div>
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <h4 style={{ fontSize: '12px', opacity: 0.4, marginBottom: '15px' }}>DURACIÓN DEL ACUERDO</h4>
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>Inicia el {form.date}. Los términos de mantenimiento se renovarán mensualmente según lo acordado.</div>
                            </div>
                        </DocumentPage>
                    </div>

                    {/* PAGE 3: Final Clauses & Signatures */}
                    <div ref={(el) => { pageRefs.current[2] = el; }} id="pdf-page-2">
                        <DocumentPage pageNumber={3} total={3}>
                            <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '30px' }}>CLÁUSULAS FINALES Y CONFORMIDAD</h3>
                            
                            <div style={{ fontSize: '13px', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: '60px' }}>
                                <p>1. PROPIEDAD INTELECTUAL: El código fuente y diseños pasarán a ser propiedad del cliente tras el pago final.</p>
                                <p style={{ marginTop: '15px' }}>2. CONFIDENCIALIDAD: Ambas partes se comprometen a no divulgar información estratégica del proyecto.</p>
                                <p style={{ marginTop: '15px' }}>3. JURISDICCIÓN: Para cualquier discrepancia, las partes se someten a las leyes vigentes del país de origen del prestador.</p>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', paddingTop: '60px' }}>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px' }}>
                                    <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: '20px' }}>POR STEPHANO.IO</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700 }}>Stephano Team</div>
                                    <div style={{ fontSize: '12px', opacity: 0.4 }}>Authorized Signature</div>
                                </div>
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px' }}>
                                    <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: '20px' }}>POR EL CLIENTE</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{form.clientName || 'Cliente'}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.4 }}>Authorized Representative</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '11px', opacity: 0.3 }}>
                                FECHA DE FIRMA: {form.date}
                            </div>
                        </DocumentPage>
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
