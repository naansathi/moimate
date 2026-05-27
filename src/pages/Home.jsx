import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Share2, 
  QrCode, 
  Printer, 
  ShieldCheck, 
  Users, 
  FileSpreadsheet,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { useApp } from "../context/AppContext";

const Home = () => {
  const { user } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const features = [
    {
      icon: QrCode,
      title: "Digital Payment UI",
      desc: "Simulate UPI, QR code, and card payment screens. Automatically tracks transaction IDs.",
      color: "text-tamil-saffron-650 bg-tamil-saffron-100 dark:bg-tamil-saffron-950/30"
    },
    {
      icon: Printer,
      title: "Printable Slips & Receipts",
      desc: "Support for A4 business layout and 80mm thermal receipts. Perfect for local bookkeeping.",
      color: "text-tamil-maroon-700 bg-tamil-maroon-100 dark:bg-tamil-maroon-950/30"
    },
    {
      icon: Share2,
      title: "WhatsApp Invite Sharing",
      desc: "Instantly share customized function details and payment links over WhatsApp with templates.",
      color: "text-tamil-green-600 bg-tamil-green-100 dark:bg-tamil-green-950/30"
    },
    {
      icon: Users,
      title: "Member Enrollment",
      desc: "Maintain guest attendance, addresses, contact details, and contribution amount dynamically.",
      color: "text-blue-600 bg-blue-100 dark:bg-blue-950/30"
    },
    {
      icon: FileSpreadsheet,
      title: "CSV & PDF Exports",
      desc: "Export data to Excel or CSV for local audits, resolving manual registry bottlenecks.",
      color: "text-purple-600 bg-purple-100 dark:bg-purple-950/30"
    },
    {
      icon: ShieldCheck,
      title: "Secure Verification",
      desc: "Verify payments using secure receipt numbers and unique payment IDs for error-free audit logs.",
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/30"
    }
  ];

  return (
    <div className="kolam-bg py-8 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-tamil-maroon-50 dark:bg-tamil-maroon-950/30 border border-tamil-maroon-100 dark:border-tamil-maroon-900/30 text-xs font-bold text-tamil-maroon-800 dark:text-tamil-gold-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Digitalizing Traditional Moi Vasool</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight font-sans">
              Modernizing Contribution <br />
              <span className="bg-gradient-to-r from-tamil-maroon-800 via-tamil-saffron-600 to-tamil-gold-600 bg-clip-text text-black">
                Tracking for Tamil Functions
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
              Bring transparency and simplicity to your weddings, ear-piercing ceremonies, and housewarmings. Say goodbye to messy notebooks and hello to <strong>MoiMate</strong>'s automated ledger system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 rounded-2xl shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-black bg-tamil-gold-400 hover:bg-tamil-gold-300 rounded-2xl shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-6 py-3.5 text-base font-bold text-slate-850 bg-white rounded-2xl border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <span>Admin Log In</span>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
              <div>
                <p className="text-2xl font-black text-tamil-maroon-700">100%</p>
                <p className="text-xs text-slate-650 font-bold">Paperless & Automated</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <p className="text-2xl font-black text-tamil-maroon-700">1-Click</p>
                <p className="text-xs text-slate-650 font-bold">Receipt & PDF Sharing</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Premium Card Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            {/* Visual background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-tamil-maroon-500 to-tamil-gold-500 rounded-3xl blur opacity-10 dark:opacity-20 animate-pulse" />
            
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
              
              {/* Event preview header card */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-tamil-maroon-100 text-[10px] font-bold text-tamil-maroon-800">
                    Marriage Event Preset
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-1">Anbarasan & Kavitha Thirumana Vizha</h3>
                  <p className="text-xs text-slate-655 font-semibold mt-0.5">Sri Raja Rajeshwari Mandapam, Chennai</p>
                </div>
                <div className="p-2 bg-tamil-maroon-50 text-tamil-maroon-800 rounded-xl">
                  <Sparkles size={20} />
                </div>
              </div>

              {/* Stats values */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-550 tracking-wider">Total Collection</span>
                  <p className="text-xl font-black text-tamil-maroon-800 mt-0.5">₹3,45,000</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-550 tracking-wider">Total Contribution count</span>
                  <p className="text-xl font-black text-slate-900 mt-0.5">148 Guests</p>
                </div>
              </div>

              {/* Demo Transaction feed */}
              <div className="space-y-3">
                <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Recent Contributions</p>
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-150 flex items-center justify-center text-emerald-900 font-bold text-xs">SK</div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">T. R. Senthil Kumar</p>
                      <p className="text-[9px] font-semibold text-slate-600">West Mambalam, Chennai</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-800">+₹5,000</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-bold text-xs">CC</div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">RM. Chidambaram Chettiyar</p>
                      <p className="text-[9px] font-semibold text-slate-650">Devakottai, Cash</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">Pending</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 font-sans">
            Designed for Modern Celebrations
          </h2>
          <p className="text-sm sm:text-base text-slate-650 font-medium">
            MoiMate brings robust bookkeeping technology to traditional events, ensuring every contribution is filed, acknowledged, and exported securely.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className={`p-3 rounded-xl inline-block ${feat.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-950 mb-2 font-sans">{feat.title}</h3>
                <p className="text-sm font-medium text-slate-650 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-slate-100/50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 font-sans">
              Simple 4-Step Process
            </h2>
            <p className="text-sm text-slate-650 font-bold">
              Setting up and managing your collections takes less than five minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Create Event", desc: "Add marriage, ear-piercing, housewarming, or custom events with names and cover images." },
              { step: "02", title: "Add Guests", desc: "Enroll participants, log contact details, addresses, and individual contribution status." },
              { step: "03", title: "Process Payments", desc: "Accept payments offline (cash entries) or simulate instant UPI QR & card payments." },
              { step: "04", title: "Generate Slips", desc: "Instantly display and print professional receipts or thermal slips for your guests." }
            ].map((stepObj, index) => (
              <div key={index} className="space-y-3 relative">
                <span className="text-5xl font-black text-slate-300 block select-none">
                  {stepObj.step}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 font-sans">{stepObj.title}</h3>
                <p className="text-sm font-medium text-slate-650 leading-relaxed">{stepObj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
