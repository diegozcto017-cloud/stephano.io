import { NextRequest } from 'next/server';
import { runCreativePipelineStreaming } from '@/server/services/creative.service';
import { AdsService } from '@/server/services/ads.service';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
    const { scratch, mode = 'single' } = await req.json();

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: object) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            try {
                const result = await runCreativePipelineStreaming(scratch, mode, send);

                send({ step: 'save', status: 'in_progress', message: 'Guardando en base de datos...', percent: 95 });

                const ad = await AdsService.createAd({
                    scratch,
                    headline: result.headline,
                    copy: result.copy,
                    mediaUrl: result.mediaUrl,
                    mediaType: 'image',
                    status: 'draft',
                    publishAt: null,
                });

                send({ step: 'done', status: 'done', message: 'Anuncio creado exitosamente', percent: 100, adId: ad.id });
            } catch (error) {
                send({
                    step: 'error',
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Error en el pipeline de IA',
                });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
