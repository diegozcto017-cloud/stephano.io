import { memo } from 'react';
import styles from './BorderBeam.module.css';

interface BorderBeamProps {
    className?: string;
    size?: number;
    duration?: number;
    delay?: number;
    colorFrom?: string;
    colorTo?: string;
    borderWidth?: number;
}

export const BorderBeam = memo(function BorderBeam({
    className = '',
    size = 200,
    duration = 15,
    delay = 0,
    colorFrom = '#0066FF',
    colorTo = '#00E5FF',
    borderWidth = 1.5,
}: BorderBeamProps) {
    return (
        <div
            className={`${styles.borderBeam} ${className}`}
            style={
                {
                    '--size': `${size}px`,
                    '--duration': `${duration}s`,
                    '--delay': `${delay}s`,
                    '--color-from': colorFrom,
                    '--color-to': colorTo,
                    '--border-width': `${borderWidth}px`,
                } as React.CSSProperties
            }
        />
    );
});
