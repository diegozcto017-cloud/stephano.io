import prisma from '@/lib/prisma';
import type { LeadInput } from '@/server/validators/lead.validator';

export class LeadService {
    static async create(data: LeadInput) {
        const lead = await prisma.lead.create({
            data: {
                nombre: data.nombre,
                empresa: data.empresa || null,
                email: data.email,
                telefono: data.telefono || null,
                url_proyecto: data.url_proyecto || null,
                tipo_proyecto: data.tipo_proyecto,
                presupuesto_rango: data.presupuesto_rango || null,
                urgencia: data.urgencia || null,
                mensaje: data.mensaje || null,
            },
        });

        return lead;
    }

    static async getAll() {
        return prisma.lead.findMany({
            orderBy: { fecha_creacion: 'desc' },
        });
    }

    static async getById(id: number) {
        return prisma.lead.findUnique({ where: { id } });
    }

    static async update(id: number, data: Partial<LeadInput> & { estado?: string; progreso?: number; notas_internas?: string; url_proyecto?: string }) {
        return prisma.lead.update({
            where: { id },
            data: {
                ...data,
                fecha_actualizacion: new Date(),
            },
        });
    }

    static async delete(id: number) {
        return prisma.lead.delete({
            where: { id },
        });
    }

    static async seedSamples() {
        const samples = [
            {
                nombre: 'Carlos Mendoza',
                empresa: 'TechFlow Solutions',
                email: 'carlos@techflow.com',
                tipo_proyecto: 'sistema_personalizado',
                presupuesto_rango: '$10,000 - $25,000',
                urgencia: 'alta',
                mensaje: 'Necesitamos una plataforma de gestión de inventario para 5 almacenes.',
                estado: 'nuevo',
                progreso: 0,
            },
            {
                nombre: 'Elena Rodríguez',
                empresa: 'Glow Studio',
                email: 'elena@glowstudio.es',
                tipo_proyecto: 'desarrollo_web',
                presupuesto_rango: '$3,000 - $5,000',
                urgencia: 'media',
                mensaje: 'Landing page para captación de clientes en centro estético.',
                estado: 'en_progreso',
                progreso: 45,
            },
            {
                nombre: 'Juan Pérez',
                empresa: 'LogiTrans SA',
                email: 'juan.perez@logitrans.com',
                tipo_proyecto: 'automatizacion',
                presupuesto_rango: '$25,000+',
                urgencia: 'urgente',
                mensaje: 'Automatización de pipeline de datos logísticos.',
                estado: 'completado',
                progreso: 100,
            }
        ];

        for (const sample of samples) {
            await prisma.lead.create({ data: sample });
        }
    }

    static async getStats() {
        const [total, nuevo, enProgreso, completado] = await Promise.all([
            prisma.lead.count(),
            prisma.lead.count({ where: { estado: 'nuevo' } }),
            prisma.lead.count({ where: { estado: 'en_progreso' } }),
            prisma.lead.count({ where: { estado: 'completado' } }),
        ]);

        return { total, nuevo, enProgreso, completado };
    }
}
