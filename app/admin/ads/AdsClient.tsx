'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/admin.module.css';
import { fetchAds, updateAdStatus, deleteAd, publishAdNow, saveAdEdit, regenerateAdImage } from './actions';
import { runStrategyAudit, fetchMetaStats } from './strategy-actions';

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface AdItem {
    id: number;
    scratch: string;
    headline: string | null;
    copy: string | null;
    mediaUrl: string | null;
    mediaType: string;
    status: string;
    publishAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

interface PipelineProgress {
    step: string;
    status: string;
    message: string;
    percent: number;
    headline?: string;
    idx?: number;
    label?: string;
}

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const BATCH_LABELS = ['Hero 1:1', 'Pain Point', 'Resultados', 'Story 9:16'];

const QUICK_PRESETS = [
    {
        label: 'Landing Page', price: '$350 USD', time: '2 semanas', color: '#0066FF',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
        idea: 'Anuncio de Stephano.io para Landing Pages estratégicas desde $350 USD, diseño Liquid Glass de alta conversión, entrega en 2 semanas. Visita stephano.io',
    },
    {
        label: 'E-commerce', price: '$1,200 USD', time: '4-6 semanas', color: '#00c864',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
        idea: 'Anuncio de Stephano.io para tiendas E-commerce completas desde $1,200 USD, checkout optimizado, catálogo y panel de admin incluido. Contáctanos en stephano.io',
    },
    {
        label: 'CRM / Web App', price: '$1,500 USD', time: '6-8 semanas', color: '#00E5FF',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
        idea: 'Anuncio de Stephano.io para sistemas CRM y Web Apps a medida desde $1,500 USD, automatización de ventas y dashboard en tiempo real. Visita stephano.io',
    },
    {
        label: 'Corporativa', price: '$450 USD', time: '2-3 semanas', color: '#ff9900',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        idea: 'Anuncio de Stephano.io para páginas corporativas y portfolios profesionales desde $450 USD, diseño de élite con SEO incluido. Visita stephano.io',
    },
    {
        label: 'Automatización', price: '$500 USD', time: '1-2 semanas', color: '#a855f7',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
        idea: 'Anuncio de Stephano.io para automatizaciones e integraciones empresariales desde $500 USD, flujos n8n, APIs y sistemas conectados automáticamente. stephano.io',
    },
    {
        label: 'Rediseño Web', price: '$450 USD', time: '2-3 semanas', color: '#ff4466',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
        idea: 'Anuncio de Stephano.io para rediseño estratégico de sitios web desde $450 USD, transformación digital completa con resultados medibles. Visita stephano.io',
    },
    {
        label: 'App Móvil', price: '$1,500+ USD', time: '8-12 semanas', color: '#f472b6',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
        idea: 'Anuncio de Stephano.io para desarrollo de aplicaciones móviles desde $1,500 USD, React Native, diseño premium y backend robusto incluido. Visita stephano.io',
    },
    {
        label: 'SEO & Marketing', price: '+$150 USD', time: 'Add-on', color: '#22d3ee',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
        idea: 'Anuncio de Stephano.io para servicios de SEO y marketing digital desde $150 USD, posicionamiento en Google y estrategia de contenido incluida. stephano.io',
    },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function downloadImage(src: string, label: string) {
    if (src.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = src;
        link.download = `stephano-${label.toLowerCase().replace(/[\s:]+/g, '-')}.png`;
        link.click();
    } else {
        window.open(src, '_blank');
    }
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    return (
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden', marginTop: 10 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 100, transition: 'width 0.6s ease' }} />
        </div>
    );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function AdsClient({ initialAds, initialStock }: { initialAds: AdItem[], initialStock: number }) {
    const [activeTab, setActiveTab] = useState<'proposals' | 'calendar' | 'published' | 'strategy'>('proposals');
    const [scratchInput, setScratchInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [adsList, setAdsList] = useState<AdItem[]>(initialAds);
    const [stockCount, setStockCount] = useState(initialStock);
    const [imageMode, setImageMode] = useState<'single' | 'batch'>('single');
    const [quantity, setQuantity] = useState<1 | 3 | 5>(1);
    const [progress, setProgress] = useState<PipelineProgress | null>(null);
    const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number } | null>(null);
    const [regenId, setRegenId] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editHeadline, setEditHeadline] = useState('');
    const [editCopy, setEditCopy] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [auditContext, setAuditContext] = useState('');
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditResult, setAuditResult] = useState<string | null>(null);
    const [metaStats, setMetaStats] = useState<any>(null);

    // Prefill from URL ?prefill=
    useEffect(() => {
        const p = new URLSearchParams(window.location.search).get('prefill');
        if (p) setScratchInput(decodeURIComponent(p));
    }, []);

    useEffect(() => {
        if (activeTab === 'strategy') fetchMetaStats().then(setMetaStats);
    }, [activeTab]);

    const drafts = adsList.filter(a => a.status === 'draft');
    const scheduled = adsList.filter(a => a.status === 'scheduled');
    const published = adsList.filter(a => a.status === 'published');
    const totalAds = adsList.length;

    const refreshAdsList = useCallback(async () => {
        const fresh = await fetchAds() as AdItem[];
        setAdsList(fresh);
        setStockCount(fresh.filter(a => a.status === 'draft' || a.status === 'scheduled').length);
    }, []);

    /* ── Pipeline SSE ── */
    const runOnePipeline = async (scratch: string): Promise<boolean> => {
        const res = await fetch('/api/ads/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scratch, mode: imageMode }),
        });
        if (!res.body) throw new Error('No stream');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let ok = false;
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            for (const line of decoder.decode(value, { stream: true }).split('\n')) {
                if (!line.startsWith('data: ')) continue;
                try {
                    const ev: PipelineProgress = JSON.parse(line.slice(6));
                    setProgress(ev);
                    if (ev.step === 'done') ok = true;
                    if (ev.step === 'error') throw new Error(ev.message);
                } catch (e) { if (e instanceof Error && e.message !== 'parse') throw e; }
            }
        }
        return ok;
    };

    const handleCreateIdea = async () => {
        if (!scratchInput.trim()) return;
        setIsGenerating(true);
        setBulkProgress(quantity > 1 ? { current: 0, total: quantity } : null);
        setProgress({ step: 'start', status: 'in_progress', message: 'Iniciando pipeline JARVIS...', percent: 5 });
        try {
            for (let i = 0; i < quantity; i++) {
                if (quantity > 1) setBulkProgress({ current: i + 1, total: quantity });
                await runOnePipeline(scratchInput);
            }
            await refreshAdsList();
            setScratchInput('');
            setTimeout(() => { setProgress(null); setBulkProgress(null); }, 2000);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error de conexión.');
            setProgress(null); setBulkProgress(null);
        }
        setIsGenerating(false);
    };

    const handleRegenImage = async (id: number) => {
        setRegenId(id);
        const res = await regenerateAdImage(id, imageMode);
        if (res.success && res.mediaUrl) setAdsList(adsList.map(a => a.id === id ? { ...a, mediaUrl: res.mediaUrl! } : a));
        else alert(res.error || 'Error al regenerar.');
        setRegenId(null);
    };

    const handleApprove = async (id: number) => {
        const res = await updateAdStatus(id, 'scheduled');
        if (res.success) setAdsList(adsList.map(a => a.id === id ? { ...a, status: 'scheduled' } : a));
    };

    const handlePublishNow = async (id: number) => {
        if (!confirm('¿Publicar en Instagram ahora mismo?')) return;
        const res = await publishAdNow(id);
        if (res.success) {
            setAdsList(adsList.map(a => a.id === id ? { ...a, status: 'published' } : a));
            alert('Enviado a n8n para publicación inmediata.');
        }
    };

    const handleReject = async (id: number) => {
        const res = await deleteAd(id);
        if (res.success) setAdsList(adsList.filter(a => a.id !== id));
    };

    const handleSaveEdit = async () => {
        if (editingId === null) return;
        const res = await saveAdEdit(editingId, editHeadline, editCopy);
        if (res.success) {
            setAdsList(adsList.map(a => a.id === editingId ? { ...a, headline: editHeadline, copy: editCopy } : a));
            setEditingId(null);
        }
    };

    const handleRunAudit = async () => {
        if (!auditContext.trim()) return;
        setIsAuditing(true);
        const res = await runStrategyAudit(auditContext);
        if (res.success) setAuditResult(res.audit);
        setIsAuditing(false);
    };

    const stepIndex = progress
        ? progress.step === 'done' ? 3 : progress.step === 'save' ? 2 : progress.step === 'images' ? 1 : 0
        : -1;

    /* ─────────────────────────────────────────
       RENDER
    ───────────────────────────────────────── */
    return (
        <>
            {/* ══════════════════════════════
                STATS ROW — 6 cards
            ══════════════════════════════ */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 16,
                marginBottom: 28,
            }}>
                {/* Stock */}
                <div className={styles.statCard} style={{ borderColor: 'rgba(0,102,255,0.25)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(0,102,255,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        </div>
                        <span style={{ fontSize: 10, color: '#0066FF', background: 'rgba(0,102,255,0.1)', padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>LIVE</span>
                    </div>
                    <div className={styles.statAccent} style={{ fontSize: 28, lineHeight: 1 }}>{stockCount}</div>
                    <div className={styles.statLabel} style={{ marginTop: 4 }}>Stock Activo</div>
                    <MiniBar value={stockCount} max={20} color="#0066FF" />
                </div>

                {/* Drafts */}
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(255,170,0,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffaa00" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </div>
                    </div>
                    <div className={styles.statValue} style={{ fontSize: 28, color: '#ffaa00', lineHeight: 1 }}>{drafts.length}</div>
                    <div className={styles.statLabel} style={{ marginTop: 4 }}>Borradores</div>
                    <MiniBar value={drafts.length} max={10} color="#ffaa00" />
                </div>

                {/* Scheduled */}
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(0,200,100,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00c864" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        </div>
                    </div>
                    <div className={styles.statValue} style={{ fontSize: 28, color: '#00c864', lineHeight: 1 }}>{scheduled.length}</div>
                    <div className={styles.statLabel} style={{ marginTop: 4 }}>Programados</div>
                    <MiniBar value={scheduled.length} max={10} color="#00c864" />
                </div>

                {/* Published */}
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(0,229,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                    </div>
                    <div className={styles.statValue} style={{ fontSize: 28, color: '#00E5FF', lineHeight: 1 }}>{published.length}</div>
                    <div className={styles.statLabel} style={{ marginTop: 4 }}>Publicados</div>
                    <MiniBar value={published.length} max={Math.max(totalAds, 1)} color="#00E5FF" />
                </div>

                {/* Pipeline value */}
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(168,85,247,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                    </div>
                    <div className={styles.statValue} style={{ fontSize: 22, color: '#a855f7', lineHeight: 1 }}>${(stockCount * 350).toLocaleString()}</div>
                    <div className={styles.statLabel} style={{ marginTop: 4 }}>Pipeline Est.</div>
                    <MiniBar value={stockCount} max={20} color="#a855f7" />
                </div>

                {/* Total generated */}
                <div className={styles.statCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, background: 'rgba(244,114,182,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                        </div>
                    </div>
                    <div className={styles.statValue} style={{ fontSize: 28, color: '#f472b6', lineHeight: 1 }}>{totalAds}</div>
                    <div className={styles.statLabel} style={{ marginTop: 4 }}>Total Generados</div>
                    <MiniBar value={totalAds} max={50} color="#f472b6" />
                </div>
            </div>

            {/* ══════════════════════════════
                GENERATOR — 2 panel layout
            ══════════════════════════════ */}
            <div className={styles.tableCard} style={{ marginBottom: 28, overflow: 'visible' }}>
                {/* Header */}
                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#0066FF,#00E5FF)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        </div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>JARVIS Engine</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Claude Sonnet 4.6 + Gemini 2.0 Flash</div>
                        </div>
                    </div>
                    {/* Mode + Quantity */}
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                            {(['single', 'batch'] as const).map(m => (
                                <button key={m} onClick={() => setImageMode(m)} disabled={isGenerating}
                                    style={{ padding: '6px 16px', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                                        background: imageMode === m ? (m === 'batch' ? 'linear-gradient(135deg,#0066FF,#00E5FF)' : '#0066FF') : 'transparent',
                                        color: imageMode === m ? '#fff' : 'rgba(255,255,255,0.4)',
                                    }}>
                                    {m === 'single' ? 'Single' : 'Batch ×4'}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                            {([1, 3, 5] as const).map((q, i) => (
                                <button key={q} onClick={() => setQuantity(q)} disabled={isGenerating}
                                    style={{ padding: '6px 14px', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                                        borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                                        background: quantity === q ? 'rgba(0,102,255,0.3)' : 'transparent',
                                        color: quantity === q ? '#fff' : 'rgba(255,255,255,0.4)',
                                    }}>
                                    ×{q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Body — 2 columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 0 }}>
                    {/* Left — Input */}
                    <div style={{ padding: 24, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                        <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>
                            Describe tu campaña
                        </label>
                        <textarea
                            className={styles.adminInput}
                            placeholder="Ej: Anuncio sobre landing pages estratégicas para clínicas en Costa Rica, precio $350, CTA visita stephano.io..."
                            value={scratchInput}
                            onChange={e => setScratchInput(e.target.value)}
                            disabled={isGenerating}
                            rows={4}
                            style={{ resize: 'none', marginBottom: 14, lineHeight: 1.6 }}
                        />
                        <button
                            className={styles.btnPrimary}
                            onClick={handleCreateIdea}
                            disabled={isGenerating || !scratchInput.trim()}
                            style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '12px', opacity: (isGenerating || !scratchInput.trim()) ? 0.5 : 1 }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                            {isGenerating
                                ? bulkProgress ? `Generando ${bulkProgress.current}/${bulkProgress.total}...` : 'Generando...'
                                : quantity > 1 ? `Crear ×${quantity} Anuncios` : 'Crear Campaña'}
                        </button>

                        {/* Progress */}
                        <AnimatePresence>
                            {progress && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: 16 }}>
                                    {/* Steps */}
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
                                        {['Copy', 'Visual', 'Save', 'Done'].map((label, i) => (
                                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: i < 3 ? 1 : 'none' }}>
                                                <div style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, flexShrink: 0, transition: 'all 0.3s',
                                                    background: i < stepIndex ? '#00c864' : i === stepIndex ? '#0066FF' : 'rgba(255,255,255,0.08)',
                                                    color: i <= stepIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                                                    boxShadow: i === stepIndex ? '0 0 10px rgba(0,102,255,0.5)' : 'none',
                                                }}>
                                                    {i < stepIndex ? '✓' : i + 1}
                                                </div>
                                                <span style={{ fontSize: 10, color: i <= stepIndex ? '#fff' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{label}</span>
                                                {i < 3 && <div style={{ flex: 1, height: 1, background: i < stepIndex ? '#00c864' : 'rgba(255,255,255,0.08)' }} />}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Bar */}
                                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                                        <motion.div animate={{ width: `${progress.percent ?? 0}%` }} transition={{ duration: 0.4, ease: 'easeOut' }}
                                            style={{ height: '100%', borderRadius: 100, background: progress.step === 'done' ? '#00c864' : 'linear-gradient(90deg,#0066FF,#00E5FF)' }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11 }}>
                                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                                            {bulkProgress && <span style={{ color: '#00E5FF', fontWeight: 700, marginRight: 6 }}>[{bulkProgress.current}/{bulkProgress.total}]</span>}
                                            {progress.message}
                                        </span>
                                        <span style={{ color: progress.step === 'done' ? '#00c864' : '#00E5FF', fontWeight: 700 }}>{Math.round(progress.percent ?? 0)}%</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right — Quick Presets grid */}
                    <div style={{ padding: 20 }}>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Ideas Rápidas</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {QUICK_PRESETS.map(preset => {
                                const selected = scratchInput === preset.idea;
                                return (
                                    <button key={preset.label} onClick={() => setScratchInput(preset.idea)} disabled={isGenerating}
                                        style={{ padding: '12px 10px', borderRadius: 12, border: `1px solid ${selected ? preset.color : 'rgba(255,255,255,0.06)'}`,
                                            background: selected ? `${preset.color}18` : 'rgba(255,255,255,0.02)',
                                            cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit',
                                        }}
                                        onMouseOver={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = `${preset.color}55`; }}
                                        onMouseOut={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
                                    >
                                        <div style={{ color: preset.color, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>{preset.icon}</div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 3, lineHeight: 1.2 }}>{preset.label}</div>
                                        <div style={{ fontSize: 11, color: preset.color, fontWeight: 800 }}>{preset.price}</div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{preset.time}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile: preset grid below on small screens */}
                <style>{`
                    @media (max-width: 768px) {
                        .jarvis-generator-grid { grid-template-columns: 1fr !important; }
                        .jarvis-presets-panel { border-right: none !important; border-top: 1px solid rgba(255,255,255,0.06); }
                    }
                `}</style>
            </div>

            {/* ══════════════════════════════
                TABS
            ══════════════════════════════ */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflowX: 'auto' }}>
                {[
                    { id: 'proposals', label: `Propuestas`, count: drafts.length, color: '#ffaa00' },
                    { id: 'calendar', label: `Calendario`, count: scheduled.length, color: '#00c864' },
                    { id: 'published', label: `Publicados`, count: published.length, color: '#00E5FF' },
                    { id: 'strategy', label: `Estrategia`, count: null, color: '#a855f7' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                        style={{ flex: 1, minWidth: 'max-content', padding: '9px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, whiteSpace: 'nowrap',
                            background: activeTab === tab.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                            color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)',
                            boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                        }}>
                        {tab.label}
                        {tab.count !== null && (
                            <span style={{ fontSize: 11, fontWeight: 800, padding: '1px 7px', borderRadius: 100,
                                background: activeTab === tab.id ? tab.color + '22' : 'rgba(255,255,255,0.05)',
                                color: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.3)',
                                border: activeTab === tab.id ? `1px solid ${tab.color}44` : '1px solid rgba(255,255,255,0.06)',
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════
                PROPOSALS TAB
            ══════════════════════════════ */}
            {activeTab === 'proposals' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    <AnimatePresence>
                        {drafts.length === 0 ? (
                            <div className={styles.tableCard} style={{ gridColumn: '1/-1', padding: '80px 24px', textAlign: 'center' }}>
                                <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.04)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>Sin propuestas. Usa el JARVIS Engine arriba.</div>
                            </div>
                        ) : drafts.map(ad => {
                            let images: string[] = [];
                            try {
                                if (ad.mediaUrl?.startsWith('[')) images = JSON.parse(ad.mediaUrl);
                                else if (ad.mediaUrl) images = [ad.mediaUrl];
                            } catch { images = ad.mediaUrl ? [ad.mediaUrl] : []; }
                            const isBatch = images.length > 1;
                            const isRegen = regenId === ad.id;

                            return (
                                <motion.div key={ad.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                    style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)', transition: 'border-color 0.3s' }}
                                    onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(0,102,255,0.3)')}
                                    onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                                >
                                    {/* Image Section */}
                                    <div style={{ position: 'relative' }}>
                                        {isBatch ? (
                                            <>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: '#000' }}>
                                                    {images.map((src, idx) => (
                                                        <div key={idx} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', cursor: 'zoom-in' }}
                                                            onClick={() => setPreviewUrl(src)}>
                                                            <img src={src} alt={BATCH_LABELS[idx]}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                                                                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                                                                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                                                                onError={e => { (e.target as HTMLImageElement).style.opacity = '0.1'; }} />
                                                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 6px 4px', background: 'linear-gradient(transparent,rgba(0,0,0,0.9))', fontSize: 9, color: '#00E5FF', fontWeight: 700, textAlign: 'center', pointerEvents: 'none' }}>
                                                                {BATCH_LABELS[idx]}
                                                            </div>
                                                            <button onClick={e => { e.stopPropagation(); downloadImage(src, BATCH_LABELS[idx]); }}
                                                                style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '4px 6px', cursor: 'pointer', color: '#fff', opacity: 0, transition: 'opacity 0.2s' }}
                                                                onMouseOver={e => (e.currentTarget.style.opacity = '1')}
                                                                onMouseOut={e => (e.currentTarget.style.opacity = '0')}>
                                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ padding: '6px 14px', background: 'rgba(0,102,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>×{images.length} variaciones</span>
                                                    <span style={{ fontSize: 9, color: '#00E5FF', fontWeight: 800, letterSpacing: '0.08em' }}>JARVIS BATCH</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
                                                {images[0] ? (
                                                    <>
                                                        <img src={images[0]} alt="Visual" style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in', display: 'block' }}
                                                            onClick={() => setPreviewUrl(images[0])}
                                                            onError={e => { const t = e.target as HTMLImageElement; t.onerror = null; t.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop'; t.style.opacity = '0.3'; }} />
                                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', pointerEvents: 'none' }} />
                                                        <button onClick={() => downloadImage(images[0], ad.headline || 'ad')}
                                                            style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontFamily: 'inherit' }}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                                            Descargar
                                                        </button>
                                                        <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 9, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                                            Click para expandir
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                                                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                        </div>
                                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Procesando visual...</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {isRegen && (
                                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', zIndex: 10 }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: 13, color: '#00E5FF', fontWeight: 700, marginBottom: 6 }}>Regenerando imagen...</div>
                                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Gemini 2.0 Flash</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card body */}
                                    <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        {editingId === ad.id ? (
                                            <>
                                                <input className={styles.adminInput} value={editHeadline} onChange={e => setEditHeadline(e.target.value)} style={{ marginBottom: 10, padding: '8px 12px', fontSize: 13 }} placeholder="Titular..." />
                                                <textarea className={styles.adminInput} value={editCopy} onChange={e => setEditCopy(e.target.value)} style={{ height: 110, marginBottom: 12, fontSize: 12, lineHeight: 1.5 }} placeholder="Cuerpo..." />
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button onClick={handleSaveEdit} className={styles.btnSuccess} style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>Guardar</button>
                                                    <button onClick={() => setEditingId(null)} className={styles.btnGhost} style={{ flex: 1, fontSize: 12, justifyContent: 'center' }}>Cancelar</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>{ad.headline || 'Sin titular'}</h4>
                                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, flex: 1, marginBottom: 14, maxHeight: 100, overflow: 'hidden' }}>
                                                    {(ad.copy || ad.scratch || '').split('\n\n').slice(0, 2).map((p, i) => {
                                                        const labels = ['ATENCIÓN', 'INTERÉS', 'DESEO', 'ACCIÓN'];
                                                        const m = labels.find(l => p.startsWith(l + ':'));
                                                        if (m) return <div key={i} style={{ marginBottom: 4 }}><span style={{ color: '#00E5FF', fontWeight: 700, fontSize: 10 }}>{m}: </span><span>{p.slice(m.length + 1).trim()}</span></div>;
                                                        return <p key={i} style={{ marginBottom: 4 }}>{p}</p>;
                                                    })}
                                                </div>
                                                <div style={{ display: 'flex', gap: 6, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                                    <button onClick={() => handleApprove(ad.id)} className={styles.btnSuccess} style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px 6px' }}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                                        Aprobar
                                                    </button>
                                                    <button onClick={() => { setEditingId(ad.id); setEditHeadline(ad.headline || ''); setEditCopy(ad.copy || ''); }}
                                                        className={styles.btnGhost} style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px 6px' }}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                        Editar
                                                    </button>
                                                    <button onClick={() => handleRegenImage(ad.id)} disabled={isRegen} title="Regenerar imagen"
                                                        className={styles.btnGhost} style={{ width: 36, justifyContent: 'center', padding: '8px 0', opacity: isRegen ? 0.4 : 1 }}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                                                    </button>
                                                    <button onClick={() => handleReject(ad.id)} className={styles.btnDanger} style={{ width: 36, justifyContent: 'center', padding: '8px 0' }}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* ══════════════════════════════
                CALENDAR TAB
            ══════════════════════════════ */}
            {activeTab === 'calendar' && (
                <div className={styles.tableCard}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>Cola de Publicación</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Publicación automática vía n8n — 11:00 AM y 7:30 PM CR</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#00c864', background: 'rgba(0,200,100,0.08)', padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(0,200,100,0.2)' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c864', boxShadow: '0 0 8px #00c864' }} />
                            n8n Activo
                        </div>
                    </div>
                    {scheduled.length === 0 ? (
                        <div style={{ padding: '60px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" style={{ marginBottom: 12 }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            <div>Aprueba anuncios en Propuestas para programarlos.</div>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead><tr><th>#</th><th>Titular</th><th>Programado para</th><th>Estado</th><th>Acción</th></tr></thead>
                            <tbody>
                                {scheduled.map((ad, i) => (
                                    <tr key={ad.id}>
                                        <td style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, width: 32 }}>{i + 1}</td>
                                        <td style={{ fontWeight: 600, color: '#fff' }}>{ad.headline || 'Sin titular'}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00c864" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                {ad.publishAt ? new Date(ad.publishAt).toLocaleString('es-CR') : 'Próxima hora caliente'}
                                            </div>
                                        </td>
                                        <td><span className={styles.badgeEnProgreso}>Programado</span></td>
                                        <td>
                                            <button onClick={() => handlePublishNow(ad.id)} className={styles.btnPrimary} style={{ fontSize: 12, padding: '6px 14px' }}>
                                                Publicar Ya
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ══════════════════════════════
                PUBLISHED TAB
            ══════════════════════════════ */}
            {activeTab === 'published' && (
                <div className={styles.tableCard}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 700 }}>Historial de Publicaciones</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{published.length} anuncios publicados en total</div>
                        </div>
                        {published.length > 0 && (
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', display: 'flex', gap: 16 }}>
                                <span>Tasa de publicación: <strong style={{ color: '#00E5FF' }}>{totalAds > 0 ? Math.round((published.length / totalAds) * 100) : 0}%</strong></span>
                            </div>
                        )}
                    </div>
                    {published.length === 0 ? (
                        <div style={{ padding: '60px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Aún no hay publicaciones.</div>
                    ) : (
                        <table className={styles.table}>
                            <thead><tr><th>#</th><th>Titular</th><th>Publicado</th><th>Estado</th></tr></thead>
                            <tbody>
                                {published.map((ad, i) => (
                                    <tr key={ad.id}>
                                        <td style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, width: 32 }}>{i + 1}</td>
                                        <td style={{ fontWeight: 600, color: '#fff' }}>{ad.headline || 'Sin titular'}</td>
                                        <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                                            {ad.publishAt ? new Date(ad.publishAt).toLocaleString('es-CR') : '—'}
                                        </td>
                                        <td><span className={styles.badgeCompletado}>Publicado</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ══════════════════════════════
                STRATEGY TAB
            ══════════════════════════════ */}
            {activeTab === 'strategy' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className={styles.tableCard}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                <div style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                                    Auditoría Estratégica
                                </div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Framework de 46 puntos — hooks, ofertas, estructura y escala</div>
                            </div>
                            <div style={{ padding: 24 }}>
                                <textarea className={styles.adminInput} style={{ height: 120, resize: 'none', marginBottom: 14 }}
                                    placeholder="Describe la estrategia, perfil de cliente o pega URL de anuncio para auditar..."
                                    value={auditContext} onChange={e => setAuditContext(e.target.value)} />
                                <button className={styles.btnPrimary} style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg,#6d28d9,#a855f7)' }}
                                    onClick={handleRunAudit} disabled={isAuditing || !auditContext.trim()}>
                                    {isAuditing ? 'J.A.R.V.I.S. analizando...' : 'Iniciar Auditoría Senior'}
                                </button>
                            </div>
                        </div>
                        {auditResult && (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={styles.tableCard} style={{ padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#00E5FF' }}>REPORTE DE ESTRATEGIA</div>
                                    <button onClick={() => setAuditResult(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 12 }}>Limpiar</button>
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.9, color: 'rgba(255,255,255,0.8)' }}>{auditResult}</div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className={styles.tableCard} style={{ padding: 20 }}>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Meta Developer</div>
                            {metaStats?.connected ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                        <div style={{ width: 8, height: 8, background: '#00c864', borderRadius: '50%', boxShadow: '0 0 10px #00c864' }} />
                                        <div style={{ fontSize: 14, fontWeight: 700 }}>Conectado</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10, fontSize: 12 }}>
                                        <div style={{ opacity: 0.4, marginBottom: 4 }}>Cuenta:</div>
                                        <div style={{ fontWeight: 600 }}>{metaStats.accountName}</div>
                                        <div style={{ opacity: 0.25, fontSize: 10 }}>ID: {metaStats.accountId}</div>
                                    </div>
                                    {metaStats.insights && (
                                        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                            <div style={{ background: 'rgba(0,102,255,0.1)', padding: 10, borderRadius: 10 }}>
                                                <div style={{ fontSize: 10, opacity: 0.4 }}>CTR (30d)</div>
                                                <div style={{ fontSize: 18, fontWeight: 800, color: '#00E5FF' }}>{metaStats.insights.ctr}%</div>
                                            </div>
                                            <div style={{ background: 'rgba(0,102,255,0.1)', padding: 10, borderRadius: 10 }}>
                                                <div style={{ fontSize: 10, opacity: 0.4 }}>Spend</div>
                                                <div style={{ fontSize: 18, fontWeight: 800 }}>${metaStats.insights.spend}</div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                        <div style={{ width: 8, height: 8, background: '#ff3366', borderRadius: '50%' }} />
                                        <div style={{ fontSize: 14, fontWeight: 700 }}>Desconectado</div>
                                    </div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, padding: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                                        {metaStats?.error || 'Token en espera de cuenta vinculada.'}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={styles.tableCard} style={{ padding: 20 }}>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>n8n Pipeline</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <div style={{ width: 8, height: 8, background: '#00c864', borderRadius: '50%', boxShadow: '0 0 8px #00c864' }} />
                                <span style={{ fontSize: 13, fontWeight: 600 }}>Webhook Activo</span>
                            </div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
                                Publica en Instagram automáticamente en las horas calientes: <strong style={{ color: '#fff' }}>11:00 AM</strong> y <strong style={{ color: '#fff' }}>7:30 PM</strong> (hora CR).
                            </div>
                        </div>

                        {/* Quick Stats summary */}
                        <div className={styles.tableCard} style={{ padding: 20 }}>
                            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>Resumen del Sistema</div>
                            {[
                                { label: 'Total generados', value: totalAds, color: '#fff' },
                                { label: 'Aprobados', value: scheduled.length + published.length, color: '#00c864' },
                                { label: 'Publicados', value: published.length, color: '#00E5FF' },
                                { label: 'Tasa aprobación', value: `${totalAds > 0 ? Math.round(((scheduled.length + published.length) / totalAds) * 100) : 0}%`, color: '#ffaa00' },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════
                PREVIEW MODAL
            ══════════════════════════════ */}
            <AnimatePresence>
                {previewUrl && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setPreviewUrl(null)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, backdropFilter: 'blur(16px)', cursor: 'zoom-out' }}>
                        <motion.div initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ type: 'spring', damping: 24 }}
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                            <img src={previewUrl} alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: 16, boxShadow: '0 0 80px rgba(0,102,255,0.2)', border: '1px solid rgba(255,255,255,0.08)', objectFit: 'contain' }} />
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => downloadImage(previewUrl, 'stephano-ad')}
                                    style={{ background: 'rgba(0,102,255,0.8)', border: '1px solid rgba(0,102,255,0.5)', color: '#fff', padding: '11px 28px', borderRadius: 100, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    Descargar
                                </button>
                                <button onClick={() => setPreviewUrl(null)}
                                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '11px 28px', borderRadius: 100, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
                                    Cerrar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
