'use client';

const workflows = [
    {
        name: 'Lead Outreach — Email',
        file: 'lead-outreach-email.json',
        webhook: 'http://localhost:5678/webhook/lead-email-outreach',
        description: 'Secuencia de 3 emails: bienvenida, seguimiento 24h, cierre 72h',
    },
    {
        name: 'Lead Outreach — WhatsApp',
        file: 'lead-outreach-whatsapp.json',
        webhook: 'http://localhost:5678/webhook/lead-outreach',
        description: 'Secuencia de 3 WhatsApp: inicial, follow-up 24h, cierre 72h',
    },
    {
        name: 'Ads Autopublish',
        file: 'stephano-ads-autopublish.json',
        webhook: 'http://localhost:5678/webhook/ads-engine',
        description: 'Pipeline de generación y publicación automática de anuncios',
    },
    {
        name: 'Lead Auto-Pipeline',
        file: 'lead-auto-pipeline.json',
        webhook: 'http://localhost:5678/webhook/new-lead-pipeline',
        description: 'Clasifica leads (score ≥ 60 → propuesta automática en 30 min)',
    },
    {
        name: 'Daily Revenue Check',
        file: 'daily-revenue-check.json',
        webhook: 'Cron: 8:00 AM diario',
        description: 'Verifica meta de ingresos; si no está en camino genera ideas con Growth Brain',
    },
];

const setupSteps = [
    {
        step: 1,
        title: 'Levantar n8n',
        code: 'docker-compose up n8n -d',
        description: 'Inicia el contenedor n8n en background',
    },
    {
        step: 2,
        title: 'Abrir n8n',
        code: 'http://localhost:5678',
        description: 'Usuario: admin · Contraseña: stephano2024',
    },
    {
        step: 3,
        title: 'Importar workflows',
        code: 'Importar desde /n8n-workflows/ (5 archivos .json)',
        description: 'En n8n: Workflows → Import → seleccionar cada archivo',
    },
    {
        step: 4,
        title: 'Configurar variables n8n',
        code: 'STEPHANO_URL = https://tu-dominio.com',
        description: 'En n8n: Settings → Variables → agregar STEPHANO_URL y STEPHANO_ADMIN_KEY',
    },
    {
        step: 5,
        title: 'Configurar Instagram Webhook en Meta',
        code: 'URL: https://tu-dominio.com/api/instagram/webhook\nVerify Token: stephano_ig_verify_2024',
        description: 'Meta for Developers → crear app → Instagram → Webhooks → suscribirse a messages y comments',
    },
];

export default function AutomatizacionPage() {
    const statusCards = [
        {
            title: 'n8n Engine',
            description: 'Motor de automatización de workflows',
            icon: '⚡',
            active: true,
            note: 'Configurar con docker-compose up n8n -d',
        },
        {
            title: 'Instagram Webhook',
            description: 'Captura DMs y comentarios con keywords',
            icon: '📸',
            active: false,
            note: 'Requiere META_ACCESS_TOKEN e INSTAGRAM_VERIFY_TOKEN',
        },
        {
            title: 'Email Sequences',
            description: 'Secuencias automáticas vía Resend',
            icon: '✉️',
            active: true,
            note: 'Resend configurado y activo',
        },
        {
            title: 'WhatsApp Outreach',
            description: 'Mensajes automáticos vía CallMeBot',
            icon: '💬',
            active: false,
            note: 'Requiere CALLMEBOT_APIKEY en variables de n8n',
        },
    ];

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '32px', color: '#f1f1f1', fontFamily: 'system-ui, sans-serif' }}>

            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '28px' }}>⚡</span>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                        Centro de Automatización
                    </h1>
                </div>
                <p style={{ color: '#888', margin: 0, fontSize: '15px' }}>
                    Instagram DM → Lead → Score → Propuesta → Follow-up — sin intervención manual
                </p>
            </div>

            {/* Status Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                {statusCards.map((card) => (
                    <div
                        key={card.title}
                        style={{
                            background: '#111',
                            border: `1px solid ${card.active ? '#00c86440' : '#333'}`,
                            borderRadius: '12px',
                            padding: '20px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>{card.icon}</span>
                                <span style={{ fontWeight: 600, fontSize: '15px' }}>{card.title}</span>
                            </div>
                            <span style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: card.active ? '#00c864' : '#444',
                                display: 'inline-block',
                                boxShadow: card.active ? '0 0 8px #00c864' : 'none',
                            }} />
                        </div>
                        <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 8px 0' }}>{card.description}</p>
                        <p style={{ color: card.active ? '#00c864' : '#f59e0b', fontSize: '12px', margin: 0 }}>
                            {card.active ? '● Activo' : '○ ' + card.note}
                        </p>
                    </div>
                ))}
            </div>

            {/* Active Workflows */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#00E5FF' }}>
                    Flujos activos
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {workflows.map((wf, i) => (
                        <div
                            key={wf.name}
                            style={{
                                background: '#111',
                                border: '1px solid #1e1e1e',
                                borderRadius: '10px',
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                            }}
                        >
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                background: '#0066FF22',
                                border: '1px solid #0066FF44',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: '#0066FF',
                                flexShrink: 0,
                            }}>
                                {i + 1}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{wf.name}</div>
                                <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>{wf.description}</div>
                                <code style={{
                                    fontSize: '11px',
                                    background: '#0a0a0a',
                                    border: '1px solid #222',
                                    borderRadius: '4px',
                                    padding: '3px 8px',
                                    color: '#00E5FF',
                                    display: 'inline-block',
                                    wordBreak: 'break-all',
                                }}>
                                    {wf.webhook}
                                </code>
                            </div>
                            <div style={{ color: '#555', fontSize: '11px', flexShrink: 0 }}>{wf.file}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Setup Guide */}
            <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#f59e0b' }}>
                    Configuración requerida
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {setupSteps.map((s) => (
                        <div
                            key={s.step}
                            style={{
                                background: '#111',
                                border: '1px solid #1e1e1e',
                                borderRadius: '10px',
                                padding: '16px 20px',
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'flex-start',
                            }}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#f59e0b22',
                                border: '1px solid #f59e0b55',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#f59e0b',
                                flexShrink: 0,
                            }}>
                                {s.step}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{s.title}</div>
                                <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>{s.description}</div>
                                <pre style={{
                                    fontSize: '12px',
                                    background: '#0a0a0a',
                                    border: '1px solid #222',
                                    borderRadius: '6px',
                                    padding: '8px 12px',
                                    color: '#00c864',
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}>
                                    {s.code}
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer note */}
            <div style={{ marginTop: '40px', padding: '16px 20px', background: '#0066FF11', border: '1px solid #0066FF33', borderRadius: '10px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>
                    <span style={{ color: '#0066FF', fontWeight: 600 }}>Flujo completo: </span>
                    Instagram DM/Comentario con keyword → Lead automático → Deal Intelligence score → Si score ≥ 60: pipeline a{' '}
                    <code style={{ color: '#00E5FF', background: '#00E5FF11', padding: '1px 5px', borderRadius: '3px' }}>lead_calificado</code>{' '}
                    + propuesta generada en 30 min → Secuencias email/WhatsApp → 0 trabajo manual
                </p>
            </div>
        </div>
    );
}
