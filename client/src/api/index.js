import axios from 'axios';
export const BASE_URL = 'https://chatconnect-2fpc.onrender.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
