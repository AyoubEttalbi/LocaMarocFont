
import { useState, useEffect } from "react"
import { Link, useLocation, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  LayoutDashboard,
  Car,
  CalendarClock,
  Users,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  Sun,
  Moon,
} from "lucide-react"

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname
  const { user, logout } = useAuth()
  
  const isAdmin = user?.role === 'admin'
  const isStaff = user?.role === 'staff'

  // Redirect staff to reservations page if they try to access other admin pages
  // Redirect staff to reservations page if they try to access other admin pages
  if (isStaff && !currentPath.includes('/admin/reservations') && currentPath !== '/dashboard' && !currentPath.includes('/admin/cars')) {
    return <Navigate to="/admin/reservations" replace />
  }

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Define navigation based on user role
  const navigation = isStaff 
    ? [
        { name: "Reservations", href: "/admin/reservations", icon: CalendarClock },
        { name: "Cars", href: "/admin/cars", icon: Car }
      ]
    : [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Cars", href: "/admin/cars", icon: Car },
        { name: "Reservations", href: "/admin/reservations", icon: CalendarClock },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Accessories", href: "/admin/accessories", icon: Package },
        { name: "Reports", href: "/admin/reports", icon: BarChart3 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ]

  const isActive = (path) => {
    return currentPath === path
  }

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New Reservation",
      message: "Ahmed Hassan has made a new reservation for BMW 3 Series",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Car Maintenance Due",
      message: "Toyota Corolla (ID: 1) is due for maintenance in 3 days",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "Payment of 2,500 DH received for reservation #1234",
      time: "Yesterday",
      read: true,
    },
  ]

  return (
    <div className={`h-screen flex overflow-hidden ${darkMode ? "dark bg-gray-900" : "bg-gray-100"}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-50 w-64 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div
          className={`flex items-center justify-between h-16 px-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <Link to="/" className="flex items-center">
            <img src="/assets/logo-dark.png" alt="LocaMaroc Logo" className="h-8 w-8" />
            <span className={`ml-2 text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>LocaMaroc</span>
          </Link>
          <button
            className="md:hidden text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive(item.href)
                      ? darkMode
                        ? "bg-indigo-900 text-white"
                        : "bg-indigo-50 text-indigo-700"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href)
                        ? "text-indigo-500"
                        : darkMode
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-500 group-hover:text-gray-600"
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className={`flex-shrink-0 p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
              darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {darkMode ? (
              <Sun className="mr-3 h-5 w-5 text-gray-400" />
            ) : (
              <Moon className="mr-3 h-5 w-5 text-gray-500" />
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            className={`mt-2 flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
              darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LogOut className={`mr-3 h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className={`${darkMode ? "bg-gray-800 shadow-md" : "bg-white shadow-sm"} z-10`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex">
                <button
                  className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <span className="sr-only">Open sidebar</span>
                  <Menu className={`h-6 w-6 ${darkMode ? "text-gray-300" : "text-gray-500"}`} />
                </button>
              </div>

              <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="max-w-lg w-full lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        darkMode
                          ? "border-gray-700 bg-gray-700 text-white placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                      } rounded-md leading-5 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {/* Notifications dropdown */}
                <div className="relative">
                  <button
                    className={`flex-shrink-0 p-1 rounded-full ${
                      darkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-500"
                    } focus:outline-none relative`}
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen)
                      setUserMenuOpen(false)
                    }}
                    aria-label="View notifications"
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                  </button>

                  {/* Notifications dropdown panel */}
                  {notificationsOpen && (
                    <div
                      className={`origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } ring-1 ring-black ring-opacity-5 focus:outline-none`}
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div
                          className={`px-4 py-2 border-b ${
                            darkMode ? "border-gray-700 text-white" : "border-gray-200 text-gray-700"
                          } font-medium`}
                        >
                          Notifications
                        </div>
                        {notifications.length === 0 ? (
                          <div
                            className={`px-4 py-3 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} text-center`}
                          >
                            No notifications
                          </div>
                        ) : (
                          <>
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 hover:${
                                  darkMode ? "bg-gray-700" : "bg-gray-50"
                                } transition-colors duration-150 ${
                                  !notification.read ? (darkMode ? "bg-gray-750" : "bg-indigo-50") : ""
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p
                                      className={`text-sm font-medium ${
                                        darkMode ? "text-white" : "text-gray-900"
                                      } mb-0.5`}
                                    >
                                      {notification.title}
                                    </p>
                                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                      {notification.message}
                                    </p>
                                  </div>
                                  {!notification.read && <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>}
                                </div>
                                <p
                                  className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} mt-1 text-right`}
                                >
                                  {notification.time}
                                </p>
                              </div>
                            ))}
                            <div
                              className={`px-4 py-2 text-sm text-center ${
                                darkMode
                                  ? "text-indigo-400 hover:text-indigo-300"
                                  : "text-indigo-600 hover:text-indigo-800"
                              } cursor-pointer border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                            >
                              View all notifications
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="ml-4 relative flex-shrink-0">
                  <div>
                    <button
                      className={`bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        darkMode ? "ring-offset-gray-800" : ""
                      }`}
                      onClick={() => {
                        setUserMenuOpen(!userMenuOpen)
                        setNotificationsOpen(false)
                      }}
                      aria-label="User menu"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div
                        className={`h-8 w-8 rounded-full ${
                          darkMode ? "bg-gray-700" : "bg-indigo-100"
                        } flex items-center justify-center`}
                      >
                        <User className={`h-5 w-5 ${darkMode ? "text-gray-300" : "text-indigo-600"}`} />
                      </div>
                    </button>
                  </div>

                  {/* Profile dropdown panel */}
                  {userMenuOpen && (
                    <div
                      className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } ring-1 ring-black ring-opacity-5 focus:outline-none`}
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div
                          className={`block px-4 py-2 text-sm ${
                            darkMode ? "text-white" : "text-gray-700"
                          } border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <div className="font-medium">John Doe</div>
                          <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            admin@example.com
                          </div>
                        </div>
                        <a
                          href="#"
                          className={`block px-4 py-2 text-sm ${
                            darkMode
                              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          role="menuitem"
                        >
                          Your Profile
                        </a>
                        <a
                          href="#"
                          className={`block px-4 py-2 text-sm ${
                            darkMode
                              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          role="menuitem"
                        >
                          Settings
                        </a>
                        <a
                          href="#"
                          className={`block px-4 py-2 text-sm ${
                            darkMode
                              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          role="menuitem"
                        >
                          Sign out
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className={`flex-1 overflow-y-auto ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
