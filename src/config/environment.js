// Environment configuration
const config = {
  // API Configuration
  api: {
    baseURL:
      import.meta.env.VITE_API_BASE_URL ||
      "https://your-render-api.onrender.com/api",
    timeout: 30000, // زيادة الـ timeout إلى 30 ثانية
  },

  // App Configuration
  app: {
    name: "Court Kick Commerce Hub",
    version: "1.0.0",
  },

  // Feature flags
  features: {
    enableSearch: true,
    enableFilters: true,
    enableAdminPanel: true,
  },
};

export default config;
