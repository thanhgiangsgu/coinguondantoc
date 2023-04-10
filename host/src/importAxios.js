import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://14.225.192.174:8111/api',
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      console.log('Error 401: Unauthorized');
      localStorage.removeItem('token')
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
