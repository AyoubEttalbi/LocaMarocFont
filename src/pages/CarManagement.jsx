
import { useState, useEffect } from "react"
import DashboardLayout from "./DashboardLayout"
import { carService } from "../services/api"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Car,
  Calendar,
  Tag,
  Palette,
  Shield,
  Wrench,
  AlertCircle,
  Upload,
  Info,
  RotateCw,
  Users,
} from "lucide-react"

const CarManagement = () => {
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Form state
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    category: "economy",
    seats: "",
    gearType: "Automatic",
    mileage: "",
    pricePerDay: "",
    availability: true,
    fuelType: "Gasoline",
    color: "",
    year: new Date().getFullYear(),
    image: null,
    imageFile: null,
    insuranceExpiryDate: "",
    serviceDueDate: "",
    features: [],
  })

  // Form errors
  const [formErrors, setFormErrors] = useState({})

  // Available features for selection
  const availableFeatures = [
    "Bluetooth",
    "Backup Camera",
    "Navigation",
    "Sunroof",
    "Heated Seats",
    "Leather Seats",
    "USB Port",
    "Apple CarPlay",
    "Android Auto",
    "Cruise Control",
    "Keyless Entry",
    "Third Row Seating",
    "Roof Rack",
    "Wireless Charging",
    "Premium Sound System",
  ]

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true)
      try {
        const response = await carService.getAllCars()
        // Sort cars by ID in descending order (newest first)
        const sortedCars = [...response.data].sort((a, b) => b.id - a.id)
        setCars(sortedCars)
      } catch (error) {
        console.error("Error fetching cars:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCars()
  }, [])



  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter cars based on search query and type
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || car.category === filterType

    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "available" && car.availability) ||
      (activeTab === "unavailable" && !car.availability)

    return matchesSearch && matchesType && matchesStatus
  })

  // Pagination
  const carsPerPage = 5
  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar)
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Handle feature toggle
  const handleFeatureToggle = (feature) => {
    if (formData.features.includes(feature)) {
      setFormData({
        ...formData,
        features: formData.features.filter((f) => f !== feature),
      })
    } else {
      setFormData({
        ...formData,
        features: [...formData.features, feature],
      })
    }
  }

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: URL.createObjectURL(file),
        imageFile: file, // Store the actual file for upload
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const errors = {}

    if (!formData.brand) errors.brand = "Brand is required"
    if (!formData.model) errors.model = "Model is required"
    if (!formData.pricePerDay) errors.pricePerDay = "Price per day is required"
    if (!formData.seats) errors.seats = "Number of seats is required"
    if (!formData.mileage) errors.mileage = "Mileage is required"
    if (!formData.color) errors.color = "Color is required"
    if (!formData.year) errors.year = "Year is required"
    if (!formData.insuranceExpiryDate) errors.insuranceExpiryDate = "Insurance expiry date is required"
    if (!formData.serviceDueDate) errors.serviceDueDate = "Service due date is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Upload image to server which handles Cloudinary upload
  const uploadToCloudinary = async (imageFile) => {
    try {
      // Import the imageService
      const { imageService } = await import('../services/imageService');
      
      // Upload the image through our backend service
      const response = await imageService.uploadImage(imageFile);
      
      // Return the secure URL from Cloudinary
      return response.imageUrl; // Assuming backend returns {imageUrl: "https://res.cloudinary.com/..."}
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    if (!validateForm()) return

    try {
      // Prepare formDataToSend with correct types for backend validation
      const formDataToSend = {
        ...formData,
        seats: Number(formData.seats),
        mileage: Number(formData.mileage),
        pricePerDay: Number(formData.pricePerDay),
        year: Number(formData.year),
      };
      
      // Handle image upload if there's a new image file
      if (formData.imageFile && formData.imageFile instanceof File) {
        try {
          // Upload image and get the Cloudinary URL
          const imageUrl = await uploadToCloudinary(formData.imageFile);
          formDataToSend.image = imageUrl;
        } catch (error) {
          console.error("Image upload failed:", error);
          // Continue with form submission even if image upload fails
        }
      }
      
      // Remove image property if it's null or a blob URL
      if (formDataToSend.image === null || formDataToSend.image.startsWith('blob:')) {
        delete formDataToSend.image;
      }
      
      // Remove the imageFile property as it's not needed for API submission
      delete formDataToSend.imageFile;

      function formatDateToYMD(date) {
        if (!date) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
        return new Date(date).toISOString().slice(0, 10);
      }
      formDataToSend.insuranceExpiryDate = formatDateToYMD(formDataToSend.insuranceExpiryDate);
      formDataToSend.serviceDueDate = formatDateToYMD(formDataToSend.serviceDueDate);

      // Ensure features is a clean array of strings
      formDataToSend.features = Array.isArray(formDataToSend.features)
        ? formDataToSend.features
        : typeof formDataToSend.features === 'string'
        ? formDataToSend.features
            .replace(/\\/g, '') // Remove backslashes
            .replace(/\"/g, '"') // Replace escaped quotes
            .split(',') // Split by comma
            .map(feature => feature.trim()) // Trim whitespace
            .filter(feature => feature) // Remove empty strings
        : [];

      let response 
      if (selectedCar) {
        response = await carService.updateCar(selectedCar.id, formDataToSend)
        setCars(cars.map((car) => (car.id === selectedCar.id ? response.data : car)))
      } else {
        response = await carService.createCar(formDataToSend)
        setCars([...cars, response.data])
      }

      setFormData({
        brand: "",
        model: "",
        category: "economy",
        seats: "",
        gearType: "Automatic",
        mileage: "",
        pricePerDay: "",
        availability: true,
        fuelType: "Gasoline",
        color: "",
        year: new Date().getFullYear(),
        image: null,
        imageFile: null,
        insuranceExpiryDate: "",
        serviceDueDate: "",
        features: [],
      })
      setFormErrors({})
      setShowAddModal(false)
      setSelectedCar(null)
    } catch (error) {
      console.error("Failed to save car:", error)
    }
  }

  // Handle edit car
  const handleEditCar = (car) => {
    setSelectedCar(car)
    setFormData({
      brand: car.brand,
      model: car.model,
      category: car.category,
      seats: car.seats,
      gearType: car.gearType,
      mileage: car.mileage,
      pricePerDay: car.pricePerDay,
      availability: car.availability,
      fuelType: car.fuelType,
      color: car.color,
      year: car.year,
      image: car.image,
      imageFile: null, // Reset imageFile when editing
      insuranceExpiryDate: car.insuranceExpiryDate ? new Date(car.insuranceExpiryDate).toISOString().slice(0, 10) : '',
      serviceDueDate: car.serviceDueDate ? new Date(car.serviceDueDate).toISOString().slice(0, 10) : '',
      features: Array.isArray(car.features)
        ? car.features
        : typeof car.features === 'string'
        ? JSON.parse(car.features) // No need to replace backslashes
        : [],
    })
    setShowAddModal(true)
  }

  // Handle delete car
  const handleDeleteCar = (car) => {
    setSelectedCar(car)
    setShowDeleteModal(true)
  }

  // Confirm delete car
  const confirmDeleteCar = async () => {
    try {
      await carService.deleteCar(selectedCar.id)
      setCars(cars.filter((car) => car.id !== selectedCar.id))
      setShowDeleteModal(false)
      setSelectedCar(null)
    } catch (error) {
      console.error("Failed to delete car:", error)
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-800"
      case "rented":
        return "bg-sky-100 text-sky-800"
      case "maintenance":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Check if service is due soon (within 30 days)
  const isServiceDueSoon = (dateString) => {
    if (!dateString) return false
    const serviceDate = new Date(dateString)
    const today = new Date()
    const diffTime = serviceDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  // Check if insurance is expiring soon (within 30 days)
  const isInsuranceExpiringSoon = (dateString) => {
    if (!dateString) return false
    const expiryDate = new Date(dateString)
    const today = new Date()
    const diffTime = expiryDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Car Management</h1>
          <p className="text-slate-500">Manage your fleet of rental cars</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Car
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              } transition-colors`}
            >
              All Cars
            </button>
            <button
              onClick={() => setActiveTab("available")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "available"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              } transition-colors`}
            >
              Available
            </button>
            <button
              onClick={() => setActiveTab("unavailable")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "unavailable"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              } transition-colors`}
            >
              Unavailable
            </button>
          </nav>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 flex items-center">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search cars..."
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-slate-400 mr-2" />
              <select
                className="border border-slate-300 rounded-md py-2 pl-2 pr-8 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="economy">Economy</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : currentCars.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Car className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No cars found</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "Add your first car to get started"}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Car
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Car
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Price/Day
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Maintenance
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {currentCars.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover border border-slate-200"
                              src={car.image || "/placeholder.svg"}
                              alt={`${car.brand} ${car.model}`}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-800">
                              {car.brand} {car.model}
                            </div>
                            <div className="text-sm text-slate-500">
                              {car.year} • {car.color}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-800">
                          {car.category.charAt(0).toUpperCase() + car.category.slice(1)}
                        </div>
                        <div className="text-sm text-slate-500">
                          {car.seats} seats • {car.gearType} • {car.fuelType}
                        </div>
                        <div className="text-sm text-slate-500">{car.mileage.toLocaleString()} km</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">{car.pricePerDay} DH</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                            car.status,
                          )}`}
                        >
                          {car.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <div
                            className={`flex items-center text-xs ${
                              isInsuranceExpiringSoon(car.insuranceExpiryDate) ? "text-amber-600" : "text-slate-500"
                            }`}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            <span>Insurance: {formatDate(car.insuranceExpiryDate)}</span>
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              isServiceDueSoon(car.serviceDueDate) ? "text-amber-600" : "text-slate-500"
                            }`}
                          >
                            <Wrench className="h-3 w-3 mr-1" />
                            <span>Service: {formatDate(car.serviceDueDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEditCar(car)}
                            className="text-teal-600 hover:text-teal-900 transition-colors"
                            aria-label="Edit car"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car)}
                            className="text-rose-600 hover:text-rose-900 transition-colors"
                            aria-label="Delete car"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-700">
                      Showing <span className="font-medium">{indexOfFirstCar + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastCar, filteredCars.length)}</span> of{" "}
                      <span className="font-medium">{filteredCars.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === i + 1
                              ? "bg-teal-50 border-teal-500 text-teal-600 z-10"
                              : "border-slate-300 bg-white text-slate-500 hover:bg-slate-50"
                          } text-sm font-medium transition-colors`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Car Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-500 opacity-75" onClick={() => {
            setShowAddModal(false);
            setSelectedCar(null);
            setFormData({
              brand: "",
              model: "",
              category: "economy",
              seats: "",
              gearType: "Automatic",
              mileage: "",
              pricePerDay: "",
              availability: true,
              fuelType: "Gasoline",
              color: "",
              year: new Date().getFullYear(),
              image: null,
              insuranceExpiryDate: "",
              serviceDueDate: "",
              features: [],
            });
            setFormErrors({});
          }}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl z-50 relative">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-slate-900">
                    {selectedCar ? "Edit Car" : "Add New Car"}
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Left Column */}
                          <div className="space-y-6">
                            <div>
                              <label htmlFor="brand" className="block text-sm font-medium text-slate-700">
                                Brand <span className="text-rose-500">*</span>
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Tag className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                  type="text"
                                  name="brand"
                                  id="brand"
                                  required
                                  value={formData.brand}
                                  onChange={handleInputChange}
                                  className={`pl-10 block w-full sm:text-sm rounded-md ${
                                    formErrors.brand
                                      ? "border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                      : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                                  }`}
                                  placeholder="Toyota"
                                />
                                {formErrors.brand && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                  </div>
                                )}
                              </div>
                              {formErrors.brand && (
                                <p className="mt-2 text-sm text-rose-600" id="brand-error">
                                  {formErrors.brand}
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="model" className="block text-sm font-medium text-slate-700">
                                Model <span className="text-rose-500">*</span>
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Car className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                  type="text"
                                  name="model"
                                  id="model"
                                  required
                                  value={formData.model}
                                  onChange={handleInputChange}
                                  className={`pl-10 block w-full sm:text-sm rounded-md ${
                                    formErrors.model
                                      ? "border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                      : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                                  }`}
                                  placeholder="Corolla"
                                />
                                {formErrors.model && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                  </div>
                                )}
                              </div>
                              {formErrors.model && (
                                <p className="mt-2 text-sm text-rose-600" id="model-error">
                                  {formErrors.model}
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                                Category
                              </label>
                              <div className="mt-1">
                                <select
                                  id="category"
                                  name="category"
                                  value={formData.category}
                                  onChange={handleInputChange}
                                  className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                                >
                                  <option value="economy">Economy</option>
                                  <option value="suv">SUV</option>
                                  <option value="luxury">Luxury</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="color" className="block text-sm font-medium text-slate-700">
                                Color <span className="text-rose-500">*</span>
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Palette className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                  type="text"
                                  name="color"
                                  id="color"
                                  required
                                  value={formData.color}
                                  onChange={handleInputChange}
                                  className={`pl-10 block w-full sm:text-sm rounded-md ${
                                    formErrors.color
                                      ? "border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                      : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                                  }`}
                                  placeholder="White"
                                />
                                {formErrors.color && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                  </div>
                                )}
                              </div>
                              {formErrors.color && (
                                <p className="mt-2 text-sm text-rose-600" id="color-error">
                                  {formErrors.color}
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="year" className="block text-sm font-medium text-slate-700">
                                Year <span className="text-rose-500">*</span>
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Calendar className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                  type="number"
                                  name="year"
                                  id="year"
                                  required
                                  min="2000"
                                  max={new Date().getFullYear() + 1}
                                  value={formData.year}
                                  onChange={handleInputChange}
                                  className={`pl-10 block w-full sm:text-sm rounded-md ${
                                    formErrors.year
                                      ? "border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                      : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                                  }`}
                                  placeholder="2023"
                                />
                                {formErrors.year && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                  </div>
                                )}
                              </div>
                              {formErrors.year && (
                                <p className="mt-2 text-sm text-rose-600" id="year-error">
                                  {formErrors.year}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Middle Column */}
                          <div className="space-y-6">
                            <div>
                              <label htmlFor="seats" className="block text-sm font-medium text-slate-700">
                                Seats <span className="text-rose-500">*</span>
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Users className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                  type="number"
                                  name="seats"
                                  id="seats"
                                  required
                                  min="1"
                                  max="12"
                                  value={formData.seats}
                                  onChange={handleInputChange}
                                  className={`pl-10 block w-full sm:text-sm rounded-md ${
                                    formErrors.seats
                                      ? "border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                      : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                                  }`}
                                  placeholder="5"
                                />
                                {formErrors.seats && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                  </div>
                                )}
                              </div>
                              {formErrors.seats && (
                                <p className="mt-2 text-sm text-rose-600" id="seats-error">
                                  {formErrors.seats}
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="gearType" className="block text-sm font-medium text-slate-700">
                                Transmission
                              </label>
                              <div className="mt-1">
                                <select
                                  id="gearType"
                                  name="gearType"
                                  value={formData.gearType}
                                  onChange={handleInputChange}
                                  className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                                >
                                  <option value="Automatic">Automatic</option>
                                  <option value="Manual">Manual</option>
                                  <option value="Semi-Automatic">Semi-Automatic</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="fuelType" className="block text-sm font-medium text-slate-700">
                                Fuel Type
                              </label>
                              <div className="mt-1">
                                <select
                                  id="fuelType"
                                  name="fuelType"
                                  value={formData.fuelType}
                                  onChange={handleInputChange}
                                  className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                                >
                                  <option value="Gasoline">Gasoline</option>
                                  <option value="Diesel">Diesel</option>
                                  <option value="Hybrid">Hybrid</option>
                                  <option value="Electric">Electric</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="mileage" className="block text-sm font-medium text-slate-700">
                                Mileage (km) <span className="text-rose-500">*</span>
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <RotateCw className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                  type="number"
                                  name="mileage"
                                  id="mileage"
                                  required
                                  min="0"
                                  value={formData.mileage}
                                  onChange={handleInputChange}
                                  className={`pl-10 block w-full sm:text-sm rounded-md ${
                                    formErrors.mileage
                                      ? "border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                      : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                                  }`}
                                  placeholder="15000"
                                />
                                {formErrors.mileage && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                  </div>
                                )}
                              </div>
                              {formErrors.mileage && (
                                <p className="mt-2 text-sm text-rose-600" id="mileage-error">
                                  {formErrors.mileage}
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="pricePerDay" className="block text-sm font-medium text-slate-700">
                                Price Per Day (DH) <span className="text-rose-500">*</span>
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-slate-500 sm:text-sm">DH</span>
                                </div>
                                <input
                                  type="number"
                                  name="pricePerDay"
                                  id="pricePerDay"
                                  required
                                  min="0"
                                  value={formData.pricePerDay}
                                  onChange={handleInputChange}
                                  className={`pl-12 block w-full sm:text-sm rounded-md ${
                                    formErrors.pricePerDay
                                      ? "border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                      : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                                  }`}
                                  placeholder="350"
                                />
                                {formErrors.pricePerDay && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                  </div>
                                )}
                              </div>
                              {formErrors.pricePerDay && (
                                <p className="mt-2 text-sm text-rose-600" id="pricePerDay-error">
                                  {formErrors.pricePerDay}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-6">
                            <div>
                              <label htmlFor="insuranceExpiryDate" className="block text-sm font-medium text-slate-700">
                                Insurance Expiry Date <span className="text-rose-500">*</span>
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Shield className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                  type="date"
                                  name="insuranceExpiryDate"
                                  id="insuranceExpiryDate"
                                  required
                                  value={formData.insuranceExpiryDate}
                                  onChange={handleInputChange}
                                  className={`pl-10 block w-full sm:text-sm rounded-md ${
                                    formErrors.insuranceExpiryDate
                                      ? "border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                      : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                                  }`}
                                />
                                {formErrors.insuranceExpiryDate && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                  </div>
                                )}
                              </div>
                              {formErrors.insuranceExpiryDate && (
                                <p className="mt-2 text-sm text-rose-600" id="insuranceExpiryDate-error">
                                  {formErrors.insuranceExpiryDate}
                                </p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="serviceDueDate" className="block text-sm font-medium text-slate-700">
                                Service Due Date <span className="text-rose-500">*</span>
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Wrench className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                  type="date"
                                  name="serviceDueDate"
                                  id="serviceDueDate"
                                  required
                                  value={formData.serviceDueDate}
                                  onChange={handleInputChange}
                                  className={`pl-10 block w-full sm:text-sm rounded-md ${
                                    formErrors.serviceDueDate
                                      ? "border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                      : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"
                                  }`}
                                />
                                {formErrors.serviceDueDate && (
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                  </div>
                                )}
                              </div>
                              {formErrors.serviceDueDate && (
                                <p className="mt-2 text-sm text-rose-600" id="serviceDueDate-error">
                                  {formErrors.serviceDueDate}
                                </p>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center justify-between">
                                <label htmlFor="availability" className="block text-sm font-medium text-slate-700">
                                  Availability
                                </label>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="availability"
                                    id="availability"
                                    checked={formData.availability}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                                  />
                                  <label htmlFor="availability" className="ml-2 block text-sm text-slate-700">
                                    Available for rent
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="image" className="block text-sm font-medium text-slate-700">
                                Car Image
                              </label>
                              <div className="mt-1 flex items-center">
                                {formData.image ? (
                                  <div className="relative">
                                    <img
                                      src={formData.image || "/placeholder.svg"}
                                      alt="Car preview"
                                      className="h-32 w-32 object-cover rounded-md border border-slate-200"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setFormData({ ...formData, image: null })}
                                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-rose-500 text-white rounded-full p-1 shadow-sm"
                                      aria-label="Remove image"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center h-32 w-32 border-2 border-slate-300 border-dashed rounded-md">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none"
                                    >
                                      <span className="flex items-center justify-center">
                                        <Upload className="h-6 w-6 mr-2" />
                                        Upload
                                      </span>
                                      <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                      />
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Features Section */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Features</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {availableFeatures.map((feature) => (
                              <div key={feature} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`feature-${feature}`}
                                  checked={formData.features.includes(feature)}
                                  onChange={() => handleFeatureToggle(feature)}
                                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                                />
                                <label htmlFor={`feature-${feature}`} className="ml-2 block text-sm text-slate-700">
                                  {feature}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Form Info */}
                        <div className="rounded-md bg-sky-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Info className="h-5 w-5 text-sky-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3 flex-1 md:flex md:justify-between">
                              <p className="text-sm text-sky-700">
                                Fields marked with <span className="text-rose-500">*</span> are required.
                              </p>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  {selectedCar ? "Update Car" : "Add Car"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedCar(null)
                    setFormData({
                      brand: "",
                      model: "",
                      category: "economy",
                      seats: "",
                      gearType: "Automatic",
                      mileage: "",
                      pricePerDay: "",
                      availability: true,
                      fuelType: "Gasoline",
                      color: "",
                      year: new Date().getFullYear(),
                      image: null,
                      insuranceExpiryDate: "",
                      serviceDueDate: "",
                      features: [],
                    })
                    setFormErrors({})
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
         
        </div>
      )}

{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500 opacity-75 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 sm:p-8 transition-transform duration-300 scale-100">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full">
          <Trash2 className="w-6 h-6 text-rose-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Delete Car</h3>
          <p className="text-sm text-slate-500 mt-1">
            Are you sure you want to delete <strong>{selectedCar?.brand} {selectedCar?.model}</strong>? This action cannot be undone.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedCar(null);
          }}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        >
          Cancel
        </button>
        <button
          onClick={confirmDeleteCar}
          className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </DashboardLayout>
  )
}

export default CarManagement
