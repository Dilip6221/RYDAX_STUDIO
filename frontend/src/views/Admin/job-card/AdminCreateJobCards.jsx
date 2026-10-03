import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCreateJobCards = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    carId: "",
    expectedDelivery: "",
    customerNotes: "",
  });
  useEffect(() => {
    axios.get("user/admin/get-user-job")
      .then(res => setUsers(res.data.data || []))
      .catch(() => toast.error("Failed to load users"));
  }, []);

  // 🔹 User change → load cars
  const handleUserChange = async (userId) => {
    setForm({ ...form, userId, carId: "" });
    setCars([]);
    if (!userId) return;
    try {
      const res = await axios.get(`jobcard/admin/user-cars/${userId}`);
      setCars(res.data.data || []);
    } catch {
      toast.error("Failed to load customer cars");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.carId) {
      toast.error("Please select customer and car");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("jobcard/admin/job-card/create", { ...form });
      if (res.data.success) {
        toast.success(res.data.message || "Job Card created successfully");
        navigate("/admin/job-cards");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to save job card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-0 p-sm-2">
        <div className="bg-dark rounded p-3 p-md-4 shadow-sm">
          {/* Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-2 border-bottom border-secondary">
            <div>
              <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-plus-circle text-danger"></i>
                <span>Create Job Card</span>
              </h4>
              <small className="text-secondary">Open a new service job card for a customer vehicle</small>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={() => navigate("/admin/job-cards")}
            >
              <i className="bi bi-arrow-left"></i> Back to Jobs
            </button>
          </div>

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12 col-md-6">
              <label className="form-label text-light fw-semibold">
                Customer <span className="text-danger">*</span>
              </label>
              <select
                className="form-control bg-dark text-white border-secondary"
                value={form.userId}
                onChange={(e) => handleUserChange(e.target.value)}
                required
              >
                <option value="">-- Select Customer --</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-light fw-semibold">
                Customer Car <span className="text-danger">*</span>
              </label>
              <select
                className="form-control bg-dark text-white border-secondary"
                value={form.carId}
                onChange={(e) =>
                  setForm({ ...form, carId: e.target.value })
                }
                disabled={!cars.length}
                required
              >
                <option value="">
                  {form.userId
                    ? (cars.length ? "-- Select Car --" : "No cars found for this customer")
                    : "-- First select a customer --"}
                </option>
                {cars.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.brand} {c.model} ({c.registrationNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-light fw-semibold">Expected Delivery</label>
              <input
                type="date"
                className="form-control bg-dark text-white border-secondary"
                value={form.expectedDelivery}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setForm({ ...form, expectedDelivery: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <label className="form-label text-light fw-semibold">Customer Notes / Complaints</label>
              <textarea
                rows="3"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Enter customer requests, reported issues or service details..."
                value={form.customerNotes}
                onChange={(e) =>
                  setForm({ ...form, customerNotes: e.target.value })
                }
              />
            </div>

            <div className="col-12 pt-3 border-top border-secondary d-flex flex-column flex-sm-row gap-2">
              <button
                type="submit"
                className="btn btn-danger px-4 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                <i className="bi bi-check-circle"></i>
                <span>{loading ? "Creating..." : "Create Job Card"}</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate("/admin/job-cards")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateJobCards;