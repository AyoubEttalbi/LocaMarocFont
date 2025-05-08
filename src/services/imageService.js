import { api } from './api';

// Image upload service
export const imageService = {
  /**
   * Upload an image to the server, which will then handle Cloudinary upload
   * @param {File} imageFile - The image file to upload
   * @returns {Promise<Object>} - The response containing the Cloudinary URL
   */
  uploadImage: async (imageFile) => {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Send the image to the backend API which will handle Cloudinary upload
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};