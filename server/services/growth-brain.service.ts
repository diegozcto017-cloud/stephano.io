// ── Growth Brain Service ──
// Motor de inteligencia para crecimiento orgánico en Instagram
// 5 motores: Content Discovery, Viral Content, Distribution, Performance Lab, Lead Conversion

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export type ProgressEvent = {
    step: string;
    status: string;
    message: string;
    percent?: number;
    [key: string]: unknown;
};

export type OnProgress = (event: ProgressEvent) => void;

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export interface ContentIdea {
    title: string;
    angle: string;
    format: 'reel' | 'carousel';
    objective: string;
    viralPotential: 'alto' | 'medio' | 'bajo';
    hook: string;
}

export interface ViralContent {
    hook: string;
    body: string;
    cta: string;
    script?: string;       // Para reels: guión completo
    slides?: string[];     // Para carruseles: contenido por slide
    caption: string;
    hashtags: string;
    objective: string;
}

export interface CalendarEntry {
    day: number;
    format: 'reel' | 'carousel' | 'story';
    topic: string;
    objective: string;
    hook: string;
}

export interface PerformanceAnalysis {
    score: number;
    diagnosis: string;
    weakPoints: string[];
    optimizedVersions: Array<{ version: string; change: string; newHook: string; newCta: string }>;
    recommendation: string;
}

// ─────────────────────────────────────────
// ATTACK SEQUENCE — 10 publicaciones base
// ─────────────────────────────────────────

export const ATTACK_SEQUENCE = [
    { seq: 1, type: 'reel',     objective: 'alcance',      title: 'Gancho fuerte sin contexto',     description: 'Captura atención sin revelar contexto' },
    { seq: 2, type: 'reel',     objective: 'identificación', title: 'El problema común',             description: 'Describe el dolor del cliente ideal' },
    { seq: 3, type: 'carousel', objective: 'guardados',    title: 'Tutorial simple paso a paso',    description: 'Contenido educativo de alto valor' },
    { seq: 4, type: 'reel',     objective: 'viralidad',    title: 'El error que todos cometen',     description: 'Contenido controversial/educativo' },
    { seq: 5, type: 'reel',     objective: 'credibilidad', title: 'Demo de software en vivo',       description: 'Muestra el producto/proceso real' },
    { seq: 6, type: 'carousel', objective: 'compartidos',  title: 'Antes vs Después',               description: 'Transformación visual impactante' },
    { seq: 7, type: 'carousel', objective: 'guardados',    title: 'Checklist práctico',             description: 'Lista de valor que guardarán' },
    { seq: 8, type: 'reel',     objective: 'autoridad',    title: 'El proceso de desarrollo',       description: 'Behind the scenes del trabajo real' },
    { seq: 9, type: 'reel',     objective: 'confianza',    title: 'Caso real de cliente',           description: 'Resultados reales, historia real' },
    { seq: 10, type: 'reel',    objective: 'leads',        title: 'Invitación a cotizar',           description: 'CTA directo hacia stephano.io' },
];

// ─────────────────────────────────────────
// HELPER — Claude API call
// ─────────────────────────────────────────

async function callClaude(system: string, userMessage: string, maxTokens = 2048): Promise<string> {
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
// MOTOR 1 — CONTENT DISCOVERY ENGINE
// ─────────────────────────────────────────

const DISCOVERY_SYSTEM = `Eres el Content Discovery Engine de Stephano.io.
Tu misión es identificar ideas de contenido con alto potencial viral para Instagram.

Stephano.io es una empresa de desarrollo web y software en Costa Rica que crea:
- Landing Pages ($350 USD), E-commerce ($1,200 USD), CRM/Apps ($1,500 USD)
- Automatizaciones, aplicaciones móviles y sistemas empresariales

Tu público objetivo: empresas y emprendedores en Costa Rica y Latinoamérica.
Canal activo: Instagram (Reels y Carruseles).

CRITERIOS DE VIRALIDAD:
- Hook irresistible (crea curiosidad o señala problema claro)
- Identificación inmediata del espectador con el problema
- Promesa de valor clara en los primeros 3 segundos
- Formato apropiado para el algoritmo de Instagram

REGLA: Responde SOLO con JSON válido sin markdown.`;

export async function generateContentIdeas(
    niche: string,
    audience: string,
    count = 8
): Promise<ContentIdea[]> {
    const text = await callClaude(
        DISCOVERY_SYSTEM,
        `Genera ${count} ideas de contenido viral para Instagram sobre: "${niche}"
Audiencia objetivo: ${audience}

Responde con este JSON exacto (array de objetos):
[
  {
    "title": "título de la idea",
    "angle": "ángulo creativo único",
    "format": "reel" o "carousel",
    "objective": "alcance|guardados|viralidad|credibilidad|compartidos|leads",
    "viralPotential": "alto|medio|bajo",
    "hook": "el gancho de apertura (primeras palabras)"
  }
]`,
        2000
    );

    try {
        return JSON.parse(text) as ContentIdea[];
    } catch {
        return [];
    }
}

// ─────────────────────────────────────────
// MOTOR 2 — VIRAL CONTENT ENGINE
// ─────────────────────────────────────────

const VIRAL_SYSTEM = `Eres el Viral Content Engine de Stephano.io.
Generas contenido optimizado para el algoritmo de Instagram usando la estructura:

ESTRUCTURA ALGORÍTMICA:
1. HOOK (0-3 seg): Gancho que detiene el scroll — pregunta, dato impactante o afirmación inesperada
2. VALOR (3-15 seg): Entrega el valor prometido con claridad y ritmo rápido
3. RETENCIÓN (15-30 seg): Mantiene el interés con giros, listas o revelaciones
4. INTERACCIÓN (30-45 seg): Pregunta al espectador, crea discusión
5. CTA (últimos 5 seg): Llamada a la acción clara hacia stephano.io

REGLAS DE CONTENIDO:
- Tono: Directo, experto pero accesible. No formal extremo.
- Sin emojis en scripts de reels. Sí en captions.
- Captions: máximo 150 palabras, hook en primera línea
- Hashtags: 5-8 relevantes en español + inglés
- Empresa: Stephano.io — desarrollo web y software en Costa Rica

REGLA: Responde SOLO con JSON válido sin markdown.`;

export async function generateViralContent(
    idea: string,
    format: 'reel' | 'carousel',
    objective: string,
    sequenceNumber?: number
): Promise<ViralContent> {
    const formatInstructions = format === 'reel'
        ? `Genera un guión de Reel de 45-60 segundos. Incluye marcadores de tiempo [0s], [5s], [15s], etc.
El campo "script" debe tener el guión completo con indicaciones de cámara.
El campo "slides" debe ser un array vacío [].`
        : `Genera contenido para Carrusel de 7-10 slides.
El campo "slides" debe ser un array donde cada elemento es el contenido de un slide (título + 2-3 bullet points).
El campo "script" debe ser null.`;

    const seqContext = sequenceNumber
        ? `Esta es la publicación #${sequenceNumber} de la secuencia de ataque inicial.`
        : '';

    const text = await callClaude(
        VIRAL_SYSTEM,
        `Genera contenido viral para Instagram sobre: "${idea}"
Formato: ${format}
Objetivo algorítmico: ${objective}
${seqContext}

${formatInstructions}

Responde con este JSON exacto:
{
  "hook": "gancho de apertura (primeras palabras, 3-7 palabras)",
  "body": "cuerpo del mensaje principal",
  "cta": "llamada a la acción final",
  "script": "guión completo con tiempos o null",
  "slides": ["slide 1", "slide 2", ...] o [],
  "caption": "caption optimizado para Instagram (max 150 palabras)",
  "hashtags": "#hashtag1 #hashtag2 ...",
  "objective": "${objective}"
}`,
        3000
    );

    try {
        return JSON.parse(text) as ViralContent;
    } catch {
        return {
            hook: idea.slice(0, 50),
            body: 'Contenido generado localmente',
            cta: 'Visita stephano.io para saber más',
            script: undefined,
            slides: [],
            caption: `${idea}\n\nVisita stephano.io`,
            hashtags: '#desarrolloweb #software #costarica #tecnologia #stephano',
            objective,
        };
    }
}

// ─────────────────────────────────────────
// MOTOR 3 — DISTRIBUTION ENGINE
// ─────────────────────────────────────────

const DISTRIBUTION_SYSTEM = `Eres el Distribution Engine de Stephano.io.
Creas calendarios de contenido de 30 días optimizados para el algoritmo de Instagram.

DISTRIBUCIÓN RECOMENDADA:
- Reels: 1 diario (prioridad máxima para alcance)
- Carruseles: 3 por semana (lunes, miércoles, viernes)
- Historias: 3 diarias (no incluir en calendario de posts)

EQUILIBRIO DE OBJETIVOS:
- 40% alcance/viralidad (Reels con hooks fuertes)
- 30% educativo/guardados (Carruseles y tutoriales)
- 20% credibilidad/autoridad (demos, casos, procesos)
- 10% conversión/leads (CTAs directos)

REGLA: Responde SOLO con JSON válido sin markdown.`;

export async function generate30DayCalendar(niche: string, audience: string): Promise<CalendarEntry[]> {
    const text = await callClaude(
        DISTRIBUTION_SYSTEM,
        `Genera un calendario de contenido de 30 días para Stephano.io.
Nicho: ${niche}
Audiencia: ${audience}

Genera exactamente 30 entradas (una por día). Los días 1-10 deben ser la Secuencia de Ataque para perfil nuevo.

Responde con este JSON exacto (array de 30 objetos):
[
  {
    "day": 1,
    "format": "reel|carousel|story",
    "topic": "tema específico del día",
    "objective": "alcance|guardados|viralidad|credibilidad|compartidos|leads|identificación|autoridad|confianza",
    "hook": "gancho de apertura"
  }
]`,
        4000
    );

    try {
        return JSON.parse(text) as CalendarEntry[];
    } catch {
        return [];
    }
}

// ─────────────────────────────────────────
// MOTOR 4 — PERFORMANCE LAB
// ─────────────────────────────────────────

const PERFORMANCE_SYSTEM = `Eres el Performance Lab de Stephano.io.
Analizas métricas de Instagram para diagnosticar por qué un contenido funcionó o falló,
y generas versiones optimizadas.

DIAGNÓSTICOS POSIBLES:
- Gancho débil: retención < 40% en primeros 3 segundos
- Ritmo lento: drop-off alto en el medio del video
- Mensaje confuso: pocas interacciones pero mucha vista
- CTA incorrecto: pocas acciones de conversión
- Tema irrelevante: pocas vistas totales desde no seguidores
- Excelente rendimiento: métricas sólidas en todos los indicadores

MÉTRICAS SALUDABLES PARA INSTAGRAM:
- Vistas: +1000 para cuenta < 1000 seguidores = bueno
- Retención: +40% = bueno, +60% = excelente
- Guardados: +2% de vistas = excelente
- Compartidos: +1% de vistas = excelente
- Nuevos seguidores: +0.5% de vistas = bueno

REGLA: Responde SOLO con JSON válido sin markdown.`;

export interface MetricsInput {
    views: number;
    retention: number;
    saves: number;
    shares: number;
    followersGained: number;
    comments: number;
    likes: number;
    originalTopic: string;
    originalHook: string;
    originalCta: string;
}

export async function analyzePerformance(metrics: MetricsInput): Promise<PerformanceAnalysis> {
    const text = await callClaude(
        PERFORMANCE_SYSTEM,
        `Analiza estas métricas de Instagram para Stephano.io:

Contenido: "${metrics.originalTopic}"
Hook usado: "${metrics.originalHook}"
CTA usado: "${metrics.originalCta}"

Métricas:
- Vistas: ${metrics.views}
- Retención: ${metrics.retention}%
- Guardados: ${metrics.saves}
- Compartidos: ${metrics.shares}
- Nuevos seguidores: ${metrics.followersGained}
- Comentarios: ${metrics.comments}
- Likes: ${metrics.likes}

Responde con este JSON exacto:
{
  "score": número del 1 al 10,
  "diagnosis": "diagnóstico principal en 2-3 oraciones",
  "weakPoints": ["punto débil 1", "punto débil 2"],
  "optimizedVersions": [
    {
      "version": "Versión A",
      "change": "qué cambiar y por qué",
      "newHook": "nuevo gancho de apertura",
      "newCta": "nuevo CTA"
    },
    {
      "version": "Versión B",
      "change": "qué cambiar y por qué",
      "newHook": "nuevo gancho de apertura",
      "newCta": "nuevo CTA"
    },
    {
      "version": "Versión C",
      "change": "qué cambiar y por qué",
      "newHook": "nuevo gancho de apertura",
      "newCta": "nuevo CTA"
    }
  ],
  "recommendation": "recomendación accionable principal"
}`,
        2500
    );

    try {
        return JSON.parse(text) as PerformanceAnalysis;
    } catch {
        return {
            score: 5,
            diagnosis: 'Análisis no disponible. Revisa la configuración de la API.',
            weakPoints: [],
            optimizedVersions: [],
            recommendation: 'Intenta nuevamente con más métricas.',
        };
    }
}

// ─────────────────────────────────────────
// MOTOR 5 — LEAD CONVERSION ENGINE (CTAs)
// ─────────────────────────────────────────

export interface CTASet {
    pinnedComment: string;
    bioLink: string;
    storySwipeUp: string;
    reelCta: string;
    carouselLastSlide: string;
}

const CTA_SYSTEM = `Eres el Lead Conversion Engine de Stephano.io.
Generas CTAs estratégicos para convertir seguidores en clientes potenciales.

DESTINO FINAL: stephano.io
ACCIÓN DESEADA: que el usuario visite stephano.io para cotizar su proyecto

TIPOS DE CTA:
- Comentario fijado: pregunta que genera conversación y dirige al DM o web
- Bio: breve y directo, máximo 10 palabras
- Historia swipe-up: urgencia y beneficio claro
- CTA de reel: últimas palabras antes del corte
- Último slide de carrusel: invitación visual con acción clara

REGLA: CTAs en español. Directos, sin presión extrema. Deja que el valor del contenido haga el trabajo.
REGLA: Responde SOLO con JSON válido sin markdown.`;

export async function generateCTASet(topic: string, format: string): Promise<CTASet> {
    const text = await callClaude(
        CTA_SYSTEM,
        `Genera un set de CTAs para contenido sobre: "${topic}" (formato: ${format})

Responde con este JSON exacto:
{
  "pinnedComment": "comentario fijado con pregunta para generar conversación",
  "bioLink": "texto del link en bio (max 8 palabras)",
  "storySwipeUp": "texto para historia con swipe-up (max 15 palabras)",
  "reelCta": "CTA verbal para últimos 5 segundos del reel",
  "carouselLastSlide": "texto del último slide de carrusel con CTA"
}`,
        1000
    );

    try {
        return JSON.parse(text) as CTASet;
    } catch {
        return {
            pinnedComment: '¿Tienes un proyecto en mente? Cuéntame en los comentarios o visita stephano.io',
            bioLink: 'Cotiza tu proyecto en stephano.io',
            storySwipeUp: 'Desliza para ver más',
            reelCta: 'Visita stephano.io para empezar tu proyecto',
            carouselLastSlide: '¿Listo para dar el siguiente paso? Visita stephano.io',
        };
    }
}

// ─────────────────────────────────────────
// PIPELINE STREAMING — Generación con progreso
// ─────────────────────────────────────────

export async function runGrowthBrainPipeline(
    idea: string,
    format: 'reel' | 'carousel',
    objective: string,
    onProgress: OnProgress,
    sequenceNumber?: number
): Promise<ViralContent & { ctaSet: CTASet }> {
    onProgress({ step: 'content', status: 'in_progress', message: 'Analizando idea con Growth Brain...', percent: 15 });

    const content = await generateViralContent(idea, format, objective, sequenceNumber);
    onProgress({ step: 'content', status: 'done', message: `Contenido generado — "${content.hook}"`, percent: 60 });

    onProgress({ step: 'cta', status: 'in_progress', message: 'Generando CTAs de conversión...', percent: 70 });
    const ctaSet = await generateCTASet(idea, format);
    onProgress({ step: 'cta', status: 'done', message: 'CTAs listos', percent: 90 });

    return { ...content, ctaSet };
}
