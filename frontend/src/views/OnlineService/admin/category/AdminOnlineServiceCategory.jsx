import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Admin/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminOnlineServiceCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("online-service/admin/online-category");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await axios.delete(`online-service/admin/online-category/${id}`);
      if (res.data.success) {
        toast.success(res.data.message || "Deleted");
      }
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };
  const toggleStatus = async (cat) => {
    try {
      const newStatus = cat.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const res = await axios.put(`online-service/admin/online-category/${cat._id}`, {
        status: newStatus
      });
      if (res.data.success) {
        toast.success("Status updated");
      }
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const filteredData = (categories || []).filter((cat) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.slug?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="bg-dark rounded p-4">



          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="text-white mb-0 d-flex align-items-center">
              <i className="bi bi-card-checklist me-2"></i>
              Online Services Categories
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
              <Link to="/admin/online-services-category/create">
                <button className="btn btn-outline-danger btn-sm">
                  <i className="bi bi-plus-circle me-1"></i>
                  + Add Category
                </button>
              </Link>
            </div>
          </div>
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <table className="table table-dark table-hover table-bordered align-middle">
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((cat, index) => (
                    <tr key={cat._id}>
                      <td>{index + 1}</td>
                      <td>{cat.name}</td>
                      <td>{cat.slug}</td>
                      <td>
                        <span
                          className={cat.status === "ACTIVE" ? "badge bg-success" : "badge bg-danger"}
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleStatus(cat)}
                        >
                          {cat.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-3 align-items-center">
                          <i
                            className="fa-solid fa-pen-to-square text-warning"
                            style={{ cursor: "pointer" }}
                            title="Edit"
                            onClick={() => navigate(`/admin/online-services-category/edit/${cat._id}`)}
                          ></i>
                          <i
                            className="fa-solid fa-trash text-danger"
                            style={{ cursor: "pointer" }}
                            title="Delete"
                            onClick={() => handleDelete(cat._id)}
                          ></i>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-white">
                      No categories found.
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

export default AdminOnlineServiceCategory;
