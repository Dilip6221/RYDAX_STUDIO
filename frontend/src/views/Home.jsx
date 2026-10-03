import { useEffect, useState } from "react";
import ServiceCard from "../views/ServiceCard.jsx";
import CustomerReview from "../component/CustomerReview.jsx";
import WhyChooseUs from "../component/WhyChooseUs.jsx";
import HomeCta from "./HomeCta.jsx";
import HomeGallery from "./HomeGallery.jsx";
import HeroSection from "../component/HeroSection.jsx";
import RevealCarBanner from "./RevealCarBanner.jsx";

const Home = () => {

  return (
    <>
      <HeroSection />
      <ServiceCard />
      <RevealCarBanner />
      <WhyChooseUs />
      <HomeGallery />
      <CustomerReview />
      <HomeCta />
    </>

  );
};

export default Home;
