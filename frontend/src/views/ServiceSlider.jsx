import { useEffect, useState } from "react";
import axios from "axios";
// import "../css/slider.css";
import '../css/slider.css';
import toast from "react-hot-toast";

const ServiceSlider = () => {

  const [services, setServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ================= FETCH SERVICES =================
  const fetchServices = async () => {
    try {

      const res = await axios.get("service/admin/services");
      if (res.data.success) {
        const activeServices = res.data.data.filter(
          (s) => s.status === "ACTIVE"
        );
        setServices(activeServices);
        if (activeServices.length > 0) {
          setCurrentIndex(Math.floor(activeServices.length / 2));
        }
      }
    } catch (error) {
      toast.error("Failed to load services. Please try again later.");
      console.log("Service fetch error", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ================= NAVIGATION =================
  const navigate = (direction) => {

    setCurrentIndex((prev) => {

      let next = prev + direction;

      if (next < 0) next = services.length - 1;
      if (next >= services.length) next = 0;

      return next;

    });
  };

  // ================= AUTO SLIDE =================
  useEffect(() => {

    if (services.length === 0) return;

    const interval = setInterval(() => {
      navigate(1);
    }, 4000);

    return () => clearInterval(interval);

  }, [services]);

  if (services.length === 0) {
    return <div className="text-center py-5">Loading services...</div>;
  }

  return (
    <section className="section">

      <div className="coverflow-wrapper">

        {/* ================= SERVICE INFO ================= */}
        <div className="info">
          <h2>{services[currentIndex]?.title}</h2>
          <p>{services[currentIndex]?.shortDescription}</p>
        </div>

        <div className="coverflow-container">

          <div className="coverflow">

            {services.map((item, index) => {

              let offset = index - currentIndex;

              if (offset > services.length / 2) offset -= services.length;
              if (offset < -services.length / 2) offset += services.length;

              const absOffset = Math.abs(offset);
              const sign = Math.sign(offset);

              let translateX = offset * 260;
              let translateZ = -absOffset * 200;
              let rotateY = -sign * Math.min(absOffset * 60, 60);
              let scale = 1 - absOffset * 0.1;
              let opacity = 1 - absOffset * 0.2;

              if (absOffset > 3) {
                opacity = 0;
                translateX = sign * 800;
              }

              const style = {
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: 100 - absOffset,
              };

              return (
                <div
                  key={item._id}
                  className={`coverflow-item ${
                    index === currentIndex ? "active" : ""
                  }`}
                  style={style}
                  onClick={() => setCurrentIndex(index)}
                >
                  <div className="cover">

                    <img
                      src={
                        item.image?.url ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={item.title}
                    />

                  </div>

                  <div
                    className="reflection"
                    style={{
                      backgroundImage: `url(${
                        item.image?.url ||
                        "https://via.placeholder.com/400x300"
                      })`,
                    }}
                  />

                </div>
              );
            })}
          </div>

          {/* PREV BUTTON */}
          <button className="nav-button prev" onClick={() => navigate(-1)}>
            ‹
          </button>

          {/* NEXT BUTTON */}
          <button className="nav-button next" onClick={() => navigate(1)}>
            ›
          </button>

          {/* DOTS */}
          <div className="dots-container">
            {services.map((_, i) => (
              <div
                key={i}
                className={`dot ${i === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceSlider;