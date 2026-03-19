'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    StaffID: number;
    StaffName: string;
    EmailAddress: string | null;
    MobileNo: string | null;
    Remarks: string | null;
    Role: string;
    Created: Date;
    Modified: Date;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/profile');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <section className="py-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </section>
        );
    }

    if (!user) {
        return null;
    }

    const isAdmin = user.Role === 'ADMIN';
    const initials = user.StaffName.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <section className="py-4">
            <div className="profile-grid">
                <aside className="card border-0 shadow-sm p-4" style={{ borderRadius: '24px' }}>
                    <div className="d-flex flex-column align-items-center text-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white mb-3 shadow"
                            style={{
                                width: '100px',
                                height: '100px',
                                fontSize: '2.5rem',
                                background: 'linear-gradient(135deg, #1d4ed8, #0f172a)',
                                fontWeight: 'bold'
                            }}>
                            {initials}
                        </div>
                        <h3 className="fw-bold mb-1">{user.StaffName}</h3>
                        <p className="text-primary small fw-bold mb-3">{user.Role}</p>
                        <div style={{ width: "100%", marginTop: "1rem" }}>
                            <div className="mb-3 text-start bg-light rounded-3 p-3">
                                <small className="text-muted fw-bold d-block mb-1">EMAIL</small>
                                <div className="fw-semibold text-dark">{user.EmailAddress}</div>
                            </div>
                            <div className="mb-3 text-start bg-light rounded-3 p-3">
                                <small className="text-muted fw-bold d-block mb-1">PHONE</small>
                                <div className="fw-semibold text-dark">{user.MobileNo || "Not provided"}</div>
                            </div>
                            <div className="mb-4 text-start bg-light rounded-3 p-3">
                                <small className="text-muted fw-bold d-block mb-1">REMARKS</small>
                                <div className="fw-semibold text-dark">{user.Remarks || "No remarks"}</div>
                            </div>
                            <div className="d-flex gap-2">
                                <Link href="#" className="btn btn-primary flex-grow-1 py-2 fw-bold" style={{ borderRadius: '10px' }}>Edit Profile</Link>
                                <Link href="#" className="btn btn-outline-secondary flex-grow-1 py-2 fw-bold" style={{ borderRadius: '10px' }}>Settings</Link>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '24px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="fw-bold mb-0">Overview</h4>
                        <div className="text-muted small">Member since {new Date(user.Created).toLocaleDateString()}</div>
                    </div>

                    <section className="mb-4">
                        <h6 className="fw-bold text-secondary mb-3">System Information</h6>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="p-3 bg-light rounded-4">
                                    <small className="text-muted d-block mb-1">Staff ID</small>
                                    <span className="fw-bold">#{user.StaffID}</span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-3 bg-light rounded-4">
                                    <small className="text-muted d-block mb-1">Role Type</small>
                                    <span className="fw-bold">{user.Role}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h6 className="fw-bold text-secondary mb-3">Security</h6>
                        <div className="p-3 border rounded-4 d-flex justify-content-between align-items-center">
                            <div>
                                <div className="fw-bold">Password</div>
                                <div className="text-muted small">Updated {new Date(user.Modified).toLocaleDateString()}</div>
                            </div>
                            <button className="btn btn-sm btn-outline-primary fw-bold">Change</button>
                        </div>
                    </section>
                </div>
            </div>

            <div className="mt-4">
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '24px' }}>
                    <h6 className="fw-bold mb-3">Quick Actions</h6>
                    <div className="d-flex flex-wrap gap-2">
                        <Link href="/meetings" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '10px' }}>View Meetings</Link>
                        {isAdmin && (
                            <>
                                <Link href="/meetings/new" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '10px' }}>New Meeting</Link>
                                <Link href="/attendance" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '10px' }}>Attendance</Link>
                                <Link href="/master/staff" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '10px' }}>Manage Staff</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
