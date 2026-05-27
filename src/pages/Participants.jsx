import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Plus, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Printer, 
  ExternalLink,
  Users,
  Coins,
  MapPin,
  Phone,
  HelpCircle,
  X
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatTamilCurrency, formatDate, exportToCSV, generateReceiptNumber } from "../utils/helpers";

const Participants = () => {
  const { eventId } = useParams();
  const { events, participants, addParticipant, updateParticipant, deleteParticipant, addNotification, user } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, Online, Offline
  const [filterStatus, setFilterStatus] = useState("All"); // All, Paid, Pending
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
    amountGiven: "",
    paymentType: "Offline",
    paymentStatus: "Paid",
    notes: ""
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch current event
  const currentEvent = events.find(e => e.id === eventId);
  if (!currentEvent) {
    return (
      <div className="text-center py-12 text-black">
        <h2 className="text-lg font-bold">Event not found</h2>
        <Link to="/dashboard" className="text-tamil-maroon-700 underline mt-2 inline-block font-sans">Back to Dashboard</Link>
      </div>
    );
  }

  // Guard: Collaborator can only access assigned events
  if (user?.role !== "Admin" && currentEvent.assignedTo !== user?.email) {
    return (
      <div className="text-center py-12 space-y-4 bg-white p-8 rounded-3xl border border-slate-200 max-w-md mx-auto mt-10 text-black">
        <h2 className="text-xl font-bold text-rose-600 font-sans">Access Denied</h2>
        <p className="text-xs text-slate-655 font-medium">You are not authorized to view this event's participants.</p>
        <Link to="/dashboard" className="text-tamil-maroon-700 hover:underline text-xs font-bold block mt-2">Back to Dashboard</Link>
      </div>
    );
  }

  // Filter participants
  const eventParticipants = participants.filter(p => p.eventId === eventId);
  const filteredParticipants = eventParticipants.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobileNumber.includes(searchQuery) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "All" || p.paymentType === filterType;
    const matchesStatus = filterStatus === "All" || p.paymentStatus === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination calculations
  const totalItems = filteredParticipants.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedParticipants = filteredParticipants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Totals calculations
  const totalAmountCollected = eventParticipants
    .filter(p => p.paymentStatus === "Paid")
    .reduce((sum, p) => sum + p.amountGiven, 0);

  const pendingAmount = eventParticipants
    .filter(p => p.paymentStatus === "Pending")
    .reduce((sum, p) => sum + p.amountGiven, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Guest Name is required";
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Enter a valid 10-digit number";
    }
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.amountGiven || Number(formData.amountGiven) <= 0) {
      errors.amountGiven = "Enter a valid contribution amount";
    }
    return errors;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      eventId,
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      address: formData.address,
      amountGiven: Number(formData.amountGiven),
      paymentType: formData.paymentType,
      paymentStatus: formData.paymentStatus,
      notes: formData.notes,
      collectedBy: formData.paymentStatus === "Paid" ? (user?.fullName || "Admin") : "",
      transactionId: formData.paymentStatus === "Paid" 
        ? (formData.paymentType === "Online" ? "TXN" + Date.now().toString().substr(3) : generateReceiptNumber())
        : ""
    };

    addParticipant(payload);
    setShowAddForm(false);
    
    // Clear form
    setFormData({
      name: "",
      mobileNumber: "",
      address: "",
      amountGiven: "",
      paymentType: "Offline",
      paymentStatus: "Paid",
      notes: ""
    });
  };

  const handleToggleStatus = (p) => {
    if (p.paymentStatus === "Pending") {
      const receiptNo = p.paymentType === "Online" 
        ? "TXN" + Date.now().toString().substr(3) 
        : generateReceiptNumber();
      
      updateParticipant(p.id, {
        paymentStatus: "Paid",
        transactionId: receiptNo,
        collectedBy: user?.fullName || "Admin"
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this contribution record?")) {
      deleteParticipant(id);
    }
  };

  const handleExportCSV = () => {
    const exportData = eventParticipants.map((p, idx) => ({
      "S.No": idx + 1,
      "Guest Name": p.name,
      "Mobile Number": p.mobileNumber,
      "Address": p.address,
      "Amount Contributed (INR)": p.amountGiven,
      "Payment Mode": p.paymentType,
      "Status": p.paymentStatus,
      "Transaction ID / Receipt No": p.transactionId || "N/A",
      "Date Recorded": new Date(p.dateTime).toLocaleDateString("en-IN"),
      "Notes": p.notes || "None"
    }));
    exportToCSV(exportData, `Moi_Contributions_${currentEvent.name.replace(/\s+/g, '_')}.csv`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to={`/event/${currentEvent.id}`} 
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-450 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-black font-sans flex items-center gap-2">
              <span>Moi Registry</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">({currentEvent.name})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage participants, enroll contributions, and export reports.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-650 dark:text-slate-300 transition-colors shadow-sm"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            <span>Export CSV</span>
          </button>
          
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-tamil-gold-400 hover:bg-tamil-gold-300 text-black text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Plus size={16} />
            <span>Add Contribution</span>
          </button>
        </div>
      </div>

      {/* Grid: Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-tamil-maroon-50 dark:bg-tamil-maroon-950/20 text-tamil-maroon-700 dark:text-tamil-gold-400 rounded-xl">
            <Coins size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Successful Collections</span>
            <p className="text-lg font-black text-slate-850 dark:text-black mt-0.5">{formatTamilCurrency(totalAmountCollected)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-tamil-saffron-50 dark:bg-tamil-saffron-950/20 text-tamil-saffron-650 dark:text-tamil-saffron-400 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Pending Pledges</span>
            <p className="text-lg font-black text-slate-850 dark:text-black mt-0.5">{formatTamilCurrency(pendingAmount)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-tamil-green-50 dark:bg-tamil-green-950/20 text-tamil-green-700 dark:text-tamil-green-400 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Guests Enrolled</span>
            <p className="text-lg font-black text-slate-850 dark:text-black mt-0.5">{eventParticipants.length} Participants</p>
          </div>
        </div>
      </div>

      {/* Slide down form (Add Participant) */}
      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-850 dark:text-black flex items-center gap-2">
              <Plus size={18} className="text-tamil-maroon-700 dark:text-tamil-gold-400" />
              <span>Enroll New Guest Contribution</span>
            </h3>
            <button 
              onClick={() => setShowAddForm(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* Guest Name */}
              <div>
                <label className="text-xs font-bold text-slate-500">Guest Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. T. R. Senthil Kumar"
                  className={`w-full mt-1.5 px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                    formErrors.name ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {formErrors.name && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.name}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-bold text-slate-500">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full mt-1.5 px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                    formErrors.mobileNumber ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {formErrors.mobileNumber && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.mobileNumber}</p>}
              </div>

              {/* Contribution Amount */}
              <div>
                <label className="text-xs font-bold text-slate-500">Moi Amount Given (₹)</label>
                <input
                  type="number"
                  name="amountGiven"
                  value={formData.amountGiven}
                  onChange={handleInputChange}
                  placeholder="e.g. 5000"
                  className={`w-full mt-1.5 px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                    formErrors.amountGiven ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {formErrors.amountGiven && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.amountGiven}</p>}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500">Address / Native Village</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. West Mambalam, Chennai or Devakottai, Sivagangai"
                  className={`w-full mt-1.5 px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                    formErrors.address ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {formErrors.address && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.address}</p>}
              </div>

              {/* Payment Type */}
              <div>
                <label className="text-xs font-bold text-slate-500">Payment Type</label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleInputChange}
                  className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                >
                  <option value="Offline">Offline (Cash / Cheque)</option>
                  <option value="Online">Online (UPI / Card Simulator)</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <label className="text-xs font-bold text-slate-500">Payment Status</label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                >
                  <option value="Paid">Paid / Received</option>
                  <option value="Pending">Pending / Pledged</option>
                </select>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500">Registry Notes / Blessings</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Best wishes for marriage, traditional contribution"
                  className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                />
              </div>

            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-850">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 shadow-md"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search guests by name, village, or mobile..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-tamil-maroon-700/20 focus:border-tamil-maroon-700 text-xs font-semibold"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter size={14} />
            <span>Mode:</span>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="bg-transparent font-bold text-slate-750 dark:text-slate-200 focus:outline-none border-b border-dashed border-slate-350"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online Payments</option>
              <option value="Offline">Offline (Cash)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter size={14} />
            <span>Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="bg-transparent font-bold text-slate-750 dark:text-slate-200 focus:outline-none border-b border-dashed border-slate-350"
            >
              <option value="All">All Status</option>
              <option value="Paid">Received / Paid</option>
              <option value="Pending">Pending / Pledged</option>
            </select>
          </div>
        </div>

      </div>

      {/* Participants Table / List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <th className="px-6 py-4">Guest Info</th>
                <th className="px-6 py-4">Native Village</th>
                <th className="px-6 py-4">Amount Contributed</th>
                <th className="px-6 py-4">Status & Type</th>
                <th className="px-6 py-4">Receipt / Txn ID</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
              {paginatedParticipants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-semibold font-sans">
                    No matching contributions found in this registry.
                  </td>
                </tr>
              ) : (
                paginatedParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    
                    {/* Guest info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center">
                          {p.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-black leading-tight">{p.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Phone size={10} />
                            <span>{p.mobileNumber}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <MapPin size={12} className="shrink-0 text-slate-400" />
                        <span className="line-clamp-1">{p.address}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-black font-sans text-sm">
                        {formatTamilCurrency(p.amountGiven)}
                      </p>
                    </td>

                    {/* Status & Type */}
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5">
                        {p.paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-[9px] font-bold text-emerald-700 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-950">
                            <CheckCircle size={10} />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-[9px] font-bold text-amber-600 dark:text-amber-500 border border-amber-100 dark:border-amber-950">
                            <Clock size={10} />
                            <span>Pending</span>
                          </span>
                        )}
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-850 rounded border border-slate-200 dark:border-slate-800 text-slate-500">
                          {p.paymentType}
                        </span>
                      </div>
                    </td>

                    {/* Transaction or Receipt ID */}
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-450">
                      {p.transactionId ? (
                        <span>{p.transactionId}</span>
                      ) : (
                        <span className="italic">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {p.paymentStatus === "Pending" ? (
                          <>
                            {/* Complete cash button */}
                            <button
                              onClick={() => handleToggleStatus(p)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30 font-bold text-[10px] hover:bg-emerald-100 transition-colors"
                              title="Mark Paid Cash"
                            >
                              Collect Cash
                            </button>
                            {/* Simulated digital gateway link */}
                            <Link
                              to={`/event/${eventId}/payment?guestId=${p.id}&amount=${p.amountGiven}`}
                              className="px-2.5 py-1.5 rounded-lg bg-tamil-maroon-50 dark:bg-tamil-maroon-950/30 text-tamil-maroon-700 dark:text-tamil-gold-450 border border-tamil-maroon-100/50 dark:border-tamil-maroon-900/30 font-bold text-[10px] hover:bg-tamil-maroon-100 transition-colors flex items-center gap-1"
                            >
                              <span>Online Pay</span>
                              <ExternalLink size={10} />
                            </Link>
                          </>
                        ) : (
                          /* View Receipt printable page link */
                          <Link
                            to={`/receipt/${p.id}`}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-black transition-colors border border-slate-200 dark:border-slate-850 flex items-center gap-1 text-[10px] font-bold"
                          >
                            <Printer size={12} />
                            <span>Slip</span>
                          </Link>
                        )}
                        {user?.role === "Admin" && (
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 hover:text-rose-700 dark:hover:text-rose-455 transition-colors border border-slate-200 dark:border-slate-850"
                            title="Delete Contribution"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Actions footer */}
        <div className="bg-slate-50 dark:bg-slate-950 border-t border-slate-150 dark:border-slate-850 px-6 py-4 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="px-3.5 py-2 rounded-lg bg-slate-200/50 dark:bg-slate-850 text-slate-700 dark:text-slate-350 select-none">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Participants;
