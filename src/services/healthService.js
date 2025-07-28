import api from "./api";

// Health check service for monitoring API connectivity
export const healthService = {
  // Check if API is available
  checkApiHealth: async () => {
    try {
      const response = await api.get("/Products");
      return {
        isHealthy: true,
        status: response.status,
        message: "API متصل بنجاح",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        isHealthy: false,
        status: error.response?.status || 0,
        message: "فشل الاتصال بالـ API",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Check specific endpoint health
  checkEndpointHealth: async (endpoint) => {
    try {
      const response = await api.get(endpoint);
      return {
        endpoint,
        isHealthy: true,
        status: response.status,
        message: `Endpoint ${endpoint} متصل بنجاح`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        endpoint,
        isHealthy: false,
        status: error.response?.status || 0,
        message: `فشل الاتصال بـ ${endpoint}`,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Monitor API health periodically
  startHealthMonitoring: (intervalMs = 30000) => {
    const interval = setInterval(async () => {
      const health = await healthService.checkApiHealth();
      console.log("API Health Check:", health);

      // Store health status in localStorage
      localStorage.setItem("apiHealthStatus", JSON.stringify(health));

      // If API is down, show notification
      if (!health.isHealthy) {
        console.warn("API is not responding:", health.message);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  },

  // Get last known health status
  getLastHealthStatus: () => {
    try {
      const status = localStorage.getItem("apiHealthStatus");
      return status ? JSON.parse(status) : null;
    } catch (error) {
      console.error("Error parsing health status:", error);
      return null;
    }
  },

  // Test all main endpoints
  testAllEndpoints: async () => {
    const endpoints = ["/Products", "/Categories", "/Products/most-selling"];

    const results = await Promise.all(
      endpoints.map((endpoint) => healthService.checkEndpointHealth(endpoint))
    );

    const summary = {
      total: results.length,
      healthy: results.filter((r) => r.isHealthy).length,
      unhealthy: results.filter((r) => !r.isHealthy).length,
      results,
    };

    console.log("API Health Summary:", summary);
    return summary;
  },
};

export default healthService;
