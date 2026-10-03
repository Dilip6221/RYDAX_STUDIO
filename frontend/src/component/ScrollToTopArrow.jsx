import React, { useState, useEffect } from "react";

const ScrollToTopArrow = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollPercent(scrolled);
      setVisible(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {visible && (
        <div className="scroll-arrow-wrapper" onClick={scrollToTop}>
          {/* Progress Ring */}
          <svg className="scroll-ring" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" className="ring-bg" />
            <circle
              cx="32"
              cy="32"
              r="26"
              className="ring-progress"
              strokeDasharray="163.36"
              strokeDashoffset={163.36 - (163.36 * scrollPercent) / 100}
            />
          </svg>

          {/* Inner Arrow */}
          <div className="arrow-inner">
            <svg className="arrow-icon" viewBox="0 0 24 24">
              <path d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollToTopArrow;
