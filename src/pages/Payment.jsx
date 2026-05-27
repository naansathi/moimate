import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  Wallet, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Loader
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatTamilCurrency, generateTransactionId } from "../utils/helpers";

const Payment = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { events, participants, addParticipant, updateParticipant, addNotification, user } = useApp();

  const prefilledGuestId = searchParams.get("guestId");
  const prefilledAmount = searchParams.get("amount");

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
        <p className="text-xs text-slate-655 font-medium">You are not authorized to process payment for this event.</p>
        <Link to="/dashboard" className="text-tamil-maroon-700 hover:underline text-xs font-bold block mt-2">Back to Dashboard</Link>
      </div>
    );
  }

  // Payment UI states
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi, card
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnId, setTxnId] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
    amountGiven: prefilledAmount || "",
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardHolder: ""
  });

  const [errors, setErrors] = useState({});

  // Fetch guest data if prefilled
  useEffect(() => {
    if (prefilledGuestId) {
      const guest = participants.find(p => p.id === prefilledGuestId);
      if (guest) {
        setFormData(prev => ({
          ...prev,
          name: guest.name,
          mobileNumber: guest.mobileNumber,
          address: guest.address,
          amountGiven: guest.amountGiven
        }));
      }
    }
  }, [prefilledGuestId, participants]);

  if (!currentEvent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold">Event not found</h2>
        <Link to="/dashboard" className="text-tamil-maroon-700 underline mt-2 inline-block font-sans">Back to Dashboard</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Format card input
    if (name === "cardNumber") {
      const formatted = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().substring(0, 19);
      setFormData(prev => ({ ...prev, cardNumber: formatted }));
    } else if (name === "cardExpiry") {
      const formatted = value.replace(/\D/g, "").replace(/(.{2})/, "$1/").trim().substring(0, 5);
      setFormData(prev => ({ ...prev, cardExpiry: formatted }));
    } else if (name === "cardCvv") {
      const formatted = value.replace(/\D/g, "").substring(0, 3);
      setFormData(prev => ({ ...prev, cardCvv: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full Name is required";
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = "Mobile is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errs.mobileNumber = "Enter 10-digit number";
    }
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.amountGiven || Number(formData.amountGiven) <= 0) {
      errs.amountGiven = "Enter valid contribution amount";
    }

    if (paymentMethod === "upi") {
      if (!formData.upiId.trim() && !prefilledGuestId) {
        // If they pay by QR scan directly, we don't strictly enforce upiId input
      } else if (formData.upiId.trim() && !/\S+@\S+/.test(formData.upiId)) {
        errs.upiId = "Enter a valid UPI handle (e.g. name@upi)";
      }
    } else if (paymentMethod === "card") {
      if (!formData.cardNumber || formData.cardNumber.length < 19) errs.cardNumber = "Enter valid 16-digit card number";
      if (!formData.cardExpiry || formData.cardExpiry.length < 5) errs.cardExpiry = "Expiry required (MM/YY)";
      if (!formData.cardCvv || formData.cardCvv.length < 3) errs.cardCvv = "CVV required";
      if (!formData.cardHolder.trim()) errs.cardHolder = "Card holder name required";
    }

    return errs;
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setLoading(true);
    // Simulate transaction latency
    setTimeout(() => {
      setLoading(false);
      const generatedId = generateTransactionId();
      setTxnId(generatedId);
      
      // Save data locally
      if (prefilledGuestId) {
        // Update existing participant state
        updateParticipant(prefilledGuestId, {
          paymentStatus: "Paid",
          paymentType: "Online",
          transactionId: generatedId,
          collectedBy: "Online Gateway",
          dateTime: new Date().toISOString()
        });
      } else {
        // Enroll new participant
        addParticipant({
          eventId,
          name: formData.name,
          mobileNumber: formData.mobileNumber,
          address: formData.address,
          amountGiven: Number(formData.amountGiven),
          paymentType: "Online",
          paymentStatus: "Paid",
          transactionId: generatedId,
          collectedBy: "Online Gateway",
          notes: "Digital online contribution"
        });
      }
      
      setSuccess(true);
      addNotification("Payment transaction completed successfully!", "success");
    }, 2000);
  };

  // Find newly added guest id to navigate to their receipt
  const handleRedirectToReceipt = () => {
    // Look up participant
    const matches = participants.filter(p => p.eventId === eventId && p.name === formData.name);
    const guestObj = matches[0];
    if (guestObj) {
      navigate(`/receipt/${guestObj.id}`);
    } else {
      navigate(`/event/${eventId}/participants`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Back button and page details */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-450 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-black font-sans">Simulated Payment Checkout</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentEvent.name}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div 
            key="payment-gateway-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >
            
            {/* Payment Details Form */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Contributor Registry Details</h3>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                
                {/* Guest name */}
                <div>
                  <label className="text-xs font-bold text-slate-500">Your Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!!prefilledGuestId}
                    placeholder="Senthil Nathan"
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 disabled:opacity-75 ${
                      errors.name ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-200 dark:border-slate-800"
                    }`}
                  />
                  {errors.name && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.name}</p>}
                </div>

                {/* Mobile & Amount Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      disabled={!!prefilledGuestId}
                      placeholder="9876543210"
                      className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                        errors.mobileNumber ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                      }`}
                    />
                    {errors.mobileNumber && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.mobileNumber}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500">Contribution Amount (₹)</label>
                    <input
                      type="number"
                      name="amountGiven"
                      value={formData.amountGiven}
                      onChange={handleInputChange}
                      disabled={!!prefilledGuestId}
                      placeholder="5000"
                      className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                        errors.amountGiven ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                      }`}
                    />
                    {errors.amountGiven && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.amountGiven}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-xs font-bold text-slate-500">Address / City</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!!prefilledGuestId}
                    placeholder="Mylapore, Chennai"
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                      errors.address ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                    }`}
                  />
                  {errors.address && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.address}</p>}
                </div>

                <hr className="border-slate-100 dark:border-slate-850 my-6" />

                {/* Payment Methods Choice */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 block">Select Digital Payment Option</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${
                        paymentMethod === "upi"
                          ? "bg-tamil-maroon-50 border-tamil-maroon-700/50 text-tamil-maroon-900 dark:bg-tamil-maroon-950/20 dark:text-tamil-gold-400"
                          : "border-slate-250 dark:border-slate-800 text-slate-500"
                      }`}
                    >
                      <QrCode size={16} />
                      <span>UPI / QR Scan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${
                        paymentMethod === "card"
                          ? "bg-tamil-maroon-50 border-tamil-maroon-700/50 text-tamil-maroon-900 dark:bg-tamil-maroon-950/20 dark:text-tamil-gold-400"
                          : "border-slate-250 dark:border-slate-800 text-slate-500"
                      }`}
                    >
                      <CreditCard size={16} />
                      <span>Debit/Credit Card</span>
                    </button>
                  </div>
                </div>

                {/* Payment Form (UPI Conditional) */}
                {paymentMethod === "upi" ? (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-500">UPI Address (Optional)</label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        placeholder="e.g. name@okhdfcbank"
                        className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                          errors.upiId ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                        }`}
                      />
                      {errors.upiId && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.upiId}</p>}
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 text-[11px] text-slate-500 rounded-xl flex items-start gap-2 border border-slate-100 dark:border-slate-850">
                      <Wallet size={16} className="text-slate-400 shrink-0 mt-0.5" />
                      <p>Scan the QR Code on the right side using Google Pay, PhonePe, Paytm or any UPI app to complete the simulation.</p>
                    </div>
                  </div>
                ) : (
                  /* Payment Form (CARD Conditional) */
                  <div className="space-y-4 pt-2">
                    
                    {/* Card Number */}
                    <div>
                      <label className="text-xs font-bold text-slate-500">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="4111 2222 3333 4444"
                        className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                          errors.cardNumber ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                        }`}
                      />
                      {errors.cardNumber && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.cardNumber}</p>}
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500">Expiry Date</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                            errors.cardExpiry ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                          }`}
                        />
                        {errors.cardExpiry && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500">CVV</label>
                        <input
                          type="password"
                          name="cardCvv"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          placeholder="•••"
                          className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                            errors.cardCvv ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                          }`}
                        />
                        {errors.cardCvv && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.cardCvv}</p>}
                      </div>
                    </div>

                    {/* Holder Name */}
                    <div>
                      <label className="text-xs font-bold text-slate-500">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        placeholder="NAME SURNAME"
                        className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none ${
                          errors.cardHolder ? "border-rose-500" : "border-slate-200 dark:border-slate-800"
                        }`}
                      />
                      {errors.cardHolder && <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.cardHolder}</p>}
                    </div>

                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 shadow-md focus:outline-none disabled:opacity-50 transition-all hover:scale-[1.01] pt-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="animate-spin" size={18} />
                      <span>Authorizing Sandbox Gateway...</span>
                    </span>
                  ) : (
                    <span>Contribute {formData.amountGiven ? formatTamilCurrency(Number(formData.amountGiven)) : ""} Digitally</span>
                  )}
                </button>
              </form>

            </div>

            {/* Sandbox details side panel */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Event card details */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 text-xs font-semibold">
                <h4 className="text-xs font-bold uppercase text-slate-455 tracking-wider">Checkout Summary</h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-1.5">
                  <p className="font-bold text-slate-800 dark:text-black line-clamp-1">{currentEvent.name}</p>
                  <p className="text-[10px] text-slate-400">Host: {currentEvent.hostName}</p>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2">
                  <span className="text-slate-550">Moi Contribution</span>
                  <span className="text-tamil-maroon-800 dark:text-black">
                    {formData.amountGiven ? formatTamilCurrency(Number(formData.amountGiven)) : "₹0"}
                  </span>
                </div>
              </div>

              {/* Dynamic QR Code mockup or Credit card visualizer */}
              {paymentMethod === "upi" ? (
                /* QR Scanner UI representation */
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Simulated BHIM UPI QR</span>
                  
                  {/* Decorative QR code container */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-150 shadow-sm relative group">
                    <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" fill="white" />
                      {/* Outer corner squares */}
                      <rect x="5" y="5" width="25" height="25" stroke="black" strokeWidth="6" fill="transparent" />
                      <rect x="10" y="10" width="15" height="15" fill="black" />
                      
                      <rect x="70" y="5" width="25" height="25" stroke="black" strokeWidth="6" fill="transparent" />
                      <rect x="75" y="10" width="15" height="15" fill="black" />
                      
                      <rect x="5" y="70" width="25" height="25" stroke="black" strokeWidth="6" fill="transparent" />
                      <rect x="10" y="75" width="15" height="15" fill="black" />
                      
                      {/* Center Logo representation */}
                      <circle cx="50" cy="50" r="10" fill="#800020" />
                      <path d="M47 50 L53 50 M50 47 L50 53" stroke="white" strokeWidth="2.5" />

                      {/* Mock QR details lines */}
                      <path d="M 40 10 L 40 30 M 50 10 L 50 25 M 60 10 L 60 30" stroke="black" strokeWidth="4" strokeDasharray="3,3" />
                      <path d="M 10 40 L 30 40 M 10 50 L 25 50 M 10 60 L 30 60" stroke="black" strokeWidth="4" strokeDasharray="4,2" />
                      
                      <path d="M 40 70 L 40 90 M 50 70 L 50 85 M 60 70 L 60 90" stroke="black" strokeWidth="4" strokeDasharray="2,2" />
                      <path d="M 70 40 L 90 40 M 75 50 L 90 50 M 70 60 L 90 60" stroke="black" strokeWidth="4" strokeDasharray="3,1" strokeDashoffset="2" />
                      
                      <path d="M 40 40 L 43 45 L 40 48 L 47 43 Z" fill="black" />
                      <path d="M 60 40 L 58 45 L 62 48 L 57 43 Z" fill="black" />
                    </svg>
                    {/* Corner golden sparkles */}
                    <div className="absolute top-2 right-2 p-1 bg-tamil-gold-400 rounded-lg text-black pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles size={12} />
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    <p className="font-bold text-slate-700 dark:text-slate-300">UPI ID: pay@moimate</p>
                    <p className="italic">Scan code above with any UPI App to auto-populate amount</p>
                  </div>
                </div>
              ) : (
                /* Card visualizer mockup */
                <div className="perspective bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col items-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-4">Sandbox Credit Card View</span>
                  
                  <div className="w-full h-40 bg-gradient-to-tr from-slate-100 to-slate-200 text-black p-5 rounded-2xl shadow-md relative flex flex-col justify-between overflow-hidden border border-slate-300">
                    {/* Ring background patterns */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full -mr-8 -mt-8" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-8 -mb-8" />
                    
                    {/* Top line card logo */}
                    <div className="flex justify-between items-start z-10">
                      <span className="text-xs uppercase font-extrabold tracking-widest text-tamil-maroon-850">MoiMate PAY</span>
                      <CreditCard size={28} className="text-black/60" />
                    </div>

                    {/* Card number display */}
                    <div className="text-sm sm:text-base font-mono tracking-widest text-black/90 z-10 py-1.5">
                      {formData.cardNumber || "•••• •••• •••• ••••"}
                    </div>

                    {/* Card Holder & Expiry display */}
                    <div className="flex justify-between items-end z-10 text-[10px] uppercase">
                      <div>
                        <span className="text-black/45 block">Card Holder</span>
                        <span className="font-bold truncate max-w-[130px] block">{formData.cardHolder || "NAME SURNAME"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-black/45 block">Expires</span>
                        <span className="font-bold">{formData.cardExpiry || "MM/YY"}</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Secure sandbox warning info */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-3xl flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-550 shrink-0 mt-0.5 animate-pulse-slow" />
                <div className="text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                  <p className="font-bold">Sandbox Environment</p>
                  <p>All checkout procedures here are simulated. No actual financial debiting or credit transactions will take place.</p>
                </div>
              </div>

            </div>

          </motion.div>
        ) : (
          /* Full screen checkout Success checkmark Animation */
          <motion.div 
            key="payment-success-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-6 shadow-lg relative overflow-hidden"
          >
            {/* Elegant cultural success backdrop glow */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
            
            <div className="flex justify-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { type: "spring", stiffness: 120, delay: 0.2 } }}
                className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shadow-inner"
              >
                <CheckCircle2 size={36} />
              </motion.div>
            </div>

            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-455 uppercase tracking-wider">
                Transaction Success
              </span>
              <h3 className="text-xl font-bold text-slate-850 dark:text-black font-sans mt-2">Moi Contributed Successfully!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Thank you for your warm contribution. The registry has recorded this transaction, and the event ledger is updated in real-time.
              </p>
            </div>

            {/* Receipt Summary Grid */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl text-xs font-semibold space-y-3 text-left">
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-850">
                <span className="text-slate-450">Donor Name</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold">{formData.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-850">
                <span className="text-slate-450">Amount Paid</span>
                <span className="text-tamil-maroon-800 dark:text-tamil-gold-450 font-black">{formatTamilCurrency(Number(formData.amountGiven))}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-850">
                <span className="text-slate-450">Transaction ID</span>
                <span className="font-mono text-slate-700 dark:text-slate-350">{txnId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-450">Date & Time</span>
                <span className="text-slate-700 dark:text-slate-300">{new Date().toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleRedirectToReceipt}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 shadow-md"
              >
                <span>View Receipt Slip</span>
                <ArrowRight size={14} />
              </button>
              <Link
                to={`/event/${eventId}/participants`}
                className="w-full inline-flex justify-center items-center py-3 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-550 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
              >
                <span>Back to Registry</span>
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Payment;
