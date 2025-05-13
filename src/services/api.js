import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base URL
const api = axios.create({
  // baseURL: 'http://localhost:8000/api',
  baseURL: 'http://13.51.176.197/api', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json', 
    'Accept': 'application/json' ,
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Set the auth token from cookies if it exists
const token = Cookies.get('access_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get the latest token on each request (in case it was updated)
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors like 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      Cookies.remove('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods for cars
export const carService = {
  getAllCars: () => api.get('/staff/cars'),
  getCarById: (id) => api.get(`/staff/cars/${id}`),
  searchCars: (params) => api.get('/cars/search', { params }),
  createCar: (carData) => api.post('/admin/cars', carData),
  updateCar: (id, carData) => api.put(`/admin/cars/${id}`, carData),
  deleteCar: (id) => api.delete(`/admin/cars/${id}`),
  createReservation: (reservationData) => api.post('/reservations', reservationData),
  getLocations: () => api.get('/locations'),
};

// API methods for reservations
export const reservationService = {
  createReservation: (reservationData) => api.post('/reservations', reservationData),
  getUserReservations: () => api.get('/user/reservations'),
  getStaffReservations: () => api.get('/admin/reservations'),
  getAdminReservations: () => api.get('/admin/reservations'),
  cancelReservation: (id) => api.delete(`/admin/reservations/${id}`),
  updateReservation: (id, reservationData) => api.put(`/admin/reservations/${id}`, reservationData),
  assignDriverToReservation: (id, driverId) => api.post(`/admin/reservations/${id}/assign-driver`, { driverId }),
  downloadReservationPdf: (reservationId) => api.get(`/reservations/${reservationId}/pdf`, {
    responseType: 'blob'
  }),
};

// API methods for user management
export const userService = {
  // Admin endpoints
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUserById: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  searchUsers: (query) => api.get(`/admin/users/search?q=${query}`),
  getDrivers: () => api.get('/drivers'),
  
  // Regular user endpoints
  getUser: () => api.get('/user').then(response => response.data),
  updateUser: (userId, userData) => {
    // Set headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    // Debug log
    console.log('Updating user:', userId);
    
    return api.put(`/user/${userId}`, userData, config).then(response => {
      console.log('Update response:', response.data);
      return response.data;
    }).catch(error => {
      console.error('Update error:', error);
      throw error;
    });
  }
};

// API methods for authentication
const authService = {
  // Simplified csrf function that just returns a resolved promise
  csrf: () => Promise.resolve(),
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

export { api, authService };