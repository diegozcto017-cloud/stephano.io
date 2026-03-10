export class N8nService {
    private static WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    private static AUTH_TOKEN = process.env.N8N_AUTH_TOKEN;

    static async triggerAdWorkflow(ad: any, options: { priority?: 'high' | 'normal' } = {}) {
        if (!this.WEBHOOK_URL) {
            console.warn('[N8nService] No WEBHOOK_URL configured');
            return null;
        }

        try {
            const response = await fetch(this.WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.AUTH_TOKEN ? `Bearer ${this.AUTH_TOKEN}` : '',
                },
                body: JSON.stringify({
                    action: options.priority === 'high' ? 'publish_now' : 'schedule_publish',
                    ad_id: ad.id,
                    headline: ad.headline,
                    copy: ad.copy,
                    scratch: ad.scratch,
                    mediaUrl: ad.mediaUrl,
                    scheduled_for: ad.publishAt,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const error = await response.text();
                console.error('[N8nService] Webhook error:', error);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('[N8nService] Failed to trigger workflow:', error);
            return null;
        }
    }
}
