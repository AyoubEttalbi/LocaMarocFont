/**
 * Font utilities for LocaMaroc frontend
 * This file handles loading the fonts used in the application
 */

/**
 * Preloads the fonts with various weights
 * Using Montserrat for headings and Poppins for body text - perfect for automotive websites
 */
export const preloadFonts = () => {
  const fontLinks = [];
  
  // Add preconnect for Google Fonts
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect1);
  
  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect2);
  
  // Add Montserrat font (for headings)
  const montserratLink = document.createElement('link');
  montserratLink.rel = 'stylesheet';
  montserratLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(montserratLink);
  
  // Add Poppins font (for body text)
  const poppinsLink = document.createElement('link');
  poppinsLink.rel = 'stylesheet';
  poppinsLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap';
  document.head.appendChild(poppinsLink);
  
  fontLinks.push(preconnect1, preconnect2, montserratLink, poppinsLink);
  return fontLinks;
};

/**
 * Cleanup function to remove font resources
 */
export const cleanupFonts = (resources = []) => {
  // Remove any specific font resources passed in
  resources.forEach(el => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
}; 