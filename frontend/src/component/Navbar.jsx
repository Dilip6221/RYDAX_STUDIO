import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import letsStartLogo from "../assets/images/loginimage.webp";
import loginLogo from "../assets/images/rydax.png";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { validateForm } from "../utils/formValidation.js";
import { otpValidationRules, completeProfileValidationRules } from "../utils/validationRules.js";
import { FaUser } from "react-icons/fa";
import LoginDrawer from "../component/LoginDrawer.jsx";

const Navbar = () => {
  const { user, logout, fetchUser } = useContext(UserContext);
  const location = useLocation();

  const intervalRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const loginDrawerRef = useRef(null);


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  const [mobileDropdown, setMobileDropdown] = useState({
    services: false,
    more: false,
  });

  const openLoginDrawer = () => {
    closeMobileMenu();
    loginDrawerRef.current?.open();
  };

  const handleMyCarVaultClick = (e) => {
    if (!user) {
      e.preventDefault();
      openLoginDrawer();
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("service/services");
      if (res.data.success) {
        const activeServices = res.data.data.filter(
          (item) => item.status === "ACTIVE"
        );
        setServices(activeServices);
      }
    } catch (error) {
      toast.error("Failed to fetch services");
      console.error("Navbar service fetch error:", error);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);
  const MORE_MENU = [
    // ...(user ? [{ to: "/my-car-vault", label: "My Car Vault" }] : []),
    { to: "/blog", label: "Blog" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact-us", label: "Contact Us" },
    { to: "/faqs", label: "FAQS" },
  ];

  const isRouteActive = (routes) =>
    routes.some((route) => location.pathname.startsWith(route));

  const isServiceActive = services.some((service) =>
    location.pathname.startsWith(`/service/${service.slug}`)
  );

  const isMoreActive = isRouteActive([
    "/blog",
    "/gallery",
    "/contact-us",
    // "/my-car-vault",
    "/faqs",
  ]);

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = (menu) => {
    setMobileDropdown((prev) => ({
      services: menu === "services" ? !prev.services : false,
      more: menu === "more" ? !prev.more : false,
    }));
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("menu-lock");
      document.documentElement.classList.add("menu-lock");
    } else {
      document.body.classList.remove("menu-lock");
      document.documentElement.classList.remove("menu-lock");
    }

    return () => {
      document.body.classList.remove("menu-lock");
      document.documentElement.classList.remove("menu-lock");
    };
  }, [isMobileMenuOpen]);

  const MegaDropdown = ({ title, isActive, items, mainLink = null }) => (
    <li className="nav-item mega-dropdown">
      {mainLink ? (
        <NavLink
          to={mainLink}
          className={`nav-link cool-link ${isActive ? "active" : ""}`}
        >
          {title}
        </NavLink>
      ) : (
        <span className={`nav-link cool-link ${isActive ? "active" : ""}`}>
          {title}
        </span>
      )}

      <div className="mega-menu">
        <ul className="mega-list">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `mega-item text-decoration-none ${isActive ? "active" : ""}`
                }
              >
                <span className="mega-arrow">›</span>
                <span className="mega-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
  return (
    <>
      <div className="navbar-wrapper fixed-top">
        <div className="container d-flex align-items-center justify-content-between">
          <NavLink to="/">
            <img src={loginLogo} alt="Logo" className="navbar-logo" />
          </NavLink>

          <div className="mobile-header-actions d-lg-none">
            {!user ? (
              <button
                type="button"
                className="mobile-user-icon-btn"
                onClick={openLoginDrawer}
              >
                <FaUser />
              </button>
            ) : (
              <button
                type="button"
                className="mobile-user-icon-btn"
                onClick={() => setUserMenuOpen(true)}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </button>
            )}

            <button
              className="mobile-menu-btn"
              type="button"
              onClick={openMobileMenu}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>

          <nav className="navbar navbar-expand-lg navbar-dark p-0 d-none d-lg-flex">
            <ul className="navbar-nav align-items-center gap-4">
              <li>
                <NavLink to="/" className="nav-link cool-link">
                  Home
                </NavLink>
              </li>

              {/* <li>
                <NavLink to="/online-services" className="nav-link cool-link">
                  Online Services
                </NavLink>
              </li> */}
              <li>
                {!user ? (
                  <button
                    type="button"
                    className="nav-link cool-link"
                    onClick={openLoginDrawer}
                  >
                    My Car Vault
                  </button>
                ) : (
                  <NavLink to="/my-car-vault" className="nav-link cool-link">
                    My Car Vault
                  </NavLink>
                )}
              </li>

              <li>
                <NavLink to="/about" className="nav-link cool-link">
                  About
                </NavLink>
              </li>

              <MegaDropdown
                title="Services"
                mainLink="/services"
                isActive={isServiceActive}
                items={services.map((service) => ({
                  to: `/service/${service.slug}`,
                  label: service.title,
                }))}
              />

              <MegaDropdown title="More" isActive={isMoreActive} items={MORE_MENU} />
              <div className="os-actions">
                {!user ? (
                  <button
                    type="button"
                    className="mobile-user-icon-btn"
                    onClick={() => loginDrawerRef.current?.open()}
                  >
                    <FaUser />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mobile-user-icon-btn"
                    aria-label="Open account menu"
                    onClick={() => setUserMenuOpen(true)}
                  >
                    {user.name?.charAt(0)?.toUpperCase()}
                  </button>
                )}
              </div>
            </ul>
          </nav>
        </div>
      </div>
      {userMenuOpen && (
        <>
          <div className="os-user-backdrop" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />

          <div className="os-user-dropdown">
            <div className="os-user-info">
              <div className="os-user-big-avatar">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h6>{user.name || "RYDAX User"}</h6>
                <small>{user.phone}</small>
              </div>
            </div>

            {user?.role === "ADMIN" && (
              <Link
                to="/admin/dashboard"
                className="os-user-item"
                onClick={() => setUserMenuOpen(false)}
              >
                <i className="bi bi-speedometer2"></i>
                Admin Dashboard
              </Link>
            )}

            <Link
              to="/profile"
              className="os-user-item"
              onClick={() => setUserMenuOpen(false)}
            >
              <i className="bi bi-person"></i>
              View Profile
            </Link>

            <button
              type="button"
              className="os-user-item os-logout"
              onClick={() => {
                setUserMenuOpen(false);
                logout();
              }}
            >
              <i className="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </div>
        </>
      )}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      <div className={`mobile-offcanvas ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-offcanvas-header">
          <NavLink to="/" className="mobile-brand" onClick={closeMobileMenu}>
            <img src={loginLogo} alt="Logo" />
          </NavLink>

          <button
            type="button"
            className="mobile-close-btn"
            onClick={closeMobileMenu}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="mobile-offcanvas-body">
          <NavLink to="/" className="mobile-menu-link" onClick={closeMobileMenu}>
            <i className="bi bi-house-door"></i>
            <span>Home</span>
          </NavLink>

          {/* <NavLink
            to="/online-services"
            className="mobile-menu-link"
            onClick={closeMobileMenu}
          >
            <i className="bi bi-calendar-check"></i>
            <span>Online Services</span>
          </NavLink> */}
          {!user ? (
            <button
              type="button"
              className="mobile-menu-link btn-link"
              onClick={openLoginDrawer}
            >
              <i className="bi bi-info-circle"></i>
              <span>My Car Vault</span>
            </button>
          ) : (
            <NavLink to="/my-car-vault" className="mobile-menu-link" onClick={closeMobileMenu}>
              <i className="bi bi-info-circle"></i>
              <span>My Car Vault</span>
            </NavLink>
          )}

          <NavLink
            to="/about"
            className="mobile-menu-link"
            onClick={closeMobileMenu}
          >
            <i className="bi bi-info-circle"></i>
            <span>About</span>
          </NavLink>

          <button
            type="button"
            className="mobile-menu-link mobile-dropdown-btn"
            onClick={() => toggleMobileMenu("services")}
          >
            <span>
              <i className="bi bi-tools"></i>
              Services
            </span>
            <i
              className={`bi ${mobileDropdown.services ? "bi-chevron-up" : "bi-chevron-down"
                }`}
            ></i>
          </button>

          {mobileDropdown.services && (
            <div className="mobile-submenu-new">
              {services.map((service) => (
                <NavLink key={service._id} to={`/service/${service.slug}`} onClick={closeMobileMenu}>
                  {service.title}
                </NavLink>
              ))}
            </div>
          )}

          <button
            type="button"
            className="mobile-menu-link mobile-dropdown-btn"
            onClick={() => toggleMobileMenu("more")}
          >
            <span>
              <i className="bi bi-grid"></i>
              More
            </span>
            <i
              className={`bi ${mobileDropdown.more ? "bi-chevron-up" : "bi-chevron-down"
                }`}
            ></i>
          </button>

          {mobileDropdown.more && (
            <div className="mobile-submenu-new">
              {MORE_MENU.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={closeMobileMenu}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
      <LoginDrawer ref={loginDrawerRef} />
    </>
  );
};

export default Navbar;
