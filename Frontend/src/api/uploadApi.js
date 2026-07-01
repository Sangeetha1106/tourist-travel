import axiosInstance from './axiosInstance';

export const uploadIdProof = async (formData) => {
  try {
    const response = await axiosInstance.post('/upload/id-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'File upload failed' };
  }
};
