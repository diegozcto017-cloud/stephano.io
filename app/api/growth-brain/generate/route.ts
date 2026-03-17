import { NextRequest } from 'next/server';
import { runGrowthBrainPipeline } from '@/server/services/growth-brain.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const encoder = new TextEncoder();
    const body = await req.json();
    const { idea, format, objective, sequenceNumber, save = true } = body;

    if (!idea || !format || !objective) {
        return new Response(JSON.stringify({ error: 'idea, format y objective son requeridos' }), { status: 400 });
    }

    const stream = new ReadableStream({
        async start(controller) {
            const send = (data: object) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            try {
                const result = await runGrowthBrainPipeline(
                    idea,
                    format as 'reel' | 'carousel',
                    objective,
                    (event) => send(event),
                    sequenceNumber
                );

                // Save to DB if requested
                let savedId: number | null = null;
                if (save) {
                    const post = await prisma.contentPost.create({
                        data: {
                            format,
                            topic: idea,
                            hook: result.hook,
                            body: result.body,
                            cta: result.cta,
                            script: result.script ?? null,
                            caption: result.caption,
                            hashtags: result.hashtags,
                            objective,
                            status: 'generated',
                            sequence: sequenceNumber ?? null,
                        },
                    });
                    savedId = post.id;
                }

                send({
                    step: 'done',
                    status: 'done',
                    message: 'Contenido listo',
                    percent: 100,
                    result,
                    savedId,
                });
            } catch (err) {
                send({
                    step: 'error',
                    status: 'error',
                    message: err instanceof Error ? err.message : 'Error desconocido',
                    percent: 0,
                });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}
