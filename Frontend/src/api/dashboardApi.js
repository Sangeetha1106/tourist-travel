import axiosInstance from './axiosInstance';

export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/dashboard/admin');
  return response.data;
};
