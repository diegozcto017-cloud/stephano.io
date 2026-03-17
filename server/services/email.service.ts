// Email Service — Resend API (resend.com)
// Replaces Hostinger SMTP which is blocked from Vercel servers

const RESEND_API = 'https://api.resend.com/emails';
// Use verified Resend domain until stephano.io domain is verified in Resend dashboard
const FROM = process.env.RESEND_DOMAIN_VERIFIED === 'true'
    ? 'Stephano.io <info@stephano.io>'
    : 'Stephano.io <onboarding@resend.dev>';
const NOTIFY_TO = process.env.NOTIFICATION_EMAIL || 'info@stephano.io';

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('[EmailService] RESEND_API_KEY not set — skipping email to', to);
        return;
    }

    const res = await fetch(RESEND_API, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: FROM, to, subject, html }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Resend error: ${err}`);
    }

    const data = await res.json();
    console.log('[EmailService] Sent via Resend:', data.id, '→', to);
}

interface EmailLead {
    nombre: string;
    email: string;
    tipo_proyecto?: string;
    empresa?: string | null;
    telefono?: string | null;
    presupuesto_rango?: string | null;
    urgencia?: string | null;
    mensaje?: string | null;
}

export class EmailService {
    static async sendLeadNotification(lead: EmailLead) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
        const refId = `LEAD-${now.getTime().toString().slice(-6)}`;

        const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#000000;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#0066FF,#00E5FF);padding:32px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px;">🚀 Nuevo Lead</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.75);margin-top:4px;">${dateStr} · ${timeStr}</div></td>
              <td align="right"><div style="font-size:22px;font-weight:900;color:#fff;">Stephano.io</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.6);">Ingeniería Digital</div></td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.06);padding:12px 48px;">
            <span style="font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;">Referencia</span>
            <span style="font-size:11px;color:#00E5FF;font-weight:700;margin-left:16px;">${refId}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td width="48%" style="background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:22px 24px;vertical-align:top;">
                  <div style="font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Cliente</div>
                  <div style="font-size:17px;font-weight:800;color:#fff;">${lead.nombre}</div>
                  <div style="font-size:13px;color:rgba(255,255,255,0.55);margin-top:4px;">${lead.empresa || '—'}</div>
                  <div style="margin-top:14px;border-top:1px solid rgba(255,255,255,0.06);padding-top:14px;">
                    <a href="mailto:${lead.email}" style="font-size:13px;color:#00E5FF;text-decoration:none;">${lead.email}</a><br>
                    ${lead.telefono ? `<a href="https://wa.me/${lead.telefono.replace(/\D/g, '')}" style="font-size:13px;color:#25D366;text-decoration:none;margin-top:4px;display:block;">📱 ${lead.telefono}</a>` : ''}
                  </div>
                </td>
                <td width="4%"></td>
                <td width="48%" style="background:rgba(0,102,255,0.06);border:1px solid rgba(0,102,255,0.2);border-radius:14px;padding:22px 24px;vertical-align:top;">
                  <div style="font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;">Proyecto</div>
                  <div style="font-size:17px;font-weight:800;color:#00E5FF;">${(lead.tipo_proyecto || 'N/A').toUpperCase()}</div>
                  <div style="margin-top:16px;">
                    <div style="font-size:20px;font-weight:900;color:#fff;">${lead.presupuesto_rango || 'No especificado'}</div>
                  </div>
                  <div style="margin-top:14px;border-top:1px solid rgba(0,102,255,0.2);padding-top:14px;">
                    <span style="display:inline-block;background:rgba(0,229,255,0.1);color:#00E5FF;padding:2px 10px;border-radius:100px;font-size:11px;font-weight:700;border:1px solid rgba(0,229,255,0.2);">${(lead.urgencia || 'estándar').toUpperCase()}</span>
                  </div>
                </td>
              </tr>
            </table>
            <div style="background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:24px;margin-bottom:32px;">
              <div style="font-size:10px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px;">Mensaje</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;white-space:pre-line;">${lead.mensaje || 'Sin mensaje.'}</div>
            </div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://stephano.io/admin" style="display:inline-block;background:linear-gradient(135deg,#0066FF,#00C2FF);color:#fff;text-decoration:none;padding:15px 40px;border-radius:100px;font-size:14px;font-weight:800;">Ver en Panel Admin →</a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:rgba(255,255,255,0.015);border-top:1px solid rgba(255,255,255,0.06);padding:20px 48px;text-align:center;">
            <div style="font-size:10px;color:rgba(255,255,255,0.15);">STEPHANO.IO — NOTIFICACIÓN AUTOMÁTICA · ${new Date().getFullYear()}</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

        try {
            await sendEmail(NOTIFY_TO, `🚀 Nuevo Lead: ${lead.nombre} — ${(lead.tipo_proyecto || '').toUpperCase()}`, html);
        } catch (err) {
            console.error('[EmailService] sendLeadNotification error:', err);
        }
    }

    static async sendClientConfirmation(lead: EmailLead) {
        const now = new Date();
        const refId = `LEAD-${now.getTime().toString().slice(-6)}`;

        const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#050505;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#001133,#001A4D);padding:40px 48px;text-align:center;border-bottom:1px solid rgba(0,229,255,0.2);">
            <div style="font-size:24px;font-weight:900;color:#fff;letter-spacing:-0.5px;margin-bottom:8px;">Stephano.io</div>
            <div style="font-size:13px;color:#00E5FF;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Confirmación de Solicitud</div>
          </td>
        </tr>
        <tr>
          <td style="padding:48px;">
            <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:16px;">Hola ${lead.nombre},</div>
            <div style="font-size:15px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:32px;">
              Hemos recibido exitosamente el desglose técnico de tu arquitectura digital. Nuestro equipo revisará los detalles y te contactaremos a la brevedad.
            </div>
            <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(0,229,255,0.1);border-radius:12px;padding:24px;margin-bottom:32px;">
              <div style="font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:12px;">Resumen</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-bottom:16px;">
                    <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">PROYECTO</div>
                    <div style="font-size:14px;font-weight:700;color:#fff;">${(lead.tipo_proyecto || '').toUpperCase()}</div>
                  </td>
                  <td width="50%" style="padding-bottom:16px;">
                    <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">URGENCIA</div>
                    <div style="font-size:14px;font-weight:700;color:#fff;">${(lead.urgencia || 'estándar').toUpperCase()}</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:16px;border-top:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px;">INVERSIÓN ESTIMADA</div>
                    <div style="font-size:24px;font-weight:900;color:#00E5FF;">${lead.presupuesto_rango || 'Por definir'}</div>
                  </td>
                </tr>
              </table>
            </div>
            <div style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6;margin-bottom:32px;">
              Podés contactarnos directamente por <a href="https://wa.me/50671164454" style="color:#00E5FF;text-decoration:none;">WhatsApp (+506 71164454)</a> o respondiendo este correo.
            </div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://wa.me/50671164454" style="display:inline-block;background:linear-gradient(135deg,#0066FF,#00C2FF);color:#fff;text-decoration:none;padding:14px 36px;border-radius:100px;font-size:14px;font-weight:800;">Escribir por WhatsApp →</a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.06);padding:24px 48px;text-align:center;">
            <div style="font-size:11px;color:rgba(255,255,255,0.3);">Referencia: ${refId} · stephano.io © ${new Date().getFullYear()}</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

        try {
            await sendEmail(lead.email, '¡Recibimos tu solicitud de proyecto! 🚀 — Stephano.io', html);
        } catch (err) {
            console.error('[EmailService] sendClientConfirmation error:', err);
        }
    }

    static async sendCompletionNotification(lead: EmailLead) {
        const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#0066FF,#00E5FF);padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">✅ ¡Proyecto Completado!</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="color:#0f1729;">¡Buenas noticias, ${lead.nombre}!</h2>
          <p style="color:#444;line-height:1.6;">Tu proyecto de <strong>${lead.tipo_proyecto || 'Arquitectura Digital'}</strong> ha sido completado exitosamente.</p>
          <div style="text-align:center;margin-top:28px;">
            <a href="https://stephano.io" style="display:inline-block;background:linear-gradient(135deg,#0066FF,#00C2FF);color:#fff;padding:14px 32px;border-radius:100px;text-decoration:none;font-weight:700;">Ver Detalles</a>
          </div>
          <p style="color:#888;font-size:13px;margin-top:28px;">Diego — Stephano.io · +506 71164454</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

        try {
            await sendEmail(lead.email, '✅ ¡Tu proyecto con Stephano está listo!', html);
        } catch (err) {
            console.error('[EmailService] sendCompletionNotification error:', err);
        }
    }
}
