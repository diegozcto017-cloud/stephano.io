import GrowthBrainClient from './GrowthBrainClient';
import styles from '@/styles/admin.module.css';

export const dynamic = 'force-dynamic';

export default function GrowthBrainPage() {
    return (
        <>
            <div className={styles.adminPageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className={styles.adminPageTitle} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                        </svg>
                        Growth Brain
                    </h1>
                    <p className={styles.adminPageDesc}>Motor Autónomo de Crecimiento en Instagram</p>
                </div>

                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontSize: 12, fontWeight: 600,
                    background: 'rgba(168,85,247,0.08)',
                    color: '#a855f7',
                    padding: '6px 16px',
                    borderRadius: 100,
                    border: '1px solid rgba(168,85,247,0.2)',
                }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a855f7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    Growth Brain Activo
                </span>
            </div>

            <GrowthBrainClient />
        </>
    );
}
