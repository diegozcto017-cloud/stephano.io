'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX } from 'react-icons/fi';
import styles from '@/styles/admin.module.css';
import { getAdminApiKey } from '@/server/actions/auth.action';

/* ── Types ── */
interface Lead { id: number; nombre: string; empresa: string | null; email: string; tipo_proyecto: string; estado: string; progreso: number; fecha_creacion: string; leadScore?: number | null; leadCategory?: string | null; }
interface Stats { total: number; nuevo: number; enProgreso: number; completado: number; }
interface MonthData { label: string; count: number; pipeline: number; }
interface InvStats { total_facturado: number; pagado: number; pendiente: number; este_mes: number; monthly: { label: string; total: number }[]; count: number; }
interface RevenueStats { totalClosedRevenue: number; projectedRevenue: number; onTrack: boolean; targetGap: number; totalOpenValue: number; }

/* ── Price map (mirrors server) ── */
const PRICE_MAP: Record<string, number> = {
    'Landing Page': 300,
    'landing_page': 300,
    'Sistema Ballena': 1500,
    'Sistema Elite': 3500,
    'E-commerce': 1500,
    'CRM / Web App': 2500,
    'Web App': 2500,
    'Automatización': 2000,
    'App Móvil': 8000,
    'Consultoría': 1000,
};

/* ── Helpers ── */
function fmtUSD(n: number) { return `$${n.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`; }

function BarChart({ bars, height = 90, color }: { bars: { label: string; value: number }[]; height?: number; color: string }) {
    const max = Math.max(...bars.map(b => b.value), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height, paddingTop: 8 }}>
            {bars.map((b, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div title={String(b.value)} style={{ width: '100%', height: `${Math.max((b.value / max) * (height - 22), b.value > 0 ? 3 : 1)}px`, background: b.value > 0 ? color : '#1E1E2E', borderRadius: '3px 3px 0 0', transition: 'height 0.6s ease' }} />
                    <span style={{ fontSize: 9, color: '#555', whiteSpace: 'nowrap' }}>{b.label}</span>
                </div>
            ))}
        </div>
    );
}

function HBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#aaa' }}>{label}</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{fmtUSD(value)}</span>
            </div>
            <div style={{ height: 6, background: '#1E1E2E', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
            </div>
        </div>
    );
}

function StatusBadge({ estado }: { estado: string }) {
    const cfg: Record<string, { label: string; color: string }> = {
        nuevo: { label: 'Nuevo', color: '#0066FF' },
        en_progreso: { label: 'En Progreso', color: '#FF8C00' },
        completado: { label: 'Completado', color: '#00c864' },
        cancelado: { label: 'Cancelado', color: '#FF4444' },
    };
    const c = cfg[estado] || { label: estado, color: '#666' };
    return <span style={{ background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{c.label}</span>;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ total: 0, nuevo: 0, enProgreso: 0, completado: 0 });
    const [leads, setLeads] = useState<Lead[]>([]);
    const [chart, setChart] = useState<MonthData[]>([]);
    const [invStats, setInvStats] = useState<InvStats | null>(null);
    const [revStats, setRevStats] = useState<RevenueStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [latestLead, setLatestLead] = useState<Lead | null>(null);
    const prevTotalRef = useRef<number | null>(null);

    const fetchAll = useCallback(async (isPolling = false) => {
        try {
            const apiKey = await getAdminApiKey();
            const h = { 'x-admin-key': apiKey || '' };

            const [statsRes, leadsRes, chartRes, invRes, revRes] = await Promise.all([
                fetch('/api/leads?stats=true', { headers: h }).then(r => r.json()),
                fetch('/api/leads', { headers: h }).then(r => r.json()),
                fetch('/api/leads?chart=true', { headers: h }).then(r => r.json()),
                fetch('/api/invoices?stats=true', { headers: h }).then(r => r.json()),
                fetch('/api/revenue-predictor', { headers: h }).then(r => r.json()),
            ]);
 
            if (statsRes.success) {
                setStats(statsRes.data);
                if (isPolling && prevTotalRef.current !== null && statsRes.data.total > prevTotalRef.current) {
                    if (leadsRes.success && leadsRes.data.length > 0) {
                        setLatestLead(leadsRes.data[0]);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 8000);
                    }
                }
                prevTotalRef.current = statsRes.data.total;
            }
            if (leadsRes.success) setLeads(leadsRes.data.slice(0, 8));
            if (chartRes.success) setChart(chartRes.data.monthly || []);
            if (invRes.success) setInvStats(invRes.data);
            if (revRes && !revRes.error) setRevStats(revRes);
        } catch (e) {
            console.error('Dashboard fetch error:', e);
        } finally {
            if (!isPolling) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll(false);
        const interval = setInterval(() => fetchAll(true), 15000);
        return () => clearInterval(interval);
    }, [fetchAll]);

    const pipelineActivo = leads
        .filter(l => l.estado === 'nuevo' || l.estado === 'en_progreso')
        .reduce((s, l) => s + (PRICE_MAP[l.tipo_proyecto] || 500), 0);

    const conversionRate = stats.total > 0 ? Math.round((stats.completado / stats.total) * 100) : 0;

    if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>;

    return (
        <>
            <div className={styles.adminPageHeader}>
                <h1 className={styles.adminPageTitle}>Dashboard</h1>
                <p className={styles.adminPageDesc}>Centro de control — ventas, pipeline y actividad en tiempo real</p>
            </div>

            {/* ── KPI Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                    { label: 'Meta Anual ($40k)', value: fmtUSD(revStats?.totalClosedRevenue || 0), sub: `${Math.round(((revStats?.totalClosedRevenue || 0) / 40000) * 100)}% de la meta`, color: '#FFFFFF', icon: '🏆' },
                    { label: 'Pipeline Activo', value: fmtUSD(pipelineActivo), sub: `${stats.nuevo + stats.enProgreso} proyectos`, color: '#0066FF', icon: '📈' },
                    { label: 'Ingresos Proyectados', value: fmtUSD(revStats?.projectedRevenue || 0), sub: 'Ponderado por probabilidad', color: '#00c864', icon: '🚀' },
                    { label: 'Por Cobrar', value: fmtUSD(invStats?.pendiente || 0), sub: 'facturas pendientes', color: '#FF8C00', icon: '⏳' },
                    { label: 'Este Mes', value: fmtUSD(invStats?.este_mes || 0), sub: 'ingresos del mes', color: '#00E5FF', icon: '📅' },
                    { label: 'Clientes Totales', value: String(stats.total), sub: `${stats.nuevo} nuevos`, color: '#9D4EDD', icon: '👥' },
                ].map(card => (
                    <div key={card.label} style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: 14, padding: '1.2rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>{card.icon}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: card.color, lineHeight: 1 }}>{card.value}</div>
                        <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{card.sub}</div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 4, fontWeight: 600 }}>{card.label}</div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${card.color}44, ${card.color}00)` }} />
                    </div>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* Revenue chart */}
                <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: 14, padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Ingresos por Mes</div>
                            <div style={{ fontSize: 11, color: '#555' }}>Facturas emitidas (USD)</div>
                        </div>
                        <div style={{ fontSize: 11, color: '#00c864', fontWeight: 700 }}>{fmtUSD(invStats?.total_facturado || 0)} total</div>
                    </div>
                    <BarChart
                        bars={(invStats?.monthly || chart.map(m => ({ label: m.label, total: 0 }))).map(m => ({ label: m.label, value: m.total }))}
                        color="#00c864"
                    />
                </div>

                {/* Leads/pipeline chart */}
                <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: 14, padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Pipeline por Mes</div>
                            <div style={{ fontSize: 11, color: '#555' }}>Valor estimado de leads (USD)</div>
                        </div>
                        <div style={{ fontSize: 11, color: '#0066FF', fontWeight: 700 }}>{fmtUSD(chart.reduce((s, m) => s + m.pipeline, 0))} total</div>
                    </div>
                    <BarChart bars={chart.map(m => ({ label: m.label, value: m.pipeline }))} color="#0066FF" />
                </div>
            </div>

            {/* ── Pipeline by type + recent metrics ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: 14, padding: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>Pipeline por Tipo de Proyecto</div>
                    {(() => {
                        const byType: Record<string, number> = {};
                        leads.forEach(l => { byType[l.tipo_proyecto] = (byType[l.tipo_proyecto] || 0) + (PRICE_MAP[l.tipo_proyecto] || 500); });
                        const sorted = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 5);
                        const max = sorted[0]?.[1] || 1;
                        return sorted.map(([tipo, val]) => <HBar key={tipo} label={tipo} value={val} max={max} color="#0066FF" />);
                    })()}
                    {leads.length === 0 && <p style={{ color: '#555', fontSize: 13 }}>No hay leads aún</p>}
                </div>

                <div style={{ background: '#111118', border: '1px solid #1E1E2E', borderRadius: 14, padding: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>Estado del Negocio</div>
                    {[
                        { label: 'Leads Nuevos', value: stats.nuevo, total: stats.total, color: '#0066FF' },
                        { label: 'En Progreso', value: stats.enProgreso, total: stats.total, color: '#FF8C00' },
                        { label: 'Completados', value: stats.completado, total: stats.total, color: '#00c864' },
                        { label: 'Facturado Cobrado', value: invStats?.pagado || 0, total: invStats?.total_facturado || 1, color: '#00E5FF', isUSD: true },
                    ].map(item => (
                        <div key={item.label} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                <span style={{ color: '#aaa' }}>{item.label}</span>
                                <span style={{ color: '#fff', fontWeight: 600 }}>
                                    {(item as { isUSD?: boolean }).isUSD ? fmtUSD(item.value) : item.value}
                                </span>
                            </div>
                            <div style={{ height: 6, background: '#1E1E2E', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}%`, background: item.color, borderRadius: 3, transition: 'width 0.8s ease' }} />
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: 20, padding: '12px', background: '#0A0A0F', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 12, color: '#666' }}>Leads → Clientes</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: conversionRate >= 50 ? '#00c864' : conversionRate >= 20 ? '#FF8C00' : '#FF4444' }}>
                            {conversionRate}%
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Recent leads table ── */}
            <div className={styles.tableCard}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#fff' }}>Leads Recientes</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link href="/admin/prospectos" style={{ fontSize: 12, padding: '6px 12px', background: 'linear-gradient(135deg, #0066FF22, #00E5FF22)', border: '1px solid #0066FF44', borderRadius: 8, color: '#00E5FF', textDecoration: 'none', fontWeight: 600 }}>
                            + Prospectos
                        </Link>
                        <Link href="/admin/clientes" className={styles.btnGhost} style={{ fontSize: 12, padding: '6px 14px' }}>
                            Ver todos →
                        </Link>
                    </div>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Proyecto</th>
                            <th>Valor Est.</th>
                            <th>Score IA</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/admin/clientes/${lead.id}`}>
                                <td style={{ fontWeight: 600, color: '#fff' }}>
                                    {lead.nombre}
                                    {lead.empresa && <span style={{ display: 'block', fontSize: 11, color: '#555', fontWeight: 400 }}>{lead.empresa}</span>}
                                </td>
                                <td style={{ color: '#aaa' }}>{lead.tipo_proyecto}</td>
                                <td style={{ color: '#00E5FF', fontWeight: 700 }}>{fmtUSD(PRICE_MAP[lead.tipo_proyecto] || 500)}</td>
                                <td>
                                    {lead.leadScore ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div style={{ padding: '2px 6px', background: lead.leadCategory === 'Prioritaria' ? '#FFD700' : 'rgba(255,255,255,0.1)', color: lead.leadCategory === 'Prioritaria' ? '#000' : '#fff', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                                                {lead.leadScore}
                                            </div>
                                            <span style={{ fontSize: 10, opacity: 0.6 }}>{lead.leadCategory}</span>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: 10, opacity: 0.2 }}>Pendiente</span>
                                    )}
                                </td>
                                <td><StatusBadge estado={lead.estado} /></td>
                                <td style={{ color: '#555', fontSize: 12 }}>{new Date(lead.fecha_creacion).toLocaleDateString('es')}</td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.2)' }}>No hay leads aún — activa el Lead Hunter</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Notification Toast ── */}
            <AnimatePresence>
                {showToast && latestLead && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.4, type: 'spring', bounce: 0.4 }}
                        style={{ position: 'fixed', bottom: 30, right: 30, background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 9999, maxWidth: 400 }}
                    >
                        <div style={{ background: 'linear-gradient(135deg, #0066FF, #00E5FF)', padding: 10, borderRadius: '50%', color: '#fff', display: 'flex' }}>
                            <FiBell size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <h4 style={{ margin: 0, fontSize: 15, color: '#fff', fontWeight: 700 }}>¡Nuevo Lead!</h4>
                                {latestLead.leadCategory === 'Prioritaria' && (
                                    <span style={{ background: '#FFD700', color: '#000', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.05em' }}>BALLENA BLANCA</span>
                                )}
                            </div>
                            <p style={{ margin: '0 0 10px', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                                <strong>{latestLead.nombre}</strong> — {latestLead.tipo_proyecto} · {fmtUSD(PRICE_MAP[latestLead.tipo_proyecto] || 500)}
                                {latestLead.leadScore && (
                                    <span style={{ display: 'block', marginTop: 4, fontSize: 11, color: '#00E5FF' }}>IA Score: {latestLead.leadScore} ({latestLead.leadCategory})</span>
                                )}
                            </p>
                            <Link href={`/admin/clientes/${latestLead.id}`} style={{ color: '#00E5FF', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>Ver detalles →</Link>
                        </div>
                        <button onClick={() => setShowToast(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}>
                            <FiX size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
