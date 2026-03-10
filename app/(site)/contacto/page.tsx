import type { Metadata } from 'next';
import ContactoPage from './ContactoPage';

export const metadata: Metadata = {
    title: 'Hablemos de tu Proyecto | Contacto Stephano',
    description: '¿Tienes un desafío digital? Conversemos sobre arquitectura, desarrollo y cómo escalar tu negocio. Sin compromiso.',
};

export default function Page() {
    return <ContactoPage />;
}
