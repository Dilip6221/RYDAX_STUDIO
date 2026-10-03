import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Admin/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AdminCreateOnlineServiceCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [form, setForm] = useState({
        name: "",
        icon: "",
        image: "",
        sortOrder: 0,
        status: "ACTIVE"
    });

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isEdit) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            const res = await axios.get(`online-service/${id}`);
            setForm(res.data.data || {});
        } catch (err) {
            console.error(err);
        }
    };

    // HANDLE INPUT
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEdit) {
                const res = await axios.put(`online-service/admin/online-category/${id}`, form);
                if (res.data.success) toast.success("Category updated");
            } else {
                const res = await axios.post("online-service/admin/online-category-create", form);
                if (res.data.success) toast.success("Category created");
            }
            navigate("/admin/online-services-category");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save online category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="section-title">
                        <span className="first-letter">{isEdit ? "E" : "C"}</span>
                        {isEdit ? "dit Category" : "reate Category"}
                    </h4>
                    <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => navigate("/admin/online-services-category")}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <form className="row g-3 bg-dark rounded text-white p-2" onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control bg-dark text-white"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Basic Maintenance"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Icon *</label>
                            <input
                                type="text"
                                name="icon"
                                className="form-control bg-dark text-white"
                                value={form.icon}
                                onChange={handleChange}
                                required
                                placeholder="e.g. bi bi-tools or icon URL"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Image URL *</label>
                            <input
                                type="url"
                                name="image"
                                className="form-control bg-dark text-white"
                                value={form.image}
                                onChange={handleChange}
                                required
                                placeholder="https://..."
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Sort Order </label>
                            <input
                                type="number"
                                name="sortOrder"
                                className="form-control bg-dark text-white"
                                value={form.sortOrder}
                                onChange={handleChange}
                                min={0}
                                placeholder="0"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Status</label>
                            <div className="position-relative">
                                <select
                                    name="status"
                                    value={form.status}
                                    className="form-control bg-dark text-white pe-5"
                                    onChange={handleChange}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                                <span className="position-absolute end-0 top-50 translate-middle-y pe-3 text-white-50" style={{pointerEvents: 'none'}}>
                                    <i className="bi bi-chevron-down"></i>
                                </span>
                            </div>
                        </div>
                        {form.image && (
                            <div className="col-12">
                                <div className="d-flex align-items-center gap-3">
                                    <img src={form.image} alt="preview" style={{height: 80, borderRadius: 6, objectFit: 'cover'}} />
                                    <div>
                                        <a href={form.image} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light me-2">Open Image</a>
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setForm({ ...form, image: '' })}>Clear Image</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="col-12 d-flex justify-content-end gap-2">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin/online-services-category')}>Cancel</button>
                            <button type="submit" className="btn btn-danger">
                                <i className="bi bi-plus-circle me-2"></i>
                                {loading ? "Saving..." : "Save Category"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminCreateOnlineServiceCategory;