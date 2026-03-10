'use client';

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
}

function FacturaContent() {
    const searchParams = useSearchParams();
    const previewRef = useRef<HTMLDivElement>(null);
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
            pdf.save(`Factura_${form.invoiceNumber}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
        }
        setGenerating(false);
    };

    const today = new Date().toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' });
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

                {/* Live Preview (Dark Mode) */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        Vista Previa Factura Premium
                    </div>
                    <div ref={previewRef} style={{ background: '#000000', color: '#ffffff', width: '100%', minHeight: '842px', padding: '60px', fontFamily: 'Inter, sans-serif' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
                            <div>
                                <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>INVOICE</h1>
                                <p style={{ fontSize: '13px', opacity: 0.5, marginTop: '5px' }}>N.º {form.invoiceNumber} · {today}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '24px', fontWeight: 900, background: 'linear-gradient(135deg, #0066FF, #00E5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stephano.io</div>
                                <div style={{ fontSize: '11px', opacity: 0.4 }}>Ingeniería de Software Premium</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
                            <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ fontSize: '10px', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '10px' }}>FACTURAR A</h4>
                                <div style={{ fontSize: '15px', fontWeight: 700 }}>{form.clientName || '[Nombre]'}</div>
                                <div style={{ fontSize: '13px', opacity: 0.6, marginTop: '5px' }}>{form.clientCompany}</div>
                                <div style={{ fontSize: '13px', opacity: 0.6 }}>{form.clientEmail}</div>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <h4 style={{ fontSize: '10px', opacity: 0.4, letterSpacing: '0.1em', marginBottom: '10px' }}>PAGO Y VENCIMIENTO</h4>
                                <div style={{ fontSize: '13px' }}><strong>Vence:</strong> {form.dueDate ? new Date(form.dueDate + 'T12:00:00').toLocaleDateString('es') : 'Pago al Recibir'}</div>
                                <div style={{ fontSize: '13px', marginTop: '5px' }}><strong>Método:</strong> Transferencia / Crypto / Stripe</div>
                            </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ textAlign: 'left', padding: '15px 0', fontSize: '11px', opacity: 0.4, fontWeight: 500 }}>DESCRIPCIÓN</th>
                                    <th style={{ textAlign: 'center', padding: '15px 0', fontSize: '11px', opacity: 0.4, fontWeight: 500 }}>CANT.</th>
                                    <th style={{ textAlign: 'right', padding: '15px 0', fontSize: '11px', opacity: 0.4, fontWeight: 500 }}>P. UNITARIO</th>
                                    <th style={{ textAlign: 'right', padding: '15px 0', fontSize: '11px', opacity: 0.4, fontWeight: 500 }}>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '20px 0', fontSize: '14px' }}>{item.description || 'Consultoría Técnica'}</td>
                                        <td style={{ textAlign: 'center', padding: '20px 0', fontSize: '14px' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right', padding: '20px 0', fontSize: '14px' }}>${fmt(item.unitPrice)}</td>
                                        <td style={{ textAlign: 'right', padding: '20px 0', fontSize: '14px', fontWeight: 700 }}>${fmt(item.quantity * item.unitPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ marginLeft: 'auto', width: '280px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px', opacity: 0.6 }}>
                                <span>Subtotal</span><span>${fmt(subtotal)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px', opacity: 0.6 }}>
                                <span>IVA (12%)</span><span>${fmt(tax)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '10px' }}>
                                <span style={{ fontSize: '16px', fontWeight: 900 }}>TOTAL</span>
                                <span style={{ fontSize: '20px', fontWeight: 900, color: '#00E5FF' }}>${fmt(total)} USD</span>
                            </div>
                        </div>

                        {form.notes && (
                            <div style={{ marginTop: '60px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                                <strong>NOTAS ADICIONALES:</strong><br />{form.notes}
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: '80px', textAlign: 'center', opacity: 0.15, fontSize: '10px' }}>
                            STEPHANO.IO — DOCUMENTO OFICIAL DE COBRO — DIGITAL ENGINEERING SOLUTIONS © {new Date().getFullYear()}
                        </div>
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
