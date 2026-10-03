import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../css/job-card.css";
import toast from "react-hot-toast";

const MyCarVault = () => {
  const navigate = useNavigate();
  const {user, token } = useContext(UserContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await axios.get("jobcard/customer/my-cars",{headers: {Authorization: `Bearer ${token}`}});
        if (res.data.success) {
          setCars(res.data.data || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your cars");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [user, token, navigate]);

  return (
    <div className="bg-black text-white">
      <div className="py-5 text-center">
        

        <div className="services-heading text-center">
          <div className="section-top-title">
            <span></span>
            <p>My Car Vault</p>
            <span></span>
          </div>

          <h2 className="services-title">
            Your  <span>Vehicle Collection</span>
          </h2>
          {/* <p className="services-subtitle">
                Access your saved vehicles, service history, detailing records,
                bookings, and premium automotive care journey — all in one place.
            </p> */}
        </div>
      </div>
      <div className="container pb-5">
        <div className="row">
          {cars.length === 0 ? (
            <div className="col-12 text-center">
              <div className="empty-blog-box">
                <div className="empty-icon">
                  <i className="bi bi-car-front-fill"></i>
                </div>
                <h3 className="text-white">
                  Your Garage is Waiting
                </h3>

                <p className="empty-text text-secondary">
                  No vehicles have been added to your Car Vault yet.
                  <br />
                  Start building your premium garage experience by adding your first car.
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
          ) : (
            cars.map((car) => (
              <div
                className="col-12 mb-4"
                key={car._id}
              >
                <div className="garage-card">
                  <div className="garage-card-bg"></div>
                  <div className="garage-left">
                    <div className="garage-status">
                      <span
                        className={`garage-dot ${car.isActive
                          ? "active"
                          : ""
                          }`}
                      ></span>
                      {car.isActive
                        ? "SERVICE ACTIVE"
                        : "SERVICE COMPLETE"}
                    </div>
                    <div className="garage-title">
                      <h2>
                        {car.brand}
                      </h2>
                      <h1>
                        {car.model}
                      </h1>
                    </div>
                    <div className="garage-reg">
                      {car.registrationNumber}
                    </div>
                    <div className="garage-specs">
                      <div className="garage-spec">
                        <small>COLOR</small>
                        <strong>
                          {car.color || "—"}
                        </strong>
                      </div>
                      <div className="garage-spec">
                        <small>YEAR</small>
                        <strong>
                          {car.year || "—"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="garage-right">
                    <div className="garage-icon-wrap">
                      <div className="garage-icon">
                        <i className="bi bi-car-front-fill"></i>
                      </div>
                    </div>
                    <Link
                      to={`/my-car-vault/${car._id}/job-card`}
                      className="garage-btn"
                    >
                      Enter Garage
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCarVault;
