import React, { useContext, useEffect, useRef, useState } from "react";
import "../../css/onlineService.css";
import LoginDrawer from "../../component/LoginDrawer.jsx";
import logo from "../../assets/images/rydax.png";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaTools,
  FaChevronDown,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";

const menuItems = [
  { title: "Car Tyres", desc: "Find the perfect tyres for your car.", path: "/car-tyres" },
  { title: "Bike / Scooter Tyres", desc: "Tyres for every ride.", path: "/bike-scooter-tyres" },
  { title: "Alloy Wheels", desc: "Upgrade your vehicle's look.", path: "/alloy-wheels" },
  { title: "Car Batteries", desc: "Power for your car.", path: "/car-batteries" },
  { title: "Bike / Scooter Batteries", desc: "Batteries for your bike.", path: "/bike-scooter-batteries" },
  { title: "Accessories", desc: "Style, protection, and performance.", path: "/accessories" },
  { title: "Wheel Covers", desc: "Protect and style your wheels.", path: "/wheel-covers" },
  { title: "B2B Customers", desc: "Fleet solutions and business partnerships.", path: "/b2b-customers" },
  { title: "Blog", desc: "Latest updates.", path: "/blog" },
];

const OnlineServiceLayout = () => {
  const { user, logout } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const loginDrawerRef = useRef(null);

  const closeMobileMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => document.body.classList.remove("admin-page");
  }, []);

  useEffect(() => {
    if (menuOpen || userMenuOpen) {
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
  }, [menuOpen, userMenuOpen]);

  return (
    <>
      <header className="os-header">
        <div className="os-topbar">
          <div className="os-container">
            <NavLink to="/online-services" className="os-logo-link">
              <img src={logo} alt="RYDAX LOGO" className="os-logo" />
            </NavLink>

            <div className="os-center">
              <button className="os-city">Delhi-NCT</button>

              <div className="os-search">
                <input type="text" placeholder="Search: Batteries, Tyres..." />
                <FaSearch />
              </div>
            </div>

            <div className="os-actions">
              {!user ? (
                <button
                  type="button"
                  className="os-user-avatar-btn"
                  onClick={() => loginDrawerRef.current?.open()}
                >
                  <FaUser />
                </button>
              ) : (
                <button
                  type="button"
                  className="os-user-avatar-btn"
                  onClick={() => setUserMenuOpen(true)}
                >
                  {user.name?.charAt(0)?.toUpperCase()}
                </button>
              )}
              

              <button type="button" className="os-icon-btn">
                <FaShoppingBag />
              </button>

              <button
                type="button"
                className="os-mobile-menu-btn"
                onClick={() => setMenuOpen(true)}
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>

        <div className="os-mobile-search-row">
          <button className="os-mobile-city">
            Delhi-NCT <FaChevronDown />
          </button>

          <div className="os-mobile-search">
            <input type="text" placeholder="Search: Batteries" />
            <FaSearch />
          </div>
        </div>

        <nav className="os-menubar">
          <div className="os-container os-menu-row">
            {menuItems.slice(0, 8).map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.title}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      {userMenuOpen && (
        <>
          <div className="os-user-backdrop" onClick={() => setUserMenuOpen(false)} />

          <div className="os-user-dropdown">
            <div className="os-user-info">
              <div className="os-user-big-avatar">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h6>{user.name}</h6>
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

      {menuOpen && (
        <div className="os-mobile-overlay" onClick={closeMobileMenu} />
      )}

      <aside className={`os-mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="os-drawer-header">
          <NavLink to="/online-services" onClick={closeMobileMenu}>
            <img src={logo} alt="RYDAX LOGO" />
          </NavLink>

          <button type="button" onClick={closeMobileMenu}>
            <FaTimes />
          </button>
        </div>

        <div className="os-drawer-body">
          <button
            type="button"
            className="os-drawer-main-link"
            onClick={() => setServiceOpen(!serviceOpen)}
          >
            <span>
              <FaTools />
              Services
            </span>
            <FaChevronDown className={serviceOpen ? "rotate" : ""} />
          </button>

          {serviceOpen && (
            <div className="os-drawer-services">
              {menuItems.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={closeMobileMenu}>
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </aside>

      <LoginDrawer ref={loginDrawerRef} />
    </>
  );
};

export default OnlineServiceLayout;