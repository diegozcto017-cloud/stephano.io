import type { Metadata } from 'next';
import styles from '@/styles/pages.module.css';

export const metadata: Metadata = {
    title: 'Términos y Condiciones',
    description: 'Términos y condiciones de uso de los servicios de Stephano.',
};

export default function TerminosPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Términos y Condiciones</h1>
                    <p className={styles.pageSubtitle}>Última actualización: Febrero 2026</p>
                </div>

                <div className={styles.legalContent}>
                    <h2>1. Aceptación de los Términos</h2>
                    <p>
                        Al acceder y utilizar el sitio web stephano.io (&quot;el sitio&quot;), aceptas quedar vinculado por estos términos y
                        condiciones. Si no estás de acuerdo con alguno de estos términos, no utilices el sitio ni nuestros servicios.
                    </p>

                    <h2>2. Descripción de Servicios</h2>
                    <p>
                        Stephano ofrece servicios de ingeniería digital que incluyen, pero no se limitan a: desarrollo web,
                        desarrollo de sistemas personalizados, aplicaciones móviles, automatización de procesos, e-commerce y
                        optimización de plataformas existentes.
                    </p>

                    <h2>3. Uso del Sitio</h2>
                    <p>Te comprometes a utilizar el sitio de manera lícita y a no:</p>
                    <ul>
                        <li>Intentar acceder sin autorización a sistemas o datos del sitio</li>
                        <li>Usar el sitio para transmitir contenido malicioso o ilegal</li>
                        <li>Interferir con el funcionamiento normal del sitio</li>
                        <li>Recopilar información de otros usuarios sin su consentimiento</li>
                        <li>Enviar spam o comunicaciones no solicitadas a través del sitio</li>
                    </ul>

                    <h2>4. Propiedad Intelectual</h2>
                    <p>
                        Todo el contenido del sitio, incluyendo pero no limitado a textos, gráficos, logotipos, íconos, imágenes,
                        código fuente y software, es propiedad de Stephano o sus licenciantes y está protegido por las leyes de
                        propiedad intelectual aplicables.
                    </p>
                    <p>
                        No se permite la reproducción, distribución, modificación o uso comercial del contenido del sitio sin
                        autorización previa por escrito.
                    </p>

                    <h2>5. Servicios y Contratos</h2>
                    <h3>5.1 Propuestas y Cotizaciones</h3>
                    <p>
                        Las propuestas y cotizaciones emitidas tienen una vigencia de 30 días naturales a partir de su fecha de
                        emisión, salvo que se indique lo contrario. Los precios pueden variar si el alcance del proyecto cambia.
                    </p>

                    <h3>5.2 Pagos</h3>
                    <p>
                        Los términos de pago se establecen en cada contrato individual. Generalmente se requiere un anticipo del
                        50% para iniciar el proyecto, con el saldo restante a la entrega o según los hitos acordados.
                    </p>

                    <h3>5.3 Plazos de Entrega</h3>
                    <p>
                        Los plazos de entrega son estimados y dependen de la colaboración activa del cliente para proporcionar
                        contenido, retroalimentación y aprobaciones de manera oportuna.
                    </p>

                    <h2>6. Limitación de Responsabilidad</h2>
                    <p>
                        Stephano no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten
                        del uso o la imposibilidad de uso del sitio o nuestros servicios. Nuestra responsabilidad total en
                        cualquier caso no excederá el monto pagado por el cliente por los servicios específicos en cuestión.
                    </p>

                    <h2>7. Garantía</h2>
                    <p>
                        Todos los proyectos incluyen un período de garantía de 30 días para corrección de bugs o defectos
                        atribuibles a nuestro trabajo. Esta garantía no cubre modificaciones realizadas por terceros ni
                        cambios en requerimientos posteriores a la entrega.
                    </p>

                    <h2>8. Confidencialidad</h2>
                    <p>
                        Ambas partes se comprometen a mantener la confidencialidad de la información técnica, comercial y
                        financiera intercambiada durante la relación de trabajo. Esta obligación sobrevive a la terminación
                        del contrato.
                    </p>

                    <h2>9. Terminación</h2>
                    <p>
                        Cualquiera de las partes puede terminar la relación contractual con 15 días de aviso por escrito.
                        En caso de terminación, el cliente pagará por el trabajo completado hasta la fecha de terminación.
                    </p>

                    <h2>10. Jurisdicción y Ley Aplicable</h2>
                    <p>
                        Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier disputa será
                        resuelta ante los tribunales competentes de la Ciudad de México, renunciando ambas partes a
                        cualquier otro fuero que pudiera corresponderles.
                    </p>

                    <h2>11. Modificaciones</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán
                        en vigor inmediatamente después de su publicación en el sitio. El uso continuado del sitio después
                        de la publicación de cambios constituye la aceptación de los mismos.
                    </p>

                    <h2>12. Contacto</h2>
                    <p>
                        Para cualquier consulta sobre estos términos y condiciones, contacta a: legal@stephano.io
                    </p>
                </div>
            </div>
        </div>
    );
}
