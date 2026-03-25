'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';
import DocumentPage from '@/components/AdminDocument/DocumentPage';

function BienvenidaContent() {
    const searchParams = useSearchParams();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [generating, setGenerating] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        welcomeMessage: 'Todo nuestro equipo te da una cordial bienvenida. Estamos emocionados por iniciar la construcción de tu proyecto digital.',
        visionStatement: 'Crear soluciones digitales innovadoras que impulsen el crecimiento y la eficiencia de nuestros clientes.',
        techDetails: 'Arquitectura: Next.js 15, Supabase, Tailwind CSS\nHosting: Vercel / Cloudflare\nDesign: Figma Premium Suite',
        contacts: 'Email: diegozcto017@gmail.com\nTeléfono: +506 7116-4454\nSoporte: portal.stephano.io/soporte',
        date: new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
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
            
            pdf.save(`Bienvenida_${form.clientName.replace(/\s+/g, '_')}.pdf`);
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
                            <label className={styles.detailLabel}>Mensaje de Bienvenida</label>
                            <textarea className={styles.adminTextarea} value={form.welcomeMessage} onChange={(e) => update('welcomeMessage', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Declaración de Visión</label>
                            <textarea className={styles.adminTextarea} value={form.visionStatement} onChange={(e) => update('visionStatement', e.target.value)} rows={2} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Detalles Técnicos</label>
                            <textarea className={styles.adminTextarea} value={form.techDetails} onChange={(e) => update('techDetails', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Contactos Clave</label>
                            <textarea className={styles.adminTextarea} value={form.contacts} onChange={(e) => update('contacts', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Fecha Onboarding</label>
                            <input className={styles.adminInput} value={form.date} onChange={(e) => update('date', e.target.value)} />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Generar PDF de Bienvenida'}
                        </button>
                    </div>
                </div>

                {/* Live Preview - Page Based (NO NESTED SCROLL) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', background: 'rgba(0,0,0,0.1)', padding: '20px', borderRadius: '12px' }}>
                    
                    {/* PAGE 1: Welcome */}
                    <div ref={(el) => { pageRefs.current[0] = el; }} id="pdf-page-0">
                        <DocumentPage pageNumber={1} total={2}>
                            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                                <div style={{ fontSize: '13px', opacity: 0.3, letterSpacing: '0.4em', marginBottom: '20px' }}>ONBOARDING EXPERIENCE</div>
                                <h1 style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0, lineHeight: 1, color: '#ffffff' }}>BIENVENIDO A<br /><span>STEPHANO.IO</span></h1>
                                <div style={{ marginTop: '30px', height: '1px', width: '60px', background: '#FFFFFF', margin: '0 auto' }}></div>
                            </div>

                            <div style={{ marginTop: '60px', textAlign: 'center' }}>
                                <p style={{ fontSize: '24px', fontWeight: 300, color: '#fff', marginBottom: '30px' }}>Hola, <strong>{form.clientName || 'Cliente'}</strong></p>
                                <p style={{ fontSize: '18px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto' }}>
                                    {form.welcomeMessage}
                                </p>
                            </div>

                            <div style={{ marginTop: '60px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ fontSize: '12px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '15px' }}>NUESTRA VISIÓN COMPARTIDA</h4>
                                    <p style={{ fontSize: '16px', fontStyle: 'italic', opacity: 0.8 }}>&quot;{form.visionStatement}&quot;</p>
                                </div>
                            </div>
                        </DocumentPage>
                    </div>

                    {/* PAGE 2 */}
                    <div ref={(el) => { pageRefs.current[1] = el; }} id="pdf-page-1">
                        <DocumentPage pageNumber={2} total={2}>
                            <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '30px' }}>ACCESO Y SOPORTE TÉCNICO</h3>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '40px' }}>
                                <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ fontSize: '11px', opacity: 0.4, marginBottom: '10px' }}>DETALLES TÉCNICOS</h4>
                                    <div style={{ fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.8)' }}>{form.techDetails}</div>
                                </div>
                                <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ fontSize: '11px', opacity: 0.4, marginBottom: '10px' }}>CONTACTOS CLAVE</h4>
                                    <div style={{ fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.8)' }}>{form.contacts}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '5px' }}>Comencemos a construir el futuro.</div>
                                <div style={{ fontSize: '12px', opacity: 0.4 }}>EMITIDO EL {form.date}</div>
                            </div>
                        </DocumentPage>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BienvenidaPage() {
    return (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>}>
            <BienvenidaContent />
        </Suspense>
    );
}
