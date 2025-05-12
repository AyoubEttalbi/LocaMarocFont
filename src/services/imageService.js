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

// Image upload service
export const imageService = {
  /**
   * Upload an image to the server, which will then handle Cloudinary upload
   * @param {File} imageFile - The image file to upload
   * @returns {Promise<Object>} - The response containing the Cloudinary URL
   */
  uploadImage: async (imageFile) => {
    if (!imageFile) {
      throw new Error('No image file provided');
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Send the image to the backend API which will handle Cloudinary upload
    try {
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${progress}%`);
        }
      });
      
      if (!response.data || !response.data.imageUrl) {
        throw new Error('Invalid response from image upload service');
      }
      
      return response.data;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  },
};