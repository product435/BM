// ─────────────────────────────────────────────────────────────
// EVENT CONFIGURATION — single source of truth for event copy.
// Edit everything here; the UI reads from this file only.
// Anything still being confirmed is marked as such and shown
// honestly in the interface.
// ─────────────────────────────────────────────────────────────

export const EVENT = {
  org: "BMI",
  orgFull: "BMI Presents",
  city: "Jaipur",
  cityLong: "Jaipur, Rajasthan",
  date: "20th",
  // Venue & capacity are intentionally editable — still subject to confirmation.
  venue: {
    status: "To be announced",
    note: "Final venue details will be announced ahead of the event.",
  },
  capacity: {
    invitations: "≈ 500–600",
    businesses: "≈ 30",
    visitors: "≈ 100",
    note: "Indicative figures — subject to confirmation.",
  },
};

export const IMAGES = {
  hero: "https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800",
<<<<<<< HEAD
  networking: "/images/Image1.jpeg",
=======
  networking:
    "https://images.pexels.com/photos/34623526/pexels-photo-34623526.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600",
>>>>>>> origin/main
  pitch:
    "https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=900",
  jaipur:
    "https://images.pexels.com/photos/19521546/pexels-photo-19521546.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=900",
};

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "categories", label: "Categories" },
  { id: "guests", label: "Guests" },
  { id: "register", label: "Registration" },
];

export const HERO_TICKER = [
  "Startup Pitches",
  "Investment Conversations",
  "Business Networking",
  "Student Ideas",
  "E-Sales",
  "Innovation",
];

<<<<<<< HEAD
export const INTRO_WORDS = ["IDEAS", "STARTUPS", "NETWORKING", "INVESTMENT", "INNOVATION"];
=======
export const INTRO_WORDS = ["Ideas", "Startups", "Business", "Investment", "Innovation"];
>>>>>>> origin/main

export const INTRO_STATS = [
  { value: "04", label: "Ways to participate" },
  { value: "06+", label: "Voices in the room" },
  { value: "01", label: "City — Jaipur" },
  { value: "TBA", label: "Venue — announced soon" },
];

export const WHY_ITEMS = [
  {
    index: "01",
    title: "Startup Opportunity",
    description:
      "Present your vision to a room that is actually listening. Get honest reactions, useful questions, and the kind of feedback you can't buy.",
    tags: ["Pitch", "Visibility", "Feedback"],
  },
  {
    index: "02",
    title: "Business Networking",
    description:
      "Founders, operators, students and investors in one place — the conversations here tend to outlive the event itself.",
    tags: ["Founders", "Operators", "Peers"],
  },
  {
    index: "03",
    title: "Ideas & Innovation",
    description:
      "From early student ideas to scaling businesses — see what is being built and where the energy in the room is pointing.",
    tags: ["Ideas", "E-Sales", "New Models"],
  },
  {
    index: "04",
    title: "Learn & Grow",
    description:
      "Sit with experienced professionals and people who have tried, failed and built. Leave with better questions than you arrived with.",
    tags: ["Insights", "Mentorship", "Perspective"],
  },
  {
    index: "05",
    title: "Funding Conversations",
    description:
      "Where promising ideas meet opportunity. Explore what funding conversations actually look like — and how to be ready for yours.",
    tags: ["Funding", "Investment", "Readiness"],
  },
];

export const EXPERIENCE_STEPS = [
  {
    index: "01",
    title: "Arrive",
    description: "Walk into a room designed for one thing — momentum. Check in, settle in, take the temperature.",
  },
  {
    index: "02",
    title: "Connect",
    description: "The room opens early for a reason. Introductions over notes, names over business cards.",
  },
  {
    index: "03",
    title: "Discover",
    description: "Ideas on stage, businesses in conversation, and a crowd that came to pay attention.",
  },
  {
    index: "04",
    title: "Pitch",
    description: "Founders step up. Ideas get questioned, sharpened and remembered. The floor reacts honestly.",
  },
  {
    index: "05",
    title: "Learn",
    description: "Conversations with people who have built things — on scaling, selling, and what money actually follows.",
  },
  {
    index: "06",
    title: "Grow",
    description: "You leave with more than memories — clarity, connections, and next steps you can act on.",
  },
];

export const CATEGORIES = [
  {
    id: "student",
    index: "01",
    title: "Student",
    tagline: "For ambitious students & emerging ideas",
    description:
      "Walk in with your idea — however early it is. This is where it meets its first audience and its first real questions.",
    cta: "Register as student",
  },
  {
    id: "startup",
    index: "02",
    title: "Startup",
    tagline: "For founders building something real",
    description:
      "Show your business to investors, operators and peers. Come for the pitch — leave with the connections.",
    cta: "Register as startup",
  },
  {
    id: "school",
    index: "03",
    title: "School",
    tagline: "For institutions & young innovators",
    description:
      "A dedicated space for schools shaping the next generation of founders, builders and bold thinkers.",
    cta: "Register as school",
  },
  {
    id: "visitor",
    index: "04",
    title: "Visitor",
    tagline: "For those who want to be in the room",
    description:
      "No pitch, no pressure. Just the best seats in the house for ideas, investments and honest conversations.",
    cta: "Register as visitor",
  },
];

export const CATEGORY_SHORT = {
  student: "Bring your idea",
  startup: "Pitch your business",
  school: "Champion young innovators",
  visitor: "Experience the room",
};

export const FUNDING_THEMES = [
  "Startup opportunities",
  "Business growth",
  "Investment conversations",
  "Scaling businesses",
  "Innovation & new models",
];

export const SCHOOL_FUNDING = {
  count: "03",
  label: "schools in conversation",
  body: "A special funding-focused dialogue is being curated with select schools — a space for young innovators and the institutions that back them.",
  schools: [
    { name: "School 01", status: "To be announced" },
    { name: "School 02", status: "To be announced" },
    { name: "School 03", status: "To be announced" },
  ],
  note: "Participants and details will be confirmed ahead of the event.",
};

export const HOW_IT_WORKS = [
  {
    index: "01",
    title: "Register",
    description: "Tell us you're coming — pick the category that matches how you want to show up.",
  },
  {
    index: "02",
    title: "Choose your category",
    description: "Student, startup, school or visitor. Each path has its own place in the room.",
  },
  {
    index: "03",
    title: "Share your details",
    description: "A short form. Your idea, your business, or simply your interest in being there.",
  },
  {
    index: "04",
    title: "Join the experience",
    description: "We confirm your seat. You show up on the 20th and make the room count.",
  },
];

export const QA_SESSION = {
  host: "Aman",
  hostNote: "Q&A & discussion session — details subject to change",
  quote: "No question too early. No idea too small.",
  steps: [
    {
      index: "01",
      title: "Ask",
      text: "Questions from the floor — about ideas, business, money and everything in between.",
    },
    {
      index: "02",
      title: "Challenge",
      text: "Respectful pushback. The best answers are earned through honest questioning.",
    },
    {
      index: "03",
      title: "Learn",
      text: "Real answers, no scripts. You leave with what you came for — clarity.",
    },
  ],
};

export const HIGHLIGHTS = [
  "Startup Ideas",
  "Business Insights",
  "Networking",
  "Funding Opportunities",
  "Scaling Businesses",
  "E-Sales",
  "Student Ideas",
  "Innovation",
];

// ─────────────────────────────────────────────────────────────
// REGISTRATION FORM — field definitions per category.
// Backend-ready: each field maps to a plain payload key on submit.
// ─────────────────────────────────────────────────────────────

export const FORM_FIELDS = {
  student: [
    { name: "fullName", label: "Full Name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "college", label: "College / Institution", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "interest", label: "Idea / Interest", type: "text", required: false },
    {
      name: "description",
      label: "Short Description",
      type: "textarea",
      required: true,
      rows: 4,
      hint: "Your idea, or what you hope to gain — two or three lines is plenty.",
    },
  ],
  startup: [
    { name: "founderName", label: "Founder Name", type: "text", required: true, autoComplete: "name" },
    { name: "startupName", label: "Startup Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "city", label: "City", type: "text", required: true },
    { name: "industry", label: "Industry / Category", type: "text", required: true },
    {
      name: "startupDescription",
      label: "Startup Description",
      type: "textarea",
      required: true,
      rows: 4,
      hint: "What you build, who it serves, and the traction so far.",
    },
    { name: "website", label: "Website / LinkedIn (optional)", type: "url", required: false },
  ],
  school: [
    { name: "contactPerson", label: "Contact Person Name", type: "text", required: true, autoComplete: "name" },
    { name: "schoolName", label: "School Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "city", label: "City", type: "text", required: true },
    {
      name: "schoolDescription",
      label: "Student / Innovation Description",
      type: "textarea",
      required: true,
      rows: 4,
      hint: "What your students are building, and how the school champions innovation.",
    },
  ],
  visitor: [
    { name: "fullName", label: "Full Name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "city", label: "City", type: "text", required: true },
  ],
};
