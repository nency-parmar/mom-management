import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const totalMeetings = await prisma.meetings.count();
        const completed = await prisma.meetings.count({
            where: {
                MeetingDate: { lt: new Date() },
                IsCancelled: false
            }
        });
        const upcoming = await prisma.meetings.count({
            where: {
                MeetingDate: { gte: new Date() },
                IsCancelled: false
            }
        });
        const cancelled = await prisma.meetings.count({
            where: { IsCancelled: true }
        });
        const totalStaff = await prisma.staff.count();

        const summary = {
            totalMeetings,
            completed,
            upcoming,
            cancelled,
            totalStaff
        };

        return NextResponse.json(summary);
    } catch (error) {
        console.error('Error fetching summary:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}