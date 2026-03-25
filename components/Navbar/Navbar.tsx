'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

const navItems = [
    { label: 'Ecosistema', href: '/ecosistema' },
    { label: 'Proceso', href: '/proceso' },
    { label: 'Contactar', href: '/contacto' },
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
                                {item.label}
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
