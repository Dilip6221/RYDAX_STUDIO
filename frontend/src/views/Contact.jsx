import React, { useContext, useState, useEffect, useRef } from "react";
import "../css/contact.css";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../context/UserContext.jsx";
import { validateForm } from "../utils/formValidation.js";
import { submitInquiryValidationRules } from "../utils/validationRules.js";
import rydaxAnimation from "../assets/vidoes/rydaxCarAnimation.gif";
import { Seo } from "../component/Seo.jsx";

const Contact = () => {
    const { user } = useContext(UserContext);
    const [serviceOptions, setServiceOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);

    const reactSelectStyles = {
        control: (base, state) => ({
            ...base,
            background: "rgba(255, 255, 255, 0.04)",
            borderColor: state.isFocused ? "#ff4d4d" : "rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            minHeight: "48px",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(255, 77, 77, 0.15)" : "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
                borderColor: state.isFocused ? "#ff4d4d" : "rgba(255, 255, 255, 0.2)",
            }
        }),
        singleValue: (base) => ({
            ...base,
            color: "#ffffff",
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: "rgba(255, 77, 77, 0.15)",
            borderRadius: "6px",
            border: "1px solid rgba(255, 77, 77, 0.3)",
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: "#ffffff",
            fontSize: "12px",
            padding: "2px 6px",
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: "#ff6b6b",
            cursor: "pointer",
            ":hover": {
                backgroundColor: "rgba(255, 77, 77, 0.35)",
                color: "#ffffff",
            },
        }),
        menu: (base) => ({
            ...base,
            background: "#141414",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.7)",
            overflow: "hidden",
            zIndex: 9999,
        }),
        menuList: (base) => ({
            ...base,
            padding: "6px",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#ff4d4d"
                : state.isFocused
                    ? "rgba(255, 255, 255, 0.08)"
                    : "transparent",
            color: "#ffffff",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            transition: "all 0.15s ease",
        }),
        placeholder: (base) => ({
            ...base,
            color: "rgba(255, 255, 255, 0.3)",
            fontSize: "13px",
        }),
        indicatorSeparator: () => ({ display: "none" }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "rgba(255, 255, 255, 0.4)",
            "&:hover": {
                color: "#ff4d4d",
            }
        }),
    };

    const [serviceEnquery, setServiceEnquery] = useState({
        name: user ? user.name || "" : "",
        phone: user ? user.phone || "" : "",
        services: [],
        notes: ""
    });

    const inputRefs = {
        name: useRef(),
        phone: useRef(),
        services: useRef(),
        notes: useRef()
    };

    useEffect(() => {
        if (user) {
            setServiceEnquery(prev => ({
                ...prev,
                name: prev.name || user.name || "",
                phone: prev.phone || user.phone || ""
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                let res;
                try {
                    res = await axios.get("service/services");
                } catch {
                    res = await axios.get("service/admin/services");
                }
                const data = res.data?.data;
                if (Array.isArray(data) && data.length > 0) {
                    const options = [
                        ...data.map(c => ({
                            value: c.title,
                            label: c.title
                        })),
                        { value: "Other Service", label: "Other Service" }
                    ];
                    setServiceOptions(options);
                }
            } catch (err) {
                console.error("Frontend Error Fetching Services:", err);
            }
        };
        fetchServices();
    }, []);

    const toggleQuickTag = (tagValue) => {
        setServiceEnquery(prev => {
            const isSelected = prev.services.includes(tagValue);
            const updated = isSelected
                ? prev.services.filter(s => s !== tagValue)
                : [...prev.services, tagValue];
            return { ...prev, services: updated };
        });
    };

    const handleCopyPhone = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const textToCopy = "+919313015917";
        let success = false;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
                success = true;
            }
        } catch (err) {
            console.warn("navigator.clipboard failed, using fallback", err);
        }

        if (!success) {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                success = document.execCommand("copy");
                document.body.removeChild(textArea);
            } catch (fallbackErr) {
                console.error("Fallback copy failed", fallbackErr);
            }
        }

        if (success) {
            setCopiedPhone(true);
            toast.success("Phone copied: +91 93130 15917");
            setTimeout(() => setCopiedPhone(false), 2200);
        } else {
            toast.error("Unable to copy number");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setServiceEnquery(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm({
            values: serviceEnquery,
            validationRules: submitInquiryValidationRules,
            inputRefs
        });
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            const res = await axios.post("inquery/service-inquiry", {
                name: serviceEnquery.name,
                phone: serviceEnquery.phone,
                services: serviceEnquery.services,
                notes: serviceEnquery.notes,
            });
            if (res.data?.success) {
                toast.success(res.data.message || "Consultation request sent successfully!");
                setServiceEnquery({
                    name: user ? user.name || "" : "",
                    phone: user ? user.phone || "" : "",
                    services: [],
                    notes: ""
                });
            } else {
                toast.error(res.data?.message || "Failed to submit inquiry");
            }
        } catch (error) {
            console.error("Frontend Error submitting enquiry:", error);
            toast.error("Something went wrong. Please call or WhatsApp our helpline.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            <Seo
                title="Contact RYDAX Studio | Car Detailing & PPF Ahmedabad"
                description="Get in touch with RYDAX Studio for car detailing, ceramic coating, and PPF in Ahmedabad. Quick response, transparent consultation."
            />

            {/* HERO SECTION */}
            <div className="contact-hero">
                <div className="container">
                    <div className="contact-top-badge">
                        <span className="live-dot-indicator"></span>
                        <span>Get In Touch</span>
                    </div>

                    <h1 className="contact-hero-title">
                        Contact <span>Us</span>
                    </h1>

                    <p className="contact-hero-desc">
                        Have questions about ceramic coating, PPF, or car care? Reach out to us or book a consultation below.
                    </p>
                </div>
            </div>

            {/* 4 QUICK CONNECT CARDS */}
            <div className="container">
                <div className="contact-cards-grid">
                    {/* PHONE */}
                    <div className="contact-card-item">
                        <a
                            href="tel:+919313015917"
                            className="card-icon-box text-decoration-none"
                            title="Click to call +91 93130 15917"
                        >
                            <i className="bi bi-telephone-fill"></i>
                        </a>
                        <div className="card-meta-text">
                            <div className="card-label-small">Call Us</div>
                            <a
                                href="tel:+919313015917"
                                className="card-main-val text-white text-decoration-none d-block"
                                title="Click to call +91 93130 15917"
                            >
                                +91 93130 15917
                            </a>
                            <div className="card-sub-info">
                                <span>Mon-Sat 9AM - 7PM</span>
                            </div>
                            <button
                                type="button"
                                className="card-copy-pill border-0"
                                onClick={handleCopyPhone}
                                title="Copy phone number to clipboard"
                            >
                                <i className={`bi ${copiedPhone ? "bi-check2 text-success" : "bi-clipboard"}`}></i>
                                <span>{copiedPhone ? "Copied" : "Copy"}</span>
                            </button>
                        </div>
                    </div>

                    {/* WHATSAPP */}
                    <a
                        href="https://wa.me/919313015917?text=Hello%20RYDAX%20Studio%2C%20I%20would%20like%20to%20inquire%20about%20car%20detailing"
                        target="_blank"
                        rel="noreferrer"
                        className="contact-card-item"
                    >
                        <div className="card-icon-box whatsapp-box">
                            <i className="bi bi-whatsapp"></i>
                        </div>
                        <div className="card-meta-text">
                            <div className="card-label-small">WhatsApp</div>
                            <p className="card-main-val">Chat Directly</p>
                            <div className="card-sub-info text-success">
                                <span className="live-dot-indicator"></span>
                                <span>Online Now</span>
                            </div>
                        </div>
                    </a>

                    {/* LOCATION */}
                    <a
                        href="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India"
                        target="_blank"
                        rel="noreferrer"
                        className="contact-card-item"
                    >
                        <div className="card-icon-box">
                            <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <div className="card-meta-text">
                            <div className="card-label-small">Studio Location</div>
                            <p className="card-main-val">Satellite, Ahmedabad</p>
                            <div className="card-sub-info">
                                <span>Directions →</span>
                            </div>
                        </div>
                    </a>

                    {/* TIMING */}
                    <div className="contact-card-item">
                        <div className="card-icon-box">
                            <i className="bi bi-clock-fill"></i>
                        </div>
                        <div className="card-meta-text">
                            <div className="card-label-small">Workshop Hours</div>
                            <p className="card-main-val">09:00 AM - 07:00 PM</p>
                            <div className="card-sub-info text-warning">
                                <span>Open Today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN 2-COLUMN SECTION */}
            <div className="container">
                <div className="contact-main-grid">
                    {/* LEFT COLUMN */}
                    <div className="contact-left-card">
                        <h2 className="contact-left-title">
                            Welcome to <span>RYDAX Studio</span>
                        </h2>
                        <p className="contact-left-desc">
                            World-class detailing, ceramic coatings, and self-healing paint protection for your vehicle.
                        </p>

                        {/* CAR ANIMATION */}
                        <div className="contact-car-container">
                            <img
                                loading="lazy"
                                src={rydaxAnimation}
                                alt="RYDAX Studio"
                                className="contact-car-img"
                            />
                        </div>

                        {/* 3 CLEAN HIGHLIGHT CHIPS */}
                        <div className="contact-features-strip">
                            <div className="feature-pill">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Dust-Free Coating Bay</span>
                            </div>
                            <div className="feature-pill">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Certified Master Detailers</span>
                            </div>
                            <div className="feature-pill">
                                <i className="bi bi-check-circle-fill"></i>
                                <span>Digital Warranty</span>
                            </div>
                        </div>

                        {/* SOCIAL ICONS */}
                        <div className="contact-social-strip">
                            <span>Connect With Us</span>
                            <div className="social-icons-wrap">
                                <a
                                    href="https://youtube.com/@dilipahir6221"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="social-circle-btn"
                                    title="YouTube"
                                >
                                    <i className="bi bi-youtube"></i>
                                </a>
                                <a
                                    href="https://wa.me/919313015917"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="social-circle-btn"
                                    title="WhatsApp"
                                >
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                                <a
                                    href="https://www.instagram.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="social-circle-btn"
                                    title="Instagram"
                                >
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a
                                    href="https://x.com/DilipBe00479036"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="social-circle-btn"
                                    title="Twitter / X"
                                >
                                    <i className="bi bi-twitter-x"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: CLEAN FORM */}
                    <div className="contact-form-box">
                        <h3 className="form-top-title">Book Consultation</h3>
                        <p className="form-top-sub">
                            Select services or leave details below and we will contact you.
                        </p>

                        {/* DYNAMIC QUICK SELECT TAGS - 100% FROM DATABASE */}
                        {serviceOptions.length > 0 && (
                            <div className="quick-tags-wrap">
                                <div className="quick-tags-label">Quick Select Services:</div>
                                <div className="quick-tags-container">
                                    {serviceOptions.map((opt) => {
                                        const isSelected = serviceEnquery.services.includes(opt.value);
                                        return (
                                            <span
                                                key={opt.value}
                                                className={`quick-tag-item ${isSelected ? "active" : ""}`}
                                                onClick={() => toggleQuickTag(opt.value)}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                <i className={`bi ${isSelected ? "bi-check2" : "bi-plus"}`}></i>
                                                {opt.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* FORM FIELDS */}
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        name="name"
                                        className="clean-input"
                                        placeholder="Full Name*"
                                        autoComplete="name"
                                        ref={inputRefs.name}
                                        value={serviceEnquery.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="tel"
                                        name="phone"
                                        inputMode="numeric"
                                        className="clean-input"
                                        placeholder="Phone Number (10 Digits)*"
                                        autoComplete="tel"
                                        ref={inputRefs.phone}
                                        value={serviceEnquery.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-12">
                                    <Select
                                        isMulti
                                        options={serviceOptions}
                                        classNamePrefix="react-select"
                                        placeholder="Select Required Services*"
                                        ref={inputRefs.services}
                                        maxMenuHeight={200}
                                        value={serviceOptions.filter(opt =>
                                            serviceEnquery.services.includes(opt.value)
                                        )}
                                        onChange={(selected) =>
                                            setServiceEnquery(prev => ({
                                                ...prev,
                                                services: selected ? selected.map(s => s.value) : [],
                                            }))
                                        }
                                        styles={reactSelectStyles}
                                    />
                                </div>
                                <div className="col-12">
                                    <textarea
                                        name="notes"
                                        rows="2"
                                        className="clean-textarea"
                                        placeholder="Car model or special requirements (optional)..."
                                        ref={inputRefs.notes}
                                        value={serviceEnquery.notes}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="form-safe-note">
                                <i className="bi bi-shield-check"></i>
                                <span>Your details are 100% secure</span>
                            </div>

                            <button
                                type="submit"
                                className="clean-submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Book Premium Consultation</span>
                                        <i className="bi bi-arrow-right"></i>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* BOTTOM MAP */}
            <div className="container">
                <div className="contact-map-wrapper">
                    <div className="map-bar-top">
                        <div className="map-bar-left">
                            <i className="bi bi-geo-alt-fill"></i>
                            <span>RYDAX Studio — Satellite, Ahmedabad</span>
                        </div>
                        <a
                            href="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India"
                            target="_blank"
                            rel="noreferrer"
                            className="map-direct-btn"
                        >
                            <span>Open In Maps</span>
                            <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                    </div>
                    <iframe
                        title="RYDAX Studio Location"
                        src="https://www.google.com/maps?q=Navi+Veraval,+Gujarat,+India&output=embed"
                        loading="lazy"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Contact;
