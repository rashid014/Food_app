// axiosInstance.js

import axios from 'axios';
axios.defaults.withCredentials=true;
// Create an instance of axios with a custom configuration
const instance = axios.create({
  baseURL: 'https://lazyfoodie.online/',
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    

    return config;
  },
  (error) => {
    // Handle request errors
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
 

    return response;
  },
  (error) => {
    // Handle response errors
    console.error('Error in response interceptor:', error);

    

    return Promise.reject(error);
  }
);

export default instance;
