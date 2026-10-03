import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Admin/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const AdminCreateOnlineService = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        categoryId: "",
        name: "",
        image: "",
        description: "",
        status: "ACTIVE"
    });

    const fetchCategories = async () => {
        try {
            const res = await axios.get("online-service/admin/online-category");
            setCategories(res.data.data);
        } catch (err) {
            toast.error("Failed to load categories");
        }
    };
    const fetchService = async () => {
        try {
            const res = await axios.get(`online-service/admin/get-online-service/${id}`);
            setForm(res.data.data);
        } catch (err) {
            toast.error("Failed to load service");
        }
    };

    useEffect(() => {
        fetchCategories();
        if (isEdit) fetchService();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.categoryId || !form.name) {
            return toast.error("Category & Name required");
        }
        try {
            setLoading(true);
            if (isEdit) {
                await axios.put(`online-service/admin/online-service-update/${id}`, form);
                toast.success("Service updated");
            } else {
                await axios.post("online-service/admin/online-service-create", form);
                toast.success("Service created");
            }
            navigate("/admin/online-services");
        } catch (err) {
            console.error(err);
            toast.error("Error saving service");
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
                        {isEdit ? "dit Service" : "reate Service"}
                    </h4>
                    <button type="button" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" onClick={() => navigate("/admin/online-services")}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <form className="row g-3 bg-dark rounded text-white p-4" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label className="form-label">Category *</label>
                        <select
                            className="form-control bg-dark text-white"
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Service Name</label>
                        <input
                            type="text"
                            className="form-control bg-dark text-white"
                            name="name"
                            value={form.name}
                            placeholder="e.g. Full Service"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Image URL</label>
                        <input
                            type="text"
                            className="form-control bg-dark text-white"
                            name="image"
                            value={form.image}
                            placeholder="https://..."
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control bg-dark text-white"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                        />
                    </div>

                    {isEdit && (
                        <div className="col-md-4">
                            <label className="form-label">Status</label>
                            <select
                                className="form-control bg-dark text-white"
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                    )}

                    <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                        <button type="submit" className="btn btn-danger btn-sm" disabled={loading}>
                            <i className="bi bi-save me-2"></i>
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate("/admin/online-services")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout >
    );
};

export default AdminCreateOnlineService;