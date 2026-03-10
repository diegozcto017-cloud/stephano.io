import React, { useEffect, useState, memo } from 'react';
import styles from './Meteors.module.css';

interface MeteorsProps {
    number?: number;
    minDelay?: number;
    maxDelay?: number;
    minDuration?: number;
    maxDuration?: number;
    angle?: number;
    className?: string;
}

export const Meteors = memo(function Meteors({
    number = 30,
    minDelay = 0,
    maxDelay = 8,
    minDuration = 8,
    maxDuration = 20,
    angle = 215,
    className = '',
}: MeteorsProps) {
    const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);

    useEffect(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // Span from -vh to vw+vh along the top so every diagonal strip is covered
        const totalSpan = vw + vh * 2;

        const stylesArray = [...new Array(number)].map(() => ({
            '--angle': 540 - angle + 'deg',
            top: '-2px',
            left: `${Math.floor(Math.random() * totalSpan) - vh}px`,
            animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + 's',
            animationDuration:
                Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) + 's',
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMeteorStyles(stylesArray);
    }, [number, minDelay, maxDelay, minDuration, maxDuration, angle]);

    return (
        <div className={`${styles.meteorsContainer} ${className}`}>
            {[...meteorStyles].map((style, idx) => (
                <span
                    key={idx}
                    style={{ ...style } as React.CSSProperties}
                    className={styles.meteorHead}
                >
                    <div className={styles.meteorTail} />
                </span>
            ))}
        </div>
    );
});
