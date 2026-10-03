import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { validateForm } from "../../../utils/formValidation.js";
import { jobServiceValidationRules } from "../../../utils/validationRules.js";

const AdminJobServices = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const serviceNameRef = useRef(null);
  const priceRef = useRef(null);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`jobcard/admin/job-services/${jobId}`);
      setServices(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load services");
      console.error("Fetch services error", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [jobId]);

  const addService = async () => {
    const isValid = validateForm({
      values: { serviceName, price },
      validationRules: jobServiceValidationRules,
      inputRefs: { serviceName: serviceNameRef, price: priceRef },
    });
    if (!isValid) return;

    try {
      setLoading(true);
      await axios.post(`jobcard/admin/job-services/create`, { jobId, serviceName, price: Number(price) });
      toast.success("Service added");
      setServiceName("");
      setPrice("");
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add service");
      console.error("Add service error", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Remove this service?")) return;
    try {
      await axios.delete(`jobcard/admin/job-services/${id}`);
      toast.success("Service removed");
      fetchServices();
    } catch {
      toast.error("Failed to remove service");
    }
  };

  const total = services.reduce((sum, s) => sum + Number(s.price || 0), 0);

  return (
    <AdminLayout>
      <div className="container-fluid p-0 p-sm-2">
        <div className="bg-dark rounded p-3 p-md-4 shadow-sm">

          {/* Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-2 border-bottom border-secondary">
            <div>
              <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-tools text-danger"></i>
                <span>Manage Job Services</span>
              </h4>
              <small className="text-secondary">Add and manage repair/maintenance services and pricing</small>
            </div>
            <button
              type="button"
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i> Back
            </button>
          </div>

          {/* Add Service Form Card */}
          <div className="bg-black bg-opacity-25 rounded p-3 mb-4 border border-secondary">
            <h6 className="text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle text-danger"></i>
              <span>Add Service / Part Item</span>
            </h6>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <label className="form-label text-secondary small mb-1">Service / Item Description</label>
                <input
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="e.g. Engine Oil (Synthetic 5W-40), Brake Pad Replacement..."
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  ref={serviceNameRef}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3">
                <label className="form-label text-secondary small mb-1">Price (₹)</label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Price ₹"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  ref={priceRef}
                />
              </div>
              <div className="col-12 col-sm-6 col-md-3 d-flex align-items-end">
                <button
                  className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={addService}
                  disabled={loading}
                >
                  <i className="bi bi-plus-lg"></i>
                  <span>{loading ? "Adding..." : "Add Service"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            <table className="table table-dark table-hover table-bordered align-middle mb-0" style={{ minWidth: "550px" }}>
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th>Service / Item</th>
                  <th style={{ width: "160px" }}>Price</th>
                  <th className="text-center" style={{ width: "110px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-secondary py-4">
                      <i className="bi bi-inbox fs-4 d-block mb-1"></i>
                      No services added yet. Add a service above.
                    </td>
                  </tr>
                ) : (
                  services.map((s, i) => (
                    <tr key={s._id}>
                      <td>{i + 1}</td>
                      <td>
                        <span className="text-white fw-semibold">{s.serviceName}</span>
                      </td>
                      <td>
                        <span className="text-info font-monospace fw-semibold">₹{s.price}</span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger p-1 px-2"
                          onClick={() => deleteService(s._id)}
                          title="Remove Service"
                        >
                          <i className="bi bi-trash me-1"></i>
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {services.length > 0 && (
                <tfoot>
                  <tr className="table-active">
                    <td colSpan="2" className="text-end fw-bold text-white fs-6">
                      Total Estimated Cost:
                    </td>
                    <td colSpan="2" className="fw-bold text-success fs-5 font-monospace">
                      ₹{total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminJobServices;
