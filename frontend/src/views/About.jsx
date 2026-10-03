import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "../css/about.css";
import { Seo } from "../component/Seo.jsx";

const About = () => {
  const canvasRef = useRef(null);
  const [timeline, setTimeline] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchTimeline = async () => {
    try {
      const res = await axios.get("about-timeline/about-timeline");
      if (res.data.success) {
        setTimeline(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch timeline data");
      console.error("Timeline fetch error", error);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  useEffect(() => {
    if (timeline.length > 0 && !activeId) {
      setActiveId(timeline[0]._id);
      setActiveImage(timeline[0].images?.[0]?.url || null);
    }
  }, [timeline, activeId]);

  const activeStory = useMemo(() => {
    return timeline.find((item) => item._id === activeId) || timeline[0];
  }, [timeline, activeId]);

  const previewImages = activeStory?.images || [];

  const handleSelectStory = (item) => {
    setActiveId(item._id);
    setActiveImage(item.images?.[0]?.url || null);
  };

  const openPreview = (url) => {
    setPreview(url);
  };

  const closePreview = () => {
    setPreview(null);
  };

  const changePreviewImage = (direction) => {
    if (!previewImages.length || !preview) return;

    const currentIndex = previewImages.findIndex((img) => img.url === preview);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    let nextIndex = safeIndex + direction;

    if (nextIndex < 0) nextIndex = previewImages.length - 1;
    if (nextIndex >= previewImages.length) nextIndex = 0;

    setPreview(previewImages[nextIndex].url);
    setActiveImage(previewImages[nextIndex].url);
  };

  useEffect(() => {
    if (preview) {
      document.body.classList.add("about-preview-open");
      document.documentElement.classList.add("about-preview-open");
    } else {
      document.body.classList.remove("about-preview-open");
      document.documentElement.classList.remove("about-preview-open");
    }

    return () => {
      document.body.classList.remove("about-preview-open");
      document.documentElement.classList.remove("about-preview-open");
    };
  }, [preview]);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (!preview) return;

      if (e.key === "Escape") {
        closePreview();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        changePreviewImage(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        changePreviewImage(1);
      }
    };

    if (preview) {
      window.addEventListener("keydown", handleKeydown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [preview, previewImages]);

  // Interactive Aerodynamic Particle Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 130,
      isActive: false,
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isActive = true;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.isActive = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchend", handleMouseLeave);

    const particleCount = Math.min(30, Math.floor(width / 15) || 50);
    const particles = [];

    class StreamParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * width : -20 - Math.random() * 40;
        this.y = Math.random() * height;
        this.speedX = 2.0 + Math.random() * 3.0;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.length = 20 + Math.random() * 50;
        this.thickness = 0.8 + Math.random() * 1.8;
        this.alpha = 0.15 + Math.random() * 0.55;
        this.isRed = Math.random() > 0.4;
        this.color = this.isRed
          ? `rgba(255, 45, 85, ${this.alpha})`
          : `rgba(255, 110, 0, ${this.alpha * 0.85})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouse.isActive) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.y += Math.sin(angle) * force * 3.8;
            this.x += Math.cos(angle) * force * 2.5;
          }
        }

        if (this.x - this.length > width || this.y < -30 || this.y > height + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x - this.length, this.y);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = "round";
        ctx.stroke();

        if (this.isRed && this.thickness > 1.2) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.thickness * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new StreamParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  const statsData = [
    {
      icon: "bi bi-car-front-fill",
      value: "5,000+",
      label: "Vehicles Transformed",
    },
    {
      icon: "bi bi-shield-check",
      value: "10+",
      label: "Years of Craftsmanship",
    },
    {
      icon: "bi bi-star-fill",
      value: "99.8%",
      label: "Client Satisfaction",
    },
    {
      icon: "bi bi-patch-check-fill",
      value: "Certified",
      label: "Master Technicians",
    },
  ];

  const bentoFeatures = [
    {
      badge: "Environment",
      icon: "bi bi-snow",
      title: "Climate-Controlled Bay",
      desc: "Dust-free, temperature-stabilized clean room engineered specifically for zero-defect PPF bonding and optimal ceramic coating cure.",
      pills: [
        { icon: "bi bi-wind", label: "HEPA Filtration" },
        { icon: "bi bi-thermometer-half", label: "22°C Stabilized" },
        { icon: "bi bi-lightbulb", label: "Anti-Static Lighting" },
      ],
    },
    {
      badge: "Exclusive Portal",
      icon: "bi bi-safe2",
      title: "Real-Time Car Vault",
      desc: "Private online portal for every vehicle owner to track high-resolution inspection photos, service logs, and digital warranty certificates anytime.",
      pills: [
        { icon: "bi bi-shield-lock", label: "Digital Warranty" },
        { icon: "bi bi-camera", label: "Inspection Archive" },
        { icon: "bi bi-clock-history", label: "Service Logs" },
      ],
    },
    {
      badge: "Craftsmanship",
      icon: "bi bi-layers-half",
      title: "Multi-Stage Correction",
      desc: "Scientific digital paint depth gauging and precision machine polishing that permanently erases swirls without sacrificing OEM clear coat.",
      pills: [
        { icon: "bi bi-speedometer2", label: "Digital Depth Gauge" },
        { icon: "bi bi-magic", label: "Multi-Step Polish" },
        { icon: "bi bi-check2-circle", label: "Zero Swirls" },
      ],
    },
    {
      badge: "Material Science",
      icon: "bi bi-shield-shaded",
      title: "Self-Healing Technology",
      desc: "Thermoplastic polyurethane films with elastomeric top coats that heal micro-scratches with heat, paired with ultra-hydrophobic 9H ceramic matrices.",
      pills: [
        { icon: "bi bi-gem", label: "9H Ceramic Matrix" },
        { icon: "bi bi-arrow-repeat", label: "Self-Healing TPU" },
        { icon: "bi bi-droplet-half", label: "Hydrophobic Shield" },
      ],
    },
  ];

  const StoryDetail = ({ story }) => {
    const firstImage = story.images?.[0]?.url || null;
    const selectedImage =
      activeId === story._id ? activeImage || firstImage : firstImage;

    return (
      <div className="mobile-story-detail">
        <p>{story.description}</p>

        {selectedImage && (
          <div className="mobile-story-image" onClick={() => openPreview(selectedImage)}>
            <img src={selectedImage} alt={story.title} />
            <span>
              <i className="bi bi-arrows-fullscreen"></i>
              Expand
            </span>
          </div>
        )}

        {story.images?.length > 0 && (
          <div className="mobile-story-thumbs">
            {story.images.map((img, index) => (
              <button
                type="button"
                key={index}
                className={`mobile-story-thumb ${
                  selectedImage === img.url ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(img.url);
                }}
              >
                <img src={img.url} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="about-page bg-black text-white">
      <Seo
        title="About RYDAX Studio | Built With Passion For Cars"
        description="Learn about RYDAX Studio, our journey, master detailing experts, climate-controlled studio, and commitment to luxury automotive excellence."
      />

      {/* Hero Section with Interactive Aerodynamic Canvas */}
      <section className="about-hero-section">
        <canvas ref={canvasRef} className="about-hero-canvas" />

        <div className="container text-center position-relative" style={{ zIndex: 2 }}>
          <div className="section-top-title">
            <span></span>
            <p>ABOUT RYDAX STUDIO</p>
            <span></span>
          </div>

          <h1 className="about-main-title">
            Crafting Automotive <span>Perfection</span>
          </h1>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {statsData.map((stat, idx) => (
              <div className="about-stat-card" key={idx}>
                <div className="about-stat-icon">
                  <i className={stat.icon}></i>
                </div>
                <div className="about-stat-value">{stat.value}</div>
                <p className="about-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RYDAX Journey (Timeline Showcase) */}
      <section className="about-journey-section">
        <div className="container">
          <div className="services-heading text-center">
            <div className="section-top-title">
              <span></span>
              <p>OUR EVOLUTION</p>
              <span></span>
            </div>
            <h2 className="services-title">
              The RYDAX <span>Journey</span>
            </h2>
            <p className="services-subtitle">
              A visual chronicle of milestones, technical breakthroughs, and relentless dedication to automotive care.
            </p>
          </div>

          {activeStory && (
            <>
              {/* Desktop Showcase */}
              <div className="journey-showcase desktop-journey-view">
                <div className="journey-feature-card">
                  <div className="journey-card-header">
                    <div>
                      <h3>{activeStory.title}</h3>
                    </div>

                    <div className="journey-image-count">
                      <i className="bi bi-images"></i>
                      {activeStory.images?.length || 0} Photos
                    </div>
                  </div>

                  <p>{activeStory.description}</p>

                  {activeImage && (
                    <div
                      className="journey-main-image"
                      onClick={() => openPreview(activeImage)}
                      title="Click to view fullscreen"
                    >
                      <img src={activeImage} alt={activeStory.title} />
                      <div className="journey-image-overlay">
                        <i className="bi bi-arrows-fullscreen"></i>
                        Click to view full photo
                      </div>
                      <span className="journey-image-label">RYDAX / {activeStory.year}</span>
                    </div>
                  )}

                  {activeStory.images?.length > 0 && (
                    <div className="journey-thumbs">
                      {activeStory.images.map((img, index) => (
                        <button
                          type="button"
                          key={index}
                          className={`journey-thumb ${
                            activeImage === img.url ? "active" : ""
                          }`}
                          onClick={() => setActiveImage(img.url)}
                          title="View photo"
                        >
                          <img src={img.url} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Rail List */}
                <div className="journey-rail">
                  {timeline.map((item, index) => (
                    <button
                      type="button"
                      key={item._id}
                      className={`journey-rail-item ${
                        activeId === item._id ? "active" : ""
                      }`}
                      onClick={() => handleSelectStory(item)}
                    >
                      <span className="rail-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <small>{item.year}</small>
                        <strong>{item.title}</strong>
                      </div>

                      <i className="bi bi-chevron-right"></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Accordion */}
              <div className="mobile-journey-view">
                {timeline.map((item, index) => {
                  const isActive = activeId === item._id;
                  return (
                    <div className={`mobile-story-item ${isActive ? "active" : ""}`} key={item._id}>
                      <button
                        type="button"
                        className="mobile-story-head"
                        onClick={() => handleSelectStory(item)}
                      >
                        <span className="rail-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>
                          <small>{item.year}</small>
                          <strong>{item.title}</strong>
                        </div>

                        <i className={`bi ${isActive ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                      </button>

                      {isActive && <StoryDetail story={item} />}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Luxury Bento Grid ("The Studio Standard") */}
      <section className="about-bento-section">
        <div className="container">
          <div className="services-heading text-center">
            <div className="section-top-title">
              <span></span>
              <p>THE RYDAX STANDARD</p>
              <span></span>
            </div>
            <h2 className="services-title">
              Engineered For <span>Pure Perfection</span>
            </h2>
          </div>

          <div className="about-bento-grid">
            {bentoFeatures.map((feat, index) => (
              <div className="bento-card" key={index}>
                <div className="bento-card-top">
                  <div className="bento-card-icon">
                    <i className={feat.icon}></i>
                  </div>
                  <span className="bento-card-badge">{feat.badge}</span>
                </div>

                <h4>{feat.title}</h4>
                <p className="bento-card-desc">{feat.desc}</p>

                <div className="bento-card-pills">
                  {feat.pills.map((pill, pIdx) => (
                    <span className="bento-pill" key={pIdx}>
                      <i className={pill.icon}></i>
                      {pill.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Brand Statement */}
      <section className="about-quote-section">
        <div className="container">
          <div className="about-quote-box">
            <div className="about-quote-icon">
              <i className="bi bi-quote"></i>
            </div>
            <p className="about-quote-text">
              "To us, automotive detailing isn't merely a service—it is the relentless pursuit of perfection.
              We treat every machine that enters our studio as a canvas of engineering art."
            </p>
            <div className="about-quote-author">
              <strong>RYDAX STUDIO</strong>
              <span>AHMEDABAD, INDIA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Call-To-Action Banner */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <h2 className="about-cta-title">
              Ready To Give Your Vehicle The <span>RYDAX Treatment?</span>
            </h2>
            <p className="about-cta-subtitle">
              Explore our comprehensive service packages or consult with our master detailing technicians today.
            </p>
            <div className="about-cta-actions">
              <Link to="/online-services" className="about-cta-primary">
                <i className="bi bi-lightning-charge-fill"></i>
                Explore Services & Pricing
              </Link>
              <Link to="/contact-us" className="about-cta-secondary">
                <i className="bi bi-chat-dots-fill"></i>
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Preview Modal */}
      {preview && (
        <div className="about-image-preview" onClick={closePreview}>
          {previewImages.length > 1 && (
            <>
              <button
                type="button"
                className="preview-nav preview-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  changePreviewImage(-1);
                }}
                title="Previous photo"
              >
                <i className="bi bi-chevron-left"></i>
              </button>

              <button
                type="button"
                className="preview-nav preview-next"
                onClick={(e) => {
                  e.stopPropagation();
                  changePreviewImage(1);
                }}
                title="Next photo"
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}

          <button
            type="button"
            className="about-preview-close"
            onClick={closePreview}
            title="Close preview"
          >
            ×
          </button>

          <img
            src={preview}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default About;