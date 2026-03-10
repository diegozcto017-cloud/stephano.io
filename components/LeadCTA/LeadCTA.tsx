'use client';

import Link from 'next/link';
import styles from './LeadCTA.module.css';
import glass from '@/styles/glass.module.css';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

interface LeadCTAProps {
    title?: string;
    description?: string;
    buttonText?: string;
    link?: string;
}

export default function LeadCTA({
    title = '¿Listo para escalar tu infraestructura digital?',
    description = 'Diseñamos y construimos sistemas que no solo se ven increíbles, sino que están optimizados para convertir cada visita en una oportunidad de negocio.',
    buttonText = 'Solicitar Presupuesto',
    link = '/cotizar'
}: LeadCTAProps) {
    return (
        <section className={styles.cta}>
            <div className="container">
                <ScrollReveal>
                    <div className={styles.ctaBox}>
                        <h2 className={styles.ctaTitle}>{title}</h2>
                        <p className={styles.ctaDesc}>{description}</p>
                        <div className={styles.ctaActions}>
                            <Link href={link} className={glass.btnPrimary}>
                                {buttonText}
                            </Link>
                            <Link href="/contacto" className={glass.btnGlass}>
                                Hablar con un Experto
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
