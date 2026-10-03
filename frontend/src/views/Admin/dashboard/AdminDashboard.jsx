import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from '../AdminLayout.jsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserContext } from "../../../context/UserContext.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext) || {};
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from backend
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`user/admin/dashboard-stats`);
      setStats(res.data?.data || {});
    } catch (e) {
      toast.error("Dashboard fetch error");
      console.error("Fetch dashboard stats error", e);
    } finally {
      setLoading(false);
    }
  };

  const SmallLoader = () => (
    <div className="spinner-border text-danger spinner-border-sm" role="status"></div>
  );

  useEffect(() => {
    fetchStats();
    const handler = () => fetchStats();
    window.addEventListener("dashboardClick", handler);
    return () => window.removeEventListener("dashboardClick", handler);
  }, []);

  const StatCard = ({ title, value, icon, iconColor, bgColor, badgeText, badgeColor, onClick }) => (
    <div
      className="card bg-dark border border-secondary border-opacity-25 rounded-3 shadow-sm h-100 admin-stat-card text-decoration-none"
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={`Click to view ${title}`}
    >
      <div className="card-body p-3 p-md-4 d-flex flex-column justify-content-between">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: bgColor || "rgba(220, 53, 69, 0.12)",
              color: iconColor || "#dc3545",
              fontSize: "1.4rem"
            }}
          >
            {icon}
          </div>
          {badgeText && (
            <span className={`badge ${badgeColor || 'bg-danger'} rounded-pill`} style={{ fontSize: "11px" }}>
              {badgeText}
            </span>
          )}
        </div>

        <div>
          <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">
            {title}
          </span>
          <div className="d-flex align-items-baseline justify-content-between">
            <h3 className="text-white fw-bold mb-0">
              {loading ? <SmallLoader /> : (value ?? 0)}
            </h3>
            <span className="text-danger small d-flex align-items-center gap-1 hover-underline">
              View <i className="bi bi-arrow-right small"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="container-fluid p-0 p-sm-2">
        {/* Hero Welcome Banner */}
        <div className="bg-dark rounded-3 p-3 p-md-4 mb-3 mb-md-4 shadow-sm border border-secondary border-opacity-25">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <h4 className="text-white mb-0 fw-bold">
                  Welcome back, {user?.name || "Admin"} 👋
                </h4>
                <span className="badge bg-danger rounded-pill px-2 py-1">Garage Operations Hub</span>
              </div>
              <p className="text-secondary mb-0 small">
                Monitor live customer inquiries, fleet inventory, team operations, and customer feedback.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2 w-100 w-md-auto justify-content-between justify-content-md-end">
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50 px-3 py-2">
                <i className="bi bi-calendar-event me-2 text-danger"></i>
                {new Date().toLocaleDateString("en-IN", { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <button
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 px-3 py-2"
                onClick={fetchStats}
                disabled={loading}
                title="Refresh stats"
              >
                <i className="bi bi-arrow-clockwise"></i>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Shortcuts Hub */}
        <div className="bg-dark rounded-3 p-2 p-md-3 mb-4 shadow-sm border border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-2 overflow-auto pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
            <span className="text-secondary small fw-semibold text-uppercase text-nowrap me-1">
              <i className="bi bi-lightning-charge-fill text-warning me-1"></i>Quick Actions:
            </span>
            <button
              className="btn btn-sm btn-danger text-nowrap d-flex align-items-center gap-1 px-3"
              onClick={() => navigate("/admin/job-cards/create")}
            >
              <i className="bi bi-plus-circle"></i> New Job Card
            </button>
            <button
              className="btn btn-sm btn-outline-light text-nowrap d-flex align-items-center gap-1 px-3"
              onClick={() => navigate("/admin/inquery")}
            >
              <i className="bi bi-chat-left-text"></i> Inquiries
            </button>
            <button
              className="btn btn-sm btn-outline-light text-nowrap d-flex align-items-center gap-1 px-3"
              onClick={() => navigate("/admin/services/create")}
            >
              <i className="bi bi-plus-lg"></i> Add Service
            </button>
            <button
              className="btn btn-sm btn-outline-light text-nowrap d-flex align-items-center gap-1 px-3"
              onClick={() => navigate("/admin/user-cars/create")}
            >
              <i className="bi bi-car-front"></i> Add User Car
            </button>
            <button
              className="btn btn-sm btn-outline-light text-nowrap d-flex align-items-center gap-1 px-3"
              onClick={() => navigate("/admin/gallery")}
            >
              <i className="bi bi-images"></i> Gallery
            </button>
            <button
              className="btn btn-sm btn-outline-light text-nowrap d-flex align-items-center gap-1 px-3"
              onClick={() => navigate("/admin/subscribe")}
            >
              <i className="bi bi-envelope-paper"></i> Subscribers
            </button>
            <button
              className="btn btn-sm btn-outline-light text-nowrap d-flex align-items-center gap-1 px-3"
              onClick={() => navigate("/admin/customer-reviews")}
            >
              <i className="bi bi-star"></i> Reviews
            </button>
          </div>
        </div>

        {/* Section 1: Customer Inquiries & Operations */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-chat-left-quote-fill text-danger"></i>
            <h5 className="text-white mb-0 fw-bold">Customer Inquiries & Operations</h5>
          </div>
          <div className="row g-2 g-md-3">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Total Inquiries"
                value={stats.totalInquiries}
                icon={<i className="bi bi-chat-left-text-fill"></i>}
                iconColor="#0dcaf0"
                bgColor="rgba(13, 202, 240, 0.12)"
                onClick={() => navigate("/admin/inquery")}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Pending Inquiries"
                value={stats.pendingInquiries}
                icon={<i className="bi bi-hourglass-split"></i>}
                iconColor="#ffc107"
                bgColor="rgba(255, 193, 7, 0.12)"
                badgeText={stats.pendingInquiries > 0 ? "Pending" : null}
                badgeColor="bg-warning text-dark"
                onClick={() => navigate("/admin/inquery", { state: { openTab: "PENDING" } })}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Completed Inquiries"
                value={stats.completedInquiries}
                icon={<i className="bi bi-check-circle-fill"></i>}
                iconColor="#198754"
                bgColor="rgba(25, 135, 84, 0.12)"
                onClick={() => navigate("/admin/inquery", { state: { openTab: "COMPLETED" } })}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Cancelled Inquiries"
                value={stats.cancelledInquiries}
                icon={<i className="bi bi-x-circle-fill"></i>}
                iconColor="#dc3545"
                bgColor="rgba(220, 53, 69, 0.12)"
                onClick={() => navigate("/admin/inquery", { state: { openTab: "COMPLETED" } })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fleet, Services & Customer Accounts */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-car-front-fill text-danger"></i>
            <h5 className="text-white mb-0 fw-bold">Fleet, Services & Team</h5>
          </div>
          <div className="row g-2 g-md-3">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Total Customers"
                value={stats.totalCustomers}
                icon={<i className="bi bi-people-fill"></i>}
                iconColor="#0d6efd"
                bgColor="rgba(13, 110, 253, 0.12)"
                onClick={() => navigate("/admin/users", { state: { openTab: "USER" } })}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Registered Cars"
                value={stats.userCars}
                icon={<i className="bi bi-car-front-fill"></i>}
                iconColor="#fd7e14"
                bgColor="rgba(253, 126, 20, 0.12)"
                onClick={() => navigate("/admin/user-cars")}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Catalog Services"
                value={stats.services}
                icon={<i className="bi bi-tools"></i>}
                iconColor="#e0e0e0"
                bgColor="rgba(255, 255, 255, 0.1)"
                onClick={() => navigate("/admin/services")}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                title="Staff & Technicians"
                value={stats.totalStaff}
                icon={<i className="bi bi-person-gear"></i>}
                iconColor="#20c997"
                bgColor="rgba(32, 201, 151, 0.12)"
                onClick={() => navigate("/admin/users", { state: { openTab: "STAFF" } })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Audience & Marketing */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-megaphone-fill text-danger"></i>
            <h5 className="text-white mb-0 fw-bold">Marketing & System Audience</h5>
          </div>
          <div className="row g-2 g-md-3">
            <div className="col-12 col-sm-6 col-xl-4">
              <StatCard
                title="Newsletter Subscribers"
                value={stats.subscribeUser}
                icon={<i className="bi bi-envelope-check-fill"></i>}
                iconColor="#198754"
                bgColor="rgba(25, 135, 84, 0.12)"
                badgeText="Active"
                badgeColor="bg-success"
                onClick={() => navigate("/admin/subscribe", { state: { openTab: "SUBSCRIBE" } })}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <StatCard
                title="Unsubscribed Users"
                value={stats.unsubscribeUser}
                icon={<i className="bi bi-envelope-dash-fill"></i>}
                iconColor="#6c757d"
                bgColor="rgba(108, 117, 125, 0.15)"
                onClick={() => navigate("/admin/subscribe", { state: { openTab: "UNSUBSCRIBE" } })}
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-4">
              <StatCard
                title="Total System Accounts"
                value={stats.totalEmployees}
                icon={<i className="bi bi-shield-lock-fill"></i>}
                iconColor="#ffc107"
                bgColor="rgba(255, 193, 7, 0.12)"
                onClick={() => navigate("/admin/users")}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;