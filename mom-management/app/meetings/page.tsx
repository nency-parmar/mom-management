import { cookies } from 'next/headers';
import MeetingsClient from './MeetingsClient';

export const dynamic = 'force-dynamic';

export default async function MeetingsPage() {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value || 'USER';

    return <MeetingsClient initialUserRole={userRole} />;
}

