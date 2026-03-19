'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { HuntResult } from '@/app/api/leads/hunt/route';

/* ── Costa Rica Geographic Data ── */
const CR_GEO: Record<string, { lat: number; lng: number; cantons: string[] }> = {
    'San José': {
        lat: 9.9281, lng: -84.0907,
        cantons: ['Todos', 'San José', 'Escazú', 'Desamparados', 'Curridabat', 'Goicoechea', 'Tibás', 'Moravia', 'Montes de Oca', 'Santa Ana', 'Alajuelita', 'Coronado', 'Acosta', 'Dota', 'Pérez Zeledón'],
    },
    'Alajuela': {
        lat: 10.0162, lng: -84.2143,
        cantons: ['Todos', 'Alajuela', 'San Ramón', 'Grecia', 'Atenas', 'Naranjo', 'Palmares', 'San Carlos', 'Upala', 'Los Chiles', 'Zarcero', 'Orotina'],
    },
    'Cartago': {
        lat: 9.8647, lng: -83.9193,
        cantons: ['Todos', 'Cartago', 'Paraíso', 'La Unión', 'Turrialba', 'El Guarco', 'Oreamuno', 'Alvarado', 'Jiménez'],
    },
    'Heredia': {
        lat: 9.9988, lng: -84.1173,
        cantons: ['Todos', 'Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael', 'Belén', 'Flores', 'San Pablo', 'Sarapiquí'],
    },
    'Guanacaste': {
        lat: 10.6267, lng: -85.4401,
        cantons: ['Todos', 'Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 'Cañas', 'La Cruz', 'Tilarán', 'Hojancha', 'Nandayure'],
    },
    'Puntarenas': {
        lat: 9.9760, lng: -84.8317,
        cantons: ['Todos', 'Puntarenas', 'Esparza', 'Buenos Aires', 'Osa', 'Quepos', 'Golfito', 'Parrita', 'Corredores', 'Garabito', 'Monteverde'],
    },
    'Limón': {
        lat: 9.9899, lng: -83.0361,
        cantons: ['Todos', 'Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 'Guácimo'],
    },
};

const CANTON_COORDS: Record<string, { lat: number; lng: number }> = {
    'San José': { lat: 9.9281, lng: -84.0907 }, 'Escazú': { lat: 9.9177, lng: -84.1367 },
    'Desamparados': { lat: 9.8997, lng: -84.0667 }, 'Curridabat': { lat: 9.9167, lng: -84.0333 },
    'Goicoechea': { lat: 9.9500, lng: -84.0167 }, 'Tibás': { lat: 9.9667, lng: -84.0833 },
    'Moravia': { lat: 9.9667, lng: -84.0167 }, 'Santa Ana': { lat: 9.9333, lng: -84.1833 },
    'Alajuela': { lat: 10.0162, lng: -84.2143 }, 'San Ramón': { lat: 10.0903, lng: -84.4700 },
    'Grecia': { lat: 10.0681, lng: -84.3181 }, 'Cartago': { lat: 9.8647, lng: -83.9193 },
    'La Unión': { lat: 9.9000, lng: -83.9833 }, 'Heredia': { lat: 9.9988, lng: -84.1173 },
    'Barva': { lat: 10.0167, lng: -84.1333 }, 'Liberia': { lat: 10.6333, lng: -85.4333 },
    'Nicoya': { lat: 10.1500, lng: -85.4500 }, 'Santa Cruz': { lat: 10.2667, lng: -85.5833 },
    'Puntarenas': { lat: 9.9760, lng: -84.8317 }, 'Limón': { lat: 9.9899, lng: -83.0361 },
    'Pococí': { lat: 10.4167, lng: -83.7500 }, 'Quepos': { lat: 9.4333, lng: -84.1667 },
};

const INDUSTRY_PRESETS = [
    { label: 'Restaurantes', icon: '🍽️', query: 'restaurantes' },
    { label: 'Pizzerías', icon: '🍕', query: 'pizzerías pizza' },
    { label: 'Rest. Italiano', icon: '🇮🇹', query: 'restaurante italiano pasta' },
    { label: 'Catering', icon: '🎂', query: 'servicio de catering eventos banquetes' },
    { label: 'Hoteles', icon: '🏨', query: 'hoteles hostales alojamiento' },
    { label: 'Salones Belleza', icon: '💅', query: 'salones de belleza peluquerías' },
    { label: 'Barberías', icon: '✂️', query: 'barberías barbero' },
    { label: 'Clínicas Dentales', icon: '🦷', query: 'clínicas dentales odontólogos dentistas' },
    { label: 'Médicos', icon: '🩺', query: 'consultorios médicos clínicas médicas' },
    { label: 'Veterinarias', icon: '🐾', query: 'clínicas veterinarias veterinario mascotas' },
    { label: 'Hosp. Veterinario', icon: '🏥', query: 'hospital veterinario animales' },
    { label: 'Tienda Mascotas', icon: '🐕', query: 'tienda productos mascotas animales' },
    { label: 'Paseador Perros', icon: '🦮', query: 'paseador de perros servicio mascotas' },
    { label: 'Talleres Autos', icon: '🚗', query: 'talleres mecánicos automóviles reparación' },
    { label: 'Talleres Motos', icon: '🏍️', query: 'talleres mecánicos motocicletas reparación' },
    { label: 'Baterías', icon: '🔋', query: 'tienda baterías vehículos' },
    { label: 'Perfumerías', icon: '🌸', query: 'perfumerías cosméticos tienda belleza' },
    { label: 'Gimnasios', icon: '💪', query: 'gimnasios fitness centros deportivos' },
    { label: 'Cancha Fútbol 5', icon: '⚽', query: 'canchas fútbol 5 sintético alquiler' },
    { label: 'Cancha Tenis', icon: '🎾', query: 'canchas tenis club deportivo' },
    { label: 'Cibercafés', icon: '💻', query: 'cibercafé internet café computadoras' },
    { label: 'Ferreterías', icon: '🔧', query: 'ferreterías materiales construcción' },
    { label: 'Abogados', icon: '⚖️', query: 'despachos de abogados bufetes jurídicos' },
    { label: 'Contadores', icon: '📊', query: 'contadores públicos auditorías contabilidad' },
    { label: 'Oficinas Empresa', icon: '🏢', query: 'oficinas empresas servicios empresariales' },
    { label: 'Farmacias', icon: '💊', query: 'farmacias boticas' },
    { label: 'Pulperías', icon: '🛒', query: 'pulperías minisupers tiendas' },
];

function getScore(r: HuntResult): { label: string; color: string; reason: string } {
    const ratings = r.user_ratings_total || 0;
    if (!r.hasWebsite && ratings > 50 && (r.rating || 0) >= 4.0)
        return { label: 'HOT', color: '#FF4444', reason: 'Sin web + alta reputación' };
    if (!r.hasWebsite && ratings > 20)
        return { label: 'WARM', color: '#FF8C00', reason: 'Sin web + activo en Maps' };
    return { label: 'COLD', color: '#0066FF', reason: 'Sin web detectada' };
}

const RADIUS_OPTIONS = [
    { label: '5 km', value: 5000 },
    { label: '10 km', value: 10000 },
    { label: '20 km', value: 20000 },
    { label: '40 km', value: 40000 },
    { label: '60 km', value: 60000 },
    { label: '100 km', value: 100000 },
];

export default function ProspectosPage() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [province, setProvince] = useState('');
    const [canton, setCanton] = useState('Todos');
    const [radius, setRadius] = useState(40000);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<HuntResult[]>([]);
    const [stats, setStats] = useState<{ total: number; noWebsite: number } | null>(null);
    const [error, setError] = useState('');
    const [added, setAdded] = useState<Set<string>>(new Set());
    const [proposing, setProposing] = useState<string | null>(null);
    const [calling, setCalling] = useState<string | null>(null);
    const [callResult, setCallResult] = useState<Record<string, 'calling' | 'done' | 'error'>>({});
    const [pitching, setPitching] = useState<string | null>(null);
    const [pitchData, setPitchData] = useState<Record<string, { pitch: string; industry: string; competitor: string; painPoints: string[] }>>({});
    const [enriching, setEnriching] = useState<string | null>(null);
    const [enrichData, setEnrichData] = useState<Record<string, { openingHours: string[]; googleMapsUrl: string; photos: number; instagramSearch: string; facebookSearch: string; instagramGuess: string; signals: string[] }>>({});
    const [expandedPitch, setExpandedPitch] = useState<Set<string>>(new Set());
    const abortRef = useRef<AbortController | null>(null);

    const cantons = province ? CR_GEO[province]?.cantons || ['Todos'] : ['Todos'];

    function getCoords(): { lat?: number; lng?: number; location: string } {
        if (!province) return { location: 'Costa Rica' };
        const cantonKey = canton !== 'Todos' ? canton : null;
        const coords = cantonKey && CANTON_COORDS[cantonKey]
            ? CANTON_COORDS[cantonKey]
            : CR_GEO[province];
        return { lat: coords.lat, lng: coords.lng, location: canton !== 'Todos' ? `${canton}, ${province}` : province };
    }

    async function handleHunt(customQuery?: string) {
        const q = customQuery ?? query;
        if (!q.trim()) return;
        setLoading(true);
        setError('');
        setResults([]);
        setStats(null);
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        const { lat, lng, location } = getCoords();

        try {
            const res = await fetch('/api/leads/hunt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'stephano-secret-2026' },
                body: JSON.stringify({ query: q, location, lat, lng, radius, noWebsiteOnly: true }),
                signal: abortRef.current.signal,
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Error al buscar'); return; }
            setResults(data.results || []);
            setStats({ total: data.total, noWebsite: data.noWebsite });
        } catch (err: unknown) {
            if ((err as Error).name !== 'AbortError') setError('Error de conexión. Verifica tu API key de Google Maps.');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddToCRM(prospect: HuntResult) {
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'stephano-secret-2026' },
                body: JSON.stringify({
                    nombre: prospect.name, email: `pendiente@${prospect.name.toLowerCase().replace(/\s+/g, '')}.com`,
                    telefono: prospect.phone || '', tipo_proyecto: 'Landing Page',
                    mensaje: `Prospecto Google Maps. Dirección: ${prospect.address}. Rating: ${prospect.rating || 'N/A'} (${prospect.user_ratings_total || 0} reseñas). Sin sitio web.`,
                    estado: 'nuevo',
                }),
            });
            if (res.ok) setAdded(prev => new Set(prev).add(prospect.place_id));
        } catch { /* silent */ }
    }

    async function handleLlamar(prospect: HuntResult) {
        if (!prospect.phone) return alert('Este prospecto no tiene número de teléfono registrado en Google Maps.');
        setCalling(prospect.place_id);
        setCallResult(prev => ({ ...prev, [prospect.place_id]: 'calling' }));
        try {
            const res = await fetch('/api/calls/outbound', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'stephano-secret-2026' },
                body: JSON.stringify({
                    phone: prospect.phone,
                    prospectName: prospect.name,
                    businessName: prospect.name,
                    address: prospect.address,
                    rating: prospect.rating,
                    reviews: prospect.user_ratings_total,
                    proposalUrl: '',
                }),
            });
            const data = await res.json();
            if (data.success) {
                setCallResult(prev => ({ ...prev, [prospect.place_id]: 'done' }));
            } else {
                setCallResult(prev => ({ ...prev, [prospect.place_id]: 'error' }));
                alert(`Error: ${data.error}`);
            }
        } catch {
            setCallResult(prev => ({ ...prev, [prospect.place_id]: 'error' }));
        } finally {
            setCalling(null);
        }
    }

    async function handleGetPitch(prospect: HuntResult) {
        if (pitchData[prospect.place_id]) {
            setExpandedPitch(prev => {
                const next = new Set(prev);
                next.has(prospect.place_id) ? next.delete(prospect.place_id) : next.add(prospect.place_id);
                return next;
            });
            return;
        }
        setPitching(prospect.place_id);
        try {
            const res = await fetch('/api/leads/pitch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'stephano-secret-2026' },
                body: JSON.stringify({
                    businessName: prospect.name,
                    address: prospect.address,
                    rating: prospect.rating,
                    reviews: prospect.user_ratings_total,
                    types: prospect.types || [],
                }),
            });
            const data = await res.json();
            if (data.success) {
                setPitchData(prev => ({ ...prev, [prospect.place_id]: data }));
                setExpandedPitch(prev => new Set(prev).add(prospect.place_id));
            }
        } catch { /* silent */ } finally {
            setPitching(null);
        }
    }

    async function handleEnrich(prospect: HuntResult) {
        if (enrichData[prospect.place_id]) return;
        setEnriching(prospect.place_id);
        try {
            const res = await fetch('/api/leads/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'stephano-secret-2026' },
                body: JSON.stringify({
                    businessName: prospect.name,
                    address: prospect.address,
                    placeId: prospect.place_id,
                }),
            });
            const data = await res.json();
            if (data.success) setEnrichData(prev => ({ ...prev, [prospect.place_id]: data }));
        } catch { /* silent */ } finally {
            setEnriching(null);
        }
    }

    async function handleGenerarPropuesta(prospect: HuntResult) {
        setProposing(prospect.place_id);
        // Add to CRM simultaneously (fire and forget)
        if (!added.has(prospect.place_id)) {
            fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'stephano-secret-2026' },
                body: JSON.stringify({
                    nombre: prospect.name,
                    email: `pendiente@${prospect.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
                    telefono: prospect.phone || '',
                    tipo_proyecto: 'Landing Page',
                    mensaje: `Prospecto Google Maps. Dirección: ${prospect.address}. Rating: ${prospect.rating || 'N/A'} (${prospect.user_ratings_total || 0} reseñas). Sin sitio web.`,
                    estado: 'nuevo',
                }),
            }).then(r => { if (r.ok) setAdded(prev => new Set(prev).add(prospect.place_id)); }).catch(() => {});
        }
        // Navigate to proposals page with pre-filled data
        const params = new URLSearchParams({
            clientName: prospect.name,
            clientCompany: prospect.name,
            clientPhone: prospect.phone || '',
            address: prospect.address,
            rating: String(prospect.rating || ''),
            reviews: String(prospect.user_ratings_total || 0),
        });
        router.push(`/admin/propuestas?${params.toString()}`);
    }

    const selectStyle = { background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: 10, padding: '0.65rem 1rem', color: '#fff', fontSize: '0.875rem', outline: 'none', cursor: 'pointer' };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary, #0A0A0F)', padding: '2rem', fontFamily: 'system-ui' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #0066FF, #00E5FF)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>Lead Hunter</h1>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#555' }}>Busca negocios sin sitio web por provincia y cantón en Costa Rica</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Encontrados', value: stats.total, color: '#0066FF' },
                        { label: 'Sin Sitio Web', value: stats.noWebsite, color: '#FF4444' },
                        { label: 'Agregados al CRM', value: added.size, color: '#00E5FF' },
                        { label: 'Valor Potencial', value: `$${(stats.noWebsite * 350).toLocaleString()}`, color: '#9D4EDD' },
                    ].map(s => (
                        <div key={s.label} style={{ flex: '1 1 140px', background: '#111118', border: '1px solid #1E1E2E', borderRadius: 12, padding: '0.875rem 1.1rem' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '0.7rem', color: '#555', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Search panel */}
            <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: 16, padding: '1.25rem', marginBottom: '1.5rem' }}>
                {/* Location row */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    <select value={province} onChange={e => { setProvince(e.target.value); setCanton('Todos'); }} style={{ ...selectStyle, flex: '1 1 160px' }}>
                        <option value="">🇨🇷 Toda Costa Rica</option>
                        {Object.keys(CR_GEO).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select value={canton} onChange={e => setCanton(e.target.value)} disabled={!province} style={{ ...selectStyle, flex: '1 1 160px', opacity: province ? 1 : 0.4 }}>
                        {cantons.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Query + Radius row */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleHunt()}
                        placeholder="Ej: restaurantes, clínicas dentales, barberías..."
                        style={{ flex: '1 1 240px', background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: 10, padding: '0.65rem 1rem', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
                    />
                    <select value={radius} onChange={e => setRadius(Number(e.target.value))}
                        style={{ ...selectStyle, flex: '0 0 110px' }}>
                        {RADIUS_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    <button
                        onClick={() => handleHunt()}
                        disabled={loading || !query.trim()}
                        style={{ background: loading ? '#1E1E2E' : 'linear-gradient(135deg, #0066FF, #00E5FF)', border: 'none', borderRadius: 10, padding: '0.65rem 1.4rem', color: '#fff', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
                    >
                        {loading ? 'Buscando...' : 'Cazar Prospectos'}
                    </button>
                </div>

                {/* Location tag */}
                {province && (
                    <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: '#00E5FF', background: '#00E5FF11', border: '1px solid #00E5FF33', borderRadius: 6, padding: '3px 10px' }}>
                            📍 {canton !== 'Todos' ? `${canton}, ${province}` : province}
                        </span>
                        <button onClick={() => { setProvince(''); setCanton('Todos'); }} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 12 }}>× limpiar</button>
                    </div>
                )}

                {/* Presets */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {INDUSTRY_PRESETS.map(p => (
                        <button key={p.label} onClick={() => { setQuery(p.query); handleHunt(p.query); }}
                            style={{ background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: 8, padding: '0.35rem 0.75rem', color: '#aaa', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            {p.icon} {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', color: '#FF6B6B', fontSize: '0.875rem' }}>
                    {error}
                    {error.includes('API key') && <span style={{ display: 'block', marginTop: 8, fontSize: '0.75rem', color: '#666' }}>Agrega GOOGLE_MAPS_API_KEY en Vercel → Settings → Environment Variables, luego redespliega.</span>}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: 14, padding: '1.25rem', opacity: 0.5 }}>
                            <div style={{ height: 18, background: '#1E1E2E', borderRadius: 6, marginBottom: 10, width: '70%' }} />
                            <div style={{ height: 12, background: '#1E1E2E', borderRadius: 6, marginBottom: 8, width: '90%' }} />
                            <div style={{ height: 12, background: '#1E1E2E', borderRadius: 6, width: '50%' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <>
                    <div style={{ marginBottom: '0.75rem', color: '#555', fontSize: '0.8rem' }}>
                        {results.length} negocios sin sitio web en {province ? (canton !== 'Todos' ? `${canton}, ${province}` : province) : 'Costa Rica'} — ordenados por oportunidad
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {[...results].sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0)).map(r => {
                            const score = getScore(r);
                            const isAdded = added.has(r.place_id);
                            return (
                                <div key={r.place_id} style={{ background: '#111118', border: `1px solid ${score.color}22`, borderRadius: 14, padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{r.name}</h3>
                                        <span style={{ background: `${score.color}22`, color: score.color, border: `1px solid ${score.color}44`, borderRadius: 6, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>{score.label}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#555', lineHeight: 1.4 }}>{r.address}</p>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {r.rating && <span style={{ fontSize: '0.75rem', color: '#FFB800' }}>★ {r.rating} <span style={{ color: '#444' }}>({r.user_ratings_total})</span></span>}
                                        {r.phone && <a href={`tel:${r.phone}`} style={{ fontSize: '0.75rem', color: '#0066FF', textDecoration: 'none' }}>{r.phone}</a>}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#444' }}>{score.reason}</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto' }}>
                                        {/* Primary CTAs row */}
                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button
                                                onClick={() => handleGenerarPropuesta(r)}
                                                disabled={proposing === r.place_id}
                                                style={{ flex: 1, background: proposing === r.place_id ? '#1E1E2E' : 'linear-gradient(135deg, #0066FF, #00E5FF)', border: 'none', borderRadius: 8, padding: '0.55rem', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: proposing === r.place_id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                {proposing === r.place_id ? 'Abriendo...' : 'Propuesta'}
                                            </button>
                                            <button
                                                onClick={() => handleLlamar(r)}
                                                disabled={calling === r.place_id || !r.phone}
                                                title={!r.phone ? 'Sin número de teléfono' : 'Llamar con IA'}
                                                style={{
                                                    flex: 1,
                                                    background: callResult[r.place_id] === 'done' ? '#1a2a1a'
                                                        : callResult[r.place_id] === 'error' ? '#2a1a1a'
                                                        : calling === r.place_id ? '#1E1E2E'
                                                        : r.phone ? 'linear-gradient(135deg, #00C853, #00897B)' : '#1E1E2E',
                                                    border: 'none', borderRadius: 8, padding: '0.55rem',
                                                    color: !r.phone ? '#444' : '#fff',
                                                    fontSize: '0.75rem', fontWeight: 700,
                                                    cursor: calling === r.place_id || !r.phone ? 'not-allowed' : 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
                                                }}
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.7 19.79 19.79 0 0 1 1.61 3.11 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.02-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                                {callResult[r.place_id] === 'done' ? '✓ Llamado'
                                                    : callResult[r.place_id] === 'error' ? '✗ Error'
                                                    : calling === r.place_id ? 'Llamando...'
                                                    : 'Llamar IA'}
                                            </button>
                                        </div>
                                        {/* Pitch + Enrich row */}
                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button
                                                onClick={() => { handleGetPitch(r); handleEnrich(r); }}
                                                disabled={pitching === r.place_id}
                                                style={{ flex: 2, background: pitchData[r.place_id] ? (expandedPitch.has(r.place_id) ? '#2a1a4a' : '#1a1a3a') : '#1E1E2E', border: pitchData[r.place_id] ? '1px solid #7C3AED44' : '1px solid #2A2A3E', borderRadius: 8, padding: '0.4rem 0.6rem', color: pitchData[r.place_id] ? '#A78BFA' : '#888', fontSize: '0.7rem', fontWeight: 600, cursor: pitching === r.place_id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                                            >
                                                {pitching === r.place_id ? '⚡ Generando...' : pitchData[r.place_id] ? (expandedPitch.has(r.place_id) ? '▲ Pitch IA' : '▼ Pitch IA') : '⚡ Pitch IA'}
                                            </button>
                                            <button onClick={() => handleAddToCRM(r)} disabled={isAdded}
                                                style={{ flex: 1, background: isAdded ? '#1a2a1a' : '#1E1E2E', border: isAdded ? '1px solid #2a4a2a' : '1px solid #2A2A3E', borderRadius: 8, padding: '0.4rem', color: isAdded ? '#4a8a4a' : '#888', fontSize: '0.7rem', fontWeight: 600, cursor: isAdded ? 'default' : 'pointer' }}>
                                                {isAdded ? '✓ CRM' : '+ CRM'}
                                            </button>
                                            <a href={`https://www.google.com/maps/place/?q=place_id:${r.place_id}`} target="_blank" rel="noopener noreferrer"
                                                style={{ flex: 1, background: '#1E1E2E', border: '1px solid #2A2A3E', borderRadius: 8, padding: '0.4rem', color: '#888', fontSize: '0.7rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                Maps
                                            </a>
                                        </div>
                                        {/* Pitch expanded panel */}
                                        {expandedPitch.has(r.place_id) && pitchData[r.place_id] && (
                                            <div style={{ background: '#0d0d1a', border: '1px solid #7C3AED33', borderRadius: 8, padding: '0.75rem', marginTop: 2 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                                    <span style={{ fontSize: '0.65rem', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                        {pitchData[r.place_id].industry} · vs {pitchData[r.place_id].competitor}
                                                    </span>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(pitchData[r.place_id].pitch)}
                                                        style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.65rem', padding: '2px 6px' }}
                                                    >
                                                        📋 copiar
                                                    </button>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '0.78rem', color: '#ccc', lineHeight: 1.6, fontStyle: 'italic' }}>
                                                    &ldquo;{pitchData[r.place_id].pitch}&rdquo;
                                                </p>
                                                {/* Social search links from enrich */}
                                                {enrichData[r.place_id] && (
                                                    <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                        <a href={enrichData[r.place_id].instagramSearch} target="_blank" rel="noopener noreferrer"
                                                            style={{ fontSize: '0.65rem', color: '#E1306C', background: '#E1306C11', border: '1px solid #E1306C33', borderRadius: 5, padding: '2px 8px', textDecoration: 'none' }}>
                                                            📸 Buscar Instagram
                                                        </a>
                                                        <a href={enrichData[r.place_id].facebookSearch} target="_blank" rel="noopener noreferrer"
                                                            style={{ fontSize: '0.65rem', color: '#1877F2', background: '#1877F211', border: '1px solid #1877F233', borderRadius: 5, padding: '2px 8px', textDecoration: 'none' }}>
                                                            👤 Buscar Facebook
                                                        </a>
                                                        <a href={enrichData[r.place_id].instagramGuess} target="_blank" rel="noopener noreferrer"
                                                            style={{ fontSize: '0.65rem', color: '#aaa', background: '#ffffff0a', border: '1px solid #333', borderRadius: 5, padding: '2px 8px', textDecoration: 'none' }}>
                                                            IG directo
                                                        </a>
                                                        {enrichData[r.place_id].signals.map(s => (
                                                            <span key={s} style={{ fontSize: '0.62rem', color: '#888', background: '#1E1E2E', borderRadius: 5, padding: '2px 6px' }}>
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Empty states */}
            {!loading && results.length === 0 && !error && stats && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#444' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎯</div>
                    <p>No se encontraron negocios sin sitio web con ese criterio.</p>
                    <p style={{ fontSize: '0.85rem' }}>Prueba otro rubro o cambia de provincia/cantón.</p>
                </div>
            )}
            {!loading && results.length === 0 && !stats && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#333' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</div>
                    <p style={{ color: '#555' }}>Selecciona provincia, cantón y rubro para cazar prospectos.</p>
                    <p style={{ fontSize: '0.8rem', color: '#333' }}>Encuentra negocios locales sin sitio web — tu próximo cliente está ahí.</p>
                </div>
            )}
        </div>
    );
}
