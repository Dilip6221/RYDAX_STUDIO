import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Admin/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminOnlineServicePackages = () => {
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH SERVICES
  const fetchServices = async () => {
    try {
      const res = await axios.get(`online-service/admin/list-online-service`);
      setServices(res.data.data);
    } catch (err) {
      toast.error("Failed to load services");
    }
  };

  // FETCH PACKAGES
  const fetchPackages = async () => {
    try {
      setLoading(true);
      let url = `online-service/admin/package`;
      if (serviceId) url += `?serviceId=${serviceId}`;
      const res = await axios.get(url);
      setPackages(res.data.data);

    } catch (err) {
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [serviceId]);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this package?")) return;
    try {
      await axios.delete(`online-service/admin/package-delete/${id}`);
      toast.success("Deleted");
      fetchPackages();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (pkg) => {
    try {
      const newStatus = pkg.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const res = await axios.put(`online-service/admin/package-update/${pkg._id}`, {
        ...pkg,
        status: newStatus
      });
      if (res.data.success) toast.success(res.data.message || "Status updated");
      else toast.error(res.data.message || "Failed to update status");
      fetchPackages();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="bg-dark p-4 rounded text-white">

          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="text-white mb-0 d-flex align-items-center">
              <i className="bi bi-card-checklist me-2"></i>
              Online Services Packages
            </h5>
            <div className="d-flex align-items-center gap-2" style={{ flexWrap: "nowrap" }}>
              <input
                type="search"
                className="form-control form-control-sm bg-dark text-white border-secondary"
                placeholder="Search..."
                style={{ width: "180px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select form-select-sm bg-dark text-white border-secondary"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                style={{ width: "180px" }}
              >
                <option value="">All Services</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <Link to="/admin/online-services-packages/create">
                <button className="btn btn-outline-danger btn-sm  ">
                  <i className="bi bi-plus-circle me-1"></i>
                  + Add Package
                </button>
              </Link>
            </div>
          </div>

          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <table className="table table-dark table-bordered">
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th>#</th>
                  <th>Service</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((pkg, i) => (
                    <tr key={pkg._id}>
                      <td>{i + 1}</td>
                      <td>{pkg.serviceId?.name}</td>
                      <td>{pkg.name}</td>
                      <td>₹{pkg.price}</td>
                      <td>{pkg.duration} min</td>

                      <td>
                        <span
                          className={`badge ${pkg.status === "ACTIVE" ? "bg-success" : "bg-danger"}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleStatus(pkg)}
                        >
                          {pkg.status}
                        </span>
                      </td>

                      <td>
                        <i
                          className="fa-solid fa-pen-to-square text-warning me-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/admin/online-services-packages/edit/${pkg._id}`)}
                        ></i>

                        <i
                          className="fa-solid fa-trash text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(pkg._id)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data found
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

export default AdminOnlineServicePackages;