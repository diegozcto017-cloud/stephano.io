'use client';

import { useState } from 'react';
import { getAdminApiKey } from '@/server/actions/auth.action';

/* ─── Industrias con oferta específica ─── */
const INDUSTRIES = [
    { label: 'Restaurante / Soda', emoji: '🍽️', precio: '$49/mes', tag: 'Menú QR + Reservas + POS' },
    { label: 'Salón de Belleza', emoji: '💆', precio: '$29/mes', tag: 'Agenda 24/7 + Recordatorio WA' },
    { label: 'Uñas / Nail Art', emoji: '💅', precio: '$29/mes', tag: 'Agenda + Link en bio Instagram' },
    { label: 'Peluquería / Barbería', emoji: '✂️', precio: '$29/mes', tag: 'Agenda online + Historial cliente' },
    { label: 'Clínica Dental', emoji: '🦷', precio: '$69/mes', tag: 'Expediente digital + Agenda + WA' },
    { label: 'Médico / Clínica', emoji: '🏥', precio: '$79/mes', tag: 'Expediente + Recetas + Agenda' },
    { label: 'Gimnasio / Fitness', emoji: '🏋️', precio: '$39/mes', tag: 'Membresías + Acceso QR + Clases' },
    { label: 'Tienda / Pulpería', emoji: '🛍️', precio: '$35/mes', tag: 'POS + Inventario + Facturación' },
    { label: 'Farmacia', emoji: '💊', precio: '$49/mes', tag: 'Medicamentos + Stock + POS' },
    { label: 'Hotel / Hostal', emoji: '🏨', precio: '$59/mes', tag: 'Reservas online + Disponibilidad' },
    { label: 'Otro', emoji: '🌐', precio: 'desde $300', tag: 'Web profesional + WhatsApp' },
];

function parseHandle(raw: string): string {
    if (raw.includes('instagram.com/')) {
        const parts = raw.split('instagram.com/')[1].split('/')[0].split('?')[0];
        return parts.startsWith('@') ? parts : `@${parts}`;
    }
    return raw.startsWith('@') ? raw : `@${raw}`;
}

/* ─── Estilos base ─── */
const s = {
    input: {
        background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: 10,
        padding: '0.7rem 1rem', color: '#fff', fontSize: '0.875rem',
        outline: 'none', width: '100%', boxSizing: 'border-box' as const,
    },
    card: {
        background: '#111118', border: '1px solid #1E1E2E',
        borderRadius: 16, padding: '1.5rem',
    },
};

/* ─── Plantillas estáticas de llamada por industria ─── */
const CALL_TEMPLATES: Record<string, {
    opening: string; painQuestion: string; solution: string; objection: string; close: string;
}> = {
    'Restaurante / Soda': {
        opening: 'Buenas, ¿hablo con el encargado de [NEGOCIO]? Soy Diego de Stephano.io, somos una agencia de software en Costa Rica especializada en sistemas para restaurantes.',
        painQuestion: '¿Actualmente cómo manejan los pedidos de mesa y las reservaciones? ¿Todo en papel o WhatsApp?',
        solution: 'Lo que hacemos es un sistema completo: menú QR para que los clientes escaneen desde el celular y vean el menú actualizado, sistema de reservaciones en línea 24 horas, y comandas digitales que van directo a cocina. Todo por $49 al mes.',
        objection: 'Entiendo que ya tienen su manera de trabajar. El menú QR elimina los costos de impresión y cuando cambian un precio, lo actualizan en segundos desde el celular. Varios restaurantes en la zona ya lo tienen.',
        close: '¿Le puedo mandar un link para que vea cómo queda el menú de otro restaurante nuestro? ¿Me da su WhatsApp para enviárselo ahora?',
    },
    'Salón de Belleza': {
        opening: 'Buenas, ¿hablo con quien atiende en [NEGOCIO]? Soy Diego de Stephano.io, trabajamos con salones de belleza y spas en Costa Rica.',
        painQuestion: '¿Cómo agendan las citas actualmente? ¿Por WhatsApp o llamada? ¿Les pasa que clientas olvidan y no avisan?',
        solution: 'Tenemos un sistema de $29 al mes que pone un link de agenda en el Instagram del salón. Las clientas reservan solas, eligen estilista y servicio, y reciben recordatorio automático por WhatsApp 24 horas antes. Los no-shows bajan hasta un 60%.',
        objection: 'No requiere aprender nada complicado. Nosotros lo configuramos, capacitamos al equipo en una hora y queda funcionando. El link de agenda va directo en el bio del Instagram.',
        close: '¿Me da su número para mandarle un video de cómo funciona? Son 2 minutos y puede verlo ahorita mismo.',
    },
    'Uñas / Nail Art': {
        opening: 'Hola, ¿hablo con quien maneja el negocio de uñas en [NEGOCIO]? Soy Diego de Stephano.io, trabajo con nail studios acá en Costa Rica.',
        painQuestion: '¿Cómo manejan las reservas? ¿Por Instagram o WhatsApp directamente? ¿Se les complica responder todos los mensajes rápido?',
        solution: 'Sistema de $29 al mes con botón de reserva en tu Instagram. Las clientas eligen el servicio, fecha y hora disponible — y no tenés que hacer nada. El sistema les confirma y les recuerda por WhatsApp automáticamente.',
        objection: 'No cambiás nada de cómo trabajás. Solo agregás el link de agenda al bio de Instagram. Las clientas que ya te siguen empiezan a reservar solas desde el primer día.',
        close: '¿Te puedo mandar un ejemplo de cómo quedaría tu agenda? Dame tu WhatsApp y te lo mando ahora.',
    },
    'Peluquería / Barbería': {
        opening: 'Buenas, ¿habló con el dueño de [NEGOCIO]? Soy Diego de Stephano, hacemos sistemas de agenda para barberías en Costa Rica.',
        painQuestion: '¿Cómo coordinan las citas? ¿Por WhatsApp? ¿Cuánto tiempo al día gastan respondiendo "¿hay campo a las 3?"',
        solution: 'Sistema donde los clientes ven tu disponibilidad en tiempo real y reservan solos. Vos solo ves tu agenda ordenada. Si alguien no viene, el sistema le mandó recordatorio. Todo por $29 al mes.',
        objection: 'El link queda en tu Instagram para que reserven sin que vos tengás que contestar nada. En una semana notás la diferencia.',
        close: '¿Cuándo tenés 15 minutos esta semana para que te lo muestre? Puede ser por Zoom o presencial.',
    },
    'Clínica Dental': {
        opening: 'Buenos días, ¿hablo con la recepción de [NEGOCIO]? Soy Diego de Stephano.io, desarrollamos software específico para clínicas odontológicas en Costa Rica.',
        painQuestion: '¿Cómo manejan los expedientes y la agenda? ¿En papel, Excel, o tienen algún sistema?',
        solution: 'Sistema completo desde $69 al mes: agenda digital por dentista y sillón, expediente con odontograma digital, plan de tratamiento con presupuesto para el paciente, y recordatorios automáticos por WhatsApp. Pacientes también pueden agendar online.',
        objection: 'La migración la hacemos nosotros. En menos de una semana tienen todo funcionando y el equipo capacitado. No se pierde ningún dato.',
        close: '¿Hay un momento esta semana donde pueda mostrarle el sistema al doctor? Son 20 minutos y queda con el demo completo.',
    },
    'Médico / Clínica': {
        opening: 'Buenos días, ¿habló con el área administrativa de [NEGOCIO]? Soy Diego de Stephano, tenemos software de gestión médica para clínicas en Costa Rica.',
        painQuestion: '¿Cómo manejan actualmente los expedientes y la agenda médica? ¿Tienen sistema o es manual?',
        solution: 'Sistema desde $79 al mes: expediente clínico completo, recetas digitales con firma del médico, agenda que los pacientes pueden consultar online, y facturación integrada. Sin servidores locales, todo en la nube.',
        objection: 'Cumplimos con estándares de privacidad de datos médicos. Lo hemos implementado en clínicas similares y la curva de aprendizaje es muy rápida.',
        close: '¿Le puedo agendar una demo de 30 minutos con el médico encargado esta semana? Sin compromiso, solo para que vean el sistema.',
    },
    'Gimnasio / Fitness': {
        opening: 'Buenas, ¿hablo con quien administra [NEGOCIO]? Soy Diego de Stephano, hacemos sistemas de gestión para gimnasios en Costa Rica.',
        painQuestion: '¿Cómo controlan las membresías y el acceso? ¿Saben exactamente quién debe, quién venció y quién está al día?',
        solution: 'Sistema completo desde $39 al mes: control de acceso con código QR en el celular del socio, cobros automáticos cada mes, y agenda de clases donde los socios reservan su espacio desde la app.',
        objection: 'Se integra con torniquete si tienen uno. Si no, el control es por QR que el staff valida. La implementación es de una semana.',
        close: '¿Me da su WhatsApp para mandarle un video de cómo funciona el control de acceso? Son 3 minutos.',
    },
    'Tienda / Pulpería': {
        opening: 'Buenas, ¿hablo con el dueño de [NEGOCIO]? Soy Diego de Stephano, hacemos sistemas de punto de venta para tiendas en Costa Rica.',
        painQuestion: '¿Cómo controlan el inventario? ¿Saben qué tienen en stock sin tener que ir a revisar físicamente?',
        solution: 'Sistema de $35 al mes que convierte cualquier tablet en un punto de venta: escanea códigos de barras, controla inventario en tiempo real, avisa cuando hay que reponer, y el cierre de caja en un clic con reporte del día.',
        objection: 'No se necesita hardware especial. Funciona en el celular, tablet o computadora que ya tienen. Lo configuramos con su inventario actual en un día.',
        close: '¿Cuándo puedo ir por la tienda 30 minutos para mostrarles cómo funciona en vivo?',
    },
    'Farmacia': {
        opening: 'Buenos días, ¿hablo con quien maneja la farmacia [NEGOCIO]? Soy Diego de Stephano, desarrollamos sistemas específicos para farmacias en Costa Rica.',
        painQuestion: '¿Cómo controlan las caducidades de medicamentos y el inventario? ¿Tienen sistema o es manual?',
        solution: 'Sistema de $49 al mes con alertas automáticas de stock mínimo y caducidades próximas. Busca medicamentos por nombre, código o principio activo, y lleva historial de cada cliente.',
        objection: 'Sistema en la nube, sin instalaciones complicadas. Funciona en cualquier computadora o tablet.',
        close: '¿Puedo coordinar una demo de 20 minutos con usted esta semana?',
    },
    'Hotel / Hostal': {
        opening: 'Buenas, ¿hablo con recepción de [NEGOCIO]? Soy Diego de Stephano, trabajamos con hoteles y hostales en Costa Rica.',
        painQuestion: '¿Cómo gestionan las reservas actualmente? ¿Les ha pasado que se sobrevenda una habitación por manejar varios canales?',
        solution: 'Sistema desde $59 al mes: cuando alguien reserva desde cualquier canal, la disponibilidad se actualiza sola. Los huéspedes reciben confirmación automática y recordatorio antes de llegar.',
        objection: 'Se puede integrar con Booking.com y Airbnb para sincronizar disponibilidad automáticamente.',
        close: '¿Cuándo tiene 30 minutos para ver una demo del sistema con su equipo de recepción?',
    },
    'Otro': {
        opening: 'Buenas, ¿hablo con quien maneja [NEGOCIO]? Soy Diego de Stephano.io, somos una agencia de software en Costa Rica.',
        painQuestion: '¿Tienen sitio web actualmente? ¿Cómo los encuentran los clientes nuevos?',
        solution: 'Desarrollamos su presencia digital desde $300: diseño profesional, aparecen en Google, los clientes los contactan directo por WhatsApp desde la página, y tienen un panel para actualizarla.',
        objection: 'Nosotros nos encargamos de todo. Usted nos da los detalles del negocio y en 2 semanas tiene su sitio funcionando.',
        close: '¿Le puedo mandar ejemplos de trabajos similares? Dame su WhatsApp.',
    },
};

/* ─── Componente principal ─── */
export default function OutreachPage() {
    const [activeTab, setActiveTab] = useState<'dm' | 'call' | 'templates'>('dm');
    const [handle, setHandle] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [industry, setIndustry] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{
        dm: string; hook: string; handle: string; industryKey?: string;
        offer?: { precio: string; modulos: string[]; callScript: Record<string, string> };
    } | null>(null);
    const [editedDm, setEditedDm] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const selectedIndustry = INDUSTRIES.find(i => i.label === industry);
    const callTemplate = CALL_TEMPLATES[industry] || CALL_TEMPLATES['Otro'];

    async function handleGenerate() {
        if (!handle.trim() && !businessName.trim()) return;
        setLoading(true);
        setResult(null);
        setCopied(null);
        try {
            const apiKey = await getAdminApiKey();
            const cleanHandle = handle.trim() ? parseHandle(handle.trim()) : '';
            const res = await fetch('/api/leads/dm-pitch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-admin-key': apiKey || '' },
                body: JSON.stringify({
                    handle: cleanHandle,
                    businessName: businessName.trim() || cleanHandle.replace('@', ''),
                    industry, bio: bio.trim(),
                }),
            });
            const data = await res.json();
            if (data.success) { setResult(data); setEditedDm(data.dm); setActiveTab('dm'); }
        } catch { /* silent */ } finally { setLoading(false); }
    }

    function copyAndOpen() {
        const cleanHandle = handle.trim() ? parseHandle(handle.trim()).replace('@', '') : '';
        navigator.clipboard.writeText(editedDm).then(() => {
            setCopied('dm');
            setTimeout(() => {
                const igUrl = cleanHandle
                    ? `https://www.instagram.com/${cleanHandle}/`
                    : 'https://www.instagram.com/direct/inbox/';
                window.open(igUrl, '_blank');
            }, 400);
        });
    }

    function copyText(text: string, key: string) {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key);
            setTimeout(() => setCopied(null), 2000);
        });
    }

    const tabStyle = (tab: string) => ({
        padding: '0.5rem 1.25rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.8rem',
        fontWeight: 600, transition: 'all 0.15s',
        background: activeTab === tab ? 'linear-gradient(135deg, #E1306C, #F77737)' : '#1E1E2E',
        color: activeTab === tab ? '#fff' : '#666',
    });

    return (
        <div style={{ minHeight: '100vh', background: '#0A0A0F', padding: '2rem', fontFamily: 'system-ui', maxWidth: 760, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #E1306C, #F77737)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>Outreach & Pitch</h1>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#555' }}>DMs personalizados por industria + guión de llamada + plantillas</p>
                </div>
            </div>

            {/* Formulario de datos */}
            <div style={{ ...s.card, marginBottom: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#666', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Handle o URL de Instagram</label>
                        <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="@negocio o instagram.com/..." style={s.input} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#666', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Nombre del negocio</label>
                        <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Ej: Soda La Abuela" style={s.input} />
                    </div>
                </div>

                {/* Selector de industria con preview */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Tipo de negocio</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {INDUSTRIES.map(ind => (
                            <button
                                key={ind.label}
                                onClick={() => setIndustry(ind.label)}
                                style={{
                                    padding: '0.4rem 0.8rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                                    border: industry === ind.label ? '1px solid #E1306C' : '1px solid #2A2A3E',
                                    background: industry === ind.label ? 'rgba(225,48,108,0.12)' : '#0A0A0F',
                                    color: industry === ind.label ? '#E1306C' : '#666',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {ind.emoji} {ind.label}
                            </button>
                        ))}
                    </div>
                    {selectedIndustry && (
                        <div style={{ marginTop: 8, padding: '0.5rem 0.75rem', background: 'rgba(225,48,108,0.06)', border: '1px solid rgba(225,48,108,0.15)', borderRadius: 8, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: '#E1306C', fontWeight: 700 }}>{selectedIndustry.precio}</span>
                            <span style={{ fontSize: '0.75rem', color: '#888' }}>{selectedIndustry.tag}</span>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#666', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>Bio del perfil (opcional)</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Pégá la bio de Instagram para personalizar mejor el pitch" rows={2} style={{ ...s.input, resize: 'vertical' }} />
                </div>

                <button onClick={handleGenerate} disabled={loading || (!handle.trim() && !businessName.trim())}
                    style={{ width: '100%', background: loading ? '#1E1E2E' : 'linear-gradient(135deg, #E1306C, #F77737)', border: 'none', borderRadius: 10, padding: '0.8rem', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? '⚡ Generando pitch personalizado...' : '⚡ Generar DM con IA'}
                </button>
            </div>

            {/* Tabs de resultado */}
            {(result || industry) && (
                <div style={{ ...s.card }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <button style={tabStyle('dm')} onClick={() => setActiveTab('dm')}>📲 DM Instagram</button>
                        <button style={tabStyle('call')} onClick={() => setActiveTab('call')}>📞 Guión de Llamada</button>
                        <button style={tabStyle('templates')} onClick={() => setActiveTab('templates')}>📋 Todas las Plantillas</button>
                    </div>

                    {/* ── TAB: DM Instagram ── */}
                    {activeTab === 'dm' && (
                        <div>
                            {result ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#E1306C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>DM generado — {result.handle}</span>
                                        {result.offer && <span style={{ fontSize: '0.75rem', color: '#00c864', fontWeight: 700 }}>{result.offer.precio}</span>}
                                    </div>

                                    {/* Módulos ofrecidos */}
                                    {result.offer?.modulos && (
                                        <div style={{ background: '#0a1a0a', border: '1px solid #1a3a1a', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
                                            <div style={{ fontSize: '0.65rem', color: '#4a8a4a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Lo que se ofrece en este pitch</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                {result.offer.modulos.map((m, i) => (
                                                    <span key={i} style={{ fontSize: '0.7rem', background: 'rgba(0,200,100,0.08)', border: '1px solid rgba(0,200,100,0.2)', borderRadius: 4, padding: '2px 8px', color: '#aaa' }}>{m}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Preview editable */}
                                    <div style={{ background: '#0A0A0F', border: '1px solid #2A2A3E', borderRadius: 10, padding: '1rem', marginBottom: '0.75rem' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 6 }}>De: <span style={{ color: '#E1306C' }}>@stephano.io</span> → {result.handle}</div>
                                        <textarea value={editedDm} onChange={e => setEditedDm(e.target.value)} rows={6}
                                            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: '#e0e0e0', fontSize: '0.875rem', lineHeight: 1.6, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'system-ui' }} />
                                    </div>

                                    {/* Gancho de seguimiento */}
                                    <div style={{ background: '#0a0a1a', border: '1px solid #1e1e3a', borderRadius: 8, padding: '0.6rem 0.9rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '0.65rem', color: '#6666aa', textTransform: 'uppercase', letterSpacing: 1 }}>Seguimiento (24h): </span>
                                        <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{result.hook}</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button onClick={copyAndOpen} style={{ flex: 2, background: 'linear-gradient(135deg, #E1306C, #F77737)', border: 'none', borderRadius: 10, padding: '0.75rem', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>
                                            {copied === 'dm' ? 'Copiado — abriendo Instagram...' : 'Copiar y abrir Instagram'}
                                        </button>
                                        <button onClick={() => copyText(editedDm, 'dm-only')} style={{ flex: 1, background: '#1E1E2E', border: '1px solid #2A2A3E', borderRadius: 10, padding: '0.75rem', color: '#888', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                                            {copied === 'dm-only' ? '✓ Copiado' : '📋 Solo copiar'}
                                        </button>
                                    </div>
                                    <p style={{ margin: '0.75rem 0 0', fontSize: '0.7rem', color: '#444', textAlign: 'center' }}>
                                        Se copia → Instagram abre en el perfil → pegás con Ctrl+V en el DM
                                    </p>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#555', fontSize: '0.875rem' }}>
                                    Completá el formulario arriba y generá el DM para ver el resultado aquí.
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── TAB: Guión de Llamada ── */}
                    {activeTab === 'call' && (
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '1rem' }}>
                                Guión para llamar a: <strong style={{ color: '#fff' }}>{businessName || handle || '[NEGOCIO]'}</strong>
                                {selectedIndustry && <span style={{ marginLeft: 8, color: '#E1306C', fontWeight: 700 }}>{selectedIndustry.emoji} {selectedIndustry.label} — {selectedIndustry.precio}</span>}
                            </div>

                            {[
                                { key: 'opening', label: '1 — Apertura', color: '#0066FF', icon: '👋' },
                                { key: 'painQuestion', label: '2 — Pregunta de dolor', color: '#f59e0b', icon: '🎯' },
                                { key: 'solution', label: '3 — Presentar la solución', color: '#00c864', icon: '💡' },
                                { key: 'objection', label: '4 — Manejar objeción', color: '#a855f7', icon: '🛡️' },
                                { key: 'close', label: '5 — Cierre', color: '#E1306C', icon: '🤝' },
                            ].map(step => {
                                const scriptSource = result?.offer?.callScript || callTemplate;
                                const text = (scriptSource as Record<string, string>)[step.key]
                                    ?.replace(/\[NEGOCIO\]/g, businessName || handle || '[NEGOCIO]') || '';
                                return (
                                    <div key={step.key} style={{ marginBottom: '0.75rem', border: `1px solid ${step.color}22`, borderRadius: 10, overflow: 'hidden' }}>
                                        <div style={{ background: `${step.color}11`, padding: '0.5rem 0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: step.color }}>{step.icon} {step.label}</span>
                                            <button onClick={() => copyText(text, step.key)} style={{ background: copied === step.key ? `${step.color}22` : 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4 } as React.CSSProperties}>
                                                {copied === step.key ? '✓ copiado' : '📋 copiar'}
                                            </button>
                                        </div>
                                        <div style={{ padding: '0.75rem 0.9rem', fontSize: '0.85rem', color: '#ddd', lineHeight: 1.6 }}>
                                            {text}
                                        </div>
                                    </div>
                                );
                            })}

                            <button onClick={() => {
                                const scriptSource = result?.offer?.callScript || callTemplate;
                                const name = businessName || handle || '[NEGOCIO]';
                                const full = Object.entries(scriptSource).map(([, v]) => v.replace(/\[NEGOCIO\]/g, name)).join('\n\n');
                                copyText(full, 'fullscript');
                            }}
                                style={{ width: '100%', background: '#1E1E2E', border: '1px solid #2A2A3E', borderRadius: 10, padding: '0.7rem', color: '#888', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginTop: 4 }}>
                                {copied === 'fullscript' ? '✓ Guión completo copiado' : '📋 Copiar guión completo'}
                            </button>
                        </div>
                    )}

                    {/* ── TAB: Todas las Plantillas ── */}
                    {activeTab === 'templates' && (
                        <div>
                            <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '1.25rem' }}>
                                Plantillas de DM y guión de llamada listas para cada industria. Haz clic en una sección para copiarla.
                            </p>
                            {INDUSTRIES.filter(i => i.label !== 'Otro').map(ind => {
                                const tmpl = CALL_TEMPLATES[ind.label] || CALL_TEMPLATES['Otro'];
                                const name = businessName || '[NEGOCIO]';
                                const dmTemplate = `¡Hola! Vi tu perfil de Instagram de ${name} y me llamó la atención. Noté que no tienen ${ind.label === 'Restaurante / Soda' ? 'menú digital ni sistema de reservas online' : ind.label.includes('Salón') || ind.label.includes('Uñas') || ind.label.includes('Barbería') ? 'agenda online — sus clientas tienen que escribirles para reservar' : 'sistema digital propio'}, lo que puede hacerles perder clientes. En Stephano.io tenemos ${ind.tag.toLowerCase()} desde ${ind.precio}. ${ind.label === 'Restaurante / Soda' ? '¿Les gustaría ver cómo funciona el menú QR en 5 minutos?' : '¿Les interesa saber cómo funciona?'} Diego | Stephano.io`;
                                return (
                                    <div key={ind.label} style={{ border: '1px solid #1E1E2E', borderRadius: 10, marginBottom: '0.75rem', overflow: 'hidden' }}>
                                        <div style={{ background: '#16161f', padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{ind.emoji} {ind.label}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#00c864', fontWeight: 700 }}>{ind.precio}</span>
                                        </div>
                                        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div>
                                                <div style={{ fontSize: '0.65rem', color: '#E1306C', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>DM Base</div>
                                                <div style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: 1.5, background: '#0A0A0F', borderRadius: 6, padding: '0.5rem 0.75rem' }}>{dmTemplate}</div>
                                                <button onClick={() => copyText(dmTemplate.replace(/\[NEGOCIO\]/g, name), `dm-${ind.label}`)}
                                                    style={{ marginTop: 4, background: 'none', border: '1px solid #2A2A3E', borderRadius: 6, padding: '3px 10px', color: '#555', cursor: 'pointer', fontSize: '0.7rem' }}>
                                                    {copied === `dm-${ind.label}` ? '✓ Copiado' : '📋 Copiar DM'}
                                                </button>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.65rem', color: '#0066FF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Apertura de llamada</div>
                                                <div style={{ fontSize: '0.8rem', color: '#aaa', lineHeight: 1.5, background: '#0A0A0F', borderRadius: 6, padding: '0.5rem 0.75rem' }}>
                                                    {tmpl.opening.replace(/\[NEGOCIO\]/g, name)}
                                                </div>
                                                <button onClick={() => copyText(tmpl.opening.replace(/\[NEGOCIO\]/g, name), `call-${ind.label}`)}
                                                    style={{ marginTop: 4, background: 'none', border: '1px solid #2A2A3E', borderRadius: 6, padding: '3px 10px', color: '#555', cursor: 'pointer', fontSize: '0.7rem' }}>
                                                    {copied === `call-${ind.label}` ? '✓ Copiado' : '📋 Copiar apertura'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
