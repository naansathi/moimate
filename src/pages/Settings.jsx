import React from "react";
import { 
  Trash2, 
  RotateCcw, 
  Smartphone, 
  Eye, 
  UserCheck, 
  Lock,
  Database
} from "lucide-react";
import { useApp } from "../context/AppContext";

const Settings = () => {
  const { 
    user, 
    setUser, 
    addNotification 
  } = useApp();

  const handleRoleToggle = (role) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem("moimate_user", JSON.stringify(updated));
    addNotification(`Switched interface access privileges to: ${role}`, "info");
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to restore the system default registry dataset? This will overwrite all custom events and guests.")) {
      localStorage.removeItem("moimate_events");
      localStorage.removeItem("moimate_participants");
      localStorage.removeItem("moimate_activities");
      localStorage.removeItem("moimate_registered_users");
      addNotification("Restored default dummy dataset. Reloading page...", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleClearData = () => {
    if (window.confirm("CAUTION: This will delete ALL events and participant logs. This cannot be undone.")) {
      localStorage.setItem("moimate_events", JSON.stringify([]));
      localStorage.setItem("moimate_participants", JSON.stringify([]));
      localStorage.setItem("moimate_activities", JSON.stringify([]));
      addNotification("All local registry records wiped.", "info");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-black font-sans">System Configurations</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure user permission toggles, digital receipts, and data resets.</p>
      </div>

      <div className="space-y-6">
        


        {/* Role configuration module */}
        {user?.role === "Admin" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase text-slate-455 tracking-wider flex items-center gap-2">
              <Lock size={16} className="text-tamil-maroon-700 dark:text-tamil-gold-400" />
              <span>Simulate User Role Access</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch your current logged-in role parameters to inspect custom administrative controls versus limited editor/collaborator capabilities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Admin view button */}
              <button
                type="button"
                onClick={() => handleRoleToggle("Admin")}
                className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                  user?.role === "Admin"
                    ? "bg-tamil-maroon-50 border-tamil-maroon-700/50 text-tamil-maroon-900 dark:bg-tamil-maroon-950/20 dark:text-tamil-gold-450"
                    : "border-slate-250 dark:border-slate-800 text-slate-650"
                }`}
              >
                <UserCheck size={20} className="shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold block">Administrator View</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed block mt-1">
                    Full ownership: allows creating, modifying, or deleting functions and clearing client databases.
                  </span>
                </div>
              </button>

              {/* Collaborator view button */}
              <button
                type="button"
                onClick={() => handleRoleToggle("Collaborator")}
                className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all ${
                  user?.role === "Collaborator"
                    ? "bg-tamil-maroon-50 border-tamil-maroon-700/50 text-tamil-maroon-900 dark:bg-tamil-maroon-950/20 dark:text-tamil-gold-450"
                    : "border-slate-250 dark:border-slate-800 text-slate-650"
                }`}
              >
                <Eye size={20} className="shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold block">Collaborator View</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed block mt-1">
                    Limited access: enables adding guest contributions but restricts event deletions and profile modifications.
                  </span>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* Notifications simulation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase text-slate-455 tracking-wider flex items-center gap-2">
            <Smartphone size={16} className="text-tamil-maroon-700 dark:text-tamil-gold-400" />
            <span>Digital Receipts Toggles</span>
          </h3>
          
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-850">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-350">WhatsApp Auto-Dispatch Simulation</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Display WhatsApp template sharing suggestions after digital contributions are added.</p>
            </div>
            <input 
              type="checkbox" 
              defaultChecked 
              onChange={() => addNotification("Simulated notification configs updated", "success")} 
              className="h-4.5 w-4.5 rounded border-slate-300 text-tamil-maroon-800 focus:ring-tamil-maroon-750" 
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-350">SMS Billing Alerts (Mock)</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Send a mock network payload to guest phones upon cash (offline) collections.</p>
            </div>
            <input 
              type="checkbox" 
              onChange={() => addNotification("Simulated text messaging config changed", "info")} 
              className="h-4.5 w-4.5 rounded border-slate-300 text-tamil-maroon-800 focus:ring-tamil-maroon-750" 
            />
          </div>
        </div>

        {/* Local database actions */}
        <div className="bg-rose-50/40 dark:bg-rose-950/5 border border-rose-200 dark:border-rose-900/20 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase text-rose-800 dark:text-rose-455 tracking-wider flex items-center gap-2">
            <Database size={16} />
            <span>Registry Database Actions</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            System cleanup tools to manage the Client-side LocalStorage cache. Ideal when inspecting from a clean state.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            
            <button
              onClick={handleResetData}
              disabled={user?.role !== "Admin"}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-650 dark:text-slate-300 transition-colors shadow-sm disabled:opacity-40"
            >
              <RotateCcw size={14} className="text-tamil-maroon-700 dark:text-tamil-gold-450" />
              <span>Reset Default Data</span>
            </button>

            <button
              onClick={handleClearData}
              disabled={user?.role !== "Admin"}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-100 border border-rose-600 hover:bg-rose-205 text-black text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-40"
            >
              <Trash2 size={14} />
              <span>Wipe All Local Data</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Settings;
