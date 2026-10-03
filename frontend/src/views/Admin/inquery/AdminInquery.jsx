import React, { useEffect, useState, useContext } from 'react';
import AdminLayout from '../AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext.jsx';

const AdminInquery = () => {
    const location = useLocation();
    const [inqueries, setInqueries] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingInquiry, setEditingInquiry] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({ status: "", adminNotes: "" });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { downloadCSV } = useContext(UserContext);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`inquery/admin/admin-inquery-data`);
            setInqueries(res.data.data || []);
        } catch (error) {
            toast.error("Error fetching inquiry data");
            console.error("Fetch inquiry data error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const handler = () => fetchData();
        window.addEventListener("inquieryClick", handler);
        return () => window.removeEventListener("inquieryClick", handler);
    }, []);

    useEffect(() => {
        if (location.state?.openTab) {
            setFilter(location.state.openTab);
        }
    }, [location.state]);

    const pendingCount = inqueries.filter(item => item.status === "PENDING").length;
    const completedCount = inqueries.filter(item => item.status === "COMPLETED").length;
    const totalCount = inqueries.length;

    const filteredData = inqueries.filter((item) => {
        if (filter === "ALL") return true;
        return item.status === filter;
    }).filter((item) => {
        if (!search.trim()) return true;
        const text = search.toLowerCase();
        return (
            item.name?.toLowerCase().includes(text) ||
            item.phone?.toLowerCase().includes(text) ||
            item.status?.toLowerCase().includes(text) ||
            (Array.isArray(item.services) &&
                item.services.join(" ").toLowerCase().includes(text))
        );
    });

    const viewInquiry = async (id) => {
        try {
            const res = await axios.post(`inquery/admin/inquiry-details`, { id });
            if (res.data.success) {
                setSelectedInquiry(res.data.data);
                setShowModal(true);
            } else {
                toast.error("Inquiry not found");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error("View inquiry error", error);
        }
    };

    const editInquiry = (inquiry) => {
        setEditingInquiry(inquiry);
        setEditFormData({
            status: inquiry.status || "PENDING",
            adminNotes: inquiry.adminNotes || ""
        });
        setShowEditModal(true);
    };

    const updateInquiry = async () => {
        try {
            if (!editingInquiry?._id) {
                toast.error("Inquiry ID not found");
                return;
            }
            setUpdating(true);
            const res = await axios.post("inquery/admin/update-inquiry", {
                id: editingInquiry._id,
                status: editFormData.status,
                adminNotes: editFormData.adminNotes
            });

            if (res.data.success) {
                toast.success(res.data.message || "Inquiry updated successfully");
                setShowEditModal(false);
                fetchData();
            } else {
                toast.error(res.data.message || "Update failed");
            }
        } catch (error) {
            toast.error("Error updating inquiry");
            console.error("Update inquiry error", error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">

                {/* Filter Pills Bar */}
                <div className="bg-dark rounded p-3 mb-3 shadow-sm border border-secondary border-opacity-25">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <ul className="nav nav-pills flex-nowrap overflow-x-auto pb-1 pb-sm-0" style={{ WebkitOverflowScrolling: "touch" }}>
                            <li className="nav-item me-2">
                                <button
                                    className={`nav-link text-nowrap d-flex align-items-center gap-2 ${filter === "PENDING" ? "active bg-danger text-white" : "text-danger"}`}
                                    onClick={() => setFilter("PENDING")}
                                >
                                    <i className="bi bi-clock-history"></i>
                                    <span>PENDING</span>
                                    <span className={`badge ${filter === "PENDING" ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                                        {pendingCount}
                                    </span>
                                </button>
                            </li>
                            <li className="nav-item me-2">
                                <button
                                    className={`nav-link text-nowrap d-flex align-items-center gap-2 ${filter === "COMPLETED" ? "active bg-danger text-white" : "text-danger"}`}
                                    onClick={() => setFilter("COMPLETED")}
                                >
                                    <i className="bi bi-check2-all"></i>
                                    <span>COMPLETED</span>
                                    <span className={`badge ${filter === "COMPLETED" ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                                        {completedCount}
                                    </span>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link text-nowrap d-flex align-items-center gap-2 ${filter === "ALL" ? "active bg-danger text-white" : "text-danger"}`}
                                    onClick={() => setFilter("ALL")}
                                >
                                    <i className="bi bi-list-stars"></i>
                                    <span>ALL</span>
                                    <span className={`badge ${filter === "ALL" ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                                        {totalCount}
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Inquiry Card */}
                <div className="bg-dark rounded p-3 p-md-4 shadow-sm border border-secondary border-opacity-25">

                    {/* Responsive Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4 pb-2 border-bottom border-secondary">
                        <div>
                            <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                                <i className="bi bi-clipboard-check-fill text-danger"></i>
                                <span>Customer Inquiry</span>
                            </h4>
                            <span className="badge bg-secondary text-white">
                                Showing: {filteredData.length} {filteredData.length === 1 ? 'Inquiry' : 'Inquiries'}
                            </span>
                        </div>

                        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
                            <button
                                className="btn btn-outline-success text-nowrap d-flex align-items-center justify-content-center gap-2"
                                onClick={() => downloadCSV("/inquery/admin/inquiry-export", `${filter.toLowerCase()}-inquiry`, { filter })}
                                title="Export current list as CSV"
                            >
                                <i className="fa fa-download"></i>
                                <span>Export CSV</span>
                            </button>

                            <div className="input-group" style={{ minWidth: "220px" }}>
                                <span className="input-group-text bg-dark text-secondary border-secondary">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-secondary"
                                    name="text"
                                    placeholder="Search name, phone, service..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Touch Scroll Table */}
                    <div className="table-responsive" style={{ maxHeight: "65vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
                        <table className="table table-dark table-hover table-bordered align-middle mb-0" style={{ minWidth: "750px" }}>
                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th style={{ width: "50px" }}>#</th>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>Services Requested</th>
                                    <th>Status</th>
                                    <th className="text-center" style={{ width: "110px" }}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-white py-4">
                                            <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                                            Loading inquiries...
                                        </td>
                                    </tr>
                                ) : filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item._id || index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="fw-semibold text-white">{item.name || "N/A"}</div>
                                                {item.createdAt && (
                                                    <small className="text-secondary d-flex align-items-center gap-1 mt-1">
                                                        <i className="bi bi-clock"></i>
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                {item.phone ? (
                                                    <a href={`tel:${item.phone}`} className="text-info text-decoration-none d-flex align-items-center gap-1 font-monospace">
                                                        <i className="bi bi-telephone text-secondary"></i>
                                                        {item.phone}
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                {Array.isArray(item.services) && item.services.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {item.services.map((svc, sIdx) => (
                                                            <span key={sIdx} className="badge bg-secondary font-monospace" style={{ fontSize: "11px" }}>
                                                                {svc}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-secondary small fst-italic">General Inquiry</span>
                                                )}
                                            </td>
                                            <td>
                                                {item.status === "PENDING" && (
                                                    <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
                                                        <i className="bi bi-clock"></i> Pending
                                                    </span>
                                                )}
                                                {item.status === "COMPLETED" && (
                                                    <span className="badge bg-success d-inline-flex align-items-center gap-1">
                                                        <i className="bi bi-check-circle"></i> Completed
                                                    </span>
                                                )}
                                                {item.status !== "PENDING" && item.status !== "COMPLETED" && (
                                                    <span className="badge bg-secondary">{item.status || "Unknown"}</span>
                                                )}
                                            </td>
                                            <td className="text-center text-nowrap">
                                                <div className="d-flex justify-content-center gap-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-info p-1 px-2"
                                                        title="View Inquiry Details"
                                                        onClick={() => viewInquiry(item._id)}
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-warning p-1 px-2"
                                                        title="Edit Status / Notes"
                                                        onClick={() => editInquiry(item)}
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-secondary py-5">
                                            <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
                                            No inquiries found matching criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Inquiry Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.7)" }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                        <div className="modal-content bg-dark text-white border-secondary">

                            {/* Modal Header */}
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-circle-info text-info"></i>
                                    <span>Inquiry Details</span>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body p-3 p-md-4">
                                <div className="row g-3">
                                    {/* Customer Card */}
                                    <div className="col-12 col-md-6">
                                        <div className="bg-black bg-opacity-25 rounded p-3 border border-secondary h-100">
                                            <h6 className="text-warning border-bottom border-secondary pb-2 mb-3">
                                                <i className="bi bi-person me-2"></i>Customer Info
                                            </h6>
                                            <p className="mb-2"><strong>Name:</strong> {selectedInquiry?.name || "N/A"}</p>
                                            <p className="mb-2">
                                                <strong>Phone:</strong>{" "}
                                                {selectedInquiry?.phone ? (
                                                    <a href={`tel:${selectedInquiry?.phone}`} className="text-info font-monospace text-decoration-none">
                                                        {selectedInquiry?.phone}
                                                    </a>
                                                ) : "-"}
                                            </p>
                                            <p className="mb-0">
                                                <strong>Status:</strong>{" "}
                                                {selectedInquiry?.status === "PENDING" && (
                                                    <span className="badge bg-warning text-dark ms-1">Pending</span>
                                                )}
                                                {selectedInquiry?.status === "COMPLETED" && (
                                                    <span className="badge bg-success ms-1">Completed</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Services & Metadata Card */}
                                    <div className="col-12 col-md-6">
                                        <div className="bg-black bg-opacity-25 rounded p-3 border border-secondary h-100">
                                            <h6 className="text-warning border-bottom border-secondary pb-2 mb-3">
                                                <i className="bi bi-gear me-2"></i>Services & Timing
                                            </h6>
                                            <div className="mb-3">
                                                <strong>Requested Services:</strong>
                                                <div className="d-flex flex-wrap gap-1 mt-2">
                                                    {Array.isArray(selectedInquiry?.services) && selectedInquiry?.services.length > 0 ? (
                                                        selectedInquiry.services.map((s, idx) => (
                                                            <span key={idx} className="badge bg-info text-dark font-monospace">{s}</span>
                                                        ))
                                                    ) : (
                                                        <span className="text-secondary small fst-italic">No specific services selected</span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mb-0 small text-secondary">
                                                <strong>Created At:</strong>{" "}
                                                {selectedInquiry?.createdAt ? new Date(selectedInquiry?.createdAt).toLocaleString() : "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Customer Notes Card */}
                                    <div className="col-12">
                                        <div className="bg-black bg-opacity-25 rounded p-3 border border-secondary">
                                            <h6 className="text-warning border-bottom border-secondary pb-2 mb-2">
                                                <i className="bi bi-chat-left-text me-2"></i>Customer Message / Notes
                                            </h6>
                                            <div className="p-2 text-light rounded" style={{ backgroundColor: "#1c1c1c", minHeight: "60px" }}>
                                                {selectedInquiry?.notes || <span className="text-muted fst-italic">No message provided by customer</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Admin Notes Card */}
                                    <div className="col-12">
                                        <div className="bg-black bg-opacity-25 rounded p-3 border border-secondary">
                                            <h6 className="text-info border-bottom border-secondary pb-2 mb-2">
                                                <i className="bi bi-journal-text me-2"></i>Admin Follow-up Notes
                                            </h6>
                                            <div className="p-2 text-light rounded" style={{ backgroundColor: "#1c1c1c", minHeight: "60px" }}>
                                                {selectedInquiry?.adminNotes || <span className="text-muted fst-italic">No follow-up notes recorded yet</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer border-secondary d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                                    onClick={() => {
                                        setShowModal(false);
                                        editInquiry(selectedInquiry);
                                    }}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    <span>Update Status</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Edit Inquiry Modal */}
            {showEditModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.7)" }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                        <div className="modal-content bg-dark text-white border-secondary">

                            <div className="modal-header border-secondary">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-pen-to-square text-warning"></i>
                                    <span>Edit Inquiry - {editingInquiry?.name}</span>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowEditModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body p-3 p-md-4">

                                {/* Customer Info Display */}
                                <div className="bg-black bg-opacity-25 rounded p-3 mb-3 border border-secondary">
                                    <div className="row g-2">
                                        <div className="col-12 col-sm-6">
                                            <p className="mb-1"><strong>Name:</strong> {editingInquiry?.name || "N/A"}</p>
                                            <p className="mb-1">
                                                <strong>Phone:</strong>{" "}
                                                <a href={`tel:${editingInquiry?.phone}`} className="text-info font-monospace text-decoration-none">
                                                    {editingInquiry?.phone || "-"}
                                                </a>
                                            </p>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <strong className="d-block mb-1">Services:</strong>
                                            <div className="d-flex flex-wrap gap-1">
                                                {Array.isArray(editingInquiry?.services) && editingInquiry?.services.length > 0 ? (
                                                    editingInquiry.services.map((s, idx) => (
                                                        <span key={idx} className="badge bg-info text-dark font-monospace">{s}</span>
                                                    ))
                                                ) : (
                                                    <span className="text-muted small">None</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Notes Display */}
                                <div className="mb-3">
                                    <label className="form-label text-light fw-semibold small">Customer Message / Note</label>
                                    <div className="p-2 rounded border border-secondary text-secondary small bg-black bg-opacity-25">
                                        {editingInquiry?.notes || "No notes provided by customer"}
                                    </div>
                                </div>

                                {/* Status Field */}
                                <div className="mb-3">
                                    <label className="form-label text-warning fw-semibold">
                                        Inquiry Status <span className="text-danger">*</span>
                                    </label>
                                    <select 
                                        className="form-control text-white bg-dark border-secondary"
                                        value={editFormData.status}
                                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                    </select>
                                </div>

                                {/* Admin Follow-up Notes */}
                                <div className="mb-3">
                                    <label className="form-label text-warning fw-semibold">
                                        Admin Follow-up & Discussion Notes
                                    </label>
                                    <textarea 
                                        className="form-control text-white bg-dark border-secondary"
                                        rows="4"
                                        placeholder="Add notes about call discussion, pricing offered, vehicle schedule, or follow-up details..."
                                        value={editFormData.adminNotes}
                                        onChange={(e) => setEditFormData({ ...editFormData, adminNotes: e.target.value })}
                                    ></textarea>
                                    <small className="text-secondary d-block mt-1">
                                        <i className="fa-solid fa-circle-info me-1 text-info"></i>
                                        Keep track of conversations, follow-ups, and any specific requirements discussed with the customer.
                                    </small>
                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer border-secondary d-flex flex-column flex-sm-row gap-2 justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary px-4"
                                    onClick={() => setShowEditModal(false)}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning px-4 d-flex align-items-center justify-content-center gap-2"
                                    onClick={updateInquiry}
                                    disabled={updating}
                                >
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    <span>{updating ? "Saving..." : "Save Changes"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default AdminInquery;

