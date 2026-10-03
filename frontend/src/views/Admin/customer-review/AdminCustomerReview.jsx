import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCustomerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`customer-reviews/admin/all`);
      if (res.data.success) {
        setReviews(res.data.data || []);
      }
    } catch (error) {
      toast.error("Error fetching Customer reviews");
      console.error("Fetch customer reviews error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (id) => {
    try {
      setApprovingId(id);
      const res = await axios.put(`customer-reviews/admin/approve/${id}`);
      if (res.data.success) {
        toast.success(res.data.message || "Review approved successfully");
        fetchReviews();
      } else {
        toast.error(res.data.message || "Approval failed");
      }
    } catch (error) {
      toast.error("Error approving review");
      console.error("Approve review error", error);
    } finally {
      setApprovingId(null);
    }
  };

  const pendingCount = reviews.filter((item) => item.isApproved === false).length;
  const approvedCount = reviews.filter((item) => item.isApproved === true).length;
  const totalCount = reviews.length;
  const avgRating = totalCount
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / totalCount).toFixed(1)
    : "0.0";

  const filteredData = reviews
    .filter((item) => {
      if (filter === "ALL") return true;
      if (filter === "PENDING") return item.isApproved === false;
      if (filter === "APPROVED") return item.isApproved === true;
      return true;
    })
    .filter((item) => {
      if (!search.trim()) return true;
      const text = search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(text) ||
        item.review?.toLowerCase().includes(text) ||
        item.rating?.toString().includes(text)
      );
    });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-0 p-sm-2">
        {/* Filter Pills */}
        <div className="bg-dark rounded p-2 p-md-3 mb-3 border border-secondary border-opacity-25 shadow-sm">
          <div className="overflow-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
            <ul className="nav nav-pills flex-nowrap gap-2">
              <li className="nav-item">
                <button
                  className={`nav-link text-nowrap d-flex align-items-center gap-2 ${
                    filter === "PENDING" ? "active bg-danger text-white" : "text-danger"
                  }`}
                  onClick={() => setFilter("PENDING")}
                >
                  <i className="bi bi-hourglass-split"></i>
                  <span>PENDING</span>
                  <span
                    className={`badge ${
                      filter === "PENDING" ? "bg-white text-dark" : "bg-secondary text-white"
                    }`}
                  >
                    {pendingCount}
                  </span>
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link text-nowrap d-flex align-items-center gap-2 ${
                    filter === "APPROVED" ? "active bg-danger text-white" : "text-danger"
                  }`}
                  onClick={() => setFilter("APPROVED")}
                >
                  <i className="bi bi-check2-circle"></i>
                  <span>APPROVED</span>
                  <span
                    className={`badge ${
                      filter === "APPROVED" ? "bg-white text-dark" : "bg-secondary text-white"
                    }`}
                  >
                    {approvedCount}
                  </span>
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link text-nowrap d-flex align-items-center gap-2 ${
                    filter === "ALL" ? "active bg-danger text-white" : "text-danger"
                  }`}
                  onClick={() => setFilter("ALL")}
                >
                  <i className="bi bi-list-stars"></i>
                  <span>ALL REVIEWS</span>
                  <span
                    className={`badge ${
                      filter === "ALL" ? "bg-white text-dark" : "bg-secondary text-white"
                    }`}
                  >
                    {totalCount}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quick KPI Summary Cards */}
        <div className="row g-2 g-md-3 mb-3">
          <div className="col-12 col-sm-4">
            <div className="bg-dark rounded p-3 border border-secondary border-opacity-25 shadow-sm d-flex align-items-center justify-content-between">
              <div>
                <small className="text-secondary text-uppercase fw-semibold">Pending Approval</small>
                <h4 className="text-warning mb-0 fw-bold">{pendingCount}</h4>
              </div>
              <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning fs-4">
                <i className="bi bi-clock-history"></i>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="bg-dark rounded p-3 border border-secondary border-opacity-25 shadow-sm d-flex align-items-center justify-content-between">
              <div>
                <small className="text-secondary text-uppercase fw-semibold">Approved Reviews</small>
                <h4 className="text-success mb-0 fw-bold">{approvedCount}</h4>
              </div>
              <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success fs-4">
                <i className="bi bi-patch-check-fill"></i>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-4">
            <div className="bg-dark rounded p-3 border border-secondary border-opacity-25 shadow-sm d-flex align-items-center justify-content-between">
              <div>
                <small className="text-secondary text-uppercase fw-semibold">Avg. Rating ({totalCount})</small>
                <h4 className="text-white mb-0 fw-bold">
                  {avgRating} <span className="text-warning fs-6">★</span>
                </h4>
              </div>
              <div className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger fs-4">
                <i className="bi bi-chat-heart-fill"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Reviews Card */}
        <div className="bg-dark rounded p-3 p-md-4 shadow-sm border border-secondary border-opacity-25">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-3 pb-3 border-bottom border-secondary">
            <div>
              <h4 className="text-white mb-1 d-flex align-items-center gap-2 flex-wrap">
                <i className="bi bi-chat-dots-fill text-danger"></i>
                <span>Customer Reviews</span>
              </h4>
              <span className="badge bg-secondary text-white">
                Showing: {filteredData.length} {filteredData.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            {/* Actions: Refresh & Search */}
            <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
              <button
                className="btn btn-outline-secondary text-white text-nowrap d-flex align-items-center justify-content-center gap-2"
                onClick={fetchReviews}
                disabled={loading}
                title="Refresh reviews"
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
                  placeholder="Search reviews..."
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

          {/* Responsive Table */}
          <div
            className="table-responsive rounded border border-secondary border-opacity-25"
            style={{ maxHeight: "65vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
          >
            <table className="table table-dark table-hover table-bordered align-middle mb-0" style={{ minWidth: "750px" }}>
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th style={{ width: "50px" }} className="text-center">#</th>
                  <th style={{ width: "180px" }}>Customer Name</th>
                  <th style={{ width: "130px" }}>Rating</th>
                  <th>Customer Feedback</th>
                  <th style={{ width: "120px" }} className="text-center">Status</th>
                  <th style={{ width: "130px" }}>Date</th>
                  <th style={{ width: "130px" }} className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-secondary">
                      <div className="spinner-border text-danger spinner-border-sm me-2" role="status"></div>
                      <span>Loading reviews...</span>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item._id}>
                      <td className="text-center text-secondary fw-semibold">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-secondary bg-opacity-25 text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: "32px", height: "32px", fontSize: "12px" }}
                          >
                            {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <span className="fw-semibold text-white">{item.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center text-warning" title={`${item.rating || 0} / 5 Stars`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className={`bi ${
                                i < (item.rating || 0) ? "bi-star-fill" : "bi-star text-secondary opacity-25"
                              } me-1`}
                            ></i>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="text-secondary text-break" style={{ maxWidth: "320px" }}>
                          <i className="bi bi-quote text-danger opacity-50 me-1"></i>
                          {item.review}
                        </div>
                      </td>
                      <td className="text-center">
                        {item.isApproved ? (
                          <span className="badge bg-success bg-opacity-75 px-3 py-2 text-white">
                            <i className="bi bi-check-circle-fill me-1"></i> Approved
                          </span>
                        ) : (
                          <span className="badge bg-warning bg-opacity-75 px-3 py-2 text-dark">
                            <i className="bi bi-clock-history me-1"></i> Pending
                          </span>
                        )}
                      </td>
                      <td className="text-nowrap text-secondary">
                        <i className="bi bi-calendar3 me-2 text-secondary opacity-75"></i>
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="text-center">
                        {!item.isApproved ? (
                          <button
                            className="btn btn-success btn-sm d-inline-flex align-items-center gap-1 px-3 py-1"
                            onClick={() => approveReview(item._id)}
                            disabled={approvingId === item._id}
                            title="Approve and Publish Review"
                          >
                            {approvingId === item._id ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <i className="bi bi-check-lg"></i>
                            )}
                            <span>Approve</span>
                          </button>
                        ) : (
                          <span className="badge bg-secondary bg-opacity-50 text-white-50 px-2 py-1">
                            <i className="bi bi-check2-all me-1"></i>Published
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="text-secondary opacity-75 mb-2">
                        <i className="bi bi-chat-square-text fs-1"></i>
                      </div>
                      <p className="text-white-50 mb-0">
                        {search
                          ? `No reviews found matching "${search}"`
                          : `No reviews found in ${filter.toLowerCase()} category.`}
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

export default AdminCustomerReview;