import "../../css/service.css";

const CarWash = () => {
  return (
    <div className="bg-black text-white">
      <div className="py-5 text-center">
        <span className="about-badge">
          Car Wash Service
        </span>
        <div className="container text-center">
          <h3 className="section-title section-title-small">
            <span className="first-letter">P</span>remium Car Care Solutions
          </h3>
        </div>
      </div>

      {/* ===== ABOUT ===== */}
      <section className="service-section">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <h2 className="section-heading">
                What is Ceramic Coating?
              </h2>

              <p className="section-text">
                Ceramic Coating is a virtually invisible,
                ultra-durable polyurethane layer applied to your vehicle's
                exterior. It shields your paint from road debris, scratches,
                UV rays and environmental damage — without altering the
                original finish.
              </p>

              <ul className="service-points">
                <li>Self-healing technology for minor scratches</li>
                <li>High-gloss & hydrophobic surface</li>
                <li>UV & chemical resistance</li>
                <li>Preserves showroom-new finish</li>
              </ul>

              <div className="service-enquiry">
                <button className="garage-btn" onClick={() => navigate("/contact-us")}>
                    Enquire for Car Wash Service!
                </button>

                <p className="enquiry-subtext">
                  Get pricing, coverage & expert guidance
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="ppf-image-wrapper">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn9tR5Ki8DPbx3sgrOjmODcPS2yuP6t8qNHhvVnya1OQ&s&ec=121507526"
                  alt="PPF Installation"
                  className="ppf-img main-img"
                />
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn9tR5Ki8DPbx3sgrOjmODcPS2yuP6t8qNHhvVnya1OQ&s&ec=121507526"
                  alt="PPF Closeup"
                  className="ppf-img floating-img"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="service-dark">
        <div className="container">
          <h2 className="section-heading text-center mb-5">
            Our PPF Installation Process
          </h2>

          <div className="row g-4">
            {[
              ["Inspection", "Thorough paint inspection & preparation"],
              ["Paint Correction", "Swirl & defect removal"],
              ["Precision Install", "Computer-cut film, panel by panel"],
              ["Edge Wrapping", "Seamless wrapped-edge finish"],
            ].map((item, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="process-card">
                  <span className="step">0{i + 1}</span>
                  <h4>{item[0]}</h4>
                  <p>{item[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="service-section">
        <div className="container">
          <h2 className="section-heading text-center mb-4">
            Why Choose RYDAX?
          </h2>

          <div className="row g-4">
            {[
              "Certified & experienced PPF specialists",
              "Imported premium-grade PPF materials",
              "Warranty-backed workmanship",
              "Dust-free controlled installation bay",
            ].map((text, i) => (
              <div className="col-md-6" key={i}>
                <div className="why-card">
                  <span>✔</span>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarWash;
