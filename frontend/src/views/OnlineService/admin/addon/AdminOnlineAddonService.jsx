import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Admin/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminOnlineAddonService = () => {
  const navigate = useNavigate();

  const [addons, setAddons] = useState([]);
  const [packages, setPackages] = useState([]);
  const [packageId, setPackageId] = useState("");
  const [search, setSearch] = useState("");

  const fetchPackages = async () => {
    try {
      const res = await axios.get(
        `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/online-service/admin/package`
      );
      setPackages(res.data.data);
    } catch {
      toast.error("Failed to load packages");
    }
  };

  const fetchAddons = async () => {
    try {
      let url = `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/online-service/admin/addon`;
      if (packageId) url += `?packageId=${packageId}`;
      const res = await axios.get(url);
      setAddons(res.data.data);
    } catch {
      toast.error("Failed to load addons");
    }
  };
  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    fetchAddons();
  }, [packageId]);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this addon?")) return;
    try {
      const res = await axios.delete(
        `online-service/admin/addon-delete/${id}`
      );
      if (res.data.success) {
        toast.success(res.data.message || "Deleted");
      } else {
        toast.error(res.data.message || "Delete failed");
      }
      fetchAddons();
    } catch {
      toast.error("Delete failed");
    }
  };
  // STATUS TOGGLE
  const toggleStatus = async (addon) => {
    try {
      const newStatus =
        addon.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const res = await axios.put(
        `online-service/admin/addon-update/${addon._id}`,
        { ...addon, status: newStatus }
      );
      if (res.data.success) toast.success(res.data.message || "Status updated");
      else toast.error(res.data.message || "Failed to update status");
      fetchAddons();
    } catch {
      toast.error("Status update failed");
    }
  };
  const filtered = addons.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="bg-dark rounded p-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 className="text-white mb-0 d-flex align-items-center">
              <i className="bi bi-card-checklist me-2"></i>
              Addon Services
            </h5>
            <div className="d-flex align-items-center gap-2" style={{ flexWrap: "nowrap" }}>
              <input
                type="search"
                className="form-control form-control-sm bg-dark text-white border-secondary"
                placeholder="Search..."
                style={{ width: "200px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-select form-select-sm bg-dark text-white border-secondary"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="">All Packages</option>
                {packages.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => navigate("/admin/online-addon-services/create")}
              >
                + Add Addon
              </button>
            </div>
          </div>

          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <table className="table table-dark table-bordered">
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th>#</th>
                  <th>Package</th>
                  <th>Service</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((a, i) => (
                    <tr key={a._id}>
                      <td>{i + 1}</td>
                      <td>{a.packageId?.name}</td>
                      <td>{a.packageId?.serviceId?.name}</td>
                      <td>{a.name}</td>
                      <td>₹{a.price}</td>

                      <td>
                        <span
                          className={`badge ${a.status === "ACTIVE"
                            ? "bg-success"
                            : "bg-danger"
                            }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => toggleStatus(a)}
                        >
                          {a.status}
                        </span>
                      </td>

                      <td>
                        <i
                          className="fa-solid fa-pen-to-square text-warning me-3"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/admin/online-addon-services/edit/${a._id}`)
                          }
                        ></i>

                        <i
                          className="fa-solid fa-trash text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(a._id)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No addons found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div >
    </AdminLayout >
  );
};

export default AdminOnlineAddonService;