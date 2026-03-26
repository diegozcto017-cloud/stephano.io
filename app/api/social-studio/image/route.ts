import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { callGeminiImage } from '@/server/services/creative.service';

export const dynamic = 'force-dynamic';

const NANO_BANANA_CLI = path.join(process.env.HOME || process.env.USERPROFILE || '', 'tools/nano-banana-2/src/cli.ts');
const OUTPUT_DIR = path.join(process.cwd(), 'public/social-assets');

const SECTION_VISUALS: Record<string, string> = {
    home: "abstract digital architecture, geometric neural network lines, conversion funnel metaphor, landing page mockup floating",
    ecosistema: "business management dashboard UI, CRM interface panels, POS terminal display, interconnected system nodes, industry icons grid",
    cotizar: "interactive price calculator UI, investment scope builder, pricing tiers visualization, quote form interface",
    proceso: "5-step workflow diagram, engineering phases timeline, development process nodes, agile sprint board visualization",
    contactar: "AI chatbot interface bubble, WhatsApp integration UI, customer support flow, instant response visualization",
    general: "abstract digital transformation, business growth chart, web architecture blueprint",
};

function buildPrompt(
    slide: { headline: string; body: string; type: string; accentWord?: string },
    index: number,
    total: number,
    section = 'general'
): string {
    const BRAND = "deep navy background #0B1220, royal blue #0066FF to cyan #00C2FF gradient accent, STEPHANO.IO branding, liquid glass corporativo aesthetic, Silicon Valley engineering luxury, frosted glass elements, minimal clean, no people, no faces, 8K ultra sharp";
    const visual = SECTION_VISUALS[section] || SECTION_VISUALS.general;

    if (index === 0 || slide.type === 'cover') {
        return `Premium Instagram carousel cover slide, ${BRAND}, ${visual}, bold white centered headline '${slide.headline}', subtle blue-to-cyan radial glow from bottom rgba(0,102,255,0.3), abstract geometric grid lines fading into deep navy, thin blue gradient horizontal rule 80% width, small STEPHANO.IO monospace top-right corner, Apple product reveal aesthetic, Inter font`;
    }
    if (index === total - 1 || slide.type === 'cta') {
        return `Instagram CTA slide, deep navy #0B1220, ${BRAND}, glowing blue-cyan gradient rectangle button with 'stephano.io' text, white call-to-action '${slide.headline}', ${visual} subtle background, scattered blue particle dots, liquid glass card element, premium minimalist closing slide`;
    }
    return `Instagram carousel content slide ${index + 1}/${total}, dark navy #111827, ${BRAND}, ${visual} as background element, thin vertical blue gradient left border accent 3px, bold white left-aligned headline '${slide.headline}', muted body text rgba(255,255,255,0.6) '${(slide.body || '').slice(0, 50)}', small cyan slide counter '${index + 1}/${total}' top-right, glassmorphism card layout`;
}

async function generateWithNanoBanana(prompt: string, outputName: string): Promise<string | null> {
    return new Promise((resolve) => {
        const outputPath = path.join(OUTPUT_DIR, outputName);
        const args = [
            'run', NANO_BANANA_CLI,
            prompt,
            '-s', '1K',
            '-a', '1:1',
            '-o', outputPath,
            '--api-key', process.env.GEMINI_API_KEY || '',
        ];

        const proc = spawn('bun', args, { env: process.env });
        let output = '';
        proc.stdout.on('data', (d) => output += d.toString());
        proc.stderr.on('data', (d) => output += d.toString());

        proc.on('close', (code) => {
            if (code === 0) {
                // Find generated file
                for (const ext of ['.jpeg', '.jpg', '.png']) {
                    const candidate = outputPath + ext;
                    try {
                        require('fs').accessSync(candidate);
                        // Return public URL
                        const publicPath = '/social-assets/' + path.basename(outputName) + ext;
                        resolve(publicPath);
                        return;
                    } catch { /* continue */ }
                }
            }
            resolve(null);
        });

        setTimeout(() => { proc.kill(); resolve(null); }, 30000);
    });
}

function fallbackUrl(slide: { headline: string }, index: number): string {
    const themes = [
        'deep+black+background+neon+cyan+glow+tech+aesthetic+stephano.io',
        'dark+charcoal+electric+blue+accent+minimal+clean+tech',
        'black+background+cyan+particles+silicon+valley+luxury+brand',
        'dark+tech+abstract+grid+electric+cyan+premium+instagram',
        'minimalist+dark+glowing+cyan+lines+modern+tech+brand',
    ];
    const theme = themes[index % themes.length];
    const text = encodeURIComponent(slide.headline.replace(/\s+/g, '+').slice(0, 30));
    return `https://image.pollinations.ai/prompt/premium+instagram+carousel+${theme}+bold+text+${text}?width=1080&height=1080&nologo=true&seed=${Date.now() + index * 1000}&model=flux`;
}

export async function POST(req: NextRequest) {
    const { slide, index, total, postId, section } = await req.json();
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const prompt = buildPrompt(slide, index, total, section);

    // Try nano-banana CLI first (best quality)
    const outputName = `${postId || 'post'}-slide-${index + 1}`;
    const nanoBananaResult = await generateWithNanoBanana(prompt, outputName);
    if (nanoBananaResult) {
        return NextResponse.json({ url: nanoBananaResult, source: 'nano-banana' });
    }

    // Fallback: Gemini API direct
    if (geminiKey) {
        try {
            const url = await callGeminiImage(prompt, geminiKey);
            if (url) return NextResponse.json({ url, source: 'gemini' });
        } catch { /* continue */ }
    }

    // Final fallback: Pollinations (free, no auth)
    return NextResponse.json({ url: fallbackUrl(slide, index), source: 'pollinations' });
}
