"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "../../../utils/api";
import { UserContext } from "../../../context/UserContext";
import toast from "react-hot-toast";
import loginLogo from "../../../assets/images/rydax.png";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, saveTokenAndUser, authLoading } = useContext(UserContext);

  const [step, setStep] = useState("PHONE");
  const [phone, setPhone] = useState("9313015917");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [debugOtp, setDebugOtp] = useState("");

  useEffect(() => {
    if (!authLoading && user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("auth/send-otp", { phone });
      if (res.data?.success) {
        toast.success(res.data.message || "Admin verification OTP dispatched");
        if (res.data.debug_otp) {
          setDebugOtp(res.data.debug_otp);
          // Autofill OTP in dev/local mode
          const digits = String(res.data.debug_otp).split("");
          if (digits.length === 6) setOtp(digits);
        }
        setStep("OTP");
      } else {
        toast.error(res.data?.message || "Failed to dispatch OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("auth/verify-otp", {
        phone,
        otp: finalOtp,
      });

      if (res.data?.success) {
        const loggedUser = res.data.user;
        if (loggedUser?.role !== "ADMIN") {
          toast.error("Access Denied: This account does not possess administrator privileges.");
          return;
        }

        toast.success("Administrator Authenticated Successfully");
        saveTokenAndUser(res.data.token, loggedUser);
        router.replace("/admin/dashboard");
      } else {
        toast.error(res.data?.message || "Invalid OTP code");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-950 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-[#ff3b30] to-transparent"></div>

        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src={loginLogo} alt="RYDAX" width={130} height={42} className="h-9 w-auto mx-auto object-contain" />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-2">
            <i className="bi bi-shield-lock-fill"></i>
            <span>ADMIN OPERATIONS AUTH</span>
          </div>
          <h1 className="text-xl font-bold text-white">Administrator Access</h1>
          <p className="text-xs text-white/50 mt-1">
            Sign in with registered admin phone number
          </p>
        </div>

        {step === "PHONE" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/60 mb-2 font-semibold">
                Admin Mobile Number
              </label>
              <div className="flex items-center bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus-within:border-red-500 transition-colors">
                <span className="text-white/60 font-mono text-sm me-2">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Enter 10-digit phone"
                  className="bg-transparent border-0 text-white font-mono text-sm w-full outline-none"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-white/40 mt-1.5">
                Default Master Admin: <code className="text-red-400">9313015917</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#b71c1c] text-white font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Dispatching OTP...</span>
                </>
              ) : (
                <>
                  <span>Request Admin OTP</span>
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                  Enter 6-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep("PHONE")}
                  className="text-xs text-red-400 hover:underline"
                >
                  Change Phone
                </button>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`admin-otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const next = [...otp];
                      next[i] = val.slice(0, 1);
                      setOtp(next);
                      if (val && i < 5) {
                        document.getElementById(`admin-otp-${i + 1}`)?.focus();
                      }
                      if (next.every((d) => d !== "")) {
                        setTimeout(() => handleVerifyOtp(), 100);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        document.getElementById(`admin-otp-${i - 1}`)?.focus();
                      }
                    }}
                    className="w-12 h-12 text-center text-lg font-bold bg-neutral-900 border border-white/10 rounded-xl text-white outline-none focus:border-red-500 transition-colors"
                  />
                ))}
              </div>

              {debugOtp && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-mono">
                  🔑 Local Test OTP: <strong>{debugOtp}</strong>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff3b30] to-[#b71c1c] text-white font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Verify & Enter Console</span>
                  <i className="bi bi-shield-check"></i>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-white/40 hover:text-white transition-colors">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
