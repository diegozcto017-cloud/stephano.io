'use client';

import { useState } from 'react';

const INDUSTRIES = [
    'Restaurante / Soda', 'Clínica Dental', 'Médico / Clínica', 'Abogado / Bufete',
    'Taller Mecánico', 'Salón de Belleza', 'Peluquería / Barbería', 'Veterinaria',
    'Gimnasio / Fitness', 'Farmacia', 'Hotel / Hostal', 'Tienda / Pulpería',
    'Contador / Auditor', 'Otro',
];

function parseHandle(raw: string): string {
    // Extract @handle from URL or raw text
    if (raw.includes('instagram.com/')) {
        const parts = raw.split('instagram.com/')[1].split('/')[0].split('?')[0];
        return parts.startsWith('@') ? parts : `@${parts}`;
    }
    return raw.startsWith('@') ? raw : `@${raw}`;
}

export default function OutreachPage() {
    const [handle, setHandle] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [industry, setIndustry] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ dm: string; hook: string; handle: string } | null>(null);
    const [editedDm, setEditedDm] = useState('');
    const [copied, setCopied] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleGenerate() {
        if (!handle.trim() && !businessName.trim()) return;
        setLoading(true);
        setResult(null);
        setSent(false);
        setCopied(false);
        try {
            const cleanHandle = handle.trim() ? parseHandle(handle.trim()) : '';
            const res = await fetch('/api/leads/dm-pitch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': 'stephano-secret-2026' },
                body: JSON.stringify({
                    handle: cleanHandle,
                    businessName: businessName.trim() || cleanHandle.replace('@', ''),
                    industry,
                    bio: bio.trim(),
                }),
            });
            const data = await res.json();
            if (data.success) {
                setResult(data);
                setEditedDm(data.dm);
            }
        } catch { /* silent */ } finally {
            setLoading(false);
        }
    }

    function handleCopyAndOpen() {
        const cleanHandle = handle.trim() ? parseHandle(handle.trim()).replace('@', '') : '';
        navigator.clipboard.writeText(editedDm).then(() => {
            setCopied(true);
            setTimeout(() => {
                // Open Instagram DM — works on mobile app and web
                const igUrl = cleanHandle
                    ? `https://www.instagram.com/${cleanHandle}/`
                    : 'https://www.instagram.com/direct/inbox/';
                window.open(igUrl, '_blank');
                setSent(true);
            }, 400);
        });
    }

    const input = { background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: 10, padding: '0.7rem 1rem', color: '#fff', fontSize: '0.875rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const };

    return (
        <div style={{ minHeight: '100vh', background: '#0A0A0F', padding: '2rem', fontFamily: 'system-ui', maxWidth: 680, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #E1306C, #F77737)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>Pitch por Instagram</h1>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#555' }}>Generá un DM personalizado para negocios que no están en Maps</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Handle o URL de Instagram *
                        </label>
                        <input
                            value={handle}
                            onChange={e => setHandle(e.target.value)}
                            placeholder="@comercio o https://instagram.com/comercio"
                            style={input}
                        />
                        <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: '#444' }}>
                            Pegá el link del perfil o escribe @handle
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Nombre del negocio
                        </label>
                        <input
                            value={businessName}
                            onChange={e => setBusinessName(e.target.value)}
                            placeholder="Ej: Soda La Abuela"
                            style={input}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Industria / Tipo
                            </label>
                            <select
                                value={industry}
                                onChange={e => setIndustry(e.target.value)}
                                style={{ ...input, cursor: 'pointer' }}
                            >
                                <option value="">Seleccionar...</option>
                                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Bio del perfil (opcional — pégala para mejor personalización)
                        </label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="Ej: 🍕 Pizza artesanal desde 2018 | San José | Pedidos al WA"
                            rows={2}
                            style={{ ...input, resize: 'vertical' }}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || (!handle.trim() && !businessName.trim())}
                        style={{
                            background: loading ? '#1E1E2E' : 'linear-gradient(135deg, #E1306C, #F77737)',
                            border: 'none', borderRadius: 10, padding: '0.75rem',
                            color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? '⚡ Generando pitch...' : '⚡ Generar DM con IA'}
                    </button>
                </div>
            </div>

            {/* Result — Preview + Send */}
            {result && (
                <div style={{ background: '#111118', border: '1px solid #E1306C33', borderRadius: 16, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#E1306C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Vista previa del DM — {result.handle}
                        </span>
                        {sent && <span style={{ fontSize: '0.7rem', color: '#00C853' }}>✓ Mensaje copiado · Instagram abierto</span>}
                    </div>

                    {/* Simulated DM bubble */}
                    <div style={{ background: '#0A0A0F', borderRadius: 12, padding: '1rem', marginBottom: '1rem', border: '1px solid #2A2A3E' }}>
                        <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 8 }}>
                            De: <span style={{ color: '#E1306C' }}>@stephano.io</span> → {result.handle}
                        </div>
                        <textarea
                            value={editedDm}
                            onChange={e => setEditedDm(e.target.value)}
                            rows={6}
                            style={{
                                width: '100%', background: 'none', border: 'none', outline: 'none',
                                color: '#e0e0e0', fontSize: '0.875rem', lineHeight: 1.6,
                                resize: 'vertical', boxSizing: 'border-box', fontFamily: 'system-ui',
                            }}
                        />
                    </div>

                    {/* Hook line */}
                    <div style={{ background: '#0a1a0a', border: '1px solid #2a4a2a', borderRadius: 8, padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.65rem', color: '#4a8a4a', textTransform: 'uppercase', letterSpacing: 1 }}>Gancho para seguimiento: </span>
                        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{result.hook}</span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={handleCopyAndOpen}
                            style={{
                                flex: 2, background: 'linear-gradient(135deg, #E1306C, #F77737)',
                                border: 'none', borderRadius: 10, padding: '0.75rem',
                                color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
                            {copied ? 'Copiado — abriendo Instagram...' : 'Copiar y abrir Instagram'}
                        </button>
                        <button
                            onClick={() => navigator.clipboard.writeText(editedDm).then(() => setCopied(true))}
                            style={{
                                flex: 1, background: '#1E1E2E', border: '1px solid #2A2A3E',
                                borderRadius: 10, padding: '0.75rem',
                                color: '#888', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                            }}
                        >
                            {copied ? '✓ Copiado' : '📋 Solo copiar'}
                        </button>
                    </div>

                    <p style={{ margin: '0.75rem 0 0', fontSize: '0.7rem', color: '#444', textAlign: 'center' }}>
                        El mensaje se copia al portapapeles → Instagram se abre en el perfil → pegás con Ctrl+V en el DM
                    </p>
                </div>
            )}
        </div>
    );
}
