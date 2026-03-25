'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/admin.module.css';

const navItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    },
    {
        label: 'Clientes',
        href: '/admin/clientes',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
        label: 'Prospectos',
        href: '/admin/prospectos',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>,
    },
];

const socialItems = [
    {
        label: 'Social Studio',
        href: '/admin/social-studio',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    },
    {
        label: 'Deal Intelligence',
        href: '/admin/deal-intelligence',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/><path d="M8.5 8.5a5 5 0 1 1 0 7"/></svg>,
    },
    {
        label: 'Revenue Predictor',
        href: '/admin/revenue-predictor',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><path d="M2 20h20"/></svg>,
    },
    {
        label: 'Outreach IG',
        href: '/admin/outreach',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>,
    },
];

const otherItems = [
    {
        label: 'Demos',
        href: '/admin/demos',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M9 8l3 3 3-3"/></svg>,
    },
];

const docItems = [
    {
        label: 'Bienvenida',
        href: '/admin/documentos/bienvenida',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
    },
    {
        label: 'Contrato',
        href: '/admin/documentos/contrato',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    },
    {
        label: 'Gracias',
        href: '/admin/documentos/gracias',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    },
    {
        label: 'Contenido',
        href: '/admin/documentos/uso-contenido',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    },
    {
        label: 'Reporte',
        href: '/admin/documentos/reporte-mensual',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
    },
    {
        label: 'Propuesta',
        href: '/admin/documentos/propuesta',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="12" y1="17" x2="8" y2="17" /></svg>,
    },
    {
        label: 'Factura',
        href: '/admin/documentos/factura',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem('stephano-admin');
        window.location.href = '/admin';
    };

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            <button className={styles.mobileMenuBtn} onClick={toggleSidebar} aria-label="Toggle Menu">
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                )}
            </button>

            <aside className={isOpen ? styles.sidebar : styles.sidebarClosed}>
                <Link href="/" className={styles.sidebarLogo} onClick={closeSidebar}>
                    <div className={styles.sidebarLogoIcon}>
                        <img src="/icon.png" alt="S" width={24} height={24} style={{ display: 'block' }} />
                    </div>
                    <span className={styles.sidebarLogoText}>Stephano<span className={styles.sidebarLogoAccent}>.io</span></span>
                </Link>

                <nav className={styles.sidebarNav}>
                    <div className={styles.sidebarLabel}>Gestión</div>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSidebar}
                            className={pathname === item.href ? styles.sidebarLinkActive : styles.sidebarLink}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}

                    <div className={styles.sidebarLabel}>Social Media</div>
                    {socialItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSidebar}
                            className={pathname === item.href ? styles.sidebarLinkActive : styles.sidebarLink}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}

                    <div className={styles.sidebarLabel}>Documentos</div>
                    {docItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSidebar}
                            className={pathname === item.href ? styles.sidebarLinkActive : styles.sidebarLink}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}

                    <div className={styles.sidebarLabel}>Sistema</div>
                    {otherItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeSidebar}
                            className={pathname === item.href ? styles.sidebarLinkActive : styles.sidebarLink}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} className={styles.sidebarLogout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Cerrar Sesión
                </button>
            </aside>

            {/* Overlay for mobile tap-to-close */}
            {isOpen && (
                <div
                    onClick={closeSidebar}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90, backdropFilter: 'blur(2px)'
                    }}
                />
            )}
        </>
    );
}
