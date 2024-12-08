import axios from "axios";
import { auth } from "../config/firebaseConfig";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`, 
  });
  api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        try {
          const user = auth.currentUser;
          if (user) {
            const newToken = await user.getIdToken(true); 
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config); 
          }
        } catch {
        //   auth.signOut();
        //   window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
export default api;