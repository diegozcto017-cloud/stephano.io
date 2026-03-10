'use client';

import { ReactNode } from 'react';
import styles from './Marquee.module.css';

interface MarqueeProps {
    children: ReactNode;
    reverse?: boolean;
    pauseOnHover?: boolean;
    className?: string;
    duration?: number;
    repeat?: number;
}

export default function Marquee({
    children,
    reverse = false,
    pauseOnHover = false,
    className = '',
    duration = 30,
    repeat = 4,
}: MarqueeProps) {
    return (
        <div
            className={`${styles.marquee} ${pauseOnHover ? styles.pauseOnHover : ''} ${className}`}
            style={{ ['--marquee-duration' as string]: `${duration}s` }}
        >
            {Array.from({ length: repeat }).map((_, i) => (
                <div
                    key={i}
                    className={`${styles.track} ${reverse ? styles.reverse : ''}`}
                    aria-hidden={i > 0}
                >
                    {children}
                </div>
            ))}
        </div>
    );
}
