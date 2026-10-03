import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/profile.css";
import { validateForm } from "../utils/formValidation.js";

const Profile = () => {
    const { user,token, fetchUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [carsLoading, setCarsLoading] = useState(true);
    const [userCars, setUserCars] = useState([]);

    const [formData, setFormData] = useState({
        name: user?.name || "",
    });

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }
        setFormData({
            name: user.name || "",
        });
        fetchUserCars();
    }, [user?.id || user?._id]);

    const fetchUserCars = async () => {
        try {
            setCarsLoading(true);
            const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
            const headers = activeToken ? { Authorization: `Bearer ${activeToken}` } : {};
            const res = await axios.get("jobcard/customer/my-cars", { headers });
            if (res.data.success) {
                setUserCars(res.data.data || []);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load your cars");
        } finally {
            setCarsLoading(false);
        }
    };
    const getCarBrand = (car) =>
        car.brand || car.carModel?.company?.name || "RYDAX";

    const getCarModel = (car) =>
        car.model || car.carModel?.model || "Garage Car";

    const getCarReg = (car) =>
        car.registrationNumber || car.registration || "N/A";

    const getInitials = () => {
        if (!user?.name) return "RY";
        const parts = user.name.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "RY";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const inputRefs = {
        name: useRef(),
    };
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("/user/admin/update-user-data", {
                _id: user._id,
                name: formData.name,
                phone: user.phone,
                role: user.role,
            });
            if (res.data.success) {
                toast.success("Profile updated successfully");
                await fetchUser();
                setIsEditing(false);
            }else {
                toast.error(res.data.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setFormData({
            name: user.name || "",
        });
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-main-card">
                <div className="profile-cover-area">
                    <div className="cover-overlay"></div>
                </div>

                <div className="profile-info-area">
                    <div className="profile-summary-card">
                        <div className="profile-summary-left">
                            <div className="profile-avatar-box">{getInitials()}</div>
                            <div>
                                <h2>{user.name}</h2>
                                <p>{user.phone}</p>
                               
                            </div>
                        </div>
                      
                    </div>
                    <div className="profile-user-head">
                        <div>
                            <h1>Account Details</h1>
                        </div>
                        <button
                            className={`profile-edit-btn ${isEditing ? "cancel" : ""}`}
                            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                        >
                            <i className={`bi ${isEditing ? "bi-x-lg" : "bi-pencil-square"}`}></i>
                        </button>
                    </div>
                    <div className="row g-3 profile-form-grid">
                        <div className="col-md-4">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control service-input mt-2 shadow-none"
                                placeholder="Full Name*"
                                disabled={!isEditing}
                                value={formData.name}
                                onChange={handleInputChange}
                                ref={inputRefs.name}
                            />
                        </div>
                        <div className="col-md-4">
                            <label>Phone Number</label>
                            <input type="text" disabled className="form-control service-input mt-2 shadow-none" value={user.phone || "Not Provided"} />
                        </div>
                    </div>
                    {isEditing && (
                        <div className="profile-save-row">
                            <button
                                className="profile-save-btn"
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-dashboard">
                <div className="profile-section-card">
                    <div className="profile-section-head ">
                        <h2 className="mb-2">
                            <i className="bi bi-car-front-fill"></i>
                            My Car Vault
                        </h2>
                     
                    </div>

                    {carsLoading ? (
                        <div className="profile-empty">
                            <div className="profile-loader"></div>
                            <p>Loading your garage...</p>
                        </div>
                    ) : userCars.length > 0 ? (
                        <div className="profile-cars-grid">
                            {userCars.slice(0, 3).map((car) => (
                                <div className="profile-car-card" key={car._id}>
                                    <div className="car-card-top">
                                        <span>{car.year || "RYDAX"}</span>
                                        <i className="bi bi-car-front-fill"></i>
                                    </div>
                                    <h3>
                                        {getCarBrand(car)} {getCarModel(car)}
                                    </h3>
                                    <p>{getCarReg(car)}</p>
                                    <button onClick={() => navigate(`/my-car-vault/${car._id}/job-card`)}>
                                        View Details
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="profile-empty">
                            <i className="bi bi-car-front-fill"></i>
                            <h3>Your garage is empty</h3>
                            <p>Add your first car and start your RYDAX journey.</p>
                            <button onClick={() => navigate("/my-car-vault")}>
                                Add Car
                            </button>
                        </div>
                    )}
                </div>

                <div className="profile-section-card">
                    <div className="profile-section-head">
                        <h2>
                            <i className="bi bi-speedometer2"></i>
                            Account Overview
                        </h2>
                    </div>

                    <div className="profile-stats-grid">
                        <div className="profile-stat-card">
                            <i className="bi bi-car-front"></i>
                            <div>
                                <h3>{userCars.length}</h3>
                                <p>Total Cars</p>
                            </div>
                        </div>

                        <div className="profile-stat-card">
                            <i className="bi bi-person-check"></i>
                            <div>
                                <h3>Active</h3>
                                <p>Account Status</p>
                            </div>
                        </div>

                        <div className="profile-stat-card">
                            <i className="bi bi-award"></i>
                            <div>
                                <h3>{user.role || "USER"}</h3>
                                <p>Account Type</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;