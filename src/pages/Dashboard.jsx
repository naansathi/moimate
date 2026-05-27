import React from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  IndianRupee, 
  CreditCard, 
  Coins, 
  Clock, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from "recharts";
import { useApp } from "../context/AppContext";
import { formatTamilCurrency, formatDate } from "../utils/helpers";
import StatCard from "../components/StatCard";

const Dashboard = () => {
  const { events, participants, activities, user } = useApp();

  // 1. Scoped Data Filters
  const displayedEvents = user?.role === "Admin"
    ? events
    : events.filter(evt => evt.assignedTo === user?.email);

  const displayedEventIds = displayedEvents.map(e => e.id);

  const displayedParticipants = user?.role === "Admin"
    ? participants
    : participants.filter(p => displayedEventIds.includes(p.eventId));

  const displayedActivities = user?.role === "Admin"
    ? activities
    : activities.filter(act => displayedEvents.some(evt => act.message.includes(evt.name)));

  // 2. Calculations
  const totalEvents = displayedEvents.length;
  
  const paidContributions = displayedParticipants.filter(p => p.paymentStatus === "Paid");
  const pendingContributions = displayedParticipants.filter(p => p.paymentStatus === "Pending");
  
  const totalCollection = paidContributions.reduce((sum, p) => sum + p.amountGiven, 0);
  const pendingCollection = pendingContributions.reduce((sum, p) => sum + p.amountGiven, 0);
  
  const onlinePaymentsCount = paidContributions.filter(p => p.paymentType === "Online").length;
  const offlinePaymentsCount = paidContributions.filter(p => p.paymentType === "Offline").length;

  // 3. Chart Data 1: Collections per Event
  const eventChartData = displayedEvents.map(evt => {
    const eventPaid = displayedParticipants
      .filter(p => p.eventId === evt.id && p.paymentStatus === "Paid")
      .reduce((sum, p) => sum + p.amountGiven, 0);
    return {
      name: evt.name.length > 15 ? evt.name.substring(0, 15) + "..." : evt.name,
      "Amount Collected": eventPaid,
      "Target Amount": evt.expectedAmount
    };
  });

  // 3. Chart Data 2: Simulated monthly growth
  const monthlyData = [
    { month: "Jan", amount: 45000 },
    { month: "Feb", amount: 78000 },
    { month: "Mar", amount: 120000 },
    { month: "Apr", amount: 195000 },
    { month: "May", amount: totalCollection } // dynamic current value
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-tamil-maroon-50 to-tamil-maroon-100 p-6 sm:p-8 rounded-3xl shadow-sm border border-tamil-maroon-200/60 text-black">
        {/* Kolam decorative overlay inside banner */}
        <div className="absolute inset-0 opacity-[0.03] kolam-bg pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-black">
              Vanakkam, {user?.fullName || "Admin"}!
            </h2>
            <p className="text-sm text-slate-800 max-w-md">
              Here is the digital overview of your traditional contribution collections. Tracking made transparent and simple.
            </p>
          </div>
          {user?.role === "Admin" && (
            <Link
              to="/create-event"
              className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-tamil-maroon-900 bg-tamil-gold-400 hover:bg-tamil-gold-300 rounded-xl transition-all shadow-md active:scale-95 shrink-0"
            >
              <PlusCircle size={18} />
              <span>Create Event</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Hosted Events"
          value={totalEvents}
          icon={Calendar}
          description="Total functions registered"
          trend={{ value: "+2 this month", type: "positive" }}
          color="maroon"
        />
        <StatCard 
          title="Total Collection"
          value={formatTamilCurrency(totalCollection)}
          icon={IndianRupee}
          description="Successful contributions"
          trend={{ value: "Target: 78%", type: "positive" }}
          color="gold"
        />
        <StatCard 
          title="Pending Collection"
          value={formatTamilCurrency(pendingCollection)}
          icon={Clock}
          description="Pledged / Unpaid guest amounts"
          color="saffron"
        />
        <StatCard 
          title="Payment Mode Split"
          value={`${onlinePaymentsCount} On / ${offlinePaymentsCount} Off`}
          icon={CreditCard}
          description="Online Gateway vs Cash entries"
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Collection Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-850 dark:text-black mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-tamil-maroon-700 dark:text-tamil-gold-400" />
            <span>Event Collection Performance</span>
          </h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#ffffff", 
                    borderColor: "#e2e8f0",
                    borderRadius: "12px",
                    color: "#0f172a"
                  }} 
                />
                <Legend />
                <Bar dataKey="Amount Collected" fill="#800020" radius={[4, 4, 0, 0]}>
                  {eventChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#800020" : "#D4AF37"} />
                  ))}
                </Bar>
                <Bar dataKey="Target Amount" fill="#94a3b8" opacity={0.3} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Collection Timeline area chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-850 dark:text-black mb-6 flex items-center gap-2">
            <Coins size={18} className="text-tamil-maroon-700 dark:text-tamil-gold-400" />
            <span>Monthly Cumulative Growth</span>
          </h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#ffffff", 
                    borderColor: "#e2e8f0",
                    borderRadius: "12px"
                  }} 
                />
                <Area type="monotone" dataKey="amount" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid: Events List & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Events Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-850 dark:text-black">Active Moi Events</h3>
            {user?.role === "Admin" && (
              <Link to="/create-event" className="text-xs font-bold text-tamil-maroon-700 dark:text-tamil-gold-450 hover:underline flex items-center gap-1">
                <span>Create event</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedEvents.slice(0, 4).map(evt => {
              const eventPaid = displayedParticipants
                .filter(p => p.eventId === evt.id && p.paymentStatus === "Paid")
                .reduce((sum, p) => sum + p.amountGiven, 0);
              const percentage = Math.min(100, Math.round((eventPaid / evt.expectedAmount) * 100));

              return (
                <div 
                  key={evt.id} 
                  className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform"
                >
                  <div>
                    <span className="text-[9px] uppercase font-bold text-tamil-maroon-700 dark:text-tamil-gold-400 bg-tamil-maroon-50 dark:bg-tamil-maroon-900/35 px-2 py-0.5 rounded-full">
                      {evt.type}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-black mt-2 line-clamp-1">{evt.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(evt.eventDate)}</p>
                  </div>
                  
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500 dark:text-slate-400">Collected:</span>
                      <span className="text-tamil-maroon-700 dark:text-tamil-gold-400">{formatTamilCurrency(eventPaid)}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-tamil-maroon-700 to-tamil-gold-500 h-1.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-450">
                      <span>{percentage}% of expected target</span>
                      <span>Target: {formatTamilCurrency(evt.expectedAmount)}</span>
                    </div>
                    <Link
                      to={`/event/${evt.id}`}
                      className="block text-center mt-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities Panel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-850 dark:text-black">Recent Activity</h3>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {displayedActivities.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">No activities registered yet.</div>
              ) : (
                displayedActivities.slice(0, 5).map(act => (
                  <div key={act.id} className="flex gap-3">
                    <div className="mt-0.5 shrink-0 w-2 h-2 rounded-full bg-tamil-maroon-700 dark:bg-tamil-gold-400 ring-4 ring-tamil-maroon-100 dark:ring-tamil-gold-950" />
                    <div className="space-y-0.5 text-xs">
                      <p className="font-semibold text-slate-700 dark:text-slate-350">{act.message}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(act.dateTime).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })} • {new Date(act.dateTime).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <button 
            onClick={() => alert("Simulation detail: logs are updated automatically as actions occur.")}
            className="w-full text-center mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-tamil-maroon-700 dark:hover:text-tamil-gold-400"
          >
            System Logs Verified
          </button>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
