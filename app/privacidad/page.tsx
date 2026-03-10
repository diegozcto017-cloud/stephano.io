import type { Metadata } from 'next';
import styles from '@/styles/pages.module.css';

export const metadata: Metadata = {
    title: 'Política de Privacidad',
    description: 'Política de privacidad y protección de datos de Stephano.',
};

export default function PrivacidadPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Política de Privacidad</h1>
                    <p className={styles.pageSubtitle}>Última actualización: Febrero 2026</p>
                </div>

                <div className={styles.legalContent}>
                    <h2>1. Información General</h2>
                    <p>
                        En Stephano (&quot;nosotros&quot;, &quot;nuestro&quot;, &quot;la empresa&quot;), respetamos tu privacidad y nos comprometemos a proteger
                        tus datos personales. Esta política describe cómo recopilamos, usamos, almacenamos y protegemos tu información
                        cuando visitas nuestro sitio web stephano.io o utilizas nuestros servicios.
                    </p>

                    <h2>2. Datos que Recopilamos</h2>
                    <h3>2.1 Datos proporcionados voluntariamente</h3>
                    <p>Cuando completas un formulario de contacto o interactúas con nuestro sistema de chat, podemos recopilar:</p>
                    <ul>
                        <li>Nombre completo</li>
                        <li>Nombre de empresa</li>
                        <li>Dirección de correo electrónico</li>
                        <li>Tipo de proyecto de interés</li>
                        <li>Rango de presupuesto estimado</li>
                        <li>Nivel de urgencia</li>
                        <li>Descripción del proyecto</li>
                    </ul>

                    <h3>2.2 Datos recopilados automáticamente</h3>
                    <p>Al visitar nuestro sitio, podemos recopilar automáticamente:</p>
                    <ul>
                        <li>Dirección IP (anonimizada)</li>
                        <li>Tipo de navegador y sistema operativo</li>
                        <li>Páginas visitadas y tiempo de permanencia</li>
                        <li>Fuente de referencia</li>
                    </ul>

                    <h2>3. Uso de la Información</h2>
                    <p>Utilizamos la información recopilada para:</p>
                    <ul>
                        <li>Responder a solicitudes de contacto y consultas</li>
                        <li>Preparar propuestas técnicas y económicas</li>
                        <li>Mejorar nuestro sitio web y servicios</li>
                        <li>Cumplir con obligaciones legales</li>
                        <li>Proteger contra actividades fraudulentas</li>
                    </ul>

                    <h2>4. Almacenamiento y Seguridad</h2>
                    <p>
                        Tus datos se almacenan en servidores seguros con cifrado en tránsito (TLS) y en reposo. Implementamos medidas
                        técnicas y organizativas apropiadas para proteger tus datos contra acceso no autorizado, pérdida o destrucción.
                    </p>

                    <h2>5. Compartición de Datos</h2>
                    <p>
                        No vendemos, alquilamos ni compartimos tus datos personales con terceros con fines comerciales. Podemos compartir
                        información únicamente en los siguientes casos:
                    </p>
                    <ul>
                        <li>Cuando sea requerido por ley o proceso legal</li>
                        <li>Con proveedores de servicios que nos ayudan a operar el sitio (bajo acuerdos de confidencialidad)</li>
                        <li>Para proteger los derechos y seguridad de nuestros usuarios</li>
                    </ul>

                    <h2>6. Tus Derechos</h2>
                    <p>Tienes derecho a:</p>
                    <ul>
                        <li>Acceder a tus datos personales</li>
                        <li>Rectificar datos inexactos</li>
                        <li>Solicitar la eliminación de tus datos</li>
                        <li>Oponerte al procesamiento de tus datos</li>
                        <li>Solicitar la portabilidad de tus datos</li>
                    </ul>
                    <p>Para ejercer estos derechos, contacta a: privacidad@stephano.io</p>

                    <h2 id="cookies">7. Política de Cookies</h2>
                    <h3>7.1 ¿Qué son las cookies?</h3>
                    <p>
                        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
                        Nos permiten recordar tus preferencias, entender cómo interactúas con nuestro sitio y mejorar tu experiencia de navegación.
                    </p>

                    <h3>7.2 Tipos de cookies que utilizamos</h3>
                    <ul>
                        <li><strong>Cookies estrictamente necesarias:</strong> Son esenciales para el funcionamiento del sitio web. Sin ellas, ciertas funciones como la navegación entre páginas o el envío de formularios no funcionarían correctamente.</li>
                        <li><strong>Cookies de preferencias:</strong> Permiten recordar tus configuraciones, como el consentimiento de cookies y preferencias de idioma.</li>
                        <li><strong>Cookies analíticas:</strong> Nos ayudan a entender cómo los visitantes interactúan con el sitio, recopilando información de forma anónima para mejorar nuestros servicios.</li>
                    </ul>

                    <h3>7.3 Cookies de terceros</h3>
                    <p>
                        No utilizamos cookies de seguimiento publicitario ni compartimos información de cookies con redes publicitarias.
                        Las únicas cookies de terceros podrían provenir de servicios integrados como análisis web, siempre bajo acuerdos de protección de datos.
                    </p>

                    <h3>7.4 Gestión de cookies</h3>
                    <p>
                        Puedes gestionar y eliminar cookies a través de la configuración de tu navegador. Ten en cuenta que desactivar
                        ciertas cookies puede afectar la funcionalidad del sitio. Consulta la documentación de tu navegador para
                        obtener instrucciones específicas sobre cómo gestionar las cookies.
                    </p>

                    <h3>7.5 Consentimiento</h3>
                    <p>
                        Al acceder a nuestro sitio por primera vez, se te presentará un aviso sobre el uso de cookies.
                        Al hacer clic en &quot;Aceptar&quot;, consientes el uso de todas las cookies descritas. Puedes retirar tu
                        consentimiento en cualquier momento eliminando las cookies de tu navegador.
                    </p>

                    <h2>8. Retención de Datos</h2>
                    <p>
                        Conservamos tus datos personales únicamente durante el tiempo necesario para cumplir con los fines para los que
                        fueron recopilados, o según lo requiera la legislación aplicable. Los datos de leads se conservan por un máximo
                        de 24 meses si no se establece una relación comercial.
                    </p>

                    <h2>9. Cambios a esta Política</h2>
                    <p>
                        Nos reservamos el derecho de actualizar esta política en cualquier momento. Las modificaciones serán publicadas
                        en esta página con la fecha de última actualización. Te recomendamos revisar esta política periódicamente.
                    </p>

                    <h2>10. Contacto</h2>
                    <p>
                        Si tienes preguntas sobre esta política de privacidad o sobre el manejo de tus datos, puedes contactarnos en:
                        privacidad@stephano.io
                    </p>
                </div>
            </div>
        </div>
    );
}
