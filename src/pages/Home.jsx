import React, { useEffect, useState } from 'react';
import Header from '../components/CarRental/Header';
import Hero from '../components/CarRental/Hero';
import WhyChooseUs from '../components/CarRental/WhyChooseUs';
import About from '../components/CarRental/About';
import Testimonials from '../components/CarRental/Testimonials';
import Footer from '../components/CarRental/Footer';
import { loadAnimationStyles, initScrollReveal, initSwiper, cleanupAnimations } from '../utils/animations';
import { preloadFonts, cleanupFonts } from '../utils/fonts';

const Home = () => {
  const [animationsLoaded, setAnimationsLoaded] = useState(false);

  // Load and initialize animations and fonts
  useEffect(() => {
    let resources = [];

    const loadResources = async () => {
      try {
        // Preload Montserrat and Poppins fonts
        const fontResources = preloadFonts();
        resources = [...resources, ...fontResources];
        
        // Load CSS resources
        const styleResources = loadAnimationStyles();
        resources = [...resources, ...styleResources];

        // Initialize ScrollReveal and Swiper
        const scrollRevealScript = await initScrollReveal();
        const swiperScript = await initSwiper();
        
        resources = [...resources, scrollRevealScript, swiperScript];
        setAnimationsLoaded(true);
      } catch (error) {
        console.error('Error loading resources:', error);
      }
    };
    
    loadResources();
    
    // Cleanup function
    return () => {
      cleanupAnimations(resources);
      cleanupFonts(resources);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main id="main-content" className="relative">
        <Hero />
      <WhyChooseUs />
      <About />
      <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Home; 