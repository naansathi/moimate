import React, { createContext, useContext, useState, useEffect } from "react";
import { initialEvents, initialParticipants, initialActivities } from "../data/dummyData";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Force Light Theme System
  const theme = "light";
  const setTheme = () => {};

  // Auth state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("moimate_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Data states
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("moimate_events");
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });

  const [participants, setParticipants] = useState(() => {
    const savedParts = localStorage.getItem("moimate_participants");
    return savedParts ? JSON.parse(savedParts) : initialParticipants;
  });

  const [activities, setActivities] = useState(() => {
    const savedActs = localStorage.getItem("moimate_activities");
    return savedActs ? JSON.parse(savedActs) : initialActivities;
  });

  // Notifications (Toasts)
  const [notifications, setNotifications] = useState([]);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem("moimate_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("moimate_participants", JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem("moimate_activities", JSON.stringify(activities));
  }, [activities]);

  // Toast notifier helper
  const addNotification = (message, type = "success") => {
    const id = "notif_" + Date.now() + Math.random().toString(36).substr(2, 5);
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Auth Operations & User Directory
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem("moimate_registered_users");
    if (saved) return JSON.parse(saved);
    
    const defaultUsers = [
      {
        fullName: "Karthik Raja",
        email: "admin@moimate.com",
        mobileNumber: "9876543210",
        address: "Mylapore, Chennai",
        password: "password123",
        role: "Admin"
      },
      {
        fullName: "Senthil Kumar",
        email: "collab@moimate.com",
        mobileNumber: "9876543211",
        address: "T. Nagar, Chennai",
        password: "password123",
        role: "Collaborator"
      }
    ];
    localStorage.setItem("moimate_registered_users", JSON.stringify(defaultUsers));
    return defaultUsers;
  });

  useEffect(() => {
    localStorage.setItem("moimate_registered_users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (emailOrMobile, password) => {
    const foundUser = registeredUsers.find(
      (u) => (u.email === emailOrMobile || u.mobileNumber === emailOrMobile) && u.password === password
    );

    if (foundUser) {
      const userSession = {
        fullName: foundUser.fullName,
        email: foundUser.email,
        mobileNumber: foundUser.mobileNumber,
        address: foundUser.address,
        role: foundUser.role
      };
      setUser(userSession);
      localStorage.setItem("moimate_user", JSON.stringify(userSession));
      addNotification(`Welcome back, ${userSession.fullName} (${userSession.role})!`, "success");
      return { success: true };
    }

    addNotification("Invalid email/mobile or password", "error");
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("moimate_user");
    addNotification("You have logged out successfully", "info");
  };

  const register = (registerData) => {
    const { fullName, mobileNumber, email, password, address, role } = registerData;
    
    if (registeredUsers.some((u) => u.email === email || u.mobileNumber === mobileNumber)) {
      addNotification("Email or Mobile number already registered", "error");
      return { success: false, message: "User already exists" };
    }

    const newUser = {
      fullName,
      mobileNumber,
      email,
      password,
      address,
      role: role || "Admin"
    };

    setRegisteredUsers((prev) => [...prev, newUser]);

    const userSession = {
      fullName,
      email,
      mobileNumber,
      address,
      role: role || "Admin"
    };
    setUser(userSession);
    localStorage.setItem("moimate_user", JSON.stringify(userSession));
    addNotification("Registration successful! Welcome to MoiMate.", "success");
    return { success: true };
  };

  const createCollaboratorByAdmin = (collaboratorData) => {
    const { fullName, mobileNumber, email, password, address } = collaboratorData;
    
    if (registeredUsers.some((u) => u.email === email || u.mobileNumber === mobileNumber)) {
      addNotification("Email or Mobile number already registered", "error");
      return { success: false, message: "User already exists" };
    }

    const newUser = {
      fullName,
      mobileNumber,
      email,
      password,
      address,
      role: "Collaborator"
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    
    const newActivity = {
      id: "act_" + Date.now(),
      type: "collaborator_created",
      message: `New collaborator '${fullName}' was registered by ${user?.fullName || "Admin"}.`,
      dateTime: new Date().toISOString()
    };
    setActivities((prev) => [newActivity, ...prev]);

    addNotification(`Collaborator "${fullName}" created successfully!`, "success");
    return { success: true };
  };

  const assignEventToCollaborator = (eventId, collaboratorEmail) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, assignedTo: collaboratorEmail } : evt))
    );

    const eventName = events.find(e => e.id === eventId)?.name || "Event";
    const collabName = registeredUsers.find(u => u.email === collaboratorEmail)?.fullName || (collaboratorEmail ? collaboratorEmail : "Unassigned");

    const newActivity = {
      id: "act_" + Date.now(),
      type: "event_assigned",
      message: collaboratorEmail 
        ? `Event '${eventName}' was assigned to collaborator '${collabName}'.`
        : `Event '${eventName}' was unassigned.`,
      dateTime: new Date().toISOString()
    };
    setActivities((prev) => [newActivity, ...prev]);

    addNotification(collaboratorEmail ? `Assigned "${eventName}" to ${collabName}` : `Unassigned "${eventName}"`, "success");
  };

  const updateUserProfile = (updatedProfile) => {
    setUser((prev) => {
      const newProfile = { ...prev, ...updatedProfile };
      localStorage.setItem("moimate_user", JSON.stringify(newProfile));
      return newProfile;
    });

    setRegisteredUsers((prev) =>
      prev.map((u) => (u.email === user?.email ? { ...u, ...updatedProfile } : u))
    );

    addNotification("Profile updated successfully!", "success");
  };

  // Event Operations
  const createEvent = (eventData) => {
    const newEvent = {
      id: "evt_" + Date.now(),
      createdDate: new Date().toISOString().split("T")[0],
      ...eventData
    };
    setEvents((prev) => [newEvent, ...prev]);
    
    // Add Activity Log
    const newActivity = {
      id: "act_" + Date.now(),
      type: "event_created",
      message: `New Event '${newEvent.name}' was created by ${user?.fullName || "Admin"}.`,
      dateTime: new Date().toISOString()
    };
    setActivities((prev) => [newActivity, ...prev]);
    
    addNotification(`Event "${newEvent.name}" created successfully!`, "success");
    return newEvent.id;
  };

  const updateEvent = (eventId, eventData) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === eventId ? { ...evt, ...eventData } : evt))
    );
    
    addNotification("Event details updated successfully", "success");
  };

  const deleteEvent = (eventId) => {
    const evtName = events.find(e => e.id === eventId)?.name || "Event";
    setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    // Clean up participants associated with this event
    setParticipants((prev) => prev.filter((p) => p.eventId !== eventId));

    // Add Activity Log
    const newActivity = {
      id: "act_" + Date.now(),
      type: "event_deleted",
      message: `Event '${evtName}' was deleted.`,
      dateTime: new Date().toISOString()
    };
    setActivities((prev) => [newActivity, ...prev]);

    addNotification(`Event "${evtName}" deleted.`, "info");
  };

  // Participant / Moi Contribution Operations
  const addParticipant = (participantData) => {
    const newParticipant = {
      id: "part_" + Date.now(),
      dateTime: new Date().toISOString(),
      ...participantData
    };

    setParticipants((prev) => [newParticipant, ...prev]);

    if (newParticipant.paymentStatus === "Paid") {
      // Add Activity Log
      const eventName = events.find((e) => e.id === newParticipant.eventId)?.name || "Event";
      const newActivity = {
        id: "act_" + Date.now(),
        type: "payment_received",
        message: `${newParticipant.name} contributed ₹${newParticipant.amountGiven.toLocaleString()} for ${eventName}.`,
        dateTime: new Date().toISOString()
      };
      setActivities((prev) => [newActivity, ...prev]);
    }

    addNotification(`Added contribution for ${newParticipant.name}`, "success");
    return newParticipant;
  };

  const updateParticipant = (participantId, participantData) => {
    let wasUpdatedToPaid = false;
    let participantName = "";
    let amount = 0;
    let eventName = "";

    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          if (p.paymentStatus === "Pending" && participantData.paymentStatus === "Paid") {
            wasUpdatedToPaid = true;
            participantName = participantData.name || p.name;
            amount = participantData.amountGiven || p.amountGiven;
            eventName = events.find((e) => e.id === p.eventId)?.name || "Event";
          }
          return { ...p, ...participantData };
        }
        return p;
      })
    );

    if (wasUpdatedToPaid) {
      const newActivity = {
        id: "act_" + Date.now(),
        type: "payment_received",
        message: `${participantName} contributed ₹${amount.toLocaleString()} for ${eventName}.`,
        dateTime: new Date().toISOString()
      };
      setActivities((prev) => [newActivity, ...prev]);
      addNotification(`Payment received from ${participantName}!`, "success");
    } else {
      addNotification("Contribution updated successfully", "success");
    }
  };

  const deleteParticipant = (participantId) => {
    const part = participants.find((p) => p.id === participantId);
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
    addNotification(`Removed ${part?.name || "contribution"}`, "info");
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        user,
        setUser,
        events,
        setEvents,
        participants,
        activities,
        notifications,
        addNotification,
        removeNotification,
        login,
        logout,
        register,
        updateUserProfile,
        createEvent,
        updateEvent,
        deleteEvent,
        addParticipant,
        updateParticipant,
        deleteParticipant,
        registeredUsers,
        createCollaboratorByAdmin,
        assignEventToCollaborator
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
