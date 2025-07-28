import React, { useState, useEffect } from "react";
import { healthService } from "../services/healthService";
import { useNotifications } from "../context/NotificationContext";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const ApiTest = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [endpointResults, setEndpointResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useNotifications();

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const health = await healthService.checkApiHealth();
      setHealthStatus(health);

      if (health.isHealthy) {
        showSuccess("API متصل بنجاح", "حالة الاتصال");
      } else {
        showError(`فشل الاتصال: ${health.message}`, "خطأ في الاتصال");
      }
    } catch (error) {
      showError("حدث خطأ أثناء فحص الاتصال", "خطأ");
    } finally {
      setIsLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    setIsLoading(true);
    try {
      const results = await healthService.testAllEndpoints();
      setEndpointResults(results.results);

      const healthyCount = results.healthy;
      const totalCount = results.total;

      if (healthyCount === totalCount) {
        showSuccess(
          `جميع النقاط النهائية تعمل بنجاح (${healthyCount}/${totalCount})`,
          "اختبار شامل"
        );
      } else {
        showInfo(
          `${healthyCount} من ${totalCount} نقطة نهائية تعمل`,
          "نتائج الاختبار"
        );
      }
    } catch (error) {
      showError("حدث خطأ أثناء اختبار النقاط النهائية", "خطأ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (isHealthy) => {
    return isHealthy ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusColor = (isHealthy) => {
    return isHealthy ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          اختبار الاتصال بالباك إند
        </h1>

        {/* Health Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              حالة الاتصال العامة
            </h2>
            <button
              onClick={runHealthCheck}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              تحديث
            </button>
          </div>

          {healthStatus && (
            <div
              className={`p-4 rounded-lg border ${
                healthStatus.isHealthy
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(healthStatus.isHealthy)}
                <div>
                  <h3
                    className={`font-medium ${getStatusColor(
                      healthStatus.isHealthy
                    )}`}
                  >
                    {healthStatus.message}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    الحالة: {healthStatus.status} | الوقت:{" "}
                    {new Date(healthStatus.timestamp).toLocaleString("ar-SA")}
                  </p>
                  {healthStatus.error && (
                    <p className="text-sm text-red-600 mt-1">
                      الخطأ: {healthStatus.error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Endpoint Tests */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              اختبار النقاط النهائية
            </h2>
            <button
              onClick={testAllEndpoints}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              اختبار شامل
            </button>
          </div>

          {endpointResults.length > 0 && (
            <div className="space-y-3">
              {endpointResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.isHealthy
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.isHealthy)}
                      <div>
                        <h3
                          className={`font-medium ${getStatusColor(
                            result.isHealthy
                          )}`}
                        >
                          {result.endpoint}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {result.message}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-medium ${getStatusColor(
                          result.isHealthy
                        )}`}
                      >
                        {result.status}
                      </span>
                      <p className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString("ar-SA")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connection Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            معلومات الاتصال
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>الخادم:</strong> terpoostore.runasp.net
              </p>
              <p>
                <strong>البروتوكول:</strong> HTTP
              </p>
              <p>
                <strong>الـ Proxy:</strong> Vite Dev Server
              </p>
            </div>
            <div>
              <p>
                <strong>الـ CORS:</strong> مفعل
              </p>
              <p>
                <strong>الـ Timeout:</strong> 30 ثانية
              </p>
              <p>
                <strong>الـ Retry:</strong> 3 محاولات
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            استكشاف الأخطاء
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • تأكد من أن الباك إند الريموت متاح على terpoostore.runasp.net
            </li>
            <li>• تحقق من إعدادات CORS في الباك إند</li>
            <li>• تأكد من صحة الـ connection string للقاعدة البيانات</li>
            <li>• تحقق من سجلات الباك إند للأخطاء</li>
            <li>• تأكد من أن الـ proxy يعمل بشكل صحيح</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
