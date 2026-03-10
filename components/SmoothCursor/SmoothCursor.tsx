'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface Position {
    x: number;
    y: number;
}

export default function SmoothCursor() {
    const [isMoving, setIsMoving] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const lastMousePos = useRef<Position>({ x: 0, y: 0 });
    const velocity = useRef<Position>({ x: 0, y: 0 });
    const lastUpdateTime = useRef(0);

    useEffect(() => {
        lastUpdateTime.current = Date.now();
    }, []);
    const previousAngle = useRef(0);
    const accumulatedRotation = useRef(0);

    const springConfig = {
        damping: 30,
        stiffness: 800,
        mass: 0.5,
        restDelta: 0.001,
    };

    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);
    const rotation = useSpring(0, {
        ...springConfig,
        damping: 40,
        stiffness: 500,
    });
    const scale = useSpring(1, {
        ...springConfig,
        stiffness: 800,
        damping: 25,
    });

    useEffect(() => {
        // Only enable on desktop (no touch devices)
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const updateVelocity = (currentPos: Position) => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastUpdateTime.current;

            if (deltaTime > 0) {
                velocity.current = {
                    x: (currentPos.x - lastMousePos.current.x) / deltaTime,
                    y: (currentPos.y - lastMousePos.current.y) / deltaTime,
                };
            }

            lastUpdateTime.current = currentTime;
            lastMousePos.current = currentPos;
        };

        const smoothMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);

            const currentPos = { x: e.clientX, y: e.clientY };
            updateVelocity(currentPos);

            const speed = Math.sqrt(
                Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2)
            );

            cursorX.set(currentPos.x);
            cursorY.set(currentPos.y);

            if (speed > 0.1) {
                const currentAngle =
                    Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) + 90;

                let angleDiff = currentAngle - previousAngle.current;
                if (angleDiff > 180) angleDiff -= 360;
                if (angleDiff < -180) angleDiff += 360;
                accumulatedRotation.current += angleDiff;
                rotation.set(accumulatedRotation.current);
                previousAngle.current = currentAngle;

                scale.set(0.9);
                setIsMoving(true);
            }
        };

        let moveTimeout: NodeJS.Timeout;
        const handleMove = (e: MouseEvent) => {
            smoothMouseMove(e);
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                scale.set(1);
                setIsMoving(false);
            }, 150);
        };

        let rafId: number;
        const throttledMouseMove = (e: MouseEvent) => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                handleMove(e);
                rafId = 0;
            });
        };

        // Hide the default cursor
        document.documentElement.style.cursor = 'none';
        document.body.style.cursor = 'none';

        // Add global cursor-none to interactive elements
        const style = document.createElement('style');
        style.id = 'smooth-cursor-style';
        style.textContent = `
            *, *::before, *::after { cursor: none !important; }
            input, textarea, select { cursor: text !important; }
        `;
        document.head.appendChild(style);

        window.addEventListener('mousemove', throttledMouseMove);

        return () => {
            window.removeEventListener('mousemove', throttledMouseMove);
            document.documentElement.style.cursor = '';
            document.body.style.cursor = '';
            const el = document.getElementById('smooth-cursor-style');
            if (el) el.remove();
            if (rafId) cancelAnimationFrame(rafId);
            clearTimeout(moveTimeout);
        };
    }, [cursorX, cursorY, rotation, scale, isVisible]);

    return (
        <motion.div
            style={{
                position: 'fixed',
                left: cursorX,
                top: cursorY,
                translateX: '-50%',
                translateY: '-50%',
                rotate: rotation,
                scale: scale,
                zIndex: 9999,
                pointerEvents: 'none',
                willChange: 'transform',
                opacity: isVisible ? 1 : 0,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: isVisible ? 1 : 0 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
            }}
        >
            {/* Vibrant Blue Cursor Arrow */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={26}
                height={28}
                viewBox="0 0 50 54"
                fill="none"
            >
                <defs>
                    <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0066FF" />
                        <stop offset="100%" stopColor="#00E5FF" />
                    </linearGradient>
                </defs>
                <path
                    d="M42.68 41.15L27.51 6.8c-.78-1.77-3.3-1.77-4.12 0L7.6 41.15c-.84 1.83.93 3.74 2.81 3.05l13.96-5.15a2.5 2.5 0 0 1 1.57 0l13.87 5.15c1.87.7 3.67-1.21 2.87-3.05z"
                    fill="url(#cg)"
                />
                <path
                    d="M43.71 40.69L28.54 6.34c-1.19-2.69-4.97-2.65-6.18 0L6.57 40.68c-1.26 2.74 1.4 5.62 4.23 4.58l13.96-5.15c.26-.09.54-.09.78 0l13.87 5.15c2.81 1.04 5.51-1.84 4.3-4.57z"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth={1.5}
                />
            </svg>
        </motion.div>
    );
}
