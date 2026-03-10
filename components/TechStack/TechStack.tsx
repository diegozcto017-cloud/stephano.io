'use client';

import styles from './TechStack.module.css';
import { SiNextdotjs, SiSupabase, SiPrisma, SiVercel, SiFramer, SiReact, SiTypescript, SiNodedotjs, SiPostgresql, SiHostinger, SiGooglegemini, SiAnthropic, SiN8N, SiNotion } from 'react-icons/si';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import AuroraText from '@/components/AuroraText/AuroraText';

import { BsStars } from 'react-icons/bs';

import { OrbitingCircles } from '@/components/OrbitingCircles/OrbitingCircles';
import Image from 'next/image';

const innerTechs = [
    { name: 'Next.js 15', icon: <SiNextdotjs /> },
    { name: 'React 19', icon: <SiReact /> },
    { name: 'TypeScript', icon: <SiTypescript /> },
    { name: 'Node.js', icon: <SiNodedotjs /> },
];

const middleTechs = [
    { name: 'Supabase', icon: <SiSupabase /> },
    { name: 'Prisma ORM', icon: <SiPrisma /> },
    { name: 'PostgreSQL', icon: <SiPostgresql /> },
    { name: 'Vercel Edge', icon: <SiVercel /> },
    { name: 'Hostinger', icon: <SiHostinger /> },
];

const outerTechs = [
    { name: 'Gemini', icon: <SiGooglegemini /> },
    { name: 'Claude', icon: <SiAnthropic /> },
    { name: 'n8n', icon: <SiN8N /> },
    { name: 'Notion', icon: <SiNotion /> },
    { name: 'Antigravity', icon: <BsStars /> },
    { name: 'Framer Motion', icon: <SiFramer /> },
];

export default function TechStack() {
    return (
        <section className={styles.techSection}>
            <div className="container">
                <ScrollReveal>
                    <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto", marginBottom: '60px' }}>
                        <span style={{
                            padding: "6px 14px", borderRadius: 100,
                            background: "rgba(0, 229, 255, 0.08)", border: "1px solid rgba(0, 229, 255, 0.25)",
                            fontSize: 13, fontWeight: 600, color: "#00E5FF",
                            display: "inline-block", marginBottom: 16,
                        }}>
                            Stack de Ingeniería
                        </span>
                        <h2 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1 }}>
                            Tecnologías que impulsan la{' '}
                            <AuroraText colors={['#00E5FF', '#0066FF', '#0099FF']} speed={0.8}>próxima generación</AuroraText>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7, fontSize: '16px' }}>
                            Utilizamos las tecnologías más avanzadas del mercado para garantizar escalabilidad, seguridad y una experiencia de usuario superior.
                        </p>
                    </div>
                </ScrollReveal>

                <div className={styles.orbitContainer}>
                    {/* Inner Circle */}
                    <OrbitingCircles radius={80} duration={25} iconSize={40}>
                        {innerTechs.map((tech) => (
                            <div key={tech.name} className={styles.iconWrapper} title={tech.name}>
                                {tech.icon}
                            </div>
                        ))}
                    </OrbitingCircles>

                    {/* Middle Circle */}
                    <OrbitingCircles radius={160} duration={35} reverse iconSize={45}>
                        {middleTechs.map((tech) => (
                            <div key={tech.name} className={styles.iconWrapper} title={tech.name}>
                                {tech.icon}
                            </div>
                        ))}
                    </OrbitingCircles>

                    {/* Outer Circle */}
                    <OrbitingCircles radius={240} duration={50} iconSize={50}>
                        {outerTechs.map((tech) => (
                            <div key={tech.name} className={styles.iconWrapper} title={tech.name}>
                                {tech.icon}
                            </div>
                        ))}
                    </OrbitingCircles>

                    {/* Center Logo */}
                    <div className={styles.centerLogo}>
                        <div className={styles.logoInner}>
                            <Image
                                src="/icon.png"
                                alt="Stephano Icon"
                                width={60}
                                height={60}
                                className={styles.logoImg}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

