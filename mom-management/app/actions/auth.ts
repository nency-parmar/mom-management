'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { error: "All fields are required" };
    }

    try {
        const existingUser = await prisma.staff.findFirst({
            where: { EmailAddress: email }
        });

        if (existingUser) {
            return { error: "Email already registered" };
        }

        const user = await prisma.staff.create({
            data: {
                StaffName: name,
                EmailAddress: email,
                Password: password,
                Role: 'USER',
                UserActivity: {
                    create: {
                        ActivityType: 'SIGNUP'
                    }
                }
            }
        });

        const cookieStore = await cookies();
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const
        };
        cookieStore.set('userId', user.StaffID.toString(), cookieOptions);
        cookieStore.set('userRole', 'USER', cookieOptions);
    } catch (e) {
        console.error("Signup error:", e);
        return { error: "Failed to create account. Please try again." };
    }

    redirect('/user-dashboard');
}

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: "Email and Password are required" };
    }

    let targetRole = '';
    try {
        const user = await prisma.staff.findFirst({
            where: {
                EmailAddress: email,
                Password: password
            }
        });

        if (!user) {
            return { error: "Invalid credentials" };
        }

        // Track login activity
        await prisma.staff.update({
            where: { StaffID: user.StaffID },
            data: {
                LastLogin: new Date(),
                UserActivity: {
                    create: {
                        ActivityType: 'LOGIN'
                    }
                }
            }
        });

        const cookieStore = await cookies();
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const
        };
        cookieStore.set('userId', user.StaffID.toString(), cookieOptions);
        cookieStore.set('userRole', user.Role || 'USER', cookieOptions);

        targetRole = user.Role || 'USER';
    } catch (e) {
        console.error("Login error:", e);
        return { error: "An error occurred during login." };
    }

    if (targetRole === 'ADMIN') {
        redirect('/');
    } else {
        redirect('/user-dashboard');
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    cookieStore.delete('userRole');
    redirect('/login');
}
export async function getSession() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    const role = cookieStore.get('userRole')?.value;

    if (!userId) return null;

    const user = await prisma.staff.findUnique({
        where: { StaffID: parseInt(userId) }
    });

    return user ? {
        id: user.StaffID,
        name: user.StaffName,
        role: user.Role,
        initials: user.StaffName.split(' ').map(n => n[0]).join('').toUpperCase()
    } : null;
}
