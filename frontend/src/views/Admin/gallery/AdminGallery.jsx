import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [newImage, setNewImage] = useState({
    title: "",
    service: "",
    type: "SINGLE",
    description: "",
    isFeatured: false,
    file: null,
    beforeImage: null,
    afterImage: null,
  });

  const [singlePreview, setSinglePreview] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);

  const titleRef = useRef(null);
  const serviceRef = useRef(null);
  const fileRef = useRef(null);
  const beforeRef = useRef(null);
  const afterRef = useRef(null);

  const resetForm = () => {
    setNewImage({
      title: "",
      service: "",
      type: "SINGLE",
      description: "",
      isFeatured: false,
      file: null,
      beforeImage: null,
      afterImage: null,
    });
    setSinglePreview(null);
    setBeforePreview(null);
    setAfterPreview(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("gallery/gallery");
      setImages(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching gallery data");
      console.error("Fetch gallery data error", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("service/admin/services");
      const options = (res.data.data || []).map((c) => ({
        value: c.title,
        label: c.title,
      }));
      setServiceOptions(options);
    } catch (err) {
      console.error("Frontend Error Fetching Services:", err);
      toast.error(err.message || "Failed to load services");
    }
  };

  const deleteGalleryImage = (id) => async () => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) {
      return;
    }
    try {
      const res = await axios.delete(`gallery/admin/${id}`);
      if (res.data.success) {
        toast.success(res.data.message || "Item deleted");
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error deleting gallery item");
      console.error("Delete gallery error", error);
    }
  };

  const validateGalleryForm = () => {
    if (!newImage.title.trim()) {
      toast.error("Title is required");
      titleRef.current?.focus();
      return false;
    }

    if (!newImage.service) {
      toast.error("Service is required");
      serviceRef.current?.focus();
      return false;
    }

    if (newImage.type === "SINGLE" && !newImage.file) {
      toast.error("Image is required");
      fileRef.current?.focus();
      return false;
    }

    if (newImage.type === "BEFORE_AFTER" && !newImage.beforeImage) {
      toast.error("Before image is required");
      beforeRef.current?.focus();
      return false;
    }

    if (newImage.type === "BEFORE_AFTER" && !newImage.afterImage) {
      toast.error("After image is required");
      afterRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();

    if (!validateGalleryForm()) return;

    const formData = new FormData();
    formData.append("title", newImage.title);
    formData.append("service", newImage.service);
    formData.append("type", newImage.type);
    formData.append("description", newImage.description);
    formData.append("isFeatured", newImage.isFeatured);

    if (newImage.type === "SINGLE") {
      formData.append("file", newImage.file);
    }

    if (newImage.type === "BEFORE_AFTER") {
      formData.append("beforeImage", newImage.beforeImage);
      formData.append("afterImage", newImage.afterImage);
    }

    try {
      setUploading(true);
      const res = await axios.post("gallery/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Gallery item uploaded");
        setShowCreateModal(false);
        resetForm();
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Gallery upload error", error);
      toast.error("Gallery upload failed.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchServices();
  }, []);

  const beforeAfterCount = images.filter((i) => i.type === "BEFORE_AFTER").length;
  const singleCount = images.filter((i) => i.type === "SINGLE").length;

  const filteredImages = images
    .filter((item) => {
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      return true;
    })
    .filter((item) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.service?.toLowerCase().includes(q) ||
        item.type?.toLowerCase().includes(q)
      );
    });

  return (
    <AdminLayout>
      <div className="container-fluid p-0 p-sm-2">

        {/* Filter Pills Bar */}
        <div className="bg-dark rounded p-3 mb-3 shadow-sm border border-secondary border-opacity-25">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <ul className="nav nav-pills flex-nowrap overflow-x-auto pb-1 pb-sm-0" style={{ WebkitOverflowScrolling: "touch" }}>
              <li className="nav-item me-2">
                <button
                  className={`nav-link text-nowrap d-flex align-items-center gap-2 ${typeFilter === "ALL" ? "active bg-danger text-white" : "text-danger"}`}
                  onClick={() => setTypeFilter("ALL")}
                >
                  <i className="bi bi-collection"></i>
                  <span>ALL</span>
                  <span className={`badge ${typeFilter === "ALL" ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                    {images.length}
                  </span>
                </button>
              </li>
              <li className="nav-item me-2">
                <button
                  className={`nav-link text-nowrap d-flex align-items-center gap-2 ${typeFilter === "BEFORE_AFTER" ? "active bg-danger text-white" : "text-danger"}`}
                  onClick={() => setTypeFilter("BEFORE_AFTER")}
                >
                  <i className="bi bi-arrow-left-right"></i>
                  <span>BEFORE / AFTER</span>
                  <span className={`badge ${typeFilter === "BEFORE_AFTER" ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                    {beforeAfterCount}
                  </span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link text-nowrap d-flex align-items-center gap-2 ${typeFilter === "SINGLE" ? "active bg-danger text-white" : "text-danger"}`}
                  onClick={() => setTypeFilter("SINGLE")}
                >
                  <i className="bi bi-image"></i>
                  <span>SINGLE</span>
                  <span className={`badge ${typeFilter === "SINGLE" ? "bg-white text-dark" : "bg-secondary text-white"}`}>
                    {singleCount}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Gallery Card */}
        <div className="bg-dark rounded p-3 p-md-4 shadow-sm border border-secondary border-opacity-25">

          {/* Responsive Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4 pb-2 border-bottom border-secondary">
            <div>
              <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                <i className="bi bi-images text-danger"></i>
                <span>Gallery Management</span>
              </h4>
              <span className="badge bg-secondary text-white">
                Showing: {filteredImages.length} {filteredImages.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>

            <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-2">
              <div className="input-group" style={{ minWidth: "220px" }}>
                <span className="input-group-text bg-dark text-secondary border-secondary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Search title, service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                className="btn btn-outline-danger text-nowrap d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="bi bi-plus-circle"></i>
                <span>Upload Item</span>
              </button>
            </div>
          </div>

          {/* Touch Scroll Table */}
          <div className="table-responsive" style={{ maxHeight: "65vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            <table className="table table-dark table-hover table-bordered align-middle mb-0" style={{ minWidth: "900px" }}>
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th style={{ width: "50px" }}>#</th>
                  <th style={{ width: "180px" }}>Preview</th>
                  <th>Type</th>
                  <th>Service</th>
                  <th>Title & Description</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-center" style={{ width: "90px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center text-white py-4">
                      <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                      Loading gallery items...
                    </td>
                  </tr>
                ) : filteredImages.length > 0 ? (
                  filteredImages.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>

                      <td>
                        {item.type === "SINGLE" ? (
                          <div className="position-relative d-inline-block">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="rounded border border-secondary shadow-sm"
                              style={{
                                width: "90px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="d-flex gap-1 align-items-center">
                            <div className="text-center">
                              <img
                                src={item.beforeImage?.url}
                                alt="Before"
                                className="rounded border border-secondary shadow-sm d-block"
                                style={{
                                  width: "68px",
                                  height: "48px",
                                  objectFit: "cover",
                                }}
                              />
                              <span className="badge bg-secondary font-monospace" style={{ fontSize: "9px" }}>Before</span>
                            </div>
                            <div className="text-center">
                              <img
                                src={item.afterImage?.url}
                                alt="After"
                                className="rounded border border-secondary shadow-sm d-block"
                                style={{
                                  width: "68px",
                                  height: "48px",
                                  objectFit: "cover",
                                }}
                              />
                              <span className="badge bg-success font-monospace" style={{ fontSize: "9px" }}>After</span>
                            </div>
                          </div>
                        )}
                      </td>

                      <td>
                        {item.type === "BEFORE_AFTER" ? (
                          <span className="badge bg-danger">Before / After</span>
                        ) : (
                          <span className="badge bg-info text-dark">Single</span>
                        )}
                      </td>

                      <td>
                        <span className="badge bg-dark border border-secondary text-warning">
                          {item.service || "General"}
                        </span>
                      </td>

                      <td>
                        <div className="fw-semibold text-white">{item.title || "-"}</div>
                        {item.description && (
                          <small className="text-secondary d-block mt-1 text-truncate" style={{ maxWidth: "240px" }}>
                            {item.description}
                          </small>
                        )}
                      </td>

                      <td>
                        {item.isFeatured ? (
                          <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
                            <i className="bi bi-star-fill"></i> Yes
                          </span>
                        ) : (
                          <span className="badge bg-secondary">No</span>
                        )}
                      </td>

                      <td>
                        {item.isActive ? (
                          <span className="badge bg-success">ACTIVE</span>
                        ) : (
                          <span className="badge bg-danger">INACTIVE</span>
                        )}
                      </td>

                      <td className="text-nowrap">
                        <small className="text-light">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                        </small>
                      </td>

                      <td className="text-center text-nowrap">
                        <button
                          type="button"
                          onClick={deleteGalleryImage(item._id)}
                          className="btn btn-sm btn-outline-danger p-1 px-2"
                          title="Delete Item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-secondary py-5">
                      <i className="bi bi-images fs-2 d-block mb-2 text-secondary"></i>
                      No gallery items found matching criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showCreateModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.75)",
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title d-flex align-items-center gap-2">
                  <i className="bi bi-images text-danger"></i>
                  <span>Upload Gallery Item</span>
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  aria-label="Close"
                ></button>
              </div>

              <form onSubmit={handleUploadImage}>
                <div className="modal-body p-3 p-md-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-light fw-semibold">
                        Gallery Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control bg-dark text-white border-secondary"
                        value={newImage.type}
                        onChange={(e) => {
                          setNewImage({
                            ...newImage,
                            type: e.target.value,
                            file: null,
                            beforeImage: null,
                            afterImage: null,
                          });
                          setSinglePreview(null);
                          setBeforePreview(null);
                          setAfterPreview(null);
                        }}
                      >
                        <option value="SINGLE">Single Image</option>
                        <option value="BEFORE_AFTER">Before / After</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-light fw-semibold">
                        Select Service <span className="text-danger">*</span>
                      </label>
                      <select
                        name="service"
                        className="form-control bg-dark text-white border-secondary"
                        value={newImage.service}
                        onChange={(e) =>
                          setNewImage((prev) => ({
                            ...prev,
                            service: e.target.value,
                          }))
                        }
                        ref={serviceRef}
                      >
                        <option value="">-- Select Service --</option>
                        {serviceOptions.map((opt, index) => (
                          <option key={index} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-8">
                      <label className="form-label text-light fw-semibold">
                        Item Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="e.g. Ceramic Coating on BMW M3"
                        value={newImage.title}
                        onChange={(e) =>
                          setNewImage({ ...newImage, title: e.target.value })
                        }
                        ref={titleRef}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-light fw-semibold">Featured on Home?</label>
                      <select
                        className="form-control bg-dark text-white border-secondary"
                        value={newImage.isFeatured ? "true" : "false"}
                        onChange={(e) =>
                          setNewImage({
                            ...newImage,
                            isFeatured: e.target.value === "true",
                          })
                        }
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>

                    {newImage.type === "SINGLE" && (
                      <div className="col-12">
                        <label className="form-label text-light fw-semibold">
                          Upload Image <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control bg-dark text-white border-secondary"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setNewImage({
                              ...newImage,
                              file,
                            });
                            if (file) setSinglePreview(URL.createObjectURL(file));
                          }}
                          ref={fileRef}
                        />
                        {singlePreview && (
                          <div className="mt-2">
                            <img
                              src={singlePreview}
                              alt="preview"
                              className="rounded border border-secondary shadow-sm"
                              style={{ maxHeight: "120px", maxWidth: "200px", objectFit: "cover" }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {newImage.type === "BEFORE_AFTER" && (
                      <>
                        <div className="col-12 col-md-6">
                          <label className="form-label text-light fw-semibold">
                            Upload Before Image <span className="text-danger">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control bg-dark text-white border-secondary"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setNewImage({
                                ...newImage,
                                beforeImage: file,
                              });
                              if (file) setBeforePreview(URL.createObjectURL(file));
                            }}
                            ref={beforeRef}
                          />
                          {beforePreview && (
                            <div className="mt-2">
                              <img
                                src={beforePreview}
                                alt="before preview"
                                className="rounded border border-secondary shadow-sm"
                                style={{ maxHeight: "100px", maxWidth: "160px", objectFit: "cover" }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label text-light fw-semibold">
                            Upload After Image <span className="text-danger">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control bg-dark text-white border-secondary"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setNewImage({
                                ...newImage,
                                afterImage: file,
                              });
                              if (file) setAfterPreview(URL.createObjectURL(file));
                            }}
                            ref={afterRef}
                          />
                          {afterPreview && (
                            <div className="mt-2">
                              <img
                                src={afterPreview}
                                alt="after preview"
                                className="rounded border border-secondary shadow-sm"
                                style={{ maxHeight: "100px", maxWidth: "160px", objectFit: "cover" }}
                              />
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <div className="col-12">
                      <label className="form-label text-light fw-semibold">Description</label>
                      <textarea
                        rows="3"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="Optional details about this project or vehicle..."
                        value={newImage.description}
                        onChange={(e) =>
                          setNewImage({
                            ...newImage,
                            description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary d-flex flex-column flex-sm-row gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-danger px-4 d-flex align-items-center justify-content-center gap-2"
                    disabled={uploading}
                  >
                    <i className="bi bi-cloud-arrow-up"></i>
                    <span>{uploading ? "Uploading..." : "Upload Gallery Item"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminGallery;