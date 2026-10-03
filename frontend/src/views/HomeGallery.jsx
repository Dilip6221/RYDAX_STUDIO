import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "../css/home.css";

// Interactive Card with Draggable/Hoverable Before-After Split
const GalleryCard = ({ item, onOpenModal }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleMouseMove = (e) => {
    // Only adjust on mouse move if hovering
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseLeave = () => {
    // Gently reset to 50%
    setSliderPos(50);
  };

  return (
    <div className="luxury-gallery-card">
      {/* Top Card Header */}
      <div className="lgc-top-bar">
        <span className="lgc-service-badge">
          <span className="lgc-beacon"></span>
          {item.service || "STUDIO TRANSFORMATION"}
        </span>
        <button
          type="button"
          className="lgc-zoom-btn"
          onClick={() => onOpenModal(item)}
          title="Fullscreen Comparison"
        >
          <i className="bi bi-arrows-fullscreen"></i>
        </button>
      </div>

      {/* Interactive Visual Split Viewport */}
      <div
        className="lgc-viewport"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onClick={() => onOpenModal(item)}
      >
        {/* Layer 1: AFTER image (base full width) */}
        <div className="lgc-img-layer lgc-after-layer">
          <img
            src={item.afterImage?.url || item.imageUrl}
            alt={`${item.title || "Vehicle"} After`}
            loading="lazy"
          />
          <span className="lgc-tag tag-after">
            <i className="bi bi-check2-circle"></i> AFTER
          </span>
        </div>

        {/* Layer 2: BEFORE image (clipped to sliderPos) */}
        <div
          className="lgc-img-layer lgc-before-layer"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <img
            src={item.beforeImage?.url || item.imageUrl}
            alt={`${item.title || "Vehicle"} Before`}
            loading="lazy"
          />
          <span className="lgc-tag tag-before">
            <i className="bi bi-exclamation-circle"></i> BEFORE
          </span>
        </div>

        {/* Laser Divider Beam */}
        <div className="lgc-laser-divider" style={{ left: `${sliderPos}%` }}>
          <div className="lgc-laser-line"></div>
          <div className="lgc-laser-handle">
            <i className="bi bi-chevron-left"></i>
            <i className="bi bi-chevron-right"></i>
          </div>
        </div>

        {/* Hover Hint Overlay */}
        <div className="lgc-hover-hint">
          <i className="bi bi-cursor-fill"></i>
          <span>Slide to Compare</span>
        </div>
      </div>

      {/* Bottom Content Bar */}
      <div className="lgc-content" onClick={() => onOpenModal(item)}>
        <h3 className="lgc-title">{item.title || "Precision Studio Restoration"}</h3>
        {item.description ? (
          <p className="lgc-desc">{item.description}</p>
        ) : (
          <p className="lgc-desc">RYDAX - Premium Detailing</p>
        )}

        <div className="lgc-footer-action">
          <span className="lgc-action-link">
            <span>Inspect Full Details</span>
            <i className="bi bi-arrow-right"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

const HomeGallery = ({ serviceName = "", featured = false }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [modalSliderPos, setModalSliderPos] = useState(50);
  const [modalDragging, setModalDragging] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const modalContainerRef = useRef(null);

  const fetchBeforeAfterGallery = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("type", "BEFORE_AFTER");
      if (serviceName) {
        params.append("service", serviceName);
      } else if (featured) {
        params.append("featured", "true");
      }
      const res = await axios.get(`gallery/gallery?${params.toString()}`);
      if (res.data.success) {
        setGalleryItems(res.data.data || []);
      }
    } catch (error) {
      console.error("Before After Gallery Fetch Error:", error);
      toast.error("Failed to load transformations gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeforeAfterGallery();
  }, [serviceName, featured]);

  // Derive unique categories from active items
  const categories = [
    "ALL",
    ...Array.from(new Set(galleryItems.map((item) => item.service).filter(Boolean))),
  ];

  // Filter items based on selected category
  const filteredItems =
    selectedCategory === "ALL"
      ? galleryItems
      : galleryItems.filter((item) => item.service === selectedCategory);

  const closeModal = () => {
    if (window.history.state?.galleryModal) {
      window.history.back();
    } else {
      setActiveItem(null);
    }
  };

  // Keyboard navigation inside modal (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeItem) return;
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        navigateModal(-1);
      } else if (e.key === "ArrowRight") {
        navigateModal(1);
      }
    };

    if (activeItem) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeItem, filteredItems]);

  const navigateModal = (direction) => {
    if (!activeItem || filteredItems.length <= 1) return;
    const curIdx = filteredItems.findIndex((x) => x._id === activeItem._id);
    if (curIdx === -1) return;
    const nextIdx = (curIdx + direction + filteredItems.length) % filteredItems.length;
    setActiveItem(filteredItems[nextIdx]);
    setModalSliderPos(50);
  };

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activeItem) {
      document.body.classList.add("gallery-modal-open");
      document.documentElement.classList.add("gallery-modal-open");
    } else {
      document.body.classList.remove("gallery-modal-open");
      document.documentElement.classList.remove("gallery-modal-open");
    }

    return () => {
      document.body.classList.remove("gallery-modal-open");
      document.documentElement.classList.remove("gallery-modal-open");
    };
  }, [activeItem]);

  // Modal slider drag handlers
  const handleModalMove = (clientX) => {
    if (!modalContainerRef.current) return;
    const rect = modalContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setModalSliderPos(percent);
  };

  const handleModalMouseMove = (e) => {
    if (!modalDragging) return;
    handleModalMove(e.clientX);
  };

  const handleModalTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleModalMove(e.touches[0].clientX);
    }
  };

  if (!loading && !galleryItems.length) return null;

  const currentItemIndex = activeItem
    ? filteredItems.findIndex((item) => item._id === activeItem._id) + 1
    : 1;

  return (
    <section className="home-gallery-section" id="gallery-transformations">
      {/* Ambient background glows */}
      <div className="gallery-ambient-top"></div>
      <div className="gallery-ambient-bottom"></div>

      <div className="home-gallery-container">
        {/* Luxury Section Header */}
        <div className="services-heading text-center">
          <div className="gallery-atelier-chip">
            <span className="gallery-beacon"></span>
            <span className="gallery-chip-text">VERIFIED RESTORATIONS</span>
          </div>

          <h2 className="services-title">
            REAL <span>TRANSFORMATIONS</span>
          </h2>

          <p className="services-subtitle">
            Inspect our physical before-and-after detailing results. Slide any car below to reveal true mirror depth.
          </p>
        </div>

        {/* Dynamic Category Filter Dock */}
        {categories.length > 2 && (
          <div className="gallery-filter-dock">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`gallery-filter-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Swiper Carousel with Custom Luxury Navigation */}
        <div className="gallery-carousel-wrapper">
          {/* Custom Nav Arrow Left */}
          <button ref={prevRef} className="gallery-nav-arrow arrow-prev" aria-label="Previous Slide">
            <i className="bi bi-chevron-left"></i>
          </button>

          {/* Custom Nav Arrow Right */}
          <button ref={nextRef} className="gallery-nav-arrow arrow-next" aria-label="Next Slide">
            <i className="bi bi-chevron-right"></i>
          </button>

          {loading ? (
            <div className="gallery-skeleton-grid">
              {[1, 2, 3].map((s) => (
                <div key={s} className="gallery-skeleton-card">
                  <div className="skeleton-image-box"></div>
                  <div className="skeleton-line-long"></div>
                  <div className="skeleton-line-short"></div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Navigation]}
              loop={filteredItems.length > 3}
              speed={800}
              spaceBetween={24}
              slidesPerView={3}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                320: { slidesPerView: 1.1, spaceBetween: 16 },
                576: { slidesPerView: 1.4, spaceBetween: 18 },
                768: { slidesPerView: 2, spaceBetween: 22 },
                1200: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="home-gallery-swiper"
            >
              {filteredItems.map((item) => (
                <SwiperSlide key={item._id}>
                  <GalleryCard
                    item={item}
                    onOpenModal={(itemToOpen) => {
                      setActiveItem(itemToOpen);
                      setModalSliderPos(50);
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* FULLSCREEN MASTER LIGHTBOX THEATRE */}
      {activeItem && (
        <div className="luxury-modal-overlay" onClick={closeModal}>
          <div
            className="luxury-modal-theater"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleModalMouseMove}
            onMouseUp={() => setModalDragging(false)}
            onMouseLeave={() => setModalDragging(false)}
            onTouchEnd={() => setModalDragging(false)}
          >
            {/* Modal Header */}
            <div className="lmt-header">
              <div className="lmt-title-group">
                <span className="lmt-service-badge">
                  <i className="bi bi-patch-check-fill"></i>
                  {activeItem.service || "STUDIO RESTORATION"}
                </span>
                <h3 className="lmt-title">{activeItem.title || "Master Transformation Result"}</h3>
              </div>

              <div className="lmt-header-actions">
                <span className="lmt-counter">
                  {currentItemIndex} / {filteredItems.length}
                </span>
                <button
                  type="button"
                  className="lmt-close-btn"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            {/* Giant Draggable Before/After Viewport */}
            <div
              className="lmt-viewport"
              ref={modalContainerRef}
              onMouseDown={() => setModalDragging(true)}
              onTouchStart={() => setModalDragging(true)}
              onTouchMove={handleModalTouchMove}
            >
              {/* Layer 1: AFTER image */}
              <div className="lmt-img-layer lmt-after-layer">
                <img
                  src={activeItem.afterImage?.url || activeItem.imageUrl}
                  alt={`${activeItem.title} After`}
                />
                <span className="lmt-floating-tag tag-after">
                  <i className="bi bi-gem"></i> AFTER
                </span>
              </div>

              {/* Layer 2: BEFORE image (clipped to modalSliderPos) */}
              <div
                className="lmt-img-layer lmt-before-layer"
                style={{
                  clipPath: `polygon(0 0, ${modalSliderPos}% 0, ${modalSliderPos}% 100%, 0 100%)`,
                }}
              >
                <img
                  src={activeItem.beforeImage?.url || activeItem.imageUrl}
                  alt={`${activeItem.title} Before`}
                />
                <span className="lmt-floating-tag tag-before">
                  <i className="bi bi-exclamation-triangle-fill"></i> BEFORE 
                </span>
              </div>

              {/* Draggable Laser Divider Line & Handle */}
              <div className="lmt-divider-beam" style={{ left: `${modalSliderPos}%` }}>
                <div className="lmt-beam-glow"></div>
                <div className="lmt-drag-handle">
                  <span className="handle-chevron">◀</span>
                  <span className="handle-percent">{Math.round(modalSliderPos)}%</span>
                  <span className="handle-chevron">▶</span>
                </div>
              </div>

              {/* Left/Right Fast Flip Arrows */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    className="lmt-nav-btn lmt-prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateModal(-1);
                    }}
                    title="Previous Transformation"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button
                    type="button"
                    className="lmt-nav-btn lmt-next"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateModal(1);
                    }}
                    title="Next Transformation"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </>
              )}
            </div>

            {/* Quick Snap Preset Toolbar */}
            <div className="lmt-preset-dock">
              <div className="preset-buttons">
                <button
                  type="button"
                  className={`preset-btn ${modalSliderPos === 100 ? "active" : ""}`}
                  onClick={() => setModalSliderPos(100)}
                >
                  Show 100% Before
                </button>
                <button
                  type="button"
                  className={`preset-btn ${modalSliderPos === 50 ? "active" : ""}`}
                  onClick={() => setModalSliderPos(50)}
                >
                  50/50 Dual Split
                </button>
                <button
                  type="button"
                  className={`preset-btn ${modalSliderPos === 0 ? "active" : ""}`}
                  onClick={() => setModalSliderPos(0)}
                >
                  Show 100% After
                </button>
              </div>

              <div className="lmt-drag-prompt">
                <i className="bi bi-arrows-expand"></i>
                <span>Drag laser divider or click presets</span>
              </div>
            </div>

            {/* Modal Footer (Details + CTA) */}
            <div className="lmt-footer">
              <div className="lmt-footer-info">
                {activeItem.description && (
                  <p className="lmt-footer-desc">{activeItem.description}</p>
                )}
              </div>

              <div className="lmt-footer-cta">
                <Link to="/contact-us" className="lmt-book-btn" onClick={closeModal}>
                  <span>Book This Treatment</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeGallery;