// ── Revenue Predictor Service ──
// Analiza el pipeline de ventas y proyecta ingresos para Stephano.io

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────

export interface PipelineStats {
    totalOpenValue: number;
    projectedRevenue: number;
    stageCounts: Record<string, number>;
    stageValues: Record<string, number>;
    weeklyLeads: number;
    closedThisMonth: number;
    totalClosedRevenue: number;
    targetGap: number;
    onTrack: boolean;
}

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────

const TARGET_REVENUE = 80000;

// Close probability by pipeline stage
const STAGE_PROBABILITY: Record<string, number> = {
    nuevo_lead: 0.05,
    lead_analizado: 0.10,
    lead_calificado: 0.20,
    propuesta_enviada: 0.40,
    negociacion_activa: 0.70,
    contrato_cerrado: 1.00,
    contrato_perdido: 0.00,
};

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

/**
 * Parses presupuesto_rango string to a numeric USD estimate.
 * Examples:
 *   "$350"          → 350
 *   "$500-$1,000"   → 750
 *   "$1,000-$5,000" → 3000
 *   "$5,000-$10,000"→ 7500
 *   "$10,000+"      → 15000
 *   "$25,000+"      → 30000
 */
export function parsePresupuesto(rango?: string | null): number {
    if (!rango) return 500; // Default estimate

    const clean = rango.replace(/\s/g, '').toLowerCase();

    // Handle ranges like "$1,000-$5,000"
    const rangeMatch = clean.match(/\$?([\d,]+)-\$?([\d,]+)/);
    if (rangeMatch) {
        const low = parseInt(rangeMatch[1].replace(/,/g, ''));
        const high = parseInt(rangeMatch[2].replace(/,/g, ''));
        return Math.round((low + high) / 2);
    }

    // Handle "+" values like "$10,000+" or "$25,000+"
    const plusMatch = clean.match(/\$?([\d,]+)\+/);
    if (plusMatch) {
        const base = parseInt(plusMatch[1].replace(/,/g, ''));
        if (base >= 25000) return 30000;
        if (base >= 10000) return 15000;
        if (base >= 5000) return 7500;
        return Math.round(base * 1.3);
    }

    // Handle single values like "$350"
    const singleMatch = clean.match(/\$?([\d,]+)/);
    if (singleMatch) {
        return parseInt(singleMatch[1].replace(/,/g, ''));
    }

    return 500;
}

// ─────────────────────────────────────────
// MAIN — getPipelineStats
// ─────────────────────────────────────────

export async function getPipelineStats(): Promise<PipelineStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch all leads
    const leads = await prisma.lead.findMany({
        select: {
            id: true,
            presupuesto_rango: true,
            pipelineStage: true,
            fecha_creacion: true,
            leadScore: true,
        },
    });

    // Initialize stage counts and values
    const allStages = Object.keys(STAGE_PROBABILITY);
    const stageCounts: Record<string, number> = {};
    const stageValues: Record<string, number> = {};
    for (const stage of allStages) {
        stageCounts[stage] = 0;
        stageValues[stage] = 0;
    }

    let totalOpenValue = 0;
    let projectedRevenue = 0;
    let totalClosedRevenue = 0;
    let closedThisMonth = 0;
    let weeklyLeads = 0;

    for (const lead of leads) {
        const stage = lead.pipelineStage || 'nuevo_lead';
        const value = parsePresupuesto(lead.presupuesto_rango);
        const probability = STAGE_PROBABILITY[stage] ?? 0.05;

        // Count by stage
        stageCounts[stage] = (stageCounts[stage] || 0) + 1;
        stageValues[stage] = (stageValues[stage] || 0) + value;

        // Accumulate projected revenue (excluding lost)
        if (stage !== 'contrato_perdido') {
            totalOpenValue += value;
            projectedRevenue += value * probability;
        }

        // Closed revenue
        if (stage === 'contrato_cerrado') {
            totalClosedRevenue += value;
            if (lead.fecha_creacion >= startOfMonth) {
                closedThisMonth++;
            }
        }

        // Weekly leads
        if (lead.fecha_creacion >= sevenDaysAgo) {
            weeklyLeads++;
        }
    }

    const targetGap = Math.max(0, TARGET_REVENUE - totalClosedRevenue);
    const onTrack = projectedRevenue >= targetGap * 0.5;

    return {
        totalOpenValue: Math.round(totalOpenValue),
        projectedRevenue: Math.round(projectedRevenue),
        stageCounts,
        stageValues: Object.fromEntries(
            Object.entries(stageValues).map(([k, v]) => [k, Math.round(v)])
        ),
        weeklyLeads,
        closedThisMonth,
        totalClosedRevenue: Math.round(totalClosedRevenue),
        targetGap: Math.round(targetGap),
        onTrack,
    };
}
