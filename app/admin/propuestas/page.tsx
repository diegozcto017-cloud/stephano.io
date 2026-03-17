'use client';

import { useState } from 'react';
import styles from '@/styles/admin.module.css';

/* ── Constants ── */
const SERVICE_OPTIONS = [
    { label: 'Landing Page', value: 'Landing Page', price: 350 },
    { label: 'E-commerce', value: 'E-commerce', price: 1200 },
    { label: 'CRM / Web App', value: 'CRM/Web App', price: 1500 },
    { label: 'Corporativa / Portfolio', value: 'Corporativa', price: 450 },
    { label: 'Automatización', value: 'Automatización', price: 500 },
    { label: 'Rediseño', value: 'Rediseño', price: 450 },
];

const TIMELINE_OPTIONS = ['2-3 semanas', '3-4 semanas', '4-6 semanas', '6-8 semanas'];

const EXTRAS = [
    { label: 'Panel Admin', key: 'Panel Admin', price: 500, suffix: '' },
    { label: 'Auth (Login/Registro)', key: 'Auth', price: 250, suffix: '' },
    { label: 'SEO Premium', key: 'SEO Premium', price: 150, suffix: '' },
    { label: 'Mantenimiento Mensual', key: 'Mantenimiento', price: 100, suffix: '/mes' },
];

/* ── Types ── */
interface FormState {
    clientName: string;
    clientEmail: string;
    clientCompany: string;
    clientPhone: string;
    service: string;
    description: string;
    timeline: string;
    extras: string[];
}

interface SavedProposal {
    id: string;
    clientName: string;
    clientCompany: string;
    service: string;
    total: number;
    createdAt: string;
    proposal: string;
}

/* ── Helpers ── */
function fmtUSD(n: number) {
    return `$${n.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function computeTotal(service: string, extras: string[]): number {
    const base = SERVICE_OPTIONS.find((s) => s.value === service)?.price ?? 0;
    const extrasTotal = extras.reduce((sum, key) => {
        return sum + (EXTRAS.find((e) => e.key === key)?.price ?? 0);
    }, 0);
    return base + extrasTotal;
}

/* ── Input styles ── */
const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};

const cardStyle: React.CSSProperties = {
    background: '#111118',
    border: '1px solid #1E1E2E',
    borderRadius: 14,
    padding: '1.5rem',
};

/* ── Main Page ── */
export default function PropuestasPage() {
    const [form, setForm] = useState<FormState>({
        clientName: '',
        clientEmail: '',
        clientCompany: '',
        clientPhone: '',
        service: 'Landing Page',
        description: '',
        timeline: '2-3 semanas',
        extras: [],
    });

    const [loading, setLoading] = useState(false);
    const [proposal, setProposal] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [savedProposals, setSavedProposals] = useState<SavedProposal[]>([]);

    const total = computeTotal(form.service, form.extras);
    const oneTimeTotal = total - (form.extras.includes('Mantenimiento') ? 100 : 0);
    const hasMonthly = form.extras.includes('Mantenimiento');

    function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function toggleExtra(key: string) {
        setForm((prev) => ({
            ...prev,
            extras: prev.extras.includes(key)
                ? prev.extras.filter((e) => e !== key)
                : [...prev.extras, key],
        }));
    }

    async function handleGenerate(e: React.FormEvent) {
        e.preventDefault();
        if (!form.clientName || !form.description) {
            setError('Completa el nombre del cliente y la descripción.');
            return;
        }
        setLoading(true);
        setError(null);
        setProposal(null);

        try {
            const res = await fetch('/api/propuesta/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service: form.service,
                    clientName: form.clientName,
                    clientCompany: form.clientCompany,
                    description: form.description,
                    timeline: form.timeline,
                    extras: form.extras,
                    total,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al generar propuesta');

            setProposal(data.proposal);

            // Save to recent list
            const saved: SavedProposal = {
                id: Date.now().toString(),
                clientName: form.clientName,
                clientCompany: form.clientCompany,
                service: form.service,
                total,
                createdAt: new Date().toLocaleDateString('es-CR'),
                proposal: data.proposal,
            };
            setSavedProposals((prev) => [saved, ...prev.slice(0, 9)]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }

    function handleCopy() {
        if (!proposal) return;
        navigator.clipboard.writeText(proposal).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    function handleWhatsApp() {
        if (!proposal || !form.clientPhone) return;
        const phone = form.clientPhone.replace(/\D/g, '');
        const text = encodeURIComponent(proposal);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    }

    function handleLoadSaved(p: SavedProposal) {
        setProposal(p.proposal);
        setForm((prev) => ({ ...prev, clientName: p.clientName, clientCompany: p.clientCompany, service: p.service }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <>
            {/* ── Page Header ── */}
            <div className={styles.adminPageHeader}>
                <h1 className={styles.adminPageTitle}>Generador de Propuestas</h1>
                <p className={styles.adminPageDesc}>
                    Genera propuestas comerciales profesionales con IA en segundos
                </p>
            </div>

            {/* ── Main Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

                {/* ── LEFT: Form ── */}
                <div style={cardStyle}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: 'linear-gradient(135deg, #0066FF, #00E5FF)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 800 }}>NUEVO</span>
                        Datos del Cliente
                    </div>

                    <form onSubmit={handleGenerate}>
                        {/* Client Info Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Nombre *</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    placeholder="Juan Pérez"
                                    value={form.clientName}
                                    onChange={(e) => setField('clientName', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Empresa</label>
                                <input
                                    style={inputStyle}
                                    type="text"
                                    placeholder="Mi Empresa S.A."
                                    value={form.clientCompany}
                                    onChange={(e) => setField('clientCompany', e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input
                                    style={inputStyle}
                                    type="email"
                                    placeholder="juan@empresa.com"
                                    value={form.clientEmail}
                                    onChange={(e) => setField('clientEmail', e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>WhatsApp</label>
                                <input
                                    style={inputStyle}
                                    type="tel"
                                    placeholder="+506 8888-8888"
                                    value={form.clientPhone}
                                    onChange={(e) => setField('clientPhone', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Service */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Servicio *</label>
                            <select
                                style={{ ...inputStyle, cursor: 'pointer' }}
                                value={form.service}
                                onChange={(e) => setField('service', e.target.value)}
                            >
                                {SERVICE_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value} style={{ background: '#111118' }}>
                                        {s.label} — desde {fmtUSD(s.price)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>¿Qué necesita el cliente? *</label>
                            <textarea
                                style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: 'inherit' }}
                                placeholder="Describe brevemente el proyecto: tipo de negocio, funciones requeridas, integraciones, objetivos..."
                                value={form.description}
                                onChange={(e) => setField('description', e.target.value)}
                                required
                            />
                        </div>

                        {/* Timeline */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Tiempo estimado</label>
                            <select
                                style={{ ...inputStyle, cursor: 'pointer' }}
                                value={form.timeline}
                                onChange={(e) => setField('timeline', e.target.value)}
                            >
                                {TIMELINE_OPTIONS.map((t) => (
                                    <option key={t} value={t} style={{ background: '#111118' }}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Extras */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Add-ons</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {EXTRAS.map((extra) => {
                                    const active = form.extras.includes(extra.key);
                                    return (
                                        <div
                                            key={extra.key}
                                            onClick={() => toggleExtra(extra.key)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                padding: '10px 12px',
                                                background: active ? 'rgba(0,102,255,0.12)' : 'rgba(255,255,255,0.02)',
                                                border: `1px solid ${active ? 'rgba(0,102,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <div style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: 4,
                                                border: `2px solid ${active ? '#0066FF' : 'rgba(255,255,255,0.2)'}`,
                                                background: active ? '#0066FF' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                fontSize: 10,
                                                color: '#fff',
                                            }}>
                                                {active && '✓'}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 12, color: active ? '#fff' : '#aaa', fontWeight: 600 }}>{extra.label}</div>
                                                <div style={{ fontSize: 11, color: active ? '#00E5FF' : '#555' }}>
                                                    +{fmtUSD(extra.price)}{extra.suffix}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Total Preview */}
                        <div style={{
                            background: 'rgba(0,102,255,0.08)',
                            border: '1px solid rgba(0,102,255,0.2)',
                            borderRadius: 10,
                            padding: '12px 16px',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Inversión estimada</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#00E5FF' }}>
                                    {hasMonthly ? fmtUSD(oneTimeTotal) : fmtUSD(total)} USD
                                </div>
                                {hasMonthly && (
                                    <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>+ $100/mes mantenimiento</div>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 11, color: '#555' }}>{form.service}</div>
                                <div style={{ fontSize: 11, color: '#555' }}>{form.timeline}</div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#FF4444', fontSize: 13, marginBottom: '1rem' }}>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: loading ? 'rgba(0,102,255,0.3)' : 'linear-gradient(135deg, #0066FF, #00E5FF)',
                                border: 'none',
                                borderRadius: 10,
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'opacity 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    Generando propuesta...
                                </>
                            ) : (
                                'Generar Propuesta con IA'
                            )}
                        </button>

                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </form>
                </div>

                {/* ── RIGHT: Preview ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {proposal ? (
                        <div style={cardStyle}>
                            {/* Preview Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(0,102,255,0.15), rgba(0,229,255,0.08))',
                                border: '1px solid rgba(0,229,255,0.15)',
                                borderRadius: 10,
                                padding: '16px 20px',
                                marginBottom: '1.25rem',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Stephano.io</div>
                                        <div style={{ fontSize: 12, color: '#00E5FF' }}>Agencia Web — Costa Rica</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Propuesta para</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{form.clientName}</div>
                                        {form.clientCompany && (
                                            <div style={{ fontSize: 12, color: '#aaa' }}>{form.clientCompany}</div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 16 }}>
                                    <div>
                                        <span style={{ fontSize: 11, color: '#555' }}>Servicio: </span>
                                        <span style={{ fontSize: 11, color: '#aaa', fontWeight: 600 }}>{form.service}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: 11, color: '#555' }}>Plazo: </span>
                                        <span style={{ fontSize: 11, color: '#aaa', fontWeight: 600 }}>{form.timeline}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: 11, color: '#555' }}>Total: </span>
                                        <span style={{ fontSize: 11, color: '#00E5FF', fontWeight: 700 }}>{fmtUSD(total)} USD</span>
                                    </div>
                                </div>
                            </div>

                            {/* Proposal Content */}
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 10,
                                padding: '20px',
                                fontSize: 14,
                                lineHeight: 1.7,
                                color: 'rgba(255,255,255,0.85)',
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'inherit',
                                maxHeight: 420,
                                overflowY: 'auto',
                                marginBottom: '1.25rem',
                            }}>
                                {proposal}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: copied ? 'rgba(0,200,100,0.15)' : 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${copied ? 'rgba(0,200,100,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: 8,
                                        color: copied ? '#00c864' : '#aaa',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {copied ? '✓ Copiado' : 'Copiar texto'}
                                </button>

                                <button
                                    onClick={handleWhatsApp}
                                    disabled={!form.clientPhone}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: form.clientPhone ? 'linear-gradient(135deg, #25D366, #128C7E)' : 'rgba(255,255,255,0.04)',
                                        border: 'none',
                                        borderRadius: 8,
                                        color: form.clientPhone ? '#fff' : '#555',
                                        fontSize: 13,
                                        fontWeight: 700,
                                        cursor: form.clientPhone ? 'pointer' : 'not-allowed',
                                        transition: 'opacity 0.2s',
                                    }}
                                    title={!form.clientPhone ? 'Ingresa el número de WhatsApp del cliente' : ''}
                                >
                                    Enviar por WhatsApp
                                </button>
                            </div>

                            {!form.clientPhone && (
                                <p style={{ fontSize: 11, color: '#555', marginTop: 8, textAlign: 'center' }}>
                                    Agrega el número de WhatsApp del cliente para habilitar el envío directo
                                </p>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            ...cardStyle,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 320,
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📄</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                                La propuesta aparecerá aquí
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.15)', maxWidth: 240 }}>
                                Completa el formulario y haz clic en "Generar Propuesta"
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Recent Proposals ── */}
            {savedProposals.length > 0 && (
                <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Propuestas Recientes</span>
                        <span style={{ fontSize: 12, color: '#555', fontWeight: 400 }}>Esta sesión — {savedProposals.length} generadas</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                        {savedProposals.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => handleLoadSaved(p)}
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: 10,
                                    padding: '14px 16px',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)')}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{p.clientName}</div>
                                        {p.clientCompany && (
                                            <div style={{ fontSize: 11, color: '#555' }}>{p.clientCompany}</div>
                                        )}
                                    </div>
                                    <span style={{
                                        background: 'rgba(0,229,255,0.1)',
                                        color: '#00E5FF',
                                        border: '1px solid rgba(0,229,255,0.2)',
                                        borderRadius: 6,
                                        padding: '2px 8px',
                                        fontSize: 11,
                                        fontWeight: 700,
                                    }}>
                                        {fmtUSD(p.total)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: '#666' }}>{p.service}</span>
                                    <span style={{ fontSize: 11, color: '#444' }}>{p.createdAt}</span>
                                </div>
                                <div style={{ marginTop: 8, fontSize: 11, color: '#0066FF', fontWeight: 600 }}>
                                    Ver propuesta →
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
