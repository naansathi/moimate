import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4 font-sans">
      <div className="p-4 bg-tamil-maroon-50 dark:bg-tamil-maroon-950/20 text-tamil-maroon-700 dark:text-tamil-gold-400 rounded-full animate-bounce">
        <HelpCircle size={48} />
      </div>
      <h2 className="text-2xl font-black text-slate-800 dark:text-black">404 - Page Not Found</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
        The registry folder or directory module you are trying to visit does not exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-1.5 text-xs font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 px-5 py-3 rounded-xl shadow-md transition-all active:scale-95"
      >
        <ArrowLeft size={14} />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
