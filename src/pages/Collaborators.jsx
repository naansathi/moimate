import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Calendar, 
  CheckSquare, 
  PlusCircle, 
  ArrowLeft,
  UserCheck
} from "lucide-react";
import { useApp } from "../context/AppContext";

const Collaborators = () => {
  const { 
    user, 
    events, 
    registeredUsers, 
    createCollaboratorByAdmin, 
    assignEventToCollaborator,
    addNotification 
  } = useApp();

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    address: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Guard: Admins only
  if (user?.role !== "Admin") {
    return (
      <div className="text-center py-12 space-y-4 bg-white p-8 rounded-3xl border border-slate-200 max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold text-rose-600 font-sans">Access Denied</h2>
        <p className="text-xs text-slate-650 font-medium">Only Administrators are authorized to manage collaborator settings.</p>
        <Link to="/dashboard" className="text-tamil-maroon-700 hover:underline text-xs font-bold block mt-2">Back to Dashboard</Link>
      </div>
    );
  }

  const collaborators = registeredUsers.filter(u => u.role === "Collaborator");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
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
    if (!formData.address.trim()) newErrors.address = "Address is required";
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
      const result = createCollaboratorByAdmin(formData);
      setLoading(false);
      if (result.success) {
        setFormData({
          fullName: "",
          mobileNumber: "",
          email: "",
          password: "",
          address: ""
        });
      } else {
        setErrors({ general: result.message });
      }
    }, 600);
  };

  // Helper to count events assigned to a collaborator
  const getAssignedEventsCount = (email) => {
    return events.filter(e => e.assignedTo === email).length;
  };

  return (
    <div className="space-y-8 animate-fade-in text-black">
      
      {/* Header back button */}
      <div className="flex items-center gap-4">
        <Link 
          to="/dashboard" 
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-tamil-maroon-700 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-xl font-bold font-sans">Collaborator Portal</h2>
          <p className="text-xs text-slate-500 mt-0.5">Register staff and delegate access privileges to specific Moi events.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Create Collaborator Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 h-fit space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserPlus className="text-tamil-maroon-700" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Create Collaborator</h3>
          </div>

          {errors.general && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 rounded-xl">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Senthil Kumar"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 text-black font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 ${
                  errors.fullName ? "border-rose-500" : "border-slate-200"
                }`}
              />
              {errors.fullName && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="9876543211"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 text-black font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 ${
                    errors.mobileNumber ? "border-rose-500" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.mobileNumber && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.mobileNumber}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="collab@moimate.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 text-black font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 ${
                    errors.email ? "border-rose-500" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 text-black font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 ${
                    errors.password ? "border-rose-500" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 pt-2.5 flex items-start text-slate-400">
                  <MapPin size={16} />
                </span>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g. T. Nagar, Chennai"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 text-black font-semibold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 ${
                    errors.address ? "border-rose-500" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.address && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.address}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 transition-all flex justify-center items-center shadow-md active:scale-[0.99]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                "Register Collaborator"
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Directory & Assign Events */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Collaborators Directory */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="text-tamil-maroon-700" size={20} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Collaborators Directory</h3>
            </div>

            {collaborators.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No collaborator accounts registered yet. Use the registration form to create one.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {collaborators.map(collab => (
                  <div key={collab.email} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-slate-900">{collab.fullName}</h4>
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-tamil-maroon-50 text-tamil-maroon-900">
                          {getAssignedEventsCount(collab.email)} Events
                        </span>
                      </div>
                      <div className="space-y-1 pt-1">
                        <p className="text-xs text-slate-655 flex items-center gap-2 truncate">
                          <Mail size={12} className="text-slate-400 shrink-0" />
                          <span>{collab.email}</span>
                        </p>
                        <p className="text-xs text-slate-655 flex items-center gap-2">
                          <Phone size={12} className="text-slate-400 shrink-0" />
                          <span>{collab.mobileNumber}</span>
                        </p>
                        <p className="text-xs text-slate-655 flex items-center gap-2 line-clamp-1">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span>{collab.address}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Assign Events */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="text-tamil-maroon-700" size={20} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Moi Event Assignments</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Below is a list of all hosted events. You can assign each event to a registered collaborator. The assigned collaborator will only see that specific event inside their dashboard.
            </p>

            <div className="space-y-3 pt-2">
              {events.map(evt => {
                const assignedCollab = collaborators.find(c => c.email === evt.assignedTo);
                
                return (
                  <div key={evt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-extrabold bg-tamil-maroon-50 text-tamil-maroon-900 px-2 py-0.5 rounded-full shrink-0">
                        {evt.type}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">{evt.name}</h4>
                      <p className="text-[10px] text-slate-500">Date: {evt.eventDate} • Venue: {evt.venue}</p>
                    </div>

                    <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Assign To:</span>
                      <select
                        value={evt.assignedTo || ""}
                        onChange={(e) => assignEventToCollaborator(evt.id, e.target.value)}
                        className="px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-tamil-maroon-700/30"
                      >
                        <option value="">Unassigned (Admin Only)</option>
                        {collaborators.map(c => (
                          <option key={c.email} value={c.email}>
                            {c.fullName} ({c.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Collaborators;
