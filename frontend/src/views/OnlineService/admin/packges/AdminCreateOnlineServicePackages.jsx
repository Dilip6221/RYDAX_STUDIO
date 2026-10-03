import React, { useEffect, useState } from "react";
import AdminLayout from "../../../Admin/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const AdminCreateOnlineServicePackages = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        serviceId: "",
        name: "",
        price: "",
        duration: "",
        features: "",
        status: "ACTIVE"
    });

    // FETCH SERVICES
    const fetchServices = async () => {
        const res = await axios.get(`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/online-service/admin/list-online-service`);
        setServices(res.data.data);
    };

    const fetchPackage = async () => {
        const res = await axios.get(`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/online-service/admin/package/${id}`);
        const data = res.data.data;
        setForm({
            ...data,
            features: data.features?.join(", ")
        });
    };

    useEffect(() => {
        fetchServices();
        if (isEdit) fetchPackage();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            features: form.features.split(",").map((f) => f.trim())
        };
        try {
            setLoading(true);
            if (isEdit) {
                await axios.put(`online-service/admin/package-update/${id}`, payload);
                toast.success("Updated");
            } else {
                await axios.post("online-service/admin/package-create", payload);
                toast.success("Created");
            }

            navigate("/admin/online-services-packages");

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
                        {isEdit ? "dit Package" : "reate Package"}
                    </h4>
                    <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2" onClick={() => navigate("/admin/online-services-packages")}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <form className="row g-3 bg-dark rounded text-white p-4" onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Select Service *</label>
                            <select
                                className="form-control bg-dark text-white"
                                name="serviceId"
                                value={form.serviceId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Service</option>
                                {services.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Package Name</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Package Price</label>
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
                        <div className="col-md-6">
                            <label className="form-label">Duration (minutes)</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white"
                                placeholder="Duration (minutes)"
                                name="duration"
                                value={form.duration}
                                onChange={handleChange}
                            />
                        </div>
                        {isEdit && (
                            <div className="col-md-6 ">
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

                    </div>
                    <div className="col-md-12 mt-2">
                        <label className="form-label">Features (comma separated)</label>
                        <textarea
                            className="form-control bg-dark text-white"
                            placeholder="Features (comma separated)"
                            name="features"
                            value={form.features}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                        <button type="submit" className="btn btn-danger btn-sm" disabled={loading}>
                            <i className="fas fa-save me-2"></i>
                            {loading ? "Saving..." : "Save"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => navigate("/admin/online-services-packages")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout >
    );
};

export default AdminCreateOnlineServicePackages;