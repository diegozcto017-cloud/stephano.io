import type { Metadata } from 'next';
import PortafolioPage from './PortafolioPage';

export const metadata: Metadata = {
    title: 'Portafolio de Proyectos y Casos de Éxito',
    description: 'Casos de estudio reales: descubre cómo transformamos negocios a través de arquitectura sólida y sistemas digitales de alto rendimiento.',
};

export default function Page() {
    return <PortafolioPage />;
}
