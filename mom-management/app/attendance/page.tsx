import { getAttendanceData } from '@/app/actions/attendance';
import AttendanceClient from './AttendanceClient';

export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
    const attendanceData = await getAttendanceData();

    // The data fetched from Prisma might need generic casting if types are complex,
    // but Prisma returns types that match the AttendanceClient interface.
    return (
        <AttendanceClient initialMeetings={attendanceData as any} />
    );
}
