import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Sparkles,
  Users
} from "lucide-react";
import { useApp } from "../context/AppContext";
import logo from "../assets/logo.svg";

const DashboardLayout = () => {
  const { user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ...(user?.role === "Admin" ? [
      { name: "Create Event", path: "/create-event", icon: PlusCircle },
      { name: "Collaborators", path: "/collaborators", icon: Users }
    ] : []),
    { name: "My Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/dashboard") return "Overview Dashboard";
    if (currentPath === "/create-event") return "Create New Moi Event";
    if (currentPath.startsWith("/event/")) {
      if (currentPath.includes("/participants")) return "Moi Collection Registry";
      if (currentPath.includes("/payment")) return "Simulated Payment Gateway";
      return "Event Detail Analysis";
    }
    if (currentPath === "/profile") return "User Account Profile";
    if (currentPath === "/settings") return "System Settings";
    if (currentPath === "/collaborators") return "Collaborator Management";
    if (currentPath.startsWith("/receipt/")) return "Moi Receipt / Slip";
    return "MoiMate Control Center";
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-slate-800 dark:text-slate-200">

      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-20 border-r border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
          }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <img className="h-9 w-auto shrink-0" src={logo} alt="MoiMate Logo" />
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-sans text-lg font-bold tracking-tight bg-gradient-to-r from-tamil-maroon-800 to-tamil-saffron-600 dark:from-tamil-gold-300 dark:to-tamil-saffron-400 bg-clip-text text-black">
                  MoiMate
                </span>
                <span className="text-[7px] font-bold uppercase tracking-widest text-tamil-maroon-600 dark:text-tamil-gold-500">
                  Control Board
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive
                    ? "bg-tamil-maroon-50 text-tamil-maroon-800 dark:bg-tamil-maroon-950/20 dark:text-tamil-gold-450 border border-tamil-maroon-100/50 dark:border-tamil-maroon-900/30"
                    : "text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-black"
                  }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-tamil-maroon-700 dark:text-tamil-gold-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "md:pl-64" : "md:pl-20"
        }`}>

        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 md:px-8 transition-colors">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-black leading-none font-sans">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">


            {/* Simulated Notification bell */}
            <div className="relative">
              <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200/50 dark:border-slate-850">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tamil-saffron-500 ring-2 ring-white dark:ring-slate-900" />
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-tamil-gold-200 to-tamil-saffron-100 border border-tamil-saffron-300 text-black font-bold text-sm flex items-center justify-center shadow-sm">
                  {user?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "A"}
                </div>
                <div className="hidden sm:block text-xs font-semibold leading-tight pr-1">
                  <p className="text-slate-700 dark:text-slate-200">{user?.fullName || "Admin"}</p>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">{user?.role || "User"}</p>
                </div>
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-250/50 dark:border-slate-800 shadow-lg py-2 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-200/60 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-800 dark:text-black truncate">{user?.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User size={16} className="text-slate-450" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings size={16} className="text-slate-450" />
                      <span>Settings</span>
                    </Link>
                    <hr className="border-slate-200 dark:border-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Dashboard */}
        <main className="flex-grow p-4 sm:p-6 md:p-8 pb-20 md:pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Mobile PWA Bottom Tab Navigation */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/60 dark:border-slate-800 z-40 flex items-center justify-around h-16 px-2 shadow-lg">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name + "_mobile"}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold ${isActive
                    ? "text-tamil-maroon-700 dark:text-tamil-gold-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                <Icon className={`w-5.5 h-5.5 mb-1 ${isActive ? "text-tamil-maroon-700 dark:text-tamil-gold-500" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;
