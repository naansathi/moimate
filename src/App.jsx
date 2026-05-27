import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Routing Guards
import PrivateRoute from "./routes/PrivateRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import Participants from "./pages/Participants";
import Payment from "./pages/Payment";
import Receipt from "./pages/Receipt";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Collaborators from "./pages/Collaborators";
import NotFound from "./pages/NotFound";

// Toast container
import ToastContainer from "./components/Toast";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Home/Landing Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Authentication Layout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Dashboard/Admin Layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/event/:eventId" element={<EventDetails />} />
              <Route path="/event/:eventId/participants" element={<Participants />} />
              <Route path="/event/:eventId/payment" element={<Payment />} />
              <Route path="/receipt/:participantId" element={<Receipt />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/collaborators" element={<Collaborators />} />
            </Route>
          </Route>

          {/* Fallback Not Found Page */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        
        {/* Global animated notifications */}
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
