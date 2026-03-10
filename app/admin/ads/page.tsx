import AdsClient from './AdsClient';
import { AdsService } from '@/server/services/ads.service';
import styles from '@/styles/admin.module.css';

// Next.js config para no cachear esta página (siempre fresca)
export const dynamic = 'force-dynamic';

export default async function AdsPage() {
    const initialAds = await AdsService.getAllAds();
    const initialStock = await AdsService.getReadyStockCount();

    // Serialize dates for the client component
    const serializedAds = initialAds.map(ad => ({
        ...ad,
        publishAt: ad.publishAt ? ad.publishAt.toISOString() : null,
        createdAt: ad.createdAt.toISOString(),
        updatedAt: ad.updatedAt.toISOString(),
    }));

    return (
        <>
            <div className={styles.adminPageHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className={styles.adminPageTitle} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        Ads Engine
                    </h1>
                    <p className={styles.adminPageDesc}>Estrategia Autónoma & Maestría Creativa</p>
                </div>

                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontSize: 12, fontWeight: 600,
                    background: 'rgba(0,229,255,0.08)',
                    color: '#00E5FF',
                    padding: '6px 16px',
                    borderRadius: 100,
                    border: '1px solid rgba(0,229,255,0.2)',
                }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E5FF', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    Hybrid Mode Activo
                </span>
            </div>

            <AdsClient initialAds={serializedAds} initialStock={initialStock} />
        </>
    );
}
