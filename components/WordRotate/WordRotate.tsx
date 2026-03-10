'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface WordRotateProps {
    words: string[];
    duration?: number;
    className?: string;
    gradient?: boolean;
}

export default function WordRotate({
    words,
    duration = 2500,
    className = '',
    gradient = false,
}: WordRotateProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, duration);
        return () => clearInterval(interval);
    }, [words.length, duration]);

    const gradientStyle = gradient ? {
        background: 'linear-gradient(90deg, #0066FF, #00E5FF, #0099FF, #00BFFF)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text' as const,
        backgroundClip: 'text' as const,
        WebkitTextFillColor: 'transparent',
        animation: 'aurora-shimmer 3s ease-in-out infinite alternate',
    } : {};

    return (
        <span className={className} style={{ display: 'inline-block', position: 'relative' }}>
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[index]}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ display: 'inline-block', color: gradient ? undefined : '#00E5FF', ...gradientStyle }}
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}
