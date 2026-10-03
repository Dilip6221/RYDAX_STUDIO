import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminAboutTimeLine = () => {
    const navigate = useNavigate();
    const [timeline, setTimeline] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get("about-timeline/about-timeline");
            setTimeline(res.data?.data || []);
        } catch (error) {
            toast.error("Error fetching timeline data");
            console.error("Fetch timeline data error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = (timeline || []).filter((item) => {
        if (!search.trim()) return true;
        const text = search.toLowerCase();
        return (
            item.year?.toString().toLowerCase().includes(text) ||
            item.title?.toLowerCase().includes(text) ||
            item.description?.toLowerCase().includes(text)
        );
    });

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this timeline milestone?")) return;
        try {
            const res = await axios.delete(`about-timeline/admin/delete-about-timeline/${id}`);
            if (res.data.success) {
                toast.success(res.data.message || "Timeline milestone deleted");
                fetchData();
            } else {
                toast.error(res.data.message || "Delete failed");
            }
        } catch (error) {
            console.error("Delete timeline error", error);
            toast.error("Delete failed");
        }
    };

    const handleDeleteImage = async (timelineId, public_id) => {
        if (!window.confirm("Delete this image?")) return;

        try {
            const res = await axios.post(`about-timeline/admin/delete-timeline-image`, { timelineId, public_id });
            if (res.data.success) {
                toast.success("Image deleted successfully");
                fetchData();
            } else {
                toast.error(res.data.message || "Failed to delete image");
            }
        } catch (error) {
            console.error("Delete timeline image error", error);
            toast.error("Image delete failed");
        }
    };

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                <div className="bg-dark rounded p-3 p-md-4 shadow-sm border border-secondary border-opacity-25">
                    {/* Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-3 pb-3 border-bottom border-secondary">
                        <div>
                            <h4 className="text-white mb-1 d-flex align-items-center gap-2 flex-wrap">
                                <i className="bi bi-clock-history text-danger"></i>
                                <span>Timeline Management</span>
                            </h4>
                            <span className="badge bg-secondary text-white">
                                Showing: {filteredData.length} {filteredData.length === 1 ? 'Milestone' : 'Milestones'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
                            <button
                                className="btn btn-outline-secondary text-white text-nowrap d-flex align-items-center justify-content-center gap-2"
                                onClick={fetchData}
                                disabled={loading}
                                title="Refresh Timeline"
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                                <span className="d-none d-sm-inline">Refresh</span>
                            </button>

                            {/* Search */}
                            <div className="input-group" style={{ minWidth: "200px" }}>
                                <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-secondary"
                                    placeholder="Search timeline..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        className="btn btn-outline-secondary border-secondary text-white"
                                        type="button"
                                        onClick={() => setSearch("")}
                                        title="Clear search"
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>

                            {/* Create */}
                            <Link to="/admin/about-timeline/create" className="text-decoration-none">
                                <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 px-3 text-nowrap">
                                    <i className="bi bi-plus-circle"></i>
                                    <span>Create Milestone</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Table View */}
                    <div
                        className="table-responsive rounded border border-secondary border-opacity-25"
                        style={{ maxHeight: "65vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
                    >
                        <table className="table table-dark table-hover table-bordered align-middle mb-0" style={{ minWidth: "800px" }}>
                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th style={{ width: "50px" }} className="text-center">#</th>
                                    <th style={{ width: "100px" }} className="text-center">Year</th>
                                    <th style={{ width: "180px" }}>Milestone Title</th>
                                    <th>Description</th>
                                    <th style={{ width: "160px" }}>Images</th>
                                    <th style={{ width: "70px" }} className="text-center">Order</th>
                                    <th style={{ width: "120px" }} className="text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-secondary">
                                            <div className="spinner-border text-danger spinner-border-sm me-2" role="status"></div>
                                            <span>Loading timeline milestones...</span>
                                        </td>
                                    </tr>
                                ) : filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item._id}>
                                            <td className="text-center text-secondary fw-semibold">{index + 1}</td>
                                            <td className="text-center">
                                                <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25 px-2 py-1 fs-6">
                                                    {item.year}
                                                </span>
                                            </td>
                                            <td className="fw-semibold text-white">
                                                <i className="bi bi-flag-fill text-danger me-2"></i>
                                                {item.title}
                                            </td>

                                            <td style={{ maxWidth: "250px" }}>
                                                <span className="text-secondary text-break" title={item.description}>
                                                    {item.description && item.description.length > 80
                                                        ? `${item.description.slice(0, 80)}...`
                                                        : item.description || "No description"}
                                                </span>
                                            </td>

                                            <td>
                                                {item.images && item.images.length > 0 ? (
                                                    <div className="d-flex gap-2 flex-wrap align-items-center">
                                                        {item.images.map((img, i) => (
                                                            <div key={i} style={{ position: "relative" }} className="d-inline-block">
                                                                <img
                                                                    src={img.url}
                                                                    alt=""
                                                                    width="45"
                                                                    height="45"
                                                                    style={{ objectFit: "cover" }}
                                                                    className="rounded border border-secondary"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteImage(item._id, img.public_id)}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: "-5px",
                                                                        right: "-5px",
                                                                        background: "#dc3545",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius: "50%",
                                                                        width: "18px",
                                                                        height: "18px",
                                                                        fontSize: "11px",
                                                                        lineHeight: "1",
                                                                        padding: 0,
                                                                        cursor: "pointer"
                                                                    }}
                                                                    title="Delete image"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted small">No images</span>
                                                )}
                                            </td>

                                            <td className="text-center">
                                                <span className="badge bg-secondary">{item.order}</span>
                                            </td>

                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-warning d-flex align-items-center justify-content-center"
                                                        title="Edit Milestone"
                                                        onClick={() => navigate(`/admin/about-timeline/edit/${item._id}`)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                                                        title="Delete Milestone"
                                                        onClick={() => handleDelete(item._id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            <div className="text-secondary opacity-75 mb-2">
                                                <i className="bi bi-clock-history fs-1"></i>
                                            </div>
                                            <p className="text-white-50 mb-0">
                                                {search ? `No timeline milestones found matching "${search}"` : "No timeline milestones found."}
                                            </p>
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

export default AdminAboutTimeLine;