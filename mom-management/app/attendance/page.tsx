'use client';

import { useState, useEffect } from 'react';
import AttendanceClient from './AttendanceClient';
import { MeetingWithDetails } from '../meetings/MeetingsClient';

export default function AttendancePage() {
    const [meetings, setMeetings] = useState<MeetingWithDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { getAttendanceData } = await import('@/app/actions/attendance');
                const data = await getAttendanceData();
                setMeetings(data);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <AttendanceClient initialMeetings={meetings} />
    );
}
