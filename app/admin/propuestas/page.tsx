'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '@/styles/admin.module.css';
import { getAdminApiKey } from '@/server/actions/auth.action';

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

interface TrackedPropuesta {
    id: number;
    clientName: string;
    clientCompany: string | null;
    clientPhone: string | null;
    service: string;
    total: number;
    estado: string;
    sentVia: string | null;
    notas: string | null;
    followupAt: string | null;
    sentAt: string;
}

const ESTADO_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    enviada:        { label: 'Enviada',        color: '#00E5FF', bg: 'rgba(0,229,255,0.1)' },
    en_negociacion: { label: 'Negociando',     color: '#FFB800', bg: 'rgba(255,184,0,0.1)' },
    sin_respuesta:  { label: 'Sin respuesta',  color: '#888',    bg: 'rgba(136,136,136,0.1)' },
    cerrada_ganada: { label: '✓ Ganada',       color: '#00C864', bg: 'rgba(0,200,100,0.1)' },
    cerrada_perdida:{ label: '✗ Perdida',      color: '#FF4444', bg: 'rgba(255,68,68,0.1)' },
};

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
    const searchParams = useSearchParams();

    const [form, setForm] = useState<FormState>({
        clientName: searchParams.get('clientName') || '',
        clientEmail: searchParams.get('clientEmail') || '',
        clientCompany: searchParams.get('clientCompany') || '',
        clientPhone: searchParams.get('clientPhone') || '',
        service: 'Landing Page',
        description: '',
        timeline: '2-3 semanas',
        extras: [],
    });

    // Auto-build description when arriving from Lead Hunter
    useEffect(() => {
        const name = searchParams.get('clientName');
        const address = searchParams.get('address');
        const rating = searchParams.get('rating');
        const reviews = searchParams.get('reviews');
        if (name && address) {
            const ratingText = rating ? ` Tiene ${rating} estrellas con ${reviews} reseñas en Google Maps.` : '';
            setForm(prev => ({
                ...prev,
                description: `Negocio local "${name}" ubicado en ${address}.${ratingText} Actualmente no tienen sitio web — se identificó como prospecto en Lead Hunter. Propuesta orientada a conseguir su primera presencia digital profesional.`,
            }));
        }
    }, [searchParams]);

    const [loading, setLoading] = useState(false);
    const [proposal, setProposal] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [savedProposals, setSavedProposals] = useState<SavedProposal[]>([]);
    const [activeTab, setActiveTab] = useState<'nueva' | 'seguimiento'>('nueva');
    const [tracked, setTracked] = useState<TrackedPropuesta[]>([]);
    const [trackedLoading, setTrackedLoading] = useState(false);
    const [savedPropuestaId, setSavedPropuestaId] = useState<number | null>(null);
    const [editingNota, setEditingNota] = useState<number | null>(null);
    const [notaText, setNotaText] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailSending, setEmailSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [callScript, setCallScript] = useState<string | null>(null);
    const [callScriptLoading, setCallScriptLoading] = useState(false);

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
        if (!savedPropuestaId) savePropuestaToTracker('copia');
    }

    function handleWhatsApp() {
        if (!proposal || !form.clientPhone) return;
        const phone = form.clientPhone.replace(/\D/g, '');
        const text = encodeURIComponent(proposal);
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        if (!savedPropuestaId) savePropuestaToTracker('whatsapp');
    }

    async function handleSendEmail() {
        if (!proposal || !form.clientEmail) return;
        setEmailSending(true);
        setEmailError('');
        try {
            const res = await fetch('/api/propuesta/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toEmail: form.clientEmail,
                    toName: form.clientName,
                    toCompany: form.clientCompany,
                    clientPhone: form.clientPhone,
                    service: form.service,
                    total,
                    proposalText: proposal,
                    timeline: form.timeline,
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Error al enviar');
            setEmailSent(true);
            setSavedPropuestaId(data.propuestaId);
            loadTracked();
            setTimeout(() => { setShowEmailModal(false); setEmailSent(false); }, 2500);
        } catch (err) {
            setEmailError(err instanceof Error ? err.message : 'Error al enviar');
        } finally {
            setEmailSending(false);
        }
    }

    async function handleCallScript() {
        setCallScriptLoading(true);
        setCallScript(null);
        try {
            const res = await fetch('/api/propuesta/call-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessName: form.clientName || form.clientCompany,
                    address: searchParams.get('address') || '',
                    rating: searchParams.get('rating') || '',
                    reviews: searchParams.get('reviews') || '',
                    service: form.service,
                    total,
                }),
            });
            const data = await res.json();
            if (data.success) setCallScript(data.script);
        } catch { /* silent */ }
        setCallScriptLoading(false);
    }

    function handleLoadSaved(p: SavedProposal) {
        setProposal(p.proposal);
        setForm((prev) => ({ ...prev, clientName: p.clientName, clientCompany: p.clientCompany, service: p.service }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function savePropuestaToTracker(sentVia: 'whatsapp' | 'email' | 'copia') {
        if (!proposal) return null;
        try {
            const res = await fetch('/api/propuesta/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: form.clientName,
                    clientCompany: form.clientCompany,
                    clientPhone: form.clientPhone,
                    clientEmail: form.clientEmail,
                    service: form.service,
                    total,
                    proposalText: proposal,
                    sentVia,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSavedPropuestaId(data.data.id);
                loadTracked();
                return data.data.id;
            }
        } catch { /* silent */ }
        return null;
    }

    async function loadTracked() {
        setTrackedLoading(true);
        try {
            const key = await getAdminApiKey();
            const res = await fetch('/api/propuesta/track', {
                headers: { 'x-admin-key': key || '' },
            });
            const data = await res.json();
            if (data.success) setTracked(data.data);
        } catch { /* silent */ }
        setTrackedLoading(false);
    }

    async function updateEstado(id: number, estado: string) {
        try {
            const key = await getAdminApiKey();
            await fetch('/api/propuesta/track', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': key || '' },
                body: JSON.stringify({ id, estado }),
            });
            setTracked(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
        } catch { /* silent */ }
    }

    async function saveNota(id: number) {
        try {
            const key = await getAdminApiKey();
            await fetch('/api/propuesta/track', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': key || '' },
                body: JSON.stringify({ id, notas: notaText }),
            });
            setTracked(prev => prev.map(p => p.id === id ? { ...p, notas: notaText } : p));
            setEditingNota(null);
        } catch { /* silent */ }
    }

    return (
        <>
            {/* ── Page Header ── */}
            <div className={styles.adminPageHeader}>
                <h1 className={styles.adminPageTitle}>Propuestas</h1>
                <p className={styles.adminPageDesc}>
                    Genera, envía y rastrea cada propuesta comercial en un solo lugar
                </p>
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #1E1E2E', paddingBottom: '0.75rem' }}>
                {[
                    { key: 'nueva', label: 'Nueva Propuesta', icon: '📄' },
                    { key: 'seguimiento', label: `Seguimiento ${tracked.length > 0 ? `(${tracked.length})` : ''}`, icon: '📊' },
                ].map(tab => (
                    <button key={tab.key}
                        onClick={() => { setActiveTab(tab.key as 'nueva' | 'seguimiento'); if (tab.key === 'seguimiento') loadTracked(); }}
                        style={{ padding: '0.5rem 1.1rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: activeTab === tab.key ? 'linear-gradient(135deg, #0066FF, #00E5FF)' : '#1E1E2E', color: activeTab === tab.key ? '#fff' : '#666', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab: Seguimiento ── */}
            {activeTab === 'seguimiento' && (
                <div>
                    {trackedLoading && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#444' }}>Cargando propuestas...</div>
                    )}
                    {!trackedLoading && tracked.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#333' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📬</div>
                            <p style={{ color: '#555' }}>Aún no hay propuestas enviadas.</p>
                            <p style={{ fontSize: '0.8rem', color: '#333' }}>Genera y envía tu primera propuesta — aparecerá aquí automáticamente.</p>
                        </div>
                    )}
                    {!trackedLoading && tracked.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {/* Summary row */}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                {[
                                    { label: 'Total enviadas', value: tracked.length, color: '#0066FF' },
                                    { label: 'Negociando', value: tracked.filter(p => p.estado === 'en_negociacion').length, color: '#FFB800' },
                                    { label: 'Ganadas', value: tracked.filter(p => p.estado === 'cerrada_ganada').length, color: '#00C864' },
                                    { label: 'Pipeline $', value: `$${tracked.filter(p => !['cerrada_perdida'].includes(p.estado)).reduce((s, p) => s + p.total, 0).toLocaleString()}`, color: '#00E5FF' },
                                ].map(s => (
                                    <div key={s.label} style={{ flex: '1 1 130px', background: '#111118', border: '1px solid #1E1E2E', borderRadius: 10, padding: '0.75rem 1rem' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#555', marginTop: 2 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {tracked.map(p => {
                                const cfg = ESTADO_CONFIG[p.estado] || ESTADO_CONFIG.enviada;
                                const dias = Math.floor((Date.now() - new Date(p.sentAt).getTime()) / 86400000);
                                return (
                                    <div key={p.id} style={{ background: '#111118', border: `1px solid ${cfg.color}22`, borderRadius: 14, padding: '1.1rem 1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                                            {/* Left: client info */}
                                            <div style={{ flex: 1, minWidth: 180 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                    <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{p.clientName}</span>
                                                    {p.clientCompany && p.clientCompany !== p.clientName && (
                                                        <span style={{ fontSize: 11, color: '#555' }}>{p.clientCompany}</span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: 12, color: '#00E5FF', fontWeight: 700 }}>{fmtUSD(p.total)}</span>
                                                    <span style={{ fontSize: 12, color: '#555' }}>{p.service}</span>
                                                    {p.sentVia && <span style={{ fontSize: 11, color: '#444' }}>vía {p.sentVia}</span>}
                                                    <span style={{ fontSize: 11, color: '#333' }}>hace {dias === 0 ? 'hoy' : `${dias}d`}</span>
                                                </div>
                                                {p.clientPhone && (
                                                    <a href={`https://wa.me/${p.clientPhone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 11, color: '#25D366', textDecoration: 'none' }}>
                                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M5.077 20.461l.675-2.462A9.935 9.935 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10c-1.742 0-3.38-.445-4.813-1.231l-2.11.692z"/></svg>
                                                        Follow-up WA
                                                    </a>
                                                )}
                                            </div>

                                            {/* Right: estado selector + badge */}
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                                <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                                                    {cfg.label}
                                                </span>
                                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                    {Object.entries(ESTADO_CONFIG).map(([key, c]) => (
                                                        <button key={key} onClick={() => updateEstado(p.id, key)}
                                                            style={{ background: p.estado === key ? c.bg : '#1E1E2E', border: `1px solid ${p.estado === key ? c.color + '44' : '#2A2A3E'}`, borderRadius: 5, padding: '2px 7px', color: p.estado === key ? c.color : '#555', fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>
                                                            {c.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Notas */}
                                        <div style={{ marginTop: '0.75rem', borderTop: '1px solid #1a1a2e', paddingTop: '0.75rem' }}>
                                            {editingNota === p.id ? (
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <input value={notaText} onChange={e => setNotaText(e.target.value)}
                                                        placeholder="Agregar nota..."
                                                        style={{ flex: 1, background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: 6, padding: '5px 10px', color: '#fff', fontSize: 12, outline: 'none' }}
                                                        onKeyDown={e => e.key === 'Enter' && saveNota(p.id)}
                                                        autoFocus
                                                    />
                                                    <button onClick={() => saveNota(p.id)} style={{ background: '#0066FF', border: 'none', borderRadius: 6, padding: '5px 12px', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Guardar</button>
                                                    <button onClick={() => setEditingNota(null)} style={{ background: '#1E1E2E', border: 'none', borderRadius: 6, padding: '5px 10px', color: '#666', fontSize: 12, cursor: 'pointer' }}>✕</button>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => { setEditingNota(p.id); setNotaText(p.notas || ''); }}>
                                                    {p.notas
                                                        ? <span style={{ fontSize: 12, color: '#888', cursor: 'text', flex: 1 }}>📝 {p.notas}</span>
                                                        : <span style={{ fontSize: 11, color: '#333', cursor: 'pointer', flex: 1 }}>+ Agregar nota de seguimiento...</span>
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── Tab: Nueva Propuesta ── */}
            {activeTab !== 'seguimiento' && (
            <>
            {/* ── Main Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

                {/* ── LEFT: Form ── */}
                <div style={cardStyle}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: 'linear-gradient(135deg, #0066FF, #00E5FF)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 800 }}>NUEVO</span>
                        Datos del Cliente
                    </div>

                    {/* Banner: prospecto desde Lead Hunter */}
                    {searchParams.get('clientName') && (
                        <div style={{ background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 10, padding: '0.65rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#00E5FF' }}>Prospecto desde Lead Hunter</div>
                                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{searchParams.get('address') || ''}</div>
                            </div>
                        </div>
                    )}

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

                            {/* Action Buttons — row 1 */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <button onClick={handleCopy}
                                    style={{ flex: 1, padding: '10px', background: copied ? 'rgba(0,200,100,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(0,200,100,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, color: copied ? '#00c864' : '#aaa', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                                    {copied ? '✓ Copiado' : 'Copiar'}
                                </button>
                                <button onClick={handleWhatsApp} disabled={!form.clientPhone}
                                    style={{ flex: 1, padding: '10px', background: form.clientPhone ? 'linear-gradient(135deg, #25D366, #128C7E)' : 'rgba(255,255,255,0.04)', border: 'none', borderRadius: 8, color: form.clientPhone ? '#fff' : '#555', fontSize: 13, fontWeight: 700, cursor: form.clientPhone ? 'pointer' : 'not-allowed' }}
                                    title={!form.clientPhone ? 'Ingresa el número de WhatsApp' : ''}>
                                    WhatsApp
                                </button>
                                <button onClick={() => { setShowEmailModal(true); setEmailError(''); setEmailSent(false); }}
                                    style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #0066FF, #00E5FF)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                    Email
                                </button>
                            </div>

                            {/* Action Buttons — row 2: call script */}
                            <button onClick={handleCallScript} disabled={callScriptLoading}
                                style={{ width: '100%', padding: '9px', background: callScriptLoading ? '#1E1E2E' : 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.25)', borderRadius: 8, color: callScriptLoading ? '#555' : '#FFB800', fontSize: 12, fontWeight: 600, cursor: callScriptLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                {callScriptLoading ? 'Generando script...' : 'Script de llamada (teléfono fijo)'}
                            </button>

                            {/* Call Script Display */}
                            {callScript && (
                                <div style={{ marginTop: 10, background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 10, padding: '14px 16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#FFB800', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Script de llamada</span>
                                        <button onClick={() => navigator.clipboard.writeText(callScript)}
                                            style={{ background: 'rgba(255,184,0,0.15)', border: '1px solid rgba(255,184,0,0.3)', borderRadius: 5, padding: '3px 10px', color: '#FFB800', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                                            Copiar
                                        </button>
                                    </div>
                                    <pre style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{callScript}</pre>
                                </div>
                            )}

                            {/* Email Modal */}
                            {showEmailModal && (
                                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                                    onClick={e => { if (e.target === e.currentTarget) setShowEmailModal(false); }}>
                                    <div style={{ background: '#111118', border: '1px solid #2A2A3E', borderRadius: 16, padding: '1.75rem', width: '100%', maxWidth: 440 }}>
                                        <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                                            Enviar propuesta por email
                                            <button onClick={() => setShowEmailModal(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18 }}>✕</button>
                                        </div>

                                        {emailSent ? (
                                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✅</div>
                                                <div style={{ fontSize: 15, fontWeight: 700, color: '#00C864' }}>Email enviado exitosamente</div>
                                                <div style={{ fontSize: 12, color: '#555', marginTop: 6 }}>Registrado en el tracker de seguimiento</div>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ marginBottom: '1rem' }}>
                                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Email del prospecto *</label>
                                                    <input
                                                        type="email"
                                                        value={form.clientEmail}
                                                        onChange={e => setField('clientEmail', e.target.value)}
                                                        placeholder="contacto@negocio.com"
                                                        style={{ width: '100%', background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                                        autoFocus
                                                    />
                                                </div>

                                                <div style={{ background: 'rgba(0,102,255,0.06)', border: '1px solid rgba(0,102,255,0.15)', borderRadius: 8, padding: '10px 14px', marginBottom: '1.25rem' }}>
                                                    <div style={{ fontSize: 12, color: '#aaa' }}>Para: <strong style={{ color: '#fff' }}>{form.clientEmail || '—'}</strong></div>
                                                    <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>Asunto: <strong style={{ color: '#fff' }}>Propuesta {form.service} — Stephano.io</strong></div>
                                                    <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>El prospecto recibirá la propuesta formateada + botón de contacto WhatsApp</div>
                                                </div>

                                                {emailError && (
                                                    <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 8, padding: '8px 12px', color: '#FF4444', fontSize: 12, marginBottom: '1rem' }}>
                                                        {emailError}
                                                    </div>
                                                )}

                                                <button onClick={handleSendEmail} disabled={emailSending || !form.clientEmail}
                                                    style={{ width: '100%', padding: '12px', background: emailSending || !form.clientEmail ? 'rgba(0,102,255,0.3)' : 'linear-gradient(135deg, #0066FF, #00E5FF)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 700, cursor: emailSending || !form.clientEmail ? 'not-allowed' : 'pointer' }}>
                                                    {emailSending ? 'Enviando...' : 'Enviar propuesta por email'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
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

            {/* ── Recent Proposals (session) ── */}
            {savedProposals.length > 0 && (
                <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Generadas esta sesión</span>
                        <span style={{ fontSize: 12, color: '#555', fontWeight: 400 }}>{savedProposals.length} propuestas</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                        {savedProposals.map((p) => (
                            <div key={p.id} onClick={() => handleLoadSaved(p)}
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)')}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{p.clientName}</div>
                                        {p.clientCompany && <div style={{ fontSize: 11, color: '#555' }}>{p.clientCompany}</div>}
                                    </div>
                                    <span style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                                        {fmtUSD(p.total)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: '#666' }}>{p.service}</span>
                                    <span style={{ fontSize: 11, color: '#444' }}>{p.createdAt}</span>
                                </div>
                                <div style={{ marginTop: 8, fontSize: 11, color: '#0066FF', fontWeight: 600 }}>Ver propuesta →</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            </>
            )}
        </>
    );
}
