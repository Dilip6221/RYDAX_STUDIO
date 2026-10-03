import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminUserCars = () => {
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        try {
            const res = await axios.post("jobcard/admin/user-cars");
            setCars(res.data.data || []);
        } catch (error) {
            toast.error("Error fetching User Cars data");
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = cars.filter((item) =>
        item.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
        item.brand?.toLowerCase().includes(search.toLowerCase()) ||
        item.model?.toLowerCase().includes(search.toLowerCase()) ||
        item.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.userId?.phone?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                <div className="bg-dark rounded p-3 p-md-4 border border-secondary border-opacity-25">

                    {/* Responsive Header Bar */}
                    <div className="border-bottom border-secondary border-opacity-50 pb-3 mb-3 d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
                        <h4 className="text-white m-0 d-flex align-items-center">
                            <i className="bi bi-car-front me-2 text-danger"></i>
                            User Cars Management
                            <span className="badge bg-secondary ms-2 fs-6">{filteredData.length}</span>
                        </h4>

                        <div className="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0 justify-content-between justify-content-md-end">
                            <div className="input-group flex-grow-1" style={{ maxWidth: "340px", minWidth: "160px" }}>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-secondary"
                                    placeholder="Search reg no, brand, user..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Link to="/admin/user-cars/create" className="text-decoration-none flex-shrink-0">
                                <button className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 px-3 py-2">
                                    <i className="bi bi-plus-circle"></i>
                                    <span>Add Car</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Touch-Scrollable Table */}
                    <div className="table-responsive" style={{ maxHeight: "65vh", overflowY: "auto", overflowX: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle m-0" style={{ minWidth: "720px" }}>
                            <thead className="sticky-top">
                                <tr className="table-secondary text-dark">
                                    <th style={{ width: "50px" }}>#</th>
                                    <th>Customer Name</th>
                                    <th>Phone</th>
                                    <th>Brand & Model</th>
                                    <th style={{ width: "80px" }}>Year</th>
                                    <th>Registration No</th>
                                    <th>VIN Number</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item._id}>
                                            <td className="text-muted">{index + 1}</td>
                                            <td className="fw-medium text-white">{item.userId?.name || "-"}</td>
                                            <td>
                                                {item.userId?.phone || "-"}
                                            </td>
                                            <td>
                                                <strong className="text-white">{item.brand}</strong> {item.model}
                                                {item.color && (
                                                    <small className="text-muted d-block">Color: {item.color}</small>
                                                )}
                                            </td>
                                            <td className="text-center">{item.year || "-"}</td>
                                            <td>
                                                <span className="badge bg-dark border border-secondary text-warning fw-semibold px-2 py-1">
                                                    {item.registrationNumber}
                                                </span>
                                            </td>
                                            <td className="text-muted small">{item.vinNumber || "-"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-white py-4">
                                            No User Cars Found...
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

export default AdminUserCars;
