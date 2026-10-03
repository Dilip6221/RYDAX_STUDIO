import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/footer.css";
import { NavLink } from "react-router-dom";
import loginLogo from "../assets/images/rydax.png";
import { validateForm } from "../utils/formValidation.js";
import { emailSubmitValidationRules } from "../utils/validationRules.js";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await axios.get("service/admin/services");
      if (res.data.success) {
        const activeServices = res.data.data.filter(
          (item) => item.status === "ACTIVE"
        );
        setServices(activeServices);
      }
    } catch (error) {
      toast.error("Failed to load services");
      console.error("Footer service fetch error:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const inputRefs = {
    email: useRef(),
  };
  const handlerSubsciptionSub = async (e) => {
    e.preventDefault();
    const isValid = validateForm({
      values: email,
      validationRules: emailSubmitValidationRules,
      inputRefs
    });
    if (!isValid) return;
    try {
      const res = await axios.post("subscribe/subscribe", { email });
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
      setEmail("");
    } catch (error) {
      toast.error(error.message);
      console.error("Subscription error", error);
      setEmail("");
    }
  };

  return (
    <footer className="rydax-footer">
      <div className="container">
        <div className="footer-main-card">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6">
              <div className="footer-brand-area">
                <NavLink to="/">
                  <img src={loginLogo} alt="RYDAX" className="footer-logo" />
                </NavLink>

                <p className="footer-desc">
                  Premium automotive care, detailing, protection and trust-driven
                  service experience for every car enthusiast.
                </p>

                <div className="footer-social-icons">

                  <a
                    href="https://youtube.com/@dilipahir6221"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-youtube"></i>
                  </a>

                  <a
                    href="https://wa.me/919313015917"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-whatsapp"></i>
                  </a>

                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>

                  <a
                    href="https://x.com/DilipBe00479036"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-twitter-x"></i>
                  </a>
                </div>

                <p className="footer-slogan">
                  <i className="bi bi-wrench-adjustable"></i>
                  At <span>RYDAX</span> we don’t just fix cars — we build trust.
                </p>
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <h5 className="footer-title">Quick Links</h5>

              <ul className="footer-links">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/about">About Us</NavLink></li>
                <li><NavLink to="/services">Services</NavLink></li>
                <li><NavLink to="/blog">Blog</NavLink></li>
                <li><NavLink to="/gallery">Gallery</NavLink></li>
                <li><NavLink to="/contact-us">Contact Us</NavLink></li>
                <li><NavLink to="/faqs">Faqs</NavLink></li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6">
              <h5 className="footer-title">Our Services</h5>

              <ul className="footer-links service-links">
                {services.length > 0 ? (
                  services.slice(0, 7).map((service) => (
                    <li key={service._id}>
                      <NavLink to={`/service/${service.slug}`}>
                        {service.title}
                      </NavLink>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="footer-muted">No services found</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="col-lg-3 col-md-6">
              <h5 className="footer-title">Stay Updated</h5>

              <p className="footer-small">
                Get latest offers, service updates and car care tips.
              </p>

              <form className="newsletter-form" onSubmit={handlerSubsciptionSub}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  className="form-control service-input shadow-none"
                  onChange={(e) => setEmail(e.target.value)}
                  ref={inputRefs.email}
                />

                <button type="submit">
                  <i className="bi bi-send-fill"></i>
                </button>
              </form>

              <div className="footer-location">
                <h5 className="footer-title mt-4">Location</h5>

                <p>
                  Veraval Nani, Lalpur <br />
                  Jamnagar, Gujarat – 361170
                </p>

                <a
                  href="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="direction-link"
                >
                  Get Directions
                  <i className="bi bi-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-contact-row">
              <a href="mailto:beradilip39@gmail.com">
                <i className="bi bi-envelope"></i>
                beradilip39@gmail.com
              </a>
              <a href="tel:9313015917">
                <i className="bi bi-phone"></i>
                9313015917
              </a>
            </div>
            <p>© {new Date().getFullYear()} <span>RYDAX</span>. All Rights Reserved.</p>
            <div className="footer-policy-row">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;