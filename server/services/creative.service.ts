
// ── Creative Service ──
// Orquesta las llamadas a Claude (copywriting) + Gemini (imágenes con información)

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// ─────────────────────────────────────────
// PROGRESS STREAMING
// ─────────────────────────────────────────

export type ProgressEvent = {
    step: string;
    status: string;
    message: string;
    percent?: number;
    [key: string]: unknown;
};

export type OnProgress = (event: ProgressEvent) => void;

// ─────────────────────────────────────────
// COPY GENERATION — Claude Sonnet 4.6
// ─────────────────────────────────────────

export async function generateAdCopy(scratch: string): Promise<{ headline: string; copy: string }> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('ANTHROPIC_API_KEY is not defined in .env.local');
    }

    const systemPrompt = `Eres el Ultimate Marketing Strategist (Senior Media Buyer + Conversion Engineer) de Stephano.io.
Tu especialidad es generar anuncios de alto rendimiento basados en "Marketing Skills" (ad-creative, copywriting, pricing-strategy).

CATÁLOGO DE PRECIOS REALES DE STEPHANO.IO (usa estos para generar precios exactos):
- Landing Page estratégica: Desde $350 USD
- Web Application / Dashboard / CRM: Desde $1,500 USD
- E-commerce completo: Desde $1,200 USD
- Página Corporativa / Portfolio: Desde $450 USD
- Rediseño estratégico: Desde $450 USD
- Automatizaciones e integraciones: Desde $500 USD
- Módulo Admin: +$500 | Auth/Usuarios: +$250 | SEO: +$150 | Mantenimiento: +$100/mes

REGLA CRÍTICA: Si el usuario especifica un precio en su idea, usa ese precio exacto.
Si el usuario no especifica precio, usa el precio del catálogo según el servicio que mencione.
NUNCA inventes ni cambies los precios. El catálogo de arriba es la fuente de verdad.

ESTRATEGIA DE ÁNGULOS (Angles):
1. PAIN POINT: Ataca el problema directo relacionado al producto mencionado.
2. OUTCOME: Enfocado en el resultado final del producto/servicio específico.
3. SOCIAL PROOF: Basado en autoridad de Stephano.io.
4. COMPARISON: Diferenciación técnica usando el producto/precio real.

ESTRUCTURA DEL ANUNCIO (AIDA + Direct Response):
- HEADLINE (Máximo 40 caracteres): Hook irresistible basado en el producto real.
- PRIMARY TEXT (Copy):
    * ATENCIÓN: Gancho inicial de 1 frase sobre el producto/servicio específico.
    * INTERÉS: Beneficios técnicos del producto mencionado.
    * DESEO: Precio del catálogo o precio exacto que el usuario indicó.
    * ACCIÓN: CTA directo usando el canal que el usuario especificó (web, contacto, etc.).

REGLAS DE BRANDING (Stephano.io):
- Tono: Visionario, minimalista, de élite. Usa "Usted".
- Estética: "Cyber-Premium" / "Liquid Glass".
- NUNCA usar emojis ni hashtags.`;

    const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey.trim(),
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `Genera un anuncio para redes sociales basado EXACTAMENTE en esta idea del cliente:
"${scratch}"

Respeta el producto, precio y CTA que el cliente indicó. Responde EXACTAMENTE en este formato JSON (sin markdown, sin bloques de código):
{"headline": "...", "copy": "..."}`,
                },
            ],
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('[Claude] HTTP Error:', response.status, errorBody);
        console.warn('[JARVIS] Anthropic falló. Entrando en modo local.');
        return generateLocalSeniorCopy(scratch);
    }

    const data = await response.json();
    const rawText: string = data.content[0]?.text || '';
    const text = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
        const parsed = JSON.parse(text);
        return {
            headline: parsed.headline || 'Impulso Digital Stephano.io',
            copy: parsed.copy || scratch,
        };
    } catch {
        return {
            headline: 'Impulso Digital Stephano.io',
            copy: text.substring(0, 300) || scratch,
        };
    }
}

/**
 * Fallback de J.A.R.V.I.S. — Genera copy respetando el scratch original.
 * Extrae precio, producto y CTA del texto en lugar de usar templates hardcodeados.
 */
function generateLocalSeniorCopy(scratch: string): { headline: string; copy: string } {
    const input = scratch.toLowerCase();

    const priceMatch = scratch.match(/\$[\d,]+|\d+\s*(dólares|dolares|usd)/i);
    const priceText = priceMatch ? priceMatch[0].replace(/dolares|dólares/i, 'USD') : null;
    const price = priceText ? `Desde ${priceText}` : 'Desde $350 USD';

    const isLanding = input.includes('landing');
    const isCRM = input.includes('crm');
    const isApp = input.includes('app') || input.includes('aplicación');
    const isEcommerce = input.includes('ecommerce') || input.includes('e-commerce') || input.includes('tienda');
    const isRealEstate = input.includes('inmobiliaria') || input.includes('real estate');

    const hasContact = input.includes('contactanos') || input.includes('contáctanos') || input.includes('contacto');
    const hasWeb = input.includes('ingresa') || input.includes('visita') || input.includes('web');
    const ctaText = hasContact && hasWeb
        ? 'Contáctenos o visítenos en Stephano.io'
        : hasContact
            ? 'Contáctenos en Stephano.io'
            : 'Descúbralo en Stephano.io';

    if (isLanding) {
        return {
            headline: "Landing Pages que Convierten",
            copy: `ATENCIÓN: Su próxima venta empieza en los primeros 3 segundos de su Landing Page.\n\nINTERÉS: En Stephano.io diseñamos Landing Pages de alto rendimiento:\n- Diseño "Liquid Glass" optimizado para conversión.\n- Carga ultra-rápida y SEO integrado.\n- CTAs estratégicos y A/B testing listo.\n\nDESEO: ${price}. Sin contratos largos, resultados inmediatos.\n\nACCIÓN: ${ctaText}.`
        };
    }
    if (isCRM) {
        return {
            headline: "CRM que Escala su Negocio",
            copy: `ATENCIÓN: Cada lead sin seguimiento es dinero que regala a su competencia.\n\nINTERÉS: Construimos su CRM a medida con Stephano.io:\n- Automatización de pipeline completa.\n- Dashboard en tiempo real.\n- Escalable desde día uno.\n\nDESEO: ${price}. Inversión que se paga sola.\n\nACCIÓN: ${ctaText}.`
        };
    }
    if (isEcommerce) {
        return {
            headline: "E-commerce que Vende Solo",
            copy: `ATENCIÓN: El 73% de los compradores online abandona tiendas lentas o mal diseñadas.\n\nINTERÉS: Construimos su tienda E-commerce con Stephano.io:\n- Checkout optimizado para conversión.\n- Catálogo escalable + panel de admin.\n- Integración de pagos y envíos.\n\nDESEO: ${price}. Plataforma profesional, resultados reales.\n\nACCIÓN: ${ctaText}.`
        };
    }
    if (isRealEstate) {
        return {
            headline: "¿Su inmobiliaria escala o se estanca?",
            copy: `ATENCIÓN: El mercado inmobiliario post-2025 no admite ineficiencias manuales.\n\nINTERÉS: Implementamos ecosistemas digitales para su inmobiliaria:\n- Calificación de leads 24/7.\n- CRM + SEO avanzado para dominancia local.\n\nDESEO: ${price}. Robustez de multinacional, agilidad de startup.\n\nACCIÓN: ${ctaText}.`
        };
    }
    if (isApp) {
        return {
            headline: "Su App. Su Ventaja Competitiva.",
            copy: `ATENCIÓN: El 80% de las apps mueren por mala arquitectura inicial.\n\nINTERÉS: Desarrollamos aplicaciones con estándares de Silicon Valley:\n- React Native / Next.js escalable.\n- Backend robusto y seguro.\n- UX diseñado para retención.\n\nDESEO: ${price}. Desarrollo profesional, entrega garantizada.\n\nACCIÓN: ${ctaText}.`
        };
    }

    return {
        headline: "Ingeniería Digital de Élite",
        copy: `ATENCIÓN: Deje de comprar sitios web. Empiece a invertir en activos digitales.\n\nINTERÉS: Construimos su presencia digital con estándares de Silicon Valley:\n- Web apps escalables (Next.js / React).\n- Diseño "Liquid Glass" de ultra-lujo.\n- Automatización de flujos de venta.\n\nDESEO: ${price}. Ingeniería real para negocios reales.\n\nACCIÓN: ${ctaText}.`
    };
}

// ─────────────────────────────────────────
// IMAGE GENERATION — Gemini 2.0 Flash
// ─────────────────────────────────────────

const GEMINI_IMAGE_MODEL = 'gemini-2.0-flash-exp-image-generation';

const IMAGE_ANGLES = [
    {
        label: 'Hero 1:1',
        buildPrompt: (headline: string, priceTag: string) => `
Create a premium 1:1 square social media post for Stephano.io.
Style: Apple/Tesla luxury tech aesthetic. Deep black #0A0A0A background, electric cyan #00D9FF accents.
Layout: MacBook Air + iPad + iPhone 16 Pro in sleek device trilogy, centered composition.
Embedded text (clear, bold, legible):
- Large headline: "${headline}"
- Price badge: ${priceTag}
- Small badges row: "Hosting" | "SEO Pro" | "Ultra-Rápido" | "Alta Conversión"
- Footer: "Stephano.io — Digital Engineering"
Quality: 8K, razor-sharp, professional product photography lighting.`,
    },
    {
        label: 'Pain Point 1:1',
        buildPrompt: (headline: string, priceTag: string) => `
Create a bold 1:1 square social media post for Stephano.io.
Style: Split-panel dramatic design. Deep black background, electric blue #0066FF accents.
Layout: Left dark panel = problem. Right cyan-lit panel = solution. Strong contrast divider.
Embedded text:
- Left side: "EL PROBLEMA:" label + "Su negocio no convierte online" in faded text
- Right side: "LA SOLUCIÓN:" label + "${headline}" in bold white
- Bottom right: ${priceTag}
- Footer: "Stephano.io"
Quality: High contrast, editorial magazine style, 8K.`,
    },
    {
        label: 'Resultados 1:1',
        buildPrompt: (headline: string, priceTag: string) => `
Create a stats-forward 1:1 square social media post for Stephano.io.
Style: Bold typography-dominant design. Dark background #0A0A0A, glowing cyan number highlights.
Layout: Three stat cards with large numbers.
Embedded text:
- Top title: "RESULTADOS REALES"
- Stat 1: "37%" + "más conversiones"
- Stat 2: "2 sem." + "tiempo de entrega"
- Stat 3: "99%" + "clientes satisfechos"
- Center: "${headline}"
- Price: ${priceTag}
- Footer: "Stephano.io"
Quality: Clean data visualization aesthetic, 8K sharp.`,
    },
    {
        label: 'Story CTA 9:16',
        buildPrompt: (headline: string, priceTag: string) => `
Create a 9:16 vertical story format social media post for Stephano.io.
Style: Full-screen premium vertical layout. Deep black background, liquid glass cyan elements.
Layout: Top 25% = abstract cyan gradient texture. Middle 50% = text block centered. Bottom 25% = CTA button.
Embedded text (safe zone: 15%-85% from top):
- Small top brand: "STEPHANO.IO"
- Main headline: "${headline}"
- Sub text: ${priceTag}
- CTA button: "Contáctenos Ahora"
- Very bottom: "stephano.io"
Quality: 9:16 ratio, story-optimized, vibrant but minimal, 8K.`,
    },
];

async function callGeminiImage(prompt: string, geminiKey: string): Promise<string | null> {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${geminiKey}`,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
                }),
            }
        );
        if (!response.ok) {
            console.error('[Gemini]', response.status, await response.text());
            return null;
        }
        const data = await response.json();
        for (const part of (data.candidates?.[0]?.content?.parts || [])) {
            if (part.inlineData?.mimeType?.startsWith('image/')) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (err) {
        console.error('[Gemini] Exception:', err);
        return null;
    }
}

function fallbackImageUrl(headline: string, isVertical = false): string {
    const w = isVertical ? 608 : 1024;
    const h = isVertical ? 1080 : 1024;
    const prompt = encodeURIComponent(`Premium tech social media ad, dark background #0A0A0A, cyan blue #00D9FF neon accents, bold headline: "${headline}", Stephano.io branding, Apple Tesla luxury aesthetic, minimal clean`);
    return `https://image.pollinations.ai/prompt/${prompt}?width=${w}&height=${h}&nologo=true&seed=${Math.floor(Math.random() * 99999)}&model=flux`;
}

async function generateSingleImage(headline: string, scratch: string): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const priceMatch = scratch.match(/\$[\d,]+|\d+\s*(dólares|dolares|usd)/i);
    const priceTag = priceMatch
        ? `Desde ${priceMatch[0].replace(/dolares|dólares/i, 'USD').toUpperCase()}`
        : 'Ingeniería de Élite';

    if (!geminiKey) return fallbackImageUrl(headline);

    const prompt = `Create a high-end social media ad banner for Stephano.io.
Aesthetic: MINIMALIST LUXURY TECH / SILICON VALLEY.
Composition: Professional studio shot of a MacBook + iPad on deep black (#0A0A0A) surface.
Background: Smooth charcoal black with subtle electric cyan (#00D9FF) light highlights.
Text (STRICT LEGIBILITY):
- Main Headline: "${headline}" (Centered, large bold sans-serif, high contrast white).
- Price callout: "${priceTag}" (Clean sharp badge).
- Branding: "STEPHANO.IO" (Bottom center, small).
Quality: Razor-sharp 8K. Brand colors: #0A0A0A and #00D9FF. Format: 1:1 square.`;

    const url = await callGeminiImage(prompt, geminiKey);
    return url ?? fallbackImageUrl(headline);
}

async function generateBatchImagesWithProgress(
    headline: string,
    scratch: string,
    onProgress?: OnProgress
): Promise<string> {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const priceMatch = scratch.match(/\$[\d,]+|\d+\s*(dólares|dolares|usd)/i);
    const priceTag = priceMatch
        ? `Desde ${priceMatch[0].replace(/dolares|dólares/i, 'USD').toUpperCase()}`
        : 'Ingeniería de Élite';

    if (!geminiKey) {
        const fallbacks = IMAGE_ANGLES.map(a => fallbackImageUrl(headline, a.label.includes('9:16')));
        return JSON.stringify(fallbacks);
    }

    const results = await Promise.all(
        IMAGE_ANGLES.map(async (angle, idx) => {
            const url = await callGeminiImage(angle.buildPrompt(headline, priceTag), geminiKey);
            const percent = 50 + ((idx + 1) / IMAGE_ANGLES.length) * 40;
            if (url) {
                onProgress?.({ step: 'images', status: 'image_done', message: `${angle.label} generado`, percent, idx, label: angle.label });
                return url;
            }
            onProgress?.({ step: 'images', status: 'image_fallback', message: `${angle.label} usando fallback`, percent, idx, label: angle.label });
            return fallbackImageUrl(headline, angle.label.includes('9:16'));
        })
    );

    return JSON.stringify(results);
}

// ─────────────────────────────────────────
// PUBLIC IMAGE API (for regeneration)
// ─────────────────────────────────────────

export async function generateAdImages(
    headline: string,
    scratch: string,
    mode: 'single' | 'batch' = 'single'
): Promise<string> {
    return mode === 'batch'
        ? generateBatchImagesWithProgress(headline, scratch)
        : generateSingleImage(headline, scratch);
}

// ─────────────────────────────────────────
// PIPELINE — Streaming version (for SSE route)
// ─────────────────────────────────────────

export async function runCreativePipelineStreaming(
    scratch: string,
    mode: 'single' | 'batch' = 'single',
    onProgress: OnProgress
): Promise<{ headline: string; copy: string; mediaUrl: string }> {
    onProgress({ step: 'copy', status: 'in_progress', message: 'Analizando idea con Claude Sonnet 4.6...', percent: 10 });

    const { headline, copy } = await generateAdCopy(scratch);
    onProgress({ step: 'copy', status: 'done', message: `Copy listo — "${headline}"`, percent: 40, headline });

    if (mode === 'batch') {
        onProgress({ step: 'images', status: 'in_progress', message: 'Generando 4 variaciones con Gemini 2.0...', percent: 45 });
        const mediaUrl = await generateBatchImagesWithProgress(headline, scratch, onProgress);
        onProgress({ step: 'images', status: 'done', message: '4 imagenes generadas', percent: 92 });
        return { headline, copy, mediaUrl };
    } else {
        onProgress({ step: 'images', status: 'in_progress', message: 'Generando imagen con Gemini 2.0...', percent: 55 });
        const mediaUrl = await generateSingleImage(headline, scratch);
        onProgress({ step: 'images', status: 'done', message: 'Imagen generada', percent: 92 });
        return { headline, copy, mediaUrl };
    }
}

// ─────────────────────────────────────────
// PIPELINE — Legacy synchronous (kept for backward compat)
// ─────────────────────────────────────────

export async function runCreativePipeline(scratch: string, mode: 'single' | 'batch' = 'single') {
    const { headline, copy } = await generateAdCopy(scratch);
    const mediaUrl = mode === 'batch'
        ? await generateBatchImagesWithProgress(headline, scratch)
        : await generateSingleImage(headline, scratch);
    return { headline, copy, mediaUrl };
}
