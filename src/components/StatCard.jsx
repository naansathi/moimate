import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, description, trend, color = "maroon" }) => {
  const colorMap = {
    maroon: {
      bg: "bg-tamil-maroon-50 dark:bg-tamil-maroon-950/20",
      border: "border-tamil-maroon-100 dark:border-tamil-maroon-900/30",
      icon: "text-tamil-maroon-700 dark:text-tamil-maroon-400",
      iconBg: "bg-tamil-maroon-100 dark:bg-tamil-maroon-900/40",
      accent: "from-tamil-maroon-600 to-tamil-maroon-900",
    },
    gold: {
      bg: "bg-tamil-gold-50 dark:bg-tamil-gold-950/10",
      border: "border-tamil-gold-200/50 dark:border-tamil-gold-900/20",
      icon: "text-tamil-gold-700 dark:text-tamil-gold-400",
      iconBg: "bg-tamil-gold-100 dark:bg-tamil-gold-900/30",
      accent: "from-tamil-gold-500 to-tamil-gold-700",
    },
    green: {
      bg: "bg-tamil-green-50 dark:bg-tamil-green-950/20",
      border: "border-tamil-green-100 dark:border-tamil-green-900/30",
      icon: "text-tamil-green-700 dark:text-tamil-green-400",
      iconBg: "bg-tamil-green-100 dark:bg-tamil-green-900/40",
      accent: "from-tamil-green-600 to-tamil-green-800",
    },
    saffron: {
      bg: "bg-tamil-saffron-50 dark:bg-tamil-saffron-950/20",
      border: "border-tamil-saffron-100 dark:border-tamil-saffron-900/30",
      icon: "text-tamil-saffron-700 dark:text-tamil-saffron-400",
      iconBg: "bg-tamil-saffron-100 dark:bg-tamil-saffron-900/40",
      accent: "from-tamil-saffron-600 to-tamil-saffron-800",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
      border: "border-indigo-100 dark:border-indigo-900/30",
      icon: "text-indigo-700 dark:text-indigo-400",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      accent: "from-indigo-600 to-indigo-800",
    }
  };

  const style = colorMap[color] || colorMap.maroon;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className={`glass-panel p-6 rounded-2xl border ${style.border} shadow-sm flex flex-col justify-between relative overflow-hidden`}
    >
      {/* Decorative gradient light corner */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${style.accent} opacity-5 blur-2xl rounded-full`} />

      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-650">{title}</p>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-950 mt-1">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${style.iconBg} ${style.icon} transition-colors`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            trend.type === "positive" 
              ? "bg-emerald-100 text-emerald-800" 
              : "bg-rose-100 text-rose-800"
          }`}>
            {trend.value}
          </span>
        )}
        <span className="text-xs font-medium text-slate-600">{description}</span>
      </div>
    </motion.div>
  );
};

export default StatCard;
