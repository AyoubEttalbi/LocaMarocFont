import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import Header from "../components/CarRental/Header"
import Footer from "../components/CarRental/Footer"
import { reservationService, userService } from "../services/api"
import {
  User,
  Calendar,
  MapPin,
  Clock,
  Car,
  Edit3,
  Save,
  X,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

export default function Profile() {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    driverLicense: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [expandedBooking, setExpandedBooking] = useState(null)

  // Fetch user data and bookings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setProfileLoading(true)
        const userData = await userService.getUser()
        
        // Ensure all fields have default values
        const defaultData = {
          name: "",
          email: "",
          phone: "",
          address: "",
          age: "",
          driverLicense: ""
        }

        // Merge default values with actual data
        const profileData = { ...defaultData, ...userData }
        
        // Store the user ID in a local state
        setProfileData({
          ...profileData,
          id: userData.id,
          role: user?.role || 'user',
          email_verified_at: userData.email_verified_at,
          password: null
        })
      } catch (err) {
        console.error("Error fetching user data:", err)
      } finally {
        setProfileLoading(false)
      }
    }

    const fetchUserBookings = async () => {
      try {
        setLoading(true)
        const response = await reservationService.getUserReservations()
        setBookings(response.data)
      } catch (err) {
        console.error("Error fetching bookings:", err)
        setError("Failed to load your bookings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
    fetchUserBookings()
  }, [user])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setUpdateSuccess(false)
    setUpdateError(null)

    try {
      // Validate required fields
      if (!profileData.name || !profileData.email || !profileData.phone || !profileData.address) {
        setUpdateError('Please fill in all required fields: name, email, phone, and address')
        return
      }

      // Validate age
      const age = parseInt(profileData.age)
      if (!age || age < 18 || age > 100) {
        setUpdateError('Age must be between 18 and 100')
        return
      }

      // Validate password fields if changing password
      if (profileData.newPassword) {
        if (!profileData.currentPassword) {
          setUpdateError('Please enter your current password to change the password')
          return
        }
        if (profileData.newPassword !== profileData.confirmPassword) {
          setUpdateError('New password and confirm password do not match')
          return
        }
        if (profileData.newPassword.length < 8) {
          setUpdateError('New password must be at least 8 characters long')
          return
        }
      }

      // Create FormData with all required fields
      const formData = new FormData();
      
      // Add required fields from user object
      formData.append('id', user.id);
      formData.append('email_verified_at', user.email_verified_at || null);
      formData.append('role', user.role);

      // Add fields from profileData
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('phone', profileData.phone);
      formData.append('address', profileData.address);
      formData.append('age', profileData.age);
      formData.append('driverLicense', profileData.driverLicense);

      // Add password fields if changing password
      if (profileData.newPassword) {
        formData.append('currentPassword', profileData.currentPassword);
        formData.append('password', profileData.newPassword);
        formData.append('confirmPassword', profileData.confirmPassword);
      }

      // Add image if selected
      const imageInput = e.target.querySelector('input[type="file"]');
      if (imageInput && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
      }

      // Debug log the form data
      console.log('Form Data:', Object.fromEntries(formData.entries()));

      // Send the FormData
      await userService.updateUser(formData);
      setUser({ ...user, ...profileData })
      setUpdateSuccess(true)
      setIsEditing(false)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setUpdateError("Failed to update profile. Please try again.")
    }
  }

  // Handle booking cancellation
  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await reservationService.cancelReservation(id)
        // Update the status in the local state
        setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: "cancelled" } : booking)))
      } catch (err) {
        console.error("Error cancelling booking:", err)
        alert("Failed to cancel booking. Please try again.")
      }
    }
  }

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

  // Toggle booking details
  const toggleBookingDetails = (id) => {
    setExpandedBooking(expandedBooking === id ? null : id)
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-8 w-full mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold">My Profile</h1>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      aria-label="Edit profile"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-purple-600">
                    <User className="h-8 w-8" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{profileData.name}</h2>
                    <p className="text-purple-200">{profileData.email}</p>
                  </div>
                </div>
              </div>

              {profileLoading ? (
                <div className="p-6 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : isEditing ? (
                <form onSubmit={handleUpdateProfile} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={profileData.age}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="18"
                        max="100"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Must be at least 18 years old to rent a car
                      </p>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <label htmlFor="driverLicense" className="block text-sm font-medium text-slate-700 mb-1">
                        Driver License Number
                      </label>
                      <input
                        type="text"
                        id="driverLicense"
                        name="driverLicense"
                        value={profileData.driverLicense}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={profileData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your current password to change it"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={profileData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter new password (optional)"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-slate-700 mb-1">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {updateError && (
                    <div className="mt-4 p-3 bg-rose-50 text-rose-700 rounded-md flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      {updateError}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  {updateSuccess && (
                    <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-md flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Profile updated successfully!
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-slate-500">Phone Number</p>
                        <p className="font-medium text-slate-800">{profileData.phone || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-slate-500">Email Address</p>
                        <p className="font-medium text-slate-800">{profileData.email || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-slate-500">Address</p>
                        <p className="font-medium text-slate-800">{profileData.address || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <User className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-slate-500">Age</p>
                        <p className="font-medium text-slate-800">{profileData.age || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-slate-500">Driver License</p>
                        <p className="font-medium text-slate-800">{profileData.driverLicense || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-slate-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-slate-500">Member Since</p>
                        <p className="font-medium text-slate-800">
                          {user && user.created_at ? formatDate(user.created_at) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => logout()}
                      className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
                <h2 className="text-xl font-bold">My Bookings</h2>
                <p className="text-purple-200 mt-1">View and manage your car rental reservations</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : error ? (
                <div className="p-6">
                  <div className="bg-rose-50 text-rose-700 p-4 rounded-md flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {error}
                  </div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Car className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No bookings yet</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    You haven't made any car rental bookings yet. Start exploring our fleet to find your perfect ride.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/cars")}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Browse Cars
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-0">
                      <div
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => toggleBookingDetails(booking.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 mr-4">
                              <Car className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">
                                {(booking.car_type || '').charAt(0).toUpperCase() + (booking.car_type || '').slice(1)}
                              </div>
                              <div className="text-sm text-slate-500">
                                {formatDate(booking.pickup_date)} - {formatDate(booking.dropoff_date)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${getStatusBadgeColor(booking.status)}`}
                            >
                              {(booking.status || '').charAt(0).toUpperCase() + (booking.status || '').slice(1)}
                            </span>
                            {expandedBooking === booking.id ? (
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedBooking === booking.id && (
                        <div className="px-4 pb-4 pt-2 bg-slate-50">
                          <div className="bg-white rounded-lg border border-slate-200 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Pickup Details</h4>
                                <div className="bg-slate-50 rounded-md p-3">
                                  <div className="flex items-start mb-2">
                                    <MapPin className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
                                    <div>
                                      <div className="font-medium text-slate-800">
                                        {(booking.pickup_location || '').charAt(0).toUpperCase() +
                                          (booking.pickup_location || '').slice(1)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
                                    <div>
                                      <div className="font-medium text-slate-800">
                                        {formatDate(booking.pickup_date)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Dropoff Details</h4>
                                <div className="bg-slate-50 rounded-md p-3">
                                  <div className="flex items-start mb-2">
                                    <MapPin className="h-5 w-5 text-rose-600 mt-0.5 mr-2" />
                                    <div>
                                      <div className="font-medium text-slate-800">
                                        {(booking.dropoff_location || '').charAt(0).toUpperCase() +
                                          (booking.dropoff_location || '').slice(1)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-rose-600 mt-0.5 mr-2" />
                                    <div>
                                      <div className="font-medium text-slate-800">
                                        {formatDate(booking.dropoff_date)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Duration</h4>
                                <div className="bg-slate-50 rounded-md p-3 flex items-center">
                                  <Clock className="h-5 w-5 text-slate-400 mr-2" />
                                  <span className="font-medium text-slate-800">
                                    {calculateDuration(booking.pickup_date, booking.dropoff_date)} days
                                  </span>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Total Cost</h4>
                                <div className="bg-slate-50 rounded-md p-3 flex items-center">
                                  <span className="font-medium text-slate-800">
                                    {booking.total_cost || booking.total_price || "N/A"} DH
                                  </span>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Driver Requested</h4>
                                <div className="bg-slate-50 rounded-md p-3 flex items-center">
                                  <span className="font-medium text-slate-800">{booking.driver ? "Yes" : "No"}</span>
                                </div>
                              </div>
                            </div>

                            {booking.accessories && booking.accessories.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Accessories</h4>
                                <div className="bg-slate-50 rounded-md p-3">
                                  <div className="flex flex-wrap gap-2">
                                    {booking.accessories.map((accessory, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                      >
                                        {accessory.charAt(0).toUpperCase() + accessory.slice(1).replace("-", " ")}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {booking.insurance && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-slate-500 mb-2">Insurance</h4>
                                <div className="bg-slate-50 rounded-md p-3">
                                  <span className="font-medium text-slate-800">
                                    {booking.insurance.charAt(0).toUpperCase() + booking.insurance.slice(1)}
                                  </span>
                                </div>
                              </div>
                            )}

                            {booking.status !== "cancelled" && booking.status !== "completed" && (
                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCancelBooking(booking.id)
                                  }}
                                  className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors flex items-center"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel Booking
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
