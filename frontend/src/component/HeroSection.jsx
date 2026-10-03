import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "../css/home.css";

const SLIDES = [
  {
    id: 1,
    badge: "Aerospace Ceramic Matrix",
    title: "Ceramic Coating",
    highlight: "Mirror Gloss",
    tagline: "Unrivaled gloss, self-cleaning hydrophobic chemistry, and permanent 9H protection.",
    pills: [
      { icon: "bi bi-shield-check", text: "9H+ Hardness" },
      { icon: "bi bi-droplet-half", text: "115° Water Beading" },
      { icon: "bi bi-patch-check", text: "10-Year Warranty" },
    ],
    hotspots: [
      {
        id: "hood-1",
        top: "42%",
        left: "56%",
        title: "Hood & Front Facia",
        spec: "Ceramic Base Coat",
        desc: "9H high-solid nano-matrix shielding against UV oxidation and bird drop etching.",
      },
      {
        id: "door-1",
        top: "52%",
        left: "74%",
        title: "Side Panels & Mirrors",
        spec: "Hydrophobic Top Coat",
        desc: "Extreme 115° water contact angle delivering self-cleaning, dust-shedding gloss.",
      },
      {
        id: "wheel-1",
        top: "68%",
        left: "82%",
        title: "Alloy Wheels & Calipers",
        spec: "Thermal Ceramic Barrier",
        desc: "800°C heat-resistant coating repelling hot corrosive brake dust permanently.",
      },
    ],
    tabLabel: "Ceramic Coating",
    image: "https://res.cloudinary.com/dagsmbnaa/image/upload/v1785567750/photo-1544829099-b9a0c07fad1a_xsulke.avif",
  },
  {
    id: 2,
    badge: "Next-Gen TPU Armor",
    title: "Self-Healing",
    highlight: "PPF Protection",
    tagline: "Instant heat-recovery thermoplastic barrier defending against stone chips and scratches.",
    pills: [
      { icon: "bi bi-layers", text: "8.5 Mil Thickness" },
      { icon: "bi bi-arrow-repeat", text: "Heat Self-Healing" },
      { icon: "bi bi-eye", text: "100% Optical Clarity" },
    ],
    hotspots: [
      {
        id: "hood-2",
        top: "44%",
        left: "52%",
        title: "Full Front Armor",
        spec: "8.5mil TPU Film",
        desc: "High-impact stone chip defense with self-healing elastomeric top coat.",
      },
      {
        id: "door-2",
        top: "54%",
        left: "70%",
        title: "Doors & Rocker Panels",
        spec: "Non-Yellowing UV Shield",
        desc: "Precision plotter-cut edges with zero orange peel and 10-year optical clarity.",
      },
      {
        id: "wheel-2",
        top: "67%",
        left: "84%",
        title: "Wheel Arches",
        spec: "Impact Guard",
        desc: "Protection against road gravel sandblasting and curb rash abrasion.",
      },
    ],
    tabLabel: "PPF Armor",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    badge: "Clean-Room Precision",
    title: "Master Detailing",
    highlight: "Studio Care",
    tagline: "Multi-stage digital paint depth calibration and dust-free climate bays.",
    pills: [
      { icon: "bi bi-snow", text: "Climate-Controlled Bay" },
      { icon: "bi bi-speedometer2", text: "Multi-Stage Polish" },
      { icon: "bi bi-star-fill", text: "99.8% Satisfaction" },
    ],
    hotspots: [
      {
        id: "hood-3",
        top: "43%",
        left: "55%",
        title: "Clear Coat Restoration",
        spec: "Multi-Stage Polish",
        desc: "Digital ultrasonic depth gauge calibration to permanently erase 99% of swirl marks.",
      },
      {
        id: "door-3",
        top: "50%",
        left: "72%",
        title: "Cockpit & Glass",
        spec: "Optical Hydrophobic",
        desc: "Zero-glare windshield rain repellant and anti-fog ceramic glass treatment.",
      },
      {
        id: "wheel-3",
        top: "66%",
        left: "80%",
        title: "Underbody & Exhaust",
        spec: "Detailing & Sealant",
        desc: "Bespoke ceramic exhaust tip polishing and anti-corrosion chassis sealing.",
      },
    ],
    tabLabel: "Studio Care",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2000&auto=format&fit=crop",
  },
];

const AUTO_SLIDE_DURATION = 6500;

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [laserScanning, setLaserScanning] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const heroRef = useRef(null);

  // Trigger laser scanner sweep on slide change
  const triggerLaserScan = useCallback(() => {
    setLaserScanning(true);
    setActiveHotspot(null);
    const timeout = setTimeout(() => {
      setLaserScanning(false);
    }, 1300);
    return () => clearTimeout(timeout);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
    triggerLaserScan();
  }, [triggerLaserScan]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    triggerLaserScan();
  }, [triggerLaserScan]);

  const goToSlide = (index) => {
    if (index === current) return;
    setCurrent(index);
    triggerLaserScan();
  };

  // Initial laser sweep
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLaserScanning(false);
    }, 1300);
    return () => clearTimeout(timeout);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || activeHotspot) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTO_SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, isPaused, activeHotspot, nextSlide]);

  // 3D Parallax Tracking
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const slide = SLIDES[current];

  return (
    <section
      ref={heroRef}
      className="hero-luxury-slider"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Parallax Visual Layer */}
      <div
        className="hero-parallax-layer"
        style={{
          transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 6}deg) scale3d(1.02, 1.02, 1.02)`,
        }}
      >
        {/* Background Supercar Visuals with Ken Burns Effect */}
        {SLIDES.map((item, idx) => (
          <div
            key={item.id}
            className={`hero-bg-slide ${idx === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <div className="hero-bg-vignette"></div>
          </div>
        ))}

        {/* Laser Surface Scanner Sweep Line */}
        {laserScanning && (
          <div className="hero-laser-scanner">
            <div className="laser-beam"></div>
            <div className="laser-sweep-grid"></div>
            <span className="laser-label">
              <i className="bi bi-cpu me-1"></i>
              DIGITAL COAT DEPTH SCANNING...
            </span>
          </div>
        )}

        {/* Interactive Car Protection Hotspots HUD */}
        <div className="hero-hotspots-container">
          {slide.hotspots.map((spot) => {
            const isOpen = activeHotspot?.id === spot.id;
            return (
              <div
                key={spot.id}
                className={`hero-hotspot-marker ${isOpen ? "active" : ""}`}
                style={{ top: spot.top, left: spot.left }}
              >
                {/* Pulsating Radar Button */}
                <button
                  type="button"
                  className="hotspot-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(isOpen ? null : spot);
                  }}
                  title={spot.title}
                  aria-label={spot.title}
                >
                  <span className="hotspot-ping"></span>
                  <span className="hotspot-core">
                    <i className="bi bi-shield-fill"></i>
                  </span>
                </button>

                {/* Floating Glass HUD Spec Card */}
                {isOpen && (
                  <div
                    className="hotspot-hud-card"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="hud-card-header">
                      <span className="hud-spec-tag">{spot.spec}</span>
                      <button
                        type="button"
                        className="hud-close-btn"
                        onClick={() => setActiveHotspot(null)}
                      >
                        ×
                      </button>
                    </div>
                    <h5 className="hud-card-title">{spot.title}</h5>
                    <p className="hud-card-desc">{spot.desc}</p>
                    <div className="hud-pointer-line"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Studio Top HUD */}
      <div className="hero-top-hud">
        <span className="hero-hud-chip">
          <span className="hero-hud-dot"></span>
          RYDAX ATELIER • AHMEDABAD
        </span>
        <span className="hero-hud-slide-counter">
          0{current + 1} <span>/ 0{SLIDES.length}</span>
        </span>
      </div>

      {/* Main Content Area (Mobile-First Visual Layout) */}
      <div className="hero-content-wrapper">
        <div className="hero-visual-card" key={slide.id}>
          {/* Category Chip */}
          <div className="hero-badge-row">
            <span className="hero-badge-pill">
              <i className="bi bi-patch-check-fill me-1"></i>
              {slide.badge}
            </span>
          </div>

          {/* Cinematic Title */}
          <h1 className="hero-main-heading">
            {slide.title} <span>{slide.highlight}</span>
          </h1>

          {/* 1-Line Punchy Tagline */}
          <p className="hero-tagline">{slide.tagline}</p>

          {/* Floating Horizontal Spec Pills */}
          <div className="hero-spec-pills-row">
            {slide.pills.map((pill, i) => (
              <span className="hero-spec-pill" key={i}>
                <i className={`${pill.icon} me-1`}></i>
                {pill.text}
              </span>
            ))}
          </div>

          {/* Sleek Action Buttons */}
          <div className="hero-action-row">
            <Link to="/contact-us" className="hero-primary-btn">
              <span>Book Studio Session</span>
              <i className="bi bi-arrow-right"></i>
            </Link>

            <Link to="/services" className="hero-secondary-btn">
              Explore Services
            </Link>

            <a
              href="https://wa.me/919313015917"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-icon-btn"
              title="Instant WhatsApp Consultation"
            >
              <i className="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Luxury Supercar Glass Thumbnail Dock & Controls */}
      <div className="hero-bottom-controls">
        <div className="hero-dock-wrapper">
          {SLIDES.map((item, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={item.id}
                type="button"
                className={`hero-dock-item ${isActive ? "active" : ""}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Switch to ${item.tabLabel}`}
              >
                {/* Mini Supercar Thumbnail */}
                <div className="hero-dock-thumb">
                  <img src={item.image} alt={item.tabLabel} loading="lazy" />
                  <div className="dock-thumb-overlay"></div>
                </div>

                {/* Meta & Progress Fill */}
                <div className="hero-dock-info">
                  <div className="hero-dock-meta">
                    <span className="hero-dock-idx">0{idx + 1}</span>
                    <span className="hero-dock-name">{item.tabLabel}</span>
                  </div>
                  <div className="hero-dock-track">
                    <div
                      className={`hero-dock-fill ${
                        isActive && !isPaused && !activeHotspot ? "running" : ""
                      }`}
                      style={{ animationDuration: `${AUTO_SLIDE_DURATION}ms` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Prev / Next Minimal Arrows */}
        <div className="hero-nav-pair">
          <button
            type="button"
            className="hero-nav-arrow"
            onClick={prevSlide}
            aria-label="Previous slide"
            title="Previous"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            type="button"
            className="hero-nav-arrow"
            onClick={nextSlide}
            aria-label="Next slide"
            title="Next"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;