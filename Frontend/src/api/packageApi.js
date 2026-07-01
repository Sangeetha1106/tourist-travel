import axiosInstance from './axiosInstance';

export const getAllPackages = async (params = {}) => {
  const response = await axiosInstance.get('/packages', { params });
  return response.data;
};

export const getPackageById = async (id) => {
  const response = await axiosInstance.get(`/packages/${id}`);
  return response.data;
};

export const createPackage = async (formData) => {
  const response = await axiosInstance.post('/packages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
