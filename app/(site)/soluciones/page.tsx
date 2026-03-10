import type { Metadata } from 'next';
import SolucionesPage from './SolucionesPage';

export const metadata: Metadata = {
    title: 'Soluciones Digitales Especializadas por Industria',
    description: 'Soluciones a medida para Belleza, Restaurantes, Clínicas, Inmobiliarias y Retail. Ingeniería digital aplicada a las necesidades de tu sector.',
};

export default function Page() {
    return <SolucionesPage />;
}
