import { NextRequest, NextResponse } from 'next/server';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY! });

// Industry pain points & CR competitors
const INDUSTRY_CONTEXT: Record<string, { painPoints: string[]; competitors: string[]; wins: string[] }> = {
    restaurante: {
        painPoints: ['Los clientes buscan el menú en Google y no encuentran nada', 'Pierden reservaciones porque no hay forma de agendar online', 'No aparecen cuando alguien busca "restaurantes cerca de mí"', 'Sin delivery digital pierden el mercado de pedidos por apps'],
        competitors: ['Restaurante Donde Olga', 'La Casona del Maíz', 'Restaurante Buen Gusto'],
        wins: ['aumentaron pedidos 40% con menú online', 'capturan reservaciones 24/7 sin tener que contestar llamadas'],
    },
    dental: {
        painPoints: ['Los pacientes buscan dentista en Google y los elige quien tiene más presencia', 'Sin agenda online pierden citas que se concretan a medianoche', 'Competidores con sitio web aparecen primero en Google Maps'],
        competitors: ['Centro Dental Sonrisa', 'Clínica Dental Dr. Mora', 'DentAlajuela'],
        wins: ['llenan su agenda con 30% menos llamadas', 'capturan pacientes nuevos que buscan en Google a las 11pm'],
    },
    medico: {
        painPoints: ['Pacientes no encuentran información sobre especialidades ni costos', 'Sin citas online pierden pacientes que no quieren llamar', 'La telemedicina crece y quien no está digital queda atrás'],
        competitors: ['Clínica Bíblica', 'CIMA', 'Hospital Clínica Bíblica'],
        wins: ['reducen llamadas 50% con información clara online', 'capturan pacientes internacionales con sitio en español e inglés'],
    },
    abogado: {
        painPoints: ['Los clientes buscan abogado en Google y contratan al primero que transmite confianza', 'Sin sitio web profesional pierden credibilidad vs competidores', 'Las consultas iniciales podrían ser online ahorrando tiempo a ambas partes'],
        competitors: ['BLP Abogados', 'Arias & Muñoz', 'Facio & Cañas'],
        wins: ['reciben 3x más consultas mostrando casos ganados y especialidades online', 'capturan clientes en otras provincias sin necesidad de reunión presencial inicial'],
    },
    taller: {
        painPoints: ['Sin presencia digital los clientes no saben qué servicios ofrecen ni precios', 'Pierden clientes que buscan "taller mecánico cerca" en Google', 'Sin sistema de citas el cliente llega sin avisar y hay colas'],
        competitors: ['Taller Autocentro', 'Goodyear CR', 'Taller Maroto'],
        wins: ['reciben presupuestos por WhatsApp directo desde el sitio', 'generan confianza mostrando certificaciones y servicios especializados'],
    },
    salon: {
        painPoints: ['Las clientas reservan cita por Instagram pero se pierden sin un sistema', 'Sin galería de trabajos online pierden clientas que evalúan antes de ir', 'La competencia con sitio web y agenda online se lleva sus clientes potenciales'],
        competitors: ['Salon Jean Louis David', 'Bellissimo Salon', 'Studio F'],
        wins: ['llenaron su agenda con 2 semanas de anticipación usando reservas online', 'duplicaron clientes nuevos mostrando galería de trabajos en su sitio'],
    },
    veterinaria: {
        painPoints: ['Dueños de mascotas buscan veterinaria de emergencia en Google a cualquier hora', 'Sin historial digital del paciente cada visita empieza de cero', 'Sin citas online el cliente llama y a veces nadie contesta'],
        competitors: ['Hospital Veterinario La Colina', 'Clínica Veterinaria Los Yoses', 'PetSmart CR'],
        wins: ['capturan emergencias nocturnas con formulario de contacto 24/7', 'fidelizan clientes con recordatorios automáticos de vacunas'],
    },
    gimnasio: {
        painPoints: ['Potenciales miembros no encuentran precios ni clases online', 'Sin inscripción digital pierden leads que no quieren llamar', 'La competencia con app o sitio web tiene ventaja clara en retención'],
        competitors: ['Gold\'s Gym CR', 'Smart Fit Costa Rica', 'Spinning Center'],
        wins: ['aumentaron membresías 35% con inscripción y pagos online', 'redujeron cancelaciones con recordatorios y clase virtuales de respaldo'],
    },
    farmacia: {
        painPoints: ['Clientes buscan si tienen el medicamento disponible antes de ir', 'Sin delivery digital pierden el mercado de pedidos a domicilio', 'Las cadenas grandes dominan Google — las independientes desaparecen sin sitio web'],
        competitors: ['Fischel', 'Farmacia La Bomba', 'Farmacia Sucre'],
        wins: ['generan pedidos delivery por WhatsApp desde su sitio', 'fidelizan clientes con recordatorios de medicamentos recurrentes'],
    },
    hotel: {
        painPoints: ['Turistas reservan por Booking y Airbnb pagando 15-20% de comisión', 'Sin sitio propio no pueden capturar reservaciones directas sin comisión', 'Sin fotos profesionales y descripción online pierden ante la competencia'],
        competitors: ['Hotel Grano de Oro', 'Fleur de Lys', 'Hotel Presidente'],
        wins: ['aumentaron reservaciones directas 60% eliminando comisiones de intermediarios', 'capturan turistas que buscan en Google específicamente su zona'],
    },
    repuestos: {
        painPoints: ['Mecánicos buscan el repuesto en línea antes de llamar y si no estás, llaman a otro', 'Sin catálogo online pierden ventas a talleres de otras zonas', 'La competencia con tienda online entrega pedidos mientras ellos esperan la llamada'],
        competitors: ['Cobreros', 'AutoPartes Universal', 'Importadora Monge Auto'],
        wins: ['capturan pedidos de mecánicos de toda la GAM con catálogo online', 'reducen llamadas de consulta con inventario visible en tiempo real'],
    },
    general: {
        painPoints: ['Sin sitio web no aparecen en Google cuando alguien los busca', 'Pierden credibilidad vs competidores que sí tienen presencia digital', 'No pueden mostrar sus productos o servicios fuera del horario de atención'],
        competitors: ['negocios del mismo rubro en su zona'],
        wins: ['duplican su alcance sin aumentar costos de publicidad tradicional', 'capturan clientes las 24 horas, no solo en horario de oficina'],
    },
};

function detectIndustry(types: string[] = [], name: string = ''): string {
    const t = types.join(' ').toLowerCase();
    const n = name.toLowerCase();
    if (t.includes('restaurant') || t.includes('food') || t.includes('meal') || n.includes('restaurant') || n.includes('soda') || n.includes('pizz') || n.includes('taco')) return 'restaurante';
    if (t.includes('dentist') || n.includes('dental') || n.includes('dentist') || n.includes('odont')) return 'dental';
    if (t.includes('doctor') || t.includes('medical') || t.includes('hospital') || n.includes('clínica') || n.includes('clinica') || n.includes('médic')) return 'medico';
    if (t.includes('lawyer') || t.includes('legal') || n.includes('abogad') || n.includes('bufete') || n.includes('jurídic')) return 'abogado';
    if (t.includes('car_repair') || t.includes('car_dealer') || n.includes('taller') || n.includes('mecán') || n.includes('automotriz')) return 'taller';
    if (t.includes('beauty_salon') || t.includes('hair_care') || n.includes('salón') || n.includes('salon') || n.includes('peluquer') || n.includes('barbería')) return 'salon';
    if (t.includes('veterinary') || n.includes('veterinar') || n.includes('mascotas') || n.includes('animal')) return 'veterinaria';
    if (t.includes('gym') || t.includes('fitness') || n.includes('gimnasio') || n.includes('fitness') || n.includes('gym')) return 'gimnasio';
    if (t.includes('pharmacy') || n.includes('farmacia') || n.includes('botica')) return 'farmacia';
    if (t.includes('lodging') || t.includes('hotel') || n.includes('hotel') || n.includes('hostal') || n.includes('hospedaje')) return 'hotel';
    if (n.includes('repuesto') || n.includes('autopart') || n.includes('refacc')) return 'repuestos';
    return 'general';
}

export { detectIndustry };

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || authHeader !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    try {
        const { businessName, industry, location, rating, reviews, address, types } = await req.json();

        const detectedIndustry = industry || detectIndustry(types, businessName);
        const ctx = INDUSTRY_CONTEXT[detectedIndustry] || INDUSTRY_CONTEXT.general;

        const painPointsList = ctx.painPoints.slice(0, 3).join('\n- ');
        const competitor = ctx.competitors[Math.floor(Math.random() * ctx.competitors.length)];
        const win = ctx.wins[Math.floor(Math.random() * ctx.wins.length)];
        const zone = location || address?.split(',').slice(-2).join(',').trim() || 'Costa Rica';

        const prompt = `Generá un pitch de ventas corto (máximo 5 oraciones) en español de Costa Rica para un negocio que NO tiene sitio web.

Negocio: ${businessName}
Tipo: ${detectedIndustry}
Ubicación: ${zone}
Rating Google: ${rating || 'N/A'} estrellas con ${reviews || 0} reseñas
Competidor referencia: ${competitor}

Dolor principal del negocio:
- ${painPointsList}

Lo que logran negocios similares con sitio web: ${win}

REGLAS:
- Mencioná al competidor como referencia de éxito ("negocios como ${competitor}...")
- Usá los datos reales del negocio (reseñas, rating)
- Sé directo, específico y convincente
- Terminá con una pregunta o CTA claro
- NO uses asteriscos ni markdown, texto plano solamente
- Máximo 120 palabras`;

        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt,
            maxOutputTokens: 200,
            temperature: 0.75,
        });

        return NextResponse.json({
            success: true,
            pitch: text.trim(),
            industry: detectedIndustry,
            painPoints: ctx.painPoints,
            competitor,
        });
    } catch (error) {
        console.error('[leads/pitch]', error);
        return NextResponse.json({ success: false, error: 'Error generando pitch' }, { status: 500 });
    }
}
