import axios from 'axios';
export const BASE_URL = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
