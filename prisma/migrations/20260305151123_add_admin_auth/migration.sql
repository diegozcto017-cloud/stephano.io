-- CreateTable
CREATE TABLE "leads" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "empresa" VARCHAR(120),
    "email" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(30),
    "tipo_proyecto" VARCHAR(80) NOT NULL,
    "presupuesto_rango" VARCHAR(60),
    "urgencia" VARCHAR(40),
    "mensaje" TEXT,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'nuevo',
    "progreso" INTEGER NOT NULL DEFAULT 0,
    "url_proyecto" VARCHAR(255),
    "notas_internas" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ads" (
    "id" SERIAL NOT NULL,
    "scratch" TEXT NOT NULL,
    "headline" VARCHAR(255),
    "copy" TEXT,
    "mediaUrl" VARCHAR(500),
    "mediaType" VARCHAR(20) NOT NULL DEFAULT 'image',
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "publishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
