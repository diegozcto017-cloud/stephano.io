'use client';

import { useState, useCallback, useEffect } from 'react';

/* ── Types ── */
interface Idea {
    id: string;
    title: string;
    hook: string;
    angle: string;
    format: string;
    slides: number;
    industry: string;
    viralScore: number;
    why: string;
    category?: '70' | '20' | '10';
    pillar?: 'educativo' | 'entretenido' | 'emocional';
}

interface Slide {
    number: number;
    type: string;
    headline: string;
    body: string;
    accentWord?: string;
}

interface Generated {
    carouselTitle: string;
    slides: Slide[];
    caption: string;
    hashtags: string;
    reelHook: string;
}

interface IGStatus {
    connected: boolean;
    account?: { username: string; followers: number; posts: number } | null;
}

/* ── Constants ── */
const INDUSTRIES = [
    { label: 'Todos los negocios', value: 'general', emoji: '🌐' },
    { label: 'Restaurantes / Sodas', value: 'restaurant', emoji: '🍽️' },
    { label: 'Salones / Spas', value: 'salon', emoji: '💆' },
    { label: 'Clínicas / Médicos', value: 'clinic', emoji: '🏥' },
    { label: 'Tiendas / Retail', value: 'retail', emoji: '🛍️' },
    { label: 'E-commerce', value: 'ecommerce', emoji: '🛒' },
    { label: 'Gimnasios / Fitness', value: 'gym', emoji: '🏋️' },
    { label: 'Hoteles / Hospedajes', value: 'hotel', emoji: '🏨' },
    { label: 'Servicios profesionales', value: 'services', emoji: '💼' },
    { label: 'Talleres / Autos', value: 'auto', emoji: '🔧' },
    { label: 'Ferreterías', value: 'hardware', emoji: '🔩' },
    { label: 'Farmacias', value: 'pharmacy', emoji: '💊' },
    { label: 'Academias / Educación', value: 'education', emoji: '🎓' },
    { label: 'Bienes Raíces', value: 'realestate', emoji: '🏠' },
    { label: 'Eventos', value: 'events', emoji: '🎪' },
    { label: 'Distribuidores', value: 'distribution', emoji: '🚚' },
];

const SITE_SECTIONS = [
    { label: 'General', value: 'general', emoji: '🌐', desc: 'Contenido general de Stephano.io' },
    { label: 'Home', value: 'home', emoji: '🏠', desc: 'Página principal: conversión, landing, e-commerce' },
    { label: 'Ecosistema', value: 'ecosistema', emoji: '🌿', desc: '28 industrias, CRM, ventas, integraciones' },
    { label: 'Cotizar', value: 'cotizar', emoji: '💰', desc: 'Constructor de alcance, precios, process' },
    { label: 'Proceso', value: 'proceso', emoji: '⚙️', desc: '5 fases: diagnóstico → lanzamiento' },
    { label: 'Contactar', value: 'contactar', emoji: '💬', desc: 'Chatbot IA, WhatsApp, consultoría' },
];

function getQuickTemplates(section: string, industry: string) {
    const ind = INDUSTRIES.find(i => i.value === industry);
    const label = ind && industry !== 'general' ? (ind.label.split('/')[0].trim()) : 'tu negocio';
    const all = [
        { title: `¿${label} pierde clientes sin presencia digital?`, section: 'home', slides: 5 },
        { title: `Por qué ${label} necesita más que solo redes sociales`, section: 'home', slides: 5 },
        { title: `El ecosistema digital que gestiona ${label} completo`, section: 'ecosistema', slides: 5 },
        { title: `De WhatsApp caótico a sistema automático en ${label}`, section: 'ecosistema', slides: 5 },
        { title: `¿Cuánto cuesta digitalizar ${label}? Te lo decimos`, section: 'cotizar', slides: 4 },
        { title: `Cómo transformamos ${label} en 5 fases`, section: 'proceso', slides: 6 },
        { title: `Chatbot IA 24/7 para atender a tus clientes de ${label}`, section: 'contactar', slides: 5 },
        { title: `3 errores digitales que le cuestan clientes a ${label}`, section: 'general', slides: 5 },
    ];
    const filtered = section === 'general' ? all : all.filter(t => t.section === section || t.section === 'general');
    return filtered.slice(0, 6).map(t => ({ ...t, industry }));
}

const ANGLE_COLORS: Record<string, string> = {
    'pain-point': '#ff6b6b',
    'education': '#00E5FF',
    'before-after': '#a855f7',
    'social-proof': '#00c864',
    'showcase': '#ffaa00',
};

const PILLAR_COLORS: Record<string, string> = {
    'educativo': '#00D9FF',
    'entretenido': '#ffaa00',
    'emocional': '#a855f7',
};

const CATEGORY_LABEL: Record<string, string> = {
    '70': '70% Probado',
    '20': '20% Ganador',
    '10': '10% Experimental',
};

const WEEKLY_WORKFLOW = [
    { day: 'Lunes', task: 'Generar 10 ideas (70-20-10)', icon: '💡', color: '#00D9FF' },
    { day: 'Martes', task: 'Escribir guiones: slides + caption + hashtags', icon: '✍️', color: '#a855f7' },
    { day: 'Miércoles', task: 'Generar imágenes con IA + grabar video', icon: '🎨', color: '#00c864' },
    { day: 'Jueves', task: 'Editar y programar todo el contenido', icon: '📅', color: '#ffaa00' },
    { day: 'Viernes', task: 'Publicar + responder comentarios y DMs', icon: '📱', color: '#ff6b6b' },
    { day: 'Sábado', task: 'Analizar métricas y engagement', icon: '📊', color: '#00D9FF' },
    { day: 'Domingo', task: 'Ajustar estrategia para la semana siguiente', icon: '🔄', color: '#a855f7' },
];

/* ── Helpers ── */
function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ background: copied ? 'rgba(0,200,100,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(0,200,100,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '5px 12px', color: copied ? '#00c864' : '#aaa', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap' }}
        >
            {copied ? '✓ Copiado' : 'Copiar'}
        </button>
    );
}

/* ── Instagram Preview ── */
function PhonePreview({ slides, images, caption, hashtags, activeSlide, onSlideChange }: {
    slides: Slide[];
    images: (string | null)[];
    caption: string;
    hashtags: string;
    activeSlide: number;
    onSlideChange: (i: number) => void;
}) {
    const slide = slides[activeSlide];
    const imgUrl = images[activeSlide];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            {/* Phone frame */}
            <div style={{ width: 280, background: '#1a1a1a', borderRadius: 36, padding: '10px 6px 20px', border: '2px solid #333', boxShadow: '0 0 40px rgba(0,217,255,0.08)' }}>
                {/* Notch */}
                <div style={{ width: 80, height: 20, background: '#111', borderRadius: 10, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 8, height: 8, background: '#333', borderRadius: '50%' }} />
                </div>

                {/* Instagram UI */}
                <div style={{ background: '#000', borderRadius: 24, overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #111' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #00D9FF, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#000' }}>S</div>
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>stephano.io</div>
                            <div style={{ fontSize: 8, color: '#555' }}>Costa Rica 🇨🇷</div>
                        </div>
                        <div style={{ marginLeft: 'auto', fontSize: 16, color: '#fff' }}>···</div>
                    </div>

                    {/* Image area */}
                    <div style={{ width: '100%', aspectRatio: '1/1', background: '#0a0a0f', position: 'relative', overflow: 'hidden' }}>
                        {imgUrl ? (
                            <img src={imgUrl} alt={slide.headline} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <SlideCard slide={slide} index={activeSlide} total={slides.length} />
                        )}
                        {/* Carousel dots */}
                        {slides.length > 1 && (
                            <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4 }}>
                                {slides.map((_, i) => (
                                    <div key={i} onClick={() => onSlideChange(i)} style={{ width: i === activeSlide ? 16 : 6, height: 6, borderRadius: 3, background: i === activeSlide ? '#00D9FF' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.2s' }} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ padding: '8px 12px' }}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                            {['♡', '💬', '⊳'].map((icon, i) => (
                                <div key={i} style={{ fontSize: 16, cursor: 'pointer' }}>{icon}</div>
                            ))}
                            <div style={{ marginLeft: 'auto', fontSize: 14, cursor: 'pointer' }}>🔖</div>
                        </div>
                        <div style={{ fontSize: 9, color: '#888', marginBottom: 4 }}>1,234 Me gusta</div>
                        <div style={{ fontSize: 9, color: '#fff', lineHeight: 1.4 }}>
                            <span style={{ fontWeight: 700 }}>stephano.io </span>
                            {caption?.slice(0, 80)}{caption?.length > 80 ? '... ' : ' '}
                            <span style={{ color: '#00D9FF' }}>más</span>
                        </div>
                        <div style={{ fontSize: 8, color: '#00D9FF', marginTop: 4, lineHeight: 1.6 }}>
                            {hashtags?.split(' ').slice(0, 8).join(' ')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation arrows */}
            <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => onSlideChange(Math.max(0, activeSlide - 1))} disabled={activeSlide === 0}
                    style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #333', background: 'transparent', color: activeSlide === 0 ? '#333' : '#fff', cursor: activeSlide === 0 ? 'not-allowed' : 'pointer', fontSize: 12, fontFamily: 'inherit' }}>← Ant</button>
                <span style={{ fontSize: 11, color: '#555', alignSelf: 'center' }}>{activeSlide + 1}/{slides.length}</span>
                <button onClick={() => onSlideChange(Math.min(slides.length - 1, activeSlide + 1))} disabled={activeSlide === slides.length - 1}
                    style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #333', background: 'transparent', color: activeSlide === slides.length - 1 ? '#333' : '#fff', cursor: activeSlide === slides.length - 1 ? 'not-allowed' : 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Sig →</button>
            </div>
        </div>
    );
}

/* ── Slide CSS Card (shown while image loads or as fallback) ── */
function SlideCard({ slide, index, total }: { slide: Slide; index: number; total: number }) {
    const isCover = index === 0;
    const isCTA = index === total - 1;
    return (
        <div style={{ width: '100%', height: '100%', background: isCover ? '#0B1220' : '#111827', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: isCover ? 'center' : 'flex-start', padding: isCover ? 16 : 14, position: 'relative', boxSizing: 'border-box' }}>
            {!isCover && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'linear-gradient(to bottom, #0066FF, #00C2FF)' }} />
            )}
            {!isCover && !isCTA && (
                <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 9, color: '#00D9FF', fontWeight: 700 }}>{index + 1}/{total}</div>
            )}
            {isCTA && (
                <div style={{ width: '80%', padding: '8px 12px', background: 'linear-gradient(135deg, rgba(0,102,255,0.2), rgba(0,194,255,0.15))', border: '1px solid rgba(0,194,255,0.4)', borderRadius: 8, marginBottom: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#00C2FF', fontWeight: 700 }}>stephano.io</div>
                </div>
            )}
            <div style={{ fontSize: isCover ? 13 : 11, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 6, textAlign: isCover ? 'center' : 'left' }}>
                {slide.headline?.split(' ').map((word, i) => (
                    word === slide.accentWord
                        ? <span key={i} style={{ color: '#00D9FF' }}>{word} </span>
                        : <span key={i}>{word} </span>
                ))}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, textAlign: isCover ? 'center' : 'left' }}>{slide.body}</div>
            {isCover && (
                <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: '70%', height: 1, background: 'linear-gradient(to right, #0066FF, #00C2FF)' }} />
            )}
            <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 7, color: 'rgba(0,194,255,0.3)', fontWeight: 700 }}>STEPHANO.IO</div>
        </div>
    );
}

/* ── Stat Card ── */
function StatCard({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
    return (
        <div style={{ background: '#0d0d14', border: `1px solid ${color}22`, borderRadius: 12, padding: '14px 18px', flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 11, color: '#fff', fontWeight: 600, marginTop: 2 }}>{label}</div>
            {sub && <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{sub}</div>}
        </div>
    );
}

/* ── Main Component ── */
export default function SocialStudioClient() {
    const [tab, setTab] = useState<'ideas' | 'create' | 'preview' | 'estrategia'>('ideas');
    const [industry, setIndustry] = useState('general');
    const [section, setSection] = useState('general');
    const [ideasLoading, setIdeasLoading] = useState(false);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
    const [customTopic, setCustomTopic] = useState('');
    const [slideCount, setSlideCount] = useState(5);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState<Generated | null>(null);
    const [images, setImages] = useState<(string | null)[]>([]);
    const [generatingImages, setGeneratingImages] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [igStatus, setIgStatus] = useState<IGStatus | null>(null);

    const downloadImage = async (url: string, filename: string) => {
        try {
            if (url.startsWith('data:') || url.startsWith('/')) {
                // data: URLs (Gemini base64) and local paths can be fetched directly
                const res = await fetch(url);
                const blob = await res.blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            } else {
                // External URLs (Pollinations, etc.) — open in new tab for manual save
                window.open(url, '_blank');
            }
        } catch {
            window.open(url, '_blank');
        }
    };

    useEffect(() => {
        fetch('/api/instagram/status')
            .then(r => r.json())
            .then(d => setIgStatus(d))
            .catch(() => {});
    }, []);

    const fetchIdeas = async () => {
        setIdeasLoading(true);
        setIdeas([]);
        try {
            const res = await fetch('/api/social-studio/ideas', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ industry, section }),
            });
            const data = await res.json();
            setIdeas(data.ideas || []);
        } finally {
            setIdeasLoading(false);
        }
    };

    const generateContent = useCallback(async (topic: string, ind: string, slides: number, sec?: string) => {
        setGenerating(true);
        setGenerated(null);
        setImages([]);
        setTab('create');
        try {
            const res = await fetch('/api/social-studio/generate', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ topic, industry: ind, slideCount: slides, section: sec || section }),
            });
            const data = await res.json();
            setGenerated(data);
            setImages(new Array(data.slides?.length || slides).fill(null));
        } finally {
            setGenerating(false);
        }
    }, []);

    const generateImages = useCallback(async () => {
        if (!generated) return;
        setGeneratingImages(true);
        const newImages: (string | null)[] = [...images];
        for (let i = 0; i < generated.slides.length; i++) {
            try {
                const res = await fetch('/api/social-studio/image', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ slide: generated.slides[i], index: i, total: generated.slides.length, section }),
                });
                const data = await res.json();
                newImages[i] = data.url;
                setImages([...newImages]);
            } catch { /* keep null */ }
        }
        setGeneratingImages(false);
        setTab('preview');
    }, [generated, images, section]);

    const allImagesGenerated = images.length > 0 && images.every(Boolean);
    const safeSlides = generated?.slides ?? [];

    // Stats for strategy tab
    const pillarCounts = { educativo: 0, entretenido: 0, emocional: 0 };
    const categoryCounts = { '70': 0, '20': 0, '10': 0 };
    ideas.forEach(idea => {
        if (idea.pillar && idea.pillar in pillarCounts) pillarCounts[idea.pillar]++;
        if (idea.category && idea.category in categoryCounts) categoryCounts[idea.category as '70' | '20' | '10']++;
    });

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, rgba(0,217,255,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(0,217,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D9FF" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff' }}>Social Studio</h1>
                        <div style={{ fontSize: 12, color: '#555' }}>Genera contenido viral para Instagram · Sin pagar ads</div>
                    </div>
                    {/* Instagram follower count badge */}
                    {igStatus?.connected && igStatus.account && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(214,45,136,0.08)', border: '1px solid rgba(214,45,136,0.2)', borderRadius: 10, padding: '6px 12px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d62d88" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{igStatus.account.followers.toLocaleString()}</div>
                                <div style={{ fontSize: 9, color: '#888' }}>seguidores</div>
                            </div>
                        </div>
                    )}
                    {igStatus && !igStatus.connected && (
                        <div style={{ fontSize: 11, color: '#333', background: '#111', border: '1px solid #222', borderRadius: 8, padding: '5px 10px' }}>
                            IG no conectado
                        </div>
                    )}
                </div>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginTop: 16, background: '#0d0d14', borderRadius: 12, padding: 4, width: 'fit-content' }}>
                    {([['ideas', '💡 Ideas'], ['create', '✍️ Crear'], ['preview', '📱 Preview'], ['estrategia', '📊 Estrategia']] as const).map(([t, label]) => (
                        <button key={t} onClick={() => setTab(t)}
                            style={{ padding: '7px 20px', borderRadius: 9, border: 'none', background: tab === t ? '#1a1a2e' : 'transparent', color: tab === t ? '#00D9FF' : '#555', fontSize: 13, fontWeight: tab === t ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── TAB: IDEAS ── */}
            {tab === 'ideas' && (
                <div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                        <select value={section} onChange={e => setSection(e.target.value)}
                            style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(0,102,255,0.3)', background: '#0d0d14', color: '#00C2FF', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600 }}>
                            {SITE_SECTIONS.map(s => <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>)}
                        </select>
                        <select value={industry} onChange={e => setIndustry(e.target.value)}
                            style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #2a2a3e', background: '#0d0d14', color: '#fff', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
                            {INDUSTRIES.map(ind => <option key={ind.value} value={ind.value}>{ind.emoji} {ind.label}</option>)}
                        </select>
                        <button onClick={fetchIdeas} disabled={ideasLoading}
                            style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: ideasLoading ? 'rgba(0,217,255,0.1)' : 'rgba(0,217,255,0.15)', color: ideasLoading ? 'rgba(0,217,255,0.4)' : '#00D9FF', fontSize: 13, fontWeight: 700, cursor: ideasLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {ideasLoading ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Generando...</> : '⚡ Generar ideas'}
                        </button>
                    </div>

                    {/* 70-20-10 legend */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        {[['70%', '#00c864', 'Ideas probadas de líderes de nicho'], ['20%', '#ffaa00', 'Variaciones de ganadores anteriores'], ['10%', '#a855f7', 'Ángulos experimentales nuevos']].map(([pct, color, desc]) => (
                            <div key={pct} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: `${color}10`, border: `1px solid ${color}30` }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                                <span style={{ fontSize: 11, fontWeight: 700, color }}>{pct}</span>
                                <span style={{ fontSize: 10, color: '#555' }}>{desc}</span>
                            </div>
                        ))}
                    </div>

                    {/* Quick templates */}
                    {ideas.length === 0 && !ideasLoading && (
                        <div>
                            <div style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Templates rápidos</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                                {getQuickTemplates(section, industry).map((tmpl, i) => {
                                    const sectionData = SITE_SECTIONS.find(s => s.value === tmpl.section);
                                    return (
                                        <div key={i} onClick={() => generateContent(tmpl.title, tmpl.industry, tmpl.slides, tmpl.section)}
                                            style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(0,102,255,0.4)')}
                                            onMouseOut={e => (e.currentTarget.style.borderColor = '#1e1e2e')}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{tmpl.title}</div>
                                            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: 10, color: '#00C2FF', padding: '2px 7px', borderRadius: 5, background: 'rgba(0,102,255,0.1)', fontWeight: 600 }}>{sectionData?.emoji} {sectionData?.label}</span>
                                                <span style={{ fontSize: 10, color: '#555' }}>📊 {tmpl.slides} slides</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Generated ideas */}
                    {ideas.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                            {ideas.map(idea => {
                                const catColor = idea.category === '70' ? '#00c864' : idea.category === '20' ? '#ffaa00' : '#a855f7';
                                const pillarColor = idea.pillar ? PILLAR_COLORS[idea.pillar] : '#888';
                                return (
                                    <div key={idea.id} onClick={() => generateContent(idea.title, idea.industry, idea.slides, section)}
                                        style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 14, padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,217,255,0.3)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                                        onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e2e'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: `${ANGLE_COLORS[idea.angle] || '#888'}18`, color: ANGLE_COLORS[idea.angle] || '#888', fontWeight: 600 }}>{idea.angle}</span>
                                                {idea.pillar && (
                                                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: `${pillarColor}15`, color: pillarColor, fontWeight: 600 }}>{idea.pillar}</span>
                                                )}
                                                {idea.category && (
                                                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: `${catColor}15`, color: catColor, fontWeight: 700 }}>{idea.category}%</span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: idea.viralScore >= 80 ? '#00c864' : idea.viralScore >= 60 ? '#ffaa00' : '#ff6b6b' }} />
                                                <span style={{ fontSize: 10, color: '#555' }}>{idea.viralScore}%</span>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.3 }}>{idea.title}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(0,217,255,0.7)', marginBottom: 8, fontStyle: 'italic' }}>"{idea.hook}"</div>
                                        <div style={{ fontSize: 10, color: '#444' }}>{idea.why}</div>
                                        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                            <span style={{ fontSize: 10, color: '#555', padding: '2px 8px', borderRadius: 6, background: '#111' }}>{idea.format}</span>
                                            <span style={{ fontSize: 10, color: '#555', padding: '2px 8px', borderRadius: 6, background: '#111' }}>{idea.slides} slides</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Custom topic */}
                    <div style={{ marginTop: 24, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 14, padding: 20 }}>
                        <div style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>O escribe tu propio tema:</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input value={customTopic} onChange={e => setCustomTopic(e.target.value)}
                                placeholder="Ej: Por qué los restaurantes necesitan menú QR..."
                                onKeyDown={e => { if (e.key === 'Enter' && customTopic.trim()) generateContent(customTopic, industry, slideCount, section); }}
                                style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #2a2a3e', background: '#0A0A0F', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
                            <select value={slideCount} onChange={e => setSlideCount(Number(e.target.value))}
                                style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #2a2a3e', background: '#0d0d14', color: '#fff', fontSize: 13, fontFamily: 'inherit' }}>
                                {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} slides</option>)}
                            </select>
                            <button onClick={() => customTopic.trim() && generateContent(customTopic, industry, slideCount, section)}
                                disabled={!customTopic.trim()}
                                style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: customTopic.trim() ? 'rgba(0,217,255,0.15)' : 'rgba(255,255,255,0.03)', color: customTopic.trim() ? '#00D9FF' : '#333', fontSize: 13, fontWeight: 700, cursor: customTopic.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                                Generar →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TAB: CREATE ── */}
            {tab === 'create' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Left: Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {generating ? (
                            <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 14, padding: 40, textAlign: 'center' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00D9FF" strokeWidth="1.5" style={{ animation: 'spin 1.5s linear infinite', marginBottom: 12 }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                <div style={{ fontSize: 14, color: '#fff' }}>Generando contenido con Claude...</div>
                                <div style={{ fontSize: 11, color: '#555', marginTop: 6 }}>Creando slides, caption y hashtags</div>
                            </div>
                        ) : generated && generated.slides?.length > 0 ? (
                            <>
                                <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 14, padding: 18 }}>
                                    <div style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Carousel · {generated.slides.length} slides</div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{generated.carouselTitle}</div>
                                </div>

                                {/* Slides */}
                                {generated.slides.map((slide, i) => (
                                    <div key={i} onClick={() => setActiveSlide(i)}
                                        style={{ background: activeSlide === i ? 'rgba(0,217,255,0.04)' : '#0d0d14', border: `1px solid ${activeSlide === i ? 'rgba(0,217,255,0.3)' : '#1e1e2e'}`, borderRadius: 12, padding: 14, cursor: 'pointer', transition: 'all 0.15s' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ fontSize: 10, color: '#00D9FF', fontWeight: 700 }}>Slide {i + 1} · {slide.type}</span>
                                            {images[i] && <span style={{ fontSize: 10, color: '#00c864' }}>✓ imagen lista</span>}
                                            {!images[i] && generatingImages && <span style={{ fontSize: 10, color: '#ffaa00' }}>generando...</span>}
                                        </div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{slide.headline}</div>
                                        <div style={{ fontSize: 11, color: '#666' }}>{slide.body}</div>
                                    </div>
                                ))}

                                {/* Caption */}
                                <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Caption</span>
                                        <CopyBtn text={`${generated.caption}\n\n${generated.hashtags}`} />
                                    </div>
                                    <div style={{ fontSize: 12, color: '#ccc', lineHeight: 1.6 }}>{generated.caption}</div>
                                    <div style={{ fontSize: 11, color: '#00D9FF', marginTop: 8, lineHeight: 1.8, opacity: 0.7 }}>{generated.hashtags}</div>
                                </div>

                                {/* Reel hook */}
                                <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 12, padding: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎬 Hook para Reel</span>
                                        <CopyBtn text={generated.reelHook} />
                                    </div>
                                    <div style={{ fontSize: 12, color: '#a855f7', lineHeight: 1.6, fontStyle: 'italic' }}>"{generated.reelHook}"</div>
                                </div>

                                {/* Generate images button */}
                                <button onClick={generateImages} disabled={generatingImages || allImagesGenerated}
                                    style={{ width: '100%', padding: '14px', borderRadius: 12, border: `1px solid ${allImagesGenerated ? 'rgba(0,200,100,0.2)' : 'rgba(0,217,255,0.2)'}`, background: allImagesGenerated ? 'rgba(0,200,100,0.1)' : generatingImages ? 'rgba(0,217,255,0.06)' : 'linear-gradient(135deg, rgba(0,217,255,0.15), rgba(168,85,247,0.1))', color: allImagesGenerated ? '#00c864' : generatingImages ? 'rgba(0,217,255,0.5)' : '#00D9FF', fontSize: 14, fontWeight: 700, cursor: allImagesGenerated || generatingImages ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                    {allImagesGenerated ? (
                                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> {generated.slides.length} imágenes listas</>
                                    ) : generatingImages ? (
                                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg> Generando imágenes ({images.filter(Boolean).length}/{images.length})...</>
                                    ) : (
                                        <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> Generar {generated.slides.length} imágenes con IA</>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 14, padding: 60, textAlign: 'center', color: '#333' }}>
                                <div style={{ fontSize: 36, marginBottom: 12 }}>✨</div>
                                <div>Selecciona una idea en la pestaña Ideas para comenzar</div>
                            </div>
                        )}
                    </div>

                    {/* Right: Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                        {generated?.slides?.length ? (
                            <>
                                <PhonePreview
                                    slides={generated.slides}
                                    images={images}
                                    caption={generated.caption}
                                    hashtags={generated.hashtags}
                                    activeSlide={activeSlide}
                                    onSlideChange={setActiveSlide}
                                />
                                {allImagesGenerated && (
                                    <button onClick={() => setTab('preview')}
                                        style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #00D9FF, #a855f7)', color: '#000', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Ver preview completo →
                                    </button>
                                )}
                            </>
                        ) : (
                            <div style={{ width: 280, height: 500, background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 12 }}>
                                Preview aquí
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── TAB: PREVIEW & EXPORT ── */}
            {tab === 'preview' && generated && generated.slides?.length > 0 && (
                <div>
                    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                        {/* Phone preview */}
                        <div style={{ flexShrink: 0 }}>
                            <PhonePreview
                                slides={generated.slides}
                                images={images}
                                caption={generated.caption}
                                hashtags={generated.hashtags}
                                activeSlide={activeSlide}
                                onSlideChange={setActiveSlide}
                            />
                        </div>

                        {/* Export panel */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 14, padding: 20 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>📥 Descargar imágenes</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {generated.slides.map((slide, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#111' }}>
                                                {images[i] ? (
                                                    <img src={images[i]!} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#333' }}>{i + 1}</div>
                                                )}
                                            </div>
                                            <div style={{ flex: 1, fontSize: 12, color: '#aaa' }}>{slide.headline}</div>
                                            {images[i] ? (
                                                <button onClick={() => downloadImage(images[i]!, `slide-${i + 1}.jpg`)}
                                                    style={{ padding: '5px 14px', borderRadius: 8, background: 'rgba(0,200,100,0.08)', border: '1px solid rgba(0,200,100,0.2)', color: '#00c864', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                                                    ↓ Descargar
                                                </button>
                                            ) : (
                                                <span style={{ fontSize: 11, color: '#333' }}>Pendiente</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Caption copy */}
                            <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 14, padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>📝 Caption + Hashtags</div>
                                    <CopyBtn text={`${generated.caption}\n\n${generated.hashtags}`} />
                                </div>
                                <div style={{ fontSize: 12, color: '#bbb', lineHeight: 1.7, background: '#111', borderRadius: 10, padding: 12 }}>
                                    {generated.caption}
                                    <br /><br />
                                    <span style={{ color: '#00D9FF', opacity: 0.7 }}>{generated.hashtags}</span>
                                </div>
                            </div>

                            {/* Publish to Instagram */}
                            <div style={{ background: 'linear-gradient(135deg, rgba(214,45,136,0.08), rgba(168,85,247,0.08))', border: '1px solid rgba(214,45,136,0.2)', borderRadius: 14, padding: 20 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 8 }}>📱 Publicar en Instagram</div>
                                <div style={{ fontSize: 11, color: '#888', marginBottom: 14, lineHeight: 1.6 }}>
                                    1. Descarga las imágenes de arriba<br />
                                    2. Copia el caption<br />
                                    3. Abre Instagram y crea la publicación
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button onClick={() => { navigator.clipboard.writeText(`${generated.caption}\n\n${generated.hashtags}`); window.open('https://www.instagram.com/', '_blank'); }}
                                        style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #d62d88, #a855f7)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                                        Copiar caption y abrir Instagram
                                    </button>
                                </div>
                                <div style={{ fontSize: 10, color: '#555', marginTop: 8, textAlign: 'center' }}>El caption se copia automáticamente al portapapeles</div>
                            </div>

                            {/* Regenerate */}
                            <button onClick={() => { setGenerated(null); setImages([]); setTab('ideas'); }}
                                style={{ padding: '10px', borderRadius: 10, border: '1px solid #1e1e2e', background: 'transparent', color: '#555', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                                ← Crear nuevo contenido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'preview' && (!generated || !generated.slides?.length) && (
                <div style={{ textAlign: 'center', padding: 80, color: '#333' }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>📱</div>
                    <div>Primero genera contenido en la pestaña Ideas</div>
                </div>
            )}

            {/* ── TAB: ESTRATEGIA ── */}
            {tab === 'estrategia' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Stats row */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <StatCard label="Ideas generadas" value={ideas.length} color="#00D9FF" sub="en esta sesión" />
                        <StatCard label="Meta: seguidores" value="1,000,000" color="#a855f7" sub="@stephano.io orgánico" />
                        <StatCard label="Frecuencia ideal" value="1/día" color="#00c864" sub="1 carousel + stories" />
                        <StatCard label="Pilares activos" value="3" color="#ffaa00" sub="Edu · Entre · Emo" />
                    </div>

                    {/* 70-20-10 + Pilares */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                        {/* 70-20-10 Rule */}
                        <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Regla 70-20-10 (Caleb Ralston)</div>
                            <div style={{ fontSize: 11, color: '#555', marginBottom: 20 }}>Distribución de contenido para máximo alcance orgánico</div>
                            {[
                                { pct: '70%', label: 'Ideas Probadas', desc: 'Temas de líderes de nicho con +10K likes. Toma el tema, cambia la ejecución.', color: '#00c864', bar: 70 },
                                { pct: '20%', label: 'Ganadores Repetidos', desc: 'Tu propio contenido con mejor engagement. Nuevo hook, mismo tema.', color: '#ffaa00', bar: 20 },
                                { pct: '10%', label: 'Experimental', desc: 'Nuevos ángulos de Stephano.io, formatos nuevos, verticales nuevas.', color: '#a855f7', bar: 10 },
                            ].map(({ pct, label, desc, color, bar }) => (
                                <div key={pct} style={{ marginBottom: 18 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <div>
                                            <span style={{ fontSize: 16, fontWeight: 800, color }}>{pct}</span>
                                            <span style={{ fontSize: 13, color: '#fff', marginLeft: 8, fontWeight: 600 }}>{label}</span>
                                        </div>
                                    </div>
                                    <div style={{ height: 6, background: '#1a1a2e', borderRadius: 3, marginBottom: 6 }}>
                                        <div style={{ height: '100%', width: `${bar}%`, background: color, borderRadius: 3, transition: 'width 0.5s' }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: '#555' }}>{desc}</div>
                                </div>
                            ))}
                        </div>

                        {/* 3 Pillars */}
                        <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>3 Pilares de Contenido</div>
                            <div style={{ fontSize: 11, color: '#555', marginBottom: 20 }}>Balance mensual recomendado para @stephano.io</div>
                            {[
                                { pillar: 'Educativo', pct: '40%', desc: 'Enseña algo útil: 5 razones, cómo funciona, comparaciones técnicas', color: '#00D9FF', bar: 40, example: '"Por qué tu competencia te gana clientes online"' },
                                { pillar: 'Entretenido', pct: '30%', desc: 'Humor, comparaciones, before/after, relatable content', color: '#ffaa00', bar: 30, example: '"WhatsApp caótico vs sistema de agenda automática"' },
                                { pillar: 'Emocional', pct: '30%', desc: 'Historias de éxito, aspiraciones, conexión con el emprendedor', color: '#a855f7', bar: 30, example: '"El día que un restaurante triplicó sus reservas"' },
                            ].map(({ pillar, pct, desc, color, bar, example }) => (
                                <div key={pillar} style={{ marginBottom: 18 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <div>
                                            <span style={{ fontSize: 16, fontWeight: 800, color }}>{pct}</span>
                                            <span style={{ fontSize: 13, color: '#fff', marginLeft: 8, fontWeight: 600 }}>{pillar}</span>
                                        </div>
                                    </div>
                                    <div style={{ height: 6, background: '#1a1a2e', borderRadius: 3, marginBottom: 6 }}>
                                        <div style={{ height: '100%', width: `${bar}%`, background: color, borderRadius: 3 }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{desc}</div>
                                    <div style={{ fontSize: 10, color: color, opacity: 0.7, fontStyle: 'italic' }}>{example}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Workflow */}
                    <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Flujo de Trabajo Semanal</div>
                        <div style={{ fontSize: 11, color: '#555', marginBottom: 20 }}>Batch creation para mantener 1 post diario sin agotarte</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                            {WEEKLY_WORKFLOW.map(({ day, task, icon, color }) => (
                                <div key={day} style={{ background: '#111', border: `1px solid ${color}22`, borderRadius: 12, padding: 12, textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 4 }}>{day}</div>
                                    <div style={{ fontSize: 9, color: '#555', lineHeight: 1.4 }}>{task}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hashtag Strategy */}
                    <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Estrategia de Hashtags</div>
                        <div style={{ fontSize: 11, color: '#555', marginBottom: 16 }}>Mezcla de tamaños para máximo alcance orgánico (20 hashtags por post)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                            {[
                                { size: '5 Masivos', range: '+1M posts', tags: ['#negocios', '#emprendimiento', '#tecnologia', '#costarica', '#paginaweb'], color: '#ff6b6b' },
                                { size: '5 Medianos', range: '100K-500K', tags: ['#desarrolloweb', '#tiendaonline', '#marketingdigital', '#negocioscr', '#softwareempresarial'], color: '#ffaa00' },
                                { size: '5 Nicho', range: '10K-50K', tags: ['#stephanoio', '#websitecr', '#transformaciondigital', '#solucionesdigitales', '#agenciacr'], color: '#00D9FF' },
                                { size: '5 Local', range: 'Costa Rica', tags: ['#costarica', '#sanjose', '#tico', '#centroamerica', '#negociosticos'], color: '#00c864' },
                            ].map(({ size, range, tags, color }) => (
                                <div key={size} style={{ background: '#0a0a0f', border: `1px solid ${color}22`, borderRadius: 10, padding: 14 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 2 }}>{size}</div>
                                    <div style={{ fontSize: 9, color: '#444', marginBottom: 10 }}>{range}</div>
                                    {tags.map(tag => (
                                        <div key={tag} style={{ fontSize: 10, color: '#555', marginBottom: 3 }}>{tag}</div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reference Aesthetic */}
                    <div style={{ background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Referencias Estéticas (Narrar con imágenes)</div>
                        <div style={{ fontSize: 11, color: '#555', marginBottom: 16 }}>Cuentas y marcas que definen el estilo visual de Stephano.io</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {['Apple Product Launch', 'Linear.app', 'Vercel / Next.js', 'Stripe', 'Tesla Reveals', 'Y Combinator Decks', 'Figma', 'Notion'].map(ref => (
                                <span key={ref} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(0,217,255,0.06)', border: '1px solid rgba(0,217,255,0.15)', fontSize: 12, color: 'rgba(0,217,255,0.7)', fontWeight: 500 }}>{ref}</span>
                            ))}
                        </div>
                        <div style={{ marginTop: 16, padding: 12, background: '#0a0a0f', borderRadius: 10, border: '1px solid #1a1a2e' }}>
                            <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>Brand DNA para imagen:</div>
                            <code style={{ fontSize: 11, color: '#00D9FF', lineHeight: 1.8 }}>
                                Fondo negro profundo #0A0A0F · Acento cyan eléctrico #00D9FF · Acento purple #a855f7<br />
                                Minimalismo Silicon Valley · Sin personas · Sin gradientes excepto glows sutiles<br />
                                Líneas de grid · Partículas · Formas geométricas · Tipografía Geist Bold
                            </code>
                        </div>
                    </div>

                    {/* Quick start */}
                    <div style={{ background: 'linear-gradient(135deg, rgba(0,217,255,0.08), rgba(168,85,247,0.06))', border: '1px solid rgba(0,217,255,0.15)', borderRadius: 16, padding: 24 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>🚀 Empezar ahora</div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <button onClick={() => setTab('ideas')}
                                style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: 'rgba(0,217,255,0.15)', color: '#00D9FF', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                💡 Generar ideas de hoy
                            </button>
                            <button onClick={() => { setTab('ideas'); setTimeout(fetchIdeas, 100); }}
                                style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(0,217,255,0.2)', background: 'transparent', color: '#aaa', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                                ⚡ Auto-generar con IA
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
