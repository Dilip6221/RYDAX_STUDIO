import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminServiceList = () => {
  const navigate = useNavigate();
  const [service, setService] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/service/admin/services`
      );

      setService(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching service data");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filteredServices = (service || []).filter((item) => {
    if (!search.trim()) return true;

    const text = search.toLowerCase();

    return (
      item.title?.toLowerCase().includes(text) ||
      item.slug?.toLowerCase().includes(text) ||
      item.category?.toLowerCase().includes(text) ||
      item.status?.toLowerCase().includes(text)
    );
  });

  const handleUserStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const res = await axios.post(
        `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/service/admin/update-status`,
        {
          serviceId: id,
          status: newStatus,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await axios.delete(
        `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/service/admin/${id}`
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-0 p-sm-2">
        <div className="bg-dark rounded p-3 p-md-4 border border-secondary border-opacity-25">
          {/* Responsive Header Bar */}
          <div className="border-bottom border-secondary border-opacity-50 pb-3 mb-3 d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
            <h4 className="text-white m-0 d-flex align-items-center">
              <i className="bi bi-tools me-2 text-danger"></i>
              Our Services
              <span className="badge bg-secondary ms-2 fs-6">
                {filteredServices.length}
              </span>
            </h4>

            <div className="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0 justify-content-between justify-content-md-end">
              <div
                className="input-group flex-grow-1"
                style={{ maxWidth: "340px", minWidth: "160px" }}
              >
                <input
                  type="search"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <Link
                to="/admin/services/create"
                className="text-decoration-none flex-shrink-0"
              >
                <button className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 px-3 py-2">
                  <i className="bi bi-plus-circle"></i>
                  <span>Create Service</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Table Container */}
          <div
            className="table-responsive"
            style={{
              maxHeight: "65vh",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            <table
              className="table table-dark table-hover table-bordered align-middle m-0"
              style={{ minWidth: "820px" }}
            >
              <thead className="sticky-top">
                <tr className="table-secondary text-dark">
                  <th style={{ width: "50px" }}>#</th>
                  <th style={{ width: "90px" }}>Image</th>
                  <th>Service Details</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th style={{ width: "70px" }}>Order</th>
                  <th>Featured</th>
                  <th>Card Features</th>
                  <th>Status</th>
                  <th className="text-center" style={{ width: "110px" }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((item, index) => (
                    <tr key={item._id}>
                      <td className="text-muted">{index + 1}</td>

                      <td>
                        {item.image?.url ? (
                          <img
                            src={item.image.url}
                            alt={item.title}
                            style={{
                              width: "75px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "1px solid rgba(255,255,255,0.15)",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center text-muted"
                            style={{ width: "75px", height: "50px" }}
                          >
                            <i className="bi bi-image"></i>
                          </div>
                        )}
                      </td>

                      <td>
                        <strong className="text-white">{item.title}</strong>
                        <br />
                        <small className="text-secondary">{item.slug}</small>
                      </td>

                      <td>
                        <span className="badge bg-dark border border-secondary text-light">
                          {item.category || "-"}
                        </span>
                      </td>

                      <td>{item.duration || "-"}</td>
                      <td className="text-center">{item.displayOrder || 0}</td>

                      <td>
                        {item.featured ? (
                          <span className="badge bg-warning text-dark px-2 py-1">
                            YES
                          </span>
                        ) : (
                          <span className="badge bg-secondary text-light px-2 py-1">
                            NO
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {(item.cardFeatures || []).slice(0, 2).map((f, i) => (
                            <span
                              className="badge bg-secondary bg-opacity-50 text-white"
                              key={i}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge px-2 py-1 ${
                            item.status === "ACTIVE"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                          style={{ cursor: "pointer" }}
                          title="Click to toggle status"
                          onClick={() => handleUserStatus(item._id, item.status)}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="text-center text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning me-2 p-1 px-2"
                          title="Edit Service"
                          aria-label="Edit Service"
                          onClick={() =>
                            navigate(`/admin/services/edit/${item._id}`)
                          }
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger p-1 px-2"
                          title="Delete Service"
                          aria-label="Delete Service"
                          onClick={() => deleteService(item._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-white py-4">
                      No Services Found...
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

export default AdminServiceList;