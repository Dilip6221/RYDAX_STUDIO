import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Admin/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const AdminCreateOnlineAddonService = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        packageId: "",
        name: "",
        price: "",
        description: "",
        status: "ACTIVE"
    });

    // FETCH PACKAGES
    const fetchPackages = async () => {
        const res = await axios.get("online-service/admin/package");
        setPackages(res.data.data || []);
    };
    const fetchAddon = async () => {
        const res = await axios.get(`online-service/admin/addon/${id}`);
        setForm(res.data.data || {});
    };

    useEffect(() => {
        fetchPackages();
        if (isEdit) fetchAddon();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.packageId || !form.name || !form.price) {
            return toast.error("Required fields missing");
        }
        try {
            setLoading(true);
            if (isEdit) {
                await axios.put(`online-service/admin/addon-update/${id}`, form);
                toast.success("Updated");
            } else {
                await axios.post("online-service/admin/addon-create", form);
                toast.success("Created");
            }
            navigate("/admin/online-addon-services");
        } catch {
            toast.error("Error saving");
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
                        {isEdit ? "dit Addon" : "reate Addon"}
                    </h4>
                    <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => navigate("/admin/online-addon-services")}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <form className="row g-3 bg-dark rounded text-white p-4" onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Select Package *</label>
                            <select
                                className="form-control bg-dark text-white"
                                name="packageId"
                                value={form.packageId}
                                onChange={handleChange}
                            >
                                <option value="">Select Package</option>
                                {packages.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Addon Name</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Price</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row g-3 mt-1">
                        <div className="col-12">
                            <label className="form-label">Description *</label>
                            <textarea
                                className="form-control bg-dark text-white"
                                placeholder="Description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {isEdit && (
                        <div className="col-md-4 mt-2">
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
                        <button type="submit" className="btn-sm btn btn-danger" disabled={loading}>
                            <i className="fas fa-save me-2"></i>
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm "
                            onClick={() => navigate("/admin/online-addon-services")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout >
    );
};

export default AdminCreateOnlineAddonService;