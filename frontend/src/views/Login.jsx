import React, { useState, useContext, useEffect } from "react";
const videoFile = "/assets/vidoes/animation.mp4";
import loginLogo from "../assets/images/brand.png";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const { login, register } = useContext(UserContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgetModal, setShowForgetModal] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const autoLogin = async () => {
      if (!isRegister && email && password.length >= 3) {
        const res = await login(email, password);
        if (res.success) {
          toast.success(res.message);
          setEmail("");
          setPassword("");
          navigate("/");
        }
      }
    };
    autoLogin();
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register(name, email, password, number);
        if (!res.success) {
            if (res.isregistered) {
              toast.error(res.message);
              setIsRegister(false);
              setEmail(email);
              setPassword("");
              setName("");
              setNumber("");
              return;
            }
            toast.error(res.message);
        } else {
          toast.success(res.message);
          setIsRegister(false);
          setName('');
          setEmail('');
          setPassword('');
          setNumber('');
          navigate("/login");
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          setEmail('');
          setPassword('');
          navigate("/");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleForgetPassword = async (e) => {
    e.preventDefault();
    if (!forgetEmail) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const res = await axios.post(`${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")}/user/forget-pass`, { email: forgetEmail });
      if (res.data.success) {
        toast.success(res.data.message);
        setShowForgetModal(false);
        setForgetEmail("");
        navigate("/login");
      } else toast.error(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {/* MAIN LOGIN SECTION */}
      <section
        className="min-vh-100 d-flex align-items-center justify-content-center position-relative text-center"
        style={{
          backgroundColor: "black",
          overflow: "hidden",
          filter: showForgetModal ? "brightness(0.1)" : "brightness(1)",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: "cover", zIndex: 0, opacity: 0.5 }}
        >
          <source src={videoFile} type="video/mp4" />
        </video>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.7)", zIndex: 1 }}
        ></div>

        <div
          className="p-4 p-md-5 rounded shadow-lg mx-3 mx-sm-4"
          style={{
            zIndex: 2,
            width: "100%",
            maxWidth: "400px",
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
          }}
        >
          <img
            src={loginLogo}
            alt="Logo"
            className="img-fluid mb-4"
            style={{ maxWidth: "180px" }}
          />

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-3">
                <input type="text" className="form-control bg-transparent text-white border-white" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name"/>
              </div>
            )}

            <div className="mb-3">
              <input type="email" className="form-control bg-transparent text-white border-light" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            {isRegister && (
              <div className="mb-3">
                <input type="number" className="form-control bg-transparent text-white border-white" placeholder="Phone Number" value={number} onChange={(e) => setNumber(e.target.value)} />
              </div>
            )}

            <div className="mb-3 position-relative">
              <input type={showPassword ? "text" : "password"} className="form-control bg-transparent text-white border-white" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-light`}
                style={{position: "absolute",right: "15px",top: "50%",transform: "translateY(-50%)",cursor: "pointer"}}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <button type="submit" className="user-profile w-100" disabled={loading}>
              <div className="user-profile-inner d-flex align-items-center justify-content-center gap-2">
                {loading && (
                  <span className="spinner-border spinner-border-sm text-light" role="status" aria-hidden="true"></span>
                )}
                {loading
                  ? (isRegister ? "Registering..." : "Logging In...")
                  : (isRegister ? "Register" : "Login")}
              </div>
            </button>

            {!isRegister && (
              <span onClick={() => setShowForgetModal(true)} className="text-white-50 small d-block mb-2" style={{ cursor: "pointer" }}>
                Forgot password?
              </span>
            )}

            <div className="text-center mt-3">
              <p className="mb-0 text-white-50">
                {isRegister
                  ? "Already have an account?"
                  : "Don’t have an account?"}{" "}
                <span
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setEmail("");
                    setPassword("");
                    setName("");
                    setNumber("");
                  }}
                  style={{ cursor: "pointer" }}
                  className="text-white fw-bold"
                >
                  {isRegister ? "Login" : "Register"}
                </span>
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* FORGET PASSWORD MODAL */}
      {showForgetModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            zIndex: 9999,
            overflow: "hidden",
            padding: "15px",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ objectFit: "cover", opacity: 0.5, zIndex: 1 }}
          >
            <source src={videoFile} type="video/mp4" />
          </video>

          {/* DARK OVERLAY */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0,0,0,0.75)", zIndex: 2 }}
          ></div>

          {/* RESPONSIVE MODAL BOX */}
          <div
            className="rounded shadow-lg position-relative text-center"
            style={{ zIndex: 3, width: "100%", maxWidth: "420px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", padding: "25px"}}
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => {
                setShowForgetModal(false);
                setForgetEmail("");
                setEmail("");
                setPassword("");
              }}
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              aria-label="Close"
              style={{ filter: "invert(1)", zIndex: 10 }}
            ></button>

            {/* TITLE */}
            <h4 className="text-white mb-3" style={{ fontSize: "1.4rem" }}>
              Forgot Password?
            </h4>

            <p className="text-light small mb-3" style={{ fontSize: "0.9rem" }}>
              Enter your email & we’ll send you a reset link.
            </p>

            {/* FORM */}
            <form onSubmit={handleForgetPassword}>
              <input
                type="email"
                className="form-control mb-3 bg-transparent text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "10px 12px",
                  fontSize: "0.95rem",
                }}
                placeholder="Enter your email"
                value={forgetEmail}
                onChange={(e) => setForgetEmail(e.target.value)}
              />

              <button type="submit" className="user-profile w-100 ">
                <div className="user-profile-inner">
                  Send Reset Link
                </div>
              </button>
            </form>
          </div>
        </div>
      )}


    </>
  );
};

export default Login;
