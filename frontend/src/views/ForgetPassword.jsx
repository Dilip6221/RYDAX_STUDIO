import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import loginLogo from "../assets/images/brand.png";

const ForgetPassword = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleForgetPassword = async (e) => {
    e.preventDefault();

    if (!password || !rePassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/user/forget-password/${token}`,
        { newPassword: password }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <section
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "radial-gradient(circle at top, #111 0%, #000 60%)",
        padding: "20px",
      }}
    >
      <div
        className="container p-0 overflow-hidden"
        style={{
          maxWidth: "900px",
          borderRadius: "14px",
          border: "1px solid rgba(255, 0, 0, 0.17)",
        }}
      >
        <div className="row g-0">
          <div
            className="col-md-6 d-flex flex-column justify-content-center align-items-center text-center p-4"
            style={{
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <img
              src={loginLogo}
              alt="Brand Logo"
              className="img-fluid mb-4"
              style={{ maxWidth: "180px" }}
            />
            <div
              className="px-4 py-3 fw-semibold"
              style={{
                color: "#eee",
                fontSize: "13px",
                borderRadius: "10px",
                background: "rgba(255,0,0,0.08)",
                border: "1px solid rgba(255,0,0,0.3)",
                lineHeight: "1.6",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <i className="bi bi-wrench-adjustable me-2 text-danger"></i>
              At <span style={{ color: "#ff3b3b", fontSize: "15px" }}>RYDAX</span>,
              We Don’t Just Fix Cars – We Build Trust
            </div>
          </div>
          <div className="col-md-6 p-4 p-md-5">
            <h4 className="text-white text-center mb-4 fw-semibold">
              Reset Your Password
            </h4>

            <form onSubmit={handleForgetPassword}>
              {/* PASSWORD */}
              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control text-white py-2"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-light`}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    opacity: 0.7,
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-4 position-relative">
                <input
                  type={showRePassword ? "text" : "password"}
                  className="form-control text-white py-2"
                  placeholder="Confirm Password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
                <i
                  className={`bi ${showRePassword ? "bi-eye-slash" : "bi-eye"} text-light`}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    opacity: 0.7,
                  }}
                  onClick={() => setShowRePassword(!showRePassword)}
                ></i>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-100 py-2 fw-semibold"
                style={{
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #ff3b3b, #b40000)",
                  border: "none",
                  color: "#fff",
                  boxShadow: "0 8px 25px rgba(255,0,0,0.35)",
                }}
              >
                Reset Password
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>

  );
};

export default ForgetPassword;
