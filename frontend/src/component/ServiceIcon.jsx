import React, { useState } from "react";

const ServiceIcon = () => {
  const [open, setOpen] = useState(false);

  const services = [
    { name: "PPF", icon: "fa-shield-halved", color: "#007bff" },
    { name: "Paint", icon: "fa-spray-can", color: "#dc3545" },
    { name: "Wash", icon: "fa-droplet", color: "#0dcaf0" },
    { name: "Ceramic", icon: "fa-gem", color: "#6f42c1" },
    { name: "Detailing", icon: "fa-brush", color: "#20c997" },
    { name: "Wrapping", icon: "fa-layer-group", color: "#ffc107" },
  ];

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "25px",
            background: "black",
            backdropFilter: "blur(12px)",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
            padding: "18px",
            border: "1px solid red",
            width: "230px",
            transition: "all 0.3s ease-in-out",
            zIndex: 1000,
            animation: "fadeInUp 0.4s ease",
          }}
        >
          <h4
            style={{
              textAlign: "center",
              marginBottom: "12px",
              color: "#fff",
              fontWeight: "600",
              borderBottom: "2px solid #00c6ff",
              paddingBottom: "5px",
              fontSize: "16px",
              letterSpacing: "0.5px",
            }}
          >
            Our Services
          </h4>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            {services.map((s, i) => (
              <button
                key={i}
                onClick={() => alert(`Selected: ${s.name}`)}
                style={{
                  background: s.color,
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  width: "70px",
                  height: "55px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px) scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                }}
              >
                <i
                  className={`fa-solid ${s.icon}`}
                  style={{ fontSize: "22px", marginBottom: "6px" }}
                ></i>
                <span style={{ fontSize: "13px" }}>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <button
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          background: open
            ? "linear-gradient(135deg, #ff3e3e, #ff8c00)"
            : "linear-gradient(135deg, #007bff, #00c6ff)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "65px",
          height: "65px",
          fontSize: "26px",
          cursor: "pointer",
          boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          zIndex: 1001,
          animation: open ? "rotateIn 0.5s ease" : "rotateOut 0.5s ease",
        }}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "scale(1.1) rotate(10deg)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "scale(1) rotate(0deg)")
        }
      >
        <i className={`fa-solid ${open ? "fa-xmark" : "fa-screwdriver-wrench"}`}></i>
      </button>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes rotateIn {
            from {
              transform: rotate(-180deg);
            }
            to {
              transform: rotate(0deg);
            }
          }
          @keyframes rotateOut {
            from {
              transform: rotate(180deg);
            }
            to {
              transform: rotate(0deg);
            }
          }
        `}
      </style>
    </>
  );
};

export default ServiceIcon;
