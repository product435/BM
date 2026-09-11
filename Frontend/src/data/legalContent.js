// ─────────────────────────────────────────────────────────────
// LEGAL & COMPLIANCE — SHA-safe single source of truth.
// Independence disclaimer, Privacy Policy, Terms, Compliance Note.
// Used by legal pages, footer, registration, and event sections.
// ─────────────────────────────────────────────────────────────

export const INDEPENDENCE_DISCLAIMER =
  "BMI is an independent non-education business growth platform. It is not associated with, sponsored by, endorsed by, or backed by Allen Career Institute or any Allen group company.";

export const CAPITAL_CONNECT_DISCLAIMER =
  "Each participant must independently evaluate every opportunity. BMI does not pool investor funds, manage investor capital, or guarantee returns.";

export const EVENT_FOCUS_DECLARATION =
  "This event is focused on non-education businesses. BMI is an independent platform and is not associated with, sponsored by, endorsed by, or backed by Allen Career Institute or any Allen group company.";

export const REGISTRATION_DECLARATION =
  "I confirm that the information given by me is correct and I understand that BMI is an independent non-education platform.";

/** Keywords that trigger RED compliance flag on free-text fields. */
export const RESTRICTED_SECTOR_KEYWORDS = [
  "coaching",
  "jee",
  "neet",
  "test-prep",
  "test prep",
  "test preparation",
  "online coaching",
  "edtech",
  "ed-tech",
  "lms",
  "test engine",
  "study material",
  "faculty platform",
  "teacher recruitment",
  "student counselling",
  "student counseling",
  "competitive exam",
  "coaching erp",
  "digital marketing for coaching",
];

export const COMPLIANCE_PAGE = {
  title: "Compliance and Independence Note",
  eyebrow: "Legal",
  sections: [
    {
      heading: "Independent platform",
      body: [
        "BMI (BM Investment) is an independent non-education business growth platform. It provides practical strategy, structured evaluation, mentorship, capital connect introductions, and business networking for selected entrepreneurs and businesses.",
        INDEPENDENCE_DISCLAIMER,
      ],
    },
    {
      heading: "Non-education focus",
      body: [
        "BMI focuses on non-education businesses. Applications connected with coaching, test-prep, edtech, or restricted education services may be reviewed, held, or declined at BMI's sole discretion.",
        "BMI does not solicit Allen Career Institute employees, faculty, students, or vendors for education-related activity.",
      ],
    },
    {
      heading: "Capital connect — not a fund",
      body: [
        "BMI may facilitate deal specific introductions between screened founders and interested participants. Every participant must independently evaluate each opportunity and complete separate documentation.",
        CAPITAL_CONNECT_DISCLAIMER,
        "Nothing on this website constitutes investment advice, a solicitation to invest, or an offer of securities.",
      ],
    },
    {
      heading: "Screening and approval",
      body: [
        "Event registration, membership, pitch slots, and introductions are subject to sector screening and compliance review. BMI may reject or hold any application without obligation to accept restricted-sector or conflicted applicants.",
      ],
    },
  ],
};

export const PRIVACY_PAGE = {
  title: "Privacy Policy",
  eyebrow: "Legal",
  lastUpdated: "10 September 2026",
  sections: [
    {
      heading: "What we collect",
      body: [
        "We collect personal and business information only for registration, application review, business evaluation, event communication, and related lawful purposes. Typical fields include name, contact details, city, company information, sector, and optional business descriptions.",
      ],
    },
    {
      heading: "How we use information",
      body: [
        "Information is used to process applications, screen for restricted sectors and conflicts, communicate about the event or evaluation process, and improve our services. We do not sell personal data.",
      ],
    },
    {
      heading: "Confidentiality",
      body: [
        "Sensitive business information submitted through forms is treated as confidential and used only for evaluation and communication purposes described here.",
      ],
    },
    {
      heading: "No use of Allen / ACIPL data",
      body: [
        "BMI does not obtain or use Allen Career Institute / ACIPL databases, student records, faculty lists, or employee data for its platform, marketing, or applications.",
      ],
    },
    {
      heading: "Investor and founder data",
      body: [
        "Investor and founder information is used only for lawful purposes and on the basis of consent provided at registration or application.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You may request correction or deletion of your personal data as permitted under applicable law. Contact us via the details on the Contact page to make a request.",
      ],
    },
  ],
};

export const TERMS_PAGE = {
  title: "Terms and Conditions",
  eyebrow: "Legal",
  lastUpdated: "10 September 2026",
  sections: [
    {
      heading: "Independence",
      body: [
        INDEPENDENCE_DISCLAIMER,
      ],
    },
    {
      heading: "No investment advice",
      body: [
        "Website content is for general information about BMI's event and services. It is not investment advice, tax advice, or a recommendation to invest in any opportunity.",
      ],
    },
    {
      heading: "No guarantees",
      body: [
        "BMI does not guarantee funding, investor introductions, deal outcomes, or returns. Every founder and participant decision must be based on independent due diligence and separate documentation.",
      ],
    },
    {
      heading: "Restricted sectors",
      body: [
        "BMI is not obliged to accept applications from coaching, test-prep, edtech, or other restricted education sectors. BMI may reject, hold, or require additional review for any application, membership, pitch, or event participation.",
      ],
    },
    {
      heading: "Confidential information",
      body: [
        "Users must not submit Allen confidential information or any third-party confidential information they are not authorised to share.",
      ],
    },
    {
      heading: "Event registration fees",
      body: [
        "Where a registration fee applies, it is charged for event participation only. Fees are not an investment, capital contribution, or purchase of securities.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "BMI may update these terms, event details, venue, capacity, and lineup. Continued use of the website or participation in the event after updates constitutes acceptance of the revised terms where permitted by law.",
      ],
    },
  ],
};

export const CONTACT_PAGE = {
  title: "Contact",
  eyebrow: "Get in touch",
  intro:
    "Questions about the event, business evaluation, or capital-connect interest? Reach out and our team will guide you.",
  email: "admin@bminvestment.com",
  note: "For registration help, you can also use WhatsApp from the site footer or floating button.",
};
