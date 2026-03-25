'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';
import DocumentPage from '@/components/AdminDocument/DocumentPage';

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

function FacturaContent() {
    const searchParams = useSearchParams();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [generating, setGenerating] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    const clientId = searchParams.get('clientId');

    const [form, setForm] = useState({
        clientName: searchParams.get('nombre') || '',
        clientEmail: searchParams.get('email') || '',
        clientCompany: searchParams.get('empresa') || '',
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        dueDate: '',
        notes: '',
        date: new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    const [items, setItems] = useState<InvoiceItem[]>([
        { description: 'Consultoría Digital / Implementación', quantity: 1, unitPrice: 0 },
    ]);

    const update = (field: string, value: string) => setForm({ ...form, [field]: value });

    const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
    const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof InvoiceItem, value: string | number) => {
        const updated = [...items];
        const item = { ...updated[i] };
        if (field === 'description') item.description = value as string;
        else if (field === 'quantity') item.quantity = value as number;
        else if (field === 'unitPrice') item.unitPrice = value as number;
        updated[i] = item;
        setItems(updated);
    };

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const saveInvoice = async () => {
        setSaving(true);
        try {
            const adminKey = (await import('@/server/actions/auth.action')).getAdminApiKey;
            const key = await adminKey();
            await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': key || '' },
                body: JSON.stringify({
                    numero: form.invoiceNumber,
                    lead_id: clientId ? parseInt(clientId) : null,
                    client_name: form.clientName,
                    client_email: form.clientEmail,
                    client_company: form.clientCompany,
                    items,
                    subtotal,
                    tax,
                    total,
                    due_date: form.dueDate || null,
                    notes: form.notes || null,
                }),
            });
            setSaved(true);
        } catch { /* silent */ } finally {
            setSaving(false);
        }
    };
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
            
            pdf.save(`Factura_${form.invoiceNumber.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
        }
        setGenerating(false);
    };


    const fmt = (n: number) => n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className={styles.adminContainer}>
            <div className={styles.adminPageHeader}>
                <div style={{ marginBottom: '16px' }}>
                    <Link href={clientId ? `/admin/clientes/${clientId}` : '/admin/clientes'} className={styles.btnGhost} style={{ fontSize: '13px', padding: '6px 0', border: 'none', background: 'none' }}>
                        ← Volver a Clientes
                    </Link>
                </div>
                <h1 className={styles.adminPageTitle}>Generador de Factura</h1>
                <p className={styles.adminPageDesc}>Genera documentos de cobro profesionales con la marca Stephano.io</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '24px' }}>
                {/* Form */}
                <div className={styles.detailCard} style={{ alignSelf: 'start' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Configuración</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label className={styles.detailLabel}>N.º de Factura</label>
                            <input className={styles.adminInput} value={form.invoiceNumber} onChange={(e) => update('invoiceNumber', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Vencimiento</label>
                            <input className={styles.adminInput} type="date" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Fecha Emisión</label>
                            <input className={styles.adminInput} value={form.date} onChange={(e) => update('date', e.target.value)} />
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Notas Adicionales</label>
                            <textarea className={styles.adminTextarea} value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} />
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <label className={styles.detailLabel} style={{ margin: 0 }}>Líneas de Cobro</label>
                                <button onClick={addItem} className={styles.btnGhost} style={{ padding: '4px 10px', fontSize: '12px' }}>+ Línea</button>
                            </div>
                            {items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                    <input className={styles.adminInput} placeholder="Descripción del servicio" value={item.description}
                                        onChange={(e) => updateItem(i, 'description', e.target.value)} />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '10px' }}>
                                        <input className={styles.adminInput} type="number" placeholder="Cant" value={item.quantity}
                                            onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))} />
                                        <input className={styles.adminInput} type="number" placeholder="Precio Unitario" value={item.unitPrice}
                                            onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))} />
                                        <button onClick={() => removeItem(i)} style={{ color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={saveInvoice} disabled={saving || saved}
                            style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: saved ? '#1a2a1a' : '#1E1E2E', color: saved ? '#00c864' : '#aaa', fontWeight: 600, cursor: saving || saved ? 'default' : 'pointer', marginBottom: 8 }}>
                            {saving ? 'Guardando...' : saved ? '✓ Guardada en el sistema' : 'Guardar en Sistema'}
                        </button>
                        <button onClick={downloadPDF} className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center' }} disabled={generating}>
                            {generating ? 'Generando PDF...' : 'Descargar Factura PDF'}
                        </button>
                    </div>
                </div>

                {/* Live Preview - Page Based (NO NESTED SCROLL) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', background: 'rgba(0,0,0,0.1)', padding: '20px', borderRadius: '12px' }}>
                    
                    {/* PAGE 1: Invoice */}
                    <div ref={(el) => { pageRefs.current[0] = el; }} id="pdf-page-0">
                        <DocumentPage pageNumber={1} total={1}>
                            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>FACTURA</h1>
                                    <div style={{ fontSize: '13px', opacity: 0.4, marginTop: '5px' }}>#{form.invoiceNumber}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', opacity: 0.4, marginBottom: '5px' }}>FECHA DE EMISIÓN</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{form.date}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                                <div>
                                    <h4 style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '10px' }}>CLIENTE</h4>
                                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{form.clientName || 'Cliente'}</div>
                                    <div style={{ fontSize: '13px', opacity: 0.6, marginTop: '4px' }}>{form.clientCompany}</div>
                                    <div style={{ fontSize: '13px', opacity: 0.6 }}>{form.clientEmail}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h4 style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '10px' }}>MONTO TOTAL</h4>
                                    <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff' }}>${fmt(total)} USD</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '60px' }}>
                                <h4 style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '20px' }}>DETALLE DE SERVICIOS</h4>
                                <div style={{ display: 'grid', gap: '1px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                                    {items.map((item, i) => (
                                        <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 700 }}>{item.description || 'Consultoría Técnica'}</div>
                                                <div style={{ fontSize: '12px', opacity: 0.4, marginTop: '2px' }}>Cant: {item.quantity} · ${fmt(item.unitPrice)}/u</div>
                                            </div>
                                            <div style={{ fontSize: '14px', fontWeight: 700 }}>${fmt(item.quantity * item.unitPrice)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', marginLeft: 'auto', width: '240px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', opacity: 0.5 }}>
                                    <span>Subtotal</span><span>${fmt(subtotal)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13px', opacity: 0.5 }}>
                                    <span>IVA (12%)</span><span>${fmt(tax)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '10px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>TOTAL</span>
                                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff' }}>${fmt(total)} USD</span>
                                </div>
                            </div>

                            {form.notes && (
                                <div style={{ marginTop: '40px' }}>
                                    <h4 style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '0.2em', marginBottom: '10px' }}>NOTAS ADICIONALES</h4>
                                    <div style={{ fontSize: '12px', lineHeight: 1.6, opacity: 0.6, background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px' }}>
                                        {form.notes}
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', opacity: 0.4 }}>Gracias por confiar en el equipo de Stephano.io.</div>
                            </div>
                        </DocumentPage>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FacturaPage() {
    return (
        <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>}>
            <FacturaContent />
        </Suspense>
    );
}
