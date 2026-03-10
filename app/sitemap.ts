import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://stephano.io';

    const routes = [
        '',
        '/servicios',
        '/soluciones',
        '/proceso',
        '/portafolio',
        '/inversion',
        '/diagnostico',
        '/contacto',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));
}
