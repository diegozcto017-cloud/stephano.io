'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/admin.module.css';
import { ATTACK_SEQUENCE } from '@/server/services/growth-brain.service';
import type { ContentIdea, ViralContent, CalendarEntry, PerformanceAnalysis, CTASet } from '@/server/services/growth-brain.service';

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface ContentPost {
    id: number;
    format: string;
    topic: string;
    hook: string | null;
    body: string | null;
    cta: string | null;
    script: string | null;
    caption: string | null;
    hashtags: string | null;
    objective: string | null;
    status: string;
    publishAt: string | null;
    sequence: number | null;
    createdAt: string;
    metrics: {
        views: number;
        retention: number;
        saves: number;
        shares: number;
        followersGained: number;
        diagnosis: string | null;
    } | null;
}

interface GrowthConfig {
    id: number;
    followerCount: number;
    mode: string;
    niche: string;
    targetAudience: string;
}

interface Pipeline {
    step: string;
    status: string;
    message: string;
    percent: number;
    result?: ViralContent & { ctaSet: CTASet };
    savedId?: number;
}

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const TABS = ['Overview', 'Ideas & Contenido', 'Calendario', 'Performance Lab', 'Conversión'];

const OBJECTIVE_COLORS: Record<string, string> = {
    alcance: '#00E5FF',
    guardados: '#00c864',
    viralidad: '#ff6b6b',
    credibilidad: '#f59e0b',
    compartidos: '#a855f7',
    leads: '#0066FF',
    identificación: '#ec4899',
    autoridad: '#f97316',
    confianza: '#14b8a6',
};

const FORMAT_ICONS: Record<string, React.ReactElement> = {
    reel: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
    carousel: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="6" height="18" rx="1" /><rect x="9" y="3" width="6" height="18" rx="1" /><rect x="16" y="3" width="6" height="18" rx="1" /></svg>,
    story: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2" /></svg>,
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function GrowthBrainClient() {
    const [activeTab, setActiveTab] = useState(0);
    const [config, setConfig] = useState<GrowthConfig | null>(null);
    const [posts, setPosts] = useState<ContentPost[]>([]);
    const [loading, setLoading] = useState(true);

    // Ideas tab
    const [niche, setNiche] = useState('desarrollo web y software');
    const [audience, setAudience] = useState('empresas y emprendedores en Costa Rica');
    const [ideas, setIdeas] = useState<ContentIdea[]>([]);
    const [ideasLoading, setIdeasLoading] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
    const [pipeline, setPipeline] = useState<Pipeline | null>(null);
    const [generatedContent, setGeneratedContent] = useState<(ViralContent & { ctaSet: CTASet }) | null>(null);

    // Calendar tab
    const [calendar, setCalendar] = useState<CalendarEntry[]>([]);
    const [calendarLoading, setCalendarLoading] = useState(false);

    // Performance tab
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [metricsForm, setMetricsForm] = useState({ views: 0, retention: 0, saves: 0, shares: 0, followersGained: 0, comments: 0, likes: 0 });
    const [analysis, setAnalysis] = useState<PerformanceAnalysis | null>(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    // Config edit
    const [editingConfig, setEditingConfig] = useState(false);
    const [followerInput, setFollowerInput] = useState('0');

    const abortRef = useRef<AbortController | null>(null);

    /* ── Load initial data ── */
    useEffect(() => {
        Promise.all([
            fetch('/api/growth-brain/config').then(r => r.json()),
            fetch('/api/growth-brain/posts').then(r => r.json()),
        ]).then(([cfg, postsData]) => {
            setConfig(cfg);
            setFollowerInput(String(cfg.followerCount ?? 0));
            setPosts(Array.isArray(postsData) ? postsData : []);
            setLoading(false);
        });
    }, []);

    /* ── Update follower count ── */
    const updateFollowers = async () => {
        const res = await fetch('/api/growth-brain/config', {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ followerCount: Number(followerInput) }),
        });
        const updated = await res.json();
        setConfig(updated);
        setEditingConfig(false);
    };

    /* ── Generate ideas ── */
    const generateIdeas = async () => {
        setIdeasLoading(true);
        setIdeas([]);
        setSelectedIdea(null);
        setGeneratedContent(null);
        try {
            const res = await fetch('/api/growth-brain/ideas', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ niche, audience }),
            });
            const data = await res.json();
            setIdeas(data.ideas || []);
        } finally {
            setIdeasLoading(false);
        }
    };

    /* ── Generate content via SSE ── */
    const generateContent = useCallback(async (idea: ContentIdea, seqNum?: number) => {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        setGeneratedContent(null);
        setPipeline({ step: 'start', status: 'in_progress', message: 'Iniciando Growth Brain...', percent: 5 });

        try {
            const res = await fetch('/api/growth-brain/generate', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    idea: idea.title + ' — ' + idea.angle,
                    format: idea.format,
                    objective: idea.objective,
                    sequenceNumber: seqNum,
                    save: true,
                }),
                signal: abortRef.current.signal,
            });

            const reader = res.body!.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value);
                for (const line of text.split('\n')) {
                    if (!line.startsWith('data: ')) continue;
                    try {
                        const event = JSON.parse(line.slice(6)) as Pipeline;
                        setPipeline(event);
                        if (event.step === 'done' && event.result) {
                            setGeneratedContent(event.result as ViralContent & { ctaSet: CTASet });
                            // Reload posts
                            fetch('/api/growth-brain/posts').then(r => r.json()).then(data => {
                                setPosts(Array.isArray(data) ? data : []);
                            });
                        }
                    } catch { /* skip malformed */ }
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setPipeline({ step: 'error', status: 'error', message: String(err), percent: 0 });
            }
        }
    }, []);

    /* ── Generate from attack sequence ── */
    const generateFromSequence = (seqItem: typeof ATTACK_SEQUENCE[0]) => {
        const idea: ContentIdea = {
            title: seqItem.title,
            angle: seqItem.description,
            format: seqItem.type as 'reel' | 'carousel',
            objective: seqItem.objective,
            viralPotential: 'alto',
            hook: seqItem.description,
        };
        setSelectedIdea(idea);
        setActiveTab(1);
        generateContent(idea, seqItem.seq);
    };

    /* ── Generate calendar ── */
    const generateCalendar = async () => {
        setCalendarLoading(true);
        setCalendar([]);
        try {
            const res = await fetch('/api/growth-brain/calendar', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ niche: config?.niche || niche, audience: config?.targetAudience || audience }),
            });
            const data = await res.json();
            setCalendar(data.calendar || []);
        } finally {
            setCalendarLoading(false);
        }
    };

    /* ── Analyze performance ── */
    const analyzePerf = async () => {
        if (!selectedPostId) return;
        const post = posts.find(p => p.id === selectedPostId);
        if (!post) return;

        setAnalysisLoading(true);
        setAnalysis(null);
        try {
            const res = await fetch('/api/growth-brain/metrics', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    postId: selectedPostId,
                    metrics: {
                        ...metricsForm,
                        originalTopic: post.topic,
                        originalHook: post.hook || '',
                        originalCta: post.cta || '',
                    },
                }),
            });
            const data = await res.json();
            setAnalysis(data.analysis);
            // Refresh posts
            fetch('/api/growth-brain/posts').then(r => r.json()).then(d => setPosts(Array.isArray(d) ? d : []));
        } finally {
            setAnalysisLoading(false);
        }
    };

    /* ── Delete post ── */
    const deletePost = async (id: number) => {
        await fetch(`/api/growth-brain/posts?id=${id}`, { method: 'DELETE' });
        setPosts(prev => prev.filter(p => p.id !== id));
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <div style={{ color: '#a855f7', fontSize: 14 }}>Cargando Growth Brain...</div>
            </div>
        );
    }

    const publishedCount = posts.filter(p => p.status === 'published').length;
    const generatedCount = posts.filter(p => p.status === 'generated').length;
    const sequenceCompleted = ATTACK_SEQUENCE.filter(s => posts.some(p => p.sequence === s.seq)).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* ── CONFIG BAR ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)',
                borderRadius: 12, padding: '12px 20px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#888', fontSize: 12 }}>Seguidores:</span>
                    {editingConfig ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                            <input
                                value={followerInput}
                                onChange={e => setFollowerInput(e.target.value)}
                                style={{ width: 80, background: '#111', border: '1px solid #333', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: 13 }}
                                type="number" min="0"
                            />
                            <button onClick={updateFollowers} style={{ background: '#a855f7', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>OK</button>
                            <button onClick={() => setEditingConfig(false)} style={{ background: '#222', color: '#888', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>×</button>
                        </div>
                    ) : (
                        <button onClick={() => setEditingConfig(true)} style={{ background: 'none', border: 'none', color: '#a855f7', fontWeight: 700, fontSize: 16, cursor: 'pointer', padding: 0 }}>
                            {(config?.followerCount ?? 0).toLocaleString()}
                        </button>
                    )}
                </div>
                <div style={{ width: 1, height: 20, background: '#333' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: '#a855f7', fontWeight: 600, background: 'rgba(168,85,247,0.15)', padding: '3px 10px', borderRadius: 100 }}>
                        {(config?.followerCount ?? 0) < 1000 ? 'MASSIVE REACH STARTER' : 'GROWTH MODE'}
                    </span>
                </div>
                <div style={{ width: 1, height: 20, background: '#333' }} />
                <span style={{ fontSize: 12, color: '#888' }}>Instagram · {config?.niche}</span>
            </div>

            {/* ── TABS ── */}
            <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #1a1a1a', paddingBottom: 0 }}>
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        style={{
                            padding: '10px 18px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === i ? '2px solid #a855f7' : '2px solid transparent',
                            color: activeTab === i ? '#a855f7' : '#888',
                            fontSize: 13,
                            fontWeight: activeTab === i ? 600 : 400,
                            cursor: 'pointer',
                            marginBottom: -1,
                            transition: 'all 0.2s',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

                    {/* ══════════════════════════════
                        TAB 0: OVERVIEW
                    ══════════════════════════════ */}
                    {activeTab === 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {/* KPIs */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                                {[
                                    { label: 'Contenido Generado', value: posts.length, color: '#a855f7' },
                                    { label: 'Publicados', value: publishedCount, color: '#00c864' },
                                    { label: 'En Cola', value: generatedCount, color: '#00E5FF' },
                                    { label: 'Secuencia Completada', value: `${sequenceCompleted}/10`, color: '#f59e0b' },
                                ].map(kpi => (
                                    <div key={kpi.label} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 20px' }}>
                                        <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{kpi.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* 5 Engines Status */}
                            <div>
                                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Los 5 Motores del Growth Brain</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                                    {[
                                        { name: 'Content Discovery', desc: 'Detecta temas con potencial viral', icon: '🔍', active: true },
                                        { name: 'Viral Content', desc: 'Genera guiones y carruseles', icon: '🎬', active: true },
                                        { name: 'Distribution', desc: 'Planifica calendario de 30 días', icon: '📅', active: true },
                                        { name: 'Performance Lab', desc: 'Analiza métricas y optimiza', icon: '📊', active: true },
                                        { name: 'Lead Conversion', desc: 'Convierte audiencia en clientes', icon: '🎯', active: true },
                                    ].map(engine => (
                                        <div key={engine.name} style={{
                                            background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12,
                                            padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
                                        }}>
                                            <span style={{ fontSize: 22 }}>{engine.icon}</span>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{engine.name}</div>
                                                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{engine.desc}</div>
                                                <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#00c864', fontWeight: 600 }}>
                                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c864', display: 'inline-block' }} />
                                                    Activo
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attack Sequence */}
                            <div>
                                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Secuencia de Ataque — Perfil Nuevo</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {ATTACK_SEQUENCE.map(item => {
                                        const done = posts.some(p => p.sequence === item.seq);
                                        return (
                                            <div key={item.seq} style={{
                                                display: 'flex', alignItems: 'center', gap: 12,
                                                background: done ? 'rgba(0,200,100,0.05)' : '#0d0d0d',
                                                border: `1px solid ${done ? 'rgba(0,200,100,0.2)' : '#1a1a1a'}`,
                                                borderRadius: 10, padding: '10px 16px',
                                            }}>
                                                <span style={{
                                                    width: 28, height: 28, borderRadius: '50%',
                                                    background: done ? '#00c864' : '#1a1a1a',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 12, fontWeight: 700, color: done ? '#000' : '#555',
                                                    flexShrink: 0,
                                                }}>{item.seq}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 13, color: done ? '#00c864' : '#ccc', fontWeight: 500 }}>{item.title}</div>
                                                    <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>
                                                        {item.type.toUpperCase()} · Objetivo: {item.objective}
                                                    </div>
                                                </div>
                                                {!done && (
                                                    <button
                                                        onClick={() => generateFromSequence(item)}
                                                        style={{
                                                            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
                                                            color: '#a855f7', borderRadius: 8, padding: '6px 12px',
                                                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                                                        }}
                                                    >
                                                        Generar
                                                    </button>
                                                )}
                                                {done && (
                                                    <span style={{ fontSize: 11, color: '#00c864', fontWeight: 600 }}>✓ Listo</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Recent posts */}
                            {posts.length > 0 && (
                                <div>
                                    <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Contenido Reciente</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {posts.slice(0, 5).map(post => (
                                            <div key={post.id} style={{
                                                background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 10,
                                                padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center',
                                            }}>
                                                <span style={{ color: OBJECTIVE_COLORS[post.objective || ''] || '#888' }}>
                                                    {FORMAT_ICONS[post.format] || FORMAT_ICONS.reel}
                                                </span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 13, color: '#ccc' }}>{post.hook || post.topic}</div>
                                                    <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                                                        {post.format.toUpperCase()} · {post.objective} · {new Date(post.createdAt).toLocaleDateString('es-CR')}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
                                                    background: post.status === 'published' ? 'rgba(0,200,100,0.1)' : 'rgba(168,85,247,0.1)',
                                                    color: post.status === 'published' ? '#00c864' : '#a855f7',
                                                }}>
                                                    {post.status}
                                                </span>
                                                <button onClick={() => deletePost(post.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══════════════════════════════
                        TAB 1: IDEAS & CONTENIDO
                    ══════════════════════════════ */}
                    {activeTab === 1 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
                            {/* LEFT — Discovery */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: 20 }}>
                                    <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span>🔍</span> Content Discovery Engine
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Nicho</label>
                                            <input
                                                value={niche}
                                                onChange={e => setNiche(e.target.value)}
                                                style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Audiencia objetivo</label>
                                            <input
                                                value={audience}
                                                onChange={e => setAudience(e.target.value)}
                                                style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
                                            />
                                        </div>
                                        <button
                                            onClick={generateIdeas}
                                            disabled={ideasLoading}
                                            style={{
                                                background: ideasLoading ? '#1a1a1a' : 'rgba(168,85,247,0.15)',
                                                border: '1px solid rgba(168,85,247,0.3)',
                                                color: ideasLoading ? '#555' : '#a855f7',
                                                borderRadius: 8, padding: '10px 0',
                                                fontSize: 13, fontWeight: 600, cursor: ideasLoading ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {ideasLoading ? 'Buscando ideas...' : '⚡ Generar 8 Ideas Virales'}
                                        </button>
                                    </div>
                                </div>

                                {/* Ideas list */}
                                {ideas.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {ideas.map((idea, i) => (
                                            <div
                                                key={i}
                                                onClick={() => { setSelectedIdea(idea); generateContent(idea); }}
                                                style={{
                                                    background: selectedIdea === idea ? 'rgba(168,85,247,0.1)' : '#0d0d0d',
                                                    border: `1px solid ${selectedIdea === idea ? 'rgba(168,85,247,0.4)' : '#1a1a1a'}`,
                                                    borderRadius: 10, padding: '12px 14px',
                                                    cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                                    <div style={{ fontSize: 13, color: '#ddd', fontWeight: 500, lineHeight: 1.4 }}>{idea.title}</div>
                                                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                                        <span style={{
                                                            fontSize: 10, padding: '2px 7px', borderRadius: 100,
                                                            background: 'rgba(168,85,247,0.15)', color: '#a855f7', fontWeight: 600,
                                                        }}>{idea.format}</span>
                                                        <span style={{
                                                            fontSize: 10, padding: '2px 7px', borderRadius: 100,
                                                            background: idea.viralPotential === 'alto' ? 'rgba(0,200,100,0.15)' : 'rgba(245,158,11,0.15)',
                                                            color: idea.viralPotential === 'alto' ? '#00c864' : '#f59e0b', fontWeight: 600,
                                                        }}>{idea.viralPotential}</span>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>"{idea.hook}"</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT — Viral Content Generator */}
                            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: 20 }}>
                                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span>🎬</span> Viral Content Engine
                                </h3>

                                {/* Pipeline progress */}
                                {pipeline && pipeline.step !== 'done' && pipeline.step !== 'error' && (
                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ fontSize: 12, color: '#a855f7' }}>{pipeline.message}</span>
                                            <span style={{ fontSize: 12, color: '#555' }}>{pipeline.percent}%</span>
                                        </div>
                                        <div style={{ height: 4, background: '#111', borderRadius: 4 }}>
                                            <motion.div
                                                style={{ height: '100%', background: '#a855f7', borderRadius: 4 }}
                                                animate={{ width: `${pipeline.percent}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Error */}
                                {pipeline?.step === 'error' && (
                                    <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                                        <span style={{ color: '#ff5050', fontSize: 12 }}>{pipeline.message}</span>
                                    </div>
                                )}

                                {/* No content yet */}
                                {!generatedContent && !pipeline && (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
                                        <div style={{ fontSize: 36, marginBottom: 12 }}>🎬</div>
                                        <div style={{ fontSize: 13 }}>Selecciona una idea para generar contenido viral</div>
                                    </div>
                                )}

                                {/* Loading skeleton */}
                                {pipeline && pipeline.step !== 'done' && pipeline.step !== 'error' && !generatedContent && (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
                                        <div style={{ fontSize: 13 }}>Generando con Claude Sonnet 4.6...</div>
                                    </div>
                                )}

                                {/* Generated content */}
                                {generatedContent && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {/* Hook */}
                                        <ContentBlock label="Hook de apertura" color="#a855f7" content={generatedContent.hook} />

                                        {/* Script or Slides */}
                                        {generatedContent.script && (
                                            <ContentBlock label="Guión del Reel" color="#00E5FF" content={generatedContent.script} multiline />
                                        )}
                                        {generatedContent.slides && generatedContent.slides.length > 0 && (
                                            <div>
                                                <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 8 }}>Slides del Carrusel</label>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    {generatedContent.slides.map((slide, i) => (
                                                        <div key={i} style={{
                                                            background: '#111', borderRadius: 8, padding: '10px 12px',
                                                            border: '1px solid #222', fontSize: 12, color: '#ccc',
                                                        }}>
                                                            <span style={{ color: '#a855f7', fontWeight: 600, marginRight: 6 }}>Slide {i + 1}</span>
                                                            {slide}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Caption */}
                                        <ContentBlock label="Caption de Instagram" color="#00c864" content={generatedContent.caption} multiline />

                                        {/* Hashtags */}
                                        <div>
                                            <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Hashtags</label>
                                            <div style={{ background: '#111', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#888', lineHeight: 1.6 }}>
                                                {generatedContent.hashtags}
                                            </div>
                                        </div>

                                        {/* CTAs */}
                                        <div style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 10, padding: 14 }}>
                                            <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 600, marginBottom: 10 }}>🎯 CTAs de Conversión</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                <CTAItem label="Comentario fijado" value={generatedContent.ctaSet.pinnedComment} />
                                                <CTAItem label="CTA del Reel" value={generatedContent.ctaSet.reelCta} />
                                                <CTAItem label="Último slide" value={generatedContent.ctaSet.carouselLastSlide} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════
                        TAB 2: CALENDARIO
                    ══════════════════════════════ */}
                    {activeTab === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>Calendario de 30 Días</h3>
                                    <p style={{ color: '#666', fontSize: 12, margin: '4px 0 0' }}>70% Reels · 30% Carruseles · Secuencia de ataque en días 1-10</p>
                                </div>
                                <button
                                    onClick={generateCalendar}
                                    disabled={calendarLoading}
                                    style={{
                                        background: calendarLoading ? '#111' : 'rgba(168,85,247,0.15)',
                                        border: '1px solid rgba(168,85,247,0.3)',
                                        color: calendarLoading ? '#555' : '#a855f7',
                                        borderRadius: 8, padding: '10px 20px',
                                        fontSize: 13, fontWeight: 600, cursor: calendarLoading ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {calendarLoading ? 'Generando...' : '📅 Generar Calendario IA'}
                                </button>
                            </div>

                            {calendar.length === 0 && !calendarLoading && (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
                                    <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                                    <div style={{ fontSize: 14, marginBottom: 8 }}>Sin calendario generado</div>
                                    <div style={{ fontSize: 12 }}>Haz clic en "Generar Calendario IA" para crear tu plan de 30 días</div>
                                </div>
                            )}

                            {calendarLoading && (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a855f7' }}>
                                    Generando calendario con Claude Sonnet 4.6...
                                </div>
                            )}

                            {calendar.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                                    {calendar.map((entry) => {
                                        const color = OBJECTIVE_COLORS[entry.objective] || '#888';
                                        const isSeq = entry.day <= 10;
                                        return (
                                            <div key={entry.day} style={{
                                                background: isSeq ? 'rgba(168,85,247,0.05)' : '#0d0d0d',
                                                border: `1px solid ${isSeq ? 'rgba(168,85,247,0.2)' : '#1a1a1a'}`,
                                                borderRadius: 10, padding: '12px 14px',
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                    <span style={{ fontSize: 22, fontWeight: 700, color: isSeq ? '#a855f7' : '#444' }}>D{entry.day}</span>
                                                    <div style={{ display: 'flex', gap: 4 }}>
                                                        <span style={{ color, fontSize: 11 }}>{FORMAT_ICONS[entry.format] || FORMAT_ICONS.reel}</span>
                                                        <span style={{ fontSize: 10, color, fontWeight: 600, background: `${color}20`, padding: '2px 6px', borderRadius: 4 }}>{entry.format}</span>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 12, color: '#ccc', lineHeight: 1.4, marginBottom: 6 }}>{entry.topic}</div>
                                                <div style={{ fontSize: 10, color: color, fontWeight: 600 }}>🎯 {entry.objective}</div>
                                                <div style={{ fontSize: 10, color: '#555', marginTop: 4, fontStyle: 'italic' }}>"{entry.hook}"</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══════════════════════════════
                        TAB 3: PERFORMANCE LAB
                    ══════════════════════════════ */}
                    {activeTab === 3 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
                            {/* Left — Metrics input */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: 20 }}>
                                    <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>📊 Ingresar Métricas</h3>

                                    {/* Post selector */}
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 4 }}>Seleccionar publicación</label>
                                        <select
                                            value={selectedPostId ?? ''}
                                            onChange={e => setSelectedPostId(Number(e.target.value) || null)}
                                            style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }}
                                        >
                                            <option value="">— Seleccionar —</option>
                                            {posts.map(p => (
                                                <option key={p.id} value={p.id}>{p.hook || p.topic} ({p.format})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Metric fields */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        {[
                                            { key: 'views', label: 'Vistas' },
                                            { key: 'retention', label: 'Retención %' },
                                            { key: 'saves', label: 'Guardados' },
                                            { key: 'shares', label: 'Compartidos' },
                                            { key: 'followersGained', label: 'Nuevos seguidores' },
                                            { key: 'comments', label: 'Comentarios' },
                                            { key: 'likes', label: 'Likes' },
                                        ].map(field => (
                                            <div key={field.key}>
                                                <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3 }}>{field.label}</label>
                                                <input
                                                    type="number"
                                                    value={metricsForm[field.key as keyof typeof metricsForm]}
                                                    onChange={e => setMetricsForm(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                                                    style={{ width: '100%', background: '#111', border: '1px solid #222', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: 13, boxSizing: 'border-box' }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={analyzePerf}
                                        disabled={!selectedPostId || analysisLoading}
                                        style={{
                                            marginTop: 16,
                                            width: '100%',
                                            background: (!selectedPostId || analysisLoading) ? '#1a1a1a' : 'rgba(168,85,247,0.15)',
                                            border: '1px solid rgba(168,85,247,0.3)',
                                            color: (!selectedPostId || analysisLoading) ? '#555' : '#a855f7',
                                            borderRadius: 8, padding: '10px 0',
                                            fontSize: 13, fontWeight: 600, cursor: (!selectedPostId || analysisLoading) ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {analysisLoading ? 'Analizando con IA...' : '🔬 Analizar Performance'}
                                    </button>
                                </div>
                            </div>

                            {/* Right — Analysis results */}
                            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: 20 }}>
                                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Diagnóstico IA</h3>

                                {!analysis && !analysisLoading && (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555' }}>
                                        <div style={{ fontSize: 40, marginBottom: 12 }}>🔬</div>
                                        <div style={{ fontSize: 13 }}>Ingresa métricas y presiona "Analizar"</div>
                                    </div>
                                )}

                                {analysisLoading && (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#a855f7' }}>
                                        Diagnosticando con Claude Sonnet 4.6...
                                    </div>
                                )}

                                {analysis && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {/* Score */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{
                                                width: 72, height: 72, borderRadius: '50%',
                                                background: `conic-gradient(${analysis.score >= 7 ? '#00c864' : analysis.score >= 5 ? '#f59e0b' : '#ff5050'} ${analysis.score * 36}deg, #1a1a1a 0deg)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                position: 'relative',
                                            }}>
                                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{analysis.score}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 13, color: '#ccc' }}>{analysis.diagnosis}</div>
                                            </div>
                                        </div>

                                        {/* Weak points */}
                                        {analysis.weakPoints.length > 0 && (
                                            <div style={{ background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.15)', borderRadius: 8, padding: 12 }}>
                                                <div style={{ fontSize: 11, color: '#ff5050', fontWeight: 600, marginBottom: 8 }}>Puntos débiles</div>
                                                {analysis.weakPoints.map((wp, i) => (
                                                    <div key={i} style={{ fontSize: 12, color: '#ccc', marginBottom: 4 }}>• {wp}</div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Optimized versions */}
                                        <div>
                                            <div style={{ fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 10 }}>3 Versiones Optimizadas</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                {analysis.optimizedVersions.map((v, i) => (
                                                    <div key={i} style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: '12px 14px' }}>
                                                        <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 600, marginBottom: 6 }}>{v.version}</div>
                                                        <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>{v.change}</div>
                                                        <div style={{ fontSize: 11, color: '#ccc' }}><span style={{ color: '#888' }}>Hook: </span>{v.newHook}</div>
                                                        <div style={{ fontSize: 11, color: '#ccc', marginTop: 3 }}><span style={{ color: '#888' }}>CTA: </span>{v.newCta}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recommendation */}
                                        <div style={{ background: 'rgba(0,200,100,0.05)', border: '1px solid rgba(0,200,100,0.15)', borderRadius: 8, padding: 12 }}>
                                            <div style={{ fontSize: 11, color: '#00c864', fontWeight: 600, marginBottom: 4 }}>Recomendación principal</div>
                                            <div style={{ fontSize: 12, color: '#ccc' }}>{analysis.recommendation}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════
                        TAB 4: CONVERSIÓN
                    ══════════════════════════════ */}
                    {activeTab === 4 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24 }}>
                                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>🎯 Lead Conversion Engine</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <h4 style={{ color: '#a855f7', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Ciclo de Conversión</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {[
                                                { step: '1', label: 'Publicar contenido de valor', icon: '📤' },
                                                { step: '↓', label: '', icon: '' },
                                                { step: '2', label: 'Analizar métricas 24-48h', icon: '📊' },
                                                { step: '↓', label: '', icon: '' },
                                                { step: '3', label: 'Diagnosticar con Performance Lab', icon: '🔬' },
                                                { step: '↓', label: '', icon: '' },
                                                { step: '4', label: 'Generar versiones optimizadas', icon: '⚡' },
                                                { step: '↓', label: '', icon: '' },
                                                { step: '5', label: 'Actualizar calendario y repetir', icon: '🔄' },
                                            ].map((item, i) => (
                                                item.icon ? (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#a855f7', flexShrink: 0 }}>{item.step}</span>
                                                        <span style={{ fontSize: 13, color: '#ccc' }}>{item.icon} {item.label}</span>
                                                    </div>
                                                ) : (
                                                    <div key={i} style={{ paddingLeft: 14, color: '#333', fontSize: 16 }}>↓</div>
                                                )
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 style={{ color: '#a855f7', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>CTAs Estándar — stephano.io</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {[
                                                { label: 'Comentario fijado', value: '¿Tienes un proyecto de software o sitio web en mente? Cuéntame aquí o visita stephano.io para cotizar.' },
                                                { label: 'Bio Instagram', value: '🚀 Desarrollo web y software | stephano.io' },
                                                { label: 'CTA de Reel', value: 'Si necesitas algo así para tu negocio, visita stephano.io' },
                                                { label: 'Último slide Carrusel', value: '¿Listo para llevar tu negocio al siguiente nivel digital? Cotiza en stephano.io' },
                                                { label: 'Historia con enlace', value: 'Desliza para ver nuestro portafolio y cotizar tu proyecto' },
                                            ].map((cta, i) => (
                                                <div key={i} style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: '10px 12px' }}>
                                                    <div style={{ fontSize: 10, color: '#888', fontWeight: 600, marginBottom: 4 }}>{cta.label}</div>
                                                    <div style={{ fontSize: 12, color: '#ccc', lineHeight: 1.5 }}>{cta.value}</div>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(cta.value)}
                                                        style={{ marginTop: 8, background: 'none', border: 'none', color: '#a855f7', fontSize: 11, cursor: 'pointer', padding: 0 }}
                                                    >
                                                        Copiar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats summary */}
                            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: 20 }}>
                                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Lógica del Algoritmo de Crecimiento</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: '#888' }}>
                                    {['Prueba inicial', '→', 'Retención alta', '→', 'Interacciones rápidas', '→', 'Repeticiones', '→', 'Ampliación de alcance'].map((item, i) => (
                                        <span key={i} style={{ color: item === '→' ? '#333' : '#ccc', fontWeight: item === '→' ? 400 : 500 }}>{item}</span>
                                    ))}
                                </div>
                                <div style={{ marginTop: 12, fontSize: 12, color: '#555' }}>
                                    Si el contenido no supera la prueba inicial → diagnosticar con Performance Lab → generar versión optimizada → republicar
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* ─────────────────────────────────────────
   HELPER COMPONENTS
───────────────────────────────────────── */
function ContentBlock({ label, color, content, multiline = false }: { label: string; color: string; content: string | null | undefined; multiline?: boolean }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        if (content) {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: 11, color: '#888' }}>{label}</label>
                <button onClick={copy} style={{ background: 'none', border: 'none', color: copied ? '#00c864' : '#555', fontSize: 11, cursor: 'pointer', padding: 0 }}>
                    {copied ? '✓ Copiado' : 'Copiar'}
                </button>
            </div>
            <div style={{
                background: '#111', border: `1px solid ${color}33`, borderRadius: 8,
                padding: '10px 12px', fontSize: 12, color: '#ccc',
                lineHeight: 1.6, whiteSpace: multiline ? 'pre-wrap' : 'normal',
                maxHeight: multiline ? 200 : undefined, overflowY: multiline ? 'auto' : undefined,
            }}>
                {content || '—'}
            </div>
        </div>
    );
}

function CTAItem({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: '#888', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, color: '#ccc' }}>{value}</div>
            </div>
            <button
                onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                style={{ background: 'none', border: 'none', color: copied ? '#00c864' : '#555', fontSize: 11, cursor: 'pointer', flexShrink: 0, paddingTop: 14 }}
            >
                {copied ? '✓' : 'Copiar'}
            </button>
        </div>
    );
}
