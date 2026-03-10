import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Inferir el tipo "Ad" del esquema sin importar directamente
type Ad = Awaited<ReturnType<typeof prisma.ad.findFirst>> & {};

export type CreateAdDTO = {
    scratch: string;
    headline: string | null;
    copy: string | null;
    mediaUrl: string | null;
    mediaType: string;
    status: string;
    publishAt: Date | null;
};

export type UpdateAdDTO = Partial<CreateAdDTO>;

export class AdsService {
    // 1. Crear una nueva propuesta de anuncio (Draft)
    static async createAd(data: CreateAdDTO) {
        return prisma.ad.create({
            data,
        });
    }

    // 2. Obtener todos los anuncios (para el Dashboard)
    static async getAllAds() {
        return prisma.ad.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    // 3. Obtener el 'Stock' actual (anuncios listos para publicar pero aún no publicados)
    static async getReadyStockCount(): Promise<number> {
        return prisma.ad.count({
            where: {
                status: {
                    in: ['draft', 'scheduled'],
                },
            },
        });
    }

    // 4. Actualizar un anuncio (ej. cambiar status a 'scheduled', o editar el copy)
    static async updateAd(id: number, data: UpdateAdDTO) {
        return prisma.ad.update({
            where: { id },
            data,
        });
    }

    // 5. Eliminar un anuncio rechazado
    static async deleteAd(id: number): Promise<void> {
        await prisma.ad.delete({
            where: { id },
        });
    }

    // 6. Obtener el próximo anuncio programado para publicar
    static async getNextScheduledAd() {
        return prisma.ad.findFirst({
            where: {
                status: 'scheduled',
                publishAt: {
                    lte: new Date(),
                },
            },
            orderBy: {
                publishAt: 'asc',
            },
        });
    }

    // 7. Obtener un anuncio por ID
    static async getAdById(id: number) {
        return prisma.ad.findUnique({
            where: { id },
        });
    }
}

