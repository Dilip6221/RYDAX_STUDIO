import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/home.css";
import studioImg from "../assets/images/rydax-studion.avif";
import ppfImg from "../assets/images/car-ppf.jpg";
import carStudioImg from "../assets/images/rydax-studio-car.png";
import rydaxImg from "../assets/images/rydax.png";

const pillars = [
  {
    id: "cleanroom",
    num: "01",
    title: "Dust-Free Clean Room Bay",
    subtitle:
      "Temperature-stabilized indoor studio with HEPA air filtration ensuring zero airborne particles are trapped under your ceramic coating or PPF.",
    tags: ["Climate Controlled 22°C", "HEPA Filtered", "Hexagon Daylight LEDs"],
    image: studioImg,
    badgeText: "ISO-Grade Clean Room",
    statValue: "100%",
    statUnit: "DUST-FREE",
    statLabel: "Climate-Controlled Bay",
    icon: "bi bi-building-check",
    detail: "Prevents contamination bubbles & delivers crystal-clear optical curing.",
  },
  {
    id: "correction",
    num: "02",
    title: "Multi-Stage Paint Correction",
    subtitle:
      "Calibrated ultrasonic depth gauges and dual-action polishers permanently eliminate swirl marks and scratches while safely preserving your factory clear-coat.",
    tags: ["Zero Swirl Marks", "Ultrasonic Depth Check", "Mirror Glass Gloss"],
    image: carStudioImg,
    badgeText: "Micron-Level Precision",
    statValue: "99.8%",
    statUnit: "DEFECTS GONE",
    statLabel: "Factory Clear-Coat Safe",
    icon: "bi bi-crosshair2",
    detail: "No rotary buffer trails or cheap filler waxes—only true optical reflection.",
  },
  {
    id: "protection",
    num: "03",
    title: "Certified 9H Ceramic & Graphene Coatings",
    subtitle:
      "Aviation-grade genuine 9H SiO2 coatings that heal micro-scratches automatically under sunlight and repel water, dirt & acid rain.",
    tags: ["Self-Healing Scratches", "115° Water Beading", "Rock-Chip Shield"],
    image: ppfImg,
    badgeText: "Aerospace Protection",
    statValue: "8.5 MIL",
    statUnit: "ARMOR TPU",
    statLabel: "Self-Healing Memory Film",
    icon: "bi bi-shield-check",
    detail: "Absorbs gravel & stone impacts, retaining showroom depth permanently.",
  },
  {
    id: "vault",
    num: "04",
    title: "10-Year Digital Warranty & Service Vault",
    subtitle:
      "Every treatment is officially logged in your online customer dashboard with high-resolution photographic records and an authenticated transferable warranty.",
    tags: ["100% Transferable", "Permanent Cloud Log", "Resale Value Boost"],
    image: rydaxImg,
    badgeText: "Official Studio Provenance",
    statValue: "10 YRS",
    statUnit: "WARRANTY",
    statLabel: "Digital Customer Vault",
    icon: "bi bi-patch-check",
    detail: "Directly increases vehicle resale equity with verified service provenance.",
  },
];

const comparisons = [
  {
    title: "Workspace Bay",
    ordinary: "Open roadside bays with dust, dirt & direct harsh sunlight",
    rydax: "Fully enclosed, climate-controlled indoor clean-room studio",
    icon: "bi bi-building",
  },
  {
    title: "Paint Correction",
    ordinary: "Single-step rotary buffing that causes buffer trails & holograms",
    rydax: "Multi-stage correction calibrated with digital ultrasonic depth gauges",
    icon: "bi bi-speedometer2",
  },
  {
    title: "Surface Protection",
    ordinary: "Cheap silicone wax or low-grade thin film that washes off in weeks",
    rydax: "Authentic 9H ceramic coating & self-healing 8.5 MIL aliphatic TPU",
    icon: "bi bi-gem",
  },
  {
    title: "Warranty & Records",
    ordinary: "Handwritten paper bills with zero claims or dealer recognition",
    rydax: "10-year official digital warranty tracked in your online vault",
    icon: "bi bi-shield-fill-check",
  },
];

const trustStats = [
  { val: "5,0+", label: "Exotics & Cars Perfected", icon: "bi bi-trophy" },
  { val: "22°C", label: "HEPA Climate-Controlled", icon: "bi bi-snow" },
  { val: "10 Yrs", label: "Studio Warranty Guarantee", icon: "bi bi-patch-check-fill" },
  { val: "4.9 ★", label: "Google Rated Excellence", icon: "bi bi-star-fill" },
];

const WhyChooseUs = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance active pillar every 5 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % pillars.length);
    }, 5200);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activePillar = pillars[activeIdx];

  return (
    <section
      className="why-luxury-section"
      id="why-choose-us"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Ambient Lighting Accents */}
      <div className="why-ambient-red"></div>
      <div className="why-ambient-orange"></div>

      <div className="why-luxury-container">
        {/* Simple, Elegant & Professional Header */}
        <div className="why-luxury-header text-center">
          <div className="why-luxury-eyebrow">
            <span className="eyebrow-beacon"></span>
            <span>THE RYDAX DIFFERENCE</span>
          </div>

          <h2 className="why-luxury-title">
            WHY CAR ENTHUSIASTS CHOOSE <span>RYDAX</span>
          </h2>

          <p className="why-luxury-subtitle">
            We don't just clean cars. We restore and protect automotive investments using climate-controlled clean rooms, certified master detailers, and authentic aerospace-grade materials.
          </p>
        </div>

        {/* 2-Column Luxury Showcase (Left: Interactive Pillars, Right: Cinematic Viewfinder) */}
        <div className="why-showcase-grid">
          {/* Left Column: 4 Interactive Pillars */}
          <div className="why-pillars-col">
            {pillars.map((pillar, idx) => {
              const isActive = idx === activeIdx;
              return (
                <div
                  key={pillar.id}
                  className={`why-pillar-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  {/* Subtle auto-progress indicator on active item */}
                  {isActive && !isPaused && <div className="pillar-progress-bar"></div>}

                  <div className="pillar-number-wrap">
                    <span className="pillar-number">{pillar.num}</span>
                    <div className="pillar-line"></div>
                  </div>

                  <div className="pillar-content">
                    <div className="pillar-top-row">
                      <div className="pillar-title-group">
                        <i className={`pillar-icon ${pillar.icon}`}></i>
                        <h3 className="pillar-title">{pillar.title}</h3>
                      </div>
                      <span className="pillar-active-arrow">
                        <i className="bi bi-chevron-right"></i>
                      </span>
                    </div>

                    <p className="pillar-desc">{pillar.subtitle}</p>

                    <div className="pillar-tags">
                      {pillar.tags.map((tag, tIdx) => (
                        <span className="pillar-tag" key={tIdx}>
                          <i className="bi bi-check2"></i> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Cinematic Studio Viewfinder Stage */}
          <div className="why-visual-col">
            <div className="why-visual-frame">
              {/* Luxury Viewfinder Corner Marks */}
              <div className="vf-corner vf-tl"></div>
              <div className="vf-corner vf-tr"></div>
              <div className="vf-corner vf-bl"></div>
              <div className="vf-corner vf-br"></div>

              {/* Crossfade Image Stack (Zero Flicker) */}
              <div className="why-images-stack">
                {pillars.map((p, pIdx) => (
                  <img
                    key={p.id}
                    src={p.image}
                    alt={p.title}
                    className={`why-visual-img ${pIdx === activeIdx ? "img-visible" : "img-hidden"}`}
                  />
                ))}
              </div>

              {/* Gradient Darkening Overlay */}
              <div className="why-visual-gradient"></div>

              {/* Top Viewfinder Bar */}
              <div className="why-visual-topbar">
                <div className="why-visual-badge">
                  <i className={activePillar.icon}></i>
                  <span>{activePillar.badgeText}</span>
                </div>

                <div className="why-visual-counter">
                  <span className="counter-current">0{activeIdx + 1}</span>
                  <span className="counter-sep">/</span>
                  <span className="counter-total">04</span>
                </div>
              </div>

              {/* Bottom Stat & Description Card */}
              <div className="why-visual-footer">
                <div className="visual-stat-block">
                  <div className="stat-number-wrap">
                    <span className="visual-stat-value">{activePillar.statValue}</span>
                    <span className="visual-stat-unit">{activePillar.statUnit}</span>
                  </div>
                  <span className="visual-stat-label">{activePillar.statLabel}</span>
                </div>

                <div className="visual-info-block">
                  <h4 className="visual-info-title">{activePillar.title}</h4>
                  <p className="visual-info-desc">{activePillar.detail}</p>
                </div>

                <div className="visual-action-btn">
                  <Link to="/contact-us" className="visual-consult-link" title="Book Studio Session">
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Trust & Credentials Strip */}
        <div className="why-trust-strip">
          {trustStats.map((item, index) => (
            <div className="trust-stat-item" key={index}>
              <div className="trust-icon-box">
                <i className={item.icon}></i>
              </div>
              <div className="trust-stat-text">
                <span className="trust-val">{item.val}</span>
                <span className="trust-label">{item.label}</span>
              </div>
              {index < trustStats.length - 1 && <div className="trust-divider"></div>}
            </div>
          ))}
        </div>

        {/* Clean, Simple Comparison Section (Ordinary vs RYDAX) */}
        <div className="why-compare-strip">
          <div className="compare-strip-header">
            <div className="compare-header-title">
              <span className="compare-beacon"></span>
              <h3>THE CRAFTSMANSHIP BENCHMARK</h3>
            </div>
            <div className="compare-legend">
              <span className="legend-chip ordinary">
                <i className="bi bi-x-circle-fill"></i> Standard Garage
              </span>
              <span className="legend-chip rydax">
                <i className="bi bi-check-circle-fill"></i> RYDAX Atelier
              </span>
            </div>
          </div>

          <div className="compare-grid">
            {comparisons.map((item, index) => (
              <div className="compare-row" key={index}>
                <div className="compare-feature">
                  <div className="compare-icon-box">
                    <i className={item.icon}></i>
                  </div>
                  <span className="compare-feature-name">{item.title}</span>
                </div>

                {/* Ordinary Garage */}
                <div className="compare-side ordinary-side">
                  <span className="side-label fail-label">
                    <i className="bi bi-x-circle-fill"></i> Standard
                  </span>
                  <p className="side-text">{item.ordinary}</p>
                </div>

                {/* RYDAX Studio */}
                <div className="compare-side rydax-side">
                  <span className="side-label pass-label">
                    <i className="bi bi-check-circle-fill"></i> RYDAX Atelier
                  </span>
                  <p className="side-text">{item.rydax}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reassuring Atelier Note */}
          <div className="compare-footer-note">
            <i className="bi bi-shield-lock-fill"></i>
            <span>Every vehicle treated at RYDAX undergoes a 40-point inspection and permanent paint depth calibration before handover.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;