'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';
import { getAdminApiKey } from '@/server/actions/auth.action';

interface Lead {
    id: number;
    nombre: string;
    empresa: string | null;
    email: string;
    telefono: string | null;
    tipo_proyecto: string;
    presupuesto_rango: string | null;
    urgencia: string | null;
    mensaje: string | null;
    estado: string;
    progreso: number;
    url_proyecto: string | null;
    notas_internas: string | null;
    fecha_creacion: string;
    fecha_actualizacion: string;
}

export default function ClienteDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ estado: '', progreso: 0, url_proyecto: '', telefono: '', notas_internas: '' });

    useEffect(() => {
        const fetchDatos = async () => {
            const apiKey = await getAdminApiKey();
            const res = await fetch('/api/leads', { headers: { 'x-admin-key': apiKey || '' } });
            const data = await res.json();
            if (data.success) {
                const found = data.data.find((l: Lead) => l.id === Number(params.id));
                if (found) {
                    setLead(found);
                    setForm({
                        estado: found.estado,
                        progreso: found.progreso,
                        url_proyecto: found.url_proyecto || '',
                        telefono: found.telefono || '',
                        notas_internas: found.notas_internas || '',
                    });
                }
            }
            setLoading(false);
        };
        fetchDatos();
    }, [params.id]);

    const handleSave = async () => {
        if (!lead) return;
        setSaving(true);
        const apiKey = await getAdminApiKey();
        const res = await fetch('/api/leads', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-admin-key': apiKey || '' },
            body: JSON.stringify({ id: lead.id, ...form }),
        });
        const data = await res.json();
        if (data.success) {
            setLead({ ...lead, ...form });
            setEditing(false);
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!lead || !confirm('¿Eliminar este lead permanentemente?')) return;
        const apiKey = await getAdminApiKey();
        await fetch(`/api/leads?id=${lead.id}`, { method: 'DELETE', headers: { 'x-admin-key': apiKey || '' } });
        router.push('/admin/clientes');
    };

    const openWhatsApp = () => {
        if (!lead) return;
        const msg = encodeURIComponent(`Hola ${lead.nombre}, soy del equipo de Stephano. Me comunico respecto a tu proyecto de ${lead.tipo_proyecto}. ¿Tienes un momento para conversar?`);
        window.open(`https://wa.me/?text=${msg}`, '_blank');
    };

    const sendEmail = async () => {
        if (!lead) return;
        const subject = encodeURIComponent(`Stephano — Seguimiento de tu proyecto`);
        const body = encodeURIComponent(`Hola ${lead.nombre},\n\nGracias por contactar a Stephano. Nos gustaría dar seguimiento a tu solicitud de ${lead.tipo_proyecto}.\n\n¿Tienes disponibilidad para una breve llamada esta semana?\n\nSaludos,\nEquipo Stephano`);
        window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
    };

    if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>;
    if (!lead) return <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Lead no encontrado</div>;

    const statusLabels: Record<string, string> = {
        nuevo: 'Nuevo', en_progreso: 'En Progreso', completado: 'Completado', cancelado: 'Cancelado',
    };
    const statusClass: Record<string, string> = {
        nuevo: styles.badgeNuevo, en_progreso: styles.badgeEnProgreso, completado: styles.badgeCompletado, cancelado: styles.badgeCancelado,
    };

    return (
        <>
            <div style={{ marginBottom: '24px' }}>
                <Link href="/admin/clientes" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                    ← Volver a Clientes
                </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 className={styles.adminPageTitle}>{lead.nombre}</h1>
                    <p className={styles.adminPageDesc}>{lead.empresa || 'Sin empresa'} · {lead.email}</p>
                </div>
                <span className={statusClass[lead.estado] || styles.badge}>{statusLabels[lead.estado] || lead.estado}</span>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionBar} style={{ marginBottom: '32px' }}>
                <button onClick={() => setEditing(!editing)} className={styles.btnPrimary}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    {editing ? 'Cancelar' : 'Editar'}
                </button>
                <Link href={`/admin/documentos/bienvenida?clientId=${lead.id}&nombre=${encodeURIComponent(lead.nombre)}&email=${encodeURIComponent(lead.email)}&proyecto=${encodeURIComponent(lead.tipo_proyecto)}`} className={styles.btnGhost}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    Dar Bienvenida
                </Link>
                <Link href={`/admin/documentos/contrato?clientId=${lead.id}&nombre=${encodeURIComponent(lead.nombre)}&email=${encodeURIComponent(lead.email)}&empresa=${encodeURIComponent(lead.empresa || '')}&proyecto=${encodeURIComponent(lead.tipo_proyecto)}`} className={styles.btnGhost}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    Crear Contrato
                </Link>
                <Link href={`/admin/documentos/uso-contenido?clientId=${lead.id}&nombre=${encodeURIComponent(lead.nombre)}`} className={styles.btnGhost}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                    Guía de Contenido
                </Link>
                <Link href={`/admin/documentos/reporte-mensual?clientId=${lead.id}&nombre=${encodeURIComponent(lead.nombre)}`} className={styles.btnGhost}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                    Enviar Reporte
                </Link>
                <Link href={`/admin/documentos/factura?clientId=${lead.id}&nombre=${encodeURIComponent(lead.nombre)}&email=${encodeURIComponent(lead.email)}&empresa=${encodeURIComponent(lead.empresa || '')}`} className={styles.btnGhost}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    Crear Factura
                </Link>
                <button onClick={sendEmail} className={styles.btnGhost}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    Email
                </button>
                <Link href={`/admin/documentos/gracias?clientId=${lead.id}&nombre=${encodeURIComponent(lead.nombre)}`} className={styles.btnGhost}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    Dar Gracias
                </Link>
                <button onClick={openWhatsApp} className={styles.btnWhatsapp}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    WhatsApp
                </button>
                {lead.url_proyecto && (
                    <a href={lead.url_proyecto} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary} style={{ background: 'var(--gradient-primary)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        Visitar Sitio
                    </a>
                )}
                <Link
                    href={`/admin/ads?prefill=${encodeURIComponent(`Anuncio de Stephano.io para ${lead.tipo_proyecto} — cliente objetivo: ${lead.empresa || lead.nombre}. Incluye precio del catálogo Stephano para ${lead.tipo_proyecto}, CTA: visita stephano.io o contáctanos`)}`}
                    className={styles.btnPrimary}
                    style={{ background: 'linear-gradient(135deg, #0066FF, #00E5FF)' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    Generar Anuncio
                </Link>
                <button onClick={handleDelete} className={styles.btnDanger}>
                    Eliminar
                </button>
            </div>

            {/* Edit Form */}
            {editing && (
                <div className={styles.detailCard} style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Editar Estado</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label className={styles.detailLabel}>Estado</label>
                            <select className={styles.adminSelect} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                                <option value="nuevo">Nuevo</option>
                                <option value="en_progreso">En Progreso</option>
                                <option value="completado">Completado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Progreso ({form.progreso}%)</label>
                            <input type="range" min="0" max="100" value={form.progreso}
                                onChange={(e) => setForm({ ...form, progreso: Number(e.target.value) })}
                                style={{ width: '100%', accentColor: '#0066FF' }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label className={styles.detailLabel}>URL del Proyecto</label>
                        <input type="text" className={styles.adminInput} value={form.url_proyecto}
                            onChange={(e) => setForm({ ...form, url_proyecto: e.target.value })}
                            placeholder="https://su-sitio-web.com" />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label className={styles.detailLabel}>Teléfono / WhatsApp</label>
                        <input type="tel" className={styles.adminInput} value={form.telefono}
                            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                            placeholder="+506 0000-0000" />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label className={styles.detailLabel}>Notas Internas</label>
                        <textarea className={styles.adminTextarea} value={form.notas_internas}
                            onChange={(e) => setForm({ ...form, notas_internas: e.target.value })}
                            placeholder="Notas privadas sobre este cliente..." />
                    </div>
                    <button onClick={handleSave} className={styles.btnSuccess} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            )}

            {/* Client Details */}
            <div className={styles.detailGrid}>
                <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Tipo de Proyecto</div>
                    <div className={styles.detailValue}>{lead.tipo_proyecto}</div>
                </div>
                <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Presupuesto</div>
                    <div className={styles.detailValue}>{lead.presupuesto_rango || 'No especificado'}</div>
                </div>
                <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Email</div>
                    <div className={styles.detailValue}>{lead.email}</div>
                </div>
                <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Teléfono</div>
                    <div className={styles.detailValue}>
                        {lead.telefono ? (
                            <a href={`https://wa.me/${lead.telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                {lead.telefono}
                            </a>
                        ) : 'No definido'}
                    </div>
                </div>
                <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>URL del Proyecto</div>
                    <div className={styles.detailValue}>
                        {lead.url_proyecto ? (
                            <a href={lead.url_proyecto} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                                {lead.url_proyecto}
                            </a>
                        ) : (
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                                No definida{' '}
                                <button
                                    onClick={() => setEditing(true)}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline', padding: 0 }}
                                >
                                    (Agregar)
                                </button>
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Progreso</div>
                    <div className={styles.detailValue}>
                        {lead.progreso}%
                        <div style={{ marginTop: '8px', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${lead.progreso}%`, background: 'linear-gradient(90deg, #0066FF, #00E5FF)', borderRadius: '3px', transition: 'width 0.5s' }} />
                        </div>
                    </div>
                </div>
                {lead.mensaje && (
                    <div className={styles.detailCardFull}>
                        <div className={styles.detailLabel}>Mensaje del Cliente</div>
                        <div className={styles.detailValue} style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>{lead.mensaje}</div>
                    </div>
                )}
                {lead.notas_internas && (
                    <div className={styles.detailCardFull}>
                        <div className={styles.detailLabel}>Notas Internas</div>
                        <div className={styles.detailValue} style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>{lead.notas_internas}</div>
                    </div>
                )}
                <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Fecha de Creación</div>
                    <div className={styles.detailValue}>{new Date(lead.fecha_creacion).toLocaleString('es')}</div>
                </div>
                <div className={styles.detailCard}>
                    <div className={styles.detailLabel}>Última Actualización</div>
                    <div className={styles.detailValue}>{new Date(lead.fecha_actualizacion).toLocaleString('es')}</div>
                </div>
            </div>
        </>
    );
}
