# Stephano — Engineering Digital Systems

Plataforma corporativa tecnológica profesional construida con arquitectura moderna y escalable.

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Estilos | CSS Modules, CSS Variables (Puro CSS) |
| Animaciones | Framer Motion |
| Backend | Next.js API Routes + Server Architecture |
| Base de datos | Supabase (PostgreSQL) |
| ORM | Prisma |
| Validación | Zod |
| Auth | JWT (preparado) |

## Estructura del Proyecto

```
stephano/
├── app/                    # Next.js App Router pages
│   ├── diagnostico/        # Interactive Quiz system
│   ├── portafolio/         # Projects portfolio with CSS mockups
│   ├── servicios/          # Services details  
│   ├── soluciones/         # Industry solutions
│   ├── proceso/            # Development workflow
│   ├── inversion/          # Pricing & plans
│   ├── contacto/           # Contact page + lead capture
│   └── page.tsx            # Premium Home page
├── components/             # Reusable UI components
│   ├── Navbar/             # Advanced navigation
│   └── Footer/             # Brand footer
├── modules/                # Feature modules
│   └── chat/               # StephanoBot (AI Agent)
├── server/                 # Backend architecture
│   ├── services/           # LeadService & logic
│   └── db.ts               # Prisma client singleton
├── prisma/                 # Database schema (Supabase compatible)
└── styles/                 # Global CSS & Design System
```

## Inicio Rápido

### 1. Clonar e instalar

```bash
git clone <repo-url> stephano
cd stephano
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:
```bash
DATABASE_URL="postgresql://postgres.USER:PASS@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.USER:PASS@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
```

### 3. Sincronizar Base de Datos

```bash
npx prisma generate
npx prisma db push
```

### 4. Ejecutar desarrollo

```bash
npm run dev
```

Visita `http://localhost:3000`

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/leads` | Crear nuevo lead (Bot/Quiz/Form) |

## Seguridad

- **Validación**: Zod para tipado estricto en API.
- **Sanitización**: Prevención de XSS en inputs.
- **Rate Limiting**: Protección contra spam en registro de leads.
- **Supabase**: Conexión segura via pooling.

## Licencia

© 2026 Stephano. Todos los derechos reservados.
