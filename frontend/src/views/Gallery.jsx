import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/gallery.css";
import { Seo } from "../component/Seo.jsx";

const PAGE_SIZE = 12;
const PLACEHOLDER_IMG = "https://placehold.co/600x450/161616/ff4d4d?text=RYDAX+Studio";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [categories, setCategories] = useState(["ALL"]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const requestIdRef = useRef(0);
  const loadMoreRef = useRef(null);
  const modalHistoryRef = useRef(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch gallery images with pagination and category filtering
  const fetchImages = useCallback(async (category, nextPage = 1, replace = false) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);

    try {
      const res = await axios.get("gallery/gallery", {
        params: {
          service: category !== "ALL" ? category : undefined,
          type: "SINGLE",
          page: nextPage,
          limit: PAGE_SIZE,
        },
      });

      if (requestId !== requestIdRef.current) return;

      if (res.data?.success) {
        const nextImages = res.data.data || [];
        setImages((currentImages) => {
          if (replace) return nextImages;

          const existingIds = new Set(currentImages.map((image) => image._id));
          return [...currentImages, ...nextImages.filter((image) => !existingIds.has(image._id))];
        });
        setPage(nextPage);
        setHasMore(res.data.pagination?.hasMore ?? nextImages.length === PAGE_SIZE);
      } else {
        toast.error(res.data?.message || "Failed to load gallery");
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      toast.error("Error loading gallery images");
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  // Fetch dynamic categories safely from public service endpoint
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let res;
        try {
          res = await axios.get("service/services");
        } catch {
          res = await axios.get("service/admin/services");
        }

        if (res.data?.success && Array.isArray(res.data?.data)) {
          const dynamicCats = res.data.data.map((s) => s.title).filter(Boolean);
          setCategories(["ALL", ...new Set(dynamicCats)]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Category switch: reset & fetch
  useEffect(() => {
    setImages([]);
    setActiveIndex(null);
    setPage(1);
    setHasMore(true);
    fetchImages(activeCategory, 1, true);
  }, [activeCategory, fetchImages]);

  // Infinite scroll observer
  useEffect(() => {
    const loadMore = loadMoreRef.current;
    if (!loadMore || !hasMore || images.length === 0) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          fetchImages(activeCategory, page + 1);
        }
      },
      { rootMargin: "350px 0px" }
    );

    observer.observe(loadMore);
    return () => observer.disconnect();
  }, [activeCategory, fetchImages, hasMore, images.length, isLoading, page]);

  // Preload adjacent images in lightbox for instantaneous transitions
  useEffect(() => {
    if (activeIndex !== null && images.length > 0) {
      const nextIdx = (activeIndex + 1) % images.length;
      const prevIdx = (activeIndex - 1 + images.length) % images.length;
      if (images[nextIdx]?.imageUrl) {
        const imgNext = new Image();
        imgNext.src = images[nextIdx].imageUrl;
      }
      if (images[prevIdx]?.imageUrl) {
        const imgPrev = new Image();
        imgPrev.src = images[prevIdx].imageUrl;
      }
    }
  }, [activeIndex, images]);

  const openModal = (index) => {
    setActiveIndex(index);

    if (!modalHistoryRef.current) {
      window.history.pushState({ galleryModal: true }, "");
      modalHistoryRef.current = true;
    }
  };

  const closeModal = () => {
    setActiveIndex(null);

    if (modalHistoryRef.current && window.history.state?.galleryModal) {
      modalHistoryRef.current = false;
      window.history.back();
    } else {
      modalHistoryRef.current = false;
    }
  };

  const closeModalOnly = () => {
    setActiveIndex(null);
    modalHistoryRef.current = false;
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (!images.length) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (!images.length) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (activeIndex === null || images.length <= 1) return;

    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) < 40) return;

    if (distance > 0) {
      handleNext();
    } else {
      handlePrev();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeIndex === null) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext(e);
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev(e);
      }

      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  // Modal body scroll lock & back button handler
  useEffect(() => {
    const handlePopState = () => {
      if (activeIndex !== null) {
        closeModalOnly();
      }
    };

    if (activeIndex !== null) {
      document.body.classList.add("gallery-preview-open");
      document.documentElement.classList.add("gallery-preview-open");
      window.addEventListener("popstate", handlePopState);
    } else {
      document.body.classList.remove("gallery-preview-open");
      document.documentElement.classList.remove("gallery-preview-open");
      window.removeEventListener("popstate", handlePopState);
    }

    return () => {
      document.body.classList.remove("gallery-preview-open");
      document.documentElement.classList.remove("gallery-preview-open");
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeIndex]);

  const downloadImage = async (url, filename) => {
    try {
      if (!url) return;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${filename || "rydax-gallery"}.jpg`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Image downloaded");
    } catch (error) {
      toast.error("Failed to download image");
      console.error("Download failed", error);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = PLACEHOLDER_IMG;
  };

  return (
    <div className="gallery-page-wrapper">
      <Seo
        title="Car Detailing & PPF Gallery | RYDAX Studio Ahmedabad"
        description="Browse real car detailing, ceramic coating, paint protection film (PPF) and paint correction projects by RYDAX Studio."
      />

      {/* HERO SECTION */}
      <div className="gallery-hero">
        <div className="container">
          <div className="gallery-hero-badge">
            <span className="gallery-dot"></span>
            <span>Studio Portfolio • Real Transformations</span>
          </div>

          <h1 className="gallery-hero-title">
            Our <span>Gallery</span>
          </h1>

          <p className="gallery-hero-desc">
            Explore the precision craftsmanship, ceramic coatings, and self-healing PPF installations completed on luxury vehicles at RYDAX Studio.
          </p>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="container mb-4">
        <div className="gallery-category-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`gallery-cat-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="container pb-5">
        <div className="row g-3 g-md-4">
          {/* Skeleton Loaders */}
          {isLoading && images.length === 0 &&
            Array.from({ length: PAGE_SIZE }, (_, index) => (
              <div key={`gallery-skel-${index}`} className="col-6 col-md-4 col-lg-3">
                <div className="gallery-skeleton" aria-hidden="true" />
              </div>
            ))}

          {/* Real Gallery Cards */}
          {images.map((item, index) => (
            <div key={item._id || index} className="col-6 col-md-4 col-lg-3">
              <div
                className="gallery-card"
                onClick={() => openModal(index)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || "RYDAX Studio"}
                  loading="lazy"
                  decoding="async"
                  onError={handleImageError}
                />

                <div className="gallery-card-overlay">
                  <h5 className="gallery-card-title">{item.title || "RYDAX Studio"}</h5>
                  {item.service && (
                    <p className="gallery-card-service">{item.service}</p>
                  )}
                </div>

                <div className="gallery-expand-icon">
                  <i className="bi bi-arrows-fullscreen"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && images.length === 0 && (
          <div className="gallery-empty-state">
            <i className="bi bi-images fs-1 d-block mb-2 text-secondary"></i>
            No images found in this category.
          </div>
        )}

        {/* Infinite Scroll Status */}
        <div ref={loadMoreRef} className="gallery-load-status" aria-live="polite">
          {isLoading && images.length > 0 && <span className="gallery-loader-spinner" />}
          {!isLoading && images.length > 0 && !hasMore && (
            <span>You have reached the end of our gallery.</span>
          )}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {activeIndex !== null && images[activeIndex] && (
        <div className="gallery-preview-modal" onClick={closeModal}>
          <div
            className="gallery-preview-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Info & Action Bar */}
            <div className="gallery-modal-topbar">
              <div className="gallery-modal-meta">
                <p className="gallery-modal-title">
                  {images[activeIndex].title || "RYDAX Studio"}
                </p>
                {images[activeIndex].service && (
                  <p className="gallery-modal-service">{images[activeIndex].service}</p>
                )}
              </div>

              <div className="gallery-modal-actions">
                <button
                  type="button"
                  className="gallery-preview-btn"
                  title="Download Image"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(
                      images[activeIndex].imageUrl,
                      images[activeIndex].title || `rydax-gallery-${activeIndex + 1}`
                    );
                  }}
                >
                  <i className="bi bi-download"></i>
                </button>

                <button
                  type="button"
                  className="gallery-preview-btn"
                  title="Close Preview"
                  onClick={closeModal}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            {/* Prev / Next Navigation */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-nav-btn gallery-nav-prev"
                  onClick={handlePrev}
                  title="Previous Image (Left Arrow)"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>

                <button
                  type="button"
                  className="gallery-nav-btn gallery-nav-next"
                  onClick={handleNext}
                  title="Next Image (Right Arrow)"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </>
            )}

            {/* Preview Image */}
            <img
              src={images[activeIndex].imageUrl}
              alt={images[activeIndex].title || "RYDAX Detailing Preview"}
              onError={handleImageError}
            />

            {/* Counter */}
            <div className="gallery-preview-counter">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
