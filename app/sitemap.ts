import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://stephano.io';
    const now = new Date();

    return [
        { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${baseUrl}/servicios`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/soluciones`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/cotizar`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/proceso`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/portafolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        // SEO city/service pages
        { url: `${baseUrl}/diseno-web-costa-rica`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
        { url: `${baseUrl}/landing-page-costa-rica`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
        { url: `${baseUrl}/tienda-online-costa-rica`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/agencia-digital-san-jose`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/desarrollo-web-heredia`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
        { url: `${baseUrl}/pagina-web-empresas-costa-rica`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
        { url: `${baseUrl}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terminos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ];
}
