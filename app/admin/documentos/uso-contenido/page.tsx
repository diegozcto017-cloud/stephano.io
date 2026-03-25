'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';
import DocumentPage from '@/components/AdminDocument/DocumentPage';

function UsoContenidoContent() {
    const searchParams = useSearchParams();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [generating, setGenerating] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        assetDescription: 'Este documento detalla los activos digitales entregados al cliente, incluyendo logotipos en diversos formatos (SVG, PNG, JPG), paletas de colores (HEX, RGB, CMYK), tipografías (archivos TTF, OTF), y guías de estilo para su aplicación en diferentes medios.',
        brandGuidelines: 'Utilizar el logotipo principal en fondos claros. Para fondos oscuros, usar la versión invertida. Mantener siempre un área de respeto alrededor del logotipo. No distorsionar, rotar o alterar los colores del logotipo. Las tipografías deben usarse según las especificaciones de la guía de estilo. Los colores deben aplicarse siguiendo la paleta definida para mantener la coherencia de marca.',
        usageScope: 'Los activos pueden ser utilizados en materiales de marketing digital (redes sociales, sitio web, email marketing), impresos (tarjetas de presentación, folletos, papelería) y presentaciones internas/externas. Se prohíbe la reventa o distribución de los activos a terceros sin autorización expresa de Stephano.io.',
        technicalSpecs: 'Logotipos: SVG (vectorial), PNG (fondo transparente, 300dpi), JPG (fondo blanco, 300dpi). Colores: HEX, RGB, CMYK. Tipografías: Archivos TTF/OTF. Formatos de imagen para web: optimizados para carga rápida (WebP, JPG progresivo).',
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
            
            pdf.save(`Uso_Contenido_${form.clientName.replace(/\s+/g, '_')}.pdf`);
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
                            <label className={styles.detailLabel}>Descripción de Activos</label>
                            <textarea className={styles.adminTextarea} value={form.assetDescription} onChange={(e) => update('assetDescription', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Directrices de Marca</label>
                            <textarea className={styles.adminTextarea} value={form.brandGuidelines} onChange={(e) => update('brandGuidelines', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Alcance de Uso</label>
                            <textarea className={styles.adminTextarea} value={form.usageScope} onChange={(e) => update('usageScope', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Especificaciones Técnicas</label>
                            <textarea className={styles.adminTextarea} value={form.technicalSpecs} onChange={(e) => update('technicalSpecs', e.target.value)} rows={3} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Fecha de Guía</label>
                            <input className={styles.adminInput} value={form.date} onChange={(e) => update('date', e.target.value)} />
                        </div>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Generar Guía PDF'}
                        </button>
                    </div>
                </div>

                {/* Live Preview - Page Based (NO NESTED SCROLL) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', background: 'rgba(0,0,0,0.1)', padding: '20px', borderRadius: '12px' }}>
                    
                    {/* PAGE 1: Overview & Guidelines */}
                    <div ref={(el) => { pageRefs.current[0] = el; }} id="pdf-page-0">
                        <DocumentPage pageNumber={1} total={2}>
                            <div style={{ marginTop: '40px' }}>
                                <h1 style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0, color: '#ffffff' }}>GUÍA DE USO<br /><span>DE CONTENIDO</span></h1>
                                <div style={{ fontSize: '12px', opacity: 0.4, marginTop: '10px', letterSpacing: '0.2em' }}>ASSET MANAGEMENT & BRAND GUIDELINES</div>
                            </div>

                            <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <h4 style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '10px' }}>PROPIETARIO</h4>
                                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{form.clientName || 'Cliente'}</div>
                                    <div style={{ fontSize: '13px', opacity: 0.6, marginTop: '4px' }}>Autorización de Uso Digital</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h4 style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '10px' }}>FECHA DE EMISIÓN</h4>
                                    <div style={{ fontSize: '16px', fontWeight: 700 }}>{form.date}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '60px' }}>
                                <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '20px' }}>DESCRIPCIÓN DE ACTIVOS</h3>
                                <div style={{ fontSize: '15px', lineHeight: 1.8, background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {form.assetDescription}
                                </div>
                            </div>

                            <div style={{ marginTop: '60px' }}>
                                <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '20px' }}>DIRECTRICES DE MARCA</h3>
                                <div style={{ fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.7)' }}>
                                    {form.brandGuidelines}
                                </div>
                            </div>
                        </DocumentPage>
                    </div>

                    {/* PAGE 2: Permissions & Specs */}
                    <div ref={(el) => { pageRefs.current[1] = el; }} id="pdf-page-1">
                        <DocumentPage pageNumber={2} total={2}>
                            <h3 style={{ fontSize: '14px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '30px' }}>LICENCIA Y PERMISOS</h3>
                            
                            <div style={{ marginBottom: '40px', padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ fontSize: '12px', color: '#ffffff', letterSpacing: '0.1em', marginBottom: '15px' }}>ALCANCE DE USO</h4>
                                <div style={{ fontSize: '14px', lineHeight: 2, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.9)' }}>{form.usageScope}</div>
                            </div>

                            <div style={{ marginBottom: '40px' }}>
                                <h4 style={{ fontSize: '12px', opacity: 0.4, marginBottom: '15px' }}>ESPECIFICACIONES TÉCNICAS</h4>
                                <div style={{ fontSize: '14px', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.7)' }}>{form.technicalSpecs}</div>
                            </div>

                            <div style={{ marginTop: 'auto', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', opacity: 0.5, fontStyle: 'italic', marginBottom: '10px' }}>Documento generado por el equipo técnico de Stephano.io.</div>
                                <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>Stephano.io</div>
                            </div>
                        </DocumentPage>
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
