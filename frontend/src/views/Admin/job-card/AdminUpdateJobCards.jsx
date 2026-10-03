import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout.jsx";
import toast from "react-hot-toast";

const STAGES = [
  "CHECK_IN",
  "INSPECTION",
  "WORK_STARTED",
  "PART_REPLACED",
  "QUALITY_CHECK",
  "READY",
  "DELIVERED"
];

const STAGE_PROGRESS = {
  CHECK_IN: 5,
  INSPECTION: 20,
  WORK_STARTED: 40,
  PART_REPLACED: 60,
  QUALITY_CHECK: 80,
  READY: 95,
  DELIVERED: 100
};

const AdminUpdateJobCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    stage: "",
    note: "",
    expectedDelivery: ""
  });

  const fetchJob = async () => {
    try {
      const res = await axios.get(`jobcard/admin/get-card/${id}`);
      if (res.data.success) {
        setJob(res.data.data);
        setForm({
          stage: res.data.data.currentStage || "CHECK_IN",
          note: "",
          expectedDelivery:
            res.data.data.expectedDelivery?.slice(0, 10) || ""
        });
      }
    } catch (error) {
      toast.error("Failed to load job card");
      console.error("Fetch job error", error);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        stage: form.stage,
        note: form.note,
        progressPercent: STAGE_PROGRESS[form.stage] || 0,
        expectedDelivery: form.expectedDelivery
      };
      const res = await axios.patch(`jobcard/admin/jobcard/${id}/progress`, payload);
      if (res.data.success) {
        toast.success("Job Progress Updated");
        navigate("/admin/job-cards");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update failed");
      console.error("Update job error", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) {
    return (
      <AdminLayout>
        <div className="container-fluid p-4 text-center text-white">
          <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
          Loading job card details...
        </div>
      </AdminLayout>
    );
  }

  const currentPercent = STAGE_PROGRESS[form.stage] ?? job.progressPercent ?? 0;

  return (
    <AdminLayout>
      <div className="container-fluid p-0 p-sm-2">
        <div className="bg-dark rounded p-3 p-md-4 shadow-sm">

          {/* Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-2 border-bottom border-secondary">
            <div>
              <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-pencil-square text-warning"></i>
                <span>Update Job Card</span>
              </h4>
              <span className="badge bg-info text-dark font-monospace">{job.jobCode}</span>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>

          {/* Customer & Car Info Overview Card */}
          <div className="bg-black bg-opacity-25 rounded p-3 mb-4 border border-secondary">
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <small className="text-secondary d-block">Job Code</small>
                <strong className="text-white font-monospace">{job.jobCode}</strong>
              </div>
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
                <small className="text-secondary d-block">Current Status</small>
                <span className="badge bg-warning text-dark mt-1">
                  {job.status || "IN_PROGRESS"}
                </span>
              </div>
            </div>
          </div>

          {/* Update Form */}
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Dynamic Progress Bar */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label text-light fw-semibold mb-0">
                  Calculated Progress: {currentPercent}%
                </label>
                <span className="badge bg-primary">
                  {form.stage?.replaceAll("_", " ")}
                </span>
              </div>
              <div className="progress" style={{ height: "22px", borderRadius: "10px", backgroundColor: "#1e1e1e" }}>
                <div
                  className="progress-bar bg-success progress-bar-striped progress-bar-animated fw-bold"
                  role="progressbar"
                  style={{ width: `${currentPercent}%` }}
                  aria-valuenow={currentPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {currentPercent}%
                </div>
              </div>
            </div>

            {/* Current Stage */}
            <div className="col-12 col-md-6">
              <label className="form-label text-light fw-semibold">
                Update Stage <span className="text-danger">*</span>
              </label>
              <select
                className="form-control bg-dark text-white border-secondary"
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                required
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s.replaceAll("_", " ")} ({STAGE_PROGRESS[s]}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Expected Delivery */}
            <div className="col-12 col-md-6">
              <label className="form-label text-light fw-semibold">
                Expected Delivery Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control bg-dark text-white border-secondary"
                value={form.expectedDelivery}
                onChange={(e) =>
                  setForm({ ...form, expectedDelivery: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Update Note */}
            <div className="col-12">
              <label className="form-label text-light fw-semibold">Update Note / Status Remark</label>
              <textarea
                rows="3"
                className="form-control bg-dark text-white border-secondary"
                placeholder="e.g. Brake pads inspected and replaced. Moving to quality check..."
                value={form.note}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="col-12 pt-3 border-top border-secondary d-flex flex-column flex-sm-row gap-2">
              <button
                type="submit"
                className="btn btn-success px-4 d-flex align-items-center justify-content-center gap-2"
                disabled={submitting}
              >
                <i className="bi bi-check-circle"></i>
                <span>{submitting ? "Updating..." : "Update Job Progress"}</span>
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate(-1)}
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

export default AdminUpdateJobCard;
