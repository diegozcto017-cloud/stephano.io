'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('stephano-cookie-consent');
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('stephano-cookie-consent', 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem('stephano-cookie-consent', 'declined');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.banner}>
                <div className={styles.icon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="8" cy="9" r="1" fill="currentColor" />
                        <circle cx="15" cy="8" r="1" fill="currentColor" />
                        <circle cx="10" cy="14" r="1" fill="currentColor" />
                        <circle cx="16" cy="13" r="1" fill="currentColor" />
                        <circle cx="13" cy="17" r="1" fill="currentColor" />
                    </svg>
                </div>
                <div className={styles.content}>
                    <p className={styles.text}>
                        Utilizamos cookies técnicas para garantizar el correcto funcionamiento del sitio.
                        Al continuar navegando, aceptas su uso.{' '}
                        <Link href="/privacidad#cookies" className={styles.link}>
                            Más información
                        </Link>
                    </p>
                </div>
                <div className={styles.actions}>
                    <button onClick={decline} className={styles.btnDecline}>
                        Rechazar
                    </button>
                    <button onClick={accept} className={styles.btnAccept}>
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}
