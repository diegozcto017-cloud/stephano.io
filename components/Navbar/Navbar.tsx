'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const navItems = [
    {
        label: 'Servicios',
        href: '/servicios',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        )
    },
    {
        label: 'Soluciones',
        href: '/soluciones',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
        )
    },
    {
        label: 'Proceso',
        href: '/proceso',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        )
    },
    {
        label: 'Portafolio',
        href: '/portafolio',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        )
    },
    {
        label: 'Contactar',
        href: '/contacto',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
        )
    },
];

interface NavbarProps {
    variant?: 'overlay' | 'solid';
}

export default function Navbar({ variant = 'solid' }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
    }, [mobileOpen]);

    const navClass =
        variant === 'overlay' && !scrolled
            ? `${styles.navbar} ${styles.overlay}`
            : `${styles.navbar} ${styles.solid}`;

    return (
        <>
            <motion.nav
                className={navClass}
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className={styles.navContainer}>
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <img src="/icon.png" alt="S" width={28} height={28} style={{ display: 'block' }} />
                        </div>
                        <span className={styles.logoText}>Stephano<span className={styles.logoAccent}>.io</span></span>
                    </Link>

                    <div className={styles.navLinks} onMouseLeave={() => setHoveredIndex(null)}>
                        {navItems.map((item, i) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={styles.navLink}
                                onMouseEnter={() => setHoveredIndex(i)}
                            >
                                <span className={styles.linkContent}>
                                    <span className={styles.linkIcon}>{item.icon}</span>
                                    {item.label}
                                </span>
                                {hoveredIndex === i && (
                                    <motion.div
                                        className={styles.activeIndicator}
                                        layoutId="navIndicator"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </Link>
                        ))}
                        <Link href="/cotizar" className={styles.navCta}>
                            Cotizar Proyecto
                        </Link>
                    </div>

                    <button
                        className={`${styles.mobileToggle} ${mobileOpen ? styles.mobileToggleActive : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            className={styles.mobileOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            className={styles.mobileMenu}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className={styles.mobileMenuHeader}>
                                <div className={styles.logo}>
                                    <span className={styles.logoText}>Stephano<span className={styles.logoAccent}>.io</span></span>
                                </div>
                            </div>
                            <div className={styles.mobileLinks}>
                                {navItems.map((item, i) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={styles.mobileLink}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <span className={styles.mobileIcon}>{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + navItems.length * 0.05 }}
                                    style={{ marginTop: 'var(--space-lg)' }}
                                >
                                    <Link href="/cotizar" className={styles.navCta} style={{ width: '100%', textAlign: 'center' }} onClick={() => setMobileOpen(false)}>
                                        Cotizar Proyecto
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
