import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate, useParams } from "react-router-dom";

const AdminCreateAboutTimeLine = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        year: "",
        title: "",
        description: "",
        order: 0
    });

    const [images, setImages] = useState([]); // new images
    const [preview, setPreview] = useState([]); // mixed preview (old + new)
    const [submitting, setSubmitting] = useState(false);
    const [loadingData, setLoadingData] = useState(isEdit);

    // FETCH DATA
    const fetchTimeline = async () => {
        try {
            setLoadingData(true);
            const res = await axios.get(
                `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/about-timeline/about-timeline/${id}`
            );
            if (res.data.success) {
                const data = res.data.data;
                setForm({
                    year: data.year || "",
                    title: data.title || "",
                    description: data.description || "",
                    order: data.order || 0
                });
                setPreview(data.images || []);
            }
        } catch {
            toast.error("Failed to load timeline");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (isEdit) fetchTimeline();
    }, [id]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
        const previewUrls = files.map(file => ({
            url: URL.createObjectURL(file),
            isNew: true
        }));

        setPreview(prev => [...prev, ...previewUrls]);
    };

    const handleRemovePreview = (index) => {
        setPreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.year || !form.title) {
            toast.error("Please fill in required fields (Year and Title)");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("year", form.year);
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("order", form.order);
            if (isEdit) {
                formData.append("id", id);
            }
            images.forEach((img) => {
                formData.append("images", img);
            });
            const url = isEdit
                ? `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/about-timeline/admin/update-about-timeline`
                : `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/about-timeline/admin/create-about-timeline`;

            const method = isEdit ? "put" : "post";
            const res = await axios({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/about-timeline");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-3 py-3">
                <div className="bg-dark rounded p-3 p-md-4 shadow-sm border border-secondary border-opacity-25">
                    {/* Header */}
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-3 mb-4 pb-3 border-bottom border-secondary">
                        <div>
                            <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                                <i className="bi bi-clock-history text-danger"></i>
                                <span>{isEdit ? "Update Timeline Milestone" : "Create Timeline Milestone"}</span>
                            </h4>
                            <span className="text-secondary small">
                                {isEdit ? "Modify milestone details and showcase photos" : "Add a key milestone to the garage journey"}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="btn btn-outline-secondary text-white d-flex align-items-center justify-content-center gap-2"
                            onClick={() => navigate("/admin/about-timeline")}
                        >
                            <i className="bi bi-arrow-left"></i>
                            <span>Back to Timeline</span>
                        </button>
                    </div>

                    {loadingData ? (
                        <div className="py-5 text-center text-secondary">
                            <div className="spinner-border text-danger spinner-border-sm me-2" role="status"></div>
                            <span>Loading milestone details...</span>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="row g-3">
                            {/* Year */}
                            <div className="col-12 col-md-4">
                                <label className="form-label text-white fw-semibold">
                                    Year <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Year (e.g. 2025)"
                                    className="form-control bg-dark text-white border-secondary"
                                    value={form.year}
                                    required
                                    onChange={(e) =>
                                        setForm({ ...form, year: e.target.value })
                                    }
                                />
                            </div>

                            {/* Title */}
                            <div className="col-12 col-md-4">
                                <label className="form-label text-white fw-semibold">
                                    Milestone Title <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Title"
                                    className="form-control bg-dark text-white border-secondary"
                                    value={form.title}
                                    required
                                    onChange={(e) =>
                                        setForm({ ...form, title: e.target.value })
                                    }
                                />
                            </div>

                            {/* Order */}
                            <div className="col-12 col-md-4">
                                <label className="form-label text-white fw-semibold">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter Order (0, 1, 2...)"
                                    className="form-control bg-dark text-white border-secondary"
                                    value={form.order}
                                    onChange={(e) =>
                                        setForm({ ...form, order: e.target.value })
                                    }
                                />
                            </div>

                            {/* Description */}
                            <div className="col-12">
                                <label className="form-label text-white fw-semibold">
                                    Milestone Description
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe this milestone, achievement, or major turning point..."
                                    className="form-control bg-dark text-white border-secondary"
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                />
                            </div>

                            {/* Images Upload */}
                            <div className="col-12">
                                <label className="form-label text-white fw-semibold d-flex align-items-center justify-content-between">
                                    <span>Milestone Images <span className="text-secondary fw-normal small">(Max 5 images)</span></span>
                                    {preview.length > 0 && (
                                        <span className="badge bg-secondary">{preview.length} images selected</span>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="form-control bg-dark text-white border-secondary"
                                    onChange={handleImageChange}
                                />

                                {/* Previews Grid */}
                                {preview.length > 0 && (
                                    <div className="d-flex gap-3 mt-3 flex-wrap">
                                        {preview.map((img, index) => (
                                            <div
                                                key={index}
                                                style={{ position: "relative" }}
                                                className="d-inline-block"
                                            >
                                                <img
                                                    src={img.url || img}
                                                    alt="preview"
                                                    width="90"
                                                    height="90"
                                                    className="rounded border border-secondary"
                                                    style={{ objectFit: "cover" }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePreview(index)}
                                                    style={{
                                                        position: "absolute",
                                                        top: "-6px",
                                                        right: "-6px",
                                                        background: "#dc3545",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "50%",
                                                        width: "20px",
                                                        height: "20px",
                                                        fontSize: "12px",
                                                        lineHeight: "1",
                                                        padding: 0,
                                                        cursor: "pointer"
                                                    }}
                                                    title="Remove image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit and Cancel Buttons */}
                            <div className="col-12 d-flex flex-column flex-sm-row gap-2 mt-4 pt-3 border-top border-secondary">
                                <button
                                    type="submit"
                                    className="btn btn-danger px-4 py-2 d-flex align-items-center justify-content-center gap-2"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm" role="status"></div>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle-fill"></i>
                                            <span>{isEdit ? "Update Milestone" : "Create Milestone"}</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary text-white px-4 py-2"
                                    onClick={() => navigate("/admin/about-timeline")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCreateAboutTimeLine;