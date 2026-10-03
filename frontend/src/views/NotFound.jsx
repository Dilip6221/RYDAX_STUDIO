import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-page">
            <div className="road-line"></div>
            <div className="notfound-content">
                <div className="car-animation">
                    <i className="bi bi-car-front-fill"></i>
                </div>
                <h1 className="error-code">
                    404
                </h1>
                <h2 className="error-title">
                    Oops! This Road Doesn't Exist
                </h2>
                <p className="error-text">
                    Looks like your journey took a wrong turn.
                    <br />
                    Let's get you back to the RYDAX garage.
                </p>
                <div className="notfound-actions">
                    <button
                        className="back-btn-404"
                        onClick={() => navigate("/")}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}