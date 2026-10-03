import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../context/UserContext.jsx";
import "../css/home.css";

// Helper to determine an appropriate icon based on service title
const getServiceIcon = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("ppf") || t.includes("film") || t.includes("protection")) return "bi-shield-shaded";
  if (t.includes("ceramic") || t.includes("graphene") || t.includes("coating")) return "bi-gem";
  if (t.includes("paint") || t.includes("polish") || t.includes("correction")) return "bi-lightning-charge";
  if (t.includes("interior") || t.includes("leather") || t.includes("wash") || t.includes("detox")) return "bi-stars";
  if (t.includes("wrap") || t.includes("color") || t.includes("tint")) return "bi-palette";
  return "bi-tools";
};

const VEHICLE_TYPES = [
  { id: "sedan", label: "Sedan / Hatch", icon: "bi-car-front" },
  { id: "suv", label: "Luxury SUV", icon: "bi-truck" },
  { id: "supercar", label: "Supercar / Exotic", icon: "bi-speedometer2" }
];

const HomeCta = () => {
  const { user } = useContext(UserContext);

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState("");
  const [otherServiceNote, setOtherServiceNote] = useState("");

  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_TYPES[1].label);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Fetch dynamic services from database (identical to Contact page)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        let res;
        try {
          res = await axios.get("service/services");
        } catch {
          res = await axios.get("service/admin/services");
        }

        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          // Filter active services if status is provided
          const activeOnly = data.filter((s) => !s.status || s.status === "ACTIVE");
          const targetList = activeOnly.length > 0 ? activeOnly : data;

          const dynamicList = targetList.map((item) => ({
            id: item._id || item.id || item.title,
            label: item.title || item.name,
            icon: getServiceIcon(item.title || item.name)
          }));

          // Append "Other Service" option like Contact page
          dynamicList.push({
            id: "other-service",
            label: "Other Service",
            icon: "bi-plus-circle-dotted"
          });

          setServices(dynamicList);
          setSelectedService(dynamicList[0].label);
        } else {
          // Fallback if no services returned
          const fallbackList = [
            { id: "ppf", label: "TPU Paint Protection (PPF)", icon: "bi-shield-shaded" },
            { id: "ceramic", label: "10H Ceramic / Graphene", icon: "bi-gem" },
            { id: "correction", label: "Multi-Stage Paint Polish", icon: "bi-lightning-charge" },
            { id: "other-service", label: "Other Service", icon: "bi-plus-circle-dotted" }
          ];
          setServices(fallbackList);
          setSelectedService(fallbackList[0].label);
        }
      } catch (err) {
        console.error("HomeCta: Error fetching services:", err);
        const fallbackList = [
          { id: "ppf", label: "TPU Paint Protection (PPF)", icon: "bi-shield-shaded" },
          { id: "ceramic", label: "10H Ceramic / Graphene", icon: "bi-gem" },
          { id: "correction", label: "Multi-Stage Paint Polish", icon: "bi-lightning-charge" },
          { id: "other-service", label: "Other Service", icon: "bi-plus-circle-dotted" }
        ];
        setServices(fallbackList);
        setSelectedService(fallbackList[0].label);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const todayStr = new Date().toISOString().split("T")[0];

  const finalServiceString =
    selectedService === "Other Service" && otherServiceNote.trim()
      ? `Other Service (${otherServiceNote.trim()})`
      : selectedService;

  const whatsappMessage = encodeURIComponent(
    `Hello RYDAX Atelier! I want to reserve a studio slot for:
• Service: ${finalServiceString}
• Vehicle: ${selectedVehicle}
• Date: ${preferredDate || "Flexible / Earliest Available"}
• Name: ${name.trim() || "Guest"}
• Phone: ${phone.trim() || "N/A"}
Please confirm the booking slot.`
  );

  const handleDirectBooking = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("inquery/service-inquiry", {
        name: name.trim(),
        phone: cleanPhone,
        services: [finalServiceString],
        notes: `[DIRECT CTA BOOKING] Vehicle: ${selectedVehicle} | Preferred Date: ${preferredDate || "Earliest Slot"}${
          selectedService === "Other Service" && otherServiceNote.trim()
            ? ` | Custom Requirement: ${otherServiceNote.trim()}`
            : ""
        }`
      });

      if (res.data?.success) {
        setIsBooked(true);
        toast.success(res.data.message || "Studio Slot Reserved Successfully!");
      } else {
        toast.error(res.data?.message || "Booking request failed. Connecting on WhatsApp...");
        window.open(`https://wa.me/919313015917?text=${whatsappMessage}`, "_blank");
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.success("Connecting to WhatsApp Concierge to confirm slot...");
      window.open(`https://wa.me/919313015917?text=${whatsappMessage}`, "_blank");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="home-cta-section" id="studio-reservation">
      <div className="home-cta-backdrop-glow"></div>
      <div className="home-cta-overlay"></div>
      <div className="cta-ambient-laser-line"></div>

      <div className="container position-relative">
        <div className="luxury-cta-deck direct-booking-deck">
          {/* Header (Direct / No Theory) */}
          <div className="cta-direct-header">
            <div className="cta-studio-beacon">
              <span className="beacon-live-pulse"></span>
              <span className="beacon-label">DIRECT STUDIO RESERVATION</span>
            </div>

            <h2 className="cta-main-title">
              LOCK IN YOUR <span className="cta-highlight-ruby">STUDIO SLOT.</span>
            </h2>

            <p className="cta-direct-subtext">
              Select your treatment, vehicle type, and confirm in 30 seconds.
            </p>
          </div>

          {isBooked ? (
            /* Confirmation Success State */
            <div className="cta-booked-confirmation">
              <div className="booked-icon-circle">
                <i className="bi bi-check-lg"></i>
              </div>
              <h3 className="booked-title">Studio Slot Reserved!</h3>
              <p className="booked-desc">
                Thank you, <strong>{name}</strong>. Our master concierge will contact you on{" "}
                <strong>{phone}</strong> within 15 minutes to confirm your dedicated bay for{" "}
                <strong>{finalServiceString}</strong> ({selectedVehicle}).
              </p>
              <div className="booked-actions">
                <a
                  href={`https://wa.me/919313015917?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-btn-whatsapp"
                >
                  <i className="bi bi-whatsapp"></i>
                  <span>Track Booking On WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsBooked(false)}
                  className="cta-btn-reset"
                >
                  Reserve Another Slot
                </button>
              </div>
            </div>
          ) : (
            /* Fast Direct Booking Form */
            <form onSubmit={handleDirectBooking} className="cta-direct-form">
              {/* Step 1: Select Service (100% Dynamic from Database + Other Service) */}
              <div className="direct-form-step">
                <label className="step-label">
                  <span className="step-num">1</span>
                  <span>Select Service (Live Catalog):</span>
                </label>
                <div className="direct-pills-row">
                  {loadingServices ? (
                    <div className="cta-services-loading">
                      <span className="spinner-border spinner-border-sm text-danger me-2"></span>
                      <span>Loading active studio services...</span>
                    </div>
                  ) : (
                    services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedService(s.label)}
                        className={`direct-pill-btn ${selectedService === s.label ? "active" : ""}`}
                      >
                        <i className={`bi ${s.icon}`}></i>
                        <span>{s.label}</span>
                      </button>
                    ))
                  )}
                </div>

                {/* Sub-input if "Other Service" is selected */}
                {selectedService === "Other Service" && (
                  <div className="direct-other-service-wrap">
                    <div className="direct-input-box other-spec-box">
                      <i className="bi bi-pencil-square input-icon"></i>
                      <input
                        type="text"
                        placeholder="Please specify your service requirement (e.g. Wrap, Sunfilm, Alloy Customization...)"
                        value={otherServiceNote}
                        onChange={(e) => setOtherServiceNote(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Select Vehicle Type */}
              <div className="direct-form-step">
                <label className="step-label">
                  <span className="step-num">2</span>
                  <span>Select Vehicle Category:</span>
                </label>
                <div className="direct-pills-row vehicle-pills">
                  {VEHICLE_TYPES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVehicle(v.label)}
                      className={`direct-pill-btn ${selectedVehicle === v.label ? "active" : ""}`}
                    >
                      <i className={`bi ${v.icon}`}></i>
                      <span>{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Quick Inputs (Name, Phone, Date) */}
              <div className="direct-form-step">
                <label className="step-label">
                  <span className="step-num">3</span>
                  <span>Your Details & Preferred Date:</span>
                </label>
                <div className="direct-inputs-grid">
                  <div className="direct-input-box">
                    <i className="bi bi-person input-icon"></i>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="direct-input-box">
                    <i className="bi bi-telephone input-icon"></i>
                    <input
                      type="tel"
                      placeholder="10-Digit Mobile Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={14}
                      required
                    />
                  </div>

                  <div className="direct-input-box">
                    <i className="bi bi-calendar3 input-icon"></i>
                    <input
                      type="date"
                      min={todayStr}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      title="Preferred studio date"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Instant Booking Action Buttons */}
              <div className="direct-actions-cluster">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cta-btn-primary direct-submit-btn"
                >
                  <span className="btn-shine"></span>
                  <span className="btn-content">
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        <span>Confirming Bay...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar2-check-fill"></i>
                        <span>Confirm Studio Reservation</span>
                        <i className="bi bi-arrow-right"></i>
                      </>
                    )}
                  </span>
                </button>

                <a
                  href={`https://wa.me/919313015917?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-btn-whatsapp direct-wa-btn"
                >
                  <span className="wa-icon-glow">
                    <i className="bi bi-whatsapp"></i>
                  </span>
                  <div className="wa-btn-labels">
                    <span className="wa-main-text">1-Click WhatsApp Booking</span>
                    <span className="wa-sub-text">Direct Tech Chat &bull; Instant Reply</span>
                  </div>
                </a>

                <a href="tel:+919313015917" className="cta-btn-phone direct-phone-btn">
                  <i className="bi bi-telephone-outbound-fill"></i>
                  <span>Call: +91 93130 15917</span>
                </a>
              </div>
            </form>
          )}

          {/* Minimal 1-line Reassurance Pills (Zero Theory) */}
          <div className="cta-quick-reassurance">
            <div className="reassurance-item">
              <i className="bi bi-shield-check"></i>
              <span>10-Year Warranty</span>
            </div>
            <span className="reassurance-dot">&bull;</span>
            <div className="reassurance-item">
              <i className="bi bi-lightning-charge-fill"></i>
              <span>Instant Confirmation</span>
            </div>
            <span className="reassurance-dot">&bull;</span>
            <div className="reassurance-item">
              <i className="bi bi-award-fill"></i>
              <span>Zero-Dust Clean Bay</span>
            </div>
            <span className="reassurance-dot">&bull;</span>
            <div className="reassurance-item">
              <i className="bi bi-star-fill text-warning"></i>
              <span>4.9/5 Google Rated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCta;