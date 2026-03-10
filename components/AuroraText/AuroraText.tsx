'use client';

import { ReactNode } from 'react';
import styles from './AuroraText.module.css';

interface AuroraTextProps {
    children: ReactNode;
    colors?: string[];
    speed?: number;
    className?: string;
}

export default function AuroraText({
    children,
    colors = ['#0066FF', '#00E5FF', '#0099FF', '#00BFFF'],
    speed = 1,
    className = '',
}: AuroraTextProps) {
    const gradientStops = colors.map((color, i) => {
        const percent = (i / (colors.length - 1)) * 100;
        return `${color} ${percent}%`;
    }).join(', ');

    return (
        <span
            className={`${styles.aurora} ${className}`}
            style={{
                ['--aurora-gradient' as string]: `linear-gradient(90deg, ${gradientStops})`,
                ['--aurora-speed' as string]: `${3 / speed}s`,
            }}
        >
            {children}
        </span>
    );
}
