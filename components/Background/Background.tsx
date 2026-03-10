'use client';

import styles from './Background.module.css';

export default function Background() {
    return (
        <div className={styles.background}>
            <div className={styles.starfield} />

            {/* CSS-only rotating circles — no JS overhead */}
            <div className={`${styles.shape} ${styles.bigCircle}`} />
            <div className={`${styles.shape} ${styles.smallCircle}`} />

            {/* Ambient glows — CSS only */}
            <div className={`${styles.glow} ${styles.glow1}`} />
            <div className={`${styles.glow} ${styles.glow2}`} />
            <div className={`${styles.glow} ${styles.glow3}`} />
        </div>
    );
}
