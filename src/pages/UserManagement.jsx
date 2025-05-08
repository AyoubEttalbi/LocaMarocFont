
import { useState, useEffect } from "react"
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import DashboardLayout from "./DashboardLayout"
import { userService } from "../services/api"
import { imageService } from "../services/imageService"

// User roles
const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "client", label: "Client" },
  { value: "staff", label: "Staff" },
  { value: "driver", label: "Driver" }
]

function UserManagement() {
  const [users, setUsers] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: 18,
    role: "",
    password: "",
    email_verified_at: null,
    image: null,
    imageFile: null,
  })
  const [errors, setErrors] = useState({})

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers()
        setUsers(response.data)
        setIsInitialized(true)
      } catch (err) {
        setError(err.message || "Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [currentPage])

  // Search users
  const searchUsers = async (query) => {
    if (query.trim() === "") return setUsers([])

    try {
      const response = await userService.searchUsers(query)
      setUsers(response.data)
    } catch (err) {
      setError(err.message || "Failed to search users")
    }
  }

  // Filter users based on search term
  const filteredUsers = users?.data ? (
    searchTerm ? users.data.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    ) : users.data
  ) : []

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser) || []

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "age" ? Number.parseInt(value) || 18 : value,
    })
  }

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const response = await imageService.uploadImage(file);
        setFormData({
          ...formData,
          image: response.url,
          imageFile: file
        });
        // Ensure the image URL is included in the form submission
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrors({
          ...errors,
          image: 'Failed to upload image. Please try again.'
        });
      }
    } else {
      // If no file is selected, clear the image
      setFormData({
        ...formData,
        image: null,
        imageFile: null
      });
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters."
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address."
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits."
    }
    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters."
    }
    if (!formData.age || formData.age < 18) {
      newErrors.age = "User must be at least 18 years old."
    }
    if (!formData.role) {
      newErrors.role = "Please select a role."
    }
    // Password is optional during updates
    if (currentUser && !formData.password) {
      // No password provided during update - this is okay
    } else if (!formData.password) {
      newErrors.password = "Password is required."
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      // Create a regular JSON object instead of FormData
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address.trim() || 'No address provided',
        age: formData.age,
        role: formData.role,
        password: formData.password,
        // Include the image URL that was already uploaded in handleImageChange
        image: formData.image
      }
      
      // Add email_verified_at if it exists
      if (formData.email_verified_at) {
        userData.email_verified_at = formData.email_verified_at;
      }

      if (currentUser) {
        // Update existing user
        await userService.updateUser(currentUser.id, userData);
        setIsEditUserOpen(false);
      } else {
        // Create new user
        await userService.createUser(userData);
        setIsAddUserOpen(false);
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        age: 18,
        role: "",
        password: "",
        email_verified_at: null,
      })
      setErrors({})

      // Fetch fresh data after operation
      const response = await userService.getAllUsers()
      setUsers(response.data)
      setCurrentPage(1) // Reset to first page after operation
    } catch (err) {
      console.error('Backend Error:', err.response?.data || err.message)
      setError(err.response?.data?.message || err.response?.data?.errors || "Failed to save user")
    }
  }

  // Handle edit user
  const handleEditUser = (user) => {
    setCurrentUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      age: user.age,
      role: user.role,
      password: "",
      image: user.image || null,
      imageFile: null
    })
    setIsEditUserOpen(true)
  }

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await userService.deleteUser(userId)
      // Fetch fresh data after deletion
      const response = await userService.getAllUsers()
      setUsers(response.data)
      setCurrentPage(1) // Reset to first page after deletion
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user")
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-rose-100 text-rose-800"
      case "staff":
        return "bg-sky-100 text-sky-800"
      case "customer":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            <p className="text-slate-500">Manage user accounts, roles, and permissions</p>
          </div>
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition-colors"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>

        {/* Add User Dialog */}
        {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-slate-500 opacity-75" onClick={() => setIsAddUserOpen(false)}></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-50 relative">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">Add New User</h2>
                <p className="text-sm text-slate-500 mt-1">Fill in the details to create a new user account.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        className={`pl-10 w-full px-3 py-2 border ${errors.name ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        className={`pl-10 w-full px-3 py-2 border ${errors.email ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        className={`pl-10 w-full px-3 py-2 border ${errors.phone ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        className={`pl-10 w-full px-3 py-2 border ${errors.address ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        placeholder="123 Main St, City"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="age"
                        className={`pl-10 w-full px-3 py-2 border ${errors.age ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        min="18"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.age && <p className="text-xs text-rose-500 mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-4 w-4 text-slate-400" />
                      </div>
                      <select
                        name="role"
                        className={`pl-10 w-full px-3 py-2 border ${errors.role ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a role</option>
                        {ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.role && <p className="text-xs text-rose-500 mt-1">{errors.role}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    className={`w-full px-3 py-2 border ${errors.password ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Profile Image
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                    onClick={() => {
                      setIsAddUserOpen(false)
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        address: "",
                        age: 18,
                        role: "",
                        password: "",
                      })
                      setErrors({})
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Dialog */}
        {isEditUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-slate-500 opacity-75" onClick={() => setIsEditUserOpen(false)}></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-50 relative">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">Edit User</h2>
                <p className="text-sm text-slate-500 mt-1">Update user account details.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        className={`pl-10 w-full px-3 py-2 border ${errors.name ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        className={`pl-10 w-full px-3 py-2 border ${errors.email ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="phone"
                        className={`pl-10 w-full px-3 py-2 border ${errors.phone ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="address"
                        className={`pl-10 w-full px-3 py-2 border ${errors.address ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        placeholder="123 Main St, City"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="age"
                        className={`pl-10 w-full px-3 py-2 border ${errors.age ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        min="18"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.age && <p className="text-xs text-rose-500 mt-1">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-4 w-4 text-slate-400" />
                      </div>
                      <select
                        name="role"
                        className={`pl-10 w-full px-3 py-2 border ${errors.role ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        {ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.role && <p className="text-xs text-rose-500 mt-1">{errors.role}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password (Leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`w-full px-3 py-2 border ${errors.password ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-300 focus:ring-teal-500 focus:border-teal-500"} rounded-md shadow-sm transition-colors`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Profile Image
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                    onClick={() => {
                      setIsEditUserOpen(false)
                      setCurrentUser(null)
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        address: "",
                        age: 18,
                        role: "",
                        password: "",
                      })
                      setErrors({})
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User List Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Users</h3>
            <p className="text-sm text-slate-500">Manage user accounts, roles, and permissions.</p>

            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isInitialized && users?.data && currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500">
                        No users found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{user.name}</div>
                              <div className="text-sm text-slate-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {user.age} years old
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="text-sm flex items-center gap-1 text-slate-600">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {user.email}
                            </div>
                            <div className="text-sm flex items-center gap-1 text-slate-600">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {user.phone}
                            </div>
                            <div className="text-sm flex items-center gap-1 text-slate-600">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {user.address}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4 text-slate-400" />
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {user.email_verified_at ? (
                            <div className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-600">
                              <XCircle className="h-4 w-4" />
                              <span className="text-xs">Unverified</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="p-1 border border-slate-300 rounded hover:bg-slate-50 text-teal-600 hover:text-teal-700 transition-colors"
                              onClick={() => handleEditUser(user)}
                              aria-label="Edit user"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 border border-slate-300 rounded text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              onClick={() => handleDeleteUser(user.id)}
                              aria-label="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 flex justify-center">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || !users?.data}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === 1 || !users?.data
                    ? 'border-slate-300 text-slate-400 cursor-not-allowed'
                    : 'border-teal-500 text-teal-600 hover:bg-teal-50'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* Previous page */}
              {currentPage > 1 && users?.data && (
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  {currentPage - 1}
                </button>
              )}

              {/* Current page */}
              <button className="px-3 py-1 border border-teal-500 rounded-md bg-teal-50 text-teal-700">
                {currentPage}
              </button>

              {/* Next page */}
              {currentPage < Math.ceil((users?.data?.length || 0) / usersPerPage) && users?.data && (
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1 border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  {currentPage + 1}
                </button>
              )}

              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil((users?.data?.length || 0) / usersPerPage), prev + 1))}
                disabled={currentPage === Math.ceil((users?.data?.length || 0) / usersPerPage) || !users?.data}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === Math.ceil((users?.data?.length || 0) / usersPerPage) || !users?.data
                    ? 'border-slate-300 text-slate-400 cursor-not-allowed'
                    : 'border-teal-500 text-teal-600 hover:bg-teal-50'
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserManagement
