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
  networking: "/images/Image1.jpeg",
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

export const INTRO_WORDS = ["IDEAS", "STARTUPS", "NETWORKING", "INVESTMENT", "INNOVATION"];

export const INTRO_MEDIA_CAPTION = {
  headline: "Funding is only the beginning",
  pills: [
    "Capital",
    "Management",
    "Technology",
    "Operations",
    "Network",
    "Growth",
    "Conversations",
    "Real Connections",
  ],
};

export const INTRO_STATS = [
  { value: "04", label: "Ways to participate" },
  { value: "06+", label: "Voices in the event" },
  { value: "01", label: "City — Jaipur" },
  { value: "TBA", label: "Venue — announced soon" },
];

export const WHY_ITEMS = [
  {
    index: "01",
    title: "Startup Opportunity",
    description:
      "Present your vision to an event that is actually listening. Get honest reactions, useful questions, and the kind of feedback you can't buy.",
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
      "From early student ideas to scaling businesses — see what is being built and where the energy in the event is pointing.",
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
    title: "Beyond Funding",
    description: "Capital can be combined with practical business support.",
  },
  {
    index: "02",
    title: "Stage-Based Evaluation",
    description: "Ideas, startups and operating businesses are assessed differently.",
  },
  {
    index: "03",
    title: "Expert-Led Support",
    description: "Access to operators, specialists and strategic guidance.",
  },
  {
    index: "04",
    title: "Business Ecosystem",
    description: "Founders, industry, sponsors and experts connect under one platform.",
  },
];

export const EXPERIENCE_HIGHLIGHTS = [
  {
    index: "01",
    title: "Keynote Insights",
    description: "Thought leadership from visionaries and experts.",
  },
  {
    index: "02",
    title: "Founder Pitches",
    description: "Promising startups pitch ideas to a focused audience.",
  },
  {
    index: "03",
    title: "Networking Lunch",
    description: "Meaningful conversations that spark real opportunities.",
  },
  {
    index: "04",
    title: "Expert Clinic",
    description: "Personalized advice from industry specialists.",
  },
  {
    index: "05",
    title: "Investment Conversations",
    description: "Connect with investors and explore next steps.",
  },
];

export const WHAT_TO_EXPECT = [
  "Curated participation across stages",
  "Industry-led conversations",
  "Strategic networking opportunities",
  "Potential next-step evaluation for selected ventures",
];

export const EXPERIENCE_CLOSING_LINE =
  "From arrival to opportunity — BMI is designing an experience built for serious founders and growth-focused businesses.";

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
    id: "visitor",
    index: "02",
    title: "Visitor",
    tagline: "For those who want to be in the event",
    description:
      "No pitch, no pressure. Just the best seats in the house for ideas, investments and honest conversations.",
    cta: "Register as visitor",
  },
  {
    id: "entrepreneur",
    index: "03",
    title: "Entrepreneur",
    tagline: "For founders building something real",
    description:
      "Show your business to investors, operators and peers. Come for the pitch — leave with the connections.",
    cta: "Register as entrepreneur",
  },
  {
    id: "businessTycoon",
    index: "04",
    title: "Business Tycoon",
    tagline: "For established leaders scaling something bigger",
    description:
      "A dedicated space for business leaders shaping the next generation of founders, builders and bold thinkers.",
    cta: "Register as business tycoon",
  },
];

export const CATEGORY_SHORT = {
  student: "Bring your idea",
  visitor: "Experience the event",
  entrepreneur: "Pitch your business",
  businessTycoon: "Champion the next generation",
};

export const FUNDING_AUDIENCE = [
  {
    index: "01",
    title: "Innovators",
    description: "Ideas with potential",
  },
  {
    index: "02",
    title: "Startup Founders",
    description: "Building and validating",
  },
  {
    index: "03",
    title: "Existing Businesses",
    description: "Ready for growth",
  },
  {
    index: "04",
    title: "Entrepreneurs & Experts",
    description: "Experience and mentorship",
  },
  {
    index: "05",
    title: "Strategic Partners",
    description: "Brands, networks and ecosystem participants",
  },
];

export const BMI_SUPPORT_MODEL = {
  label: "The BMI support model",
  items: [
    {
      index: "01",
      title: "Potential Investment",
      description: "Stage-appropriate capital support by BMI.",
    },
    {
      index: "02",
      title: "Management Guidance",
      description: "Expert mentors and industry specialists for practical support.",
    },
    {
      index: "03",
      title: "Operational Support",
      description: "Process, systems, strategy and execution support.",
    },
    {
      index: "04",
      title: "Technology Enablement",
      description: "Access to technology, tools and digital capabilities.",
    },
    {
      index: "05",
      title: "Network Access",
      description: "Connections with entrepreneurs, experts and partners.",
    },
  ],
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
    description: "Student, startup, school or visitor. Each path has its own place in the event.",
  },
  {
    index: "03",
    title: "Share your details",
    description: "A short form. Your idea, your business, or simply your interest in being there.",
  },
  {
    index: "04",
    title: "Join the experience",
    description: "We confirm your seat. You show up on the 20th and make the event count.",
  },
];

export const QA_SESSION = {
  quote: "No question too early. No idea too small.",
};

export const QA_FAQ = [
  {
    question: "Who can apply to pitch?",
    answer:
      "Founders, startups and operating businesses with a clear idea, product, service or growth opportunity can apply. Applications are reviewed based on relevance and readiness.",
  },
  {
    question: "Is there an application fee?",
    answer:
      "Any applicable registration or participation fee will be communicated clearly during the registration process.",
  },
  {
    question: "How are startups selected?",
    answer:
      "Applications are reviewed based on stage, clarity, business potential, execution readiness and fit with the event's evaluation criteria.",
  },
  {
    question: "Do investors get materials in advance?",
    answer:
      "Relevant venture information may be shared with selected investors and evaluators before scheduled pitch or discussion sessions, where appropriate.",
  },
  {
    question: "Can I attend without pitching?",
    answer:
      "Yes. Participants may attend for learning, networking, expert interactions and business conversations without pitching, depending on the selected registration category.",
  },
  {
    question: "Is the summit streamed?",
    answer:
      "Streaming or digital access details will be announced separately if available.",
  },
];

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
// EVENT AGENDA — proposed schedule, subject to change.
// Single source of truth: edit time/title/description here only.
// ─────────────────────────────────────────────────────────────

export const EVENT_AGENDA = [
  { time: "09:00 AM", title: "Registration & Founder Coffee", description: "Networking and welcome refreshments" },
  { time: "09:45 AM", title: "BMI Launch AV", description: "The journey begins" },
  { time: "10:00 AM", title: "Opening & BMI Vision", description: "Setting the vision for a new era of entrepreneurship" },
  { time: "10:20 AM", title: "Keynote: Brajesh Maheshwari", description: "From Vision to Execution" },
  { time: "10:45 AM", title: "Aman Maheshwari Session", description: "The New Generation of Entrepreneurship" },
  { time: "11:05 AM", title: "Business Leaders Panel", description: "Industry insights, opportunities and the road ahead" },
  { time: "11:45 AM", title: "BMI Idea Lab", description: "Student innovators pitch their ideas" },
  { time: "12:20 PM", title: "BMI Build — Startup Pitches", description: "Early-stage startups pitch to experts" },
  { time: "01:30 PM", title: "Founder & Business Networking Lunch", description: "Connections over curated lunch" },
  { time: "02:30 PM", title: "Vikas Patel Session", description: "AI for Business: From Hype to Execution" },
  { time: "03:00 PM", title: "BMI Scale — Business Presentations", description: "Operating businesses present growth opportunities" },
  { time: "04:00 PM", title: "Expert Clinics & Networking", description: "1:1 expert interactions and ecosystem connections" },
  { time: "04:30 PM", title: "BMI Investment Event", description: "Top founders and businesses in closed-door evaluation" },
  { time: "05:30 PM", title: "Recognition & Diligence Selections", description: "Shortlisted ventures announced for next stage" },
  { time: "06:00 PM", title: "BMI Future Roadmap & Closing", description: "What's next for founders and the ecosystem" },
];

export const EXPERIENCE_SPECIAL = [
  {
    index: "01",
    title: "Curated Participants",
    description: "High-value founders, businesses, experts and partners.",
  },
  {
    index: "02",
    title: "Actionable Insights",
    description: "Practical knowledge from industry leaders.",
  },
  {
    index: "03",
    title: "Powerful Networking",
    description: "Meet the right people to collaborate and grow.",
  },
  {
    index: "04",
    title: "Investment Opportunities",
    description: "Get evaluated for potential investment and support.",
  },
  {
    index: "05",
    title: "Beyond Funding",
    description: "Access management, technology, operations and market support.",
  },
];

export const EVENT_VALUE_STRIP = [
  { title: "Discover", description: "Promising ideas and businesses." },
  { title: "Evaluate", description: "Expert-led screening and due diligence." },
  { title: "Support", description: "Capital, capability and connections." },
  { title: "Scale", description: "Build sustainable and impactful enterprises." },
];

// ─────────────────────────────────────────────────────────────
// SECTOR FOCUS — high-growth sectors, shown as cards on the
// final CTA section. Single source of truth: edit here only.
// ─────────────────────────────────────────────────────────────

export const SECTOR_FOCUS_HEADING = "Investing in India's tomorrow.";

export const SECTOR_FOCUS = [
  {
    index: "01",
    title: "AI & Technology",
    description: "Building intelligent solutions for the future.",
  },
  {
    index: "02",
    title: "SaaS & Digital",
    description: "Scalable platforms solving real problems.",
  },
  {
    index: "03",
    title: "Consumer & FMCG",
    description: "Products and brands for a growing India.",
  },
  {
    index: "04",
    title: "Healthcare & Wellness",
    description: "Improving lives through innovation.",
  },
  {
    index: "05",
    title: "Energy & Climate",
    description: "Sustainable solutions for a better tomorrow.",
  },
  {
    index: "06",
    title: "Manufacturing & Industry",
    description: "Strengthening India's industrial backbone.",
  },
  {
    index: "07",
    title: "Fintech & Financial Services",
    description: "Technology-driven financial innovation.",
  },
  {
    index: "08",
    title: "Logistics & Supply Chain",
    description: "Moving businesses more efficiently.",
  },
  {
    index: "09",
    title: "Agritech & Food",
    description: "Empowering agriculture and food systems.",
  },
  {
    index: "10",
    title: "Mobility & EV",
    description: "Powering the future of transportation.",
  },
  {
    index: "11",
    title: "Retail & D2C",
    description: "New-age brands and consumer experiences.",
  },
  {
    index: "12",
    title: "Emerging & Deep Tech",
    description: "Tech enabling breakthrough innovations.",
  },
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
  entrepreneur: [
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
  businessTycoon: [
    { name: "contactPerson", label: "Contact Person Name", type: "text", required: true, autoComplete: "name" },
    { name: "businessName", label: "Business Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "city", label: "City", type: "text", required: true },
    {
      name: "businessDescription",
      label: "Business Description",
      type: "textarea",
      required: true,
      rows: 4,
      hint: "What your business builds, and how you champion growth and innovation.",
    },
  ],
  visitor: [
    { name: "fullName", label: "Full Name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "city", label: "City", type: "text", required: true },
  ],
};
