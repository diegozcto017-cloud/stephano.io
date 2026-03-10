
'use server';

import { MetaService } from '@/server/services/meta.service';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function fetchMetaStats() {
    try {
        const accounts = await MetaService.getAdAccounts();
        if (accounts.length === 0) return { connected: false };

        const mainAccount = accounts[0];
        const insights = await MetaService.getAccountInsights(mainAccount.id);

        return {
            connected: true,
            accountName: mainAccount.name,
            accountId: mainAccount.account_id,
            insights
        };
    } catch (error) {
        console.error('Error fetching Meta stats:', error);
        return { connected: false, error: 'Meta API unreachable' };
    }
}

export async function runStrategyAudit(context: string) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

    const systemPrompt = `Eres un Experto Auditor de Meta Ads (Media Buyer Senior).
Tu misión es analizar la estrategia de redes sociales de un cliente y proporcionar una auditoría basada en los 46 puntos de control de la industria (Estructura, Creative, Pixel/CAPI, Audiencias).

PUNTOS CLAVE DE AUDITORÍA:
1. Salud del Pixel y Conversiones API (CAPI).
2. Diversidad Creativa (¿UGC, Video, Estático, Carrusel?).
3. Fatiga Creativa (CTR decline).
4. Estructura de Cuenta (Consolidación vs Fragmentación).
5. Advantage+ Adoption.

RESPONDE EN MARKDOWN FORMATEADO PARA UN DASHBOARD.
Utiliza un tono profesional, crítico y orientado a la acción inmediata.`;

    try {
        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-latest',
                max_tokens: 2048,
                system: systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: `Realiza una auditoría estratégica basada en este contexto:
                        
                        "${context}"
                        
                        Proporciona:
                        - Un puntaje de salud estimado (0-100).
                        - 3 hallazgos críticos.
                        - Hoja de ruta de implementación (Roadmap) de 4 fases.
                        - Recomendaciones de Advantage+.`
                    }
                ]
            })
        });

        const data = await response.json();
        return { success: true, audit: data.content[0].text };
    } catch (error) {
        console.error('Audit failed:', error);
        return { success: false, error: 'Hubo un error al procesar la auditoría estratégica.' };
    }
}
