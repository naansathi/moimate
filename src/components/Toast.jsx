import React from "react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContainer = () => {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl shadow-glass border text-black ${
              n.type === "success"
                ? "bg-emerald-50 border-emerald-200"
                : n.type === "error"
                ? "bg-rose-50 border-rose-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">
                {n.type === "success" && <CheckCircle size={18} className="text-emerald-700" />}
                {n.type === "error" && <AlertCircle size={18} className="text-rose-700" />}
                {n.type === "info" && <Info size={18} className="text-amber-700" />}
              </span>
              <p className="text-sm font-semibold leading-tight text-black">{n.message}</p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-black/60 hover:text-black transition-colors ml-4 shrink-0"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
