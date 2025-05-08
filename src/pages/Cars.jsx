import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Header from "../components/CarRental/Header"
import Footer from "../components/CarRental/Footer"
import {
  Search,
  MapPin,
  Calendar,
  Heart,
  Star,
  Users,
  Gauge,
  Fuel,
  Grid,
  List,
  X,
  ChevronDown,
  Sliders,
  Check,
  Sparkles,
  Car,
  RotateCw,
  Shield,
  Zap,
  ArrowRight,
  Filter,
  Banknote,
  ChevronRight,
  Wifi,
  Bluetooth,
  Music,
  Snowflake,
  Umbrella,
} from "lucide-react"
import { carService } from "../services/api"
import { motion, AnimatePresence } from "framer-motion"

export default function Cars() {
  // State management
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12) // Show 12 cars per page
  const [totalPages, setTotalPages] = useState(1)
  const [filteredCars, setFilteredCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cars, setCars] = useState([])
  const [location, setLocation] = useState("Casablanca")
  const [pickupDate, setPickupDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedGearTypes, setSelectedGearTypes] = useState([])
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([])
  const [selectedYears, setSelectedYears] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [minSeats, setMinSeats] = useState(0)
  const [activeCarId, setActiveCarId] = useState(null)
  const [scrollY, setScrollY] = useState(0)
  const searchRef = useRef(null)

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch cars from the API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true)
        const response = await carService.getAllCars()
        setCars(response.data)
      } catch (error) {
        console.error("Error fetching cars:", error)
        // Use sample data if API fails
        setCars(sampleCars)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 800) // Simulate loading for better UX
      }
    }

    fetchCars()
  }, [])

  // Helper functions for pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPaginationNumbers = () => {
    const maxVisiblePages = 5
    const pages = []
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than or equal to max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first and last pages, plus 3 pages around current page
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, currentPage + 2)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add "..." if there are pages not shown
      if (start > 2) {
        pages.unshift('...')
        pages.unshift(1)
      }
      if (end < totalPages - 1) {
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true)
    try {
      // Filter cars
      const filteredCars = cars.filter((car) => {
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.brand)
        const matchesGearType = selectedGearTypes.length === 0 || selectedGearTypes.includes(car.gearType)
        const matchesFuelType = selectedFuelTypes.length === 0 || selectedFuelTypes.includes(car.fuelType)
        const matchesYear = selectedYears.length === 0 || selectedYears.includes(car.year)
        const matchesFeatures = selectedFeatures.length === 0 || selectedFeatures.every(feature => car.features?.includes(feature))
        const matchesSeats = car.seats >= minSeats
        const matchesSearch = car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.category?.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesBrand && matchesGearType && matchesFuelType && matchesYear && matchesFeatures && matchesSeats && matchesSearch
      })

      // Sort cars
      let sortedCars = [...filteredCars]
      switch (sortBy) {
        case 'price-low-to-high':
          sortedCars = sortedCars.sort((a, b) => a.pricePerDay - b.pricePerDay)
          break
        case 'price-high-to-low':
          sortedCars = sortedCars.sort((a, b) => b.pricePerDay - a.pricePerDay)
          break
        case 'newest':
          sortedCars = sortedCars.sort((a, b) => new Date(b.year) - new Date(a.year))
          break
        case 'oldest':
          sortedCars = sortedCars.sort((a, b) => new Date(a.year) - new Date(b.year))
          break
        default:
          // Default to recommended sorting
          break
      }

      // Calculate pagination
      const total = sortedCars.length
      const pages = Math.ceil(total / itemsPerPage)
      setTotalPages(pages)

      // Get current page cars
      const start = (currentPage - 1) * itemsPerPage
      const end = start + itemsPerPage
      const currentCars = sortedCars.slice(start, end)

      setFilteredCars(currentCars)
    } catch (error) {
      console.error('Error filtering/sorting cars:', error)
    } finally {
      setIsLoading(false)
    }
  }, [
    cars,
    filterType,
    searchQuery,
    priceRange,
    sortBy,
    selectedBrands,
    selectedGearTypes,
    selectedFuelTypes,
    selectedYears,
    selectedFeatures,
    minSeats,
    currentPage,
    itemsPerPage
  ])

  // Toggle favorite
  const toggleFavorite = (carId, e) => {
    e.preventDefault()
    e.stopPropagation()

    if (favorites.includes(carId)) {
      setFavorites(favorites.filter((id) => id !== carId))
    } else {
      setFavorites([...favorites, carId])
    }
  }

  // Handle price range change
  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange]
    newRange[index] = Number.parseInt(e.target.value)
    setPriceRange(newRange)
  }

  // Toggle brand selection
  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  // Toggle gear type selection
  const toggleGearType = (type) => {
    if (selectedGearTypes.includes(type)) {
      setSelectedGearTypes(selectedGearTypes.filter((t) => t !== type))
    } else {
      setSelectedGearTypes([...selectedGearTypes, type])
    }
  }

  // Toggle fuel type selection
  const toggleFuelType = (type) => {
    if (selectedFuelTypes.includes(type)) {
      setSelectedFuelTypes(selectedFuelTypes.filter((t) => t !== type))
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, type])
    }
  }

  // Toggle year selection
  const toggleYear = (year) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year))
    } else {
      setSelectedYears([...selectedYears, year])
    }
  }

  // Toggle feature selection
  const toggleFeature = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))
    } else {
      setSelectedFeatures([...selectedFeatures, feature])
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setFilterType("all")
    setPriceRange([0, 1000])
    setSelectedBrands([])
    setSelectedGearTypes([])
    setSelectedFuelTypes([])
    setSelectedYears([])
    setSelectedFeatures([])
    setMinSeats(0)
  }

  // Get unique brands from cars
  const uniqueBrands = [...new Set(cars.map((car) => car.brand))].sort()

  // Get unique gear types from cars
  const uniqueGearTypes = [...new Set(cars.map((car) => car.gearType))].sort()

  // Get unique fuel types from cars
  const uniqueFuelTypes = [...new Set(cars.map((car) => car.fuelType))].sort()

  // Get unique years from cars
  const uniqueYears = [...new Set(cars.map((car) => car.year?.toString()))].sort((a, b) => b - a)

  // Get unique features from cars
  const allFeatures = cars.reduce((acc, car) => {
    if (car.features) {
      return [...acc, ...(Array.isArray(car.features) ? car.features : [])]
    }
    return acc
  }, [])
  const uniqueFeatures = [...new Set(allFeatures)].sort()

  // Focus on search when user presses Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Get car features icons
  const getFeatureIcon = (feature) => {
    const featureIcons = {
      "Air Conditioning": <Snowflake className="h-4 w-4" />,
      Bluetooth: <Bluetooth className="h-4 w-4" />,
      WiFi: <Wifi className="h-4 w-4" />,
      "Audio System": <Music className="h-4 w-4" />,
      Sunroof: <Umbrella className="h-4 w-4" />,
    }

    return featureIcons[feature] || <Check className="h-4 w-4" />
  }

  return (
    <div className="car-rental-app min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section with Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-gray-900 py-16 pt-32"
      >
        <div className="px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-md text-white">
              Find Your Perfect Rental Car
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Explore our wide range of vehicles for any budget and need
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-xl p-6 max-w-5xl mx-auto transform translate-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search by brand, model, or category... (Ctrl+K)"
                    className="pl-10 pr-4 py-4 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                </div>
                <select
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white shadow-sm transition-all duration-300"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Tangier">Tangier</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Fes">Fes</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-300"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
                </div>
                <input
                  type="date"
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-300"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>

              <div className="col-span-1 md:col-span-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-4 rounded-lg font-medium transition duration-200 flex items-center justify-center shadow-md group"
                >
                  <span>Search Available Cars</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-grow py-20 bg-gray-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden md:block w-80 flex-shrink-0"
            >
              <div
                className={`bg-white rounded-xl shadow-sm p-6 ${scrollY > 300 ? "sticky top-24" : ""} transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-purple-500" />
                    Filters
                  </h3>
                  <button
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
                    onClick={resetFilters}
                  >
                    Reset All
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Car Category Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Car className="h-4 w-4 mr-2 text-purple-500" />
                      Car Category
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="carType"
                          checked={filterType === "all"}
                          onChange={() => setFilterType("all")}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 transition-colors duration-200"
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                          All Categories
                        </span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="carType"
                          checked={filterType === "economy"}
                          onChange={() => setFilterType("economy")}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 transition-colors duration-200"
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                          Economy
                        </span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="carType"
                          checked={filterType === "suv"}
                          onChange={() => setFilterType("suv")}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 transition-colors duration-200"
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                          SUVs
                        </span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="carType"
                          checked={filterType === "luxury"}
                          onChange={() => setFilterType("luxury")}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 transition-colors duration-200"
                        />
                        <span className="ml-2 text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                          Luxury
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Banknote className="h-4 w-4 mr-2 text-purple-500" />
                      Price Range
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{priceRange[0]} DH</span>
                        <span>{priceRange[1]} DH</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                      Brand
                    </h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {uniqueBrands.map((brand) => (
                        <label key={brand} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded transition-colors duration-200"
                          />
                          <span className="ml-2 text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Transmission Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Gauge className="h-4 w-4 mr-2 text-purple-500" />
                      Transmission
                    </h4>
                    <div className="space-y-3">
                      {uniqueGearTypes.map((type) => (
                        <label key={type} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedGearTypes.includes(type)}
                            onChange={() => toggleGearType(type)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded transition-colors duration-200"
                          />
                          <span className="ml-2 text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Fuel Type Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Fuel className="h-4 w-4 mr-2 text-purple-500" />
                      Fuel Type
                    </h4>
                    <div className="space-y-3">
                      {uniqueFuelTypes.map((type) => (
                        <label key={type} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFuelTypes.includes(type)}
                            onChange={() => toggleFuelType(type)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded transition-colors duration-200"
                          />
                          <span className="ml-2 text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                      Year
                    </h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {uniqueYears.map((year) => (
                        <label key={year} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedYears.includes(year)}
                            onChange={() => toggleYear(year)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded transition-colors duration-200"
                          />
                          <span className="ml-2 text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                            {year}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Seats Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-purple-500" />
                      Minimum Seats
                    </h4>
                    <div className="space-y-3">
                      <select
                        value={minSeats}
                        onChange={(e) => setMinSeats(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      >
                        <option value="0">Any</option>
                        <option value="2">2+ seats</option>
                        <option value="4">4+ seats</option>
                        <option value="5">5+ seats</option>
                        <option value="7">7+ seats</option>
                      </select>
                    </div>
                  </div>

                  {/* Features Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-purple-500" />
                      Features
                    </h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {uniqueFeatures.map((feature) => (
                        <label key={feature} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature)}
                            onChange={() => toggleFeature(feature)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded transition-colors duration-200"
                          />
                          <span className="ml-2 text-gray-700 group-hover:text-purple-700 transition-colors duration-200">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="md:hidden mb-6"
              >
                <button
                  onClick={() => setShowFilters(true)}
                  className="w-full bg-white shadow-sm rounded-lg py-3 px-4 flex items-center justify-center gap-2 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  <Sliders className="h-5 w-5" />
                  Filters
                </button>
              </motion.div>

              {/* Mobile Filter Sidebar */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                  >
                    <motion.div
                      initial={{ x: 300 }}
                      animate={{ x: 0 }}
                      exit={{ x: 300 }}
                      transition={{ type: "spring", damping: 25 }}
                      className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg p-6 overflow-y-auto"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Car Category Filter */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <Car className="h-4 w-4 mr-2 text-purple-500" />
                            Car Category
                          </h4>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="mobileCarType"
                                checked={filterType === "all"}
                                onChange={() => setFilterType("all")}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="ml-2 text-gray-700">All Categories</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="mobileCarType"
                                checked={filterType === "economy"}
                                onChange={() => setFilterType("economy")}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="ml-2 text-gray-700">Economy</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="mobileCarType"
                                checked={filterType === "suv"}
                                onChange={() => setFilterType("suv")}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="ml-2 text-gray-700">SUVs</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="mobileCarType"
                                checked={filterType === "luxury"}
                                onChange={() => setFilterType("luxury")}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="ml-2 text-gray-700">Luxury</span>
                            </label>
                          </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <Banknote className="h-4 w-4 mr-2 text-purple-500" />
                            Price Range
                          </h4>
                          <div className="space-y-4">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>{priceRange[0]} DH</span>
                              <span>{priceRange[1]} DH</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              step="50"
                              value={priceRange[0]}
                              onChange={(e) => handlePriceChange(e, 0)}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <input
                              type="range"
                              min="0"
                              max="1000"
                              step="50"
                              value={priceRange[1]}
                              onChange={(e) => handlePriceChange(e, 1)}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                          </div>
                        </div>

                        <div className="pt-4 space-y-3">
                          <button
                            onClick={() => setShowFilters(false)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                          >
                            Apply Filters
                          </button>
                          <button
                            onClick={() => {
                              resetFilters()
                              setShowFilters(false)
                            }}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Header */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {filteredCars.length} {filteredCars.length === 1 ? "Car" : "Cars"} Available
                  </h2>
                  <p className="text-sm text-gray-500">
                    {filterType !== "all"
                      ? `Filtered by: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`
                      : "All car categories"}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full transition-all duration-200"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="year-new">Year: Newest First</option>
                      <option value="year-old">Year: Oldest First</option>
                      <option value="mileage-low">Mileage: Lowest First</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${
                        viewMode === "grid" ? "bg-purple-50 text-purple-600" : "text-gray-500 hover:bg-gray-50"
                      } transition-colors duration-200`}
                      aria-label="Grid view"
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list" ? "bg-purple-50 text-purple-600" : "text-gray-500 hover:bg-gray-50"
                      } transition-colors duration-200`}
                      aria-label="List view"
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Loading State */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
                    >
                      <div className="h-48 bg-gray-300"></div>
                      <div className="p-5 space-y-3">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="h-4 bg-gray-300 rounded"></div>
                          <div className="h-4 bg-gray-300 rounded"></div>
                          <div className="h-4 bg-gray-300 rounded"></div>
                          <div className="h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className="pt-4 flex justify-between items-center">
                          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-10 bg-gray-300 rounded w-1/4"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : filteredCars.length === 0 ? (
                // Empty State
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-8 text-center"
                >
                  <div className="mx-auto w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any cars matching your current filters. Try adjusting your search criteria.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium transition duration-200"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                // Car Listings
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}
                >
                  {filteredCars.map((car, index) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
                        viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                      }`}
                      onMouseEnter={() => setActiveCarId(car.id)}
                      onMouseLeave={() => setActiveCarId(null)}
                    >
                      <div
                        className={`relative ${viewMode === "list" ? "sm:w-2/5" : "h-48"} bg-gray-200 overflow-hidden`}
                      >
                        <img
                          src={car.image || "/placeholder.svg?height=200&width=300"}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleFavorite(car.id, e)}
                          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                          aria-label={favorites.includes(car.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites.includes(car.id) ? "text-red-500 fill-red-500" : "text-gray-400"
                            } transition-colors duration-200`}
                          />
                        </motion.button>
                        {car.isNew && (
                          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                            NEW
                          </div>
                        )}
                        {!car.availability && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-md font-bold text-sm">
                              UNAVAILABLE
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={`p-5 ${viewMode === "list" ? "sm:w-3/5" : ""}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {car.brand} {car.model}
                          </h3>
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="text-sm font-medium text-gray-700">{car.rating || "4.5"}</span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 mb-4">
                          {car.category?.charAt(0).toUpperCase() + car.category?.slice(1)} • {car.year} • {car.color}
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-4">
                          <div className="flex items-center text-gray-700">
                            <Users className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="text-sm">{car.seats} Seats</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Gauge className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="text-sm">{car.gearType}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Fuel className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="text-sm">{car.fuelType}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <RotateCw className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="text-sm">{car.mileage?.toLocaleString()} km</span>
                          </div>
                        </div>

                        {viewMode === "list" && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(car.features) && car.features.length > 0 &&
                                car.features.slice(0, 4).map((feature, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
                                  >
                                    {getFeatureIcon(feature)}
                                    <span className="ml-1">{feature}</span>
                                  </span>
                                ))}
                              {car.features && car.features.length > 4 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  +{car.features.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">{car.pricePerDay}</span>
                            <span className="text-gray-600 text-sm"> DH/day</span>
                          </div>
                          <Link
                            to={`/cars/${car.id}/reserve`}
                            className={`${
                              car.availability
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                : "bg-gray-400 cursor-not-allowed"
                            } text-white px-4 py-2 rounded-lg transition duration-200 font-medium flex items-center group`}
                            onClick={(e) => !car.availability && e.preventDefault()}
                          >
                            {car.availability ? (
                              <>
                                <span>Rent Now</span>
                                <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                              </>
                            ) : (
                              "Unavailable"
                            )}
                          </Link>
                        </div>

                        {viewMode === "list" && (
                          <div className="mt-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 text-green-500 mr-1" />
                              <p>Insurance valid until {new Date(car.insuranceExpiryDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredCars.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 flex justify-center"
                >
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-2 py-2 rounded-md border border-gray-300 bg-white transition-colors duration-200 ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {getPaginationNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md border transition-colors duration-200 ${
                          page === currentPage
                            ? 'border-purple-600 bg-purple-600 text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-2 rounded-md border border-gray-300 bg-white transition-colors duration-200 ${
                        currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Missing Wallet component
const Wallet = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  )
}
