'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface PropuestaPublica {
    id: number;
    token: string;
    clientName: string;
    clientCompany: string | null;
    service: string;
    total: number;
    proposalText: string;
    sentAt: string;
    viewedAt: string | null;
}

export default function PropuestaPublicaPage() {
    const { token } = useParams<{ token: string }>();
    const [propuesta, setPropuesta] = useState<PropuestaPublica | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetch(`/api/p/${token}`)
            .then(r => r.json())
            .then(data => {
                if (data.success) setPropuesta(data.data);
                else setNotFound(true);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(0,102,255,0.3)', borderTopColor: '#0066FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    if (notFound) return (
        <div style={{ minHeight: '100vh', background: '#080810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Propuesta no encontrada</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>El enlace puede haber expirado o ser incorrecto.</div>
        </div>
    );

    if (!propuesta) return null;

    const fmtTotal = `$${propuesta.total.toLocaleString('es')} USD`;
    const sentDate = new Date(propuesta.sentAt).toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });

    const lines = propuesta.proposalText
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

    return (
        <div style={{ minHeight: '100vh', background: '#080810', fontFamily: "'Inter', Arial, sans-serif", padding: '0 0 60px' }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0066FF 0%, #0044CC 60%, #00E5FF 100%)', padding: '32px 24px 28px' }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Stephano.io</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>Propuesta Comercial</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{sentDate}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client + Amount bar */}
            <div style={{ background: 'rgba(0,102,255,0.08)', borderBottom: '1px solid rgba(0,102,255,0.15)', padding: '20px 24px' }}>
                <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Preparada para</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{propuesta.clientName}</div>
                        {propuesta.clientCompany && propuesta.clientCompany !== propuesta.clientName && (
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{propuesta.clientCompany}</div>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Inversión total</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: '#00E5FF' }}>{fmtTotal}</div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 24px 0' }}>

                {/* Service pill */}
                <div style={{ marginBottom: 20 }}>
                    <span style={{ display: 'inline-block', background: 'rgba(0,102,255,0.15)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.25)', borderRadius: 100, padding: '6px 18px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {propuesta.service}
                    </span>
                </div>

                {/* Proposal content */}
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 20px', marginBottom: 28 }}>
                    {lines.map((line, i) => {
                        const isBullet = line.startsWith('•') || line.startsWith('-');
                        return isBullet ? (
                            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                <div style={{ color: '#0066FF', fontWeight: 700, marginTop: 2, flexShrink: 0 }}>→</div>
                                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                                    {line.replace(/^[•\-]\s*/, '')}
                                </div>
                            </div>
                        ) : (
                            <p key={i} style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: '0 0 14px' }}>
                                {line}
                            </p>
                        );
                    })}
                </div>

                {/* Value boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
                    {[
                        { icon: '🔒', title: 'Garantía', desc: '30 días de ajustes sin costo' },
                        { icon: '⚡', title: 'Entrega', desc: 'Sitio listo en 2-3 semanas' },
                        { icon: '📱', title: 'Responsive', desc: 'Móvil, tablet y escritorio' },
                        { icon: '🇨🇷', title: 'Soporte local', desc: 'Atención directa desde Costa Rica' },
                    ].map(({ icon, title, desc }) => (
                        <div key={title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 14px' }}>
                            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{title}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>{desc}</div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <a
                        href="https://wa.me/50671164454"
                        style={{ display: 'block', background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', textDecoration: 'none', padding: '16px 24px', borderRadius: 100, fontSize: 15, fontWeight: 800, textAlign: 'center' }}
                    >
                        💬 Conversemos por WhatsApp
                    </a>
                    <a
                        href="mailto:info@stephano.io"
                        style={{ display: 'block', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '14px 24px', borderRadius: 100, fontSize: 14, fontWeight: 600, textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        ✉️ Escribir por correo
                    </a>
                </div>

                {/* Footer note */}
                <div style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
                    Stephano.io — Agencia de Desarrollo Web · Costa Rica<br />
                    Esta propuesta es válida por 15 días · info@stephano.io
                </div>
            </div>
        </div>
    );
}
