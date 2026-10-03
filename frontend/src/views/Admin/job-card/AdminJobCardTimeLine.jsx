import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../AdminLayout.jsx";
import toast from "react-hot-toast";

const AdminJobCardTimeLine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`jobcard/admin/get-card/${id}`);
                if (res.data.success) {
                    setJob(res.data.data);
                } else {
                    toast.error(res.data.message || "Job not found");
                }
            } catch (error) {
                toast.error("Failed to load job card timeline");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="container-fluid p-4 text-center text-white">
                    <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                    Loading timeline...
                </div>
            </AdminLayout>
        );
    }

    if (!job) {
        return (
            <AdminLayout>
                <div className="container-fluid p-4 text-center">
                    <div className="text-danger fs-5 mb-3">Job not found</div>
                    <button className="btn btn-outline-secondary" onClick={() => navigate("/admin/job-cards")}>
                        Back to Job Cards
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                <div className="bg-dark rounded p-3 p-md-4 shadow-sm">

                    {/* Responsive Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4 pb-2 border-bottom border-secondary">
                        <div>
                            <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                                <i className="bi bi-clock-history text-danger"></i>
                                <span>Job Timeline</span>
                            </h4>
                            <span className="badge bg-secondary font-monospace">{job.jobCode}</span>
                        </div>

                        {/* Action Quick Links Bar */}
                        <div className="d-flex flex-wrap gap-2">
                            <Link to={`/admin/job-cards/${id}/media`} className="btn btn-outline-info btn-sm d-flex align-items-center gap-1">
                                <i className="bi bi-images"></i>
                                <span>Manage Media</span>
                            </Link>
                            <Link to={`/admin/job-cards/${id}/services`} className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1">
                                <i className="bi bi-tools"></i>
                                <span>Manage Services</span>
                            </Link>
                            <Link to={`/admin/job-cards/update/${id}`} className="btn btn-outline-success btn-sm d-flex align-items-center gap-1">
                                <i className="bi bi-pencil-square"></i>
                                <span>Update Status</span>
                            </Link>
                            <button
                                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                onClick={() => navigate("/admin/job-cards")}
                            >
                                <i className="bi bi-arrow-left"></i>
                                <span>Back</span>
                            </button>
                        </div>
                    </div>

                    {/* Job Details Card */}
                    <div className="bg-black bg-opacity-25 rounded p-3 mb-4 border border-secondary">
                        <div className="row g-3 align-items-center">
                            <div className="col-6 col-md-3">
                                <small className="text-secondary d-block">Customer</small>
                                <strong className="text-white">{job.userId?.name || "N/A"}</strong>
                                {job.userId?.phone && (
                                    <div className="small text-info mt-1">
                                        <i className="bi bi-telephone me-1"></i>{job.userId?.phone}
                                    </div>
                                )}
                            </div>
                            <div className="col-6 col-md-3">
                                <small className="text-secondary d-block">Vehicle</small>
                                <strong className="text-white">{job.carId?.brand} {job.carId?.model}</strong>
                                <div>
                                    <span className="badge bg-secondary font-monospace mt-1">
                                        {job.carId?.registrationNumber || "-"}
                                    </span>
                                </div>
                            </div>
                            <div className="col-6 col-md-3">
                                <small className="text-secondary d-block">Current Stage</small>
                                <span className="badge bg-primary text-uppercase mt-1">
                                    {job.currentStage?.replaceAll("_", " ") || "CHECK IN"}
                                </span>
                            </div>
                            <div className="col-6 col-md-3">
                                <small className="text-secondary d-block">Progress ({job.progressPercent || 0}%)</small>
                                <div className="progress mt-1" style={{ height: "14px", borderRadius: "7px", backgroundColor: "#1e1e1e" }}>
                                    <div
                                        className="progress-bar bg-success"
                                        role="progressbar"
                                        style={{ width: `${job.progressPercent || 0}%` }}
                                        aria-valuenow={job.progressPercent || 0}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="timeline mx-auto">
                        {job.timeline?.length > 0 ? (
                            job.timeline
                                .slice()
                                .reverse()
                                .map((t, idx) => (
                                    <div
                                        key={idx}
                                        className={`timeline-item ${idx % 2 === 0 ? "left" : "right"}`}
                                    >
                                        <div className="timeline-content">
                                            <span className="year small d-block mb-1">
                                                <i className="bi bi-clock me-1"></i>
                                                {new Date(t.updatedAt).toLocaleString()}
                                            </span>

                                            <h5 className="text-info mb-2">
                                                {t.stage?.replaceAll("_", " ")}
                                            </h5>

                                            <p className="mb-0 text-light small">
                                                {t.note || <span className="text-secondary fst-italic">No note added</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="text-center text-secondary py-5">
                                <i className="bi bi-hourglass-split fs-2 d-block mb-2"></i>
                                No timeline updates found
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminJobCardTimeLine;