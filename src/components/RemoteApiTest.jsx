import React, { useState, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const RemoteApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useNotifications();

  const testDirectConnection = async () => {
    setIsLoading(true);
    const results = {};

    try {
      // Test direct connection to remote API
      const response = await fetch(
        "http://terpoostore.runasp.net/api/Products",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      results.directConnection = {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString(),
      };

      if (response.ok) {
        const data = await response.json();
        results.directConnection.dataCount = Array.isArray(data)
          ? data.length
          : "N/A";
      }
    } catch (error) {
      results.directConnection = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      // Test proxy connection
      const proxyResponse = await fetch("/api/Products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      results.proxyConnection = {
        success: proxyResponse.ok,
        status: proxyResponse.status,
        statusText: proxyResponse.statusText,
        timestamp: new Date().toISOString(),
      };

      if (proxyResponse.ok) {
        const data = await proxyResponse.json();
        results.proxyConnection.dataCount = Array.isArray(data)
          ? data.length
          : "N/A";
      }
    } catch (error) {
      results.proxyConnection = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }

    setTestResults(results);
    setIsLoading(false);

    // Show notifications
    if (results.directConnection?.success) {
      showSuccess("الاتصال المباشر بالباك إند الريموت ناجح", "اختبار الاتصال");
    } else {
      showError("فشل الاتصال المباشر بالباك إند الريموت", "خطأ في الاتصال");
    }

    if (results.proxyConnection?.success) {
      showSuccess("الاتصال عبر الـ Proxy ناجح", "اختبار الـ Proxy");
    } else {
      showError("فشل الاتصال عبر الـ Proxy", "خطأ في الـ Proxy");
    }
  };

  useEffect(() => {
    testDirectConnection();
  }, []);

  const getStatusIcon = (success) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusColor = (success) => {
    return success ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          اختبار الاتصال بالباك إند الريموت
        </h1>

        {/* Test Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              اختبار الاتصال
            </h2>
            <button
              onClick={testDirectConnection}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              اختبار شامل
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-6">
          {/* Direct Connection Test */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              الاتصال المباشر
            </h3>
            {testResults.directConnection ? (
              <div
                className={`p-4 rounded-lg border ${
                  testResults.directConnection.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(testResults.directConnection.success)}
                  <span
                    className={`font-medium ${getStatusColor(
                      testResults.directConnection.success
                    )}`}
                  >
                    {testResults.directConnection.success ? "ناجح" : "فشل"}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>الحالة:</strong>{" "}
                    {testResults.directConnection.status}{" "}
                    {testResults.directConnection.statusText}
                  </p>
                  <p>
                    <strong>الوقت:</strong>{" "}
                    {new Date(
                      testResults.directConnection.timestamp
                    ).toLocaleString("ar-SA")}
                  </p>
                  {testResults.directConnection.dataCount && (
                    <p>
                      <strong>عدد المنتجات:</strong>{" "}
                      {testResults.directConnection.dataCount}
                    </p>
                  )}
                  {testResults.directConnection.error && (
                    <p>
                      <strong>الخطأ:</strong>{" "}
                      {testResults.directConnection.error}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                {isLoading ? "جاري الاختبار..." : "لم يتم الاختبار بعد"}
              </div>
            )}
          </div>

          {/* Proxy Connection Test */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              الاتصال عبر الـ Proxy
            </h3>
            {testResults.proxyConnection ? (
              <div
                className={`p-4 rounded-lg border ${
                  testResults.proxyConnection.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(testResults.proxyConnection.success)}
                  <span
                    className={`font-medium ${getStatusColor(
                      testResults.proxyConnection.success
                    )}`}
                  >
                    {testResults.proxyConnection.success ? "ناجح" : "فشل"}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>الحالة:</strong>{" "}
                    {testResults.proxyConnection.status}{" "}
                    {testResults.proxyConnection.statusText}
                  </p>
                  <p>
                    <strong>الوقت:</strong>{" "}
                    {new Date(
                      testResults.proxyConnection.timestamp
                    ).toLocaleString("ar-SA")}
                  </p>
                  {testResults.proxyConnection.dataCount && (
                    <p>
                      <strong>عدد المنتجات:</strong>{" "}
                      {testResults.proxyConnection.dataCount}
                    </p>
                  )}
                  {testResults.proxyConnection.error && (
                    <p>
                      <strong>الخطأ:</strong>{" "}
                      {testResults.proxyConnection.error}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                {isLoading ? "جاري الاختبار..." : "لم يتم الاختبار بعد"}
              </div>
            )}
          </div>
        </div>

        {/* Connection Info */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            معلومات الاتصال
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>الخادم الريموت:</strong> terpoostore.runasp.net
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
            <li>• تأكد من أن الـ proxy يعمل بشكل صحيح</li>
            <li>• تحقق من إعدادات الشبكة والـ firewall</li>
            <li>• تأكد من أن الخادم الريموت يستجيب للطلبات</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RemoteApiTest;
