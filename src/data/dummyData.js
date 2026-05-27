export const initialEvents = [
  {
    id: "evt_1",
    name: "Anbarasan & Kavitha Thirumana Vizha",
    type: "Marriage",
    hostName: "M. Soundararajan",
    eventDate: "2026-06-15",
    venue: "Sri Raja Rajeshwari Mandapam, Chennai",
    description: "Welcome to the wedding function of our eldest son Anbarasan with Kavitha. Your blessings and presence are highly valued.",
    expectedAmount: 500000,
    coverImage: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=800",
    createdDate: "2026-05-01",
    assignedTo: "collab@moimate.com"
  },
  {
    id: "evt_2",
    name: "Pranav's Kaadhu Kuthu Vizha",
    type: "Ear Piercing",
    hostName: "K. Murugan",
    eventDate: "2026-07-02",
    venue: "Arulmigu Dhandayuthapani Swamy Temple, Palani",
    description: "Traditional ear piercing ceremony for our child Pranav. Followed by traditional feast (Virundhu).",
    expectedAmount: 200000,
    coverImage: "https://images.unsplash.com/photo-1544006714-e56340578505?auto=format&fit=crop&q=80&w=800",
    createdDate: "2026-05-10",
    assignedTo: ""
  },
  {
    id: "evt_3",
    name: "Meenakshi Illam Pudhumana Puguvizha",
    type: "House Warming",
    hostName: "S. Alagappan",
    eventDate: "2026-08-10",
    venue: "Anna Nagar East, Karaikudi",
    description: "Housewarming ceremony of our new home. Join us for Ganapathi Homam and lunch.",
    expectedAmount: 400000,
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    createdDate: "2026-05-18",
    assignedTo: ""
  },
  {
    id: "evt_4",
    name: "Siva's 1st Birthday Function",
    type: "Birthday",
    hostName: "P. Vignesh & Abirami",
    eventDate: "2026-05-28",
    venue: "Sangam Hall, Madurai",
    description: "Join us in celebrating the first birthday of our little prince Siva.",
    expectedAmount: 150000,
    coverImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=800",
    createdDate: "2026-05-20",
    assignedTo: ""
  }
];

export const initialParticipants = [
  {
    id: "part_1",
    eventId: "evt_1",
    name: "T. R. Senthil Kumar",
    mobileNumber: "9876543210",
    address: "West Mambalam, Chennai",
    amountGiven: 5000,
    paymentType: "Online",
    paymentStatus: "Paid",
    transactionId: "TXN1029384756",
    dateTime: "2026-05-25T10:30:00Z",
    collectedBy: "Online Gateway",
    notes: "Best wishes for the couple!"
  },
  {
    id: "part_2",
    eventId: "evt_1",
    name: "RM. Chidambaram Chettiyar",
    mobileNumber: "9443210987",
    address: "Devakottai, Sivagangai",
    amountGiven: 10000,
    paymentType: "Offline",
    paymentStatus: "Paid",
    transactionId: "REC-502-001",
    dateTime: "2026-05-26T11:15:00Z",
    collectedBy: "S. Alagappan",
    notes: "Traditional contribution (Moi Murai)"
  },
  {
    id: "part_3",
    eventId: "evt_1",
    name: "M. Rajesh Kumar",
    mobileNumber: "8123456789",
    address: "Tambaram, Chennai",
    amountGiven: 2000,
    paymentType: "Online",
    paymentStatus: "Paid",
    transactionId: "TXN5566778899",
    dateTime: "2026-05-27T08:45:00Z",
    collectedBy: "Online Gateway",
    notes: "Hearty congratulations!"
  },
  {
    id: "part_4",
    eventId: "evt_1",
    name: "R. Pandian",
    mobileNumber: "9988776655",
    address: "Sellur, Madurai",
    amountGiven: 1000,
    paymentType: "Offline",
    paymentStatus: "Pending",
    transactionId: "",
    dateTime: "2026-05-27T09:00:00Z",
    collectedBy: "",
    notes: "Will pay by cash at venue"
  },
  {
    id: "part_5",
    eventId: "evt_2",
    name: "A. Palanivel",
    mobileNumber: "9001234567",
    address: "Oddanchatram, Dindigul",
    amountGiven: 3000,
    paymentType: "Offline",
    paymentStatus: "Paid",
    transactionId: "REC-502-002",
    dateTime: "2026-05-26T14:20:00Z",
    collectedBy: "K. Murugan",
    notes: "Cash collection"
  },
  {
    id: "part_6",
    eventId: "evt_2",
    name: "Senthil Nathan",
    mobileNumber: "9112233445",
    address: "Coimbatore",
    amountGiven: 5000,
    paymentType: "Online",
    paymentStatus: "Paid",
    transactionId: "TXN7788990011",
    dateTime: "2026-05-27T10:10:00Z",
    collectedBy: "Online Gateway",
    notes: ""
  },
  {
    id: "part_7",
    eventId: "evt_3",
    name: "Meyyappan",
    mobileNumber: "9566778899",
    address: "Karaikudi",
    amountGiven: 10000,
    paymentType: "Online",
    paymentStatus: "Paid",
    transactionId: "TXN1122334455",
    dateTime: "2026-05-27T12:00:00Z",
    collectedBy: "Online Gateway",
    notes: "Aiyya Vazhga!"
  }
];

export const initialActivities = [
  {
    id: "act_1",
    type: "event_created",
    message: "New Event 'Anbarasan & Kavitha Thirumana Vizha' was created by Admin.",
    dateTime: "2026-05-01T09:00:00Z"
  },
  {
    id: "act_2",
    type: "payment_received",
    message: "T. R. Senthil Kumar contributed ₹5,000 via UPI for Anbarasan & Kavitha Thirumana Vizha.",
    dateTime: "2026-05-25T10:30:00Z"
  },
  {
    id: "act_3",
    type: "payment_received",
    message: "RM. Chidambaram Chettiyar contributed ₹10,000 in cash for Anbarasan & Kavitha Thirumana Vizha.",
    dateTime: "2026-05-26T11:15:00Z"
  },
  {
    id: "act_4",
    type: "payment_received",
    message: "M. Rajesh Kumar contributed ₹2,000 via Card for Anbarasan & Kavitha Thirumana Vizha.",
    dateTime: "2026-05-27T08:45:00Z"
  }
];
