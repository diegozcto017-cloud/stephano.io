import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function sendEmail(to: string, subject: string, html: string) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY not set');
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from: process.env.RESEND_DOMAIN_VERIFIED === 'true'
                ? 'Diego — Stephano.io <info@stephano.io>'
                : 'Diego — Stephano.io <onboarding@resend.dev>',
            to,
            subject,
            html,
        }),
    });
    if (!res.ok) throw new Error(await res.text());
}


type Stage = 'welcome' | 'followup' | 'closing';

function buildEmail(stage: Stage, name: string, business: string, city: string, service: string) {
    const year = new Date().getFullYear();
    const base = `background:#0a0a0a;font-family:'Inter',Arial,sans-serif;`;
    const header = `background:linear-gradient(135deg,#0066FF,#00E5FF);padding:32px 48px;`;

    const subjects: Record<Stage, string> = {
        welcome: `¡Hola ${name}! Tenemos algo especial para ${business}`,
        followup: `${name}, ¿seguimos hablando sobre tu proyecto?`,
        closing: `Última oportunidad — Oferta especial para ${business} 🎯`,
    };

    const bodies: Record<Stage, string> = {
        welcome: `
        <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:16px;">Hola ${name} 👋</div>
        <div style="font-size:15px;color:rgba(255,255,255,0.75);line-height:1.7;margin-bottom:24px;">
          Somos <strong style="color:#00E5FF;">Stephano.io</strong>, agencia de desarrollo web en Costa Rica.<br/><br/>
          Vimos que <strong>${business}</strong> en <strong>${city}</strong> podría beneficiarse enormemente de una presencia digital profesional.
          Trabajamos con empresas como la tuya y podemos tener tu proyecto de <strong>${service}</strong> listo en 2–3 semanas.
        </div>
        <div style="background:rgba(0,102,255,0.08);border:1px solid rgba(0,102,255,0.2);border-radius:12px;padding:20px;margin-bottom:28px;">
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em;">Lo que incluye</div>
          <div style="color:#fff;font-size:14px;line-height:2;">
            ✅ Diseño UX/UI profesional<br/>
            ✅ SEO optimizado desde el inicio<br/>
            ✅ Responsive en todos los dispositivos<br/>
            ✅ Entrega en 2–3 semanas<br/>
            ✅ Soporte post-lanzamiento
          </div>
        </div>
        <div style="font-size:15px;color:rgba(255,255,255,0.7);margin-bottom:28px;">
          ¿Te interesa una cotización gratuita sin compromiso? Respondé este correo o escríbenos por WhatsApp.
        </div>`,

        followup: `
        <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:16px;">Hola ${name},</div>
        <div style="font-size:15px;color:rgba(255,255,255,0.75);line-height:1.7;margin-bottom:24px;">
          Solo queríamos asegurarnos de que recibiste nuestro mensaje anterior sobre el proyecto de <strong style="color:#00E5FF;">${service}</strong> para <strong>${business}</strong>.
        </div>
        <div style="font-size:15px;color:rgba(255,255,255,0.75);line-height:1.7;margin-bottom:28px;">
          Esta semana tenemos un espacio disponible en nuestra agenda para un proyecto nuevo en <strong>${city}</strong>.
          Si querés, podemos agendar una llamada de 15 minutos para contarte exactamente cómo podríamos ayudarte — sin costo y sin compromiso.
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:28px;">
          <div style="font-size:13px;color:rgba(255,255,255,0.4);margin-bottom:4px;">INVERSIÓN ESTIMADA</div>
          <div style="font-size:28px;font-weight:900;color:#00E5FF;">Desde $350 USD</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;">Pago inicial + entrega · Sin mensualidades obligatorias</div>
        </div>`,

        closing: `
        <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:16px;">Hola ${name},</div>
        <div style="font-size:15px;color:rgba(255,255,255,0.75);line-height:1.7;margin-bottom:24px;">
          Este es nuestro último mensaje para no molestarte. Queremos hacerte una oferta especial de lanzamiento para <strong>${business}</strong>:
        </div>
        <div style="background:linear-gradient(135deg,rgba(0,102,255,0.15),rgba(0,229,255,0.08));border:1px solid rgba(0,229,255,0.3);border-radius:16px;padding:28px;margin-bottom:28px;">
          <div style="font-size:13px;color:#00E5FF;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin-bottom:16px;">🎯 Oferta Especial de Lanzamiento</div>
          <div style="color:#fff;font-size:15px;line-height:2.2;">
            ✅ ${service} profesional<br/>
            ✅ Dominio .com gratis por 1 año<br/>
            ✅ Hosting incluido por 6 meses<br/>
            ✅ SEO on-page configurado<br/>
            ✅ Soporte por WhatsApp 30 días
          </div>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(0,229,255,0.2);">
            <div style="font-size:13px;color:rgba(255,255,255,0.5);">TODO DESDE</div>
            <div style="font-size:32px;font-weight:900;color:#00E5FF;">$350 USD</div>
          </div>
        </div>
        <div style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:24px;">
          Si en algún momento decidís dar el salto digital, aquí estaremos. Podés escribirnos cuando quieras.
        </div>`,
    };

    return {
        subject: subjects[stage],
        html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;${base}">
  <table width="100%" cellpadding="0" cellspacing="0" style="${base}padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#000;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <tr>
          <td style="${header}">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">Stephano.io</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.6);">Ingeniería Digital · Costa Rica</div></td>
              <td align="right"><div style="font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.08em;">info@stephano.io</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:4px;">+506 71164454</div></td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px;">
            ${bodies[stage]}
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="https://wa.me/50671164454" style="display:inline-block;background:linear-gradient(135deg,#0066FF,#00C2FF);color:#fff;text-decoration:none;padding:15px 36px;border-radius:100px;font-size:14px;font-weight:800;margin-right:12px;">WhatsApp →</a>
                  <a href="https://stephano.io/cotizar" style="display:inline-block;background:rgba(255,255,255,0.06);color:#fff;text-decoration:none;padding:15px 36px;border-radius:100px;font-size:14px;font-weight:600;border:1px solid rgba(255,255,255,0.15);">Cotizar gratis</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 48px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:11px;color:rgba(255,255,255,0.2);">STEPHANO.IO — DIGITAL ENGINEERING · COSTA RICA © ${year}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.15);margin-top:4px;">Si no deseas recibir más correos, respondé con "No contactar".</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    };
}

export async function POST(req: NextRequest) {
    try {
        const { name, email, business, city, service, stage } = await req.json() as {
            name: string;
            email: string;
            business: string;
            city: string;
            service: string;
            stage: Stage;
        };

        if (!name || !email || !stage) {
            return NextResponse.json({ error: 'name, email y stage son requeridos' }, { status: 400 });
        }

        const { subject, html } = buildEmail(
            stage,
            name,
            business || 'tu negocio',
            city || 'Costa Rica',
            service || 'Landing Page',
        );

        await sendEmail(email, subject, html);

        return NextResponse.json({ ok: true, stage, to: email });
    } catch (error) {
        console.error('[followup] error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Error al enviar' },
            { status: 500 },
        );
    }
}
