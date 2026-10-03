import React, { useEffect, useState } from 'react';
import AdminLayout from "../AdminLayout.jsx";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const AdminNewsLatters = () => {
    const location = useLocation();
    const [Subscription, setSubscription] = useState([]);
    const [filter, setFilter] = useState("SUBSCRIBE");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.post("subscribe/admin/subscribe");
            setSubscription(res.data?.data || []);
        } catch (error) {
            toast.error("Error fetching Subscription data");
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

    const subscribeCount = Subscription.filter((item) => item.status === "SUBSCRIBE").length;
    const unsubscribeCount = Subscription.filter((item) => item.status === "UNSUBSCRIBE").length;
    const totalCount = Subscription.length;

    const filteredData = Subscription.filter((item) => {
        if (filter === "ALL") return true;
        return item.status === filter;
    }).filter((item) => {
        if (!search.trim()) return true;
        const text = search.toLowerCase();
        return (
            item.email?.toLowerCase().includes(text) ||
            item.status?.toLowerCase().includes(text)
        );
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "N/A";
            return d.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return dateStr;
        }
    };

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success("Email copied to clipboard!");
    };

    const exportCSV = () => {
        if (!filteredData.length) {
            toast.error("No subscribers found to export");
            return;
        }

        const headers = ["#", "Email", "Status", "Date Subscribed"];
        const rows = filteredData.map((item, index) => [
            index + 1,
            `"${item.email || ""}"`,
            `"${item.status || ""}"`,
            `"${item.createdAt ? new Date(item.createdAt).toISOString() : ""}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `subscribers_${filter.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Subscribers list exported successfully!");
    };

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                {/* Top Filter Pills */}
                <div className="bg-dark rounded p-2 p-md-3 mb-3 border border-secondary border-opacity-25 shadow-sm">
                    <div className="overflow-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
                        <ul className="nav nav-pills flex-nowrap gap-2">
                            <li className="nav-item">
                                <button
                                    className={`nav-link text-nowrap d-flex align-items-center gap-2 ${filter === "SUBSCRIBE" ? "active bg-danger text-white" : "text-danger"}`}
                                    onClick={() => setFilter("SUBSCRIBE")}
                                >
                                    <i className="bi bi-bell-fill"></i>
                                    <span>SUBSCRIBED</span>
                                    <span className={`badge ${filter === "SUBSCRIBE" ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                                        {subscribeCount}
                                    </span>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link text-nowrap d-flex align-items-center gap-2 ${filter === "UNSUBSCRIBE" ? "active bg-danger text-white" : "text-danger"}`}
                                    onClick={() => setFilter("UNSUBSCRIBE")}
                                >
                                    <i className="bi bi-bell-slash-fill"></i>
                                    <span>UNSUBSCRIBED</span>
                                    <span className={`badge ${filter === "UNSUBSCRIBE" ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                                        {unsubscribeCount}
                                    </span>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link text-nowrap d-flex align-items-center gap-2 ${filter === "ALL" ? "active bg-danger text-white" : "text-danger"}`}
                                    onClick={() => setFilter("ALL")}
                                >
                                    <i className="bi bi-list-check"></i>
                                    <span>ALL</span>
                                    <span className={`badge ${filter === "ALL" ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                                        {totalCount}
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Quick Summary KPI Cards */}
                <div className="row g-2 g-md-3 mb-3">
                    <div className="col-12 col-sm-4">
                        <div className="bg-dark rounded p-3 border border-secondary border-opacity-25 shadow-sm d-flex align-items-center justify-content-between">
                            <div>
                                <small className="text-secondary text-uppercase fw-semibold">Active Subscribed</small>
                                <h4 className="text-success mb-0 fw-bold">{subscribeCount}</h4>
                            </div>
                            <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success fs-4">
                                <i className="bi bi-patch-check-fill"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="bg-dark rounded p-3 border border-secondary border-opacity-25 shadow-sm d-flex align-items-center justify-content-between">
                            <div>
                                <small className="text-secondary text-uppercase fw-semibold">Unsubscribed</small>
                                <h4 className="text-warning mb-0 fw-bold">{unsubscribeCount}</h4>
                            </div>
                            <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning fs-4">
                                <i className="bi bi-person-x-fill"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="bg-dark rounded p-3 border border-secondary border-opacity-25 shadow-sm d-flex align-items-center justify-content-between">
                            <div>
                                <small className="text-secondary text-uppercase fw-semibold">Total Audience</small>
                                <h4 className="text-white mb-0 fw-bold">{totalCount}</h4>
                            </div>
                            <div className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger fs-4">
                                <i className="bi bi-envelope-paper-heart-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Subscribers Card */}
                <div className="bg-dark rounded p-3 p-md-4 shadow-sm border border-secondary border-opacity-25">
                    {/* Header */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-3 pb-3 border-bottom border-secondary">
                        <div>
                            <h4 className="text-white mb-1 d-flex align-items-center gap-2 flex-wrap">
                                <i className="bi bi-envelope-arrow-up-fill text-danger"></i>
                                <span>Newsletter Subscribers</span>
                            </h4>
                            <span className="badge bg-secondary text-white">
                                Showing: {filteredData.length} {filteredData.length === 1 ? 'subscriber' : 'subscribers'}
                            </span>
                        </div>

                        {/* Actions: Export, Refresh, Search */}
                        <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
                            <button
                                className="btn btn-outline-success text-nowrap d-flex align-items-center justify-content-center gap-2"
                                onClick={exportCSV}
                                title="Export current list as CSV"
                            >
                                <i className="bi bi-download"></i>
                                <span>Export CSV</span>
                            </button>

                            <button
                                className="btn btn-outline-secondary text-white text-nowrap d-flex align-items-center justify-content-center gap-2"
                                onClick={fetchData}
                                disabled={loading}
                                title="Refresh data"
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                                <span className="d-none d-sm-inline">Refresh</span>
                            </button>

                            <div className="input-group" style={{ minWidth: "220px" }}>
                                <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-secondary">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-secondary"
                                    placeholder="Search email..."
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
                        </div>
                    </div>

                    {/* Table View with responsive wrapper */}
                    <div
                        className="table-responsive rounded border border-secondary border-opacity-25"
                        style={{ maxHeight: "60vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
                    >
                        <table className="table table-dark table-hover table-bordered align-middle mb-0" style={{ minWidth: "550px" }}>
                            <thead className="table-secondary text-dark sticky-top">
                                <tr>
                                    <th style={{ width: "60px" }} className="text-center">#</th>
                                    <th>Email Address</th>
                                    <th style={{ width: "220px" }}>Date Subscribed</th>
                                    <th style={{ width: "150px" }} className="text-center">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-secondary">
                                            <div className="spinner-border text-danger spinner-border-sm me-2" role="status"></div>
                                            <span>Loading subscribers...</span>
                                        </td>
                                    </tr>
                                ) : filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item._id || index}>
                                            <td className="text-center text-secondary fw-semibold">
                                                {index + 1}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="p-2 rounded-circle bg-secondary bg-opacity-25 text-danger d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                                                            <i className="bi bi-envelope-fill"></i>
                                                        </div>
                                                        <a
                                                            href={`mailto:${item.email}`}
                                                            className="text-info text-decoration-none fw-medium text-break"
                                                        >
                                                            {item.email}
                                                        </a>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary border-0 text-white-50 ms-2 p-1"
                                                        title="Copy email to clipboard"
                                                        onClick={() => copyToClipboard(item.email)}
                                                    >
                                                        <i className="bi bi-clipboard"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-nowrap text-secondary">
                                                <i className="bi bi-calendar3 me-2 text-secondary opacity-75"></i>
                                                {formatDate(item.createdAt)}
                                            </td>
                                            <td className="text-center">
                                                {item.status === "SUBSCRIBE" ? (
                                                    <span className="badge bg-success bg-opacity-75 px-3 py-2 text-white">
                                                        <i className="bi bi-check-circle-fill me-1"></i> Subscribed
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-warning bg-opacity-75 px-3 py-2 text-dark">
                                                        <i className="bi bi-x-circle-fill me-1"></i> Unsubscribed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5">
                                            <div className="text-secondary opacity-75 mb-2">
                                                <i className="bi bi-envelope-slash fs-1"></i>
                                            </div>
                                            <p className="text-white-50 mb-0">
                                                {search
                                                    ? `No subscribers found matching "${search}"`
                                                    : `No subscribers found in ${filter.toLowerCase()} category`}
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

export default AdminNewsLatters;

