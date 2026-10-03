"use client";

import React, { useState } from "react";
import Link from "next/link";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import loginLogo from "../assets/images/rydax.png";

const getImageSrc = (img) => (img && typeof img === "object" && img.src ? img.src : img);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/subscribe", { email });
      if (res.data?.success) {
        toast.success(res.data.message || "Subscribed to RYDAX Gazette!");
        setEmail("");
      } else {
        toast.error(res.data?.message || "Subscription failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="rydax-footer bg-black border-t border-white/10 text-white/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src={getImageSrc(loginLogo)}
                alt="RYDAX Studio"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed">
              India&apos;s premier automotive aesthetics & armor atelier. Specializing in self-healing TPU PPF, permanent 10H ceramic matrices, and surgical paint depth restoration.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com/@dilipahir6221"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-red-500 hover:border-red-500/50 transition-colors"
                aria-label="YouTube"
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-pink-500 hover:border-pink-500/50 transition-colors"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://wa.me/919313015917"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                aria-label="WhatsApp"
              >
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-4 font-mono">
              Atelier Directory
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#ff3b30] transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <a href="#services-section" className="hover:text-[#ff3b30] transition-colors">
                  Services Menu
                </a>
              </li>
              <li>
                <a href="#why-choose-us" className="hover:text-[#ff3b30] transition-colors">
                  Clean-Room Standards
                </a>
              </li>
              <li>
                <a href="#gallery-transformations" className="hover:text-[#ff3b30] transition-colors">
                  Before & After Transformations
                </a>
              </li>
              <li>
                <a href="#client-testimonials" className="hover:text-[#ff3b30] transition-colors">
                  Verified Client Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Featured Treatments */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-4 font-mono">
              Protective Treatments
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <i className="bi bi-shield-shaded text-[#ff3b30] text-xs"></i>
                <span>Self-Healing TPU Film (PPF)</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-droplet-half text-[#ff3b30] text-xs"></i>
                <span>10H Aerospace Ceramic Matrix</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-stars text-[#ff3b30] text-xs"></i>
                <span>Micro-Depth Paint Correction</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-gem text-[#ff3b30] text-xs"></i>
                <span>Bespoke Interior Leather Atelier</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-patch-check text-[#ff3b30] text-xs"></i>
                <span>10-Year Digital Studio Provenance</span>
              </li>
            </ul>
          </div>

          {/* Studio Gazette */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-4 font-mono">
              Studio Dispatch
            </h4>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Subscribe for exclusive supercar showcase reveals, private clinic invites, and detailing technology dispatches.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter private email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff3b30] transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#ff3b30] to-[#b71c1c] text-white text-xs uppercase tracking-wider font-bold py-2.5 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(255,59,48,0.4)] transition-all"
              >
                {loading ? "Joining Dispatch..." : "Join VIP Dispatch"}
              </button>
            </form>
          </div>
        </div>

        {/* Studio Disclaimer & Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} RYDAX Automotive Atelier. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>ISO Clean Bay 22°C</span>
            <span>&bull;</span>
            <span>Ahmedabad, Gujarat</span>
            <span>&bull;</span>
            <span className="font-mono text-neutral-400">Laravel 11 & Next.js 15+</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
