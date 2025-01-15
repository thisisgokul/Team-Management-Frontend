import axios from 'axios';

// Create Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: 'https://team-management-forntend.vercel.app/api/v1', 
});

export default axiosInstance;