'use server';

import { AdsService, CreateAdDTO } from '@/server/services/ads.service';
import { runCreativePipeline, generateAdImages } from '@/server/services/creative.service';
import { revalidatePath } from 'next/cache';

export async function fetchAds() {
    try {
        return await AdsService.getAllAds();
    } catch (error) {
        console.error('Error fetching ads:', error);
        return [];
    }
}

export async function fetchStockCount() {
    try {
        return await AdsService.getReadyStockCount();
    } catch (error) {
        console.error('Error fetching stock count:', error);
        return 0;
    }
}

export async function createAdIdea(scratch: string, mode: 'single' | 'batch' = 'single') {
    console.log('--- Server Action: createAdIdea started ---');
    console.log('Idea:', scratch, '| Mode:', mode);
    try {
        // ═══ PIPELINE REAL ═══
        const result = await runCreativePipeline(scratch, mode);
        console.log('Pipeline Success:', result.headline);

        const newAd: CreateAdDTO = {
            scratch,
            headline: result.headline,
            copy: result.copy,
            mediaUrl: result.mediaUrl,
            mediaType: 'image',
            status: 'draft',
            publishAt: null,
        };

        await AdsService.createAd(newAd);
        revalidatePath('/admin/ads');
        return { success: true };
    } catch (error) {
        console.error('Error creating ad idea:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Pipeline de IA falló. Revisa las API keys.' };
    }
}

import { N8nService } from '@/server/services/n8n.service';

export async function updateAdStatus(id: number, status: 'draft' | 'scheduled' | 'published' | 'rejected') {
    try {
        let publishAt: Date | null = null;
        if (status === 'scheduled') {
            publishAt = getNextWarmHour();
        }

        const ad = await AdsService.updateAd(id, { status, publishAt });

        // Si se programa, avisar a n8n
        if (status === 'scheduled') {
            await N8nService.triggerAdWorkflow(ad);
        }

        revalidatePath('/admin/ads');
        return { success: true };
    } catch (error) {
        console.error('Error updating ad status:', error);
        return { success: false, error: 'Failed to update ad status.' };
    }
}

export async function publishAdNow(id: number) {
    try {
        const ad = await AdsService.getAdById(id);
        if (!ad) return { success: false, error: 'Ad not found' };

        // 1. Notificar a n8n con prioridad alta
        await N8nService.triggerAdWorkflow(ad, { priority: 'high' });

        // 2. Marcar como publicado localmente
        await AdsService.updateAd(id, { status: 'published', publishAt: new Date() });

        revalidatePath('/admin/ads');
        return { success: true };
    } catch (error) {
        console.error('Error publishing ad now:', error);
        return { success: false, error: 'Failed to publish ad.' };
    }
}


export async function deleteAd(id: number) {
    try {
        await AdsService.deleteAd(id);
        revalidatePath('/admin/ads');
        return { success: true };
    } catch (error) {
        console.error('Error deleting ad:', error);
        return { success: false, error: 'Failed to delete ad.' };
    }
}

export async function regenerateAdImage(id: number, mode: 'single' | 'batch' = 'single') {
    try {
        const ad = await AdsService.getAdById(id);
        if (!ad) return { success: false, error: 'Ad not found' };
        const mediaUrl = await generateAdImages(ad.headline || ad.scratch, ad.scratch, mode);
        await AdsService.updateAd(id, { mediaUrl });
        revalidatePath('/admin/ads');
        return { success: true, mediaUrl };
    } catch (error) {
        console.error('Error regenerating image:', error);
        return { success: false, error: 'Failed to regenerate image.' };
    }
}

export async function publishToInstagram(id: number) {
    try {
        const ad = await AdsService.getAdById(id);
        if (!ad) return { success: false, error: 'Anuncio no encontrado' };

        const { InstagramService } = await import('@/server/services/instagram.service');

        if (!InstagramService.isConfigured()) {
            return {
                success: false,
                setupRequired: true,
                error: 'Instagram no configurado. Agrega INSTAGRAM_BUSINESS_ID e INSTAGRAM_PAGE_TOKEN en Vercel.',
            };
        }

        const imageUrl = (() => {
            if (!ad.mediaUrl) return '';
            if (ad.mediaUrl.startsWith('[')) {
                try { return JSON.parse(ad.mediaUrl)[0] || ''; } catch { return ad.mediaUrl; }
            }
            return ad.mediaUrl;
        })();

        const caption = InstagramService.buildCaption(ad.headline || ad.scratch, ad.copy || ad.scratch);

        const result = await InstagramService.publishPhoto(imageUrl, caption);

        if (result.success) {
            await AdsService.updateAd(id, { status: 'published', publishAt: new Date() });
            revalidatePath('/admin/ads');
        }

        return result;
    } catch (error) {
        console.error('Error publishing to Instagram:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error al publicar' };
    }
}

export async function saveAdEdit(id: number, headline: string, copy: string) {
    try {
        await AdsService.updateAd(id, { headline, copy });
        revalidatePath('/admin/ads');
        return { success: true };
    } catch (error) {
        console.error('Error saving ad edit:', error);
        return { success: false, error: 'Failed to save edits.' };
    }
}

// ── Cálculo de la próxima "Hora Caliente" ──
// Warmhour = 11:00 AM o 7:30 PM CST (Costa Rica = UTC-6)
function getNextWarmHour(): Date {
    const now = new Date();
    const costaRicaOffset = -6; // UTC-6
    const utcHour = now.getUTCHours();
    const localHour = utcHour + costaRicaOffset;

    const today = new Date(now);

    // Si aún no son las 11 AM CR, programar para hoy a las 11 AM
    if (localHour < 11) {
        today.setUTCHours(11 - costaRicaOffset, 0, 0, 0); // 11 AM CR = 17:00 UTC
        return today;
    }

    // Si ya pasaron las 11 AM pero no las 7:30 PM, programar para hoy a las 7:30 PM
    if (localHour < 19 || (localHour === 19 && now.getUTCMinutes() < 30)) {
        today.setUTCHours(19 - costaRicaOffset, 30, 0, 0); // 7:30 PM CR
        return today;
    }

    // Si ya pasaron las dos ventanas, programar para mañana a las 11 AM
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(11 - costaRicaOffset, 0, 0, 0);
    return tomorrow;
}
