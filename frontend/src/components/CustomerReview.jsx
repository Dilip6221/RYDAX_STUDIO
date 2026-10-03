"use client";

import React, { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const CustomerReview = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const REVIEW_LIMIT = 150;

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews");
      if (res.data?.success) {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openReviewModal = (item) => {
    swiperRef.current?.autoplay?.stop();
    setSelectedReview(item);
  };

  const closeReviewModal = () => {
    setSelectedReview(null);
  };

  const shortText = (text = "") => {
    return text.length > REVIEW_LIMIT ? text.slice(0, REVIEW_LIMIT) : text;
  };

  const renderStars = (rating = 5) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill text-warning"></i>);
    }
    if (hasHalf) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    while (stars.length < 5) {
      stars.push(<i key={`empty-${stars.length}`} className="bi bi-star text-muted"></i>);
    }
    return stars;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Verified Client";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <section className="customer-review-section" id="client-testimonials">
      <div className="review-ambient-red"></div>
      <div className="review-ambient-amber"></div>

      <div className="customer-review-container">
        {/* Luxury Header */}
        <div className="services-heading text-center">
          <div className="review-atelier-chip">
            <span className="review-beacon"></span>
            <span className="review-chip-text">CLIENT PROVENANCE</span>
          </div>

          <h2 className="services-title">
            TRUSTED BY <span>DISCERNING OWNERS</span>
          </h2>

          <p className="services-subtitle">
            From supercars to cherished daily drivers, hear why India&apos;s most passionate automotive collectors choose the RYDAX Atelier.
          </p>

          {/* Master Google Rating Trust Dock */}
          <div className="review-trust-dock">
            <div className="trust-dock-score">
              <span className="score-num">4.9</span>
              <div className="score-stars">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
            </div>
            <div className="trust-dock-sep"></div>
            <div className="trust-dock-item">
              <i className="bi bi-patch-check-fill text-success"></i>
              <span>100% Verified Vehicle Owners</span>
            </div>
            <div className="trust-dock-sep"></div>
            <div className="trust-dock-item">
              <i className="bi bi-geo-alt-fill text-danger"></i>
              <span>Ahmedabad Flagship Studio</span>
            </div>
          </div>
        </div>

        {/* Carousel Showcase */}
        {reviews.length > 0 && (
          <div className="review-carousel-wrapper">
            <button
              ref={prevRef}
              className="review-nav-arrow arrow-prev"
              aria-label="Previous Review"
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            <button
              ref={nextRef}
              className="review-nav-arrow arrow-next"
              aria-label="Next Review"
            >
              <i className="bi bi-chevron-right"></i>
            </button>

            <Swiper
              modules={[Autoplay, Navigation]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              loop={reviews.length > 3}
              speed={800}
              spaceBetween={24}
              slidesPerView={3}
              autoplay={{
                delay: 3800,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                320: { slidesPerView: 1.05, spaceBetween: 16 },
                576: { slidesPerView: 1.35, spaceBetween: 18 },
                768: { slidesPerView: 2, spaceBetween: 22 },
                1200: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="review-swiper"
            >
              {reviews.map((item, i) => {
                const isLong = item.review?.length > REVIEW_LIMIT;

                return (
                  <SwiperSlide key={item.id || item._id || i}>
                    <div className="luxury-review-card cursor-pointer" onClick={() => openReviewModal(item)}>
                      <div className="lrc-top-bar">
                        <div className="lrc-stars-wrap">
                          {renderStars(item.rating || 5)}
                          <span className="lrc-rating-number">
                            {Number(item.rating || 5).toFixed(1)}
                          </span>
                        </div>

                        <span className="lrc-verified-pill">
                          <i className="bi bi-patch-check-fill"></i>
                          <span>VERIFIED</span>
                        </span>
                      </div>

                      <i className="bi bi-quote lrc-quote-mark"></i>

                      <p className="lrc-text">
                        &quot;{shortText(item.review)}&quot;
                        {isLong && (
                          <span className="lrc-read-more" onClick={(e) => {
                            e.stopPropagation();
                            openReviewModal(item);
                          }}>
                            ... Read Story
                          </span>
                        )}
                      </p>

                      <div className="lrc-divider"></div>

                      <div className="lrc-user-footer">
                        <div className="lrc-avatar">
                          <span>{item.name?.charAt(0)?.toUpperCase() || "R"}</span>
                        </div>

                        <div className="lrc-user-meta">
                          <h4 className="lrc-user-name">{item.name || "RYDAX Patron"}</h4>
                          <span className="lrc-user-sub">
                            {item.car_model ? `${item.car_model} • ` : ""}Verified Client
                          </span>
                        </div>

                        <div className="lrc-seal-stamp" title="Studio Certified Review">
                          <i className="bi bi-shield-check"></i>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

        {/* FULLSCREEN REVIEW MODAL */}
        {selectedReview && (
          <div className="luxury-review-modal-overlay" onClick={closeReviewModal}>
            <div
              className="luxury-review-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="lrm-close-btn"
                onClick={closeReviewModal}
                aria-label="Close review"
              >
                <i className="bi bi-x-lg"></i>
              </button>

              <div className="lrm-header">
                <span className="lrm-verified-badge">
                  <i className="bi bi-patch-check-fill text-success"></i>
                  <span>VERIFIED CLIENT TESTIMONIAL</span>
                </span>
                <div className="lrm-stars-row">
                  {renderStars(selectedReview.rating || 5)}
                  <span className="lrm-rating-val">
                    {Number(selectedReview.rating || 5).toFixed(1)} / 5.0
                  </span>
                </div>
              </div>

              <div className="lrm-body">
                <i className="bi bi-quote lrm-quote-icon"></i>
                <p className="lrm-review-text">&quot;{selectedReview.review}&quot;</p>
              </div>

              <div className="lrm-divider"></div>

              <div className="lrm-footer">
                <div className="lrm-user-block">
                  <div className="lrm-avatar">
                    <span>{selectedReview.name?.charAt(0)?.toUpperCase() || "R"}</span>
                  </div>
                  <div>
                    <h4 className="lrm-name">{selectedReview.name || "RYDAX Patron"}</h4>
                    <p className="lrm-meta">
                      {selectedReview.car_model ? `${selectedReview.car_model} • ` : ""}Verified Owner • {formatDate(selectedReview.created_at || selectedReview.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="lrm-assurance-badge">
                  <i className="bi bi-shield-lock-fill"></i>
                  <span>RYDAX Certified Review</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReview;
