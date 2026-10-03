import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../../component/Admin/TextEditor.jsx";
import { validateForm } from "../../../utils/formValidation.js";
import { blogCreateValidationRules } from "../../../utils/validationRules.js";

const AdminCreateBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        title: "",
        category: "",
        tags: "",
        metaTitle: "",
        metaDescription: "",
        thumbnail: null,
        content: ""
    });

    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const titleRef = useRef(null);
    const categoryRef = useRef(null);
    const thumbnailRef = useRef(null);
    const contentRef = useRef(null);

    const fetchBlog = async () => {
        try {
            const res = await axios.get(`blog/blogs/${id}`);
            if (res.data.success) {
                const b = res.data.data;
                setForm({
                    title: b.title || "",
                    category: b.category || "",
                    tags: b.tags?.join(", ") || "",
                    metaTitle: b.metaTitle || "",
                    metaDescription: b.metaDescription || "",
                    thumbnail: null,
                    content: b.contentHTML || ""
                });
                setPreview(b.thumbnail?.url || "");
            }
        } catch {
            toast.error("Failed to load blog");
        }
    };

    useEffect(() => {
        if (isEdit) fetchBlog();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // make thumbnail required only when creating a new blog
        const rules = { ...blogCreateValidationRules };
        if (isEdit) rules.thumbnail = { required: false };

        const isValid = validateForm({
            values: { title: form.title, category: form.category, content: form.content, thumbnail: form.thumbnail },
            validationRules: rules,
            inputRefs: { title: titleRef, category: categoryRef, content: contentRef, thumbnail: thumbnailRef },
        });
        if (!isValid) return;

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("category", form.category);
            formData.append("metaTitle", form.metaTitle);
            formData.append("metaDescription", form.metaDescription);
            formData.append("content", form.content);
            form.tags.split(",").forEach(tag => {
                if (tag.trim()) {
                    formData.append("tags[]", tag.trim());
                }
            });
            if (isEdit) {
                formData.append("id", id);
            }
            if (form.thumbnail) {
                formData.append("image", form.thumbnail);
            }
            const res = await axios.post(`blog/admin/create-blog`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            if (res.data.success) {
                toast.success(res.data.message || (isEdit ? "Blog updated" : "Blog created"));
                navigate("/admin/blogs");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error submitting the form");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                <div className="bg-dark rounded p-3 p-md-4 shadow-sm border border-secondary border-opacity-25">

                    {/* Header */}
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 pb-2 border-bottom border-secondary">
                        <div>
                            <h4 className="text-white mb-1 d-flex align-items-center gap-2">
                                <i className="bi bi-journal-plus text-danger"></i>
                                <span>{isEdit ? "Update Blog Post" : "Create Blog Post"}</span>
                            </h4>
                            <small className="text-secondary">
                                {isEdit ? "Edit and update your existing article" : "Write and publish articles, car maintenance advice, or workshop news"}
                            </small>
                        </div>
                        <button
                            type="button"
                            className="btn btn-outline-danger d-flex align-items-center gap-2"
                            onClick={() => navigate("/admin/blogs")}
                        >
                            <i className="bi bi-arrow-left"></i> Back to Blogs
                        </button>
                    </div>

                    <form className="row g-3" onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="col-12 col-md-6">
                            <label className="form-label text-light fw-semibold">
                                Blog Title <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="e.g. Essential Car Care Tips Before Monsoon"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                ref={titleRef}
                            />
                        </div>

                        {/* Category */}
                        <div className="col-12 col-md-6">
                            <label className="form-label text-light fw-semibold">
                                Category <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="e.g. Maintenance, Detailing, Tips"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                ref={categoryRef}
                            />
                        </div>

                        {/* SEO Meta Title */}
                        <div className="col-12 col-md-6">
                            <label className="form-label text-light fw-semibold">SEO Meta Title</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="Optimized SEO Title"
                                value={form.metaTitle}
                                onChange={(e) =>
                                    setForm({ ...form, metaTitle: e.target.value })
                                }
                            />
                        </div>

                        {/* SEO Meta Description */}
                        <div className="col-12 col-md-6">
                            <label className="form-label text-light fw-semibold">SEO Meta Description</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="Brief summary for search engine snippet..."
                                value={form.metaDescription}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        metaDescription: e.target.value
                                    })
                                }
                            />
                        </div>

                        {/* Tags */}
                        <div className="col-12 col-md-6">
                            <label className="form-label text-light fw-semibold">Tags (comma separated)</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white border-secondary"
                                placeholder="car care, oil service, engine repair"
                                value={form.tags}
                                onChange={(e) =>
                                    setForm({ ...form, tags: e.target.value })
                                }
                            />
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="col-12 col-md-6">
                            <label className="form-label text-light fw-semibold">
                                Thumbnail Image {!isEdit && <span className="text-danger">*</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control bg-dark text-white border-secondary"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setForm({ ...form, thumbnail: file });
                                    if (file) setPreview(URL.createObjectURL(file));
                                }}
                                ref={thumbnailRef}
                            />
                            {preview && (
                                <div className="mt-2">
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="rounded border border-secondary"
                                        style={{ maxHeight: "100px", maxWidth: "160px", objectFit: "cover" }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="col-12 mt-3">
                            <label className="form-label text-light fw-semibold mb-2">
                                ✍️ Blog Article Content <span className="text-danger">*</span>
                            </label>
                            <div
                                style={{
                                    border: "1px solid #444",
                                    borderRadius: "8px",
                                    padding: "4px",
                                    background: "#0c0c0c"
                                }}
                                ref={contentRef}
                            >
                                <TextEditor
                                    value={form.content}
                                    onChange={(value) =>
                                        setForm({ ...form, content: value })
                                    }
                                />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="col-12 pt-3 border-top border-secondary d-flex flex-column flex-sm-row gap-2">
                            <button
                                type="submit"
                                className="btn btn-danger px-4 d-flex align-items-center justify-content-center gap-2"
                                disabled={submitting}
                            >
                                <i className="bi bi-check-circle"></i>
                                <span>{submitting ? "Saving..." : (isEdit ? "Update Blog" : "Publish Blog")}</span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                onClick={() => navigate("/admin/blogs")}
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

export default AdminCreateBlog;