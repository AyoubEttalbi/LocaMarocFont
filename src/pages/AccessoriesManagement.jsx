
import { useState, useEffect } from "react"
import DashboardLayout from "./DashboardLayout"
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, X, Package } from "lucide-react"

const AccessoriesManagement = () => {
  const [accessories, setAccessories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAccessory, setSelectedAccessory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    image: null,
  })

  // Sample accessories data
  const sampleAccessories = [
    {
      id: 1,
      name: "GPS Navigation",
      description: "Advanced GPS with real-time updates",
      pricePerDay: 150,
      image: "/assets/gps.jpg",
    },
    {
      id: 2,
      name: "Child Safety Seat",
      description: "Certified child seat for maximum safety",
      pricePerDay: 200,
      image: "/assets/child-seat.jpg",
    },
    {
      id: 3,
      name: "Portable WiFi Hotspot",
      description: "Stay connected with high-speed internet",
      pricePerDay: 120,
      image: "/assets/wifi.jpg",
    },
    {
      id: 4,
      name: "Roof Rack",
      description: "Extra storage for luggage and equipment",
      pricePerDay: 180,
      image: "/assets/roof-rack.jpg",
    },
    {
      id: 5,
      name: "Bluetooth Car Kit",
      description: "Hands-free calling and music streaming",
      pricePerDay: 80,
      image: "/assets/bluetooth.jpg",
    },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccessories(sampleAccessories)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter accessories based on search query
  const filteredAccessories = accessories.filter((accessory) =>
    accessory.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Pagination
  const accessoriesPerPage = 5
  const indexOfLastAccessory = currentPage * accessoriesPerPage
  const indexOfFirstAccessory = indexOfLastAccessory - accessoriesPerPage
  const currentAccessories = filteredAccessories.slice(indexOfFirstAccessory, indexOfLastAccessory)
  const totalPages = Math.ceil(filteredAccessories.length / accessoriesPerPage)

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: URL.createObjectURL(e.target.files[0]),
      })
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Create new accessory object
    const newAccessory = {
      id: selectedAccessory ? selectedAccessory.id : accessories.length + 1,
      ...formData,
    }

    if (selectedAccessory) {
      // Update existing accessory
      setAccessories(accessories.map((acc) => (acc.id === selectedAccessory.id ? newAccessory : acc)))
    } else {
      // Add new accessory
      setAccessories([...accessories, newAccessory])
    }

    // Reset form and close modal
    setFormData({
      name: "",
      description: "",
      pricePerDay: "",
      image: null,
    })
    setShowAddModal(false)
    setSelectedAccessory(null)
  }

  // Handle edit accessory
  const handleEditAccessory = (accessory) => {
    setSelectedAccessory(accessory)
    setFormData({
      name: accessory.name,
      description: accessory.description,
      pricePerDay: accessory.pricePerDay,
      image: accessory.image,
    })
    setShowAddModal(true)
  }

  // Handle delete accessory
  const handleDeleteAccessory = (accessory) => {
    setSelectedAccessory(accessory)
    setShowDeleteModal(true)
  }

  // Confirm delete accessory
  const confirmDeleteAccessory = () => {
    setAccessories(accessories.filter((acc) => acc.id !== selectedAccessory.id))
    setShowDeleteModal(false)
    setSelectedAccessory(null)
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Accessories Management</h1>
          <p className="text-slate-500">Manage additional services and accessories for rental cars</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Accessory
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-slate-200">
        <div className="flex items-center">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search accessories..."
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Accessories Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : currentAccessories.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No accessories found</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery ? "Try adjusting your search" : "Add your first accessory to get started"}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Accessory
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
                      Accessory
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Description
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {currentAccessories.map((accessory) => (
                    <tr key={accessory.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover border border-slate-200"
                              src={accessory.image || "/placeholder.svg"}
                              alt={accessory.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-800">{accessory.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{accessory.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">{accessory.pricePerDay} DH/day</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEditAccessory(accessory)}
                            className="text-teal-600 hover:text-teal-900 transition-colors"
                            aria-label="Edit accessory"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAccessory(accessory)}
                            className="text-rose-600 hover:text-rose-900 transition-colors"
                            aria-label="Delete accessory"
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
                      Showing <span className="font-medium">{indexOfFirstAccessory + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastAccessory, filteredAccessories.length)}</span>{" "}
                      of <span className="font-medium">{filteredAccessories.length}</span> results
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

      {/* Add/Edit Accessory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-slate-900">
                      {selectedAccessory ? "Edit Accessory" : "Add New Accessory"}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-y-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                              Accessory Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-slate-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                              Description
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="description"
                                name="description"
                                rows={3}
                                required
                                value={formData.description}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-slate-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="pricePerDay" className="block text-sm font-medium text-slate-700">
                              Price Per Day (DH)
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                name="pricePerDay"
                                id="pricePerDay"
                                required
                                value={formData.pricePerDay}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-teal-500 focus:border-teal-500 block w-full sm:text-sm border-slate-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="image" className="block text-sm font-medium text-slate-700">
                              Accessory Image
                            </label>
                            <div className="mt-1 flex items-center">
                              {formData.image ? (
                                <div className="relative">
                                  <img
                                    src={formData.image || "/placeholder.svg"}
                                    alt="Accessory preview"
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
                                    <span>Upload a file</span>
                                    <input
                                      id="file-upload"
                                      name="file-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={handleImageChange}
                                    />
                                  </label>
                                </div>
                              )}
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
                  {selectedAccessory ? "Update Accessory" : "Add Accessory"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedAccessory(null)
                    setFormData({
                      name: "",
                      description: "",
                      pricePerDay: "",
                      image: null,
                    })
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-rose-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-slate-900">Delete Accessory</h3>
                    <div className="mt-2">
                      <p className="text-sm text-slate-500">
                        Are you sure you want to delete {selectedAccessory?.name}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteAccessory}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedAccessory(null)
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default AccessoriesManagement
