import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // This is required for cookies
});

API.interceptors.request.use((req) => {
  // First try to get token from localStorage
  const token = localStorage.getItem('token');
  
  // Fallback to cookies if needed
  if (!token && document.cookie) {
    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt='))
      ?.split('=')[1];
      
    if (cookieToken) {
      localStorage.setItem('token', cookieToken);
    }
  }

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  
  return req;
});

export default API;