import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userIdCookie = cookieStore.get('userId');

        if (!userIdCookie) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const userId = parseInt(userIdCookie.value);

        const meetings = await prisma.meetings.findMany({
            where: {
                MeetingMember: {
                    some: {
                        StaffID: userId
                    }
                }
            },
            include: {
                MeetingType: true,
                MeetingMember: {
                    where: {
                        StaffID: userId
                    },
                    select: {
                        IsPresent: true
                    }
                }
            },
            orderBy: {
                MeetingDate: 'desc'
            }
        });

        return NextResponse.json(meetings);
    } catch (error) {
        console.error('Error fetching user meetings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}