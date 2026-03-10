
// ── Meta Ads Service ──
// Gestiona el Marketing API de Meta (Facebook/Instagram)

const FB_GRAPH_URL = 'https://graph.facebook.com/v18.0';

export class MetaService {
    private static accessToken = process.env.META_ACCESS_TOKEN;
    private static appId = process.env.META_APP_ID;
    private static portfolioId = '2041724029728189';

    /**
     * Verifica la validez del token y obtiene información básica de la App
     */
    static async debugAppInfo() {
        if (!this.accessToken) return null;
        try {
            const response = await fetch(`${FB_GRAPH_URL}/app?access_token=${this.accessToken}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error('MetaService Error:', error);
            return null;
        }
    }

    /**
     * Obtiene las cuentas de anuncios asociadas al token
     */
    static async getAdAccounts() {
        if (!this.accessToken) return [];
        try {
            // Primero intentamos vía Portfolio (Business)
            let response = await fetch(`${FB_GRAPH_URL}/${this.portfolioId}/client_ad_accounts?fields=name,account_id,id,currency&access_token=${this.accessToken}`);

            if (!response.ok) {
                // Fallback a /me/adaccounts si no es business admin directo del portfolio
                response = await fetch(`${FB_GRAPH_URL}/me/adaccounts?fields=name,account_id,id,currency&access_token=${this.accessToken}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('MetaService Error:', error);
            return [];
        }
    }

    /**
     * Obtiene métricas básicas de una cuenta de anuncios
     */
    static async getAccountInsights(adAccountId: string) {
        if (!this.accessToken) return null;
        try {
            const response = await fetch(`${FB_GRAPH_URL}/${adAccountId}/insights?fields=spend,impressions,clicks,cpc,ctr,reach&date_preset=last_30d&access_token=${this.accessToken}`);
            if (!response.ok) return null;
            const data = await response.json();
            return data.data?.[0] || null;
        } catch (error) {
            console.error('MetaService Error:', error);
            return null;
        }
    }
}
