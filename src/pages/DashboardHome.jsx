
import { useState, useEffect } from "react"
import DashboardLayout from "./DashboardLayout"
import { Car, Users, CalendarClock, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    activeReservations: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalCars: 48,
        activeReservations: 23,
        totalUsers: 156,
        monthlyRevenue: 42500,
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  // Revenue chart data
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue (DH)",
        data: [30000, 35000, 25000, 45000, 40000, 50000, 42500, 55000, 60000, 48000, 52000, 58000],
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Reservations by car type chart
  const reservationsByTypeData = {
    labels: ["Economy", "SUV", "Luxury", "Van"],
    datasets: [
      {
        label: "Reservations",
        data: [45, 25, 20, 10],
        backgroundColor: ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981"],
        borderWidth: 0,
      },
    ],
  }

  // Popular cars chart
  const popularCarsData = {
    labels: ["Toyota Corolla", "Honda Civic", "BMW 3 Series", "Mercedes C-Class", "Audi A4"],
    datasets: [
      {
        label: "Reservations",
        data: [28, 22, 18, 15, 12],
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Recent reservations
  const recentReservations = [
    {
      id: "RES-2023-001",
      customer: "Ahmed Hassan",
      car: "BMW 3 Series",
      startDate: "2023-10-15",
      endDate: "2023-10-20",
      status: "active",
      amount: 4250,
    },
    {
      id: "RES-2023-002",
      customer: "Fatima Khalid",
      car: "Toyota Corolla",
      startDate: "2023-10-14",
      endDate: "2023-10-18",
      status: "active",
      amount: 1750,
    },
    {
      id: "RES-2023-003",
      customer: "Karim Benali",
      car: "Mercedes C-Class",
      startDate: "2023-10-12",
      endDate: "2023-10-16",
      status: "completed",
      amount: 3600,
    },
    {
      id: "RES-2023-004",
      customer: "Nadia El Fassi",
      car: "Honda Civic",
      startDate: "2023-10-10",
      endDate: "2023-10-15",
      status: "completed",
      amount: 1900,
    },
  ]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your business.</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-7 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Car className="h-6 w-6 text-purple-600" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.totalCars}</h3>
            <p className="text-gray-600">Total Cars</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-pink-100 rounded-lg">
                <CalendarClock className="h-6 w-6 text-pink-600" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.activeReservations}</h3>
            <p className="text-gray-600">Active Reservations</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                24%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.totalUsers}</h3>
            <p className="text-gray-600">Total Users</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                3%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{stats.monthlyRevenue} DH</h3>
            <p className="text-gray-600">Monthly Revenue</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-80">
            <Line
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservations by Car Type</h3>
          <div className="h-80 flex items-center justify-center">
            <div className="w-3/4 h-3/4">
              <Doughnut
                data={reservationsByTypeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Cars</h3>
          <div className="h-80">
            <Bar
              data={popularCarsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: true,
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
            <a href="/admin/reservations" className="text-sm text-purple-600 hover:text-purple-800">
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Car
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.car}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reservation.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.amount} DH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardHome
