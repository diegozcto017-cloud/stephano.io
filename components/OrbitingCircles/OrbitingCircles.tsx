'use client';

import React from 'react';
import s from './OrbitingCircles.module.css';

export interface OrbitingCirclesProps {
    className?: string;
    children?: React.ReactNode;
    reverse?: boolean;
    duration?: number;
    delay?: number;
    radius?: number;
    path?: boolean;
    iconSize?: number;
}

export function OrbitingCircles({
    className = '',
    children,
    reverse = false,
    duration = 20,
    delay = 0,
    radius = 50,
    path = true,
    iconSize = 30,
}: OrbitingCirclesProps) {
    return (
        <>
            {path && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    className={s.orbitPath}
                    viewBox="0 0 100 100"
                >
                    <circle
                        className={s.orbitPathCircle}
                        cx="50"
                        cy="50"
                        r={radius}
                    />
                </svg>
            )}

            <div
                style={{
                    '--duration': `${duration}s`,
                    '--radius': radius,
                } as React.CSSProperties}
                className={`${s.orbitingCircle} ${className}`}
            >
                {React.Children.map(children, (child, index) => {
                    const totalChildren = React.Children.count(children);
                    const childDelay = (duration / totalChildren) * index;
                    return (
                        <div
                            style={{
                                '--delay': `${-childDelay}s`,
                                animationDelay: 'var(--delay)',
                                width: iconSize,
                                height: iconSize,
                                fontSize: iconSize,
                            } as React.CSSProperties}
                            className={`${s.child} ${reverse ? s.reverse : ''}`}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
