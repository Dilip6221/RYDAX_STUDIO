import React, { useContext, useEffect, useState, useRef} from "react";
import AdminLayout from "../AdminLayout.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../../context/UserContext.jsx";
import { validateForm } from "../../../utils/formValidation.js";
import { userCreateValidationRules } from "../../../utils/validationRules.js";

const AdminUserList = () => {
    const { downloadCSV } = useContext(UserContext);

    const location = useLocation();
    const [user, setUser] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState(""); //For search functionality

    const [showCreateModal, setShowCreateModal] = useState(false);// For display user create model
    const [modalMode, setModalMode] = useState("CREATE"); /* Open model for create or edit scenario */

    const [newUser, setNewUser] = useState({//Create new user
        name: "",
        phone: "",
        role: "USER"
    });
    const createUserRef = {
        name: useRef(),
        phone: useRef(),
        role: useRef(),
    };

    /* For create new user aur staff */
    const handleCreateUser = async (e) => {
        e.preventDefault();
        const isValid = validateForm({
            values: newUser,
            validationRules: userCreateValidationRules,
            inputRefs: createUserRef
        });
        if (!isValid) return;

        try {
            if (modalMode === 'CREATE') {
                const payload = {
                    ...newUser,
                    isAdminCreate: true
                };
                const res = await axios.post("auth/complete-profile", payload);
                if (res.data.success) {
                    toast.success(res.data.message);
                    setShowCreateModal(false);
                    fetchData();
                    setNewUser({ name: "", phone: "", role: "USER" });
                } else {
                    toast.error(res.data.message);
                }
            } else {
                const res = await axios.post("user/admin/update-user-data", newUser)
                if (res.data.success) {
                    toast.success(res.data.message)
                    setShowCreateModal(false);
                    fetchData();
                } else {
                    toast.error(res.data.message);
                }
            }
        } catch (error) {
            toast.error("Creation failed.");
            console.error("Create user error: ", error);
        }
    };

    /* For Fetch all user and staff data */
    const fetchData = async () => {
        try {
            const res = await axios.post("user/admin/user-data");
            setUser(res.data.data);
        } catch (error) {
            console.error("Fetch user data error: ", error);
            toast.error("Error fetching Customer data");
        }
    };
    /* When sidebar click that time refresh data */
    useEffect(() => {
        fetchData();
        const handler = () => fetchData();
        window.addEventListener("ourTeamClick", handler);
        return () => window.removeEventListener("ourTeamClick", handler);
    }, []);
    /* Dashboard data view that time rediraction */
    useEffect(() => {
        if (location.state?.openTab) {
            setFilter(location.state.openTab);
        }
    }, [location.state]);

    /* For search and tabbing */
    const filteredData = user
        .filter((item) => {
            if (filter === "ALL") return true;
            if (filter === "STAFF") {
                return item.role === "STAFF" || item.role === "ADMIN";
            }
            return item.role === "USER";
        })
        .filter((item) => {
            if (!search.trim()) return true;
            const text = search.toLowerCase();
            return (
                item.name?.toLowerCase().includes(text) ||
                item.phone?.toLowerCase().includes(text) ||
                item.role?.toLowerCase().includes(text) ||
                item.status?.toLowerCase().includes(text)
            );
        });
    /* For update user and staff upadte status */
    const handleUserStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
            const res = await axios.post(
                "user/admin/update-status",
                { userId: id, status: newStatus }
            );
            if (res.data.success) {
                fetchData();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error("Status update failed");
            console.error("Status update error: ", error);
        }
    }

    return (
        <AdminLayout>
            <div className="container-fluid p-0 p-sm-2">
                {/* Top Filter & Create Bar */}
                <div className="bg-dark rounded p-3 mb-3 border border-secondary border-opacity-25">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <ul className="nav nav-pills text-danger m-0 flex-nowrap overflow-auto pb-1 pb-sm-0">
                            <li className="nav-item">
                                <button
                                    className={`text-danger nav-link px-3 py-2 ${filter === "USER" ? "active bg-danger text-white" : ""
                                        }`}
                                    onClick={() => {
                                        setFilter("USER");
                                        fetchData();
                                    }}
                                >
                                    <i className="bi bi-person me-1"></i> USER
                                </button>
                            </li>

                            <li className="nav-item">
                                <button
                                    className={`text-danger nav-link px-3 py-2 ${filter === "STAFF" ? "active bg-danger text-white" : ""
                                        }`}
                                    onClick={() => {
                                        setFilter("STAFF");
                                        fetchData();
                                    }}
                                >
                                    <i className="bi bi-person-gear me-1"></i> STAFF
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`text-danger nav-link px-3 py-2 ${filter === "ALL" ? "active bg-danger text-white" : ""
                                        }`}
                                    onClick={() => {
                                        setFilter("ALL");
                                        fetchData();
                                    }}
                                >
                                    <i className="bi bi-people me-1"></i> ALL
                                </button>
                            </li>
                        </ul>

                        {/* CREATE BUTTON */}
                        <button
                            className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 px-3 py-2 ms-auto ms-sm-0 w-sm-auto btn-sm"
                            onClick={() => {
                                setShowCreateModal(true);
                                setModalMode('CREATE');
                                setNewUser({ name: "", phone: "", role: "USER" });
                            }}
                        >
                            <i className="bi-plus-circle"></i>
                            <span>Create Member</span>
                        </button>
                    </div>
                </div>

                {/* Team List Table Card */}
                <div className="bg-dark rounded p-3 p-md-4 border border-secondary border-opacity-25">
                    <div className="border-bottom border-secondary border-opacity-50 pb-3 mb-3 d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3">
                        <h4 className="text-white m-0 d-flex align-items-center">
                            <i className="bi bi-person-badge-fill me-2 text-danger"></i>
                            Our Team List
                        </h4>

                        <div className="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0 justify-content-between justify-content-md-end">
                            <button
                                className="btn btn-outline-danger d-flex align-items-center justify-content-center flex-shrink-0"
                                onClick={() => downloadCSV("/user/admin/user-export", `${filter.toLowerCase()}-Team`, { filter })}
                                title="Export CSV"
                                style={{ width: "36px", height: "36px" }}
                            >
                                <i className="fa fa-download"></i>
                            </button>

                            <div className="input-group flex-grow-1" style={{ maxWidth: "340px", minWidth: "160px" }}>
                                <input
                                    type="search"
                                    className="form-control bg-dark text-white border-secondary"
                                    name="text"
                                    placeholder="Search name, phone, role..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive" style={{ maxHeight: "65vh", overflowY: "auto", overflowX: "auto" }}>
                        <table className="table table-dark table-hover table-bordered align-middle m-0" style={{ minWidth: "680px" }}>
                            <thead className="sticky-top">
                                <tr className="table-secondary text-dark">
                                    <th style={{ width: "50px" }}>#</th>
                                    <th>Full Name</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="text-center" style={{ width: "120px" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item._id}>
                                            <td className="text-muted">{index + 1}</td>
                                            <td className="fw-medium text-white">{item.name}</td>
                                            <td>{item.phone}</td>
                                            <td>
                                                {item.role === "STAFF" && (
                                                    <span className="badge bg-warning text-dark px-2 py-1">
                                                        STAFF
                                                    </span>
                                                )}

                                                {item.role === "USER" && (
                                                    <span className="badge bg-success px-2 py-1">
                                                        USER
                                                    </span>
                                                )}

                                                {item.role === "ADMIN" && (
                                                    <span className="badge bg-danger px-2 py-1">
                                                        ADMIN
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge px-2 py-1 ${item.status === "ACTIVE"
                                                        ? "bg-success"
                                                        : "bg-danger"
                                                        }`}
                                                    style={{ cursor: item.role === "ADMIN" ? "default" : "pointer" }}
                                                    title={item.role === "ADMIN" ? "Admin status cannot be changed" : "Click to toggle status"}
                                                    onClick={() => {
                                                        if (item.role !== "ADMIN") {
                                                            handleUserStatus(item._id, item.status);
                                                        }
                                                    }}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="text-center text-nowrap">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-info me-2 p-1 px-2"
                                                    title="View Member"
                                                    aria-label="View member"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
                                                {item.role !== "ADMIN" && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-warning p-1 px-2"
                                                        title="Edit Member"
                                                        aria-label="Edit member"
                                                        onClick={() => {
                                                            setShowCreateModal(true);
                                                            setModalMode('EDIT');
                                                            setNewUser({ name: item.name, phone: item.phone, role: item.role, _id: item._id });
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-white py-4">No Members Found...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.75)" }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: "500px", margin: "1rem auto" }}>
                        <div className="modal-content bg-dark text-white border-secondary shadow-lg">
                            <div className="modal-header border-secondary py-3">
                                <h5 className="modal-title d-flex align-items-center">
                                    <i className={`bi ${modalMode === 'CREATE' ? 'bi-person-plus text-danger' : 'bi-pencil-square text-warning'} me-2 fs-5`}></i>
                                    {modalMode === 'CREATE' ? 'Create Team Member' : 'Edit Member'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowCreateModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>

                            {/* Body */}
                            <div className="modal-body py-3">
                                <div className="mb-3">
                                    <label className="form-label text-light small mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control bg-dark text-white border-secondary"
                                        placeholder="Full name"
                                        value={newUser.name}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, name: e.target.value })
                                        }
                                        ref={createUserRef.name}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-light small mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control bg-dark text-white border-secondary"
                                        placeholder="e.g. +91 9876543210"
                                        value={newUser.phone}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, phone: e.target.value })
                                        }
                                        ref={createUserRef.phone}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-light small mb-1">Role</label>
                                    <div className="position-relative">
                                        <select
                                            className="form-control bg-dark text-white border-secondary pe-5"
                                            value={newUser.role}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, role: e.target.value })
                                            }
                                            ref={createUserRef.role}
                                        >
                                            <option value="USER">USER (Customer)</option>
                                            <option value="STAFF">STAFF (Technician/Staff)</option>
                                        </select>
                                        <span className="position-absolute end-0 top-50 translate-middle-y pe-3 text-white-50" style={{ pointerEvents: 'none' }}>
                                            <i className="bi bi-chevron-down"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="modal-footer border-secondary py-2 d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-3 py-2"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger px-4 py-2"
                                    onClick={handleCreateUser}
                                >
                                    {modalMode === "CREATE" ? "Save Member" : "Update Member"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default AdminUserList;
