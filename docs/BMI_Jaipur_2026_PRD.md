# BMI Jaipur 2026 — Product Requirements Document (PRD)

**Product:** BMI Jaipur 2026 — Event Registration & Participation Platform  
**Event Name:** BMI Startup & Business Launch 2026 (Jaipur Launch Event)  
**Tagline:** *Capital. Capability. Connections. Funding is only the beginning.*  
**Core Theme:** Ideas • Execution • Enterprise • Scale  
**Event Date:** 15 September 2026  
**Location:** Jaipur, Rajasthan, India (Venue: To Be Announced / Decided)  
**Document Version:** 2.0 (Brochure Aligned & Production Ready)  
**Status:** Approved Specification — Ready for Implementation  
**Platform Architecture:** Modern Single-Page Application (SPA) + Participant Portal + Comprehensive Admin Management System  

---

## 1. Executive Summary

**BMI Startup & Business Launch 2026** is a flagship entrepreneurship, startup, and business scaling event organized by **BM Investment (BMI)** in Jaipur on **15 September 2026**.

The digital platform is not merely a static brochure website; it is an **End-to-End Event Participation & Lifecycle Management Platform** that handles:
1. **Public Discovery & Conversion:** Engaging Single-Page Application (SPA) highlighting the vision, keynote speakers, agenda, sectors, and sponsorship tiers.
2. **Track-Based Registration System:** 4 distinct participant categories with custom forms, document uploads, and validation.
3. **Integrated Payment Processing:** Instant payment gateway for paid categories (e.g., BMI Scale at ₹2,499) with 100% free registration for Students/Idea Lab.
4. **Application Review & Shortlisting Pipeline:** Admin evaluation workflow with clear multi-state progression (`Submitted` → `Under Review` → `Shortlisted` / `Waitlisted` → `Selected / Confirmed`).
5. **Dynamic Digital Ticketing & PDF Passes:** Secure, branded PDF passes with QR codes, download tracking, and guaranteed idempotent repeat downloads (same ticket ID and QR code every time).
6. **Live Timeline & Status Tracker:** Real-time visibility for participants on where their application stands.
7. **Comprehensive Admin Dashboard:** Complete control over registrations, payments, shortlisting, content CMS (Speakers, Agenda, Venue, FAQs), and data export (CSV/Excel).

---

## 2. Participation Tracks & Pricing Model

Directly aligned with the official BMI Launch 2026 framework:

| Track # | Track Name | Target Audience | Fee Structure | Selection / Review Model | Pass / Ticket Type |
|---|---|---|---|---|---|
| **Track 01** | **BMI IDEA LAB** | Student innovators, E-Cell participants, early ideators | **FREE (₹0)** | Basic verification / college ID check | Student / Innovator Pass |
| **Track 02** | **BMI BUILD** | Early startups, MVPs, prototypes, execution stage | **Application Based** (Configurable Fee) | Mandatory Admin Review & Shortlisting | Startup Pitch Pass |
| **Track 03** | **BMI SCALE** | Existing operating businesses & growth ventures | **₹2,499** (Online Registration) | Instant confirmation post-payment (Admin verification optional) | Business Delegate Pass |
| **Track 04** | **BMI INVESTMENT ROOM** | Top shortlisted high-potential startups & scale ventures | **By Selection Only** | Curated invite after review | Exclusive Closed-Door Access Pass |
| **General** | **VISITORS / DELEGATES** | General attendees, investors, corporate leaders, ecosystem partners | **Paid** (Configurable pass fee) | Instant confirmation post-payment | Visitor / Delegate Pass |

---

## 3. Public Single-Page Application (SPA) Structure

The public portal will be a high-converting, responsive single-page experience structured as follows:

```text
[1. Sticky Top Navigation]
    ├── Logo (BM Investment)
    ├── About BMI & Vision
    ├── Tracks / Who Can Apply
    ├── Keynote Speakers & Leaders
    ├── Schedule (Proposed Agenda)
    ├── Focus Sectors (12 Pillars)
    ├── Sponsorship Packages
    ├── Venue & Date (15 Sept 2026)
    ├── FAQs
    └── CTAs: [Track Status / Login] | [Register Now]

[2. Hero Section]
    ├── Event Title: BMI Startup & Business Launch 2026
    ├── Sub-headline: CAPITAL. CAPABILITY. CONNECTIONS.
    ├── Philosophy: "Funding is only the beginning"
    ├── Key Highlights Badge: Ideas → Execution → Enterprise → Scale
    ├── Date & Location: 15 September 2026 • Jaipur, Rajasthan
    ├── Live Countdown Timer
    └── Primary CTAs: [Register / Choose Track] | [Explore Agenda]

[3. The BMI Support Model & Experience]
    ├── 01 Potential Investment (Stage-appropriate capital support)
    ├── 02 Management Guidance (Expert mentors and industry specialists)
    ├── 03 Operational Support (Process, systems, strategy & execution)
    ├── 04 Technology Enablement (Access to tools and digital capabilities)
    └── 05 Network Access (Entrepreneurs, experts, and market reach)

[4. Participation Tracks (Choose Your Track)]
    ├── Track 01: BMI IDEA LAB (Free • Student & Early Ideas)
    ├── Track 02: BMI BUILD (Application Based • MVPs & Startups)
    ├── Track 03: BMI SCALE (₹2,499 • Existing Businesses & Growth)
    └── Track 04: BMI INVESTMENT ROOM (By Selection Only)

[5. Proposed Event Day Flow (Agenda)]
    ├── 09:00 AM — Registration & Founder Coffee
    ├── 09:45 AM — BMI Launch Opening & AV
    ├── 10:00 AM — Welcome & BMI Vision
    ├── 10:20 AM — Keynote: Brajesh Maheshwari (From Vision to Execution)
    ├── 10:45 AM — Aman Maheshwari Session (New Generation Entrepreneurship)
    ├── 11:15 AM — Business Leaders Panel
    ├── 11:45 AM — BMI Idea Lab Showcase
    ├── 12:20 PM — BMI Build Startup Pitches
    ├── 01:30 PM — Founder & Business Networking Lunch
    ├── 02:30 PM — AI for Business Session by Vikas Patel (Hype to Execution)
    ├── 03:00 PM — BMI Scale Business Presentations
    ├── 04:00 PM — Expert Clinics & Partner Networking
    ├── 04:30 PM — BMI Investment Room (Closed-Door Evaluation)
    ├── 05:30 PM — Recognitions & Diligence Selections
    └── 06:00 PM — BMI Future Roadmap & Closing Networking

[6. Keynote Speakers, Panelists & Jury]
    ├── Brajesh Maheshwari (Keynote Speaker)
    ├── Aman Maheshwari (Speaker / Leader)
    ├── Vikas Patel (AI for Business Specialist)
    └── Industry Experts, Mentors & Investment Committee

[7. 12 Sectors of Focus]
    ├── AI & Technology, SaaS & Digital, Consumer & FMCG
    ├── Healthcare & Wellness, Energy & Climate, Manufacturing & Industry
    ├── Fintech & Financial Services, Logistics & Supply Chain, Agritech & Food
    └── Mobility & EV, Retail & D2C, Emerging & Deep Tech

[8. Sponsorship & Partner Packages]
    ├── Title Partner (₹3,00,000+)
    ├── Powered By Partner (₹1,50,000+)
    ├── Category Partner (₹75,000 – ₹1,00,000)
    ├── Networking Partner (₹50,000+)
    └── Associate Partner (₹25,000+)

[9. Venue, Location & Logistics]
    ├── Date: 15 September 2026
    ├── City: Jaipur, Rajasthan
    ├── Venue: To Be Announced (Google Maps integration ready)
    └── Transport & Reporting Instructions

[10. Interactive FAQs Accordion]
    ├── Registration, Shortlisting, Payments, Pass Downloads, Event Day

[11. Legal & Disclaimer Footer]
    ├── Independent Initiative Disclaimer (Not affiliated with Allen Career Institute)
    ├── Privacy Policy, Terms & Conditions, Cancellation & Refund Policy
    └── Contact Information & Social Channels
```

---

## 4. Detailed Registration & Application Forms

### 4.1 Track 01: Student Innovator / BMI Idea Lab (₹0 Free)
- **Personal Details:** Full Name, Email, Mobile Number, WhatsApp Number, City, State.
- **Academic Info:** College / University Name, Degree & Branch, Current Year/Semester, Student Roll/ID.
- **Verification Upload:** Student ID Card / College Bonafide (JPG, PNG, PDF max 5MB).
- **Idea Outline:** Project / Idea Name, Problem being solved, Current stage (Concept / Prototype), E-Cell Affiliation (Yes/No).
- **Outcome:** Generates Registration ID (`BMI26-STU-XXXXXX`), sets `Payment = NOT_REQUIRED`, `Status = SUBMITTED / CONFIRMED`.

### 4.2 Track 02: Startup / BMI Build (Application & Pitch)
- **Founder Details:** Founder Name, Co-founders, Email, Phone, LinkedIn Profile.
- **Startup Profile:** Startup Name, Brand Logo, Website URL, Year Founded, Registered Entity Type (Pvt Ltd, LLP, Prop, DPIIT recognized).
- **Stage:** Idea / Prototype / MVP / Early Revenue / Scaling.
- **Pitch Deck & Materials:** Pitch Deck Upload (PDF max 15MB), Demo Video Link (YouTube/Loom/Drive), Product Demo URL.
- **Market & Metrics:** Sector (from 12 focus areas), Problem Statement, Value Proposition, Monthly Revenue / Traction, Capital Raised till date, Capital Seeking.
- **Outcome:** Generates Registration ID (`BMI26-START-XXXXXX`), moves to `Payment` if required, then enters `Status = UNDER_REVIEW`.

### 4.3 Track 03: Scale Your Business / BMI Scale (₹2,499 Paid)
- **Owner / Director Details:** Full Name, Designation, Direct Email, Mobile.
- **Business Profile:** Enterprise / Company Name, Business Type (Manufacturing, D2C, Service, Retail, etc.), Year of Incorporation, City & State, Team Size.
- **Financial Profile:** Annual Turnover bracket (< ₹50L, ₹50L–₹2Cr, ₹2Cr–₹10Cr, ₹10Cr+).
- **Expansion Goals:** What help are you seeking? (Equity Investment, Debt/Loan, Technology Enablement, Franchise/Distribution, Mentorship).
- **Payment Trigger:** Razorpay / Cashfree / Stripe checkout for ₹2,499.
- **Outcome:** Generates Registration ID (`BMI26-SCALE-XXXXXX`), records payment, sets `Payment = PAID`, `Status = CONFIRMED`.

### 4.4 Track 05: Visitors & Ecosystem Delegates (Paid Pass)
- **Visitor Info:** Full Name, Mobile, Email, Organization / Company, Job Title, Industry.
- **Purpose of Visit:** Networking / Exploring Investments / Vendor Partnership / Learning.
- **Payment Trigger:** Online Payment Gateway for entry ticket.
- **Outcome:** Generates Registration ID (`BMI26-VIS-XXXXXX`), instant Pass Generation.

---

## 5. Status Model & Review Pipeline

Registration status, review decision, payment state, and ticketing state are decoupled to prevent false confirmations:

```mermaid
flowchart TD
    subgraph Registration States
        R_SUB[SUBMITTED] --> R_CONF[CONFIRMED]
        R_SUB --> R_CANC[CANCELLED]
    end

    subgraph Review Pipeline (Startups & Ideas)
        REV_PEND[PENDING] --> REV_UR[UNDER_REVIEW]
        REV_UR --> REV_SHORT[SHORTLISTED]
        REV_UR --> REV_WAIT[WAITLISTED]
        REV_UR --> REV_REJ[REJECTED]
        REV_SHORT --> REV_SEL[SELECTED FOR PITCH / INVESTMENT ROOM]
    end

    subgraph Payment States
        P_NA[NOT_REQUIRED (Student)]
        P_PEND[PENDING] --> P_PAID[PAID]
        P_PEND --> P_FAIL[FAILED]
        P_PAID --> P_REF[REFUNDED]
    end

    subgraph Ticket States
        T_NONE[NOT_GENERATED] --> T_ACT[ACTIVE / READY]
        T_ACT --> T_IN[CHECKED_IN]
        T_ACT --> T_VOID[CANCELLED]
    end
```

### Live Status Tracker for Participants:
Participants can visit `/track-status` or their dashboard anytime with their **Email + Mobile** or **Registration ID**:
- Step 1: Application Received & Registration ID Issued
- Step 2: Payment Verified (or Marked Free for Students)
- Step 3: Application Review Status (Under Review / Shortlisted / Selected)
- Step 4: Digital Pass Available for PDF Download

---

## 6. Digital Ticket Pass & Idempotent PDF Downloads

1. **Unique Permanent Identifiers:**
   - Registration ID: `BMI26-STU-001024`, `BMI26-SCALE-000412`
   - Ticket ID: `TKT-BMI26-884920`
   - Secure QR Code payload: Signed cryptographic verification link (e.g. `https://bmijaipur.com/verify?tid=TKT-BMI26-884920&sig=...`).
2. **Branded Visual PDF Pass Content:**
   - Official BM Investment Logo & "Startup & Business Launch 2026" Gold Branding.
   - Participant Name, Category/Track Name, Registration ID, Unique Pass ID.
   - Date: 15 September 2026 | Location: Jaipur, Rajasthan.
   - Scannable QR Code for Gate Entry.
   - Crucial instructions (ID proof mandatory, reporting time 09:00 AM).
3. **Repeat Download Guarantee (Idempotency):**
   - When a user downloads the PDF 1 time or 10 times, the system serves or renders the **exact same Ticket ID and QR code**. It never regenerates a new pass identity.

---

## 7. Admin Panel Specifications

A protected single-view operations portal accessible at `/admin`:

1. **Executive Metrics Overview:**
   - Total Registrations count (by Category: Student, Startup, Visitor, Scale Business).
   - Total Revenue Collected vs Pending / Failed.
   - Application Review Queue: Pending, Shortlisted, Selected, Rejected.
   - Checked-in status on event day.
2. **Registration Management & Review Table:**
   - Search by Name, Email, Phone, Registration ID, Company Name.
   - Filters: Category, Review Status, Payment Status, Sector.
   - Application Drawer: View full pitch deck, college ID, revenue metrics.
   - Action Buttons: `Under Review`, `Shortlist`, `Select for Investment Room`, `Reject`, `Send Email Notification`.
   - Admin internal notes & scoring history.
3. **Dynamic CMS & Content Management:**
   - Edit Speakers, Keynote details, Agenda timing, Sponsors, FAQs, and Venue instructions without changing code.
4. **Data Export:**
   - Single-click export to `.CSV` and `.XLSX` with category filters.

---

## 8. Technical Stack & SEO Guidelines

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Lucide Icons + Framer Motion animations.
- **Backend / Database:** REST API / Supabase PostgreSQL with schema-level validation.
- **PDF Generation:** `@react-pdf/renderer` or `jspdf` + `html2canvas` for crisp vector ticket generation.
- **Payment Gateway:** Razorpay / Cashfree webhook integration with signature verification.
- **SEO & Performance:** Full OpenGraph tags, JSON-LD Event Schema for Google Search indexing, WebP image optimization, Lighthouse score ≥ 90.

---

## 9. Legal & Compliance Disclaimer

As specified in official materials:
> *"BMI / BM Investment is an independent initiative and is not related to, associated with, or endorsed by Allen Career Institute Private Limited in any manner. This event and platform are purely for entrepreneurship, business growth, and investment ecosystem development."*
