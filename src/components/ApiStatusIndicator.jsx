import React, { useState, useEffect } from "react";
import { healthService } from "../services/healthService";
import { Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react";

const ApiStatusIndicator = () => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setIsLoading(true);
      const health = await healthService.checkApiHealth();
      setStatus(health);
      setIsLoading(false);
    };

    // Check immediately
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span>جاري التحقق من الاتصال...</span>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const getStatusIcon = () => {
    if (status.isHealthy) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (status.status === 0) {
      return <WifiOff className="w-4 h-4 text-red-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    if (status.isHealthy) {
      return "متصل";
    } else if (status.status === 0) {
      return "غير متصل";
    } else {
      return `خطأ ${status.status}`;
    }
  };

  const getStatusColor = () => {
    if (status.isHealthy) {
      return "text-green-600 bg-green-50 border-green-200";
    } else if (status.status === 0) {
      return "text-red-600 bg-red-50 border-red-200";
    } else {
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor()}`}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};

export default ApiStatusIndicator;
