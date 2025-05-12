import { useState } from "react"
import { Calendar, Download, Filter, RefreshCw, Car, Users, DollarSign } from "lucide-react"
import DashboardLayout from "./DashboardLayout"
// Sample data for charts
const monthlyRevenueData = [
  { name: "Jan", revenue: 4000, bookings: 24 },
  { name: "Feb", revenue: 3000, bookings: 18 },
  { name: "Mar", revenue: 5000, bookings: 29 },
  { name: "Apr", revenue: 2780, bookings: 15 },
  { name: "May", revenue: 1890, bookings: 12 },
  { name: "Jun", revenue: 2390, bookings: 14 },
  { name: "Jul", revenue: 3490, bookings: 21 },
  { name: "Aug", revenue: 4000, bookings: 25 },
  { name: "Sep", revenue: 2780, bookings: 17 },
  { name: "Oct", revenue: 1890, bookings: 10 },
  { name: "Nov", revenue: 2390, bookings: 15 },
  { name: "Dec", revenue: 3490, bookings: 22 },
]

const carCategoryData = [
  { name: "SUV", value: 35, color: "#8884d8" },
  { name: "Sedan", value: 25, color: "#82ca9d" },
  { name: "Luxury", value: 15, color: "#ffc658" },
  { name: "Compact", value: 20, color: "#ff8042" },
  { name: "Sports", value: 5, color: "#0088fe" },
]

const userDemographicsData = [
  { name: "18-24", male: 20, female: 15, other: 5 },
  { name: "25-34", male: 35, female: 25, other: 8 },
  { name: "35-44", male: 25, female: 20, other: 5 },
  { name: "45-54", male: 15, female: 10, other: 3 },
  { name: "55+", male: 10, female: 5, other: 2 },
]

const topCarsData = [
  { id: 1, model: "Toyota Camry", bookings: 45, revenue: 6750, availability: 85 },
  { id: 2, model: "Honda Civic", bookings: 38, revenue: 5320, availability: 72 },
  { id: 3, model: "BMW X5", bookings: 32, revenue: 9600, availability: 65 },
  { id: 4, model: "Mercedes C-Class", bookings: 30, revenue: 9000, availability: 60 },
  { id: 5, model: "Audi A4", bookings: 28, revenue: 8400, availability: 55 },
]

export default function Reports() {
  const [dateRange, setDateRange] = useState("last30days")
  const [isLoading, setIsLoading] = useState(false)

  // Function to simulate data refresh
  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <DashboardLayout>
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Reports & Analytics</h2>
          <p style={{ color: "#64748b", marginTop: "0" }}>View detailed reports and analytics about your car rental business.</p>
        </div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          marginTop: "8px"
        }}>
          <div style={{ position: "relative", flex: "1" }}>
            <span style={{ 
              position: "absolute", 
              left: "8px", 
              top: "50%", 
              transform: "translateY(-50%)"
            }}>
              <Calendar size={16} color="#64748b" />
            </span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ 
                paddingLeft: "32px", 
                paddingRight: "8px", 
                paddingTop: "8px", 
                paddingBottom: "8px",
                width: "100%", 
                border: "1px solid #e2e8f0", 
                borderRadius: "4px",
                fontSize: "14px",
                backgroundColor: "#fff"
              }}
            >
              <option value="" disabled>Select period</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="thisMonth">This month</option>
              <option value="lastMonth">Last month</option>
              <option value="thisYear">This year</option>
            </select>
          </div>
          
          <button 
            onClick={refreshData}
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              width: "40px", 
              height: "40px", 
              border: "1px solid #e2e8f0", 
              borderRadius: "4px",
              backgroundColor: "#fff"
            }}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0" }}>Refresh data</span>
          </button>
          
          <button 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              width: "40px", 
              height: "40px", 
              border: "1px solid #e2e8f0", 
              borderRadius: "4px",
              backgroundColor: "#fff"
            }}
          >
            <Filter size={16} />
            <span style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0" }}>Filter</span>
          </button>
          
          <button 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              width: "40px", 
              height: "40px", 
              border: "1px solid #e2e8f0", 
              borderRadius: "4px",
              backgroundColor: "#fff"
            }}
          >
            <Download size={16} />
            <span style={{ position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0" }}>Download</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div style={{ 
          border: "1px solid #e2e8f0", 
          borderRadius: "8px", 
          padding: "16px", 
          backgroundColor: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            marginBottom: "12px" 
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "500", margin: "0" }}>Total Revenue</h3>
            <DollarSign size={16} color="#64748b" />
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>$45,231.89</div>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0" }}>
            <span style={{ color: "#10b981", fontWeight: "500" }}>+20.1%</span> from last month
          </p>
        </div>
        
        <div style={{ 
          border: "1px solid #e2e8f0", 
          borderRadius: "8px", 
          padding: "16px", 
          backgroundColor: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            marginBottom: "12px" 
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "500", margin: "0" }}>Total Bookings</h3>
            <Calendar size={16} color="#64748b" />
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>+2,350</div>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0" }}>
            <span style={{ color: "#10b981", fontWeight: "500" }}>+12.2%</span> from last month
          </p>
        </div>
        
        <div style={{ 
          border: "1px solid #e2e8f0", 
          borderRadius: "8px", 
          padding: "16px", 
          backgroundColor: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            marginBottom: "12px" 
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "500", margin: "0" }}>Active Users</h3>
            <Users size={16} color="#64748b" />
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>+573</div>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0" }}>
            <span style={{ color: "#10b981", fontWeight: "500" }}>+8.4%</span> from last month
          </p>
        </div>
        
        <div style={{ 
          border: "1px solid #e2e8f0", 
          borderRadius: "8px", 
          padding: "16px", 
          backgroundColor: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            marginBottom: "12px" 
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: "500", margin: "0" }}>Fleet Utilization</h3>
            <Car size={16} color="#64748b" />
          </div>
          <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>78.5%</div>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0" }}>
            <span style={{ color: "#f59e0b", fontWeight: "500" }}>-2.5%</span> from last month
          </p>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}