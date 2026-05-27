import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/logo.svg";

const MainLayout = () => {
  const { user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* Decorative Top Line */}
      <div className="h-1 bg-gradient-to-r from-tamil-maroon-700 via-tamil-gold-500 to-tamil-saffron-600 w-full" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img className="h-10 w-auto" src={logo} alt="MoiMate Logo" />
              <div className="flex flex-col">
                <span className="font-sans text-xl font-bold tracking-tight bg-gradient-to-r from-tamil-maroon-800 to-tamil-saffron-600 dark:from-tamil-gold-300 dark:to-tamil-saffron-400 bg-clip-text text-black">
                  MoiMate
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-tamil-maroon-600 dark:text-tamil-gold-500">
                  Moi Management
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 text-sm font-semibold">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400 transition-colors">How It Works</a>
              <a href="#about" className="text-slate-600 dark:text-slate-300 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400 transition-colors">About</a>
            </nav>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center space-x-4">

              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 rounded-xl shadow-md transition-all hover:scale-[1.02]"
                  >
                    <span>Dashboard</span>
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={logout}
                    className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 rounded-xl shadow-md transition-all hover:scale-[1.02]"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400"
            >
              How It Works
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400"
            >
              About
            </a>
            <hr className="border-slate-200 dark:border-slate-800 my-2" />
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-1.5 px-4 py-2.5 text-base font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 rounded-xl"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-center px-4 py-2 text-base font-medium text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-tamil-gold-400 hover:bg-tamil-gold-300 text-sm font-bold text-black"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer id="about" className="bg-slate-100 text-slate-700 py-12 transition-colors border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-3">
                <img className="h-10 w-auto" src={logo} alt="MoiMate Logo" />
                <span className="font-sans text-xl font-bold tracking-tight text-black">
                  MoiMate
                </span>
              </div>
              <p className="text-sm max-w-sm text-slate-400">
                A digital registry and collection platform designed to modernize Moi contributions in Tamil cultural celebrations. Secure, transparent, and simple to manage.
              </p>
              <div className="text-tamil-gold-400 font-medium text-xs">
                வாழ்க வளமுடன்! (Live Prosperously)
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-black tracking-wider uppercase mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-black transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-black transition-colors">How It Works</a></li>
                <li><Link to="/login" className="hover:text-black transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-black transition-colors">Register</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-black tracking-wider uppercase mb-4">Contact & Support</h3>
              <p className="text-sm text-slate-400">
                Email: support@moimate.com<br />
                Phone: +91 44 2496 1234<br />
                Chennai, Tamil Nadu, India
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-205 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} MoiMate. All rights reserved. Built with pride for Tamil cultural celebrations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
