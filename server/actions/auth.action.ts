'use server';

import { cookies } from 'next/headers';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function verifyAdminPassword(password: string): Promise<boolean> {
    const email = process.env.ADMIN_EMAIL;
    if (!email) {
        console.error('ADMIN_EMAIL not set');
        return false;
    }

    try {
        // First try to find the user in the database
        const admin = await prisma.adminUser.findUnique({
            where: { email }
        });

        if (admin) {
            const isValid = await bcrypt.compare(password, admin.password);
            if (isValid) {
                await setAdminSession();
                return true;
            }
        }
    } catch (error) {
        console.error('Database Auth Error:', error);
    }

    // Fallback to environment variable for initial setup or if DB fails
    const validKey = process.env.ADMIN_API_KEY;
    if (validKey && password === validKey) {
        await setAdminSession();
        return true;
    }

    return false;
}

async function setAdminSession() {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
    });
}

export async function getAdminApiKey(): Promise<string | null> {
    // Only return the key if the request comes from an authenticated server context
    // This function will be used by server components to pass the key down or to fetch directly
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (session?.value === 'authenticated') {
        return process.env.ADMIN_API_KEY || null;
    }

    return null;
}
