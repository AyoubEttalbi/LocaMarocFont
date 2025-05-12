import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Menu, X, ChevronDown, User, LogOut, UserPlus, LogIn, Car, Home, Info, MessageSquare, Award, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  
  const isAdmin = user?.role === 'admin'
  const isStaff = user?.role === 'staff'
  // Close mobile menu when navigating - simplified and fixed
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle click outside - simplified for better mobile support
  useEffect(() => {
    const handleClickOutside = (event) => {
      // For dropdown only - let the menu button handle its own state
      if (activeDropdown && !event.target.closest('.dropdown-trigger')) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [activeDropdown])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  // Removed toggleMobileMenu function as we're using direct state setting

  return (
    <header 
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white shadow-md py-2" 
          : "bg-transparent py-4"
      }`}
      role="banner"
    >
      <div className="container mx-auto px-6">
        <nav className="flex justify-between items-center" aria-label="Main navigation">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Site logo"
          >
            <Link to="/" className="flex items-center" aria-label="Home">
              <div className="relative h-10 w-10">
                <img 
                  src="/assets/logo-dark.png" 
                  alt="LocaMaroc Logo" 
                  className="h-full w-full object-contain"
                />
                <div className="absolute -inset-1 rounded-full bg-purple-500 -z-10 blur-sm opacity-30 animate-pulse"></div>
              </div>
              <span className={`text-xl font-bold ml-2 ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                Loca<span className="text-purple-600">Maroc</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <motion.div 
            className="hidden lg:flex items-center space-x-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <NavLink href="/" label="Home" icon={<Home className="w-4 h-4" />} scrolled={scrolled} />
            
            <div className="relative dropdown-trigger">
              <button 
                onClick={() => toggleDropdown('about')}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  scrolled 
                    ? 'hover:bg-gray-100 text-gray-800 hover:text-purple-600' 
                    : 'hover:bg-white/10 text-gray-800 hover:text-purple-600'
                }`}
              >
                <Info className="w-4 h-4 mr-1.5" />
                About
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${activeDropdown === 'about' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20"
                  >
                    <Link to="/#about" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                      Our Story
                    </Link>
                    <Link to="/#team" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                      Our Team
                    </Link>
                    <Link to="/#faq" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                      FAQ
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <NavLink href="/cars" label="Rental Deals" icon={<Car className="w-4 h-4" />} scrolled={scrolled} />
            <NavLink href="#choose" label="Why Choose Us" icon={<Award className="w-4 h-4" />} scrolled={scrolled} />
            <NavLink href="#client" label="Testimonials" icon={<MessageSquare className="w-4 h-4" />} scrolled={scrolled} />
            
            {(isAdmin || isStaff) && (
              <NavLink 
                href={isStaff ? "/admin/reservations" : "/dashboard"} 
                label="Dashboard" 
                icon={<User className="w-4 h-4" />} 
                scrolled={scrolled} 
              />
            )}
          </motion.div>

          {/* Auth Buttons */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin || isStaff ? (
                  <Link
                    to={isStaff ? "/admin/reservations" : "/dashboard"}
                    className="group relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <User className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10">Dashboard</span>
                  </Link>
                ) : (
                  <Link to="/profile" className="group relative">
                    <div className="flex items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-medium text-purple-600 transition-all duration-200">
                      <User className="w-4 h-4 mr-2" />
                      <span>{user?.name}</span>
                    </div>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300 -z-10"></span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="relative overflow-hidden w-10 h-10 flex items-center justify-center rounded-full text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-200 hover:border-purple-600 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="absolute inset-0 rounded-full bg-purple-100 transform scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="group relative overflow-hidden bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <LogIn className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Login</span>
                </Link>
                
                <Link
                  to="/register"
                  className="relative overflow-hidden w-10 h-10 flex items-center justify-center rounded-full text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-200 hover:border-purple-600 transition-all duration-300"
                  title="Register"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="absolute inset-0 rounded-full bg-purple-100 transform scale-0 hover:scale-100 transition-transform duration-300 -z-10"></span>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Mobile Menu Toggle - Simplified with direct state setting */}
          <div className="lg:hidden">
            <button
              id="menu-btn"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="nav-links"
              className={`text-2xl ${scrolled ? 'text-gray-900' : 'text-gray-900'} z-50`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu - Simplified animation for better compatibility */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="nav-links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white shadow-lg overflow-hidden fixed top-16 left-0 right-0 z-50 max-h-screen overflow-y-auto"
          >
            <div className="container mx-auto px-6 py-4 space-y-1">
              <MobileNavLink to="/" label="Home" icon={<Home className="w-5 h-5" />} />
              
              {/* Fixed dropdown section for mobile */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-800 font-medium transition-colors">
                  <div className="flex items-center">
                    <Info className="w-5 h-5" />
                    <span className="ml-1.5">About</span>
                  </div>
                </div>
                <div className="pl-4 space-y-1">
                  <MobileNavLink to="/#about" label="Our Story" icon={null} />
                  <MobileNavLink to="/#team" label="Our Team" icon={null} />
                  <MobileNavLink to="/#faq" label="FAQ" icon={null} />
                </div>
              </div>
              
              <MobileNavLink to="/cars" label="Rental Deals" icon={<Car className="w-5 h-5" />} />
              <MobileNavLink to="#choose" label="Why Choose Us" icon={<Award className="w-5 h-5" />} />
              <MobileNavLink to="#client" label="Testimonials" icon={<MessageSquare className="w-5 h-5" />} />
              
              {isAdmin || isStaff && (
                <MobileNavLink to="/dashboard" label="Dashboard" icon={<User className="w-5 h-5" />} />
              )}

              <div className="pt-4 mt-4 border-t border-gray-100">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    {!isAdmin || !isStaff && (
                      <Link
                        to="/profile"
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-800 font-medium transition-colors"
                      >
                        <div className="flex items-center">
                          <User className="w-5 h-5 mr-3 text-purple-600" />
                          <span>{user?.name}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-3 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-600 font-medium transition-colors"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      className="flex items-center justify-between px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
                    >
                      <div className="flex items-center">
                        <LogIn className="w-5 h-5 mr-3" />
                        <span>Login</span>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                    
                    <Link
                      to="/register"
                      className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-800 font-medium transition-colors"
                    >
                      <div className="flex items-center">
                        <UserPlus className="w-5 h-5 mr-3 text-purple-600" />
                        <span>Register</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Desktop Nav Link Component
const NavLink = ({ href, label, icon, scrolled }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    // If it's a section link (starts with #)
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const target = document.getElementById(targetId);
      
      if (target) {
        // Calculate the scroll position
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 80;
        
        // Smooth scroll to the position
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight,
          behavior: 'smooth'
        });
      }
      return;
    }
    
    // For regular routes
    if (!href.startsWith('http')) {
      e.preventDefault();
      navigate(href);
    }
  };

  // For section links, use anchor tag
  if (href.startsWith('#')) {
    return (
      <a 
        href={href}
        onClick={handleClick}
        className={`group flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          scrolled 
            ? 'hover:bg-gray-100 text-gray-800 hover:text-purple-600' 
            : 'hover:bg-white/10 text-gray-800 hover:text-purple-600'
        }`}
      >
        <span className="flex items-center">
          {icon}
          <span className="ml-1.5">{label}</span>
        </span>
        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-purple-600 mt-0.5"></span>
      </a>
    );
  }

  // For external links, use Link component
  return (
    <Link 
      to={href}
      className={`group flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        scrolled 
          ? 'hover:bg-gray-100 text-gray-800 hover:text-purple-600' 
          : 'hover:bg-white/10 text-gray-800 hover:text-purple-600'
      }`}
    >
      <span className="flex items-center">
        {icon}
        <span className="ml-1.5">{label}</span>
      </span>
      <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-purple-600 mt-0.5"></span>
    </Link>
  );
}

// Mobile Nav Link Component
const MobileNavLink = ({ to, label, icon }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // Handle section links (anchors)
    if (to.startsWith('#')) {
      const targetId = to.replace('#', '');
      const target = document.getElementById(targetId);
      
      if (target) {
        // Calculate scroll position
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 80;
        
        // Smooth scroll
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight,
          behavior: 'smooth'
        });
      }
      return;
    }
    
    // Handle combined routes with anchors
    if (to.includes('#')) {
      const [route, anchor] = to.split('#');
      navigate(route || '/');
      
      // After navigation, scroll to the anchor
      setTimeout(() => {
        const target = document.getElementById(anchor);
        if (target) {
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 80;
          
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }
    
    // Standard navigation
    navigate(to);
  };

  return (
    <a 
      href={to}
      onClick={handleClick}
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-800 font-medium transition-colors"
    >
      <div className="flex items-center">
        {icon && icon}
        <span className={icon ? "ml-1.5" : ""}>{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </a>
  );
}