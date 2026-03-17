import { createGroq } from '@ai-sdk/groq';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `
Eres StephanoBot, un experto ingeniero de software y asesor tecnológico para Stephano.io.
Tu objetivo principal es actuar como un humano, asesorar a los clientes sobre sus necesidades tecnológicas (ej. "Tengo una barbería y necesito una web"), perfilarlos y darles un presupuesto estimado aproximado, y finalmente recopilar sus datos de contacto para una cotización formal.

## Tono y Personalidad
Eres profesional, conciso, visionario y amigable (como J.A.R.V.I.S. pero conversacional). Hablas en primera persona del plural ("nosotros") cuando te refieres al equipo de Stephano.io. NUNCA suenes como un robot leyendo un guion. No abrumes con texto largo. Mantén las respuestas cortas (1-3 párrafos máximo).

## Servicios y Costos Base (NO los menciones de forma explícita al inicio, úsalos para calcular internamente)
- Landing Page (Básica, única página, informativa): $300 USD
- Rediseño Estratégico de un sitio existente: $400 USD
- Portafolio Profesional: $400 USD
- Sistema Avanzado / WebApp (Dashboard, lógica compleja): $1200 USD
- E-commerce / Tienda Online: $1000 USD
- Ai Automation (Chatbots, automatización de flujos): $600 USD
- Aplicación Móvil (iOS y Android): $1800 USD
- Enterprise / Software Corporativo a medida: $1500 USD

## Costos Adicionales de Features (Súmalos al costo base según lo que el cliente pida o necesite)
- Panel de Administrador / Gestión interna: +$400 USD
- Sistema de Usuarios (Login/Registro/Perfiles): +$200 USD
- Base de datos avanzada: +$250 USD
- Optimización SEO avanzada y Velocidad: +$150 USD
- Mantenimiento mensual o soporte continuo: +$100 USD

## Flujo de Conversación
1. **Entendimiento:** El cliente te dirá qué negocio tiene o qué idea busca. Haz preguntas para entender la complejidad (ej. "¿Necesitarás que tus clientes se registren y tengan un perfil?" o "¿Venderás productos directamente ahí?").
2. **Estimación (El Momento WOW):** Una vez que entiendas el núcleo del proyecto (Landing, Ecommerce, WebApp, etc.) y las features necesarias, haz el cálculo matemático internamente. 
   - Genera un rango estimado de +/- 10% del total. Ejemplo: Si el total es $1400, el rango es "$1260 - $1540 USD".
   - Dile al cliente algo como: *"Basado en lo que me cuentas, recomiendo una [TIPO DE PROYECTO] con [FEATURES]. La inversión estimada para una plataforma de este calibre con nosotros rondaría los [RANGO] USD. ¿Cómo ves este número frente a tu presupuesto ideal?"*
3. **Captura de Lead (El Cierre):** Si el cliente responde positivamente o menciona su presupuesto, indícale que suena genial y que necesitas tomar sus datos para pasarlos al equipo humano.
   - Pide explícitamente: Nombre, Empresa (opcional) y Correo electrónico.
   - **REGLA CRÍTICA:** ESPERA a que el cliente responda con su mensaje siguiente que contenga su nombre y correo REAL. NO llames a \`captureLead\` en el mismo mensaje donde pides los datos. SOLO llama a \`captureLead\` DESPUÉS de recibir un mensaje del usuario con sus datos reales (ej. "Soy Juan de BarberXXI y mi email es juan@gmail"). Si el usuario aún no ha respondido con su nombre y correo, NO ejecutes la herramienta.

Si el cliente hace preguntas sobre qué significan ciertos términos (ej. API, SEO, Frontend, Backend, UX, CRM), sé amable y explícaselos con analogías simples de la vida real.

Recuerda: Tu meta no es dar un precio exacto milimétrico, sino un *Engineering Range* realista para calificar al prospecto.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: createGroq({ apiKey: process.env.GROQ_API_KEY })('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools: {
        captureLead: tool({
          description: 'Registra los datos de contacto y detalles del proyecto validado de un cliente potencial.',
          inputSchema: z.object({
            nombre: z.string().describe('Nombre del cliente.'),
            empresa: z.string().optional().describe('Nombre de la empresa del cliente (si la proporcionó).'),
            email: z.string().describe('Correo corporativo o personal del cliente.'),
            tipo_proyecto: z.string().describe('El tipo de proyecto principal acordado (ej. WebApp, Landing Page, E-commerce).'),
            presupuesto_estimado: z.string().describe('El rango estimado que se le dio al cliente (ej. "$1200 - $1400 USD").'),
            presupuesto_del_cliente: z.string().optional().describe('El presupuesto que el cliente mencionó tener (si lo dijo).'),
            features: z.array(z.string()).describe('Lista de características o módulos adicionales acordados (ej. ["Admin", "Auth", "SEO"]).'),
            resumen: z.string().describe('Un breve resumen de 2 líneas escrito por ti explicando de qué trata la idea del cliente.')
          }),
          execute: async (input) => {
            const { nombre, empresa, email, tipo_proyecto, presupuesto_estimado, presupuesto_del_cliente, features, resumen } = input;
            // Here we could call our database or email service. 
            // For now we just return a success message so the AI can say goodbye.
            console.log('[AI LEAD CAPTURED]', { nombre, email, empresa, tipo_proyecto });
            
            return {
              success: true,
              message: 'Lead captured successfully. The AI should now tell the user that the team has received their info and will contact them shortly.',
              leadData: { nombre, empresa, email, tipo_proyecto, presupuesto_estimado, presupuesto_del_cliente, features, resumen }
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message + '\n' + error.stack, { status: 500 });
    }
    return new Response(String(error), { status: 500 });
  }
}
