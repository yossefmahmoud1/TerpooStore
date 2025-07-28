import { useEffect, useState } from "react";

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
  });

  useEffect(() => {
    // Get basic performance metrics
    const getPerformanceMetrics = () => {
      const navigation = performance.getEntriesByType("navigation")[0];
      const paint = performance.getEntriesByType("paint");

      const fcp = paint.find(
        (entry) => entry.name === "first-contentful-paint"
      );
      const lcp = performance.getEntriesByType("largest-contentful-paint")[0];

      setMetrics({
        loadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
        domContentLoaded:
          navigation?.domContentLoadedEventEnd -
            navigation?.domContentLoadedEventStart || 0,
        firstContentfulPaint: fcp?.startTime || 0,
        largestContentfulPaint: lcp?.startTime || 0,
        firstInputDelay: 0, // Will be updated by observer
        cumulativeLayoutShift: 0, // Will be updated by observer
      });
    };

    // Observe Core Web Vitals
    const observeWebVitals = () => {
      // First Input Delay
      let firstInputDelay = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "first-input") {
            firstInputDelay = entry.processingStart - entry.startTime;
            setMetrics((prev) => ({ ...prev, firstInputDelay }));
          }
        }
      });
      observer.observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift
      let cumulativeLayoutShift = 0;
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
            setMetrics((prev) => ({ ...prev, cumulativeLayoutShift }));
          }
        }
      });
      layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });

      return () => {
        observer.disconnect();
        layoutShiftObserver.disconnect();
      };
    };

    // Get initial metrics after page load
    if (document.readyState === "complete") {
      getPerformanceMetrics();
    } else {
      window.addEventListener("load", getPerformanceMetrics);
    }

    const cleanup = observeWebVitals();

    return () => {
      window.removeEventListener("load", getPerformanceMetrics);
      cleanup();
    };
  }, []);

  const getPerformanceGrade = (metric, thresholds) => {
    if (metric <= thresholds.good) return "🟢 Good";
    if (metric <= thresholds.needsImprovement) return "🟡 Needs Improvement";
    return "🔴 Poor";
  };

  const formatTime = (ms) => `${Math.round(ms)}ms`;

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-2">
        Performance Metrics
      </h3>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span
            className={
              metrics.loadTime > 3000 ? "text-red-600" : "text-green-600"
            }
          >
            {formatTime(metrics.loadTime)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>DOM Ready:</span>
          <span
            className={
              metrics.domContentLoaded > 2000
                ? "text-red-600"
                : "text-green-600"
            }
          >
            {formatTime(metrics.domContentLoaded)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>First Paint:</span>
          <span
            className={
              metrics.firstContentfulPaint > 1800
                ? "text-red-600"
                : "text-green-600"
            }
          >
            {formatTime(metrics.firstContentfulPaint)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Largest Paint:</span>
          <span
            className={
              metrics.largestContentfulPaint > 2500
                ? "text-red-600"
                : "text-green-600"
            }
          >
            {formatTime(metrics.largestContentfulPaint)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>First Input:</span>
          <span
            className={
              metrics.firstInputDelay > 100 ? "text-red-600" : "text-green-600"
            }
          >
            {formatTime(metrics.firstInputDelay)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Layout Shift:</span>
          <span
            className={
              metrics.cumulativeLayoutShift > 0.1
                ? "text-red-600"
                : "text-green-600"
            }
          >
            {metrics.cumulativeLayoutShift.toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
