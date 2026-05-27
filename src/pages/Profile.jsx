import React, { useState } from "react";
import { User, Phone, Mail, Home, Award, Calendar, Coins } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatTamilCurrency } from "../utils/helpers";

const Profile = () => {
  const { user, updateUserProfile, events, participants } = useApp();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    address: user?.address || ""
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errs.mobileNumber = "Enter a valid 10-digit number";
    }
    if (!formData.address.trim()) errs.address = "Address is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }
    updateUserProfile(formData);
  };

  // Lifetime metrics calculations
  const totalHosted = events.length;
  const lifetimeCollection = participants
    .filter(p => p.paymentStatus === "Paid")
    .reduce((sum, p) => sum + p.amountGiven, 0);

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-black font-sans">User Account Profile</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your credentials and view platform statistics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Avatar and stats */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl text-center space-y-6 shadow-sm">
          <div className="flex flex-col items-center">
            {/* Visual avatar circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-tamil-gold-200 to-tamil-saffron-100 border border-tamil-saffron-300 text-black font-bold text-3xl flex items-center justify-center shadow-md relative group">
              {user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "A"}
              <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold pointer-events-none">
                Edit
              </div>
            </div>
            
            <h3 className="font-extrabold text-base text-slate-850 dark:text-black mt-4">{user?.fullName}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">{user?.role || "User"}</p>
          </div>

          <hr className="border-slate-100 dark:border-slate-850" />

          {/* User performance stats */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
              <Calendar size={18} className="text-tamil-maroon-700 dark:text-tamil-gold-450 mx-auto mb-1.5" />
              <span className="text-[9px] uppercase text-slate-400 block">Functions Hosted</span>
              <span className="font-bold text-slate-750 dark:text-slate-200 mt-0.5 inline-block">{totalHosted} Events</span>
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
              <Coins size={18} className="text-tamil-green-700 dark:text-tamil-green-455 mx-auto mb-1.5" />
              <span className="text-[9px] uppercase text-slate-400 block">Total Collection</span>
              <span className="font-bold text-slate-750 dark:text-slate-200 mt-0.5 inline-block truncate max-w-full">
                {formatTamilCurrency(lifetimeCollection)}
              </span>
            </div>
          </div>

          {/* Secure badge */}
          <div className="p-3 bg-tamil-maroon-50/50 dark:bg-tamil-maroon-950/10 border border-tamil-maroon-100/50 dark:border-tamil-maroon-900/20 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-tamil-maroon-800 dark:text-tamil-gold-450">
            <Award size={16} />
            <span>MoiMate Verified Account</span>
          </div>

        </div>

        {/* Right Side: Modify details form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-6">Modify Profile Credentials</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-500">Full Name</label>
              <div className="relative mt-1.5">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                    errors.fullName ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.fullName}</p>}
            </div>

            {/* Mobile & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500">Mobile Number</label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                      errors.mobileNumber ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                    }`}
                  />
                </div>
                {errors.mobileNumber && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.mobileNumber}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">Email Address</label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                      errors.email ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.email}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-bold text-slate-500">Physical Address</label>
              <div className="relative mt-1.5">
                <span className="absolute inset-y-0 left-0 pl-3.5 pt-3 flex items-start text-slate-400">
                  <Home size={16} />
                </span>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none resize-none ${
                    errors.address ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                  }`}
                />
              </div>
              {errors.address && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.address}</p>}
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-xs font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 shadow-md transition-all active:scale-[0.99]"
              >
                Save Profile Updates
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};

export default Profile;
