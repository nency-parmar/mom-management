import { getMeeting, deleteMeeting } from '@/app/actions/meetings';
import { notFound } from 'next/navigation';
import ClientDate from '@/components/ClientDate';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function MeetingDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = parseInt(params.id);
    const meeting = await getMeeting(id);

    if (!meeting) {
        notFound();
    }

    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value || 'USER';
    const isAdmin = userRole === 'ADMIN';

    const headerBlue = {
        backgroundColor: '#0f172a',
        color: '#e5e7eb'
    };
    const primaryBlue = '#1d4ed8';

    return (
        <div className="py-3 py-md-4">
            <div className="container-fluid" style={{ maxWidth: "1100px" }}>

                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <a href="/meetings" className="btn btn-sm btn-outline-secondary mb-2">
                            ← Back to Meetings
                        </a>
                        <h1 className="h4 fw-bold mb-1">Meeting #{meeting.MeetingID}</h1>
                        <p className="text-muted small mb-0">
                            {meeting.MeetingType.MeetingTypeName}
                        </p>
                    </div>
                    {isAdmin && (
                        <div className="d-flex gap-2">
                            <a href={`/meetings/edit/${meeting.MeetingID}`} className="btn btn-sm btn-outline-primary">
                                Edit Meeting
                            </a>
                        </div>
                    )}
                </div>

                <div className="row g-4">
                    {/* Main Details */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header" style={headerBlue}>
                                <h6 className="mb-0 fw-semibold">Meeting Overview</h6>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">Result/Description</small>
                                        <div className="fw-medium">{meeting.MeetingDescription}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">Date & Time</small>
                                        <div className="fw-medium">
                                            <ClientDate dateString={meeting.MeetingDate} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <small className="text-muted d-block">Status</small>
                                        <div>
                                            {meeting.IsCancelled ?
                                                <span className="badge bg-danger">Cancelled</span> :
                                                <span className="badge bg-success">Active</span>
                                            }
                                        </div>
                                    </div>
                                    {meeting.IsCancelled && (
                                        <div className="col-12">
                                            <small className="text-muted d-block">Cancellation Reason</small>
                                            <div className="text-danger">{meeting.CancellationReason}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Attendees */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h6 className="mb-0 fw-semibold text-dark">Attendees ({meeting.MeetingMember.length})</h6>
                            </div>
                            <ul className="list-group list-group-flush">
                                {meeting.MeetingMember.length === 0 ? (
                                    <li className="list-group-item text-muted">No attendees listed.</li>
                                ) : (
                                    meeting.MeetingMember.map(member => (
                                        <li key={member.MeetingMemberID} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="fw-medium">{member.Staff.StaffName}</span>
                                                {member.Remarks && <small className="text-muted ms-2">({member.Remarks})</small>}
                                            </div>
                                            {member.IsPresent ?
                                                <span className="badge bg-success-subtle text-success">Present</span> :
                                                <span className="badge bg-secondary-subtle text-secondary">Absent</span>
                                            }
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar / Attachments */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header" style={headerBlue}>
                                <h6 className="mb-0 fw-semibold">Documents</h6>
                            </div>
                            <div className="card-body">
                                {meeting.DocumentPath ? (
                                    <a href={meeting.DocumentPath} className="btn btn-outline-primary w-100" target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-file-earmark-text me-2"></i> View Document
                                    </a>
                                ) : (
                                    <div className="text-center text-muted py-3">
                                        No documents attached
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
