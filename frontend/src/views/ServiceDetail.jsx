import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../css/service-detail.css";
import HomeCta from "./HomeCta";
import HomeGallery from "./HomeGallery";
import { Seo } from "../component/Seo.jsx";

const ServiceDetail = () => {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const fetchService = async () => {
    try {
      const res = await axios.get(`service/get-service/${slug}`);

      if (res.data.success) {
        setService(res.data.data);
        setActiveIndex(0);
        setOpenFaq(0);
      } else {
        toast.error(res.data.message || "Service not found");
      }
    } catch (error) {
      console.error("Service fetch error:", error);
      toast.error("Failed to load service");
    }
  };

  useEffect(() => {
    fetchService();
  }, [slug]);

  // const handleReset = () => {
  //   setActiveIndex(0);
  // };

  if (!service) {
    return (
      <main className="service-detail-page">
        <div className="service-loader">Loading service...</div>
      </main>
    );
  }

  const sections = service.interactiveSections || [];
  const activeSection = sections[activeIndex];

  const activeVideoUrl = activeSection?.video?.url || "";
  const activeImageUrl = activeSection?.image?.url || service.image?.url || "";
  const heroVideoUrl = service.heroVideo?.url || "";
  const heroImageUrl = service.image?.url || "";

  return (
    <main className="service-detail-page">
      <Seo
        title={`${service.metaTitle || service.heroTitle || service.title} | RYDAX Studio`}
        description={service.metaDescription || service.shortDescription || service.description}
        image={service.image?.url}
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.shortDescription || service.description,
          image: service.image?.url,
          provider: { "@type": "AutomotiveBusiness", name: "RYDAX Studio" },
          url: window.location.href,
        }}
      />
      <section className="service-hero-section">
        <div className="service-hero-media">
          {heroVideoUrl ? (
            <video src={heroVideoUrl} autoPlay muted loop playsInline />
          ) : (
            <img src={heroImageUrl} alt={service.title} fetchPriority="high" />
          )}
        </div>

        <div className="service-hero-overlay"></div>

        <div className="container service-hero-content">
          {service.category && (
            <span className="service-hero-badge">{service.category}</span>
          )}

          <h1>{service.heroTitle || service.title}</h1>

          <p>{service.heroSubtitle || service.shortDescription}</p>

          <div className="service-hero-meta">
            {service.duration && (
              <div>
                <i className="bi bi-clock"></i>
                <span>{service.duration}</span>
              </div>
            )}

            {service.warranty && (
              <div>
                <i className="bi bi-shield-check"></i>
                <span>{service.warranty}</span>
              </div>
            )}

            {service.featured && (
              <div>
                <i className="bi bi-star-fill"></i>
                <span>Featured Service</span>
              </div>
            )}
          </div>

          <div className="service-hero-actions">
            <Link to="/contact-us" className="service-primary-btn">
              Book Consultation
              <i className="bi bi-arrow-right"></i>
            </Link>

            <a
              href="https://wa.me/919313015917"
              target="_blank"
              rel="noreferrer"
              className="service-secondary-btn"
            >
              <i className="bi bi-whatsapp"></i>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {service.cardFeatures?.length > 0 && (
        <section className="service-quick-features">
          <div className="container">
            <div className="quick-feature-grid">
              {service.cardFeatures.map((item, index) => (
                <div className="quick-feature-card" key={index}>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.length > 0 && (
        <section className="apple-close-section">
          <div className="apple-close-container">
            <h2 className="apple-close-title">Take a closer look.</h2>
            <div className="apple-close-stage">
          <div className="apple-nav-arrows">
            <button
              type="button"
              className="apple-arrow-btn"
              disabled={activeIndex === 0}
              onClick={() =>
                setActiveIndex((prev) => Math.max(prev - 1, 0))
              }
            >
              <i className="bi bi-chevron-up"></i>
            </button>

            <button
              type="button"
              className="apple-arrow-btn"
              disabled={activeIndex === sections.length - 1}
              onClick={() =>
                setActiveIndex((prev) =>
                  Math.min(prev + 1, sections.length - 1)
                )
              }
            >
              <i className="bi bi-chevron-down"></i>
            </button>
          </div>
              {/* <button
                type="button"
                className="apple-close-x"
                onClick={handleReset}
                title="Reset"
              >
                ×
              </button> */}

              <div className="apple-close-media">
                {activeVideoUrl ? (
                  <video
                    key={activeVideoUrl}
                    src={activeVideoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={activeImageUrl}
                    alt={activeSection?.title || service.title}
                    loading="lazy"
                  />
                )}
              </div>

              <div className="apple-media-shadow"></div>

              <div className="apple-close-tabs">
                {sections.map((item, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <div className="apple-tab-wrap" key={index}>
                      {isActive && (
                        <div className="apple-tab-detail">
                          <p>
                            <strong>{item.subtitle || item.title}. </strong>
                            {item.description}
                          </p>

                          {item.points?.length > 0 && (
                            <ul>
                              {item.points.map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          )}

                          {item.stats?.length > 0 && (
                            <div className="apple-tab-stats">
                              {item.stats.map((stat, i) => (
                                <div key={i}>
                                  <b>{stat.value}</b>
                                  <span>{stat.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        className={`apple-close-tab ${isActive ? "active" : ""
                          }`}
                        onClick={() => setActiveIndex(index)}
                      >
                        <span className="apple-circle-icon">
                          {isActive ? "−" : "+"}
                        </span>

                        <span>{item.title}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="service-about-section">
        <div className="container service-about-grid">
          <div>
            <div className="section-top-title service-mini-title">
              <span></span>
              <p>Service Overview</p>
              <span></span>
            </div>
            <h2>
              <span>{service.title}</span>
            </h2>
            <p>{service.description}</p>
          </div>
          {service.benefits?.length > 0 && (
            <div className="service-benefit-box">
              <h3>Key Benefits</h3>
              <ul>
                {service.benefits.map((item, index) => (
                  <li key={index}>
                    <i className="bi bi-check-circle-fill"></i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {service.packages?.length > 0 && (
        <section className="service-package-section">
          <div className="container">
            <div className="services-heading text-center">
              <div className="section-top-title">
                <span></span>
                <p>Packages</p>
                <span></span>
              </div>

              <h2 className="services-title">
                Choose Your <span>Plan</span>
              </h2>

              <p className="services-subtitle">
                Select the package that fits your car care requirement.
              </p>
            </div>

            <div className="service-package-grid">
              {service.packages.map((pkg, index) => (
                <div
                  className={`service-package-card ${pkg.recommended ? "recommended" : ""
                    }`}
                  key={index}
                >
                  {pkg.recommended && (
                    <span className="package-badge">Recommended</span>
                  )}

                  <h3>{pkg.title}</h3>

                  {pkg.price && <h4>{pkg.price}</h4>}

                  {pkg.duration && (
                    <p className="package-duration">
                      <i className="bi bi-clock"></i>
                      {pkg.duration}
                    </p>
                  )}

                  {pkg.features?.length > 0 && (
                    <ul>
                      {pkg.features.map((feature, i) => (
                        <li key={i}>
                          <i className="bi bi-check2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link to="/contact-us" className="package-btn">
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <HomeGallery serviceName={service.title} />

      {service.faqs?.length > 0 && (
        <section className="faq-wrapper bg-black text-white">
          <div className="faq-header text-center">
            <div className="services-heading text-center">
              <div className="section-top-title">
                <span></span>
                <p>Everything You Need To Know</p>
                <span></span>
              </div>

              <h2 className="services-title">
                {service.title} <span>FAQs</span>
              </h2>

              <p className="services-subtitle">
                Find answers to common questions about this service.
              </p>
            </div>
          </div>

          <div className="container pb-5">
            <div className="faq-grid">
              {service.faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={index}
                    className={`faq-item ${isOpen ? "active" : ""}`}
                  >
                    <div
                      className="faq-question"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <div className="faq-left">
                        <div className="faq-number">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <span>{faq.question}</span>
                      </div>

                      <div className={`faq-icon ${isOpen ? "rotate" : ""}`}>
                        <i className="bi bi-plus-lg"></i>
                      </div>
                    </div>

                    <div className={`faq-answer ${isOpen ? "show" : ""}`}>
                      <div className="faq-answer-content">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* <section className="service-final-cta">
        <div className="container">
          <div className="service-final-card">
            <h2>Ready To Experience Premium Car Care?</h2>
            <p>
              Book your {service.title} consultation today and give your car the
              treatment it deserves.
            </p>
            <div>
              <Link to="/contact-us" className="service-primary-btn">
                Book Consultation
                <i className="bi bi-arrow-right"></i>
              </Link>
              <a href="https://wa.me/919313015917" target="_blank" rel="noreferrer"className="service-secondary-btn">
                <i className="bi bi-whatsapp"></i>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section> */}
      <HomeCta />

    </main>
  );
};

export default ServiceDetail;