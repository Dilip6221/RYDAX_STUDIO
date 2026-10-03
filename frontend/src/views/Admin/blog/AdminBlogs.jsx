import React, { useEffect, useState } from 'react';
import AdminLayout from "../AdminLayout.jsx";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const AdminBlogs = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`blog/admin/blogs`);
            setBlogs(res.data.data || []);
        } catch (error) {
            toast.error("Error fetching blog data");
            console.error("Fetch blog data error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const handler = () => fetchData();
        window.addEventListener("ourBlogClick", handler);
        return () => window.removeEventListener("ourBlogClick", handler);
    }, []);

    /* On change status */
    const handleStatusChange = async (blogId, newStatus) => {
        try {
            const res = await axios.post(`blog/admin/update-status`, { id: blogId, newStatus });
            if (res.data.success) {
                toast.success(res.data.message || "Status updated");
                fetchData();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Failed to update status");
            console.error("Update blog status error", err);
        }
    };

    // Filter blogs based on search input
    const filteredBlogs = (blogs || []).filter(item => {
        if (!search.trim()) return true;
        const text = search.toLowerCase();
        return (
            item.title?.toLowerCase().includes(text) ||
            item.slug?.toLowerCase().includes(text) ||
            item.category?.toLowerCase().includes(text) ||
            item.status?.toLowerCase().includes(text) ||
            (Array.isArray(item.tags) && item.tags.join(" ").toLowerCase().includes(text))
        );
    });

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                <div className="bg-dark rounded p-3 p-md-4 shadow-sm border border-secondary border-opacity-25">

                    {/* Responsive Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4 pb-2 border-bottom border-secondary">
                        <div>
                            <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                                <i className="bi bi-journal-text text-danger"></i>
                                <span>Our Blogs</span>
                            </h4>
                            <span className="badge bg-secondary text-white">
                                Total: {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Blog' : 'Blogs'}
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
                                    name="text"
                                    placeholder="Search title, category, tag..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Link to="/admin/blogs/create" className="btn btn-outline-danger text-nowrap d-flex align-items-center justify-content-center gap-2">
                                <i className="bi bi-plus-circle"></i>
                                <span>Create Blog</span>
                            </Link>
                        </div>
                    </div>

                    {/* Touch Scroll Table */}
                    <div className="table-responsive" style={{ maxHeight: "65vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
                        <table className="table table-dark table-hover table-bordered align-middle mb-0" style={{ minWidth: "880px" }}>
                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th style={{ width: "50px" }}>#</th>
                                    <th>Blog Post</th>
                                    <th>Category</th>
                                    <th>Tags</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th className="text-center" style={{ width: "120px" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-white py-4">
                                            <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                                            Loading blogs...
                                        </td>
                                    </tr>
                                ) : filteredBlogs.length > 0 ? (
                                    filteredBlogs.map((item, index) => (
                                        <tr key={item._id || index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="fw-semibold text-white">{item.title || "Untitled"}</div>
                                                {item.slug && (
                                                    <small className="text-secondary font-monospace d-block mt-1">
                                                        /{item.slug}
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge bg-dark border border-secondary text-warning">
                                                    {item.category || "General"}
                                                </span>
                                            </td>
                                            <td>
                                                {Array.isArray(item.tags) && item.tags.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-1">
                                                        {item.tags.map((t, idx) => (
                                                            <span key={idx} className="badge bg-secondary font-monospace" style={{ fontSize: "11px" }}>
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted small">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="dropdown">
                                                    <button
                                                        className={`btn btn-sm dropdown-toggle d-inline-flex align-items-center gap-1 ${
                                                            item.status === "PUBLISHED" ? "btn-success" : item.status === "DRAFT" ? "btn-warning text-dark" : "btn-secondary"
                                                        }`}
                                                        type="button"
                                                        id={`statusDropdown${item._id}`}
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                        style={{ fontSize: "12px", minWidth: "95px" }}
                                                    >
                                                        {item.status || "DRAFT"}
                                                    </button>

                                                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby={`statusDropdown${item._id}`}>
                                                        {item.status !== "DRAFT" && (
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusChange(item._id, "DRAFT")}
                                                                >
                                                                    DRAFT
                                                                </button>
                                                            </li>
                                                        )}
                                                        {item.status !== "PUBLISHED" && (
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusChange(item._id, "PUBLISHED")}
                                                                >
                                                                    PUBLISHED
                                                                </button>
                                                            </li>
                                                        )}
                                                        {item.status !== "ARCHIVED" && (
                                                            <li>
                                                                <button
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusChange(item._id, "ARCHIVED")}
                                                                >
                                                                    ARCHIVED
                                                                </button>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </td>
                                            <td className="text-nowrap">
                                                <small className="text-light">
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                                                </small>
                                            </td>
                                            <td className="text-center text-nowrap">
                                                <div className="d-flex justify-content-center gap-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-warning p-1 px-2"
                                                        title="Edit Blog"
                                                        onClick={() => navigate(`/admin/blogs/edit/${item._id}`)}
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    {item.slug && (
                                                        <Link
                                                            to={`/blog/${item.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-info p-1 px-2"
                                                            title="View Public Post"
                                                        >
                                                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-secondary py-5">
                                            <i className="bi bi-journal-x fs-2 d-block mb-2 text-secondary"></i>
                                            No Blogs Found
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

export default AdminBlogs;
