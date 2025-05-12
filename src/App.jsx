import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/car-rental.css'

import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Cars from './pages/Cars';
import RentNow from './pages/RentNow';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CarReservation from './pages/CarReservation';
import Dashboard from './pages/DashboardHome';
import CarManagement from './pages/CarManagement';
import AccessoriesManagement from './pages/AccessoriesManagement';
import UsersManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ReservationManagement from './pages/ReservationManagement';



function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    // Optionally redirect or show not authorized
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-600">Not authorized</div>;
  }
  
  // If user is staff and trying to access a page other than reservations, redirect them
  if (user.role === 'staff') {
    const currentPath = window.location.pathname;
    const allowedPaths = ['/admin/reservations', '/dashboard', '/admin/cars'];
    
    if (!allowedPaths.includes(currentPath)) {
      return <Navigate to="/admin/reservations" replace />;
    }
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="car-rental-app">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/rent-now" element={
              <ProtectedRoute>
                <RentNow />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/cars/:id/reserve" element={
              <ProtectedRoute>
                <CarReservation />
              </ProtectedRoute>
            } />
            {/* Admin-only route */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            {/* Admin dashboard routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/cars" element={
              <ProtectedRoute>
                <AdminRoute>
                  <CarManagement />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/reservations" element={
              <ProtectedRoute>
                <AdminRoute>
                  <ReservationManagement />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminRoute>
                  <UsersManagement />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/accessories" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AccessoriesManagement />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute>
                <AdminRoute>
                  <Reports />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              </ProtectedRoute>
            } />
           
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
