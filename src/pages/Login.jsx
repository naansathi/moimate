import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrMobile: "admin@moimate.com",
    password: "password123",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrMobile.trim()) {
      newErrors.emailOrMobile = "Email or Mobile number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const result = login(formData.emailOrMobile, formData.password);
      setLoading(false);
      if (result.success) {
        navigate("/dashboard");
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-black font-sans">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access your Moi events and contribution registries.
        </p>
      </div>

      {/* Demo Credentials Alert Banner */}
      <div className="p-3.5 bg-tamil-gold-50 dark:bg-tamil-gold-950/10 border border-tamil-gold-200/50 dark:border-tamil-gold-900/30 rounded-xl flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-tamil-gold-700 dark:text-tamil-gold-450 shrink-0 mt-0.5" />
        <div className="text-xs text-tamil-gold-800 dark:text-tamil-gold-300">
          <p className="font-bold">Prefilled Testing Credentials:</p>
          <p className="font-mono mt-0.5">Admin: admin@moimate.com / password123</p>
          <p className="font-mono">Collaborator: collab@moimate.com / password123</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Phone field */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Email or Mobile Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Mail size={18} />
            </span>
            <input
              type="text"
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleChange}
              placeholder="name@email.com or 9876543210"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                errors.emailOrMobile 
                  ? "border-rose-500 focus:ring-rose-500/20" 
                  : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
              }`}
            />
          </div>
          {errors.emailOrMobile && (
            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.emailOrMobile}</p>
          )}
        </div>

        {/* Password field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Password
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Mock password recovery: try using password123!"); }} className="text-xs text-tamil-maroon-700 dark:text-tamil-gold-450 hover:underline">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                errors.password 
                  ? "border-rose-500 focus:ring-rose-500/20" 
                  : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.password}</p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4.5 w-4.5 rounded border-slate-300 text-tamil-maroon-800 focus:ring-tamil-maroon-700"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm font-semibold text-slate-500 dark:text-slate-400 select-none">
            Remember me
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 shadow-md focus:outline-none disabled:opacity-50 transition-all hover:scale-[1.01]"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      {/* Social login UI representation */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs font-semibold uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => { login("admin@moimate.com", "password123"); navigate("/dashboard"); }}
          className="w-full inline-flex justify-center py-2.5 px-4 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm"
        >
          Quick Admin Log In
        </button>
        <button 
          onClick={() => { login("collab@moimate.com", "password123"); navigate("/dashboard"); }}
          className="w-full inline-flex justify-center py-2.5 px-4 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm"
        >
          Quick Collab Log In
        </button>
      </div>

      <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        New to MoiMate?{" "}
        <Link to="/register" className="text-tamil-maroon-700 dark:text-tamil-gold-450 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
