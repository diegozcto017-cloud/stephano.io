'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/admin.module.css';

import { getAdminApiKey } from '@/server/actions/auth.action';

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

interface PipelineStats {
    totalOpenValue: number;
    projectedRevenue: number;
    stageCounts: Record<string, number>;
    stageValues: Record<string, number>;
    weeklyLeads: number;
    closedThisMonth: number;
    totalClosedRevenue: number;
    targetGap: number;
    onTrack: boolean;
}

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────

const TARGET = 40000;

const STAGE_META: Record<string, { label: string; prob: number; color: string }> = {
    nuevo_lead:         { label: 'Nuevo Lead',        prob: 5,   color: '#888' },
    lead_analizado:     { label: 'Lead Analizado',    prob: 10,  color: '#60a5fa' },
    lead_calificado:    { label: 'Lead Calificado',   prob: 20,  color: '#0066FF' },
    propuesta_enviada:  { label: 'Propuesta Enviada', prob: 40,  color: '#a855f7' },
    negociacion_activa: { label: 'Negociación Activa',prob: 70,  color: '#eab308' },
    contrato_cerrado:   { label: 'Contrato Cerrado',  prob: 100, color: '#22c55e' },
    contrato_perdido:   { label: 'Contrato Perdido',  prob: 0,   color: '#ef4444' },
};

function fmtUSD(n: number) {
    return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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

export default function RevenuePredictorPage() {
    const [stats, setStats] = useState<PipelineStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiKey = await getAdminApiKey();
                const res = await fetch('/api/revenue-predictor', {
                    headers: { 'x-admin-key': apiKey || '' }
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setStats(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const closedPct = stats ? Math.min(100, (stats.totalClosedRevenue / TARGET) * 100) : 0;
    const projectedPct = stats ? Math.min(100, ((stats.totalClosedRevenue + stats.projectedRevenue) / TARGET) * 100) : 0;

    return (
        <>
            {/* ── Header ── */}
            <div className={styles.adminPageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className={styles.adminPageTitle} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                            <path d="M2 20h20" />
                        </svg>
                        Revenue Predictor
                    </h1>
                    <p className={styles.adminPageDesc}>Proyección de ingresos y análisis del pipeline de ventas</p>
                </div>

                {stats && (
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        fontSize: 12, fontWeight: 600,
                        background: stats.onTrack ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                        color: stats.onTrack ? '#22c55e' : '#ef4444',
                        padding: '6px 16px',
                        borderRadius: 100,
                        border: `1px solid ${stats.onTrack ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: stats.onTrack ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                        {stats.onTrack ? 'En camino a la meta' : 'Por debajo de la meta'}
                    </span>
                )}
            </div>

            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#555', fontSize: 14 }}>Cargando estadísticas del pipeline...</div>
            )}

            {stats && (
                <>
                    {/* ── KPI Cards ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                        {[
                            { label: 'Meta Anual', value: fmtUSD(TARGET), sub: 'USD objetivo 2025', color: '#fff', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)' },
                            { label: 'Cerrado', value: fmtUSD(stats.totalClosedRevenue), sub: `${closedPct.toFixed(1)}% de la meta`, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
                            { label: 'Proyectado', value: fmtUSD(stats.projectedRevenue), sub: 'Ponderado por probabilidad', color: '#0066FF', bg: 'rgba(0,102,255,0.08)', border: 'rgba(0,102,255,0.2)' },
                            { label: 'Gap Restante', value: fmtUSD(stats.targetGap), sub: stats.targetGap === 0 ? 'Meta alcanzada' : 'Para cerrar la meta', color: stats.targetGap === 0 ? '#22c55e' : '#ef4444', bg: stats.targetGap === 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: stats.targetGap === 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' },
                        ].map((kpi) => (
                            <div key={kpi.label} style={{ background: kpi.bg, border: `1px solid ${kpi.border}`, borderRadius: 12, padding: '1rem 1.25rem' }}>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{kpi.label}</div>
                                <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color, marginBottom: 4 }}>{kpi.value}</div>
                                <div style={{ fontSize: 11, color: '#555' }}>{kpi.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Progress Bar ── */}
                    <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Progreso hacia la Meta — {fmtUSD(TARGET)}</div>
                            <div style={{ fontSize: 13, color: '#555' }}>
                                <span style={{ color: '#22c55e', fontWeight: 700 }}>{fmtUSD(stats.totalClosedRevenue)}</span>
                                {' cerrado · '}
                                <span style={{ color: '#0066FF', fontWeight: 700 }}>{fmtUSD(stats.projectedRevenue)}</span>
                                {' proyectado'}
                            </div>
                        </div>

                        {/* Track */}
                        <div style={{ position: 'relative', height: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 7, overflow: 'hidden' }}>
                            {/* Projected bar (behind) */}
                            <div style={{
                                position: 'absolute', left: 0, top: 0, height: '100%',
                                width: `${projectedPct}%`,
                                background: 'rgba(0,102,255,0.25)',
                                borderRadius: 7,
                                transition: 'width 0.6s ease',
                            }} />
                            {/* Closed bar (front) */}
                            <div style={{
                                position: 'absolute', left: 0, top: 0, height: '100%',
                                width: `${closedPct}%`,
                                background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                                borderRadius: 7,
                                transition: 'width 0.6s ease',
                            }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#555' }}>
                            <span>$0</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: 2, background: '#22c55e', display: 'inline-block' }} />
                                    Cerrado
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(0,102,255,0.4)', display: 'inline-block' }} />
                                    Proyectado
                                </span>
                            </span>
                            <span>{fmtUSD(TARGET)}</span>
                        </div>

                        {/* Alert if not on track */}
                        {!stats.onTrack && (
                            <div style={{
                                marginTop: '1rem',
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: 8,
                                padding: '10px 14px',
                                fontSize: 13,
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                                El pipeline actual proyecta menos del 50% del gap restante. Se necesitan más leads calificados o negociaciones activas.
                            </div>
                        )}
                    </div>

                    {/* ── Pipeline Stage Breakdown ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                        {/* Stage Table */}
                        <div style={cardStyle}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: '1.25rem' }}>
                                Desglose por Etapa
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #1E1E2E' }}>
                                        {['Etapa', 'Leads', 'Valor', 'Prob.', 'Ponderado'].map((h) => (
                                            <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(STAGE_META).map(([stage, meta]) => {
                                        const count = stats.stageCounts[stage] || 0;
                                        const value = stats.stageValues[stage] || 0;
                                        const weighted = Math.round(value * meta.prob / 100);
                                        if (count === 0) return null;
                                        return (
                                            <tr key={stage} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                <td style={{ padding: '10px 10px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color, display: 'inline-block', flexShrink: 0 }} />
                                                        <span style={{ color: '#fff', fontWeight: 500 }}>{meta.label}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '10px 10px', color: meta.color, fontWeight: 700, textAlign: 'center' }}>{count}</td>
                                                <td style={{ padding: '10px 10px', color: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>{fmtUSD(value)}</td>
                                                <td style={{ padding: '10px 10px', color: '#555', textAlign: 'center' }}>{meta.prob}%</td>
                                                <td style={{ padding: '10px 10px', color: '#0066FF', fontWeight: 700, textAlign: 'right' }}>{fmtUSD(weighted)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Activity Stats */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={cardStyle}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: '1.25rem' }}>
                                    Actividad Reciente
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {[
                                        { label: 'Leads esta semana', value: stats.weeklyLeads, color: '#00E5FF' },
                                        { label: 'Contratos cerrados este mes', value: stats.closedThisMonth, color: '#22c55e' },
                                        { label: 'Valor total en pipeline abierto', value: fmtUSD(stats.totalOpenValue), color: '#0066FF' },
                                    ].map((item) => (
                                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                                            <span style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pipeline Visual Funnel */}
                            <div style={cardStyle}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: '1.25rem' }}>
                                    Embudo de Ventas
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {Object.entries(STAGE_META)
                                        .filter(([stage]) => stage !== 'contrato_perdido')
                                        .map(([stage, meta], i, arr) => {
                                            const count = stats.stageCounts[stage] || 0;
                                            const maxCount = Math.max(...arr.map(([s]) => stats.stageCounts[s] || 0), 1);
                                            const barPct = Math.max(8, (count / maxCount) * 100);
                                            return (
                                                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ fontSize: 11, color: '#555', width: 140, textAlign: 'right', flexShrink: 0 }}>{meta.label}</div>
                                                    <div style={{ flex: 1, height: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                                                        <div style={{ width: `${barPct}%`, height: '100%', background: meta.color, borderRadius: 4, opacity: 0.8, transition: 'width 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
                                                            {count > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#000' }}>{count}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
