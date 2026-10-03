"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../utils/api";

const ServiceCard = () => {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/services");
      if (res.data?.success) {
        setServices(res.data.data || []);
      }
    } catch (error) {
      console.error("Fetch services error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getStartingPrice = (packages) => {
    if (!packages || !Array.isArray(packages) || packages.length === 0) return null;
    const validPrices = packages
      .map((p) => Number(p.price))
      .filter((p) => !isNaN(p) && p > 0);
    if (validPrices.length === 0) return null;
    return Math.min(...validPrices);
  };

  return (
    <section id="services-section" className="premium-service-section">
      {/* Ambient Red Glow Beacons */}
      <div className="service-ambient-glow glow-top"></div>
      <div className="service-ambient-glow glow-bottom"></div>

      <div className="service-section-container">
        {/* Luxury Header */}
        <div className="services-heading text-center">
          <div className="service-atelier-chip">
            <span className="atelier-beacon"></span>
            <span className="atelier-chip-text">WHAT WE OFFER</span>
          </div>

          <h2 className="services-title">
            OUR <span>SERVICES</span>
          </h2>

          <p className="services-subtitle">
            Professional car care and protection services delivered by certified experts
          </p>
        </div>

        {/* Loading Skeleton State */}
        {loading ? (
          <div className="premium-service-grid">
            {[1, 2, 3, 4].map((n) => (
              <div className="service-skeleton-card" key={n}>
                <div className="skeleton-img-box shimmer"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line line-title shimmer"></div>
                  <div className="skeleton-line line-text shimmer"></div>
                  <div className="skeleton-line line-btn shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="service-empty-state">
            <i className="bi bi-shield-exclamation"></i>
            <h3>No Active Services Found</h3>
            <p>Our studio services are currently being updated.</p>
          </div>
        ) : (
          /* Ultra-Luxury Dynamic Service Cards Grid */
          <div className="premium-service-grid">
            {services.map((service, index) => {
              const startPrice = getStartingPrice(service.packages);
              const idxNumber = String(index + 1).padStart(2, "0");
              const validFeatures = (service.packages?.[0]?.features || []).filter(
                (f) => typeof f === "string" && f.trim() !== ""
              );
              const imageUrl = service.image_url || service.image?.url;

              return (
                <div
                  className="premium-service-card cursor-pointer"
                  key={service.id || service._id || index}
                  onClick={() => router.push(`/service/${service.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") router.push(`/service/${service.slug}`);
                  }}
                >
                  {/* Subtle Light Shine Animation on Hover */}
                  <div className="service-card-shine"></div>

                  {/* Dynamic Image Box */}
                  <div className="service-img-box">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={service.title}
                        loading="lazy"
                        className="premium-service-img"
                      />
                    ) : (
                      <div className="service-img-placeholder">
                        <i className="bi bi-shield-shaded"></i>
                      </div>
                    )}
                    <div className="service-img-overlay"></div>

                    {/* Dynamic Index Badge */}
                    <div className="service-idx-badge">
                      <span>{idxNumber}</span>
                    </div>

                    {/* Dynamic Warranty Badge */}
                    {service.duration && (
                      <div className="service-warranty-badge">
                        <i className="bi bi-shield-check"></i>
                        <span>{service.duration}</span>
                      </div>
                    )}

                    {/* Dynamic Service Icon */}
                    {service.icon && (
                      <div className="service-floating-icon">
                        <i className={`bi ${service.icon}`}></i>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="premium-service-content">
                    <div className="service-title-row">
                      <h3 className="service-card-heading">{service.title}</h3>
                    </div>

                    {/* Short Description */}
                    {service.short_description && (
                      <p className="service-short-desc">
                        {service.short_description}
                      </p>
                    )}

                    {/* Dynamic Feature HUD Pills */}
                    {validFeatures.length > 0 && (
                      <div className="service-feature-hud">
                        {validFeatures.slice(0, 3).map((feature, fIdx) => (
                          <span className="service-hud-pill" key={fIdx}>
                            <i className="bi bi-check-circle-fill"></i>
                            <span>{feature}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Dynamic Meta / Price Strip */}
                    {startPrice !== null && (
                      <div className="service-meta-strip">
                        <div className="service-price-block">
                          <span className="price-label">Starting From</span>
                          <span className="price-val">
                            ₹{startPrice.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Action Row */}
                    <div className="service-card-actions">
                      <Link
                        href={`/service/${service.slug}`}
                        className="service-atelier-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Explore Service</span>
                        <i className="bi bi-arrow-right"></i>
                      </Link>

                      <a
                        href={`https://wa.me/919313015917?text=Hi%20RYDAX,%20I'm%20interested%20in%20${encodeURIComponent(
                          service.title || "Services"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="service-whatsapp-btn"
                        onClick={(e) => e.stopPropagation()}
                        title={`Inquire about ${service.title} on WhatsApp`}
                        aria-label={`Inquire about ${service.title} on WhatsApp`}
                      >
                        <i className="bi bi-whatsapp"></i>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceCard;
