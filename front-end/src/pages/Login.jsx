import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";
import Spinner from "../components/common/Spinner.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const { mutate: handleLogin, isLoading } = useMutation(
    (credentials) => authAPI.login(credentials),
    {
      onSuccess: (user) => {
        login(formData).then(() => {
          navigate("/dashboard");
        });
      },
      onError: (err) => {
        const message = err.response?.data?.message || "خطایی در هنگام ورود رخ داد";
        setError(message);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.username || !formData.password) {
      setError("لطفاً نام کاربری و رمز عبور را وارد کنید");
      return;
    }
    handleLogin({
      username: formData.username,
      password: formData.password,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg px-4">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#C5A028"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="bg-dark-card bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-dark-border">
          {/* Logo/Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-dark-bg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L1 7v6c0 5 3.58 9.74 8 10 4.42-.26 8-5 8-10V7L12 2zm0 2.84L18.5 7v5.5c0 4.14-2.56 7.92-6 8.4V11h-2v5.74c-3.44-.48-6-4.26-6-8.4V7l6.5-1.16z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gold-500 mb-2">
            سامانه مدیریت آموزش
          </h2>
          <p className="text-center text-gray-400 mb-8">
            لطفاً برای ادامه وارد شوید
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                نام کاربری
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="نام کاربری خود را وارد کنید"
                  className="w-full px-4 py-3 pl-12 rounded-lg bg-dark-bg border border-dark-border text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all duration-300 placeholder-gray-500"
                  disabled={isLoading}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full px-4 py-3 pl-12 rounded-lg bg-dark-bg border border-dark-border text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all duration-300 placeholder-gray-500"
                  disabled={isLoading}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 0h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-dark-border bg-dark-bg text-gold-500 focus:ring-gold-500 cursor-pointer"
                disabled={isLoading}
              />
              <label
                htmlFor="rememberMe"
                className="mr-2 text-sm text-gray-300 cursor-pointer select-none"
              >
                مرا به خاطر بسپار
              </label>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-gold-500 to-gold-400 text-dark-bg font-semibold hover:shadow-lg hover:shadow-gold-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Spinner size="sm" color="dark" />
              ) : (
                "ورود به سامانه"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}