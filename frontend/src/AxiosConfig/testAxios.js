import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  headers: {
    Authorization: 'Bearer test_token',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  console.log('Request intercepted:', config);
  return config;
});

axiosInstance.get('/test-endpoint/')
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
