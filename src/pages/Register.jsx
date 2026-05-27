import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, Home, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    role: "Admin",
    agreeToTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required for physical receipts";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Service";
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
    setTimeout(() => {
      const result = register({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        role: formData.role
      });
      setLoading(false);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setErrors({ general: result.message });
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-black font-sans">
          Create Your Admin Account
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Start hosting events and tracking contributions digitally.
        </p>
      </div>

      {errors.general && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-xs font-semibold text-rose-600 dark:text-rose-455 rounded-xl">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <User size={18} />
            </span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Srinivasan Ramanujan"
              className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                errors.fullName 
                  ? "border-rose-500 focus:ring-rose-500/20" 
                  : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.fullName}</p>
          )}
        </div>

        {/* Mobile & Email in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="9876543210"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                  errors.mobileNumber 
                    ? "border-rose-500 focus:ring-rose-500/20" 
                    : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
                }`}
              />
            </div>
            {errors.mobileNumber && (
              <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sri@moimate.com"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? "border-rose-500 focus:ring-rose-500/20" 
                    : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Full Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 pt-2 flex items-start text-slate-400">
              <Home size={18} />
            </span>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              placeholder="Street Name, Area, City - Pin Code"
              className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.address 
                  ? "border-rose-500 focus:ring-rose-500/20" 
                  : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
              }`}
            />
          </div>
          {errors.address && (
            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.address}</p>
          )}
        </div>

        {/* Password & Confirm Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                  errors.password 
                    ? "border-rose-500 focus:ring-rose-500/20" 
                    : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword 
                    ? "border-rose-500 focus:ring-rose-500/20" 
                    : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Account Role defaults to Admin, no dropdown needed */}

        {/* Terms and conditions */}
        <div>
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 h-4.5 w-4.5 rounded border-slate-300 text-tamil-maroon-800 focus:ring-tamil-maroon-700"
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">
              I agree to the Terms of Service and Privacy Policy, and certify that all contribution collections will follow regional regulations.
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.agreeToTerms}</p>
          )}
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
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-tamil-maroon-700 dark:text-tamil-gold-450 hover:underline">
          Log in instead
        </Link>
      </p>
    </div>
  );
};

export default Register;
