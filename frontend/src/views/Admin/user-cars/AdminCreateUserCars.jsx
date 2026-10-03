import React, { useState, useRef } from "react";
import AdminLayout from "../AdminLayout.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { validateForm } from "../../../utils/formValidation.js";
import { carCreateValidationRules } from "../../../utils/validationRules.js";

const AdminCreateUserCars = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({
        userId: "",
        brand: "",
        model: "",
        year: "",
        color: "",
        registrationNumber: "",
        vinNumber: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const createUserRef = {
        userId: useRef(),
        brand: useRef(),
        model: useRef(),
        year: useRef(),
        color: useRef(),
        registrationNumber: useRef(),
        vinNumber: useRef(),
    };
        
    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm({
            values: form,
            validationRules: carCreateValidationRules,
            inputRefs: createUserRef,
        });
        if (!isValid) return;

        try {
            const res = await axios.post("jobcard/admin/user-cars/create",{...form,year: Number(form.year)});
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/user-cars");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to create car");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.post("/user/admin/user-data");
            setUsers(res.data.data || []);
        } catch (error) {
            toast.error("Error fetching User Cars data");
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                    <h4 className="section-title m-0">
                        <span className="first-letter">C</span>
                        reate User Car
                    </h4>

                    <button type="button" className="btn btn-outline-danger d-flex align-items-center gap-2 px-3 py-2" onClick={() => navigate("/admin/user-cars")}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <form className="row g-3 bg-dark rounded text-white p-3 p-md-4 border border-secondary border-opacity-25" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label className="form-label">Customer *</label>
                        <select
                            value={form.userId}
                            onChange={(e) => setForm({ ...form, userId: e.target.value })}
                            className="form-control bg-dark text-white border-secondary"
                            ref={createUserRef.userId}
                        >
                            <option value="">Select Customer...</option>
                            {users.map(u => (
                                <option key={u._id} value={u._id}>
                                    {u.name} ({u.phone})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Brand *</label>
                        <input
                            type="text"
                            name="brand"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.brand}
                            onChange={handleChange}
                            placeholder="e.g. Toyota"
                            ref={createUserRef.brand}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Model *</label>
                        <input
                            type="text"
                            name="model"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.model}
                            onChange={handleChange}
                            placeholder="e.g. Corolla"
                            ref={createUserRef.model}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Year *</label>
                        <input
                            type="number"
                            name="year"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.year}
                            onChange={handleChange}
                            min={1900}
                            max={new Date().getFullYear() + 1}
                            placeholder="e.g. 2024"
                            ref={createUserRef.year}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Color</label>
                        <input
                            type="text"
                            name="color"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.color}
                            onChange={handleChange}
                            placeholder="e.g. Red"
                            ref={createUserRef.color}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Registration No *</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.registrationNumber}
                            onChange={(e) => setForm({ ...form, registrationNumber: e.target.value.toUpperCase() })}
                            placeholder="e.g. ABC-1234"
                            ref={createUserRef.registrationNumber}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">VIN Number</label>
                        <input
                            type="text"
                            name="vinNumber"
                            className="form-control bg-dark text-white border-secondary"
                            value={form.vinNumber}
                            onChange={handleChange}
                            placeholder="e.g. 1HGCM82633A004352"
                            ref={createUserRef.vinNumber}
                        />
                    </div>

                    <div className="col-12 d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-outline-secondary px-4 py-2" onClick={() => navigate('/admin/user-cars')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-danger px-4 py-2">
                            <i className="bi bi-plus-circle me-1"></i>
                            Create Car
                        </button>
                    </div>
                </form>
            </div >
        </AdminLayout >
    );
};

export default AdminCreateUserCars;
