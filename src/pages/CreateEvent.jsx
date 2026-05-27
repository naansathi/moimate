import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, AlignLeft, DollarSign, User } from "lucide-react";
import { useApp } from "../context/AppContext";

const EVENT_TYPE_IMAGES = {
  Marriage: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=800",
  "Ear Piercing": "https://images.unsplash.com/photo-1544006714-e56340578505?auto=format&fit=crop&q=80&w=800",
  "House Warming": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
  Birthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
  "Temple Festival": "https://images.unsplash.com/photo-1561376374-8d8d21287c80?auto=format&fit=crop&q=80&w=800",
  Custom: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
};

const CreateEvent = () => {
  const { createEvent, user } = useApp();
  const navigate = useNavigate();

  if (user?.role !== "Admin") {
    return (
      <div className="text-center py-12 space-y-4 bg-white p-8 rounded-3xl border border-slate-200 max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold text-rose-600 font-sans">Access Denied</h2>
        <p className="text-xs text-slate-600 font-medium">Only Administrators are authorized to register new events.</p>
        <Link to="/dashboard" className="text-tamil-maroon-700 hover:underline text-xs font-bold block mt-2">Back to Dashboard</Link>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: "",
    type: "Marriage",
    hostName: "",
    eventDate: "",
    venue: "",
    description: "",
    expectedAmount: "",
    customType: "",
    coverImage: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Event Name is required";
    if (formData.type === "Custom" && !formData.customType.trim()) {
      newErrors.customType = "Custom Event Type is required";
    }
    if (!formData.hostName.trim()) newErrors.hostName = "Host Name is required";
    if (!formData.eventDate) newErrors.eventDate = "Event Date is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    if (!formData.expectedAmount || Number(formData.expectedAmount) <= 0) {
      newErrors.expectedAmount = "Enter a valid expected collection amount";
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

    // Determine final type and image link
    const finalType = formData.type === "Custom" ? formData.customType : formData.type;
    const coverImageLink = formData.coverImage.trim() 
      ? formData.coverImage 
      : (EVENT_TYPE_IMAGES[formData.type] || EVENT_TYPE_IMAGES.Custom);

    const eventPayload = {
      name: formData.name,
      type: finalType,
      hostName: formData.hostName,
      eventDate: formData.eventDate,
      venue: formData.venue,
      description: formData.description,
      expectedAmount: Number(formData.expectedAmount),
      coverImage: coverImageLink
    };

    const newEventId = createEvent(eventPayload);
    navigate(`/event/${newEventId}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header back button */}
      <div className="flex items-center gap-4">
        <Link 
          to="/dashboard" 
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-450 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-black font-sans">Create Event Registry</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Register a new function to begin Moi collection.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Event Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Event Name / Function Title
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Anbarasan & Kavitha Thirumana Vizha"
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                  errors.name 
                    ? "border-rose-500 focus:ring-rose-500/20" 
                    : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.name}</p>
              )}
            </div>

            {/* Event Type select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Event Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <option value="Marriage">Marriage (திருமணம்)</option>
                <option value="Ear Piercing">Ear Piercing (காதுகுத்து)</option>
                <option value="House Warming">House Warming (புதுமனை புகுவிழா)</option>
                <option value="Birthday">Birthday (பிறந்தநாள்)</option>
                <option value="Temple Festival">Temple Festival (கோவில் திருவிழா)</option>
                <option value="Custom">Custom / Other</option>
              </select>
            </div>

            {/* Custom Type (Conditional) */}
            {formData.type === "Custom" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Specify Event Type
                </label>
                <input
                  type="text"
                  name="customType"
                  value={formData.customType}
                  onChange={handleChange}
                  placeholder="e.g. Puberty Ceremony (மஞ்சள் நீராட்டு விழா)"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                    errors.customType 
                      ? "border-rose-500 focus:ring-rose-500/20" 
                      : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20"
                  }`}
                />
                {errors.customType && (
                  <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.customType}</p>
                )}
              </div>
            )}

            {/* Host Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Host / Organizer Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="hostName"
                  value={formData.hostName}
                  onChange={handleChange}
                  placeholder="e.g. M. Soundararajan"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                    errors.hostName 
                      ? "border-rose-500 focus:ring-rose-500/20" 
                      : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 dark:focus:border-tamil-gold-500"
                  }`}
                />
              </div>
              {errors.hostName && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.hostName}</p>
              )}
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Event Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Calendar size={18} />
                </span>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                    errors.eventDate 
                      ? "border-rose-500 focus:ring-rose-500/20" 
                      : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750"
                  }`}
                />
              </div>
              {errors.eventDate && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.eventDate}</p>
              )}
            </div>

            {/* Venue */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Venue Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <MapPin size={18} />
                </span>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g. Sri Raja Rajeshwari Mandapam, Chennai"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                    errors.venue 
                      ? "border-rose-500 focus:ring-rose-500/20" 
                      : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750"
                  }`}
                />
              </div>
              {errors.venue && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.venue}</p>
              )}
            </div>

            {/* Expected Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Expected Collection Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <DollarSign size={18} />
                </span>
                <input
                  type="number"
                  name="expectedAmount"
                  value={formData.expectedAmount}
                  onChange={handleChange}
                  placeholder="e.g. 500000"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 transition-all ${
                    errors.expectedAmount 
                      ? "border-rose-500 focus:ring-rose-500/20" 
                      : "border-slate-200 dark:border-slate-800 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750"
                  }`}
                />
              </div>
              {errors.expectedAmount && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.expectedAmount}</p>
              )}
            </div>

            {/* Cover Image Upload (Optional URL) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Cover Image URL (Optional)
              </label>
              <input
                type="text"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="Leave blank to use an elegant preset image"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Description / Welcome Invitation Notes
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 pt-2.5 flex items-start text-slate-400">
                  <AlignLeft size={18} />
                </span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Welcome message to show on payment screen. e.g. Welcome to the wedding function of..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-750 resize-none"
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-sm font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 shadow-md focus:outline-none active:scale-[0.99] transition-all"
          >
            Create Event & Initialize Registry
          </button>
        </form>
      </div>

    </div>
  );
};

export default CreateEvent;
