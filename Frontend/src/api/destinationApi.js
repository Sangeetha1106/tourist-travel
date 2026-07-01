import axiosInstance from './axiosInstance';

export const getAllDestinations = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/destinations?${query}` : '/destinations';
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getDestinationById = async (id) => {
  const response = await axiosInstance.get(`/destinations/${id}`);
  return response.data;
};

export const createDestination = async (formData) => {
  const response = await axiosInstance.post('/destinations', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
