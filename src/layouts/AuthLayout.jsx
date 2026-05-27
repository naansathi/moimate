import React from "react";
import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logo.svg";

const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 kolam-bg bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-tamil-maroon-700 via-tamil-gold-500 to-tamil-saffron-600" />
      
      {/* Back button floating */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400 transition-colors px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <img className="h-14 w-auto drop-shadow-md group-hover:scale-105 transition-transform" src={logo} alt="MoiMate Logo" />
          <div className="flex flex-col">
            <span className="font-sans text-3xl font-extrabold tracking-tight bg-gradient-to-r from-tamil-maroon-800 to-tamil-saffron-600 dark:from-tamil-gold-300 dark:to-tamil-saffron-400 bg-clip-text text-black">
              MoiMate
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-tamil-maroon-600 dark:text-tamil-gold-500">
              Moi Collection System
            </span>
          </div>
        </Link>
        
        {/* Tamil Welcome Text */}
        <h2 className="mt-6 text-center text-xl font-bold tracking-tight text-tamil-maroon-800 dark:text-tamil-gold-400 font-sans">
          அன்புடன் வரவேற்கிறோம்!
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400 max-w-xs">
          Manage traditional contributions and event collections digitally with ease.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-8 px-6 shadow-glass dark:shadow-glass-dark border border-slate-200/50 dark:border-slate-800/80 sm:rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
