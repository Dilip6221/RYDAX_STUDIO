import { React, useContext, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "../../css/style.css";
import "../../css/admin.css";
import loginLogo from "../../assets/images/rydax.png";


const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(UserContext);
  const [openMenu, setOpenMenu] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 992 : true
  );
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Auto-handle sidebar on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-close sidebar on route change on mobile devices
  useEffect(() => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Helper for closing sidebar when tapping nav items on mobile
  const handleNavClick = (customEvent) => {
    if (customEvent) {
      window.dispatchEvent(new Event(customEvent));
    }
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => document.body.classList.remove("admin-page");
  }, []);
  const isOthersActive =
    location.pathname.includes("blogs") ||
    location.pathname.includes("gallery") ||
    location.pathname.includes("inquery") ||
    location.pathname.includes("subscribe") ||
    location.pathname.includes("customer-reviews") ||
    location.pathname.includes("about-timeline");

  const isOnlineServiceActive =
    location.pathname.includes("online-services-category") ||
    location.pathname.includes("online-services") ||
    location.pathname.includes("online-services-packages") ||
    location.pathname.includes("online-addon-services");
  return (
    <>
      <div className="admin-layout container-fluid p-0 m-0">

        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="admin-sidebar-backdrop d-lg-none"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className={`admin-sidebar sidebar bg-dark ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
          {/* Mobile Sidebar Header with Close Button */}
          <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-secondary d-lg-none">
            <NavLink to="/admin/dashboard" onClick={() => handleNavClick("dashboardClick")}>
              <img src={loginLogo} alt="Logo" style={{ height: "34px", width: "auto" }} />
            </NavLink>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />
          </div>

          <nav className="navbar navbar-dark">
            <NavLink to="/admin/dashboard" className="w-100 d-none d-lg-flex justify-content-center align-items-center py-2">
                  <img src={loginLogo} alt="Logo" className="admin-logo" />
            </NavLink>
            <div className="navbar-nav w-100">
              <NavLink
                to="/admin/dashboard"
                onClick={() => handleNavClick("dashboardClick")}
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="fa fa-tachometer-alt me-2"></i>Dashboard
              </NavLink>

              <NavLink
                to="/admin/users"
                onClick={() => handleNavClick("ourTeamClick")}
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-person-badge-fill me-2"></i>Our Team
              </NavLink>
              <NavLink
                to="/admin/services"
                onClick={() => handleNavClick()}
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-tools me-2"></i>Services
              </NavLink>
              <div
                className={`nav-item ${openMenu === "onlineService" || isOnlineServiceActive ? "open" : ""
                  }`}
              >
                <div
                  className="nav-link submenu-toggle"
                  onClick={() => toggleMenu("onlineService")}
                >
                  <i className="bi bi-card-checklist me-2"></i>
                  Online Service
                  <i className="fa fa-angle-down  float-end"></i>
                </div>

                <div className="submenu">
                  <NavLink
                    to="/admin/online-services-category"
                    onClick={() => handleNavClick()}
                    className="dropdown-item"
                  >
                    Services Category
                  </NavLink>
                  <NavLink
                    to="/admin/online-services"
                    onClick={() => handleNavClick()}
                    className="dropdown-item"
                  >
                    Services
                  </NavLink>
                  <NavLink
                    to="/admin/online-services-packages"
                    onClick={() => handleNavClick()}
                    className="dropdown-item"
                  >
                    Service Packges
                  </NavLink>
                  <NavLink
                    to="/admin/online-addon-services"
                    onClick={() => handleNavClick()}
                    className="dropdown-item"
                  >
                    Addon Service
                  </NavLink>
                </div>
              </div>

              <NavLink
                to="/admin/user-cars"
                onClick={() => handleNavClick()}
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-car-front me-2"></i>User Cars
              </NavLink>
              <NavLink
                to="/admin/job-cards"
                onClick={() => handleNavClick()}
                className={({ isActive }) =>
                  `nav-item nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="bi bi-card-checklist me-2"></i>Job Cards
              </NavLink>
              <div
                className={`nav-item ${openMenu === "others" || isOthersActive ? "open" : ""
                  }`}
              >
                <div
                  className="nav-link submenu-toggle"
                  onClick={() => toggleMenu("others")}
                >
                  <i className="bi bi-grid me-2"></i>
                  Manage
                  <i className="fa fa-angle-down float-end"></i>
                </div>
                <div className="submenu">
                  <NavLink to="/admin/inquery" onClick={() => handleNavClick()} className="dropdown-item">
                    Customer Inquiry
                  </NavLink>

                  <NavLink to="/admin/blogs" onClick={() => handleNavClick()} className="dropdown-item">
                    Our Blogs
                  </NavLink>

                  <NavLink to="/admin/gallery" onClick={() => handleNavClick()} className="dropdown-item">
                    Gallery
                  </NavLink>

                  <NavLink to="/admin/subscribe" onClick={() => handleNavClick()} className="dropdown-item">
                    Newsletters
                  </NavLink>

                  <NavLink to="/admin/about-timeline" onClick={() => handleNavClick()} className="dropdown-item">
                    About Timeline
                  </NavLink>

                  <NavLink to="/admin/customer-reviews" onClick={() => handleNavClick()} className="dropdown-item">
                    Customer Reviews
                  </NavLink>

                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="admin-content content">

          {/* TOP NAV */}
          <nav className="navbar navbar-expand bg-dark navbar-dark sticky-top px-4 py-0">

            <button
              type="button"
              className="sidebar-toggler text-danger flex-shrink-0 border-0 bg-transparent"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <i className="fa fa-bars"></i>
            </button>

            <form className="d-none d-md-flex ms-4">
              <input
                className="form-control bg-black border-0"
                type="search"
                placeholder="Search"
              />
            </form>
            <div className="navbar-nav align-items-center ms-auto">
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="fa fa-user me-lg-2"></i>
                  <span className="d-none d-lg-inline-flex">{user?.name}</span>
                </a>
                <div className="dropdown-menu dropdown-menu-end bg-dark border-0 rounded-0 rounded-bottom m-0">
                  <a href="#" className="dropdown-item" onClick={logout}>Logout</a>
                  <a href="/" className="dropdown-item"  > Back Portal</a>
                </div>
              </div>
            </div>

          </nav>

          <div className="p-4">
            {children}
          </div>

        </div>

      </div>
    </>
  );
};

export default AdminLayout;
