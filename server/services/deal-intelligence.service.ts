// ── Deal Intelligence Service ──
// Motor de puntuación y clasificación de leads B2B para Stephano.io
// Evalúa leads con IA para priorizar oportunidades de ventas en Costa Rica

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export interface LeadScoreResult {
    score: number;           // 1-100
    category: 'prioritaria' | 'viable' | 'baja';
    factors: {
        urgencia: number;        // 0-25
        presupuesto: number;     // 0-25
        digitalizacion: number;  // 0-25
        impacto: number;         // 0-25
    };
    recommendation: string;
}

export interface LeadData {
    nombre: string;
    empresa?: string;
    tipo_proyecto: string;
    presupuesto_rango?: string;
    urgencia?: string;
    mensaje?: string;
}

// ─────────────────────────────────────────
// SYSTEM PROMPT — Deal Intelligence
// ─────────────────────────────────────────

const DEAL_INTELLIGENCE_SYSTEM = `Eres el Deal Intelligence Engine de Stephano.io, una agencia de desarrollo web y software B2B en Costa Rica.

Tu misión es evaluar leads entrantes y asignarles un puntaje del 1 al 100 basado en su potencial de conversión en un contrato real.

Stephano.io ofrece:
- Landing Pages: desde $350 USD
- E-commerce: desde $1,200 USD
- CRM / Web App: desde $1,500 USD
- Automatizaciones y sistemas empresariales: desde $500 USD
- Mantenimiento mensual: desde $100 USD/mes

Clientes ideales: empresas medianas o pequeñas en Costa Rica y Centroamérica que buscan digitalizar operaciones, aumentar ventas o competitividad.

Criterios de evaluación (cada uno de 0 a 25 puntos):

1. URGENCIA (0-25): ¿Qué tan pronto necesita el cliente solución?
   - 25: Necesita solución inmediata (esta semana/mes)
   - 15: Plazo de 1-3 meses
   - 5: Explorando opciones sin fecha definida

2. PRESUPUESTO (0-25): ¿El presupuesto del cliente se alinea con los precios de Stephano?
   - 25: Presupuesto de $1,000+ USD explícito o implícito
   - 15: Presupuesto de $300-$1,000 USD
   - 5: Presupuesto muy bajo o indefinido

3. DIGITALIZACIÓN (0-25): ¿Cuánto necesita el cliente digitalizarse?
   - 25: Sin presencia digital o sistema desactualizado urgente
   - 15: Tiene algo básico pero necesita mejorar
   - 5: Ya está digitalizado, mejora opcional

4. IMPACTO (0-25): ¿Qué impacto tendrá el proyecto en su negocio?
   - 25: Impacto directo en ingresos, ventas o eficiencia crítica
   - 15: Mejora significativa pero no crítica
   - 5: Proyecto cosmético o de bajo impacto

Responde SIEMPRE en JSON válido con esta estructura exacta:
{
  "score": <número del 1 al 100>,
  "category": "<prioritaria|viable|baja>",
  "factors": {
    "urgencia": <0-25>,
    "presupuesto": <0-25>,
    "digitalizacion": <0-25>,
    "impacto": <0-25>
  },
  "recommendation": "<texto en español de 1-2 oraciones con acción concreta recomendada>"
}

Reglas de categoría:
- 80-100: "prioritaria" (contactar en menos de 24 horas)
- 60-79: "viable" (contactar en 2-3 días)
- 0-59: "baja" (nutrir con contenido, seguimiento semanal)`;

// ─────────────────────────────────────────
// HELPER — Claude API call
// ─────────────────────────────────────────

async function callClaude(system: string, userMessage: string, maxTokens = 512): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey?.trim()) throw new Error('ANTHROPIC_API_KEY no configurado');

    const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
            'x-api-key': apiKey.trim(),
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: maxTokens,
            system,
            messages: [{ role: 'user', content: userMessage }],
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Claude API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const raw: string = data.content[0]?.text || '';
    return raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

// ─────────────────────────────────────────
// SCORE LEAD — Main function
// ─────────────────────────────────────────

export async function scoreLead(leadData: LeadData): Promise<LeadScoreResult> {
    const userMessage = `Evalúa este lead de Stephano.io y devuelve el JSON de puntuación:

Nombre: ${leadData.nombre}
Empresa: ${leadData.empresa || 'No especificada'}
Tipo de proyecto: ${leadData.tipo_proyecto}
Rango de presupuesto: ${leadData.presupuesto_rango || 'No especificado'}
Urgencia declarada: ${leadData.urgencia || 'No especificada'}
Mensaje del cliente: ${leadData.mensaje || 'Sin mensaje adicional'}

Analiza todos los datos disponibles y asigna el puntaje según los criterios establecidos.`;

    const raw = await callClaude(DEAL_INTELLIGENCE_SYSTEM, userMessage, 512);

    let parsed: LeadScoreResult;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error(`Error al parsear respuesta de Deal Intelligence: ${raw}`);
    }

    // Validate and normalize category based on score
    const score = Math.max(1, Math.min(100, Math.round(parsed.score)));
    let category: 'prioritaria' | 'viable' | 'baja';
    if (score >= 80) category = 'prioritaria';
    else if (score >= 60) category = 'viable';
    else category = 'baja';

    return {
        score,
        category,
        factors: {
            urgencia: Math.max(0, Math.min(25, parsed.factors?.urgencia ?? 0)),
            presupuesto: Math.max(0, Math.min(25, parsed.factors?.presupuesto ?? 0)),
            digitalizacion: Math.max(0, Math.min(25, parsed.factors?.digitalizacion ?? 0)),
            impacto: Math.max(0, Math.min(25, parsed.factors?.impacto ?? 0)),
        },
        recommendation: parsed.recommendation || 'Revisar lead manualmente.',
    };
}
