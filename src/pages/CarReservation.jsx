
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { carService, authService } from "../services/api"
import Header from "../components/CarRental/Header"
import { useAuth } from "../contexts/AuthContext"
import { reservationService } from "../services/api"
import {
  Calendar,
  MapPin,
  User,
  Shield,
  Check,
  Car,
  Gauge,
  Fuel,
  Users,
  BadgeCheck,
  AlertCircle,
  Zap,
  PhoneIcon,
  CreditCardIcon,
  CheckCircleIcon,
  DownloadIcon,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Footer from "../components/CarRental/Footer"

export default function CarReservation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  // console.log(user)
  // Add loading state
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState({})

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Accessories and insurance options with DH prices
  const accessoriesCatalog = [
    {
      id: "gps",
      name: "GPS Navigation",
      price: 150,
      description: "Advanced GPS with real-time updates",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      id: "child-seat",
      name: "Child Safety Seat",
      price: 200,
      description: "Certified child seat for maximum safety",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "wifi",
      name: "Portable WiFi Hotspot",
      price: 120,
      description: "Stay connected with high-speed internet",
      icon: <Wifi className="h-5 w-5" />,
    },
  ]

  const insuranceOptions = [
    {
      id: "basic",
      name: "Basic Coverage",
      price: 250,
      description: "Basic collision coverage with standard deductible",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: "premium",
      name: "Premium Protection",
      price: 450,
      description: "Comprehensive coverage with lower deductible",
      icon: <BadgeCheck className="h-5 w-5" />,
    },
  ]

  // Driver options
  const driverOptions = [
    {
      id: "self",
      name: "Self-Drive",
      price: 0,
      description: "Drive the car yourself",
    },
    {
      id: "driver",
      name: "With Driver",
      price: 350,
      description: "Professional driver included",
    },
  ]

  // State management
  const [selectedCar, setSelectedCar] = useState(null)
  const [reservationId, setReservationId] = useState(null)
  
  // Reset reservationId when component mounts
  useEffect(() => {
    console.log('Component mounted, resetting reservationId')
    setReservationId(null)
    
    // Cleanup function to reset state when component unmounts
    return () => {
      console.log('Component unmounting, cleaning up')
      setReservationId(null)
    }
  }, [])
  const [rentalDetails, setRentalDetails] = useState({
    pickupLocation: "",
    returnLocation: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
  })
  const [selectedAccessories, setSelectedAccessories] = useState([])
  const [selectedInsurance, setSelectedInsurance] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState("self")
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    age: user?.age || "",
    driverLicense: user?.driverLicense || ""
  })

  // State for locations
  const [locations, setLocations] = useState([])

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await carService.getLocations()
        setLocations(response.data)
      } catch (error) {
        console.error("Error fetching locations:", error)
        // Set default locations as fallback
        setLocations([
          { id: 1, city: "Casablanca", code: "CAS" },
          { id: 2, city: "Marrakech", code: "MRK" },
          { id: 3, city: "Rabat", code: "RBT" },
          { id: 4, city: "Fes", code: "FES" },
          { id: 5, city: "Tangier", code: "TNG" },
          { id: 6, city: "Agadir", code: "AGA" },
        ])
      }
    }
    fetchLocations()
  }, [])

  // Fetch car data
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setIsLoading(true)
        const response = await carService.getCarById(id)
        // Ensure features is an array and clean up any formatting issues
        const carData = {
          ...response.data,
          features: Array.isArray(response.data.features)
            ? response.data.features
            : typeof response.data.features === 'string'
              ? response.data.features
                  .replace(/\"/g, '"') // Replace escaped quotes
                  .replace(/\\/g, '') // Remove backslashes
                  .split(',') // Split by comma
                  .map(feature => feature.trim()) // Trim whitespace
                  .filter(feature => feature) // Remove empty strings
              : [],
        }
        setSelectedCar(carData)
      } catch (error) {
        console.error("Error fetching car:", error)
        navigate("/cars")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCarData()
    }
  }, [id, navigate])

  // Calculate total cost
  const calculateTotalCost = () => {
    if (!selectedCar) return 0
    if (!rentalDetails.pickupDate || !rentalDetails.returnDate) return selectedCar.pricePerDay

    // Calculate rental duration
    const pickupDate = new Date(rentalDetails.pickupDate)
    const returnDate = new Date(rentalDetails.returnDate)
    const rentalDays = Math.max(1, Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)))

    // Base car rental cost
    const baseRentalCost = selectedCar.pricePerDay * rentalDays

    // Accessories cost
    const accessoriesCost = selectedAccessories.reduce((total, accessoryId) => {
      const accessory = accessoriesCatalog.find((a) => a.id === accessoryId)
      return total + (accessory ? accessory.price * rentalDays : 0)
    }, 0)

    // Insurance cost
    const insuranceCost = selectedInsurance
      ? insuranceOptions.find((i) => i.id === selectedInsurance).price * rentalDays
      : 0

    // Driver cost
    const driverCost = selectedDriver === "driver" ? 350 * rentalDays : 0

    return baseRentalCost + accessoriesCost + insuranceCost + driverCost
  }

  // Handle PDF download
  const handleDownloadPdf = async (id) => {
    console.log('=== PDF Download Debug ===')
    console.log('Current reservationId state:', reservationId)
    console.log('Attempting to download PDF for reservation ID:', id)
    
    if (!id) {
      const errorMsg = 'No reservation ID found. Please complete your reservation first.'
      console.error(errorMsg)
      alert(errorMsg)
      return
    }
    
    try {
      console.log('Sending request to download PDF for reservation ID:', id)
      const response = await reservationService.downloadReservationPdf(id)
      console.log('PDF download response received:', response)
      
      if (!response || !response.data) {
        throw new Error('No data received from server')
      }
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reservation-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('PDF download initiated successfully')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        
        if (error.response.status === 404) {
          alert('Reservation not found. The requested reservation does not exist or has been deleted.')
        } else if (error.response.status === 403) {
          alert('You do not have permission to access this reservation.')
        } else if (error.response.status === 500) {
          alert('Server error occurred while generating the PDF. Please try again later.')
        } else {
          alert(`Failed to download PDF. Server responded with status: ${error.response.status}`)
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request)
        alert('No response from server. Please check your internet connection and try again.')
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message)
        alert('Failed to download PDF. Please try again.')
      }
    }
  }

  // Handle next step
  const handleNextStep = (e) => {
    e.preventDefault()
    if (currentStep === 1) {
      if (validateRentalDetails()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      if (validateCustomerInfo()) {
        setCurrentStep(3)
      }
    } else if (currentStep === 3) {
      handleSubmitReservation()
    }
  }

  // Handle reservation submission
  const handleSubmitReservation = async () => {
    try {
      setIsLoading(true)

      // Validate dates first
      if (!rentalDetails.pickupDate || !rentalDetails.returnDate) {
        throw new Error('Pickup and return dates are required')
      }

      if (new Date(rentalDetails.pickupDate) >= new Date(rentalDetails.returnDate)) {
        throw new Error('Return date must be after pickup date')
      }

      // Format the data to match backend expectations
      const reservationData = {
        pickup_location: locations.find(loc => loc.city === rentalDetails.pickupLocation)?.id,
        dropoff_location: locations.find(loc => loc.city === rentalDetails.returnLocation)?.id,
        pickup_date: rentalDetails.pickupDate,
        dropoff_date: rentalDetails.returnDate,
        car_type: selectedCar.type || selectedCar.brand,
        customer_info: {
          fullName: customerInfo.fullName.trim(),
          email: customerInfo.email.trim(),
          phone: customerInfo.phone.trim(),
          age: Number(customerInfo.age),
          driverLicense: customerInfo.driverLicense.trim()
        },
        accessories: selectedAccessories.map(id => id.trim()),
        insurance: selectedInsurance?.trim(),
        driver: selectedDriver === 'self' ? false : true,
        // Set selectdriver to 1 (true) when 'With Driver' is selected and 0 (false) when 'Self-Drive' is selected
        selectdriver: selectedDriver === 'driver' ? 1 : 0,
        total_cost: calculateTotalCost(),
        vehicle_id: selectedCar.id,
        payment_id : 1
      }

      const response = await reservationService.createReservation(reservationData)
      console.log('=== Reservation Created ===')
      console.log('Full response:', response)
      console.log('Response data:', response.data)
      
      // The response has the reservation data in response.data.reservation
      const reservation = response.data.reservation || response.data
      console.log('Extracted reservation data:', reservation)
      
      if (!reservation) {
        const errorMsg = 'No reservation data in response from server'
        console.error(errorMsg, { response })
        throw new Error(errorMsg)
      }
      
      // Try different possible ID fields
      const newReservationId = reservation.id || reservation.reservation_id
      console.log('Extracted reservation ID:', newReservationId)
      
      if (!newReservationId) {
        const errorMsg = 'No valid reservation ID found in response'
        console.error(errorMsg, { reservation })
        throw new Error(errorMsg)
      }
      
      console.log('Setting new reservation ID in state:', newReservationId)
      setReservationId(newReservationId)
      setShowConfirmation(true)
    } catch (error) {
      console.error("Error creating reservation:", error)
      // Show more specific error messages
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message)
      } else {
        alert(error.message || "There was an error creating your reservation. Please check all fields and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Validate rental details
  const validateRentalDetails = () => {
    const { pickupLocation, returnLocation, pickupDate, returnDate, pickupTime, returnTime } = rentalDetails

    const newErrors = {}

    if (!pickupLocation) newErrors.pickupLocation = "Pickup location is required"
    if (!returnLocation) newErrors.returnLocation = "Return location is required"
    if (!pickupDate) newErrors.pickupDate = "Pickup date is required"
    if (!returnDate) newErrors.returnDate = "Return date is required"
    if (!pickupTime) newErrors.pickupTime = "Pickup time is required"
    if (!returnTime) newErrors.returnTime = "Return time is required"

    if (pickupDate && returnDate) {
      const pickup = new Date(pickupDate)
      const returnD = new Date(returnDate)

      if (pickup > returnD) {
        newErrors.returnDate = "Return date must be after pickup date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate customer info
  const validateCustomerInfo = () => {
    const { fullName, email, phone, age, driverLicense } = customerInfo

    const newErrors = {}

    if (!fullName) newErrors.fullName = "Full name is required"
    if (!email) newErrors.email = "Email is required"
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"
    if (!phone) newErrors.phone = "Phone number is required"
    if (!age) newErrors.age = "Age is required"
    if (age && (Number.parseInt(age) < 18 || Number.parseInt(age) > 100))
      newErrors.age = "Age must be between 18 and 100"

    if (selectedDriver === "self") {
      if (!driverLicense) newErrors.driverLicense = "Driver's license is required for self-drive"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Render confirmation message
  const renderConfirmation = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservation Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for choosing LocaMaroc. Our team will contact you shortly to finalize your reservation.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
          <h3 className="font-semibold mb-4 text-lg">Reservation Details:</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Total Cost:</span>
              <span className="font-bold text-purple-600">{calculateTotalCost()} DH</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Pickup:</span>
              <span className="font-medium">
                {locations.find((loc) => loc.code === rentalDetails.pickupLocation)?.city ||
                  rentalDetails.pickupLocation}{" "}
                - {new Date(rentalDetails.pickupDate).toLocaleDateString()} at {rentalDetails.pickupTime}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Return:</span>
              <span className="font-medium">
                {locations.find((loc) => loc.code === rentalDetails.returnLocation)?.city ||
                  rentalDetails.returnLocation}{" "}
                - {new Date(rentalDetails.returnDate).toLocaleDateString()} at {rentalDetails.returnTime}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Driver Option:</span>
              <span className="font-medium">
                {selectedDriver === "self" ? "Self-Drive" : "With Professional Driver"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reservation ID:</span>
              <span className="font-medium text-purple-600">
                #{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200"
          >
            Go to Home
          </Link>
          <Link
            to="/cars"
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md transition-colors duration-200"
          >
            Browse More Cars
          </Link>
          <button
            onClick={() => handleDownloadPdf(reservationId)}
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 mt-4 sm:mt-0"
            disabled={!reservationId}
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            {reservationId ? 'Download Reservation PDF' : 'Processing...'}
          </button>
        </div>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!selectedCar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h2>
          <p className="text-gray-600 mb-6">The car you're looking for is not available or doesn't exist.</p>
          <Link
            to="/cars"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Return to Cars List
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="car-rental-app min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 mt-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-gray-900 mb-8"
          >
            {showConfirmation ? "Reservation Complete" : `Reserve ${selectedCar.brand} ${selectedCar.model}`}
          </motion.h1>

          {!showConfirmation ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex justify-center items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-purple-600 text-white" : "bg-gray-200"} transition-colors duration-300`}
                    >
                      1
                    </div>
                    <div className="text-xs absolute mt-16">Rental Details</div>
                    <div
                      className={`h-1 w-16 sm:w-24 ${currentStep >= 2 ? "bg-purple-600" : "bg-gray-200"} transition-colors duration-300`}
                    ></div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-purple-600 text-white" : "bg-gray-200"} transition-colors duration-300`}
                    >
                      2
                    </div>
                    <div className="text-xs absolute mt-16">Personal Info</div>
                    <div
                      className={`h-1 w-16 sm:w-24 ${currentStep >= 3 ? "bg-purple-600" : "bg-gray-200"} transition-colors duration-300`}
                    ></div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-purple-600 text-white" : "bg-gray-200"} transition-colors duration-300`}
                    >
                      3
                    </div>
                    <div className="text-xs absolute mt-16">Confirmation</div>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Car Details Section - Always visible */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-6 h-fit md:sticky md:top-24"
                >
                  <div className="relative overflow-hidden rounded-lg group">
                    <img
                      src={selectedCar.image || "/placeholder.svg"}
                      alt={`${selectedCar.brand} ${selectedCar.model}`}
                      className="w-full h-64 object-contain rounded-lg transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = "/assets/placeholder-car.png"
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                      <span className="text-purple-600 font-bold">{selectedCar.pricePerDay} DH/day</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Car className="h-6 w-6 mr-2 text-purple-500" />
                      {selectedCar.brand} {selectedCar.model}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mt-4 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-5 w-5 text-purple-500" />
                        <span>{selectedCar.gearType || "Automatic"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Fuel className="h-5 w-5 text-purple-500" />
                        <span>{selectedCar.fuelType || "Petrol"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        <span>{selectedCar.seats || 5} Seats</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        <span>{selectedCar.year || "2023"}</span>
                      </div>
                    </div>

                    {selectedCar.features && (
                      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 flex items-center">
                          <BadgeCheck className="h-5 w-5 mr-2 text-purple-500" />
                          Features
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {(() => {
                            const features = Array.isArray(selectedCar.features) 
                              ? selectedCar.features 
                              : typeof selectedCar.features === 'string' 
                                ? JSON.parse(selectedCar.features.replace(/\\/g, '')) 
                                : [];
                            return features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2 text-gray-700">
                                <Check className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{feature.replace(/\[|\]|"/g, '').trim()}</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900">Reservation Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rental Duration:</span>
                            <span className="font-medium">
                              {rentalDetails.pickupDate && rentalDetails.returnDate
                                ? Math.ceil(
                                    (new Date(rentalDetails.returnDate) - new Date(rentalDetails.pickupDate)) /
                                      (1000 * 60 * 60 * 24),
                                  )
                                : 1}{" "}
                              days
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Base Price:</span>
                            <span className="font-medium">{selectedCar.pricePerDay} DH/day</span>
                          </div>
                          {selectedAccessories.length > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Accessories:</span>
                              <span className="font-medium">
                                {selectedAccessories.reduce((total, id) => {
                                  const accessory = accessoriesCatalog.find((a) => a.id === id)
                                  return total + (accessory ? accessory.price : 0)
                                }, 0)}{" "}
                                DH/day
                              </span>
                            </div>
                          )}
                          {selectedInsurance && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Insurance:</span>
                              <span className="font-medium">
                                {insuranceOptions.find((i) => i.id === selectedInsurance)?.price} DH/day
                              </span>
                            </div>
                          )}
                          {selectedDriver === "driver" && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Driver:</span>
                              <span className="font-medium">350 DH/day</span>
                            </div>
                          )}
                          <div className="border-t border-purple-200 pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span className="text-purple-600">{calculateTotalCost()} DH</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Dynamic Form Section */}
                <div>
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.form
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleNextStep}
                        className="space-y-6"
                      >
                        {/* Rental Details Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900 border-b border-gray-100 pb-4">
                            <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                            Rental Details
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Pickup and Return Location Fields */}
                            <div>
                              <label className="mb-2 flex items-center text-gray-700 font-medium">
                                <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                                Pickup Location
                              </label>
                              <select
                                value={rentalDetails.pickupLocation}
                                onChange={(e) =>
                                  setRentalDetails({
                                    ...rentalDetails,
                                    pickupLocation: e.target.value,
                                  })
                                }
                                className={`w-full p-3 border ${errors.pickupLocation ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required
                              >
                                <option value="">Select Location</option>
                                {locations.map((loc) => (
                                  <option key={loc.id} value={loc.city}>
                                    {loc.city}
                                  </option>
                                ))}
                              </select>
                              {errors.pickupLocation && (
                                <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>
                              )}
                            </div>
                            <div>
                              <label className="mb-2 flex items-center text-gray-700 font-medium">
                                <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                                Return Location
                              </label>
                              <select
                                value={rentalDetails.returnLocation}
                                onChange={(e) =>
                                  setRentalDetails({
                                    ...rentalDetails,
                                    returnLocation: e.target.value,
                                  })
                                }
                                className={`w-full p-3 border ${errors.returnLocation ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required
                              >
                                <option value="">Select Location</option>
                                {locations.map((loc) => (
                                  <option key={loc.id} value={loc.city}>
                                    {loc.city}
                                  </option>
                                ))}
                              </select>
                              {errors.returnLocation && (
                                <p className="text-red-500 text-xs mt-1">{errors.returnLocation}</p>
                              )}
                            </div>
                          </div>

                          {/* Date and Time Fields */}
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block mb-2 text-gray-700 font-medium">Pickup Date</label>
                              <input
                                type="date"
                                value={rentalDetails.pickupDate}
                                onChange={(e) =>
                                  setRentalDetails({
                                    ...rentalDetails,
                                    pickupDate: e.target.value,
                                  })
                                }
                                min={new Date().toISOString().split("T")[0]}
                                className={`w-full p-3 border ${errors.pickupDate ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required
                              />
                              {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
                            </div>
                            <div>
                              <label className="block mb-2 text-gray-700 font-medium">Return Date</label>
                              <input
                                type="date"
                                value={rentalDetails.returnDate}
                                onChange={(e) =>
                                  setRentalDetails({
                                    ...rentalDetails,
                                    returnDate: e.target.value,
                                  })
                                }
                                min={rentalDetails.pickupDate || new Date().toISOString().split("T")[0]}
                                className={`w-full p-3 border ${errors.returnDate ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required
                              />
                              {errors.returnDate && <p className="text-red-500 text-xs mt-1">{errors.returnDate}</p>}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block mb-2 text-gray-700 font-medium">Pickup Time</label>
                              <input
                                type="time"
                                value={rentalDetails.pickupTime}
                                onChange={(e) =>
                                  setRentalDetails({
                                    ...rentalDetails,
                                    pickupTime: e.target.value,
                                  })
                                }
                                className={`w-full p-3 border ${errors.pickupTime ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required
                              />
                              {errors.pickupTime && <p className="text-red-500 text-xs mt-1">{errors.pickupTime}</p>}
                            </div>
                            <div>
                              <label className="block mb-2 text-gray-700 font-medium">Return Time</label>
                              <input
                                type="time"
                                value={rentalDetails.returnTime}
                                onChange={(e) =>
                                  setRentalDetails({
                                    ...rentalDetails,
                                    returnTime: e.target.value,
                                  })
                                }
                                className={`w-full p-3 border ${errors.returnTime ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required
                              />
                              {errors.returnTime && <p className="text-red-500 text-xs mt-1">{errors.returnTime}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Driver Option Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900 border-b border-gray-100 pb-4">
                            <User className="h-5 w-5 mr-2 text-purple-500" />
                            Driver Option
                          </h3>

                          <div className="space-y-4">
                            {driverOptions.map((option) => (
                              <div
                                key={option.id}
                                className={`flex justify-between items-center p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                                  selectedDriver === option.id
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-200 hover:border-purple-300"
                                }`}
                                onClick={() => setSelectedDriver(option.id)}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                      selectedDriver === option.id ? "border-purple-500" : "border-gray-400"
                                    }`}
                                  >
                                    {selectedDriver === option.id && (
                                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{option.name}</h4>
                                    <p className="text-sm text-gray-500">{option.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`font-medium ${option.price > 0 ? "text-purple-600" : "text-green-600"}`}
                                  >
                                    {option.price > 0 ? `${option.price} DH/day` : "Free"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Accessories Section */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900 border-b border-gray-100 pb-4">
                            <Zap className="h-5 w-5 mr-2 text-purple-500" />
                            Additional Services
                          </h3>

                          <div className="space-y-4">
                            {accessoriesCatalog.map((accessory) => (
                              <div
                                key={accessory.id}
                                className={`flex justify-between items-center p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                                  selectedAccessories.includes(accessory.id)
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-200 hover:border-purple-300"
                                }`}
                                onClick={() => {
                                  setSelectedAccessories((prev) =>
                                    prev.includes(accessory.id)
                                      ? prev.filter((id) => id !== accessory.id)
                                      : [...prev, accessory.id],
                                  )
                                }}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                                      selectedAccessories.includes(accessory.id)
                                        ? "border-purple-500 bg-purple-500"
                                        : "border-gray-400"
                                    }`}
                                  >
                                    {selectedAccessories.includes(accessory.id) && (
                                      <Check className="h-3 w-3 text-white" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 flex items-center">
                                      {accessory.icon}
                                      <span className="ml-2">{accessory.name}</span>
                                    </h4>
                                    <p className="text-sm text-gray-500">{accessory.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-medium text-purple-600">{accessory.price} DH/day</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6">
                            <h4 className="font-semibold mb-4 flex items-center text-gray-900">
                              <Shield className="h-5 w-5 mr-2 text-purple-500" /> Insurance
                            </h4>
                            {insuranceOptions.map((insurance) => (
                              <div
                                key={insurance.id}
                                className={`flex justify-between items-center p-4 border rounded-lg mt-3 transition-all duration-200 cursor-pointer ${
                                  selectedInsurance === insurance.id
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-200 hover:border-purple-300"
                                }`}
                                onClick={() => setSelectedInsurance(insurance.id)}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                      selectedInsurance === insurance.id ? "border-purple-500" : "border-gray-400"
                                    }`}
                                  >
                                    {selectedInsurance === insurance.id && (
                                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900 flex items-center">
                                      {insurance.icon}
                                      <span className="ml-2">{insurance.name}</span>
                                    </h4>
                                    <p className="text-sm text-gray-500">{insurance.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-medium text-purple-600">{insurance.price} DH/day</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total Cost and Navigation */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center text-gray-900">
                              <CreditCardIcon className="h-5 w-5 mr-2 text-purple-500" /> Total Cost
                            </h3>
                            <span className="text-2xl font-bold text-purple-600">{calculateTotalCost()} DH</span>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 shadow-md flex items-center justify-center"
                          >
                            Continue to Personal Information
                            <ChevronRightIcon className="h-5 w-5 ml-2" />
                          </button>

                          <p className="text-xs text-gray-500 text-center mt-4">
                            By continuing, you agree to our terms and conditions.
                          </p>
                        </div>
                      </motion.form>
                    )}

                    {currentStep === 2 && (
                      <motion.form
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleNextStep}
                        className="space-y-6"
                      >
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900 border-b border-gray-100 pb-4">
                            <User className="h-5 w-5 mr-2 text-purple-500" /> Personal Information
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block mb-2 text-gray-700 font-medium">Full Name</label>
                              <input
                                type="text"
                                value={customerInfo.fullName}
                                onChange={(e) =>
                                  setCustomerInfo({
                                    ...customerInfo,
                                    fullName: e.target.value,
                                  })
                                }
                                placeholder="Enter your full name"
                                className={`w-full p-3 border ${errors.fullName ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required
                              />
                              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                            </div>
                            <div>
                              <label className="block mb-2 text-gray-700 font-medium">Email</label>
                              <input
                                type="email"
                                value={customerInfo.email}
                                onChange={(e) =>
                                  setCustomerInfo({
                                    ...customerInfo,
                                    email: e.target.value,
                                  })
                                }
                                placeholder="Enter your email"
                                className={`w-full p-3 border ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required
                              />
                              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="mb-2 flex items-center text-gray-700 font-medium">
                                <PhoneIcon className="h-4 w-4 mr-2 text-purple-500" /> Phone
                              </label>
                              <input
                                type="tel"
                                value={customerInfo.phone}
                                onChange={(e) =>
                                  setCustomerInfo({
                                    ...customerInfo,
                                    phone: e.target.value,
                                  })
                                }
                                placeholder="Enter your phone number"
                                className={`w-full p-3 border ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required
                              />
                              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                              <label className="block mb-2 text-gray-700 font-medium">Age</label>
                              <input
                                type="number"
                                value={customerInfo.age}
                                onChange={(e) =>
                                  setCustomerInfo({
                                    ...customerInfo,
                                    age: e.target.value,
                                  })
                                }
                                placeholder="Enter your age"
                                className={`w-full p-3 border ${errors.age ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                min="18"
                                required
                              />
                              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                            </div>
                          </div>

                          {selectedDriver === "self" && (
                            <div className="mt-4">
                              <label className="block mb-2 text-gray-700 font-medium">Driver's License Number</label>
                              <input
                                type="text"
                                value={customerInfo.driverLicense}
                                onChange={(e) =>
                                  setCustomerInfo({
                                    ...customerInfo,
                                    driverLicense: e.target.value,
                                  })
                                }
                                placeholder="Enter your driver's license number"
                                className={`w-full p-3 border ${errors.driverLicense ? "border-red-300 bg-red-50" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                                required={selectedDriver === "self"}
                              />
                              {errors.driverLicense && (
                                <p className="text-red-500 text-xs mt-1">{errors.driverLicense}</p>
                              )}
                            </div>
                          )}

                          <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="terms"
                                  type="checkbox"
                                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-300"
                                  required
                                />
                              </div>
                              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                I agree to the{" "}
                                <a href="#" className="text-purple-600 hover:underline">
                                  Terms and Conditions
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-purple-600 hover:underline">
                                  Privacy Policy
                                </a>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Total Cost and Navigation */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center text-gray-900">
                              <CreditCardIcon className="h-5 w-5 mr-2 text-purple-500" /> Total Cost
                            </h3>
                            <span className="text-2xl font-bold text-purple-600">{calculateTotalCost()} DH</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <button
                              type="button"
                              onClick={() => setCurrentStep(1)}
                              className="sm:w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center"
                            >
                              <ChevronLeftIcon className="h-5 w-5 mr-2" />
                              Back
                            </button>
                            <button
                              type="submit"
                              className="sm:w-2/3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 shadow-md flex items-center justify-center"
                            >
                              {isLoading ? (
                                <>
                                  <span className="animate-spin mr-2">
                                    <Loader2Icon className="h-5 w-5" />
                                  </span>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Complete Reservation
                                  <CheckCircleIcon className="h-5 w-5 ml-2" />
                                </>
                              )}
                            </button>
                          </div>

                          {reservationId && (
                            <div className="mt-4">
                              <button
                                type="button"
                                onClick={() => handleDownloadPdf(reservationId)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center"
                              >
                                <DownloadIcon className="h-5 w-5 mr-2" />
                                Download Reservation PDF
                              </button>
                            </div>
                          )}

                          <p className="text-xs text-gray-500 text-center mt-4">
                            By confirming your reservation, you agree to our terms and conditions.
                          </p>
                        </div>
                      </motion.form>
                    )}

                    {currentStep === 3 && (
                      <motion.form
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleNextStep}
                        className="space-y-6"
                      >
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <h3 className="text-xl font-bold mb-6 flex items-center text-gray-900 border-b border-gray-100 pb-4">
                            <CheckCircleIcon className="h-5 w-5 mr-2 text-purple-500" /> Confirm Your Reservation
                          </h3>

                          <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Rental Details</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Pickup Location:</p>
                                  <p className="font-medium">
                                    {locations.find((loc) => loc.code === rentalDetails.pickupLocation)?.city ||
                                      rentalDetails.pickupLocation}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Return Location:</p>
                                  <p className="font-medium">
                                    {locations.find((loc) => loc.code === rentalDetails.returnLocation)?.city ||
                                      rentalDetails.returnLocation}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Pickup Date & Time:</p>
                                  <p className="font-medium">
                                    {new Date(rentalDetails.pickupDate).toLocaleDateString()} at{" "}
                                    {rentalDetails.pickupTime}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Return Date & Time:</p>
                                  <p className="font-medium">
                                    {new Date(rentalDetails.returnDate).toLocaleDateString()} at{" "}
                                    {rentalDetails.returnTime}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Full Name:</p>
                                  <p className="font-medium">{customerInfo.fullName}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Email:</p>
                                  <p className="font-medium">{customerInfo.email}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Phone:</p>
                                  <p className="font-medium">{customerInfo.phone}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Age:</p>
                                  <p className="font-medium">{customerInfo.age}</p>
                                </div>
                                {selectedDriver === "self" && (
                                  <div>
                                    <p className="text-gray-500">Driver's License:</p>
                                    <p className="font-medium">{customerInfo.driverLicense}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Selected Options</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <p className="text-gray-500">Driver Option:</p>
                                  <p className="font-medium">
                                    {selectedDriver === "self" ? "Self-Drive" : "With Professional Driver"}
                                  </p>
                                </div>

                                {selectedInsurance && (
                                  <div>
                                    <p className="text-gray-500">Insurance:</p>
                                    <p className="font-medium">
                                      {insuranceOptions.find((i) => i.id === selectedInsurance)?.name}
                                    </p>
                                  </div>
                                )}

                                {selectedAccessories.length > 0 && (
                                  <div>
                                    <p className="text-gray-500">Accessories:</p>
                                    <ul className="list-disc list-inside pl-2">
                                      {selectedAccessories.map((id) => (
                                        <li key={id} className="font-medium">
                                          {accessoriesCatalog.find((a) => a.id === id)?.name}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                              <div className="flex justify-between items-center">
                                <h4 className="font-semibold text-gray-900">Payment Method</h4>
                                <div className="flex space-x-2">
                                  <CreditCardIcon className="h-5 w-5 text-gray-500" />
                                  <DollarSignIcon className="h-5 w-5 text-gray-500" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Payment will be collected at the rental location. We accept credit cards and cash.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Total Cost and Navigation */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center text-gray-900">
                              <CreditCardIcon className="h-5 w-5 mr-2 text-purple-500" /> Total Cost
                            </h3>
                            <span className="text-2xl font-bold text-purple-600">{calculateTotalCost()} DH</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <button
                              type="button"
                              onClick={() => setCurrentStep(2)}
                              className="sm:w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center"
                            >
                              <ChevronLeftIcon className="h-5 w-5 mr-2" />
                              Back
                            </button>
                            <button
                              type="submit"
                              className="sm:w-2/3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 shadow-md flex items-center justify-center"
                            >
                              {isLoading ? (
                                <>
                                  <span className="animate-spin mr-2">
                                    <Loader2Icon className="h-5 w-5" />
                                  </span>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Complete Reservation
                                  <CheckCircleIcon className="h-5 w-5 ml-2" />
                                </>
                              )}
                            </button>
                          </div>

                          <p className="text-xs text-gray-500 text-center mt-4">
                            By confirming your reservation, you agree to our terms and conditions.
                          </p>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          ) : (
            renderConfirmation()
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Missing components
const Wifi = ({ className }) => {
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
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  )
}

const Phone = ({ className }) => {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

const CreditCard = ({ className }) => {
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
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

const CheckCircle = ({ className }) => {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

const ChevronLeftIcon = ({ className }) => {
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
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

const ChevronRightIcon = ({ className }) => {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

const Loader2Icon = ({ className }) => {
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

const DollarSignIcon = ({ className }) => {
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
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

const ZapIcon = ({ className }) => {
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
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
