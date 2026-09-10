// ─────────────────────────────────────────────────────────────
// EVENT CONFIGURATION — SHA-safe single source of truth for event copy.
// BMI Business Growth Forum — independent non-education platform.
// Edit everything here; the UI reads from this file.
// ─────────────────────────────────────────────────────────────

export const EVENT = {
  org: "BMI",
  orgFull: "BMI Presents",
  officialName: "BMI Business Growth Forum Jaipur 2026",
  tagline: "Capital, Strategy and Scale for Non-Education Businesses",
  city: "Jaipur",
  cityLong: "Jaipur, Rajasthan",
  date: "20th September",
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
  hero: "/videos/apna_jaipur.mp4",
  networking: "/images/image3.png",
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
  "Founder Pitches",
  "Capital Connect",
  "Business Networking",
  "Early Ideas",
  "Strategy Sessions",
  "Innovation",
];

export const INTRO_WORDS = [
  "IDEAS",
  "STARTUPS",
  "NETWORKING",
  "CAPITAL CONNECT",
  "INNOVATION",
  "MENTORSHIP",
];

export const INTRO_MEDIA_CAPTION = {
  headline: "Capital. Capability. Connections.",
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
  { value: "Stardom Resort", label: "Venue — Jaipur Rajasthan" },
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
      "Founders, operators, early innovators and partners in one place — the conversations here tend to outlive the event itself.",
    tags: ["Founders", "Operators", "Peers"],
  },
  {
    index: "03",
    title: "Ideas & Innovation",
    description:
      "From early-stage ideas to scaling businesses — see what is being built and where the energy in the event is pointing.",
    tags: ["Ideas", "Growth", "New Models"],
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
    title: "Capital Connect Conversations",
    description:
      "Where promising ideas meet opportunity. Explore how deal-specific introductions work and how to be ready for yours — with independent evaluation at every step.",
    tags: ["Capital Connect", "Readiness", "Evaluation"],
  },
];

export const EXPERIENCE_STEPS = [
  {
    index: "01",
    title: "Beyond Capital Alone",
    description: "Capital connect can be combined with practical business support.",
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
    description: "Personalized guidance from industry specialists.",
  },
  {
    index: "05",
    title: "Capital Connect Sessions",
    description: "Deal-specific introductions — each participant decides independently.",
  },
];

export const WHAT_TO_EXPECT = [
  "Curated participation across stages",
  "Industry led conversations",
  "Strategic networking opportunities",
  "Potential next step evaluation for selected ventures",
];

export const EXPERIENCE_CLOSING_LINE =
  "From arrival to opportunity — BMI is designing an experience built for serious founders and growth focused non-education businesses.";

export const CATEGORIES = [
  {
    id: "student",
    index: "01",
    title: "Early Innovator",
    tagline: "For ambitious early-stage ideas from non-education sectors",
    description:
      "Walk in with your idea however early it is. This is where it meets its first audience and its first real questions — focused on non-education businesses.",
    cta: "Register as early innovator",
  },
  {
    id: "visitor",
    index: "02",
    title: "Visitor",
    tagline: "For those who want to be in the event",
    description:
      "No pitch, no pressure. Just the best seats in the house for ideas, capital-connect conversations and honest business dialogue.",
    cta: "Register as visitor",
  },
  {
    id: "entrepreneur",
    index: "03",
    title: "Entrepreneur",
    tagline: "For founders building something real",
    description:
      "Show your business to operators, peers and interested participants. Come for the pitch — leave with the connections.",
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

// Single source of truth for registration fees per category.
// Fees are for event participation only — not investment or capital contribution.
export const REGISTRATION_FEES = {
  student: 0,
  visitor: 500,
  entrepreneur: 1000,
  businessTycoon: 2000,
};

export const PAYMENT_UPI_ID = "bmipresents@upi";

export const WHATSAPP_NUMBER = "919752430783";
export const WHATSAPP_MESSAGE =
  "Hello! I'm interested in the BMI Business Growth Forum in Jaipur. I need help with registration. Please guide me.";

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
      title: "Stage-Appropriate Capital Connect",
      description: "Deal-specific introductions after screening — no pooled funds or guaranteed outcomes.",
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
    title: "Apply",
    description: "Register and pick the category that matches how you want to show up.",
  },
  {
    index: "02",
    title: "Screen",
    description: "We review sector fit and compliance — non-education focus and conflict checks.",
  },
  {
    index: "03",
    title: "Evaluate",
    description: "Share your idea, business, or interest. Selected paths may proceed to deeper review.",
  },
  {
    index: "04",
    title: "Connect & Grow",
    description: "Join the forum on 20th September — network, learn, and explore next steps.",
  },
];

export const QA_SESSION = {
  quote: "No question too early. No idea too small.",
};

export const QA_FAQ = [
  {
    question: "Who can apply to pitch?",
    answer:
      "Founders, startups and operating businesses in non-education sectors with a clear idea, product, service or growth opportunity can apply. Applications are reviewed based on relevance, readiness and compliance screening.",
  },
  {
    question: "Is there an application fee?",
    answer:
      "Any applicable registration or participation fee will be communicated clearly during the registration process. Fees are for event participation only — not an investment or capital contribution.",
  },
  {
    question: "How are startups selected?",
    answer:
      "Applications are reviewed based on stage, clarity, business potential, execution readiness, sector fit and the event's evaluation criteria. Restricted education/coaching sectors may be held or declined.",
  },
  {
    question: "Do interested participants get materials in advance?",
    answer:
      "Relevant venture information may be shared with selected evaluators before scheduled pitch or discussion sessions, where appropriate. Every participant decides independently.",
  },
  {
    question: "Can I attend without pitching?",
    answer:
      "Yes. Participants may attend for learning, networking, expert interactions and business conversations without pitching, depending on the selected registration category.",
  },
  {
    question: "Is the forum streamed?",
    answer:
      "Streaming or digital access details will be announced separately if available.",
  },
];

export const HIGHLIGHTS = [
  "Startup Ideas",
  "Business Insights",
  "Networking",
  "Capital Connect",
  "Scaling Businesses",
  "Strategy",
  "Early Ideas",
  "Innovation",
];

// ─────────────────────────────────────────────────────────────
// EVENT AGENDA — proposed schedule, subject to change.
// ─────────────────────────────────────────────────────────────

export const EVENT_AGENDA = [
  { time: "09:00 AM", title: "Registration & Founder Coffee", description: "Networking and welcome refreshments" },
  { time: "09:45 AM", title: "BMI Launch AV", description: "The journey begins" },
  { time: "10:00 AM", title: "Opening & BMI Vision", description: "Setting the vision for responsible business growth" },
  { time: "10:20 AM", title: "Keynote: Brajesh Maheshwari", description: "Business Building, Leadership and Growth Thinking" },
  { time: "10:45 AM", title: "Aman Maheshwari Session", description: "The New Generation of Entrepreneurship" },
  { time: "11:05 AM", title: "Business Leaders Panel", description: "Industry insights, opportunities and the road ahead" },
  { time: "11:45 AM", title: "BMI Idea Lab", description: "Early innovators pitch non-education ideas" },
  { time: "12:20 PM", title: "BMI Build — Startup Pitches", description: "Early stage startups pitch to experts" },
  { time: "01:30 PM", title: "Founder & Business Networking Lunch", description: "Connections over curated lunch" },
  { time: "02:30 PM", title: "Vikas Patel Session", description: "AI for Business: From Hype to Execution" },
  { time: "03:00 PM", title: "BMI Scale — Business Presentations", description: "Operating businesses present growth opportunities" },
  { time: "04:00 PM", title: "Expert Clinics & Networking", description: "1:1 expert interactions and ecosystem connections" },
  { time: "04:30 PM", title: "BMI Capital Connect Session", description: "Top founders and businesses in closed-door evaluation" },
  { time: "05:30 PM", title: "Recognition & Diligence Selections", description: "Shortlisted ventures announced for next stage" },
  { time: "06:00 PM", title: "BMI Future Roadmap & Closing", description: "What's next for founders and the ecosystem" },
];

export const EXPERIENCE_SPECIAL = [
  {
    index: "01",
    title: "Curated Participants",
    description: "High value founders, businesses, experts and partners.",
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
    title: "Deal-Specific Opportunities",
    description: "Get evaluated for capital-connect and support — independent decisions only.",
  },
  {
    index: "05",
    title: "Beyond Capital Alone",
    description: "Access management, technology, operations and market support.",
  },
];

export const EVENT_VALUE_STRIP = [
  { title: "Discover", description: "Promising ideas and businesses." },
  { title: "Evaluate", description: "Expert led screening and due diligence." },
  { title: "Support", description: "Capital, capability and connections." },
  { title: "Scale", description: "Build sustainable and impactful enterprises." },
];

// ─────────────────────────────────────────────────────────────
// SECTOR FOCUS — non-education high-growth sectors.
// ─────────────────────────────────────────────────────────────

export const SECTOR_FOCUS_HEADING = "Building India's tomorrow.";

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
    description: "New age brands and consumer experiences.",
  },
  {
    index: "12",
    title: "Emerging & Deep Tech",
    description: "Tech enabling breakthrough innovations.",
  },
];

// ─────────────────────────────────────────────────────────────
// REGISTRATION FORM — field definitions per category.
// Includes SHA screening fields on every track.
// ─────────────────────────────────────────────────────────────

export const CATEGORY_OPTIONS = [
  "AI & Tech",
  "Healthcare",
  "Manufacturing",
  "Agritech",
  "SaaS & Digital",
  "Consumer & FMCG",
  "Energy & Climate",
  "Fintech",
  "Logistics",
  "Mobility & EV",
  "Retail & D2C",
  "Other",
];

export const BUSINESS_CATEGORY_OPTIONS = CATEGORY_OPTIONS;

export const YES_NO_OPTIONS = ["No", "Yes"];

/** Shared SHA screening fields appended to every category form. */
export const COMPLIANCE_FIELDS = [
  {
    name: "businessSector",
    label: "Business Sector",
    type: "select",
    required: true,
    options: CATEGORY_OPTIONS,
  },
  {
    name: "educationConnection",
    label:
      "Are you connected with coaching, test-prep, education, edtech or student services?",
    type: "select",
    required: true,
    options: YES_NO_OPTIONS,
  },
  {
    name: "allenConnection",
    label:
      "Do you have any current or past relation with Allen / ACIPL as employee, faculty, student, vendor, consultant, partner or ex-employee?",
    type: "select",
    required: true,
    options: YES_NO_OPTIONS,
  },
];

export const FORM_FIELDS = {
  student: [
    { name: "fullName", label: "Full Name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "college", label: "College / Institution", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "role", label: "Role", type: "text", required: true },
    { name: "interest", label: "Idea / Interest", type: "text", required: false },
    {
      name: "description",
      label: "Short Description",
      type: "textarea",
      required: true,
      rows: 4,
      hint: "Your idea (non-education sector) or what you hope to gain — two or three lines is plenty.",
    },
    ...COMPLIANCE_FIELDS,
  ],
  entrepreneur: [
    { name: "founderName", label: "Founder Name", type: "text", required: true, autoComplete: "name" },
    { name: "startupName", label: "Startup Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "city", label: "City", type: "text", required: true },
    { name: "role", label: "Role", type: "text", required: true },
    { name: "industry", label: "Industry / Category", type: "select", required: true, options: CATEGORY_OPTIONS },
    {
      name: "startupDescription",
      label: "Startup Description",
      type: "textarea",
      required: true,
      rows: 4,
      hint: "What you build, who it serves, and the traction so far.",
    },
    { name: "website", label: "Website / LinkedIn (optional)", type: "url", required: false },
    ...COMPLIANCE_FIELDS,
  ],
  businessTycoon: [
    { name: "contactPerson", label: "Contact Person Name", type: "text", required: true, autoComplete: "name" },
    { name: "businessName", label: "Business Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "city", label: "City", type: "text", required: true },
    { name: "role", label: "Role", type: "text", required: true },
    { name: "businessCategory", label: "Business Category", type: "select", required: true, options: BUSINESS_CATEGORY_OPTIONS },
    {
      name: "businessDescription",
      label: "Business Description",
      type: "textarea",
      required: true,
      rows: 4,
      hint: "What your business builds, and how you champion growth and innovation.",
    },
    ...COMPLIANCE_FIELDS,
  ],
  visitor: [
    { name: "fullName", label: "Full Name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Email Address", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "city", label: "City", type: "text", required: true },
    { name: "role", label: "Role", type: "text", required: true },
    ...COMPLIANCE_FIELDS,
  ],
};
