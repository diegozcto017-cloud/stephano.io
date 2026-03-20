// ── Instagram Graph API Service ──
// Publica directamente en Instagram Business via Meta Graph API v18.0
// Requiere: INSTAGRAM_BUSINESS_ID + INSTAGRAM_PAGE_TOKEN (NO el App Token)
//
// Para obtener el Page Token correcto:
// 1. Meta for Developers → tu App → Tools → Graph API Explorer
// 2. Selecciona "Page Access Token" de la página de Facebook vinculada al IG
// 3. Genera token long-lived: GET /oauth/access_token?grant_type=fb_exchange_token
// 4. El INSTAGRAM_BUSINESS_ID lo encuentras en Meta Business Suite → Settings → Accounts → Instagram

const IG_GRAPH = 'https://graph.facebook.com/v18.0';

export interface IGPublishResult {
    success: boolean;
    postId?: string;
    permalink?: string;
    error?: string;
    setupRequired?: boolean;
    setupInstructions?: string;
}

export class InstagramService {
    private static get businessId() { return process.env.INSTAGRAM_BUSINESS_ID; }
    private static get pageToken() { return process.env.INSTAGRAM_PAGE_TOKEN; }

    static isConfigured(): boolean {
        return !!(this.businessId && this.pageToken);
    }

    static getSetupStatus() {
        return {
            configured: this.isConfigured(),
            hasBusinessId: !!this.businessId,
            hasPageToken: !!this.pageToken,
            instructions: {
                businessId: 'Meta Business Suite → Settings → Accounts → Instagram → Account ID',
                pageToken: 'Graph API Explorer → selecciona tu página → genera Page Access Token → extiende a long-lived token',
                envVars: 'Agregar a Vercel: INSTAGRAM_BUSINESS_ID y INSTAGRAM_PAGE_TOKEN',
            },
        };
    }

    /**
     * Publica una imagen en Instagram
     * imageUrl debe ser una URL HTTPS pública accesible (no base64, no localhost)
     */
    static async publishPhoto(imageUrl: string, caption: string): Promise<IGPublishResult> {
        if (!this.isConfigured()) {
            return {
                success: false,
                setupRequired: true,
                error: 'Instagram no configurado',
                setupInstructions: 'Necesitas agregar INSTAGRAM_BUSINESS_ID e INSTAGRAM_PAGE_TOKEN a las variables de entorno en Vercel.',
            };
        }

        // Si es base64 o URL de localhost, usar Pollinations como imagen pública
        const finalImageUrl = this.resolvePublicUrl(imageUrl);

        try {
            // Paso 1: Crear container de media
            const containerRes = await fetch(
                `${IG_GRAPH}/${this.businessId}/media`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image_url: finalImageUrl,
                        caption,
                        access_token: this.pageToken,
                    }),
                }
            );

            const containerData = await containerRes.json();

            if (!containerRes.ok || containerData.error) {
                console.error('[InstagramService] Container error:', containerData);
                return {
                    success: false,
                    error: containerData.error?.message || 'Error al crear container de media',
                };
            }

            const creationId = containerData.id;

            // Paso 2: Publicar el container
            const publishRes = await fetch(
                `${IG_GRAPH}/${this.businessId}/media_publish`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        creation_id: creationId,
                        access_token: this.pageToken,
                    }),
                }
            );

            const publishData = await publishRes.json();

            if (!publishRes.ok || publishData.error) {
                console.error('[InstagramService] Publish error:', publishData);
                return {
                    success: false,
                    error: publishData.error?.message || 'Error al publicar en Instagram',
                };
            }

            const postId = publishData.id;

            // Paso 3: Obtener permalink
            const permalink = await this.getPermalink(postId);

            console.log(`[InstagramService] Published successfully: ${postId}`);
            return { success: true, postId, permalink };

        } catch (error) {
            console.error('[InstagramService] Exception:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error de conexión con Instagram',
            };
        }
    }

    /**
     * Publica un Reel (video) en Instagram
     */
    static async publishReel(videoUrl: string, caption: string): Promise<IGPublishResult> {
        if (!this.isConfigured()) {
            return { success: false, setupRequired: true, error: 'Instagram no configurado' };
        }

        try {
            const containerRes = await fetch(
                `${IG_GRAPH}/${this.businessId}/media`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        media_type: 'REELS',
                        video_url: videoUrl,
                        caption,
                        share_to_feed: true,
                        access_token: this.pageToken,
                    }),
                }
            );

            const containerData = await containerRes.json();
            if (!containerRes.ok || containerData.error) {
                return { success: false, error: containerData.error?.message || 'Error al crear container de Reel' };
            }

            // Los Reels necesitan esperar a que el video se procese
            const creationId = containerData.id;
            await this.waitForVideoReady(creationId);

            const publishRes = await fetch(
                `${IG_GRAPH}/${this.businessId}/media_publish`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        creation_id: creationId,
                        access_token: this.pageToken,
                    }),
                }
            );

            const publishData = await publishRes.json();
            if (!publishRes.ok || publishData.error) {
                return { success: false, error: publishData.error?.message || 'Error al publicar Reel' };
            }

            const permalink = await this.getPermalink(publishData.id);
            return { success: true, postId: publishData.id, permalink };

        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Error de conexión' };
        }
    }

    private static resolvePublicUrl(imageUrl: string): string {
        if (!imageUrl) return '';

        // Si ya es una URL HTTPS pública (no localhost), usarla directamente
        if (imageUrl.startsWith('https://') && !imageUrl.includes('localhost')) {
            return imageUrl;
        }

        // Si es base64, generar imagen de Pollinations como fallback
        if (imageUrl.startsWith('data:')) {
            return `https://image.pollinations.ai/prompt/professional%20tech%20agency%20dark%20modern%20stephano.io?width=1080&height=1080&nologo=true&model=flux&seed=${Date.now()}`;
        }

        return imageUrl;
    }

    private static async getPermalink(postId: string): Promise<string | undefined> {
        try {
            const res = await fetch(
                `${IG_GRAPH}/${postId}?fields=permalink&access_token=${this.pageToken}`
            );
            const data = await res.json();
            return data.permalink;
        } catch {
            return undefined;
        }
    }

    private static async waitForVideoReady(creationId: string, maxAttempts = 10): Promise<void> {
        for (let i = 0; i < maxAttempts; i++) {
            await new Promise(r => setTimeout(r, 5000));
            try {
                const res = await fetch(
                    `${IG_GRAPH}/${creationId}?fields=status_code&access_token=${this.pageToken}`
                );
                const data = await res.json();
                if (data.status_code === 'FINISHED') return;
                if (data.status_code === 'ERROR') throw new Error('Video processing failed');
            } catch {
                // continue waiting
            }
        }
    }

    /**
     * Construye un caption de Instagram a partir del copy de un anuncio
     */
    static buildCaption(headline: string, copy: string, hashtags?: string): string {
        const lines = copy.split('\n\n').map(p => p.trim()).filter(Boolean);
        const formatted = lines.map(line => {
            if (line.startsWith('ATENCIÓN:')) return line.replace('ATENCIÓN:', '').trim();
            if (line.startsWith('INTERÉS:')) return '\n' + line.replace('INTERÉS:', '').trim();
            if (line.startsWith('DESEO:')) return '\n' + line.replace('DESEO:', '').trim();
            if (line.startsWith('ACCIÓN:')) return '\n👉 ' + line.replace('ACCIÓN:', '').trim();
            return line;
        }).join('\n');

        const defaultHashtags = '#Stephano #DesarrolloWeb #CostaRica #TicosEmprendedores #WebDevelopment #AgenciaDigital';
        return `${headline}\n\n${formatted}\n\n${hashtags || defaultHashtags}`;
    }
}
