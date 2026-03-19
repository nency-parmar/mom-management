'use client';

import { useState, useEffect } from 'react';
import ClientDate from '@/components/ClientDate';
import { updateAttendanceStatus, updateAttendanceRemarks, getAttendanceData } from '@/app/actions/attendance';

interface MeetingMember {
    MeetingMemberID: number;
    MeetingID: number;
    StaffID: number;
    IsPresent: boolean;
    Remarks: string | null;
    Staff: {
        StaffName: string;
    };
}

interface Meeting {
    MeetingID: number;
    MeetingDate: Date;
    MeetingDescription: string | null;
    MeetingType: {
        MeetingTypeName: string;
    };
    MeetingMember: MeetingMember[];
}

export default function AttendanceClient() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
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

    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const handleMarkAttendance = async (memberId: number, isPresent: boolean) => {
        try {
            await updateAttendanceStatus(memberId, isPresent);
            // Update local state for immediate feedback
            setMeetings(prevMeetings =>
                prevMeetings.map(m => ({
                    ...m,
                    MeetingMember: m.MeetingMember.map(mm =>
                        mm.MeetingMemberID === memberId ? { ...mm, IsPresent: isPresent } : mm
                    )
                }))
            );
        } catch (error) {
            alert('Failed to update attendance');
        }
    };

    const handleUpdateRemarks = async (memberId: number, currentRemarks: string | null) => {
        const newRemarks = prompt('Enter remarks:', currentRemarks || '');
        if (newRemarks !== null) {
            try {
                await updateAttendanceRemarks(memberId, newRemarks);
                // Update local state for immediate feedback
                setMeetings(prevMeetings =>
                    prevMeetings.map(m => ({
                        ...m,
                        MeetingMember: m.MeetingMember.map(mm =>
                            mm.MeetingMemberID === memberId ? { ...mm, Remarks: newRemarks } : mm
                        )
                    }))
                );
            } catch (error) {
                alert('Failed to update remarks');
            }
        }
    };

    // Calculate stats
    const allMembers = meetings.flatMap(m => m.MeetingMember);
    const stats = {
        totalPresent: allMembers.filter(m => m.IsPresent === true).length,
        totalAbsent: allMembers.filter(m => m.IsPresent === false).length,
        pendingMark: allMembers.filter(m => m.IsPresent === null).length,
        totalMeetingsPending: meetings.filter(m => m.MeetingMember.some(mm => mm.IsPresent === null)).length,
    };

    const cardBlue = {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #020617 100%)',
        color: '#e5e7eb'
    };
    const headerBlue = {
        backgroundColor: '#0f172a',
        color: '#e5e7eb'
    };
    const accentYellow = '#eab308';
    const primaryBlue = '#1d4ed8';

    return (
        <div className="py-3 py-md-4">
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                        <div>
                            <h1 className="h4 fw-bold text-dark mb-1">Attendance Management</h1>
                            <p className="text-muted mb-0">
                                Mark attendance for staff members (IsPresent flag) per meeting. View summaries and remarks.
                            </p>
                        </div>

                        <div className="d-flex flex-column align-items-md-end mt-3 mt-md-0">
                            <span className="small text-muted">Today</span>
                            <span className="fw-semibold">{today}</span>
                            <div className="mt-2 d-flex gap-2">
                                <button className="btn btn-sm" style={{
                                    backgroundColor: primaryBlue,
                                    borderColor: primaryBlue,
                                    color: "#fff",
                                }}>
                                    Bulk Mark Attendance
                                </button>
                                <button className="btn btn-sm btn-outline-secondary">Export Report</button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-6 col-md-3">
                            <div className="card border-0 shadow-sm h-100" style={cardBlue}>
                                <div className="card-body">
                                    <p className="text-uppercase small mb-1" style={{ color: "#9ca3af" }}>
                                        Total Present
                                    </p>
                                    <h2 className="display-6 fw-bold mb-0" style={{ color: "#22c55e" }}>
                                        {stats.totalPresent}
                                    </h2>
                                    <p className="small mb-0" style={{ color: "#cbd5f5" }}>
                                        Marked ✓
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card border-0 shadow-sm h-100" style={cardBlue}>
                                <div className="card-body">
                                    <p className="text-uppercase small mb-1" style={{ color: "#9ca3af" }}>
                                        Absent
                                    </p>
                                    <h2 className="display-6 fw-bold mb-0" style={{ color: "#f97373" }}>
                                        {stats.totalAbsent}
                                    </h2>
                                    <p className="small mb-0" style={{ color: "#cbd5f5" }}>
                                        Marked ✗
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card border-0 shadow-sm h-100" style={cardBlue}>
                                <div className="card-body">
                                    <p className="text-uppercase small mb-1" style={{ color: "#9ca3af" }}>
                                        Pending Mark
                                    </p>
                                    <h2 className="display-6 fw-bold mb-0" style={{ color: accentYellow }}>
                                        {stats.pendingMark}
                                    </h2>
                                    <p className="small mb-0" style={{ color: "#cbd5f5" }}>
                                        Staff/Meetings
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="card border-0 shadow-sm h-100" style={cardBlue}>
                                <div className="card-body">
                                    <p className="text-uppercase small mb-1" style={{ color: "#9ca3af" }}>
                                        Meetings Pending
                                    </p>
                                    <h2 className="display-6 fw-bold mb-0" style={{ color: primaryBlue }}>
                                        {stats.totalMeetingsPending}
                                    </h2>
                                    <p className="small mb-0" style={{ color: "#cbd5f5" }}>
                                        Attendance
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meetings with Attendance */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center" style={headerBlue}>
                            <h2 className="h6 fw-semibold mb-0">Meetings & Attendance</h2>
                            <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-light active">All</button>
                                <button className="btn btn-outline-light">Pending Only</button>
                                <button className="btn btn-outline-light">Today</button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {meetings.map((meeting) => (
                                <div key={meeting.MeetingID} className="border-bottom">
                                    <div className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="fw-bold mb-1">{meeting.MeetingDescription}</h5>
                                                <div className="small text-muted">
                                                    MOM-{meeting.MeetingID} • <ClientDate dateString={meeting.MeetingDate} /> • {meeting.MeetingType.MeetingTypeName}
                                                </div>
                                            </div>
                                            <span className="badge bg-primary fs-2xs">
                                                {meeting.MeetingMember.filter(s => s.IsPresent === true).length}/{meeting.MeetingMember.length}
                                            </span>
                                        </div>

                                        {/* Staff Attendance Table */}
                                        <div className="table-responsive">
                                            <table className="table table-sm mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Staff</th>
                                                        <th>Present</th>
                                                        <th>Remarks</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {meeting.MeetingMember.map((member) => (
                                                        <tr key={member.MeetingMemberID}>
                                                            <td className="small fw-medium">{member.Staff.StaffName}</td>
                                                            <td className="small">
                                                                <span className={
                                                                    member.IsPresent === true ? "badge bg-success text-white fs-2xs" :
                                                                        member.IsPresent === false ? "badge bg-danger text-white fs-2xs" :
                                                                            "badge bg-warning text-white fs-2xs"
                                                                }>
                                                                    {member.IsPresent === true ? "Present" : member.IsPresent === false ? "Absent" : "Pending"}
                                                                </span>
                                                            </td>
                                                            <td className="small">{member.Remarks || '-'}</td>
                                                            <td>
                                                                <div className="btn-group btn-group-sm">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-success"
                                                                        title="Mark Present"
                                                                        onClick={() => handleMarkAttendance(member.MeetingMemberID, true)}
                                                                    >
                                                                        ✓
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        title="Mark Absent"
                                                                        onClick={() => handleMarkAttendance(member.MeetingMemberID, false)}
                                                                    >
                                                                        ✗
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-secondary"
                                                                        title="Remarks"
                                                                        onClick={() => handleUpdateRemarks(member.MeetingMemberID, member.Remarks)}
                                                                    >
                                                                        📝
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body">
                            <h2 className="h6 fw-semibold mb-3">Quick Actions</h2>
                            <div className="d-grid gap-2">
                                <a href="/master/staff" className="btn btn-sm btn-outline-primary">
                                    Manage Staff Directory
                                </a>
                                <a href="/reports/summary" className="btn btn-sm btn-outline-secondary">
                                    Attendance Reports
                                </a>
                                <button className="btn btn-sm" style={{ backgroundColor: accentYellow, color: '#1f2933' }}>
                                    Bulk Update
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
