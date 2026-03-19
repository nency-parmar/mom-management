'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientDate from '@/components/ClientDate';

interface User {
    StaffID: number;
    StaffName: string;
    EmailAddress: string | null;
    MobileNo: string | null;
    Remarks: string | null;
    Role: string;
}

interface Meeting {
    MeetingID: number;
    MeetingDate: Date;
    MeetingDescription: string | null;
    IsCancelled: boolean;
    MeetingType: {
        MeetingTypeID: number;
        MeetingTypeName: string;
    };
}

export default function UserDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, meetingsResponse] = await Promise.all([
                    fetch('/api/profile'),
                    fetch('/api/user-meetings')
                ]);

                if (userResponse.ok && meetingsResponse.ok) {
                    const userData = await userResponse.json();
                    const meetingsData = await meetingsResponse.json();
                    setUser(userData);
                    setMeetings(meetingsData);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="py-5" style={{ background: '#f8fafc', minHeight: '100vh' }}>
                <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="py-5" style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <div className="container">
                {/* Welcome Section */}
                <div className="mb-5">
                    <h1 className="h3 fw-bold text-dark mb-1">Welcome back, {user.StaffName.split(' ')[0]}!</h1>
                    <p className="text-secondary">Here's an overview of your meetings and activity.</p>
                </div>

                <div className="row g-4">
                    {/* Stats Section */}
                    <div className="col-12">
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px', background: 'white' }}>
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-primary-subtle p-3 me-3">
                                            <i className="bi bi-calendar-event text-primary fs-4"></i>
                                        </div>
                                        <div>
                                            <h6 className="text-secondary mb-0 small">Total Meetings</h6>
                                            <h3 className="fw-bold mb-0">{meetings.length}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px', background: 'white' }}>
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-success-subtle p-3 me-3">
                                            <i className="bi bi-check-circle text-success fs-4"></i>
                                        </div>
                                        <div>
                                            <h6 className="text-secondary mb-0 small">Upcoming</h6>
                                            <h3 className="fw-bold mb-0">{meetings.filter(m => !m.IsCancelled && new Date(m.MeetingDate) > new Date()).length}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px', background: 'white' }}>
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-danger-subtle p-3 me-3">
                                            <i className="bi bi-x-circle text-danger fs-4"></i>
                                        </div>
                                        <div>
                                            <h6 className="text-secondary mb-0 small">Cancelled</h6>
                                            <h3 className="fw-bold mb-0">{meetings.filter(m => m.IsCancelled).length}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column: Profile */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm overflow-hidden h-100" style={{ borderRadius: '24px' }}>
                            <div className="p-4 bg-primary" style={{ background: 'linear-gradient(135deg, #0f172a, #1d4ed8)' }}> </div>
                            <div className="card-body text-center pt-0" style={{ marginTop: '-40px' }}>
                                <div className="rounded-circle border border-4 border-white secondary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
                                    style={{ width: '100px', height: '100px', fontSize: '2.5rem', background: 'linear-gradient(135deg, #1d4ed8, #0f172a)' }}>
                                    {user.StaffName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </div>
                                <h2 className="h4 fw-bold mb-1">{user.StaffName}</h2>
                                <p className="text-primary small fw-bold mb-3">{user.Role}</p>

                                <div className="text-start bg-light rounded-4 p-4 mt-4">
                                    <div className="mb-3">
                                        <small className="text-muted fw-bold d-block mb-1">EMAIL ADDRESS</small>
                                        <div className="fw-semibold text-dark">{user.EmailAddress}</div>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted fw-bold d-block mb-1">MOBILE NUMBER</small>
                                        <div className="fw-semibold text-dark">{user.MobileNo || "Not provided"}</div>
                                    </div>
                                    <div>
                                        <small className="text-muted fw-bold d-block mb-1">DEPARTMENT</small>
                                        <div className="fw-semibold text-dark">{user.Remarks || "General Staff"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Meetings List */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '24px' }}>
                            <div className="card-header bg-transparent border-0 p-4 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold text-dark">Recent Meetings</h5>
                                <a href="/meetings" className="btn btn-light btn-sm rounded-pill px-3 fw-bold">View All</a>
                            </div>
                            <div className="card-body p-0">
                                {meetings.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="mb-3">
                                            <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                                        </div>
                                        <p className="text-muted">You have no scheduled meetings yet.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="ps-4 border-0 small text-uppercase text-muted fw-bold">Description</th>
                                                    <th className="border-0 small text-uppercase text-muted fw-bold">Date</th>
                                                    <th className="border-0 small text-uppercase text-muted fw-bold">Type</th>
                                                    <th className="pe-4 border-0 small text-uppercase text-muted fw-bold text-end">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {meetings.slice(0, 10).map(meeting => (
                                                    <tr key={meeting.MeetingID}>
                                                        <td className="ps-4 py-3">
                                                            <div className="fw-bold text-dark">{meeting.MeetingDescription}</div>
                                                        </td>
                                                        <td>
                                                            <div className="small text-secondary">
                                                                <ClientDate dateString={meeting.MeetingDate} />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge rounded-pill fw-medium ${meeting.MeetingType.MeetingTypeID === 1 ? 'bg-primary-subtle text-primary' :
                                                                meeting.MeetingType.MeetingTypeID === 2 ? 'bg-info-subtle text-info' :
                                                                    'bg-warning-subtle text-warning'
                                                                }`} style={{ padding: '6px 12px' }}>
                                                                {meeting.MeetingType.MeetingTypeName}
                                                            </span>
                                                        </td>
                                                        <td className="pe-4 text-end">
                                                            {meeting.IsCancelled ? (
                                                                <span className="text-danger small fw-bold">Cancelled</span>
                                                            ) : (
                                                                <a href={`/meetings/${meeting.MeetingID}`}
                                                                    className="btn btn-sm btn-outline-primary rounded-pill px-3">
                                                                    View Details
                                                                </a>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

