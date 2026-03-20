import { NextRequest, NextResponse } from 'next/server';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

/* ─────────────────────────────────────────────────────────
   INDUSTRIAS — Oferta específica por vertical
   Precios y módulos de stephano-planteamiento
───────────────────────────────────────────────────────── */
const INDUSTRY_OFFERS: Record<string, {
    precio: string;
    oferta: string;
    modulos: string[];
    dolor: string;
    cta: string;
    callScript: {
        opening: string;
        painQuestion: string;
        solution: string;
        objection: string;
        close: string;
    };
}> = {
    'Restaurante / Soda': {
        precio: '$49/mes',
        oferta: 'sistema de restaurante completo',
        modulos: ['Menú digital QR actualizable en tiempo real', 'Sistema de reservaciones automáticas', 'Comandas digitales a cocina (adiós papeles)', 'Control de mesas con mapa visual', 'Reportes de ventas y platos más pedidos'],
        dolor: 'pierden pedidos, manejan todo en papeles o WhatsApp, y los clientes no pueden ver el menú ni reservar online',
        cta: '¿Te gustaría ver cómo funciona el menú QR en 5 minutos?',
        callScript: {
            opening: 'Buenas, ¿hablo con el encargado de [NEGOCIO]? Soy Diego de Stephano.io, somos una agencia de software en Costa Rica especializada en sistemas para restaurantes.',
            painQuestion: 'Le pregunto rápido — ¿actualmente cómo manejan los pedidos de mesa y las reservaciones? ¿Todo en papel o WhatsApp?',
            solution: 'Lo que hacemos es implementar un sistema completo: menú QR para que los clientes escaneen y vean el menú desde el teléfono, sistema de reservaciones en línea 24 horas, y comandas digitales que van directo a cocina. Todo por $49 al mes, sin costo de instalación complicada.',
            objection: 'Entiendo que ya tienen su manera de trabajar, pero el menú QR elimina los costos de impresión y cuando cambian un precio, lo actualizan en segundos desde el celular. Varios restaurantes en la zona ya lo tienen.',
            close: 'Le puedo mandar un link para que vea cómo queda el menú de otro restaurante nuestro. ¿Me da su WhatsApp para enviárselo ahora?',
        },
    },

    'Salón de Belleza': {
        precio: '$29/mes',
        oferta: 'sistema de agenda y fidelización para salón',
        modulos: ['Agenda online 24/7 por estilista y servicio', 'Recordatorios automáticos por WhatsApp 24h antes', 'Perfil de cliente con historial de visitas', 'Programa de puntos y lealtad', 'Reportes de ingresos por silla'],
        dolor: 'dependen de llamadas y WhatsApp para agendar, pierden citas por olvidos, y no tienen forma de fidelizar clientas',
        cta: '¿Cuántas citas pierden por semana por no-shows o falta de recordatorio?',
        callScript: {
            opening: 'Buenas, ¿hablo con quien atiende en [NEGOCIO]? Soy Diego de Stephano.io, trabajamos con salones de belleza y spas en Costa Rica.',
            painQuestion: '¿Actualmente cómo agendan las citas? ¿Por WhatsApp o llamada directamente? ¿Y les pasa que clientas olvidan la cita o la cancelan a último momento?',
            solution: 'Tenemos un sistema desde $29 al mes que pone un link de agenda en el Instagram del salón. Las clientas reservan solas, eligen estilista y servicio, y el sistema les manda un recordatorio automático por WhatsApp 24 horas antes. Se reducen los no-shows hasta un 60%.',
            objection: 'No requiere que aprendan nada complicado. Nosotros lo configuramos, les enseñamos en una hora y queda funcionando. El link de agenda queda en el bio del Instagram.',
            close: '¿Me da su número para mandarle un video de cómo funciona? Es literalmente 2 minutos y lo puede ver ahorita.',
        },
    },

    'Peluquería / Barbería': {
        precio: '$29/mes',
        oferta: 'sistema de agenda digital para barbería',
        modulos: ['Agenda online por barbero', 'Reservas desde Instagram o WhatsApp', 'Recordatorios automáticos', 'Historial del cliente (corte, estilo)', 'Control de ingresos diarios'],
        dolor: 'el agendamiento es un caos por WhatsApp, los clientes no saben cuándo hay espacio y pierden tiempo coordinando',
        cta: '¿Te imaginas que los clientes reserven solos sin que vos tengás que responder mensajes?',
        callScript: {
            opening: 'Buenas, ¿habló con el dueño de [NEGOCIO]? Soy Diego de Stephano, hacemos sistemas de agenda para barberías en Costa Rica.',
            painQuestion: '¿Cómo coordinan las citas? ¿Por WhatsApp? ¿Y cuánto tiempo al día gastan respondiendo "¿hay campo a las 3?"',
            solution: 'Hacemos un sistema donde los clientes ven tu disponibilidad en tiempo real y reservan solos. Vos solo ves tu agenda ordenada. Si alguien no viene, el sistema le mandó recordatorio por WhatsApp. Todo por $29 al mes.',
            objection: 'El link queda en tu Instagram para que los clientes reserven sin que vos tengás que contestar nada. En una semana notás la diferencia.',
            close: '¿Cuándo tenés 15 minutos esta semana para que te lo muestre por Zoom o presencial?',
        },
    },

    'Uñas / Nail Art': {
        precio: '$29/mes',
        oferta: 'sistema de agenda para nail studio',
        modulos: ['Agenda online con selección de servicio y duración', 'Recordatorios WhatsApp automáticos', 'Galería de diseños integrada', 'Historial de clientas', 'Link en bio de Instagram directo a reservas'],
        dolor: 'gestionan todo por DMs de Instagram o WhatsApp, pierden clientas que se cansan de esperar respuesta, y no tienen forma de mostrar su trabajo de manera organizada',
        cta: '¿Cuántas consultas de cita te llegan por día que no podés responder rápido?',
        callScript: {
            opening: 'Hola, ¿hablo con quien maneja el negocio de uñas en [NEGOCIO]? Soy Diego de Stephano.io, trabajo con nail studios acá en Costa Rica.',
            painQuestion: '¿Cómo están manejando las reservas? ¿Por Instagram o WhatsApp directamente? ¿Y se les complica responder todos los mensajes rápido?',
            solution: 'Tenemos un sistema de $29 al mes que pone un botón de reserva en tu Instagram. Las clientas eligen el servicio, la fecha y la hora disponible — y vos no tenés que hacer nada. El sistema les confirma y les recuerda la cita por WhatsApp automáticamente.',
            objection: 'No necesitás cambiar nada de cómo trabajás. Solo agregás el link de agenda al bio de Instagram. Las clientas que ya te siguen empiezan a reservar solas desde el primer día.',
            close: '¿Te puedo mandar un ejemplo de cómo quedaría tu agenda? Dame tu WhatsApp y te lo mando ahora.',
        },
    },

    'Clínica Dental': {
        precio: '$69/mes',
        oferta: 'sistema de gestión odontológica',
        modulos: ['Agenda inteligente por dentista y sillón', 'Expediente y odontograma digital', 'Plan de tratamiento con presupuesto', 'Recordatorios de cita por WhatsApp', 'Portal del paciente para agendar online'],
        dolor: 'manejan expedientes en papel o Excel, los pacientes llaman para agendar en horario de oficina, y el seguimiento de tratamientos se pierde',
        cta: '¿Cuántos pacientes les cancelan la cita porque no recibieron recordatorio?',
        callScript: {
            opening: 'Buenos días, ¿hablo con la recepción de [NEGOCIO]? Soy Diego de Stephano.io, desarrollamos software específico para clínicas odontológicas en Costa Rica.',
            painQuestion: '¿Actualmente cómo manejan los expedientes y la agenda? ¿En papel, Excel, o tienen algún sistema?',
            solution: 'Desarrollamos un sistema completo desde $69 al mes: agenda digital con vista por dentista y sillón, expediente clínico con odontograma digital, plan de tratamiento con presupuesto para el paciente, y recordatorios automáticos por WhatsApp. Los pacientes también pueden agendar online sin llamar.',
            objection: 'La migración la hacemos nosotros. En menos de una semana tienen todo funcionando y el equipo capacitado. No se pierde ningún dato.',
            close: '¿Hay un momento esta semana donde yo pueda mostrarle el sistema al doctor o a quien tome estas decisiones? Son 20 minutos y queda con el demo completo.',
        },
    },

    'Médico / Clínica': {
        precio: '$79/mes',
        oferta: 'sistema de gestión clínica médica',
        modulos: ['Agenda médica por especialidad y doctor', 'Expediente clínico digital (SOAP, signos vitales)', 'Recetas digitales con firma/sello', 'Órdenes de laboratorio', 'Facturación y control de seguros'],
        dolor: 'los expedientes en papel son un riesgo, el agendamiento por teléfono consume tiempo del staff, y no hay visibilidad del historial completo del paciente',
        cta: '¿Cuánto tiempo gasta su personal al día solo agendando y buscando expedientes?',
        callScript: {
            opening: 'Buenos días, ¿habló con el área administrativa de [NEGOCIO]? Soy Diego de Stephano, tenemos un software de gestión médica para clínicas en Costa Rica.',
            painQuestion: '¿Cómo están manejando actualmente los expedientes y la agenda médica? ¿Tienen sistema o es manual?',
            solution: 'Nuestro sistema desde $79 al mes digitaliza toda la operación: expediente clínico completo, recetas digitales con firma del médico, agenda inteligente que los pacientes pueden consultar online, y facturación integrada. Sin servidores locales, todo en la nube.',
            objection: 'El sistema cumple con los estándares de privacidad de datos médicos. Lo hemos implementado en clínicas similares a la suya y la curva de aprendizaje es muy rápida.',
            close: '¿Le puedo agendar una demo de 30 minutos con el médico encargado esta semana? Sin compromiso, solo para que vean el sistema funcionando con datos reales.',
        },
    },

    'Gimnasio / Fitness': {
        precio: '$39/mes',
        oferta: 'sistema de membresías y control de acceso',
        modulos: ['Gestión de membresías y planes', 'Control de acceso con QR por miembro', 'Agenda de clases online con inscripción', 'Cobros recurrentes automáticos', 'App del socio para reservar clases', 'Métricas de retención y asistencia'],
        dolor: 'el control de membresías es manual, no saben quién debe o cuándo vence, y el acceso al gym no está controlado',
        cta: '¿Cuántos socios tienen activos actualmente y cómo controlan quién tiene membresia vigente?',
        callScript: {
            opening: 'Buenas, ¿hablo con quien administra [NEGOCIO]? Soy Diego de Stephano, hacemos sistemas de gestión para gimnasios y estudios fitness en Costa Rica.',
            painQuestion: '¿Cómo están controlando actualmente las membresías y el acceso? ¿Saben exactamente quién debe, quién venció y quién está al día?',
            solution: 'Hacemos un sistema completo desde $39 al mes: control de acceso con código QR en el teléfono del socio, los cobros se hacen automáticamente cada mes, y el sistema avisa cuando alguien está por vencer. También tienen agenda de clases donde los socios reservan su espacio desde la app.',
            objection: 'El sistema se integra con el torniquete si tienen uno. Si no, el control es por QR que el staff valida. La implementación es una semana.',
            close: '¿Me da su WhatsApp para mandarle un video de cómo funciona el control de acceso? Es algo que pueden ver en 3 minutos.',
        },
    },

    'Tienda / Pulpería': {
        precio: '$35/mes',
        oferta: 'sistema POS e inventario para tienda',
        modulos: ['Punto de venta táctil con búsqueda de productos', 'Control de inventario con alertas de stock', 'Compras y proveedores', 'Facturación electrónica', 'Reportes de ventas por día y categoría'],
        dolor: 'el inventario es difícil de controlar, no saben cuándo se acaba un producto hasta que ya no tienen, y el cierre de caja es manual',
        cta: '¿Cuánto tiempo toman haciendo el inventario y el cierre de caja manualmente?',
        callScript: {
            opening: 'Buenas, ¿hablo con el dueño de [NEGOCIO]? Soy Diego de Stephano, hacemos sistemas de punto de venta para tiendas en Costa Rica.',
            painQuestion: '¿Cómo están controlando el inventario actualmente? ¿Saben exactamente qué tienen en stock sin tener que ir a revisar físicamente?',
            solution: 'Tenemos un sistema de $35 al mes que convierte cualquier tablet o computadora en un punto de venta completo: escanea códigos de barras, controla el inventario en tiempo real, avisa cuando hay que reponer, y el cierre de caja se hace en un clic con todo el reporte del día.',
            objection: 'No se necesita hardware especial. Funciona en el celular, tablet o computadora que ya tienen. Lo configuramos con su inventario actual en un día.',
            close: '¿Cuándo puedo ir por la tienda 30 minutos para mostrarles cómo funciona en vivo?',
        },
    },

    'Farmacia': {
        precio: '$49/mes',
        oferta: 'sistema de gestión para farmacia',
        modulos: ['Control de medicamentos y caducidades', 'Punto de venta con búsqueda por nombre/código', 'Alertas de stock mínimo', 'Historial de compras por cliente', 'Facturación y reportes'],
        dolor: 'el control de caducidades y stock de medicamentos es crítico y difícil de manejar manualmente',
        cta: '¿Tienen algún sistema para controlar las fechas de caducidad de los medicamentos?',
        callScript: {
            opening: 'Buenos días, ¿hablo con quien maneja la farmacia [NEGOCIO]? Soy Diego de Stephano, desarrollamos sistemas específicos para farmacias en Costa Rica.',
            painQuestion: '¿Cómo controlan actualmente las caducidades de medicamentos y el inventario? ¿Tienen sistema o es manual?',
            solution: 'Nuestro sistema desde $49 al mes controla todo el inventario con alertas automáticas de stock mínimo y caducidades próximas. El punto de venta busca medicamentos por nombre, código o principio activo, y lleva historial de cada cliente.',
            objection: 'Es un sistema en la nube, sin instalaciones complicadas. Funciona en cualquier computadora o tablet.',
            close: '¿Puedo coordinar una demo de 20 minutos con usted esta semana?',
        },
    },

    'Hotel / Hostal': {
        precio: '$59/mes',
        oferta: 'sistema de reservas y gestión hotelera',
        modulos: ['Motor de reservas online con disponibilidad en tiempo real', 'Check-in/check-out digital', 'Gestión de habitaciones', 'Pagos online integrados', 'Comunicación automática con huéspedes'],
        dolor: 'las reservas entran por múltiples canales (Booking, WhatsApp, Instagram, teléfono) y es difícil coordinar disponibilidad sin sobrevender',
        cta: '¿Les ha pasado que se sobrevendan habitaciones por manejar reservas en múltiples canales?',
        callScript: {
            opening: 'Buenas, ¿hablo con recepción de [NEGOCIO]? Soy Diego de Stephano, trabajamos con hoteles y hostales en Costa Rica.',
            painQuestion: '¿Cómo están gestionando actualmente las reservas? ¿Las reciben por Booking, WhatsApp, directo? ¿Cómo controlan que no se sobrevenda una habitación?',
            solution: 'Tenemos un sistema desde $59 al mes con motor de reservas en tiempo real: cuando alguien reserva desde cualquier canal, la disponibilidad se actualiza sola. Los huéspedes reciben confirmación automática y recordatorio antes de llegar.',
            objection: 'Se puede integrar con Booking.com y Airbnb para sincronizar disponibilidad automáticamente.',
            close: '¿Cuándo tiene 30 minutos para ver una demo del sistema con su equipo de recepción?',
        },
    },

    'Otro': {
        precio: '$300',
        oferta: 'presencia digital profesional',
        modulos: ['Sitio web profesional', 'Diseño adaptado a su industria', 'Formulario de contacto y WhatsApp integrado', 'SEO básico para aparecer en Google', 'Panel de administración propio'],
        dolor: 'clientes potenciales no los encuentran en línea o la primera impresión digital no genera confianza',
        cta: '¿Sus clientes actuales los encuentran fácilmente en Google?',
        callScript: {
            opening: 'Buenas, ¿hablo con quien maneja [NEGOCIO]? Soy Diego de Stephano.io, somos una agencia de software en Costa Rica.',
            painQuestion: '¿Tienen sitio web actualmente? ¿Cómo los encuentran los clientes nuevos normalmente?',
            solution: 'Desarrollamos su presencia digital completa desde $300: diseño profesional adaptado a su tipo de negocio, aparecen en Google con SEO básico, los clientes pueden contactarlos directo por WhatsApp desde la página, y tienen un panel para actualizarla ustedes mismos.',
            objection: 'El proceso es simple: nosotros nos encargamos de todo, usted nos da los detalles de su negocio y en 2 semanas tiene su sitio funcionando.',
            close: '¿Le puedo mandar ejemplos de trabajos similares que hemos hecho? Dame su WhatsApp.',
        },
    },
};

// Mapeo de variantes de industria al key correcto
function resolveIndustry(industry: string): string {
    const map: Record<string, string> = {
        'Restaurante': 'Restaurante / Soda',
        'Soda': 'Restaurante / Soda',
        'Restaurante / Soda': 'Restaurante / Soda',
        'Salón de Belleza': 'Salón de Belleza',
        'Spa': 'Salón de Belleza',
        'Salón / Spa': 'Salón de Belleza',
        'Uñas': 'Uñas / Nail Art',
        'Nail Art': 'Uñas / Nail Art',
        'Uñas / Nail Art': 'Uñas / Nail Art',
        'Peluquería': 'Peluquería / Barbería',
        'Barbería': 'Peluquería / Barbería',
        'Peluquería / Barbería': 'Peluquería / Barbería',
        'Clínica Dental': 'Clínica Dental',
        'Dental': 'Clínica Dental',
        'Médico': 'Médico / Clínica',
        'Clínica': 'Médico / Clínica',
        'Médico / Clínica': 'Médico / Clínica',
        'Gimnasio': 'Gimnasio / Fitness',
        'Fitness': 'Gimnasio / Fitness',
        'Gimnasio / Fitness': 'Gimnasio / Fitness',
        'Tienda': 'Tienda / Pulpería',
        'Pulpería': 'Tienda / Pulpería',
        'Tienda / Pulpería': 'Tienda / Pulpería',
        'Retail': 'Tienda / Pulpería',
        'Farmacia': 'Farmacia',
        'Hotel': 'Hotel / Hostal',
        'Hostal': 'Hotel / Hostal',
        'Hotel / Hostal': 'Hotel / Hostal',
    };
    return map[industry] || 'Otro';
}

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    try {
        const { handle, businessName, industry, location = 'Costa Rica', bio = '' } = await req.json();

        const name = businessName || handle?.replace('@', '') || 'este negocio';
        const industryKey = resolveIndustry(industry || 'Otro');
        const offer = INDUSTRY_OFFERS[industryKey] || INDUSTRY_OFFERS['Otro'];
        const bioHint = bio ? `Bio del perfil: "${bio}"` : '';

        // Prompt mejorado — específico por industria
        const dmPrompt = `Escribí un DM de Instagram en español de Costa Rica para contactar a un negocio.

Negocio: ${name}
Tipo: ${industryKey}
${bioHint}
Ubicación: ${location}

OFERTA ESPECÍFICA para este tipo de negocio:
- Sistema: ${offer.oferta}
- Precio: ${offer.precio}
- Módulos clave: ${offer.modulos.slice(0, 3).join(', ')}
- Dolor principal: Los negocios como este ${offer.dolor}

REGLAS ESTRICTAS del mensaje:
1. Máximo 4-5 oraciones, texto plano, sin markdown ni asteriscos
2. Primera oración: saludo + referencia a que viste su perfil de Instagram
3. Segunda oración: menciona UNA cosa específica que viste/que les falta (relacionada a su industria)
4. Tercera oración: ofrece la solución ESPECÍFICA con el módulo más relevante y el precio
5. Cuarta oración: pregunta de cierre invitando a responder (usa: ${offer.cta})
6. Firmado como: Diego | Stephano.io
7. Tono: como un conocido que recomienda algo útil, no vendedor agresivo
8. 1 emoji máximo, solo si encaja natural`;

        const { text: dm } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: dmPrompt,
            maxOutputTokens: 200,
            temperature: 0.65,
        });

        // Gancho de seguimiento para segunda ronda
        const hookPrompt = `En 1 oración (máx 12 palabras), un gancho de seguimiento para ${name} (${industryKey}) que ya recibió un DM sobre ${offer.oferta}. Solo la oración.`;
        const { text: hook } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: hookPrompt,
            maxOutputTokens: 50,
            temperature: 0.6,
        });

        return NextResponse.json({
            success: true,
            dm: dm.trim(),
            hook: hook.trim(),
            handle: handle || name,
            industryKey,
            offer: {
                precio: offer.precio,
                modulos: offer.modulos,
                callScript: offer.callScript,
            },
        });

    } catch (error) {
        console.error('[dm-pitch]', error);
        return NextResponse.json({ success: false, error: 'Error generando DM' }, { status: 500 });
    }
}
