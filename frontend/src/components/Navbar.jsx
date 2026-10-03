"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import loginLogo from "../assets/images/rydax.png";
import { UserContext } from "../context/UserContext";

const getImageSrc = (img) => (img && typeof img === "object" && img.src ? img.src : img);

const Navbar = () => {
  const pathname = usePathname();
  const { user, logout, openLoginDrawer } = useContext(UserContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about-us" },
    { label: "Blog", href: "/blog" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact", href: "/contact-us" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3"
          : "bg-gradient-to-b from-black/90 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src={getImageSrc(loginLogo)}
              alt="RYDAX Studio"
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs xl:text-sm uppercase tracking-wider font-medium transition-colors ${
                    isActive
                      ? "text-[#ff3b30] font-bold"
                      : "text-white/80 hover:text-[#ff3b30]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3 xl:gap-4">
            <a
              href="tel:+919313015917"
              className="hidden xl:flex items-center gap-2 text-xs text-white/90 hover:text-[#ff3b30] px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <i className="bi bi-telephone-fill text-[#ff3b30]"></i>
              <span className="font-semibold tracking-wider font-mono">+91 93130 15917</span>
            </a>

            {/* User Auth Cluster */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all text-xs font-semibold"
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff3b30] to-[#b71c1c] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </span>
                  <span className="max-w-[100px] truncate">{user.name || "Customer"}</span>
                  <i className={`bi bi-chevron-${userDropdownOpen ? "up" : "down"} text-[10px]`}></i>
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl z-50 py-2 divide-y divide-white/5 animate-fadeIn">
                      <div className="px-4 py-2">
                        <p className="text-xs text-white/50">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user.name || user.phone}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/customer/my-cars"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5"
                        >
                          <i className="bi bi-car-front text-[#ff3b30]"></i>
                          My Car Vault
                        </Link>

                        <Link
                          href="/customer/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5"
                        >
                          <i className="bi bi-person-badge"></i>
                          VIP Profile
                        </Link>

                        {user.role === "ADMIN" && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs text-amber-400 hover:bg-amber-400/10"
                          >
                            <i className="bi bi-speedometer2"></i>
                            Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          <i className="bi bi-box-arrow-right"></i>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginDrawer}
                className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-white/90 hover:text-white px-3 py-2 rounded-lg border border-white/15 hover:border-white/30 transition-all bg-white/5"
              >
                <i className="bi bi-person-fill text-[#ff3b30]"></i>
                <span>Vault Login</span>
              </button>
            )}

            <Link
              href="/contact-us"
              className="relative inline-flex items-center justify-center px-4 py-2 text-xs uppercase font-bold tracking-widest text-white transition-all bg-gradient-to-r from-[#ff3b30] to-[#b71c1c] rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(255,59,48,0.5)] hover:scale-105 active:scale-95"
            >
              <span>Reserve Bay</span>
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {!user ? (
              <button
                type="button"
                onClick={openLoginDrawer}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white text-xs font-semibold border border-white/10"
              >
                Login
              </button>
            ) : (
              <Link
                href="/customer/my-cars"
                className="px-2.5 py-1.5 rounded-lg bg-[#ff3b30]/20 text-[#ff3b30] text-xs font-semibold border border-[#ff3b30]/30"
              >
                Vault
              </Link>
            )}

            <a
              href="https://wa.me/919313015917"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-base"
              aria-label="WhatsApp"
            >
              <i className="bi bi-whatsapp"></i>
            </a>

            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white flex items-center justify-center text-lg hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              <i className={`bi ${isMobileOpen ? "bi-x-lg" : "bi-list"}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="lg:hidden bg-neutral-950/98 border-b border-white/10 px-5 pt-4 pb-6 space-y-3 shadow-2xl backdrop-blur-2xl">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`block text-sm font-medium py-2 border-b border-white/5 ${
                pathname === item.href
                  ? "text-[#ff3b30] font-bold"
                  : "text-white/80 hover:text-[#ff3b30]"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {user && (
            <>
              <Link
                href="/customer/my-cars"
                onClick={() => setIsMobileOpen(false)}
                className="block text-sm font-medium text-[#ff3b30] py-2 border-b border-white/5"
              >
                <i className="bi bi-car-front me-2"></i>My Car Vault
              </Link>
              <Link
                href="/customer/profile"
                onClick={() => setIsMobileOpen(false)}
                className="block text-sm font-medium text-white/80 py-2 border-b border-white/5"
              >
                <i className="bi bi-person me-2"></i>Profile
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsMobileOpen(false)}
                  className="block text-sm font-medium text-amber-400 py-2 border-b border-white/5"
                >
                  <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
                </Link>
              )}
            </>
          )}

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="tel:+919313015917"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/20 text-white text-xs font-semibold"
            >
              <i className="bi bi-telephone-fill text-[#ff3b30]"></i>
              <span>+91 93130 15917</span>
            </a>

            <Link
              href="/contact-us"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-[#ff3b30] to-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider shadow-lg"
            >
              <span>Instant Studio Booking</span>
              <i className="bi bi-arrow-right"></i>
            </Link>

            {user && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  logout();
                }}
                className="py-2 text-xs text-red-400 text-center"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
