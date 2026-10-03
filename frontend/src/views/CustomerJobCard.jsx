import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext.jsx";
import "../css/job-card.css";
import { FaTimes } from "react-icons/fa";

const CustomerJobCard = () => {
    const navigate = useNavigate();
    const { user, token } = useContext(UserContext);
    const { carId } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [galleryModal, setGalleryModal] = useState({ open: false, index: 0 });
    const galleryScrollRef = useRef(0);

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const distance = touchStartX.current - touchEndX.current;

        if (Math.abs(distance) < 50) return;

        if (distance > 0) {
            nextMedia();
        } else {
            prevMedia();
        }
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    useEffect(() => {
        if (!user) {
            navigate("/", { replace: true });
            return;
        }
        const fetchJobCard = async () => {
            try {
                const res = await axios.get(
                    `jobcard/customer/job-card/${carId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (res.data.success) {
                    setJob(res.data.data);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load job card");
            } finally {
                setLoading(false);
            }
        };
        fetchJobCard();
    }, [carId, user, token, navigate]);
    const openGalleryModal = (index) => {
        galleryScrollRef.current = window.scrollY;

        setGalleryModal({ open: true, index });

        window.history.pushState(
            { workGalleryModal: true, scrollY: window.scrollY },
            ""
        );
    };

    const closeGalleryModal = () => {
        setGalleryModal({ open: false, index: 0 });

        if (window.history.state?.workGalleryModal) {
            window.history.back();
        }
    };

    const closeGalleryOnly = () => {
        setGalleryModal({ open: false, index: 0 });
    };

    const nextMedia = () => {
        setGalleryModal((prev) => ({
            ...prev,
            index: (prev.index + 1) % job.media.length,
        }));
    };

    const prevMedia = () => {
        setGalleryModal((prev) => ({
            ...prev,
            index: prev.index === 0 ? job.media.length - 1 : prev.index - 1,
        }));
    };

    const downloadMedia = async (e) => {
        e?.stopPropagation();

        try {
            const current = job.media[galleryModal.index];
            if (!current?.url) return;
            const response = await fetch(current.url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download =
                current.mediaType === "video"
                    ? `rydax-video-${galleryModal.index + 1}.mp4`
                    : `rydax-image-${galleryModal.index + 1}.jpg`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error(err);
            toast.error("Failed to download media");
        }
    };

    useEffect(() => {
        if (!galleryModal.open) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeGalleryModal();
            }

            if (e.key === "ArrowRight") {
                nextMedia();
            }

            if (e.key === "ArrowLeft") {
                prevMedia();
            }
        };

        const handleBackButton = () => {
            closeGalleryOnly();
        };
        document.body.classList.add("work-gallery-modal-open");
        document.documentElement.classList.add("work-gallery-modal-open");

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("popstate", handleBackButton);

        return () => {
            document.body.classList.remove("work-gallery-modal-open");
            document.documentElement.classList.remove("work-gallery-modal-open");
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [galleryModal.open, galleryModal.index, job]);
    if (loading) {
        return (
            <div className="job-loading">
                <div className="spinner-border text-danger"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="empty-job-wrapper">
                <div className="empty-job-card">
                    <div className="empty-icon">
                        <i className="bi bi-car-front-fill"></i>
                    </div>
                    <h2>No Active Job Card</h2>
                    <p>
                        Your car is currently not in service.
                        <br />
                        Once work starts, live updates will appear here.
                    </p>
                    <div className="notfound-actions">
                        <button
                            className="back-btn-404"
                            onClick={() => navigate("/services")}
                        >
                            Explore Services →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="job-page">
            {/* HERO SECTION */}
            <section className="job-hero">
                <div className="hero-glow hero-glow-1"></div>
                <div className="hero-glow hero-glow-2"></div>

                <div className="container position-relative">
                    <div className="live-status">
                        <span></span>
                        LIVE SERVICE ACTIVE
                    </div>

                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <span className="job-badge">
                                JOB CARD #{job.jobCode}
                            </span>

                            <h1 className="hero-title">
                                Your Car Is In
                                <span> Expert Hands</span>
                            </h1>

                            <p className="hero-description">
                                Track every stage of your vehicle service with
                                premium live updates, work progress, workshop
                                timeline & media uploads.
                            </p>

                            <div className="hero-info-grid">
                                <div className="hero-info-card">
                                    <small>Current Stage</small>

                                    <strong>
                                        {job.currentStage.replaceAll(
                                            "_",
                                            " "
                                        )}
                                    </strong>
                                </div>

                                <div className="hero-info-card">
                                    <small>Status</small>

                                    <strong>
                                        {job.status}
                                    </strong>
                                </div>

                                <div className="hero-info-card">
                                    <small>Expected Delivery</small>

                                    <strong>
                                        {job.expectedDelivery
                                            ? new Date(
                                                job.expectedDelivery
                                            ).toLocaleDateString()
                                            : "Updating Soon"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5 text-center mt-5 mt-lg-0">
                            <div
                                className="progress-ring"
                                style={{
                                    background: `conic-gradient(
                                        #ff3c3c 0%,
                                        #ff3c3c ${job.progressPercent}%,
                                        #1b1b1b ${job.progressPercent}%,
                                        #1b1b1b 100%
                                    )`,
                                }}
                            >
                                <div className="progress-inner">
                                    <h2>
                                        {job.progressPercent}%
                                    </h2>

                                    <span>Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <div className="container py-5">
                {/* STATUS CARD */}
                <div className="summary-card">
                    <div className="summary-top">
                        <div>
                            <p className="summary-label">
                                Service Progress
                            </p>
                            <h4>
                                {job.currentStage.replaceAll(
                                    "_",
                                    " "
                                )}
                            </h4>
                        </div>
                        <span
                            className={`job-status ${job.status.toLowerCase() === "progress"
                                ? "in-progress"
                                : job.status.toLowerCase()
                                }`}
                        >
                            {job.status}
                        </span>
                    </div>

                    <div className="progress custom-progress mt-4">
                        <div
                            className="progress-bar"
                            style={{
                                width: `${job.progressPercent}%`,
                            }}
                        >
                            {job.progressPercent}%
                        </div>
                    </div>
                </div>

                {/* TIMELINE */}
                <div className="section-header">
                    <h3>Service Timeline</h3>
                </div>

                <div className="premium-timeline-wrapper">
                    <div className="timeline-scroll">
                        {job.timeline.map((t, i) => (
                            <div className={`timeline-slide ${i === job.timeline.length - 1 ? "active-slide" : ""}`} key={i}>
                                <div className="timeline-top-bar">
                                    <div className="timeline-step">
                                        STEP {i + 1}
                                    </div>
                                    <div className="timeline-status-dot"></div>
                                </div>
                                {/* ICON */}
                                <div className="timeline-big-icon">
                                    <i className="bi bi-check2"></i>
                                </div>
                                <div className="timeline-content">
                                    <h3>
                                        {t.stage.replaceAll("_", " ")}
                                    </h3>
                                    <span className="timeline-date">
                                        {new Date(t.updatedAt).toLocaleString()}
                                    </span>
                                    {t.note && (
                                        <p>{t.note}</p>
                                    )}
                                </div>
                                {i !== job.timeline.length - 1 && (
                                    <div className="timeline-connector"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="section-header mt-5">
                    <h3>Work Gallery</h3>
                </div>

                <div className="work-media-strip">
                    {job.media?.map((m, index) => (
                        <div className="work-media-slide" key={m._id}>
                            <div className="media-card" onClick={() => openGalleryModal(index)}>
                                {m.mediaType === "video" ? (
                                    <>
                                        <video src={m.url} muted />
                                        <div className="media-play-icon">
                                            <i className="bi bi-play-fill"></i>
                                        </div>
                                    </>
                                ) : (
                                    <img src={m.url} alt="service" />
                                )}

                                <div className="media-card-overlay">
                                    <i className="bi bi-arrows-fullscreen"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {job.customerNotes && (
                    <>
                        <div className="section-header mt-5">
                            <h3>Customer Notes</h3>
                        </div>

                        <div className="customer-note-card">
                            <p>{job.customerNotes}</p>
                        </div>
                    </>
                )}
            </div>
            {galleryModal.open && job.media?.length > 0 && (
                <div className="work-gallery-modal" onClick={closeGalleryModal}>
                    <div className="work-gallery-modal-content" onClick={(e) => e.stopPropagation()} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                        <button className="work-gallery-close" onClick={closeGalleryModal}>
                            <FaTimes />
                        </button>
                        <button
                            className="work-gallery-download"
                            onClick={downloadMedia}
                        >
                            <i className="bi bi-download"></i>
                        </button>
                        {job.media.length > 1 && (
                            <>
                                <button className="work-gallery-arrow left" onClick={prevMedia}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <button className="work-gallery-arrow right" onClick={nextMedia}>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </>
                        )}
                        <div className="work-gallery-preview">
                            {job.media[galleryModal.index]?.mediaType === "video" ? (
                                <video src={job.media[galleryModal.index]?.url} controls autoPlay />
                            ) : (
                                <img src={job.media[galleryModal.index]?.url} alt="Work Gallery" />
                            )}
                        </div>

                        <div className="work-gallery-count">
                            {galleryModal.index + 1} / {job.media.length}
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default CustomerJobCard;