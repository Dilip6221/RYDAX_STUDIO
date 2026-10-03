"use client";

import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import letsStartLogo from "../assets/images/loginimage.webp";
import { UserContext } from "../context/UserContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { validateForm } from "../utils/formValidation";
import { otpValidationRules, completeProfileValidationRules } from "../utils/validationRules";

const LoginDrawer = forwardRef((props, ref) => {
  const {
    fetchUser,
    saveTokenAndUser,
    loginDrawerOpen: contextOpen,
    closeLoginDrawer: contextClose,
  } = useContext(UserContext);

  const intervalRef = useRef(null);
  const otpRefs = useRef([]);

  const mobileInputRefs = {
    mobile: useRef(null),
  };

  const completeProfileInputRefs = {
    name: useRef(null),
  };

  const [internalOpen, setInternalOpen] = useState(false);
  const isDrawerOpen = contextOpen || internalOpen;

  const [loginStep, setLoginStep] = useState("PHONE");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [name, setName] = useState("");
  const [profileToken, setProfileToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const openLoginDrawer = () => {
    setLoginStep("PHONE");
    setMobile("");
    setOtp(Array(6).fill(""));
    setName("");
    setInternalOpen(true);

    setTimeout(() => {
      mobileInputRefs.mobile.current?.focus();
    }, 300);
  };

  const closeLoginDrawer = () => {
    setInternalOpen(false);
    if (contextClose) contextClose();
    setLoginStep("PHONE");
    setMobile("");
    setOtp(Array(6).fill(""));
    setName("");
  };

  useImperativeHandle(ref, () => ({
    open: openLoginDrawer,
    close: closeLoginDrawer,
  }));

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add("menu-lock");
      document.documentElement.classList.add("menu-lock");
      setTimeout(() => {
        mobileInputRefs.mobile.current?.focus();
      }, 300);
    } else {
      document.body.classList.remove("menu-lock");
      document.documentElement.classList.remove("menu-lock");
    }

    return () => {
      document.body.classList.remove("menu-lock");
      document.documentElement.classList.remove("menu-lock");
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (loginStep === "OTP") {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [loginStep]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    const isValid = validateForm({
      values: { mobile },
      validationRules: otpValidationRules,
      inputRefs: mobileInputRefs,
    });

    if (!isValid) return;

    try {
      setLoading(true);

      const res = await api.post("auth/send-otp", {
        phone: mobile,
      });

      if (res.data.success) {
        toast.success(res.data.message || "OTP sent successfully!");
        setLoginStep("OTP");
        startTimer();
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpValue) => {
    try {
      setLoading(true);
      const finalOtp = otpValue || otp.join("");

      const res = await api.post("auth/verify-otp", {
        phone: mobile,
        otp: finalOtp,
      });

      if (res.data.success) {
        if (res.data.isNewUser) {
          setProfileToken(res.data.profileToken || "");
          setLoginStep("PROFILE");
          setName("");
        } else {
          toast.success("Login successful!");
          if (res.data.token && res.data.user) {
            saveTokenAndUser(res.data.token, res.data.user);
          } else {
            await fetchUser();
          }
          closeLoginDrawer();
        }
      } else {
        toast.error(res.data.message || "OTP verification failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendCount >= 3) {
      toast.error("Maximum resend limit reached");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("auth/send-otp", {
        phone: mobile,
      });

      if (res.data.success) {
        toast.success("OTP resent successfully!");
        setResendCount((prev) => prev + 1);
        setOtp(Array(6).fill(""));
        startTimer();
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error("Error resending OTP");
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async () => {
    const isValid = validateForm({
      values: { name },
      validationRules: completeProfileValidationRules,
      inputRefs: completeProfileInputRefs,
    });

    if (!isValid) return;

    try {
      setLoading(true);
      const res = await api.post("auth/complete-profile", {
        phone: mobile,
        name,
        profileToken,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Profile completed!");
        if (res.data.token && res.data.user) {
          saveTokenAndUser(res.data.token, res.data.user);
        } else {
          await fetchUser();
        }
        closeLoginDrawer();
      } else {
        toast.error(res.data.message || "Failed to complete profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error completing profile");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pasteData.length === 6) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
      verifyOtp(pasteData);
    }
  };

  const handleSubmitByStep = () => {
    if (loading) return;
    if (loginStep === "PHONE") sendOtp();
    if (loginStep === "OTP") verifyOtp();
    if (loginStep === "PROFILE") completeProfile();
  };

  const handleDrawerKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitByStep();
    }
    if (e.key === "Escape") {
      closeLoginDrawer();
    }
  };

  return (
    <>
      {isDrawerOpen && (
        <div className="login-overlay" onClick={closeLoginDrawer}></div>
      )}

      <div
        className={`login-drawer ${isDrawerOpen ? "open" : ""}`}
        onKeyDown={handleDrawerKeyDown}
        tabIndex={-1}
      >
        <div className="drawer-content">
          <button className="close-btn" onClick={closeLoginDrawer} type="button">
            ✕
          </button>

          <Image src={letsStartLogo} alt="Logo" className="login-image" width={80} height={80} />
          <h4 className="login-title">Let’s get started</h4>

          {loginStep === "PHONE" && (
            <>
              <div className="mobile-input-wrapper">
                <span>+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  ref={mobileInputRefs.mobile}
                />
              </div>

              <button
                className="garage-btn"
                onClick={sendOtp}
                disabled={loading}
                type="button"
              >
                {loading ? "Sending..." : "CONTINUE"}
              </button>
            </>
          )}

          {loginStep === "OTP" && (
            <>
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    className="otp-box"
                    value={digit}
                    ref={(el) => (otpRefs.current[index] = el)}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>

              <button
                className="garage-btn"
                onClick={() => verifyOtp()}
                disabled={loading}
                type="button"
              >
                {loading ? "Verifying..." : "VERIFY OTP"}
              </button>

              <div style={{ textAlign: "center", marginTop: "10px" }}>
                {!canResend ? (
                  <p style={{ color: "#aaa", fontSize: "13px" }}>Resend OTP in {timer}s</p>
                ) : resendCount < 3 ? (
                  <button
                    onClick={resendOtp}
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff5107",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p style={{ color: "red", fontSize: "13px" }}>Max resend limit reached</p>
                )}
              </div>
            </>
          )}

          {loginStep === "PROFILE" && (
            <>
              <input
                type="text"
                className="form-control service-input shadow-none mb-3"
                placeholder="Enter Name*"
                value={name}
                autoFocus={true}
                onChange={(e) => setName(e.target.value)}
                ref={completeProfileInputRefs.name}
              />

              <button
                className="garage-btn"
                onClick={completeProfile}
                disabled={loading}
                type="button"
              >
                {loading ? "Saving..." : "COMPLETE PROFILE"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
});

LoginDrawer.displayName = "LoginDrawer";

export default LoginDrawer;
