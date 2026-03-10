import type { Metadata } from 'next';
import CotizarPage from './CotizarPage';

export const metadata: Metadata = {
    title: 'Cotizar Proyecto Digital | Presupuesto Transparente',
    description: 'Calcula el costo y tiempo estimado de tu proyecto digital en tiempo real. Basado en métricas reales de ingeniería y diseño premium.',
};

export default function Page() {
    return <CotizarPage />;
}
