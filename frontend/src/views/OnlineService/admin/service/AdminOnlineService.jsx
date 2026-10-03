import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Admin/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminOnlineService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/online-service/admin/online-category`);
      setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch categories");
      console.error(err);
    }
  };
  const fetchServices = async () => {
    try {
      setLoading(true);
      let url = `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/online-service/admin/list-online-service`;
      if (categoryId) {
        url += `?categoryId=${categoryId}`;
      }
      const res = await axios.get(url);
      setServices(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [categoryId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      const res = await axios.delete(`online-service/admin/online-service-delete/${id}`); // Delete a service
      if (res.data.success) toast.success(res.data.message || "Deleted");
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };
  const toggleStatus = async (service) => {
    try {
      const newStatus = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const res = await axios.put(`online-service/admin/online-service-update/${service._id}`, { status: newStatus });
      if (res.data.success) toast.success(res.data.message || "Status updated");
      else toast.error(res.data.message || "Failed to update status");
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const filteredData = (services || []).filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.categoryId?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="bg-dark rounded p-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="text-white mb-0 d-flex align-items-center">
              <i className="bi bi-card-checklist me-2"></i>
              Online Services
            </h5>
            {/* RIGHT SIDE CONTROLS */}
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
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ width: "180px" }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Link to="/admin/online-services/create">
                <button className="btn btn-outline-danger btn-sm  ">
                  <i className="bi bi-plus-circle me-1"></i>
                  + Add Service
                </button>
              </Link>
            </div>
          </div>
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <table className="table table-dark table-hover table-bordered align-middle">
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((service, index) => (
                    <tr key={service._id}>
                      <td>{index + 1}</td>
                      <td>{service.categoryId?.name || "-"}</td>
                      <td>{service.name}</td>
                      <td style={{ maxWidth: "300px" }}>
                        {service.description
                          ? service.description.slice(0, 80) + "..."
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={service.status === "ACTIVE" ? "badge bg-success" : "badge bg-danger"}
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleStatus(service)}
                        >
                          {service.status}
                        </span>
                      </td>
                      <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-3 align-items-center">
                          <i
                            className="fa-solid fa-pen-to-square text-warning"
                            style={{ cursor: "pointer" }}
                            title="Edit"
                            onClick={() => navigate(`/admin/online-services/edit/${service._id}`)}
                          ></i>
                          <i
                            className="fa-solid fa-trash text-danger"
                            style={{ cursor: "pointer" }}
                            title="Delete"
                            onClick={() => handleDelete(service._id)}
                          ></i>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-white">
                      No services found.
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

export default AdminOnlineService;
