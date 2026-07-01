import axiosInstance from './axiosInstance';

export const getAllBookings = async () => {
  const response = await axiosInstance.get('/bookings');
  return response.data;
};

export const getMyBookings = async () => {
  const response = await axiosInstance.get('/bookings/my-bookings');
  return response.data;
};

export const getAssignedTrips = async () => {
  const response = await axiosInstance.get('/bookings/guide/trips');
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await axiosInstance.post('/bookings', bookingData);
  return response.data;
};

export const updateBooking = async (id, statusData) => {
  const response = await axiosInstance.put(`/bookings/${id}`, statusData);
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await axiosInstance.get(`/bookings/${id}`);
  return response.data;
};

export const approveBooking = async (id) => {
  const response = await axiosInstance.patch(`/bookings/${id}/approve`);
  return response.data;
};

export const rejectBooking = async (id, rejectionReason) => {
  const response = await axiosInstance.patch(`/bookings/${id}/reject`, { rejectionReason });
  return response.data;
};

export const assignGuide = async (id, assignmentData) => {
  const response = await axiosInstance.patch(`/bookings/${id}/assign-guide`, assignmentData);
  return response.data;
};

export const startTrip = async (id) => {
  const response = await axiosInstance.patch(`/bookings/${id}/start-trip`);
  return response.data;
};

export const updateTripProgress = async (id, progressNote) => {
  const response = await axiosInstance.patch(`/bookings/${id}/update-progress`, { progressNote });
  return response.data;
};

export const completeTrip = async (id) => {
  const response = await axiosInstance.patch(`/bookings/${id}/complete-trip`);
  return response.data;
};
