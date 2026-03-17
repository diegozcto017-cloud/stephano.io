'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '@/styles/admin.module.css';

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

interface Lead {
    id: number;
    nombre: string;
    empresa: string | null;
    tipo_proyecto: string;
    presupuesto_rango: string | null;
    urgencia: string | null;
    leadScore: number | null;
    leadCategory: string | null;
    pipelineStage: string;
    fecha_creacion: string;
}

interface ScoreResult {
    score: number;
    category: string;
    recommendation: string;
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

function categoryBadge(category: string | null) {
    if (!category) return null;
    const map: Record<string, { bg: string; border: string; color: string; label: string }> = {
        prioritaria: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', color: '#22c55e', label: 'Prioritaria' },
        viable: { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)', color: '#eab308', label: 'Viable' },
        baja: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#ef4444', label: 'Baja' },
    };
    const s = map[category] || map.baja;
    return (
        <span style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            color: s.color,
            borderRadius: 6,
            padding: '2px 10px',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
        }}>
            {s.label}
        </span>
    );
}

function stageLabel(stage: string) {
    const map: Record<string, string> = {
        nuevo_lead: 'Nuevo Lead',
        lead_analizado: 'Analizado',
        lead_calificado: 'Calificado',
        propuesta_enviada: 'Propuesta Enviada',
        negociacion_activa: 'Negociación',
        contrato_cerrado: 'Cerrado',
        contrato_perdido: 'Perdido',
    };
    return map[stage] || stage;
}

function ScoreBar({ score }: { score: number | null }) {
    if (score === null) return <span style={{ color: '#444', fontSize: 12 }}>Sin puntaje</span>;
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.4s' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 28, textAlign: 'right' }}>{score}</span>
        </div>
    );
}

const cardStyle: React.CSSProperties = {
    background: '#111118',
    border: '1px solid #1E1E2E',
    borderRadius: 14,
    padding: '1.5rem',
};

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────

export default function DealIntelligencePage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [scoringId, setScoringId] = useState<number | null>(null);
    const [scoringAll, setScoringAll] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastResult, setLastResult] = useState<ScoreResult | null>(null);

    const fetchLeads = useCallback(async () => {
        try {
            const res = await fetch('/api/leads');
            const data = await res.json();
            setLeads(Array.isArray(data) ? data : data.leads || []);
        } catch {
            setError('Error al cargar leads');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    async function scoreSingleLead(leadId: number) {
        setScoringId(leadId);
        setError(null);
        setLastResult(null);
        try {
            const res = await fetch('/api/deal-intelligence/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al puntuar lead');
            setLastResult({ score: data.score, category: data.category, recommendation: data.recommendation });
            await fetchLeads();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setScoringId(null);
        }
    }

    async function scoreAllUnscored() {
        setScoringAll(true);
        setError(null);
        const unscored = leads.filter((l) => l.leadScore === null);
        for (const lead of unscored) {
            setScoringId(lead.id);
            try {
                await fetch('/api/deal-intelligence/score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ leadId: lead.id }),
                });
            } catch {
                // Continue with next lead
            }
        }
        setScoringId(null);
        setScoringAll(false);
        await fetchLeads();
    }

    const unscoredCount = leads.filter((l) => l.leadScore === null).length;
    const prioritarias = leads.filter((l) => l.leadCategory === 'prioritaria').length;
    const viables = leads.filter((l) => l.leadCategory === 'viable').length;

    return (
        <>
            {/* ── Header ── */}
            <div className={styles.adminPageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className={styles.adminPageTitle} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4l3 3" />
                            <path d="M8.5 8.5a5 5 0 1 1 0 7" />
                        </svg>
                        Deal Intelligence
                    </h1>
                    <p className={styles.adminPageDesc}>Puntuación automática de leads con IA — Prioriza oportunidades de venta</p>
                </div>

                <button
                    onClick={scoreAllUnscored}
                    disabled={scoringAll || unscoredCount === 0}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px',
                        background: scoringAll || unscoredCount === 0
                            ? 'rgba(0,102,255,0.15)'
                            : 'linear-gradient(135deg, #0066FF, #00E5FF)',
                        border: 'none',
                        borderRadius: 10,
                        color: scoringAll || unscoredCount === 0 ? 'rgba(255,255,255,0.3)' : '#fff',
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: scoringAll || unscoredCount === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {scoringAll ? (
                        <>
                            <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            Puntuando...
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                            Puntuar todos sin score ({unscoredCount})
                        </>
                    )}
                </button>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            {/* ── Summary Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Total Leads', value: leads.length, color: '#00E5FF', bg: 'rgba(0,229,255,0.08)', border: 'rgba(0,229,255,0.2)' },
                    { label: 'Sin Puntaje', value: unscoredCount, color: '#888', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
                    { label: 'Prioritarias', value: prioritarias, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
                    { label: 'Viables', value: viables, color: '#eab308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.2)' },
                ].map((stat) => (
                    <div key={stat.label} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 12, padding: '1rem 1.25rem' }}>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{stat.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* ── Last Score Result ── */}
            {lastResult && (
                <div style={{
                    ...cardStyle,
                    marginBottom: '1.5rem',
                    background: 'rgba(0,102,255,0.06)',
                    border: '1px solid rgba(0,102,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: lastResult.score >= 80 ? '#22c55e' : lastResult.score >= 60 ? '#eab308' : '#ef4444', minWidth: 60 }}>
                        {lastResult.score}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Último puntaje calculado</span>
                            {categoryBadge(lastResult.category)}
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{lastResult.recommendation}</div>
                    </div>
                    <button onClick={() => setLastResult(null)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: 4, fontSize: 18, lineHeight: 1 }}>×</button>
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {/* ── Leads Table ── */}
            <div style={cardStyle}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: '1.25rem' }}>
                    Todos los Leads
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#555', fontSize: 14 }}>Cargando leads...</div>
                ) : leads.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#555', fontSize: 14 }}>No hay leads registrados aún.</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #1E1E2E' }}>
                                    {['Nombre / Empresa', 'Proyecto', 'Presupuesto', 'Urgencia', 'Puntaje', 'Categoría', 'Etapa', 'Acción'].map((h) => (
                                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <td style={{ padding: '12px 12px' }}>
                                            <div style={{ fontWeight: 600, color: '#fff' }}>{lead.nombre}</div>
                                            {lead.empresa && <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>{lead.empresa}</div>}
                                        </td>
                                        <td style={{ padding: '12px 12px', color: 'rgba(255,255,255,0.7)', maxWidth: 160 }}>
                                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.tipo_proyecto}</div>
                                        </td>
                                        <td style={{ padding: '12px 12px', color: '#00E5FF', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                            {lead.presupuesto_rango || '—'}
                                        </td>
                                        <td style={{ padding: '12px 12px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                                            {lead.urgencia || '—'}
                                        </td>
                                        <td style={{ padding: '12px 12px', minWidth: 120 }}>
                                            <ScoreBar score={lead.leadScore} />
                                        </td>
                                        <td style={{ padding: '12px 12px' }}>
                                            {categoryBadge(lead.leadCategory)}
                                        </td>
                                        <td style={{ padding: '12px 12px', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', fontSize: 12 }}>
                                            {stageLabel(lead.pipelineStage)}
                                        </td>
                                        <td style={{ padding: '12px 12px' }}>
                                            <button
                                                onClick={() => scoreSingleLead(lead.id)}
                                                disabled={scoringId === lead.id || scoringAll}
                                                style={{
                                                    padding: '6px 14px',
                                                    background: scoringId === lead.id
                                                        ? 'rgba(0,102,255,0.15)'
                                                        : lead.leadScore !== null
                                                            ? 'rgba(255,255,255,0.04)'
                                                            : 'rgba(0,102,255,0.15)',
                                                    border: `1px solid ${lead.leadScore !== null ? 'rgba(255,255,255,0.1)' : 'rgba(0,102,255,0.3)'}`,
                                                    borderRadius: 7,
                                                    color: scoringId === lead.id ? '#0066FF' : lead.leadScore !== null ? '#666' : '#0066FF',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    cursor: scoringId === lead.id || scoringAll ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {scoringId === lead.id ? (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                                        <span style={{ display: 'inline-block', width: 10, height: 10, border: '2px solid rgba(0,102,255,0.3)', borderTopColor: '#0066FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                                        Puntuando...
                                                    </span>
                                                ) : lead.leadScore !== null ? 'Re-puntuar' : 'Puntuar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
