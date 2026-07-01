import axios from 'axios';

const API_URL = 'http://localhost:5000/api/places';

export const getAllPlaces = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_URL}?${query}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPlaceById = async (idOrSlug) => {
  try {
    const response = await axios.get(`${API_URL}/${idOrSlug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
