'use client';

import { useState, useEffect, useMemo } from 'react';
import ClientDate from '@/components/ClientDate';
import { cancelMeeting, getMeetings } from '@/app/actions/meetings';

// Define the shape of the data we expect from the server
export interface MeetingWithDetails {
    MeetingID: number;
    MeetingDate: Date;
    MeetingTypeID: number;
    MeetingDescription: string | null;
    DocumentPath: string | null;
    IsCancelled: boolean;
    CancellationReason: string | null;
    CancellationDateTime: Date | null;
    MeetingType: {
        MeetingTypeName: string;
    };
    MeetingMember: {
        MeetingMemberID: number;
        MeetingID: number;
        StaffID: number;
        IsPresent: boolean;
        Remarks: string | null;
        Staff: {
            StaffName: string;
        };
    }[];
}

export default function MeetingsClient() {
    const [meetings, setMeetings] = useState<MeetingWithDetails[]>([]);
    const [userRole, setUserRole] = useState<string>('USER');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const meetingsData = await getMeetings();
                setMeetings(meetingsData);
                // Get userRole from cookies
                const cookies = document.cookie.split(';').reduce((acc, cookie) => {
                    const [key, value] = cookie.trim().split('=');
                    acc[key] = value;
                    return acc;
                }, {} as Record<string, string>);
                setUserRole(cookies.userRole || 'USER');
            } catch (error) {
                console.error('Error fetching meetings data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const today = new Date().toDateString();
    const isAdmin = userRole === 'ADMIN';

    const primaryBlue = '#1d4ed8';
    const headerBlue = {
        backgroundColor: '#0f172a',
        color: '#e5e7eb'
    };

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All Types');

    // Get unique meeting types for filter dropdown
    const meetingTypes = useMemo(() => {
        const types = new Set(meetings.map(m => m.MeetingType.MeetingTypeName));
        return Array.from(types);
    }, [meetings]);

    // Real-time filtered meetings
    const filteredMeetings = useMemo(() => {
        return meetings.filter(meeting => {
            // Search filter
            const query = searchQuery.toLowerCase();
            const matchesSearch = !query ||
                meeting.MeetingDescription?.toLowerCase().includes(query) ||
                meeting.MeetingID.toString().includes(query) ||
                meeting.MeetingType.MeetingTypeName.toLowerCase().includes(query) ||
                meeting.MeetingMember.some(m => m.Staff.StaffName.toLowerCase().includes(query));

            // Status filter
            let matchesStatus = true;
            if (statusFilter === 'Upcoming') {
                matchesStatus = !meeting.IsCancelled && new Date(meeting.MeetingDate) > new Date();
            } else if (statusFilter === 'Completed') {
                matchesStatus = !meeting.IsCancelled && new Date(meeting.MeetingDate) <= new Date();
            } else if (statusFilter === 'Cancelled') {
                matchesStatus = meeting.IsCancelled;
            }

            // Type filter
            const matchesType = typeFilter === 'All Types' || meeting.MeetingType.MeetingTypeName === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [meetings, searchQuery, statusFilter, typeFilter]);

    const handleCancel = async (id: number) => {
        if (!isAdmin) return;
        if (confirm("Are you sure you want to cancel this meeting?")) {
            const reason = prompt("Please enter a cancellation reason:");
            if (reason) {
                try {
                    await cancelMeeting(id, reason);
                    window.location.reload();
                } catch (error) {
                    alert("Failed to cancel meeting");
                }
            }
        }
    };

    return (
        <div className="py-3 py-md-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                <div>
                    <h1 className="h4 fw-bold text-dark mb-1">Meetings Management</h1>
                    <p className="text-muted mb-0">
                        {isAdmin
                            ? "Create, schedule, track attendance, and manage MOM documents for all meetings."
                            : "View scheduled meetings and track meeting details."}
                    </p>
                </div>

                <div className="d-flex flex-column align-items-md-end mt-3 mt-md-0">
                    <span className="small text-muted">Today</span>
                    <span className="fw-semibold">{today}</span>
                    {isAdmin && (
                        <div className="mt-2">
                            <a href="/meetings/new" className="btn btn-sm" style={{
                                backgroundColor: primaryBlue,
                                borderColor: primaryBlue,
                                color: "#fff",
                            }}>
                                + New Meeting
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Search & Filters — real-time, no button */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label small text-muted fw-semibold">Search Meetings</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search by description, ID, type, or staff..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted fw-semibold">Meeting Type</label>
                            <select
                                className="form-select form-select-sm"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option>All Types</option>
                                {meetingTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small text-muted fw-semibold">Status</label>
                            <select
                                className="form-select form-select-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option>All</option>
                                <option>Upcoming</option>
                                <option>Completed</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meetings Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center" style={headerBlue}>
                    <h2 className="h6 fw-semibold mb-0">All Meetings ({filteredMeetings.length})</h2>
                </div>
                <div className="card-body p-0">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '6%' }}>#</th>
                                <th style={{ width: '30%' }}>Description</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Attendance</th>
                                <th>Status</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMeetings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted">
                                        No meetings found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredMeetings.map((meeting) => {
                                    const staffCount = meeting.MeetingMember.length;
                                    const presentCount = meeting.MeetingMember.filter(m => m.IsPresent).length;

                                    return (
                                        <tr key={meeting.MeetingID}>
                                            <td className="fw-semibold">{meeting.MeetingID}</td>
                                            <td>
                                                <div className="fw-medium">{meeting.MeetingDescription}</div>
                                            </td>
                                            <td className="small"><ClientDate dateString={meeting.MeetingDate} /></td>
                                            <td>
                                                <span className="badge bg-light text-dark border">{meeting.MeetingType.MeetingTypeName}</span>
                                            </td>
                                            <td>
                                                <span className="badge bg-success">{presentCount}/{staffCount}</span>
                                            </td>
                                            <td>
                                                {meeting.IsCancelled ? (
                                                    <span className="badge bg-danger">Cancelled</span>
                                                ) : (
                                                    <span className="badge bg-primary">Active</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <a href={`/meetings/${meeting.MeetingID}`} className="btn btn-outline-primary btn-sm">View</a>
                                                    {isAdmin && (
                                                        <>
                                                            <a href={`/meetings/edit/${meeting.MeetingID}`} className="btn btn-outline-secondary btn-sm">Edit</a>
                                                            {!meeting.IsCancelled && (
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleCancel(meeting.MeetingID)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer bg-light border-0 py-2">
                    <small className="text-muted">
                        Showing {filteredMeetings.length} of {meetings.length} meetings.
                    </small>
                </div>
            </div>

            {/* Quick Actions Sidebar - Only for Admin */}
            {isAdmin && (
                <div className="card border-0 shadow-sm mt-4">
                    <div className="card-body">
                        <h2 className="h6 fw-semibold mb-3">Quick Links</h2>
                        <div className="d-grid gap-2">
                            <a href="/meetings/new" className="btn btn-sm" style={{ backgroundColor: primaryBlue, borderColor: primaryBlue, color: "#fff" }}>
                                + Create New Meeting
                            </a>
                            <a href="/master/meeting-type" className="btn btn-sm btn-outline-primary">
                                Manage Meeting Types
                            </a>
                            <a href="/master/staff" className="btn btn-sm btn-outline-primary">
                                Staff Directory
                            </a>
                            <a href="/attendance" className="btn btn-sm btn-outline-secondary">
                                Mark Attendance
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
