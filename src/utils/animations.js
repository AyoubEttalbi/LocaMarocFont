/**
 * Animation utilities for LocaMaroc frontend
 * This file handles loading and initializing ScrollReveal and Swiper
 */

/**
 * Loads external CSS resources for animations
 */
export const loadAnimationStyles = () => {
  // Add Remixicon CSS
  const remixiconLink = document.createElement('link');
  remixiconLink.href = "https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css";
  remixiconLink.rel = "stylesheet";
  document.head.appendChild(remixiconLink);

  // Add Swiper CSS
  const swiperLink = document.createElement('link');
  swiperLink.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
  swiperLink.rel = "stylesheet";
  document.head.appendChild(swiperLink);

  return [remixiconLink, swiperLink]; // Return references for cleanup
};

/**
 * Loads ScrollReveal script and initializes animations
 */
export const initScrollReveal = () => {
  return new Promise((resolve) => {
    const scrollRevealScript = document.createElement('script');
    scrollRevealScript.src = 'https://unpkg.com/scrollreveal';
    scrollRevealScript.async = true;
    document.body.appendChild(scrollRevealScript);
    
    scrollRevealScript.onload = () => {
      if (window.ScrollReveal) {
        const scrollRevealOption = {
          distance: "50px",
          origin: "bottom",
          duration: 1000,
        };
        
        // Hero section animations
        window.ScrollReveal().reveal(".header__image img", {
          ...scrollRevealOption,
          origin: "right",
        });
        window.ScrollReveal().reveal(".header__content h2", {
          ...scrollRevealOption,
          delay: 500,
        });
        window.ScrollReveal().reveal(".header__content h1", {
          ...scrollRevealOption,
          delay: 1000,
        });
        window.ScrollReveal().reveal(".header__content .section__description", {
          ...scrollRevealOption,
          delay: 1500,
        });
        window.ScrollReveal().reveal(".header__form form", {
          ...scrollRevealOption,
          delay: 2000,
        });
        
        // About section animations
        window.ScrollReveal().reveal(".about__card", {
          ...scrollRevealOption,
          interval: 500,
        });
        
        // Why Choose Us section animations
        window.ScrollReveal().reveal(".choose__image img", {
          ...scrollRevealOption,
          origin: "left",
        });
        window.ScrollReveal().reveal(".choose__content .section__header", {
          ...scrollRevealOption,
          delay: 500,
        });
        window.ScrollReveal().reveal(".choose__content .section__description", {
          ...scrollRevealOption,
          delay: 1000,
        });
        window.ScrollReveal().reveal(".choose__card", {
          duration: 1000,
          delay: 1500,
          interval: 500,
        });
        
        resolve(scrollRevealScript);
      }
    };
  });
};

/**
 * Loads Swiper script and initializes sliders
 */
export const initSwiper = () => {
  return new Promise((resolve) => {
    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    swiperScript.async = true;
    document.body.appendChild(swiperScript);
    
    swiperScript.onload = () => {
      if (window.Swiper) {
        // Initialize testimonials slider
        new window.Swiper('.swiper', {
          slidesPerView: 1,
          spaceBetween: 30,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          },
        });
        
        resolve(swiperScript);
      }
    };
  });
};

/**
 * Cleanup function to remove all animation resources
 */
export const cleanupAnimations = (resources = []) => {
  // Remove any script or link elements loaded for animations
  document.querySelectorAll('link[href*="remixicon"]').forEach(el => el.remove());
  document.querySelectorAll('link[href*="swiper"]').forEach(el => el.remove());
  document.querySelectorAll('script[src*="scrollreveal"]').forEach(el => el.remove());
  document.querySelectorAll('script[src*="swiper"]').forEach(el => el.remove());
  
  // Also remove any specific resources passed in
  resources.forEach(el => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
}; 
