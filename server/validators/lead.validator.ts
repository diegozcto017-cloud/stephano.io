import { z } from 'zod';

export const leadSchema = z.object({
    nombre: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(120, 'El nombre no puede exceder 120 caracteres')
        .trim(),
    empresa: z
        .string()
        .max(120, 'La empresa no puede exceder 120 caracteres')
        .trim()
        .optional()
        .or(z.literal('')),
    email: z
        .string()
        .email('El email no es válido')
        .max(255, 'El email no puede exceder 255 caracteres')
        .trim()
        .toLowerCase(),
    telefono: z
        .string()
        .max(30, 'El teléfono no puede exceder 30 caracteres')
        .optional()
        .or(z.literal('')),
    url_proyecto: z
        .string()
        .url('La URL no es válida')
        .optional()
        .or(z.literal('')),
    tipo_proyecto: z.enum([
        'desarrollo_web',
        'sistema_personalizado',
        'app_movil',
        'automatizacion',
        'ecommerce',
        'optimizacion',
        'otro',
        // New UI types
        'landing',
        'webapp',
        'portfolio',
        'redesign'
    ] as const),
    presupuesto_rango: z
        .string()
        .max(60)
        .optional()
        .or(z.literal('')),
    urgencia: z
        .enum(['baja', 'media', 'alta', 'urgente', 'standard', 'priority', 'express'])
        .optional(),
    mensaje: z
        .string()
        .max(2000, 'El mensaje no puede exceder 2000 caracteres')
        .trim()
        .optional()
        .or(z.literal('')),
});

export const leadUpdateSchema = z.object({
    nombre: z.string().min(2).optional(),
    empresa: z.string().optional(),
    email: z.string().email().optional(),
    telefono: z.string().optional(),
    url_proyecto: z.string().url('La URL no es válida').optional().or(z.literal('')),
    tipo_proyecto: z.enum([
        'desarrollo_web',
        'sistema_personalizado',
        'app_movil',
        'automatizacion',
        'ecommerce',
        'optimizacion',
        'otro',
        'landing',
        'webapp',
        'portfolio',
        'redesign'
    ] as const).optional(),
    presupuesto_rango: z.string().optional(),
    urgencia: z.enum(['baja', 'media', 'alta', 'urgente', 'standard', 'priority', 'express']).optional(),
    mensaje: z.string().optional(),
    estado: z.enum(['nuevo', 'en_progreso', 'completado', 'cancelado']).optional(),
    progreso: z.number().min(0).max(100).optional(),
    notas_internas: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
