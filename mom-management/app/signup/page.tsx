'use client';

import { signup } from '@/app/actions/auth';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await signup(formData);
            if (res && res.error) {
                setError(res.error);
                setIsLoading(false);
            }
        } catch (e) {
            setError("Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex min-vh-100 align-items-center justify-content-center"
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999
            }}>
            {/* Background decorative elements */}
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'rgba(29, 78, 216, 0.15)',
                filter: 'blur(80px)',
                top: '10%',
                right: '10%'
            }}></div>
            <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'rgba(250, 204, 21, 0.05)',
                filter: 'blur(100px)',
                bottom: '10%',
                left: '10%'
            }}></div>

            <div className="card border-0 shadow-lg overflow-hidden"
                style={{
                    maxWidth: '450px',
                    width: '90%',
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <div className="d-inline-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #0f172a, #1d4ed8)',
                                boxShadow: '0 10px 20px rgba(29, 78, 216, 0.3)'
                            }}>
                            <span className="text-warning fw-bold fs-3">M</span>
                        </div>
                        <h1 className="h3 fw-bold text-dark mb-1">Create Account</h1>
                        <p className="text-muted small">Join us to manage your meetings effectively</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger border-0 text-center small py-2 mb-4"
                            style={{ borderRadius: '12px', background: '#fee2e2', color: '#dc2626' }}>
                            <i className="bi bi-exclamation-circle me-2"></i>{error}
                        </div>
                    )}

                    <form action={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">Full Name</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                                    <i className="bi bi-person text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control bg-light border-start-0 py-2"
                                    style={{ borderRadius: '0 12px 12px 0', border: '1px solid #e2e8f0' }}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">Email Address</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                                    <i className="bi bi-envelope text-muted"></i>
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control bg-light border-start-0 py-2"
                                    style={{ borderRadius: '0 12px 12px 0', border: '1px solid #e2e8f0' }}
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary">Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                                    <i className="bi bi-lock text-muted"></i>
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control bg-light border-start-0 py-2"
                                    style={{ borderRadius: '0 12px 12px 0', border: '1px solid #e2e8f0' }}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary">Account Role</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '12px 0 0 12px' }}>
                                    <i className="bi bi-shield-lock text-muted"></i>
                                </span>
                                <select
                                    name="role"
                                    className="form-select bg-light border-start-0 py-2"
                                    style={{ borderRadius: '0 12px 12px 0', border: '1px solid #e2e8f0' }}
                                    required
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 fw-bold py-3 mb-3"
                            style={{
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)'
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Creating Account...
                                </>
                            ) : 'Sign Up'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted small mb-0">
                            Already have an account? <Link href="/login" className="text-primary fw-bold text-decoration-none">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
