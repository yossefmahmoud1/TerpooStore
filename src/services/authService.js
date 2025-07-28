import api from "./api";
import { fallbackAuthService } from "./fallbackData";

// Authentication API endpoints
export const authService = {
  // Admin login
  adminLogin: async (credentials) => {
    try {
      const response = await api.post("/auth/admin-login", credentials);
      return response.data;
    } catch (error) {
      console.warn(
        "API not available, using fallback authentication:",
        error.message
      );
      return fallbackAuthService.adminLogin(credentials);
    }
  },

  // Admin logout
  adminLogout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.warn("API not available, using fallback logout:", error.message);
      return fallbackAuthService.adminLogout();
    }
  },

  // Verify admin token
  verifyToken: async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      console.warn(
        "API not available, using fallback verification:",
        error.message
      );
      return fallbackAuthService.verifyToken();
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh");
      return response.data;
    } catch (error) {
      console.warn("API not available, using fallback refresh:", error.message);
      return fallbackAuthService.verifyToken(); // Use verify as fallback for refresh
    }
  },

  // Get current admin user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.warn(
        "API not available, using fallback user data:",
        error.message
      );
      return fallbackAuthService.getCurrentUser();
    }
  },
};

// Token management utilities
export const tokenManager = {
  setToken: (token) => {
    localStorage.setItem("authToken", token);
  },

  getToken: () => {
    return localStorage.getItem("authToken");
  },

  removeToken: () => {
    localStorage.removeItem("authToken");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("authToken");
  },
};
