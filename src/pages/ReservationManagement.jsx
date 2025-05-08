import { reservationService, userService } from "../services/api"
import { useState, useEffect } from "react"
import DashboardLayout from "./DashboardLayout"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Car,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  ArrowUpDown,
  UserCheck,
  Shield,
  Star,
  Phone,
  Mail,
  X,
  CheckSquare,
  Loader2,
} from "lucide-react"

const ReservationManagement = () => {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [isAssigningDriver, setIsAssigningDriver] = useState(false)
  const [driverSearchQuery, setDriverSearchQuery] = useState("")

  // Fetch reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true)
        const response = await reservationService.getStaffReservations()
        setBookings(response.data)
        
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [])

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setIsLoading(true)
        const response = await userService.getDrivers()
        setDrivers(response.data)
      } catch (error) {
        console.error("Error fetching drivers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrivers()
  }, [])
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sort bookings
  const sortedBookings = [...bookings].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle nested fields
    if (sortField === "user.name") {
      aValue = a.user?.name
      bValue = b.user?.name
    } else if (sortField === "car.brand") {
      aValue = a.car?.brand
      bValue = b.car?.brand
    }

    // Handle dates
    if (sortField === "pickup_date" || sortField === "dropoff_date" || sortField === "created_at") {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  // Filter bookings based on search query and status filter
  const filteredBookings = sortedBookings.filter((booking) => {
    const matchesSearch =
      (booking.user?.name?.toLowerCase?.()?.includes(searchQuery.toLowerCase()) ?? false) ||
      (booking.pickup_location?.toLowerCase?.()?.includes(searchQuery.toLowerCase()) ?? false) ||
      (booking.dropoff_location?.toLowerCase?.()?.includes(searchQuery.toLowerCase()) ?? false) ||
      (booking.car?.brand?.toLowerCase?.()?.includes(searchQuery.toLowerCase()) ?? false) ||
      (booking.car?.model?.toLowerCase?.()?.includes(searchQuery.toLowerCase()) ?? false)

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Filter drivers based on search query
  const filteredDrivers = drivers?.filter((driver) => {
    if (!driverSearchQuery) return true

    return (
      driver.name?.toLowerCase().includes(driverSearchQuery.toLowerCase()) ||
      driver.email?.toLowerCase().includes(driverSearchQuery.toLowerCase()) ||
      driver.phone?.toLowerCase().includes(driverSearchQuery.toLowerCase())
    )
  })

  // Pagination
  const bookingsPerPage = 5
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Calculate rental duration in days
  const calculateDuration = (pickupDate, dropoffDate) => {
    const pickup = new Date(pickupDate)
    const dropoff = new Date(dropoffDate)
    const diffTime = Math.abs(dropoff - pickup)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800"
      case "pending":
        return "bg-amber-100 text-amber-800"
      case "completed":
        return "bg-sky-100 text-sky-800"
      case "cancelled":
        return "bg-rose-100 text-rose-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  // Handle view booking details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  // Handle update booking status
  const handleUpdateStatus = (booking) => {
    setSelectedBooking(booking)
    setShowStatusModal(true)
  }

  // Handle assign driver
  const handleAssignDriver = (booking) => {
    setSelectedBooking(booking)
    setSelectedDriver(booking.assigned_driver || null)
    setShowDriverModal(true)
  }

  // Update booking status
  const updateBookingStatus = async (status) => {
    try {
      setIsLoading(true)
      // Get current user ID from localStorage or similar
      const currentUserId = localStorage.getItem('userId') || 1; // Replace with actual user ID retrieval
      await reservationService.updateReservation(selectedBooking.id, {
        status,
        statusUpdatedBy: currentUserId,
      })

      // Update local state
      setBookings(bookings.map((booking) => (booking.id === selectedBooking.id ? { ...booking, status } : booking)))
      setShowStatusModal(false)
    } catch (error) {
      console.error("Error updating booking status:", error)
      // Add error handling UI here
    } finally {
      setIsLoading(false)
    }
  }

  // Assign driver to booking
  const assignDriverToBooking = async () => {
    if (!selectedDriver) {
      console.error('Please select a driver first')
      return
    }

    try {
      setIsAssigningDriver(true)
      
      // First, check if the reservation allows driver assignment
      if (!selectedBooking.selectDriver) {
        console.error('This reservation does not allow driver assignment')
        return
      }

      await reservationService.assignDriverToReservation(selectedBooking.id, selectedDriver.id)

      // Update local state
      setBookings(
        bookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, assigned_driver: selectedDriver, driver_assigned: true }
            : booking,
        ),
      )
      
      console.log('Driver assigned successfully')
      setShowDriverModal(false)

    } catch (error) {
      console.error("Error assigning driver:", error)
      console.error("Backend response:", error.response?.data)
    } finally {
      setIsAssigningDriver(false)
    }
  }

  // Cancel booking
  const cancelBooking = async () => {
    try {
      await updateBookingStatus("cancelled")
    } catch (error) {
      console.error("Error cancelling booking:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reservation Management</h1>
            <p className="text-gray-500">Manage and track all customer bookings</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 flex items-center">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search reservations..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 rounded-md py-2 pl-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : currentBookings.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No reservations found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "There are no bookings in the system yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("user.name")}
                      >
                        <div className="flex items-center">
                          Customer
                          {sortField === "user.name" && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("car.brand")}
                      >
                        <div className="flex items-center">
                          Car
                          {sortField === "car.brand" && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("pickup_date")}
                      >
                        <div className="flex items-center">
                          Pickup / Dropoff
                          {sortField === "pickup_date" && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("total_price")}
                      >
                        <div className="flex items-center">
                          Price
                          {sortField === "total_price" && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          Status
                          {sortField === "status" && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Driver
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{booking.user?.name}</div>
                              <div className="text-sm text-gray-500">{booking.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-md object-cover border border-gray-200"
                                src={booking.car?.image || "/placeholder.svg"}
                                alt={`${booking.car?.brand} ${booking.car?.model}`}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.car?.brand} {booking.car?.model}
                              </div>
                              <div className="text-sm text-gray-500">{booking.car_type}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-1">
                              <Calendar className="h-4 w-4 text-purple-600 mr-1" />
                              {formatDate(booking.pickup_date)}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-rose-600 mr-1" />
                              {formatDate(booking.dropoff_date)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {calculateDuration(booking.pickup_date, booking.dropoff_date)} days
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.total_price} DH</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                              booking.status,
                            )}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.selectDriver === 1 ? (
                            booking.driver_assigned || booking.assigned_driver ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Assigned
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAssignDriver(booking)}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                              >
                                <UserCheck className="h-3 w-3 mr-1" />
                                Assign
                              </button>
                            )
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Self-Drive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="text-purple-600 hover:text-purple-900 transition-colors"
                              aria-label="View details"
                            >
                              <span className="text-xs font-medium">Details</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(booking)}
                              className="text-gray-600 hover:text-gray-900 transition-colors"
                              aria-label="Update status"
                            >
                              <MoreHorizontal className="h-5 w-5" />
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
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstBooking + 1}</span> to{" "}
                        <span className="font-medium">{Math.min(indexOfLastBooking, filteredBookings.length)}</span> of{" "}
                        <span className="font-medium">{filteredBookings.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                ? "bg-purple-50 border-purple-500 text-purple-600 z-10"
                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                            } text-sm font-medium transition-colors`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDetailsModal(false)}></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl z-50 relative">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Reservation Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Booking #{selectedBooking.id}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      selectedBooking.status,
                    )}`}
                  >
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-purple-500" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start">
                      <div>
                        <div className="font-medium text-gray-900">{selectedBooking.user?.name}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {selectedBooking.user?.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {selectedBooking.user?.phone || "Not provided"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-500 mb-3 mt-6 flex items-center">
                    <Car className="h-4 w-4 mr-2 text-purple-500" />
                    Car Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <img
                        className="h-16 w-16 rounded-md object-cover border border-gray-200 mr-3"
                        src={selectedBooking.car?.image || "/placeholder.svg"}
                        alt={`${selectedBooking.car?.brand} ${selectedBooking.car?.model}`}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {selectedBooking.car?.brand} {selectedBooking.car?.model}
                        </div>
                        <div className="text-sm text-gray-500">{selectedBooking.car_type}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-purple-500" />
                        <span className="text-gray-600">{selectedBooking.car?.year || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1 text-purple-500" />
                        <span className="text-gray-600">{selectedBooking.car?.seats || "5"} seats</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-500 mb-3 mt-6 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-purple-500" />
                    Additional Services
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      {selectedBooking.accessories && selectedBooking.accessories.length > 0 ? (
                        <div>
                          <div className="font-medium text-gray-900 mb-2">Accessories:</div>
                          <ul className="space-y-1">
                            {selectedBooking.accessories.map((accessory, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <CheckSquare className="h-3.5 w-3.5 mr-1 text-green-500" />
                                {accessory}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No accessories selected</div>
                      )}

                      {selectedBooking.insurance && (
                        <div className="mt-3">
                          <div className="font-medium text-gray-900 mb-1">Insurance:</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Shield className="h-3.5 w-3.5 mr-1 text-green-500" />
                            {selectedBooking.insurance}
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="font-medium text-gray-900 mb-1">Driver Option:</div>
                        <div className="flex items-center text-sm text-gray-600">
                          {selectedBooking.driver ? (
                            <>
                              <UserCheck className="h-3.5 w-3.5 mr-1 text-purple-500" />
                              Professional Driver Requested
                              {selectedBooking.driver_assigned || selectedBooking.assigned_driver ? (
                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                  Assigned
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setShowDetailsModal(false)
                                    handleAssignDriver(selectedBooking)
                                  }}
                                  className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full hover:bg-purple-200 transition-colors"
                                >
                                  Assign Now
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <User className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              Self-Drive
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                    Reservation Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Pickup Location</div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
                          <div className="font-medium text-gray-900">{selectedBooking.pickup_location}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Dropoff Location</div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-rose-600 mt-0.5 mr-2" />
                          <div className="font-medium text-gray-900">{selectedBooking.dropoff_location}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Pickup Date & Time</div>
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
                          <div className="font-medium text-gray-900">{formatDate(selectedBooking.pickup_date)}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Dropoff Date & Time</div>
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-rose-600 mt-0.5 mr-2" />
                          <div className="font-medium text-gray-900">{formatDate(selectedBooking.dropoff_date)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">Rental Duration</div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
                        <div className="font-medium text-gray-900">
                          {calculateDuration(selectedBooking.pickup_date, selectedBooking.dropoff_date)} days
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">Payment Information</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Price:</span>
                          <span className="font-bold text-purple-600">{selectedBooking.total_price} DH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="text-gray-900">{formatDate(selectedBooking.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {selectedBooking.assigned_driver && (
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-sm text-gray-500 mb-1">Assigned Driver</div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                              <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{selectedBooking.assigned_driver.name}</div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Phone className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                {selectedBooking.assigned_driver.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    {selectedBooking.status !== "cancelled" && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false)
                          handleUpdateStatus(selectedBooking)
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                      >
                        Update Status
                      </button>
                    )}
                    {selectedBooking.driver && !selectedBooking.driver_assigned && !selectedBooking.assigned_driver && (
                      <button
                        onClick={() => {
                          setShowDetailsModal(false)
                          handleAssignDriver(selectedBooking)
                        }}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                      >
                        Assign Driver
                      </button>
                    )}
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showStatusModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowStatusModal(false)}></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-50 relative">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Update Reservation Status</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Booking #{selectedBooking.id} - {selectedBooking.user?.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CalendarClock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900">Current Status</div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          selectedBooking.status,
                        )}`}
                      >
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="font-medium text-gray-900 mb-3">Change Status To:</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateBookingStatus("pending")}
                      className={`p-3 border rounded-md flex flex-col items-center justify-center transition-colors ${
                        selectedBooking.status === "pending"
                          ? "border-amber-500 bg-amber-50 text-amber-800"
                          : "border-gray-200 hover:border-amber-500 hover:bg-amber-50"
                      }`}
                      disabled={selectedBooking.status === "pending" || isLoading}
                    >
                      <AlertCircle className="h-6 w-6 mb-1" />
                      <span className="text-sm font-medium">Pending</span>
                    </button>
                    <button
                      onClick={() => updateBookingStatus("confirmed")}
                      className={`p-3 border rounded-md flex flex-col items-center justify-center transition-colors ${
                        selectedBooking.status === "confirmed"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                          : "border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
                      }`}
                      disabled={selectedBooking.status === "confirmed" || isLoading}
                    >
                      <CheckCircle className="h-6 w-6 mb-1" />
                      <span className="text-sm font-medium">Confirmed</span>
                    </button>
                    <button
                      onClick={() => updateBookingStatus("completed")}
                      className={`p-3 border rounded-md flex flex-col items-center justify-center transition-colors ${
                        selectedBooking.status === "completed"
                          ? "border-sky-500 bg-sky-50 text-sky-800"
                          : "border-gray-200 hover:border-sky-500 hover:bg-sky-50"
                      }`}
                      disabled={selectedBooking.status === "completed" || isLoading}
                    >
                      <Clock className="h-6 w-6 mb-1" />
                      <span className="text-sm font-medium">Completed</span>
                    </button>
                    <button
                      onClick={() => cancelBooking()}
                      className={`p-3 border rounded-md flex flex-col items-center justify-center transition-colors ${
                        selectedBooking.status === "cancelled"
                          ? "border-rose-500 bg-rose-50 text-rose-800"
                          : "border-gray-200 hover:border-rose-500 hover:bg-rose-50"
                      }`}
                      disabled={selectedBooking.status === "cancelled" || isLoading}
                    >
                      <XCircle className="h-6 w-6 mb-1" />
                      <span className="text-sm font-medium">Cancelled</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign Driver Modal */}
        {showDriverModal && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDriverModal(false)}></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl z-50 relative">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Assign Driver</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Booking #{selectedBooking.id} - {selectedBooking.user?.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowDriverModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="bg-purple-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Car className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Reservation Details</h3>
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="mb-1">
                            <span className="font-medium">Pickup:</span> {formatDate(selectedBooking.pickup_date)} at{" "}
                            {selectedBooking.pickup_location}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium">Return:</span> {formatDate(selectedBooking.dropoff_date)} at{" "}
                            {selectedBooking.dropoff_location}
                          </p>
                          <p>
                            <span className="font-medium">Duration:</span>{" "}
                            {calculateDuration(selectedBooking.pickup_date, selectedBooking.dropoff_date)} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search drivers by name, email or phone..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      value={driverSearchQuery}
                      onChange={(e) => setDriverSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                    {isLoading ? (
                      <div className="p-4 text-center">
                        <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                      </div>
                    ) : filteredDrivers === undefined ? (
                      <div className="p-4 text-center text-red-500">
                        Error loading drivers. Please try again.
                      </div>
                    ) : filteredDrivers?.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No drivers found. Try adjusting your search.</div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {Array.isArray(filteredDrivers) && filteredDrivers.map((driver) => (
                          <div
                            key={driver.id}
                            className={`p-4 flex items-center cursor-pointer transition-colors ${
                              selectedDriver && selectedDriver.id === driver.id ? "bg-purple-50" : "hover:bg-gray-50"
                            }`}
                            onClick={() => setSelectedDriver(driver)}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                selectedDriver && selectedDriver.id === driver.id
                                  ? "border-purple-500"
                                  : "border-gray-400"
                              }`}
                            >
                              {selectedDriver && selectedDriver.id === driver.id && (
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                              )}
                            </div>
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                              <UserCheck className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{driver.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                {driver.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                {driver.phone}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm font-medium text-gray-900 ml-1">{driver.rating || "4.8"}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{driver.experience || "3"} years exp.</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDriverModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    disabled={isAssigningDriver}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={assignDriverToBooking}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors flex items-center"
                    disabled={!selectedDriver || isAssigningDriver}
                  >
                    {isAssigningDriver ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Assign Driver
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ReservationManagement
