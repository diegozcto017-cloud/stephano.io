import type { Metadata } from 'next';
import ProcesoPage from './ProcesoPage';

export const metadata: Metadata = {
    title: 'Nuestro Proceso de Ingeniería',
    description: 'Metodología Stephano en 5 etapas: Diagnóstico, Arquitectura, Desarrollo Ágil, Automatización y Lanzamiento Exitoso.',
};

export default function Page() {
    return <ProcesoPage />;
}
