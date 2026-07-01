import axiosInstance from './axiosInstance';

export const createPayment = async (paymentData) => {
  const response = await axiosInstance.post('/payments', paymentData);
  return response.data;
};

export const getAllPayments = async () => {
  const response = await axiosInstance.get('/payments');
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await axiosInstance.get(`/payments/${id}`);
  return response.data;
};
