import axios from 'axios';
export const BASE_URL = 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
