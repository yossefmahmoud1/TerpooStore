import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "/logo.png";

export default function Login() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!form.username || !form.email || !form.password) {
      setStatus({ type: "error", msg: "Please fill all fields." });
      toast.error("Please fill all fields.");
      setLoading(false);
      return;
    }
    // منع تسجيل دخول الأدمن من هنا
    if (
      form.username.trim().toLowerCase() === "admin" ||
      form.email.trim().toLowerCase() === "admin@admin.com"
    ) {
      setStatus({
        type: "error",
        msg: "Admin login is only allowed from the admin panel!",
      });
      toast.error("Admin login is only allowed from the admin panel!");
      setLoading(false);
      return;
    }
    // تسجيل دخول مستخدم عادي
    localStorage.setItem("isAdmin", "false");
    // استخراج الاسم قبل @ من الإيميل
    const emailName = form.email.split("@")[0];
    localStorage.setItem("firstName", emailName);
    window.dispatchEvent(new Event("storage"));
    setStatus({ type: "success", msg: "Login successful! Redirecting..." });
    toast.success("Login successful!");
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col md:flex-row items-center md:items-stretch mx-auto max-w-3xl w-full">
        {/* Left Section: Logo & Welcome */}
        <div className="hidden md:flex flex-col justify-center items-center w-[400px] bg-gradient-to-br from-pink-600 to-pink-400 rounded-l-3xl rounded-r-none p-12 text-white">
          <img
            src={logo}
            alt="Logo"
            className="w-32 h-32 object-contain mb-6 drop-shadow-xl"
          />
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
            Welcome to
          </h2>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            Terboo Store
          </h1>
          <p className="text-lg opacity-80 text-center max-w-xs">
            Everything you need, customized just for you. Shop the best products
            with us!
          </p>
        </div>
        {/* Right Section: Login Form */}
        <div className="flex-1 flex items-center justify-center bg-white rounded-r-3xl rounded-l-none shadow-xl p-6 md:p-12">
          <div className="w-full">
            <div className="flex flex-col items-center mb-6 md:hidden">
              <img
                src={logo}
                alt="Logo"
                className="w-20 h-20 object-contain mb-2"
              />
              <h2 className="text-2xl font-extrabold mb-1 tracking-tight text-blue-700">
                Welcome to Terboo Store
              </h2>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 tracking-tight uppercase mb-8 text-center">
              Login
            </h2>
            {status && (
              <div
                className={`mb-4 text-center rounded-lg py-2 px-3 font-bold flex items-center gap-2 justify-center text-base ${
                  status.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-600 border border-red-300"
                }`}
              >
                {status.type === "error" && (
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                  </svg>
                )}
                {status.type === "success" && (
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                <span>{status.msg}</span>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-blue-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-white font-bold text-gray-900 shadow-sm outline-none ${
                    !form.username && status?.type === "error"
                      ? "border-gray-500 bg-red-50"
                      : "border-blue-200 focus:border-blue-500"
                  }`}
                  placeholder="Username"
                />
                {!form.username && status?.type === "error" && (
                  <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span>Username is required</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-white font-bold text-gray-900 shadow-sm outline-none ${
                    !form.email && status?.type === "error"
                      ? "border-gray-500 bg-red-50"
                      : "border-blue-200 focus:border-blue-500"
                  }`}
                  placeholder="your@email.com"
                />
                {!form.email && status?.type === "error" && (
                  <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span>Email is required</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all bg-white font-bold text-gray-900 shadow-sm outline-none pr-12 ${
                      !form.password && status?.type === "error"
                        ? "border-gray-500 bg-red-50"
                        : "border-blue-200 focus:border-blue-500"
                    }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575m1.75-2.425A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.402 3.22-1.125 4.575m-1.75 2.425A9.956 9.956 0 0112 21c-1.657 0-3.22-.402-4.575-1.125m-2.425-1.75A9.956 9.956 0 013 12c0-1.657.402-3.22 1.125-4.575"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.642 1.67-1.104 2.425"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {!form.password && status?.type === "error" && (
                  <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span>Password is required</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl font-extrabold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={loading}
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                Login
              </button>
            </form>
            <div className="text-center mt-6 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-bold hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
