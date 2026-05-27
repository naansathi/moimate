import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Share2, 
  Trash2, 
  Edit3, 
  Users, 
  CreditCard,
  Copy,
  Check,
  Send,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatTamilCurrency, formatDate } from "../utils/helpers";

const EventDetails = () => {
  const { eventId } = useParams();
  const { events, participants, deleteEvent, updateEvent, addNotification, user } = useApp();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Find current event
  const currentEvent = events.find(e => e.id === eventId);
  if (!currentEvent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-black">Event not found</h2>
        <Link to="/dashboard" className="text-tamil-maroon-700 underline mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  // Guard: Collaborator can only access assigned events
  if (user?.role !== "Admin" && currentEvent.assignedTo !== user?.email) {
    return (
      <div className="text-center py-12 space-y-4 bg-white p-8 rounded-3xl border border-slate-200 max-w-md mx-auto mt-10 text-black">
        <h2 className="text-xl font-bold text-rose-600 font-sans">Access Denied</h2>
        <p className="text-xs text-slate-650 font-medium">You are not authorized to view this event's registry details.</p>
        <Link to="/dashboard" className="text-tamil-maroon-700 hover:underline text-xs font-bold block mt-2">Back to Dashboard</Link>
      </div>
    );
  }

  // Calculate statistics specific to this event
  const eventParticipants = participants.filter(p => p.eventId === eventId);
  const paidParticipants = eventParticipants.filter(p => p.paymentStatus === "Paid");
  
  const totalCollected = paidParticipants.reduce((sum, p) => sum + p.amountGiven, 0);
  const pendingCollection = eventParticipants.filter(p => p.paymentStatus === "Pending").reduce((sum, p) => sum + p.amountGiven, 0);
  
  const onlineCount = paidParticipants.filter(p => p.paymentType === "Online").length;
  const offlineCount = paidParticipants.filter(p => p.paymentType === "Offline").length;
  const completionPercentage = Math.min(100, Math.round((totalCollected / currentEvent.expectedAmount) * 100));

  // WhatsApp template variables
  const appUrl = window.location.origin;
  const paymentLink = `${appUrl}/event/${currentEvent.id}/payment`;
  const whatsappMessage = `வணக்கம்!
${currentEvent.hostName} invites you to the auspicious occasion of "${currentEvent.name}".

📅 Date: ${formatDate(currentEvent.eventDate)}
📍 Venue: ${currentEvent.venue}
✨ Notes: ${currentEvent.description || "Your presence and blessings are highly appreciated."}

For your convenience, contributions (Moi) can be registered digitally using our payment link below:
🔗 ${paymentLink}

We look forward to welcoming you!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    addNotification("Payment link copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(whatsappMessage);
    addNotification("WhatsApp invitation text copied", "success");
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${currentEvent.name}"? This will clear all guest registries for this function.`)) {
      deleteEvent(currentEvent.id);
      navigate("/dashboard");
    }
  };

  const startEdit = () => {
    setEditForm({ ...currentEvent });
    setIsEditing(true);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.hostName.trim() || !editForm.venue.trim() || !editForm.expectedAmount) {
      addNotification("Please fill in all required fields", "error");
      return;
    }
    updateEvent(currentEvent.id, {
      ...editForm,
      expectedAmount: Number(editForm.expectedAmount)
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Back button header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-450 transition-colors animate-pulse-slow"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-black font-sans flex items-center gap-2">
              <span>{currentEvent.name}</span>
              <span className="text-[10px] tracking-wider font-extrabold uppercase bg-tamil-maroon-50 dark:bg-tamil-maroon-900/30 text-tamil-maroon-800 dark:text-tamil-gold-450 px-2 py-0.5 rounded-full">
                {currentEvent.type}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Host: {currentEvent.hostName}</p>
          </div>
        </div>

        {user?.role === "Admin" && (
          <div className="flex gap-2">
            <button 
              onClick={startEdit}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-205 dark:border-slate-800 text-slate-600 dark:text-slate-350 transition-colors"
              title="Edit Event"
            >
              <Edit3 size={16} />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-455 transition-colors"
              title="Delete Event"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        /* Edit Form Drawer inline */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6">
          <form onSubmit={saveEdit} className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4">Edit Event Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-500">Event Title</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Host Name</label>
                <input
                  type="text"
                  value={editForm.hostName}
                  onChange={(e) => setEditForm({ ...editForm, hostName: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Target expected amount (₹)</label>
                <input
                  type="number"
                  value={editForm.expectedAmount}
                  onChange={(e) => setEditForm({ ...editForm, expectedAmount: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Event Date</label>
                <input
                  type="date"
                  value={editForm.eventDate}
                  onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Venue</label>
                <input
                  type="text"
                  value={editForm.venue}
                  onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-350"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Event Hero Image / Profile card */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Image Header card */}
            <div className="relative h-64 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
              <img 
                src={currentEvent.coverImage} 
                alt={currentEvent.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-black space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-tamil-maroon-950">
                  <Calendar size={14} />
                  <span>{formatDate(currentEvent.eventDate)}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold font-sans drop-shadow">{currentEvent.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-800">
                  <MapPin size={14} className="shrink-0" />
                  <span className="line-clamp-1">{currentEvent.venue}</span>
                </div>
              </div>
            </div>

            {/* Description / Invite card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Welcome Message & Function Details</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {currentEvent.description || "We warmly invite you, your family, and friends to attend our traditional function and grace the occasion with your blessings. Your participation remains our primary joy."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-tamil-maroon-50 text-tamil-maroon-800">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Main Host</span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{currentEvent.hostName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-tamil-gold-100/40 text-tamil-gold-700">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Date of Function</span>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{formatDate(currentEvent.eventDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Routing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to={`/event/${currentEvent.id}/participants`}
                className="p-6 bg-gradient-to-tr from-tamil-maroon-50 to-tamil-maroon-100 text-black border border-tamil-maroon-200/60 rounded-3xl hover:shadow-md transition-all flex flex-col justify-between group h-36"
              >
                <div className="flex justify-between items-center">
                  <Users size={24} className="text-tamil-maroon-850" />
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform text-tamil-maroon-850" />
                </div>
                <div>
                  <h4 className="font-bold text-base font-sans">View Guest Registry</h4>
                  <p className="text-xs text-slate-700 mt-1">Enroll participants and track individual contributions.</p>
                </div>
              </Link>

              <Link
                to={`/event/${currentEvent.id}/payment`}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl hover:shadow-md transition-all flex flex-col justify-between group h-36"
              >
                <div className="flex justify-between items-center">
                  <CreditCard size={24} className="text-tamil-saffron-550" />
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-800 dark:text-black font-sans">Simulate Payment</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Accept digital payments with UPI, QR, or Card mockups.</p>
                </div>
              </Link>
            </div>

          </div>

          {/* Collection Status Dashboard widget */}
          <div className="space-y-6">
            
            {/* Stat Summary Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-tamil-gold-500 opacity-5 blur-2xl rounded-full" />
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Moi Collection Status</h4>
              
              <div className="space-y-4">
                {/* Total collected */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Collected</span>
                  <p className="text-2xl font-black text-tamil-maroon-700 dark:text-tamil-gold-450 mt-1">
                    {formatTamilCurrency(totalCollected)}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-150 dark:border-slate-850">
                    <div 
                      className="bg-gradient-to-r from-tamil-maroon-700 to-tamil-gold-500 h-full rounded-full"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>{completionPercentage}% complete</span>
                    <span>Target: {formatTamilCurrency(currentEvent.expectedAmount)}</span>
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-850" />

                {/* Splits grid */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Total Donors</span>
                    <p className="text-sm font-bold text-slate-850 dark:text-black mt-0.5">{eventParticipants.length} Guests</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Pledged/Pending</span>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-500 mt-0.5">{formatTamilCurrency(pendingCollection)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Online Payments</span>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500 mt-0.5">{onlineCount} Transactions</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Offline (Cash)</span>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-350 mt-0.5">{offlineCount} Hand Receipts</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Sharing invitation panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 size={16} className="text-tamil-maroon-700 dark:text-tamil-gold-450" />
                <span>Invite Guests Digitally</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Invite friends and relatives dynamically. Guests can pay through the link and receive digital receipt slips.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-650 dark:text-slate-300 transition-colors shadow-sm"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copied ? "Link Copied" : "Copy Payment Link"}</span>
                </button>
                
                <button
                  onClick={handleCopyInvite}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-650 dark:text-slate-300 transition-colors shadow-sm"
                >
                  <Copy size={14} />
                  <span>Copy SMS/WhatsApp Template</span>
                </button>

                <button
                  onClick={handleOpenWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366]/20 border border-[#25D366] hover:bg-[#25D366]/30 text-black text-xs font-bold transition-colors shadow-sm"
                >
                  <Send size={14} />
                  <span>Share directly on WhatsApp</span>
                </button>
              </div>

              {/* Preview Box */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-3 rounded-2xl">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Template Preview</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-4 font-mono leading-tight whitespace-pre-line">
                  {whatsappMessage}
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default EventDetails;
