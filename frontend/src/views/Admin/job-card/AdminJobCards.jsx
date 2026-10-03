import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminJobCards = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await axios.get("jobcard/admin/get-job-cards");
            setJobs(res.data.data || []);
        } catch (error) {
            toast.error("Error fetching Job Cards");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredData = jobs.filter((job) =>
        job.jobCode?.toLowerCase().includes(search.toLowerCase()) ||
        job.carId?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
        job.carId?.brand?.toLowerCase().includes(search.toLowerCase()) ||
        job.carId?.model?.toLowerCase().includes(search.toLowerCase()) ||
        job.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        job.userId?.phone?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case "DELIVERED":
                return <span className="badge bg-success">{status}</span>;
            case "READY":
                return <span className="badge bg-info text-dark">{status}</span>;
            case "QUALITY_CHECK":
                return <span className="badge bg-warning text-dark">{status}</span>;
            case "PART_REPLACED":
            case "WORK_STARTED":
            case "IN_PROGRESS":
                return <span className="badge bg-primary">{status?.replaceAll("_", " ")}</span>;
            case "INSPECTION":
                return <span className="badge bg-info">{status}</span>;
            case "CHECK_IN":
                return <span className="badge bg-secondary">{status?.replaceAll("_", " ")}</span>;
            default:
                return <span className="badge bg-warning text-dark">{status || "PENDING"}</span>;
        }
    };

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                <div className="bg-dark rounded p-3 p-md-4 shadow-sm">

                    {/* Responsive Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4 pb-2 border-bottom border-secondary">
                        <div>
                            <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                                <i className="bi bi-card-checklist text-danger"></i>
                                <span>Job Cards Management</span>
                            </h4>
                            <span className="badge bg-secondary text-white">
                                Total: {filteredData.length} {filteredData.length === 1 ? 'Job' : 'Jobs'}
                            </span>
                        </div>

                        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
                            <div className="input-group" style={{ minWidth: "220px" }}>
                                <span className="input-group-text bg-dark text-secondary border-secondary">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-secondary"
                                    placeholder="Search code, car, user..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Link to="/admin/job-cards/create" className="btn btn-outline-danger text-nowrap d-flex align-items-center justify-content-center gap-2">
                                <i className="bi bi-plus-circle"></i>
                                <span>Create Job Card</span>
                            </Link>
                        </div>
                    </div>

                    {/* Responsive Table Wrapper */}
                    <div className="table-responsive" style={{ maxHeight: "65vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
                        <table className="table table-dark table-hover table-bordered align-middle mb-0" style={{ minWidth: "850px" }}>
                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th style={{ width: "50px" }}>#</th>
                                    <th>Job Code</th>
                                    <th>Customer</th>
                                    <th>Car</th>
                                    <th>Reg No</th>
                                    <th>Status</th>
                                    <th>Check-In</th>
                                    <th className="text-center" style={{ width: "110px" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center text-white py-4">
                                            <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                                            Loading Job Cards...
                                        </td>
                                    </tr>
                                ) : filteredData.length > 0 ? (
                                    filteredData.map((job, index) => (
                                        <tr key={job._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-info text-nowrap fw-semibold d-inline-flex align-items-center gap-1"
                                                    onClick={() => navigate(`/admin/job-cards/${job._id}/timeline`)}
                                                    title="View Timeline"
                                                >
                                                    {job.jobCode}
                                                    <i className="bi bi-arrow-right-circle"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-white">{job.userId?.name || "N/A"}</div>
                                                {job.userId?.phone && (
                                                    <small className="text-info d-flex align-items-center gap-1 mt-1">
                                                        <i className="bi bi-telephone text-secondary"></i>
                                                        {job.userId?.phone}
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                <span className="text-white">
                                                    {job.carId?.brand} {job.carId?.model}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary font-monospace px-2 py-1">
                                                    {job.carId?.registrationNumber || "-"}
                                                </span>
                                            </td>
                                            <td>
                                                {getStatusBadge(job.status)}
                                            </td>
                                            <td className="text-nowrap">
                                                <small className="text-light">
                                                    {job.checkInTime
                                                        ? new Date(job.checkInTime).toLocaleDateString()
                                                        : "-"}
                                                </small>
                                            </td>
                                            <td className="text-center text-nowrap">
                                                <div className="d-flex justify-content-center gap-1">
                                                    {job.status !== "DELIVERED" && (
                                                        <Link
                                                            to={`/admin/job-cards/update/${job._id}`}
                                                            className="btn btn-sm btn-outline-warning p-1 px-2"
                                                            title="Edit Job Progress"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Link>
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary p-1 px-2"
                                                        onClick={() => navigate(`/admin/job-cards/${job._id}/timeline`)}
                                                        title="View Timeline & Details"
                                                    >
                                                        <i className="bi bi-clock-history"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-white py-4">
                                            <i className="bi bi-folder-x fs-4 d-block mb-1 text-secondary"></i>
                                            No Job Cards Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminJobCards;
