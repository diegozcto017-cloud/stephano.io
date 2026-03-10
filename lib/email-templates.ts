export function getPasswordResetTemplate(code: string) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña - Stephano.io</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                background-color: #000208;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                color: #ffffff;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(0, 102, 255, 0.15);
                border-radius: 24px;
                padding: 48px 40px;
                text-align: center;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            }
            .logo {
                margin-bottom: 32px;
            }
            .logo-text {
                font-size: 28px;
                font-weight: 800;
                letter-spacing: -1px;
                color: #ffffff;
            }
            .logo-accent {
                color: #0066FF;
            }
            h1 {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 16px;
                background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            p {
                font-size: 16px;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.6);
                margin-bottom: 32px;
            }
            .code-container {
                background: rgba(0, 102, 255, 0.1);
                border: 1px dashed rgba(0, 102, 255, 0.3);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 32px;
            }
            .code {
                font-size: 42px;
                font-weight: 800;
                letter-spacing: 8px;
                color: #00E5FF;
                margin: 0;
            }
            .footer {
                margin-top: 40px;
                font-size: 13px;
                color: rgba(255, 255, 255, 0.3);
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                padding-top: 24px;
            }
            .warning {
                color: #ff6b6b;
                font-size: 13px;
                margin-top: 16px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="logo">
                    <span class="logo-text">Stephano<span class="logo-accent">.io</span></span>
                </div>
                <h1>Código de Verificación</h1>
                <p>Hola Diego, has solicitado restablecer tu contraseña para el panel de administración. Utiliza el siguiente código de 6 dígitos para completar el proceso:</p>
                
                <div class="code-container">
                    <h2 class="code">${code}</h2>
                </div>
                
                <p class="warning">Este código expirará en 15 minutos. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
                
                <div class="footer">
                    &copy; 2026 Stephano.io - Ingeniería Digital de Alto Rendimiento
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}
