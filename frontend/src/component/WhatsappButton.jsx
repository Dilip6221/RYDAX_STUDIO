import React from "react";
import { NavLink } from "react-router-dom";

const WhatsappButton = () => {

  const phoneNumber = "919313015917";
  const message = "Hi, I want to know about your car services and how to book an appointment.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <NavLink
      to={whatsappLink}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      title="WhatsApp"
    >
      <i className="bi bi-whatsapp fs-4"></i>
    </NavLink>
  );
};

export default WhatsappButton;