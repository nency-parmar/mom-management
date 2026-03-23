'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getMeetings() {
    try {
        const meetings = await prisma.meetings.findMany({
            include: {
                MeetingType: true,
                MeetingMember: {
                    include: {
                        Staff: true
                    }
                }
            },
            orderBy: {
                MeetingDate: 'desc'
            }
        });
        return meetings;
    } catch (error) {
        console.error("Failed to fetch meetings:", error);
        return [];
    }
}

export async function getUserMeetings(staffId: number) {
    try {
        // Find meetings where this staff member is a participant
        const meetings = await prisma.meetings.findMany({
            where: {
                MeetingMember: {
                    some: {
                        StaffID: staffId
                    }
                }
            },
            include: {
                MeetingType: true,
                MeetingMember: {
                    // Include all members just for context, or just the user? 
                    // Usually you want to see who else is there.
                    include: {
                        Staff: true
                    }
                }
            },
            orderBy: {
                MeetingDate: 'desc'
            }
        });
        return meetings;
    } catch (error) {
        console.error("Failed to fetch user meetings:", error);
        return [];
    }
}

export async function getMeeting(id: number) {
    try {
        const meeting = await prisma.meetings.findUnique({
            where: { MeetingID: id },
            include: {
                MeetingType: true,
                MeetingMember: {
                    include: {
                        Staff: true
                    }
                }
            }
        });
        return meeting;
    } catch (error) {
        console.error("Failed to fetch meeting:", error);
        return null;
    }
}

export async function getMeetingTypes() {
    try {
        return await prisma.meetingType.findMany();
    } catch (error) {
        console.error("Failed to fetch meeting types:", error);
        return [];
    }
}

export async function createMeeting(formData: FormData) {
    const meetingTypeId = formData.get('meetingTypeId');
    const date = formData.get('date');
    const time = formData.get('time');
    const description = formData.get('description');
    const documentPath = formData.get('documentPath'); // Handle file upload separately/later if needed

    if (!meetingTypeId || !date || !time || !description) {
        throw new Error("Missing required fields");
    }

    const dateTimeString = `${date}T${time}:00`;
    const meetingDate = new Date(dateTimeString);

    let docPathValue: string | null = null;
    if (documentPath instanceof File && documentPath.name) {
        docPathValue = documentPath.name;
    } else if (typeof documentPath === 'string') {
        docPathValue = documentPath;
    }

    await prisma.meetings.create({
        data: {
            MeetingTypeID: Number(meetingTypeId),
            MeetingDate: meetingDate,
            MeetingDescription: description as string,
            DocumentPath: docPathValue,
            IsCancelled: false,
        }
    });

    revalidatePath('/meetings');
    redirect('/meetings');
}

export async function cancelMeeting(meetingId: number, reason: string) {
    try {
        await prisma.meetings.update({
            where: { MeetingID: meetingId },
            data: {
                IsCancelled: true,
                CancellationReason: reason,
                CancellationDateTime: new Date()
            }
        });
        revalidatePath('/meetings');
    } catch (error) {
        console.error("Failed to cancel meeting:", error);
        throw error;
    }
}

export async function updateMeeting(meetingId: number, formData: FormData) {
    const meetingTypeId = formData.get('meetingTypeId');
    const date = formData.get('date');
    const time = formData.get('time');
    const description = formData.get('description');

    // Combining date and time logic
    const dateTimeString = `${date}T${time}:00`;
    const meetingDate = new Date(dateTimeString);

    await prisma.meetings.update({
        where: { MeetingID: meetingId },
        data: {
            MeetingTypeID: Number(meetingTypeId),
            MeetingDate: meetingDate,
            MeetingDescription: description as string,
        }
    });

    revalidatePath('/meetings');
    redirect('/meetings');
}

export async function deleteMeeting(meetingId: number) {
    try {
        await prisma.meetings.delete({
            where: { MeetingID: meetingId }
        });
        revalidatePath('/meetings');
    } catch (error) {
        console.error("Failed to delete meeting:", error);
        throw error;
    }
}
