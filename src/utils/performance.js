// Performance monitoring and optimization utilities

// Measure function execution time
export const measurePerformance = (fn, name = "Function") => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${(end - start).toFixed(2)}ms`);
  return result;
};

// Debounce function for search and other frequent operations
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events and other frequent operations
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = (srcs) => {
  return Promise.all(srcs.map((src) => preloadImage(src)));
};

// Get Core Web Vitals
export const getCoreWebVitals = () => {
  return new Promise((resolve) => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const vitals = {
        LCP:
          entries.find(
            (entry) => entry.entryType === "largest-contentful-paint"
          )?.startTime || 0,
        FID: 0,
        CLS: 0,
      };

      // Get First Input Delay
      const fidObserver = new PerformanceObserver((fidList) => {
        const fidEntry = fidList.getEntries()[0];
        vitals.FID = fidEntry.processingStart - fidEntry.startTime;
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Get Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((clsList) => {
        let cls = 0;
        for (const entry of clsList.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }
        vitals.CLS = cls;
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      resolve(vitals);
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });
  });
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ("memory" in performance) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
    };
  }
  return null;
};

// Network information
export const getNetworkInfo = () => {
  if ("connection" in navigator) {
    return {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData,
    };
  }
  return null;
};

// Performance budget checker
export const checkPerformanceBudget = (metrics) => {
  const budget = {
    LCP: 2500, // 2.5 seconds
    FID: 100, // 100 milliseconds
    CLS: 0.1, // 0.1
    FCP: 1800, // 1.8 seconds
  };

  const results = {};

  Object.keys(budget).forEach((metric) => {
    const value = metrics[metric];
    const limit = budget[metric];

    if (value <= limit) {
      results[metric] = { status: "good", value, limit };
    } else if (value <= limit * 1.5) {
      results[metric] = { status: "needs-improvement", value, limit };
    } else {
      results[metric] = { status: "poor", value, limit };
    }
  });

  return results;
};

// Resource timing analysis
export const analyzeResourceTiming = () => {
  const resources = performance.getEntriesByType("resource");
  const analysis = {
    total: resources.length,
    byType: {},
    slowest: [],
    largest: [],
  };

  resources.forEach((resource) => {
    const type = resource.initiatorType;
    if (!analysis.byType[type]) {
      analysis.byType[type] = [];
    }
    analysis.byType[type].push({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
    });
  });

  // Get slowest resources
  analysis.slowest = resources
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5)
    .map((r) => ({ name: r.name, duration: r.duration }));

  // Get largest resources
  analysis.largest = resources
    .filter((r) => r.transferSize > 0)
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 5)
    .map((r) => ({ name: r.name, size: r.transferSize }));

  return analysis;
};

// Performance optimization suggestions
export const getOptimizationSuggestions = (metrics) => {
  const suggestions = [];

  if (metrics.LCP > 2500) {
    suggestions.push({
      type: "LCP",
      priority: "high",
      message:
        "Largest Contentful Paint is too slow. Consider optimizing images and critical resources.",
    });
  }

  if (metrics.FID > 100) {
    suggestions.push({
      type: "FID",
      priority: "high",
      message:
        "First Input Delay is too high. Consider reducing JavaScript execution time.",
    });
  }

  if (metrics.CLS > 0.1) {
    suggestions.push({
      type: "CLS",
      priority: "medium",
      message:
        "Cumulative Layout Shift is too high. Reserve space for images and avoid dynamic content insertion.",
    });
  }

  return suggestions;
};
