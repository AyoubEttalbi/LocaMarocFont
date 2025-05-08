"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import {
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  Search,
  Sparkles,
  Shield,
  Clock,
  ChevronDown,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Car data for the carousel
const carData = [
  {
    id: 1,
    name: "Tesla Model S",
    image: "/assets/header.png",
    category: "Electric",
    price: 1200,
    features: ["Autopilot", "400km Range", "Supercharging"],
  },
  {
    id: 2,
    name: "BMW X5",
    image: "/assets/deals-14.png",
    category: "SUV",
    price: 950,
    features: ["All-wheel Drive", "Panoramic Roof", "Premium Sound"],
  },
  {
    id: 3,
    name: "Mercedes C-Class",
    image: "/assets/deals-13.png",
    category: "Luxury",
    price: 850,
    features: ["Leather Interior", "MBUX System", "Ambient Lighting"],
  },
  {
    id: 4,
    name: "Toyota RAV4",
    image: "/assets/deals-11.png",
    category: "SUV",
    price: 650,
    features: ["Hybrid Engine", "Safety Sense", "Apple CarPlay"],
  },
  {
    id: 5,
    name: "Audi A4",
    image: "/assets/deals-12.png",
    category: "Sedan",
    price: 800,
    features: ["Quattro AWD", "Virtual Cockpit", "B&O Sound"],
  },
]

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [searchParams, setSearchParams] = useState({
    location: "Casablanca, Morocco",
    pickupDate: "",
    returnDate: "",
  })
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Set default dates for the form
  useEffect(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    setSearchParams({
      ...searchParams,
      pickupDate: formatDateForInput(tomorrow),
      returnDate: formatDateForInput(nextWeek),
    })
  }, [])

  // Format date for input field
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams({
      ...searchParams,
      [name]: value,
    })
  }

  // Function to handle next image
  const nextImage = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentImageIndex((prevIndex) => (prevIndex === carData.length - 1 ? 0 : prevIndex + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Function to handle previous image
  const prevImage = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? carData.length - 1 : prevIndex - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Effect to handle the image transition every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage()
    }, 5000)

    // Clear interval on component unmount
    return () => clearInterval(interval)
  }, [isAnimating])

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden" id="home">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-6 pt-32 pb-32 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Content */}
          <motion.div
            className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="inline-block bg-purple-50 rounded-full px-4 py-2 shadow-sm mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <span className="flex items-center text-purple-600 font-medium text-sm">
                <Star className="w-4 h-4 text-yellow-500 mr-2 fill-yellow-500" />
                <span className="relative">
                  100% Trusted car rental platform in Morocco
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-300"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1 }}
                  ></motion.span>
                </span>
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Fast and Easy Way
              <br />
              <span className="text-purple-600 relative inline-block">
                to Rent a Car
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="10"
                  viewBox="0 0 200 10"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <path
                    d="M0,5 Q40,0 80,5 T160,5 T240,5"
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
            </motion.h1>

            <motion.p
              className="text-gray-600 mb-8 max-w-lg text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Discover a seamless car rental experience with us. Choose from a range of premium vehicles to suit your
              style and needs, and hit the road with confidence.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.a
                href="/cars"
                className="group relative inline-flex items-center bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  Rent Now
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </motion.a>

              <motion.a
                href="/cars"
                className="relative inline-flex items-center bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-full transition-all duration-200 border border-gray-300 shadow-sm hover:shadow overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Browse Cars</span>
              </motion.a>
            </motion.div>

            <motion.div
              className="flex items-center mt-10 space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <CounterStat number={500} label="Luxury Cars" suffix="+" />
              <div className="w-px h-12 bg-gray-300"></div>
              <CounterStat number={24} label="Customer Support" suffix="/7" />
              <div className="w-px h-12 bg-gray-300"></div>
              <CounterStat number={99} label="Happy Customers" suffix="%" />
            </motion.div>
          </motion.div>

          {/* Car Carousel */}
          <motion.div
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            ref={carouselRef}
          >
            <div className="relative w-full max-h-[600px] overflow-hidden z-10 header__image">
              {/* Car Info Panel */}
              <motion.div
                className="absolute top-0 left-0 z-20 bg-white/10 backdrop-blur-md p-4 m-4 rounded-xl border border-white/20 text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <h3 className="text-lg font-bold">{carData[currentImageIndex].name}</h3>
                <div className="flex items-center mt-1">
                  <span className="bg-purple-500/20 text-purple-200 text-xs px-2 py-0.5 rounded-full">
                    {carData[currentImageIndex].category}
                  </span>
                  <span className="ml-2 text-sm">{carData[currentImageIndex].price} DH/day</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {carData[currentImageIndex].features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-white/10 px-2 py-0.5 rounded-full flex items-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Car Images */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full "
                >
                  <img
                    src={carData[currentImageIndex].image || "/placeholder.svg"}
                    alt={carData[currentImageIndex].name}
                    className="w-full h-full object-contain p-6"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                {carData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 focus:outline-none ${
                      index === currentImageIndex ? "bg-white" : "bg-white bg-opacity-50 hover:bg-opacity-75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrow navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 focus:outline-none z-20 transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 focus:outline-none z-20 transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Animated car elements */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <motion.div
                  className="absolute left-[15%] bottom-[15%] w-12 h-12 rounded-full border-4 border-white/30"
                  animate={{
                    rotate: [0, 360],
                    borderColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.3)"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
                <motion.div
                  className="absolute right-[25%] bottom-[15%] w-12 h-12 rounded-full border-4 border-white/30"
                  animate={{
                    rotate: [0, 360],
                    borderColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.3)"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>

              {/* Particle effects */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{
                      x: Math.random() * 100 + "%",
                      y: "100%",
                      opacity: Math.random() * 0.5 + 0.3,
                    }}
                    animate={{
                      y: "0%",
                      opacity: [0.5, 0.8, 0],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 5,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -right-4 -top-4 bg-white rounded-full shadow-lg p-3 z-20"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 1.2 }}
            >
              <Shield className="w-6 h-6 text-purple-600" />
            </motion.div>

            <motion.div
              className="absolute -left-4 -bottom-4 bg-white rounded-full shadow-lg p-3 z-20"
              initial={{ scale: 0, rotate: 20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 1.4 }}
            >
              <Clock className="w-6 h-6 text-purple-600" />
            </motion.div>
          </motion.div>
        </div>

        {/* Search Form */}
        <motion.div
          className="relative z-20 mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <div
            className={`bg-white rounded-2xl shadow-xl transition-all duration-300 ${isSearchFocused ? "shadow-purple-200" : ""}`}
          >
            <form className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
              <div className="flex flex-col">
                <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 text-purple-500 mr-1" />
                  Pick up & Return location
                </label>
                <div className="relative">
                  <select
                    id="location"
                    name="location"
                    value={searchParams.location}
                    onChange={handleInputChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="block w-full pl-4 pr-10 py-3 text-base text-gray-900 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option>Casablanca, Morocco</option>
                    <option>Rabat, Morocco</option>
                    <option>Marrakech, Morocco</option>
                    <option>Tangier, Morocco</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="pickupDate" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 text-purple-500 mr-1" />
                  Pick up date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="pickupDate"
                    name="pickupDate"
                    value={searchParams.pickupDate}
                    onChange={handleInputChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="block w-full pl-4 py-3 text-base text-gray-900 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="returnDate" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 text-purple-500 mr-1" />
                  Return date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    value={searchParams.returnDate}
                    onChange={handleInputChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="block w-full pl-4 py-3 text-base text-gray-900 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <motion.a
                  href="/rent-now"
                  className="group relative overflow-hidden bg-purple-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Search Cars
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-1 bg-purple-400"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Counter animation component
const CounterStat = ({ number, label, suffix = "" }: { number: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // animation duration in ms
    const interval = 30 // update interval in ms
    const steps = duration / interval
    const increment = number / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= number) {
        current = number
        clearInterval(timer)
      }
      setCount(Math.floor(current))
    }, interval)

    return () => clearInterval(timer)
  }, [number])

  return (
    <div className="flex flex-col">
      <span className="text-3xl font-bold text-purple-600">
        {count}
        {suffix}
      </span>
      <span className="text-gray-600 text-sm">{label}</span>
    </div>
  )
}

// Add this to your global CSS
const globalStyles = `
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
`
