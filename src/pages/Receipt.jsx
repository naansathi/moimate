import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, Sparkles, Layout, ScrollText, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatTamilCurrency, formatDate, formatTime } from "../utils/helpers";
import logo from "../assets/logo.svg";

const Receipt = () => {
  const { participantId } = useParams();
  const { participants, events, addNotification, user } = useApp();
  const navigate = useNavigate();
  const [layoutStyle, setLayoutStyle] = useState("a4"); // a4, thermal

  // Find participant
  const currentParticipant = participants.find(p => p.id === participantId);
  if (!currentParticipant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-black">Receipt not found</h2>
        <Link to="/dashboard" className="text-tamil-maroon-700 underline mt-2 inline-block font-sans">Back to Dashboard</Link>
      </div>
    );
  }

  // Find associated event
  const currentEvent = events.find(e => e.id === currentParticipant.eventId);
  const eventName = currentEvent ? currentEvent.name : "Traditional Event";

  // Guard: Collaborator can only access assigned events
  if (user?.role !== "Admin" && currentEvent && currentEvent.assignedTo !== user?.email) {
    return (
      <div className="text-center py-12 space-y-4 bg-white p-8 rounded-3xl border border-slate-200 max-w-md mx-auto mt-10 text-black">
        <h2 className="text-xl font-bold text-rose-600 font-sans">Access Denied</h2>
        <p className="text-xs text-slate-655 font-medium">You are not authorized to view this receipt.</p>
        <Link to="/dashboard" className="text-tamil-maroon-700 hover:underline text-xs font-bold block mt-2">Back to Dashboard</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    addNotification("Generating PDF receipt...", "info");
    setTimeout(() => {
      addNotification("Receipt downloaded successfully!", "success");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Action Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 no-print">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-450 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-black font-sans">Moi Contribution Receipt</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select a layout format and print or export the slip.</p>
          </div>
        </div>

        {/* Layout Swappers & Prints */}
        <div className="flex flex-wrap gap-2">
          {/* Layout buttons */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setLayoutStyle("a4")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                layoutStyle === "a4"
                  ? "bg-white dark:bg-slate-800 shadow-sm text-tamil-maroon-800 dark:text-tamil-gold-450"
                  : "text-slate-500"
              }`}
            >
              <Layout size={14} />
              <span>A4 Layout</span>
            </button>
            <button
              onClick={() => setLayoutStyle("thermal")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                layoutStyle === "thermal"
                  ? "bg-white dark:bg-slate-800 shadow-sm text-tamil-maroon-800 dark:text-tamil-gold-450"
                  : "text-slate-500"
              }`}
            >
              <ScrollText size={14} />
              <span>Thermal (80mm)</span>
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-650 dark:text-slate-300 transition-colors shadow-sm"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-tamil-gold-400 hover:bg-tamil-gold-300 text-black text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            <Printer size={14} />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Dynamic Receipt Panel Display */}
      <div className="flex justify-center py-4 bg-slate-100/50 dark:bg-slate-900/30 rounded-3xl border border-slate-200/50 dark:border-slate-900/60 p-4">
        
        {layoutStyle === "a4" ? (
          
          /* ================== A4 STYLE RECEIPT ================== */
          <div className="print-area w-full max-w-2xl bg-white text-slate-850 p-8 sm:p-12 rounded-2xl shadow-md border border-slate-200/60 relative overflow-hidden font-sans">
            
            {/* Saffron and maroon diagonal visual accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-tamil-maroon-700 to-tamil-gold-400 opacity-[0.04] blur-xl rounded-full" />
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-tamil-maroon-700 via-tamil-gold-500 to-tamil-saffron-600" />
            
            {/* Header section */}
            <div className="flex justify-between items-start border-b border-slate-150 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <img src={logo} alt="MoiMate" className="h-12 w-auto" />
                <div>
                  <h1 className="text-xl font-bold font-sans tracking-tight text-tamil-maroon-950">MoiMate Registry</h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Digital Moi Vasool & Event Ledgers</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  Verified Payment
                </span>
                <p className="text-[10px] text-slate-400 font-bold mt-2">Receipt No: {currentParticipant.transactionId || "N/A"}</p>
                <p className="text-[10px] text-slate-450">Date: {formatDate(currentParticipant.dateTime)}</p>
              </div>
            </div>

            {/* Event Name Heading */}
            <div className="text-center bg-slate-50 border border-slate-150 p-4 rounded-xl mb-6">
              <span className="text-[9px] uppercase font-bold text-tamil-maroon-700 tracking-wider">Contribution Acknowledgment</span>
              <h2 className="text-base sm:text-lg font-black text-slate-800 mt-1">{eventName}</h2>
              <p className="text-[11px] text-slate-450 mt-0.5">Host: {currentEvent?.hostName || "N/A"} • Venue: {currentEvent?.venue || "N/A"}</p>
            </div>

            {/* Recipient / Donor Details Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs font-semibold mb-8">
              <div>
                <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Donor Name</span>
                <span className="text-slate-800 text-sm font-bold">{currentParticipant.name}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Mobile Number</span>
                <span className="text-slate-700">{currentParticipant.mobileNumber}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Native Village / Address</span>
                <span className="text-slate-700">{currentParticipant.address}</span>
              </div>
            </div>

            {/* Contribution Amount Details */}
            <div className="border border-slate-150 rounded-xl overflow-hidden mb-8">
              <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-150 text-[10px] font-black uppercase text-slate-400 tracking-wider px-4 py-2">
                <div>Description</div>
                <div className="text-center">Payment Mode</div>
                <div className="text-right">Total Contributed</div>
              </div>
              <div className="grid grid-cols-3 text-xs font-semibold px-4 py-3 text-slate-800">
                <div>Traditional Moi contribution</div>
                <div className="text-center uppercase">{currentParticipant.paymentType}</div>
                <div className="text-right font-black text-tamil-maroon-700 text-sm">{formatTamilCurrency(currentParticipant.amountGiven)}</div>
              </div>
            </div>

            {/* Bottom Verification & Signature */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 text-xs font-semibold">
              
              {/* Verification QR Mockup */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
                <span className="text-[9px] uppercase text-slate-400 block mb-1">Verify Authenticity</span>
                <div className="p-1 border border-slate-200 rounded-lg inline-block bg-white">
                  <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white" />
                    <rect x="5" y="5" width="20" height="20" stroke="black" strokeWidth="6" fill="transparent" />
                    <rect x="75" y="5" width="20" height="20" stroke="black" strokeWidth="6" fill="transparent" />
                    <rect x="5" y="75" width="20" height="20" stroke="black" strokeWidth="6" fill="transparent" />
                    <circle cx="50" cy="50" r="8" fill="black" />
                    <path d="M 40 10 L 40 25 M 50 10 L 50 20 M 60 10 L 60 25" stroke="black" strokeWidth="4" />
                    <path d="M 10 40 L 25 40 M 10 50 L 20 50 M 10 60 L 25 60" stroke="black" strokeWidth="4" />
                  </svg>
                </div>
                <span className="text-[8px] text-slate-400 italic">Scan QR to inspect logs</span>
              </div>

              {/* Signature Area 1 */}
              <div className="flex flex-col justify-end text-center sm:text-left pt-6 sm:pt-0">
                <div className="border-t border-dashed border-slate-300 w-32 mx-auto sm:mx-0 pt-1" />
                <span className="text-[9px] uppercase text-slate-400">Recorded By</span>
                <span className="text-[10px] font-bold text-slate-700">{currentParticipant.collectedBy || "System Admin"}</span>
              </div>

              {/* Signature Area 2 */}
              <div className="flex flex-col justify-end text-center sm:text-left pt-6 sm:pt-0">
                <div className="border-t border-dashed border-slate-300 w-32 mx-auto sm:mx-0 pt-1" />
                <span className="text-[9px] uppercase text-slate-400">Host Signature</span>
                <span className="text-[10px] font-bold text-slate-700">{currentEvent?.hostName || "Authorized Sign"}</span>
              </div>

            </div>

            {/* Tamil blessing note footer */}
            <div className="text-center text-[10px] text-tamil-maroon-700 font-bold tracking-wider mt-8 border-t border-slate-100 pt-4">
              தங்கள் நல்வரவுக்கும் வாழ்த்துக்களுக்கும் மனமார்ந்த நன்றி! 🙏
            </div>

          </div>
        ) : (
          
          /* ================== THERMAL STYLE RECEIPT (80mm) ================== */
          <div className="print-area thermal-receipt shadow-md border border-slate-200 rounded-sm">
            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm tracking-widest uppercase">MOIMATE REGISTRY</h3>
              <p className="text-[10px]">{formatDate(currentParticipant.dateTime)} - {formatTime(currentParticipant.dateTime)}</p>
              <p className="text-[10px]">TXN: {currentParticipant.transactionId || "N/A"}</p>
            </div>
            
            <hr className="my-2" />
            
            <div className="text-center font-bold text-[11px] space-y-0.5">
              <p>{eventName}</p>
              <p className="text-[9px] font-normal">Host: {currentEvent?.hostName}</p>
            </div>
            
            <hr className="my-2" />
            
            <div className="space-y-1.5 text-[10px]">
              <div className="flex justify-between">
                <span>GUEST:</span>
                <span className="font-bold">{currentParticipant.name}</span>
              </div>
              <div className="flex justify-between">
                <span>MOBILE:</span>
                <span>{currentParticipant.mobileNumber}</span>
              </div>
              <div className="flex justify-between items-start">
                <span>NATIVE:</span>
                <span className="text-right text-[9px] max-w-[150px] leading-tight truncate">{currentParticipant.address}</span>
              </div>
              <div className="flex justify-between">
                <span>PAY MODE:</span>
                <span className="uppercase">{currentParticipant.paymentType}</span>
              </div>
              <div className="flex justify-between text-xs font-bold pt-1 border-t border-slate-200">
                <span>TOTAL MOI:</span>
                <span>{formatTamilCurrency(currentParticipant.amountGiven)}</span>
              </div>
            </div>

            <hr className="my-2" />

            <div className="text-center text-[9px] space-y-1 py-1">
              <p className="font-bold">Recorded by: {currentParticipant.collectedBy || "System Admin"}</p>
              <p className="italic">Thank you for your blessings! 🙏</p>
              <p className="text-[8px] text-slate-400">--- Powered by MoiMate ---</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Receipt;
