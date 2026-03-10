'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/admin.module.css';
import { getAdminApiKey } from '@/server/actions/auth.action';

interface Lead {
    id: number;
    nombre: string;
    empresa: string | null;
    email: string;
    tipo_proyecto: string;
    estado: string;
    progreso: number;
    fecha_creacion: string;
}

function getStatusBadge(estado: string) {
    const map: Record<string, string> = {
        nuevo: styles.badgeNuevo,
        en_progreso: styles.badgeEnProgreso,
        completado: styles.badgeCompletado,
        cancelado: styles.badgeCancelado,
    };
    const labels: Record<string, string> = {
        nuevo: 'Nuevo',
        en_progreso: 'En Progreso',
        completado: 'Completado',
        cancelado: 'Cancelado',
    };
    return <span className={map[estado] || styles.badge}>{labels[estado] || estado}</span>;
}

export default function ClientesPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filtered, setFiltered] = useState<Lead[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            const apiKey = await getAdminApiKey();
            const res = await fetch('/api/leads', { headers: { 'x-admin-key': apiKey || '' } });
            const data = await res.json();
            if (data.success) {
                setLeads(data.data);
                setFiltered(data.data);
            }
            setLoading(false);
        };
        fetchDatos();
    }, []);

    useEffect(() => {
        let result = leads;
        if (statusFilter !== 'all') {
            result = result.filter(l => l.estado === statusFilter);
        }
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(l =>
                l.nombre.toLowerCase().includes(q) ||
                l.email.toLowerCase().includes(q) ||
                (l.empresa && l.empresa.toLowerCase().includes(q))
            );
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFiltered(result);
    }, [search, statusFilter, leads]);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Seguro que deseas eliminar este lead?')) return;
        const apiKey = await getAdminApiKey();
        const res = await fetch(`/api/leads?id=${id}`, { method: 'DELETE', headers: { 'x-admin-key': apiKey || '' } });
        if (res.ok) setLeads(prev => prev.filter(l => l.id !== id));
    };

    if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Cargando...</div>;

    return (
        <>
            <div className={styles.adminPageHeader}>
                <h1 className={styles.adminPageTitle}>Clientes</h1>
                <p className={styles.adminPageDesc}>{leads.length} leads registrados</p>
            </div>

            <div className={styles.searchBar}>
                <input
                    className={styles.searchInput}
                    placeholder="Buscar por nombre, email o empresa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className={styles.adminSelect} style={{ maxWidth: '200px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Todos</option>
                    <option value="nuevo">Nuevos</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completado">Completados</option>
                    <option value="cancelado">Cancelados</option>
                </select>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Empresa</th>
                            <th>Email</th>
                            <th>Proyecto</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((lead) => (
                            <tr key={lead.id}>
                                <td style={{ fontWeight: 500, color: '#fff' }}>
                                    <Link href={`/admin/clientes/${lead.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {lead.nombre}
                                    </Link>
                                </td>
                                <td>{lead.empresa || '—'}</td>
                                <td>{lead.email}</td>
                                <td>{lead.tipo_proyecto}</td>
                                <td>{getStatusBadge(lead.estado)}</td>
                                <td>{new Date(lead.fecha_creacion).toLocaleDateString('es')}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Link href={`/admin/clientes/${lead.id}`} className={styles.btnGhost} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                            Ver
                                        </Link>
                                        <button onClick={() => handleDelete(lead.id)} className={styles.btnDanger} style={{ padding: '4px 10px', fontSize: '12px' }}>
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>No se encontraron resultados</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
