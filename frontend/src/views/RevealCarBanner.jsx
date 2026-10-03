import React from "react";
import "../css/RevealCarBanner.css";
import carImage from "../assets/images/rydax-studio-car.png";

const RevealCarBanner = () => {
  return (
    <section className="reveal-banner">
      <div className="road-texture"></div>
      <div className="road-lines"></div>
      <div className="red-glow"></div>
      <div className="brand-area">
        <div className="base-content">
          <h1 className="base-text">
            RYDAX<span> STUDIO</span>
          </h1>
          <p>Premium Car Detailing Studio</p>
        </div>
        <div className="reveal-text">
          <h1>
            RYDAX<span> STUDIO</span>
          </h1>
          <p>Premium Car Detailing Studio</p>
          <div className="scan-edge"></div>
        </div>
      </div>

      <div className="car-box">
        <div className="car-trail"></div>
        <img src={carImage} alt="Car" className="moving-car" />
      </div>
    </section>
  );
};

export default RevealCarBanner;