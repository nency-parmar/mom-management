import { getMeetings } from '@/app/actions/meetings';
import MeetingsClient from './MeetingsClient';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MeetingsPage() {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value || 'USER';

    const meetings = await getMeetings();

    return <MeetingsClient initialMeetings={meetings as any} userRole={userRole} />;
}

