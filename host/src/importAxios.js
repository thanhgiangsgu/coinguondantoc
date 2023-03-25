import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://14.225.192.174:8111/api',
});

axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default axiosInstance;