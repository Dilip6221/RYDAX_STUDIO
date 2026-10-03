import React, { useState, useRef, useMemo } from "react";
import cars from "../assets/images/rydax-car.png";
import { useNavigate } from "react-router-dom";
const hornSound = "/assets/vidoes/horn-sound.mp3";
import { Seo } from "../component/Seo.jsx";
import toast from "react-hot-toast";

const Faq = () => {
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const [openIndexes, setOpenIndexes] = useState(new Set([0]));
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [feedbackMap, setFeedbackMap] = useState({});
    const [honking, setHonking] = useState(false);

    const faqs = useMemo(() => [
        {
            category: "DETAILING & PPF",
            question: "What is car detailing and how is it different from a regular car wash?",
            answer: "Detailing is an extensive, multi-step restoration process designed to restore your vehicle to showroom condition. Unlike a conventional wash that only removes surface dirt, detailing includes multi-stage paint correction, elimination of swirls and micro-scratches, deep steam extraction for interiors, leather rejuvenation, engine bay dressing, and applying high-grade protective coatings like Ceramic or PPF."
        },
        {
            category: "DETAILING & PPF",
            question: "What is the difference between Ceramic Coating and Paint Protection Film (PPF)?",
            answer: "Ceramic coating is a semi-permanent liquid nano-polymer that chemically fuses with your clear coat, offering high hydrophobicity, extreme gloss, and protection against chemical stains, UV oxidation, and bird droppings. Paint Protection Film (PPF) is an ultra-durable, transparent thermoplastic urethane film that provides physical defense against stone chips, scratches, gravel, and features self-healing properties under heat."
        },
        {
            category: "DETAILING & PPF",
            question: "How long does a 9H / 10H Ceramic Coating last?",
            answer: "Depending on your selected package and maintenance routine, our 9H and 10H ceramic coatings deliver durable hydrophobic protection lasting from 2 to 5 years. We also provide periodic maintenance top-ups and inspection washes to ensure continuous hydrophobic performance."
        },
        {
            category: "BOOKING & VISITS",
            question: "How do I book a slot for my vehicle treatment?",
            answer: "You can book directly through our website via the Online Services portal, call our helpline at +91 9313015917, WhatsApp us, or visit our studio in person. We recommend scheduling at least 24-48 hours in advance so our certified master detailers can prepare a dedicated bay for your vehicle."
        },
        {
            category: "BOOKING & VISITS",
            question: "Can you collect and deliver my car (Doorstep Pickup & Drop)?",
            answer: "Yes! We offer safe, insured, and professional doorstep pickup and delivery services for selected locations. Our trained drivers inspect the vehicle on arrival, document condition reports, and transport your car with utmost care and tracking."
        },
        {
            category: "BOOKING & VISITS",
            question: "What are your workshop operating hours?",
            answer: "Our RYDAX Studio workshop is open Monday to Saturday from 9:00 AM to 7:00 PM with dedicated customer support. Prior-scheduled weekend or late-evening deliveries can also be coordinated with our support desk."
        },
        {
            category: "PRICING & PLANS",
            question: "How much do you charge for car detailing and PPF?",
            answer: "Pricing is transparent and customized based on your vehicle segment (Hatchback, Sedan, SUV, Luxury/Supercar), existing paint correction requirements, and the package selected (Ceramic, Graphene, or Full Body TPU PPF). You can request an upfront quote or a complimentary vehicle evaluation at our studio."
        },
        {
            category: "PRICING & PLANS",
            question: "What payment methods do you accept?",
            answer: "We accept all major payment modes including UPI (Google Pay, PhonePe, Paytm), Debit & Credit Cards, Net Banking, and Cash. Official GST tax invoices with itemized service breakdowns are provided with every transaction."
        },
        {
            category: "WARRANTY & CARE",
            question: "Do I get a warranty or guarantee on detailing and PPF?",
            answer: "Absolutely. Selected ceramic coatings come with 2 to 5 year warranty certificates, and our premium self-healing PPF installations include up to 5 to 10 years manufacturer warranty coverage against yellowing, cracking, or peeling."
        },
        {
            category: "WARRANTY & CARE",
            question: "Is my vehicle insured while at RYDAX Studio?",
            answer: "Yes, 100%. Every vehicle entrusted to RYDAX Studio is protected within 24/7 CCTV-monitored indoor bays and covered by garage liability protocols. We treat every vehicle like our own."
        },
        {
            category: "WARRANTY & CARE",
            question: "How should I care for my car after Ceramic Coating or PPF?",
            answer: "We provide an exclusive post-care maintenance guide. We recommend pH-neutral car shampoos, the two-bucket wash technique, microfiber towels, and avoiding abrasive brush automatic tunnel washes. Regular maintenance checkups are also available at our studio."
        }
    ], []);

    const categories = [
        { id: "ALL", label: "All Questions" },
        { id: "DETAILING & PPF", label: "Detailing & PPF" },
        { id: "BOOKING & VISITS", label: "Booking & Pickup" },
        { id: "PRICING & PLANS", label: "Pricing & Payments" },
        { id: "WARRANTY & CARE", label: "Warranty & Care" }
    ];

    const filteredFaqs = useMemo(() => {
        return faqs.filter(faq => {
            const matchesCategory = selectedCategory === "ALL" || faq.category === selectedCategory;
            if (!matchesCategory) return false;
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query) ||
                faq.category.toLowerCase().includes(query)
            );
        });
    }, [faqs, selectedCategory, searchQuery]);

    const toggleFAQ = (index) => {
        setOpenIndexes(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const toggleAll = () => {
        if (openIndexes.size === filteredFaqs.length) {
            setOpenIndexes(new Set());
        } else {
            setOpenIndexes(new Set(filteredFaqs.map((_, i) => i)));
        }
    };

    const playHorn = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
            setHonking(true);
            setTimeout(() => setHonking(false), 900);
        }
    };

    const handleFeedback = (index, type) => {
        setFeedbackMap(prev => ({ ...prev, [index]: type }));
        toast.success(type === "yes" ? "Thanks! Glad this was helpful." : "Thank you for the feedback!");
    };

    return (
        <div className="faq-wrapper bg-black text-white position-relative">
            {/* Ambient Background Glow */}
            <div className="faq-bg-glow"></div>

            <Seo structuredData={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
            }} />

            {/* HEADER */}
            <div className="faq-header text-center">
                <div className="container">
                    <div className="services-heading text-center">
                        <div className="section-top-title justify-content-center">
                            <span></span>
                            <p>Everything You Need To Know</p>
                            <span></span>
                        </div>
                        <h1 className="services-title mb-3">
                            RyDAX <span>FAQs</span>
                        </h1>
                        <p className="services-subtitle mx-auto" style={{ maxWidth: "680px" }}>
                            Explore answers to frequent questions about automotive detailing, ceramic coating,
                            self-healing PPF, workshop appointments, pricing, and warranty protection.
                        </p>
                    </div>

                    {/* LIVE SEARCH BAR */}
                    <div className="faq-search-wrapper">
                        <i className="bi bi-search faq-search-icon"></i>
                        <input
                            type="search"
                            className="faq-search-input"
                            placeholder="Search keywords (e.g. PPF, Ceramic, Pricing, Warranty, Pickup)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="faq-search-clear"
                                onClick={() => setSearchQuery("")}
                                title="Clear Search"
                            >
                                <i className="bi bi-x-circle-fill"></i>
                            </button>
                        )}
                    </div>

                    {/* CATEGORY FILTER PILLS */}
                    <div className="faq-filter-bar">
                        {categories.map((cat) => {
                            const count = cat.id === "ALL"
                                ? faqs.length
                                : faqs.filter(f => f.category === cat.id).length;
                            const isActive = selectedCategory === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    className={`faq-pill ${isActive ? "active" : ""}`}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    <span>{cat.label}</span>
                                    <span className="faq-pill-count">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* FAQS LIST */}
            <div className="container pb-5">
                {/* Controls Row */}
                <div className="faq-controls-row">
                    <span className="text-secondary small fw-medium">
                        Showing <strong className="text-white">{filteredFaqs.length}</strong> of {faqs.length} questions
                        {searchQuery && <span> matching "<em>{searchQuery}</em>"</span>}
                    </span>
                    {filteredFaqs.length > 0 && (
                        <button
                            type="button"
                            className="faq-toggle-all-btn"
                            onClick={toggleAll}
                        >
                            <i className={`bi ${openIndexes.size === filteredFaqs.length ? "bi-chevron-contract" : "bi-chevron-expand"} me-1`}></i>
                            {openIndexes.size === filteredFaqs.length ? "Collapse All" : "Expand All"}
                        </button>
                    )}
                </div>

                {filteredFaqs.length > 0 ? (
                    <div className="faq-grid">
                        {filteredFaqs.map((faq, index) => {
                            const isOpen = openIndexes.has(index);
                            const feedback = feedbackMap[index];

                            return (
                                <div
                                    key={index}
                                    className={`faq-item ${isOpen ? "active" : ""}`}
                                >
                                    {/* QUESTION */}
                                    <div
                                        className="faq-question"
                                        onClick={() => toggleFAQ(index)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="faq-left">
                                            <div className="faq-number">
                                                {String(index + 1).padStart(2, "0")}
                                            </div>
                                            <div className="faq-question-text">
                                                <span className="faq-category-badge">
                                                    {faq.category}
                                                </span>
                                                <span>{faq.question}</span>
                                            </div>
                                        </div>
                                        <div className={`faq-icon ${isOpen ? "rotate" : ""}`}>
                                            <i className="bi bi-plus-lg"></i>
                                        </div>
                                    </div>

                                    {/* ANSWER */}
                                    <div className={`faq-answer ${isOpen ? "show" : ""}`}>
                                        <div className="faq-answer-content">
                                            <p>{faq.answer}</p>

                                            {/* Was this helpful micro-interaction */}
                                            <div className="faq-feedback-footer">
                                                <span className="faq-feedback-text">
                                                    Was this helpful?
                                                </span>
                                                <div className="faq-feedback-btns">
                                                    <button
                                                        type="button"
                                                        className={`faq-feedback-btn ${feedback === "yes" ? "voted" : ""}`}
                                                        onClick={() => handleFeedback(index, "yes")}
                                                        title="Yes, this answered my question"
                                                    >
                                                        <i className="bi bi-hand-thumbs-up me-1"></i> Yes
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`faq-feedback-btn ${feedback === "no" ? "voted" : ""}`}
                                                        onClick={() => handleFeedback(index, "no")}
                                                        title="No, I still need help"
                                                    >
                                                        <i className="bi bi-hand-thumbs-down me-1"></i> No
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-5 bg-dark bg-opacity-25 rounded-4 border border-secondary border-opacity-25">
                        <i className="bi bi-search fs-1 text-secondary opacity-50 mb-3 d-block"></i>
                        <h4 className="text-white mb-2">No Matching FAQs Found</h4>
                        <p className="text-secondary mb-3">
                            We couldn't find any questions matching "{searchQuery}". Try searching with another term or browse our categories.
                        </p>
                        <button
                            className="btn btn-outline-danger btn-sm px-4 py-2 rounded-pill"
                            onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); }}
                        >
                            Reset Search & Filters
                        </button>
                    </div>
                )}

                {/* QUICK 3-WAY SUPPORT CHANNELS */}
                <div className="faq-support-cards">
                    <a
                        href="tel:+919313015917"
                        className="faq-support-card"
                    >
                        <div className="faq-support-icon">
                            <i className="bi bi-telephone-inbound-fill"></i>
                        </div>
                        <h5 className="text-white fw-bold mb-1">Call Helpline</h5>
                        <p className="text-secondary small mb-2">Speak directly with our detailing technicians</p>
                        <span className="text-danger small fw-semibold">+91 93130 15917 →</span>
                    </a>

                    <a
                        href="https://wa.me/919313015917?text=Hi%20RYDAX%20Studio%2C%20I%20have%20a%20question%20regarding%20car%20treatment"
                        target="_blank"
                        rel="noreferrer"
                        className="faq-support-card"
                    >
                        <div className="faq-support-icon">
                            <i className="bi bi-whatsapp"></i>
                        </div>
                        <h5 className="text-white fw-bold mb-1">WhatsApp Chat</h5>
                        <p className="text-secondary small mb-2">Instant answers & photos sharing on WhatsApp</p>
                        <span className="text-success small fw-semibold">Chat with Us →</span>
                    </a>

                    <div
                        className="faq-support-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/contact-us")}
                    >
                        <div className="faq-support-icon">
                            <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <h5 className="text-white fw-bold mb-1">Visit Workshop</h5>
                        <p className="text-secondary small mb-2">Get a free hands-on vehicle inspection</p>
                        <span className="text-danger small fw-semibold">Locate Studio →</span>
                    </div>
                </div>
            </div>

            {/* CTA & INTERACTIVE CAR SECTION */}
            <div className="faq-contact-section">
                <div className="container">
                    <div className="faq-contact-grid">
                        {/* LEFT */}
                        <div className="faq-contact-text">
                            <div className="badge bg-danger bg-opacity-20 text-black border border-danger border-opacity-30 px-3 py-2 rounded-pill mb-3">
                                <i className="bi bi-shield-check me-2"></i>Premium Auto Care
                            </div>
                            <h2>
                                SOME OF THE VERY <span>FREQUENTLY ASKED</span> QUESTIONS ARE ANSWERED HERE.
                            </h2>
                            <p>
                                Still have unanswered questions? Our master detailers are on standby to consult and recommend the ideal treatment for your vehicle.
                            </p>
                            <div className="d-flex flex-wrap gap-3 align-items-center">
                                <button className="premium-faq-btn" onClick={() => navigate("/contact-us")}>
                                    <i className="bi bi-chat-square-dots-fill me-2"></i>Contact Us
                                </button>
                                <button
                                    className="btn btn-outline-light px-4 rounded-3 d-flex align-items-center gap-2"
                                    style={{ height: "54px" }}
                                    onClick={() => navigate("/services")}
                                >
                                    <i className="bi bi-calendar2-check"></i> Explore Services
                                </button>
                            </div>
                        </div>

                        {/* RIGHT WITH INTERACTIVE EASTER EGG */}
                        <div className="faq-contact-image">
                            <img
                                src={cars}
                                alt="RYDAX Studio Car Detailing"
                                className="faq-car-animated"
                                onClick={playHorn}
                                title="Click car to honk the horn!"
                            />
                            <audio ref={audioRef} src={hornSound} preload="auto" />

                            <div>
                                <div
                                    className={`horn-wave-badge ${honking ? "honking" : ""}`}
                                    onClick={playHorn}
                                >
                                    <i className={`bi ${honking ? "bi-volume-up-fill" : "bi-volume-down"}`}></i>
                                    <span>{honking ? "Honking! 📢" : "Click car to honk horn"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;