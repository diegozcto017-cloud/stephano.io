'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { getPasswordResetTemplate } from '@/lib/email-templates';

const ADMIN_EMAIL = 'diegozcto017@gmail.com';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function requestPasswordReset() {
    try {
        // Generate 6 digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Save code to DB
        await prisma.passwordReset.create({
            data: {
                email: ADMIN_EMAIL,
                code,
                expiresAt
            }
        });

        // Send email
        await transporter.sendMail({
            from: `"Stephano.io Admin" <${process.env.SMTP_USER}>`,
            to: ADMIN_EMAIL,
            subject: `${code} es tu código de acceso - Stephano.io`,
            html: getPasswordResetTemplate(code),
        });

        return { success: true };
    } catch (error) {
        console.error('Request Reset Error:', error);
        return { success: false, error: 'Error al enviar el correo de recuperación' };
    }
}

export async function verifyResetCode(code: string) {
    try {
        const resetRequest = await prisma.passwordReset.findFirst({
            where: {
                email: ADMIN_EMAIL,
                code,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!resetRequest) {
            return { success: false, error: 'Código inválido o expirado' };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Error al verificar el código' };
    }
}

export async function resetAdminPassword(code: string, newPassword: string) {
    try {
        // Double check code
        const resetRequest = await prisma.passwordReset.findFirst({
            where: {
                email: ADMIN_EMAIL,
                code,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!resetRequest) {
            return { success: false, error: 'Código inválido o expirado' };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update admin user
        await prisma.adminUser.upsert({
            where: { email: ADMIN_EMAIL },
            update: { password: hashedPassword },
            create: { email: ADMIN_EMAIL, password: hashedPassword }
        });

        // Clean up reset codes
        await prisma.passwordReset.deleteMany({
            where: { email: ADMIN_EMAIL }
        });

        return { success: true };
    } catch (error) {
        console.error('Reset Password Error:', error);
        return { success: false, error: 'Error al actualizar la contraseña' };
    }
}
