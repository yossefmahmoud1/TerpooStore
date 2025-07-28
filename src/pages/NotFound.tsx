import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-50 to-cyan-100 px-2">
      <div className="text-center p-6 md:p-8 rounded-3xl shadow-2xl bg-white/80 border border-gray-200 max-w-xs md:max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <span className="inline-block mb-2">
            {/* Fun icon */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="#f43f5e"
                stroke="#fff"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="15"
                fill="#fff"
                stroke="#f43f5e"
                strokeWidth="3"
              />
              <path
                d="M32 17v30M17 32h30"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-pink-600 drop-shadow mb-2 tracking-tight">
            404
          </h1>
        </div>
        <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </p>
        <p className="text-gray-500 mb-6 text-sm md:text-base">
          It looks like you’ve lost your way! The page you’re looking for isn’t
          available.
        </p>
        <a
          href="/"
          className="inline-block px-4 md:px-6 py-2 md:py-3 rounded-full bg-pink-500 text-white font-bold text-base md:text-lg shadow hover:bg-pink-600 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
