import { useEffect, useRef, useState, useId } from "react";
import {
  CATEGORIES,
  CATEGORY_SHORT,
  CATEGORY_OPTIONS,
  BUSINESS_CATEGORY_OPTIONS,
  FORM_FIELDS,
  REGISTRATION_FEES,
} from "../data/eventData.js";
import { supabase } from "../lib/supabase.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../services/paymentService.js";

async function submitRegistration(payload) {
  const { category, email, phone, city, ...rest } = payload;
  const name = rest.fullName || rest.founderName || rest.contactPerson || "";

  // Extract remaining fields for details JSONB
  const { fullName, founderName, contactPerson, ...details } = rest;

  let track = "Visitor";
  if (category === "student") track = "Track 1 (Students)";
  if (category === "startup") track = "Track 2 (Startups)";
  if (category === "school") track = "Track 3 (Scale)";

  const registration_id = 'REG-' + Math.floor(10000 + Math.random() * 90000);

  const { error } = await supabase.from("registrations").insert([{
    registration_id,
    name,
    email,
    phone,
    city,
    track,
    status: 'Pending',
    payment_status: 'Pending',
    details
  }]);

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error("Registration failed. Please try again.");
  }

  // Send email via Resend Edge Function
  try {
    await supabase.functions.invoke("send-email", {
      body: {
        name,
        email,
        message: `New registration for category: ${category} | Track: ${track}`,
      },
    });
  } catch (err) {
    console.error("Email sending failed:", err);
    // We don't throw here so the user still sees success if DB insert worked.
  }

  return { ok: true, registrationId: registration_id };
}

const ERROR_MESSAGES = {
  required: "This field is required.",
  email: "Enter a valid email address.",
  phone: "Please enter a valid mobile number.",
  url: "Enter a valid URL starting with http:// or https://.",
  city: "Please enter a valid city name.",
  category: "Please choose a category.",
  specifyOther: "Please specify your category.",
};

// The option value that reveals the "Specify Other Category" follow-up
// field below any category dropdown that offers it (currently only
// Business Tycoon's — Entrepreneur's option list has no "Other").
const OTHER_VALUE = "Other";

// "Are you bringing your team?" — Entrepreneur and Business Tycoon
// only (gated at render time below by `category`). Deliberately not a
// form_config-driven field like the rest of this form: it has no
// backend/admin authoring path today, so it's plain component state
// that gets folded into the submit payload's `details` alongside the
// regular fields, per the requested teamMembers: [{ name, phone }]
// shape.
const MAX_TEAM_MEMBERS = 3;
const emptyTeamMember = () => ({ name: "", phone: "" });

// City accepts letters, spaces, and the punctuation real city names use
// (hyphen, apostrophe, dot) — no digits.
const CITY_PATTERN = /^[A-Za-z\s'.-]+$/;
// Indian mobile number: exactly 10 digits, starting 6-9, not all digits the same.
const PHONE_PATTERN = /^[6-9](?!(\d)\1{8}$)\d{9}$/;

function validateField(field, value) {
  const v = String(value ?? "").trim();
  if (field.required && !v) {
    if (field.type === "select") return ERROR_MESSAGES.category;
    if (field.isSpecifyOther) return ERROR_MESSAGES.specifyOther;
    return ERROR_MESSAGES.required;
  }
  if (!v) return null;
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    return ERROR_MESSAGES.email;
  }
  if (field.type === "tel") {
    if (!PHONE_PATTERN.test(v)) return ERROR_MESSAGES.phone;
  }
  if (field.name === "city" && !CITY_PATTERN.test(v)) {
    return ERROR_MESSAGES.city;
  }
  if (field.type === "url" && !/^https?:\/\/.+\..+/.test(v)) {
    return ERROR_MESSAGES.url;
  }
  return null;
}

// Team-member Name/Phone validation — reuses the exact same required
// message and PHONE_PATTERN/phone message as every other field in
// this form, so "Member Name *"/"Phone Number *" behave identically
// to the rest of the registration form rather than inventing new
// copy or a separate validity rule.
// Single-field validator — deliberately not "validate the whole
// member and merge both results," which was the actual bug here: a
// version that returned {name, phone} together and got spread into
// one field's error slot on every blur/change overwrote the OTHER
// field's error with whatever its value happened to be at that
// exact moment (e.g. still empty because it hadn't been typed into
// yet), and that stale error then never got a chance to re-clear
// once the field was later filled, because the touched-gate for that
// field's own onChange had never been set. Validating one field at a
// time, keyed only into that field's own slot, keeps each field's
// error entirely independent of what the other field's value is.
function validateTeamMemberField(fieldName, value) {
  const v = String(value ?? "").trim();
  if (!v) return ERROR_MESSAGES.required;
  if (fieldName === "phone" && !PHONE_PATTERN.test(v)) return ERROR_MESSAGES.phone;
  return null;
}

function validateTeamMember(member) {
  return {
    name: validateTeamMemberField("name", member.name),
    phone: validateTeamMemberField("phone", member.phone),
  };
}

// Blocks invalid characters as the user types, instead of only
// flagging them after the fact — City rejects digits, phone (tel
// fields) accepts digits only and stops accepting input past 10.
function sanitizeInput(field, rawValue) {
  if (field.name === "city") {
    return rawValue.replace(/[^A-Za-z\s'.-]/g, "");
  }
  if (field.type === "tel") {
    return rawValue.replace(/\D/g, "").slice(0, 10);
  }
  return rawValue;
}

function buildInitialValues(fields) {
  const values = {};
  fields.forEach((f) => {
    values[f.name] = "";
  });
  return values;
}

// Per-category config for the field that must always render as the
// category dropdown. Keyed by category id (not a fixed field `name`)
// because the live Supabase form_config is edited through the Admin
// Panel's form-builder, which lets an admin freely rename a field's
// key and relabel it — confirmed directly against the live data
// (queried via the Supabase REST API), where Business Tycoon's
// category field now has name **"Business Category"** (with a space,
// not the original "businessCategory") and Entrepreneur's carries a
// hand-edited label. A fixed-key lookup silently stops matching the
// moment a field is renamed, which is exactly what broke this field
// after an admin edit. `knownNames` covers the field's original/
// expected key(s) as a fast path; `matchesLabel` is the durable
// fallback — it recognizes the field by what it visibly says (label
// mentions "category" and not "description"), so it keeps working
// across future admin renames without needing another manual fix.
const SELECT_FIELD_CONFIG = {
  entrepreneur: {
    knownNames: ["industry"],
    matchesLabel: (label) => /categor/i.test(label) && !/descri/i.test(label),
    targetName: "industry",
    label: "Industry / Category",
    afterField: "role",
    fallbackOptions: CATEGORY_OPTIONS,
  },
  businessTycoon: {
    knownNames: ["businessCategory"],
    matchesLabel: (label) => /categor/i.test(label) && !/descri/i.test(label),
    targetName: "businessCategory",
    label: "Business Category",
    afterField: "role",
    fallbackOptions: BUSINESS_CATEGORY_OPTIONS,
  },
};

function findCategoryField(categoryFields, config) {
  return categoryFields.find(
    (f) => config.knownNames.includes(f.name) || config.matchesLabel(f.label || "")
  );
}

// Supabase's live form_config.form_fields (fetched by Registration.jsx
// and passed in as `dynamicFields`) entirely replaces the static
// FORM_FIELDS fallback whenever it's present — see `activeFields`
// below. This walks whichever field list is actually active — static
// or dynamic — and for each category in SELECT_FIELD_CONFIG: finds
// its category field via `findCategoryField` (matching on known keys
// or on label content, so an admin rename doesn't break this), forces
// it to type "select" with real options (preferring the live field's
// own `options` when present, otherwise the fallback list) and strips
// any stray `hint` (a dropdown never shows helper text — if one is
// attached here, as the live "Business Category" field's has been, it
// belongs on the category's description field instead, restored
// below). If no matching field exists at all, one is inserted right
// after `afterField`. Either way the result is idempotent. Every
// other field (other labels, required flags, order) is left exactly
// as the active source defined it.
function withCategoryDropdowns(fieldsByCategory) {
  const normalized = {};
  Object.keys(fieldsByCategory).forEach((categoryId) => {
    normalized[categoryId] = (fieldsByCategory[categoryId] || []).slice();
  });

  Object.entries(SELECT_FIELD_CONFIG).forEach(([categoryId, config]) => {
    const categoryFields = normalized[categoryId];
    if (!categoryFields) return;

    const existing = findCategoryField(categoryFields, config);

    if (existing) {
      const options =
        Array.isArray(existing.options) && existing.options.length > 0
          ? existing.options
          : config.fallbackOptions;
      // Category dropdowns never show helper text below them — a
      // hint attached to this field (live drift confirmed on Business
      // Tycoon's) is dropped here rather than rendered under the
      // wrong field; it belongs on the description field instead.
      const { hint, ...rest } = existing;
      const patched = { ...rest, type: "select", options };
      normalized[categoryId] = categoryFields.map((f) => (f === existing ? patched : f));
      return;
    }

    const newField = {
      name: config.targetName,
      label: config.label,
      type: "select",
      required: true,
      options: config.fallbackOptions,
    };
    const afterIndex = categoryFields.findIndex((f) => f.name === config.afterField);
    normalized[categoryId] =
      afterIndex === -1
        ? [...categoryFields, newField]
        : [
            ...categoryFields.slice(0, afterIndex + 1),
            newField,
            ...categoryFields.slice(afterIndex + 1),
          ];
  });

  return normalized;
}

// The Business/Startup Description field's own helper text — restored
// here rather than relying solely on whatever the live source
// carries, since the exact bug being fixed is that this hint had
// drifted onto the category field instead. Matched by category +
// label content (contains "descri"), the same durable, rename-
// tolerant approach used for the category field above.
const DESCRIPTION_HINTS = {
  entrepreneur: "What you build, who it serves, and the traction so far.",
  businessTycoon: "What your business builds, and how you champion growth and innovation.",
};

function withDescriptionHints(fieldsByCategory) {
  const normalized = {};
  Object.keys(fieldsByCategory).forEach((categoryId) => {
    const hint = DESCRIPTION_HINTS[categoryId];
    normalized[categoryId] = (fieldsByCategory[categoryId] || []).map((field) => {
      if (!hint || !/descri/i.test(field.label || "")) return field;
      if (field.hint) return field;
      return { ...field, hint };
    });
  });
  return normalized;
}

// Removed static CATEGORY_LABEL since it is computed dynamically inside the component

// Custom listbox for the two category dropdowns (Industry / Category,
// Business Category), replacing the native <select> for just these
// fields. Root cause this exists to fix: once a category is chosen,
// the form renders inside `.reg-form-collapse.is-open` (see
// components.css), whose direct child gets `overflow: hidden` as part
// of the mobile accordion-open animation — a native <select>'s open
// popup is OS-level UI that ignores this anyway, which is exactly why
// it couldn't be reliably positioned/styled; an in-DOM
// absolutely-positioned menu, by contrast, WOULD get clipped by that
// overflow, which is why the .reg-form override below is required
// alongside this component, not instead of it.
//
// Reuses the same `values`/`errors`/`touched` state and the same
// `handleChange`/`handleBlur` callbacks the native version used, so
// required validation, the "Other" → specify-field flow, and the
// submitted value/state key are completely unchanged — only how the
// option list is presented and positioned is different.
function CategorySelect({ field, value, error, onSelect, onBlur, onFocus, onTriggerMount }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const listboxId = useId();
  const options = field.options || [];
  const hasValue = Boolean(value);

  // Close on outside click/tap. No option was chosen in this path, so
  // (unlike selectOption below) this closure is safe to treat as a
  // real blur — required validation should run if the field is still
  // empty, exactly like tabbing or clicking away from any other field.
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        onBlur();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, onBlur]);

  const commitClose = (shouldBlur) => {
    setOpen(false);
    setActiveIndex(-1);
    if (shouldBlur) onBlur();
  };

  const selectOption = (opt) => {
    // onSelect (handleChange) alone both stores the new value and
    // revalidates it — see the note on handleChange in the parent for
    // why a second, separate onBlur() call here would revalidate
    // against the value from BEFORE this selection (a stale-closure
    // race: onBlur reads the parent's `values` state, which hasn't
    // re-rendered with this selection yet at the point this synchronous
    // handler runs) and could flash a false "Please choose a category."
    // even though a real option was just picked.
    onSelect(opt);
    commitClose(false);
    buttonRef.current?.focus();
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(Math.max(0, options.indexOf(value)));
      } else if (e.key !== "ArrowDown") {
        if (activeIndex >= 0) selectOption(options[activeIndex]);
      }
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      commitClose(false);
    }
  };

  const handleListKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (activeIndex >= 0) selectOption(options[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      commitClose(false);
      buttonRef.current?.focus();
    } else if (e.key === "Tab") {
      commitClose(true);
    }
  };

  return (
    <div className="category-select" ref={wrapperRef}>
      <button
        type="button"
        id={`reg-${field.name}`}
        ref={(node) => {
          buttonRef.current = node;
          onTriggerMount?.(node);
        }}
        className={`field-input category-select-trigger ${hasValue ? "" : "is-placeholder"}`.trim()}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `reg-${field.name}-error` : undefined}
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;
            if (next) setActiveIndex(Math.max(0, options.indexOf(value)));
            return next;
          });
        }}
        onKeyDown={handleTriggerKeyDown}
        onFocus={onFocus}
        onBlur={(e) => {
          // Ignore the blur caused by moving focus into the option
          // list itself — only treat it as "left the field" once
          // focus truly exits the whole trigger+menu wrapper.
          if (wrapperRef.current && wrapperRef.current.contains(e.relatedTarget)) return;
          if (!open) onBlur();
        }}
      >
        {hasValue ? value : "Select category"}
      </button>

      {open ? (
        <ul
          className="category-select-menu"
          role="listbox"
          id={listboxId}
          tabIndex={-1}
          aria-label={field.label}
          onKeyDown={handleListKeyDown}
          ref={(node) => node?.focus({ preventScroll: true })}
        >
          {options.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              className={`category-select-option ${value === opt ? "is-selected" : ""} ${i === activeIndex ? "is-active" : ""}`.trim()}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => selectOption(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function RegistrationForm({ initialCategory, onCategoryChanged, dynamicFees, dynamicUpiId, dynamicCategories, dynamicFields }) {
  const activeCategories = dynamicCategories || CATEGORIES;
  const activeFields = withDescriptionHints(withCategoryDropdowns(dynamicFields || FORM_FIELDS));

  const CATEGORY_LABEL = activeCategories.reduce((acc, c) => ({ ...acc, [c.id]: c.title }), {});
  const DYNAMIC_CATEGORY_SHORT = activeCategories.reduce((acc, c) => ({ ...acc, [c.id]: c.cta || c.title }), {});

  const [category, setCategory] = useState(initialCategory || "student");
  const baseFields = activeFields[category] || [];

  // Registration Fees depend only on the selected CATEGORY (Student /
  // Visitor / Entrepreneur / Business Tycoon) — never on the typed
  // Role field. Prefer dynamicFees if provided, else fallback to REGISTRATION_FEES.
  const fee = dynamicFees ? dynamicFees[category] ?? 0 : REGISTRATION_FEES[category] ?? 0;

  const [values, setValues] = useState(() => buildInitialValues(baseFields));

  // Any select field currently set to "Other" gets a required
  // "Specify Other Category" text field injected right after it —
  // generic by design (keyed off the select's own value, not a
  // specific category), so it applies to Business Tycoon's dropdown
  // today and to any future dropdown that offers an "Other" option,
  // without duplicating this logic per category.
  const fields = baseFields.flatMap((field) => {
    if (field.type !== "select" || values[field.name] !== OTHER_VALUE) {
      return [field];
    }
    const specifyField = {
      name: `${field.name}Other`,
      label: "Specify Other Category",
      type: "text",
      required: true,
      isSpecifyOther: true,
    };
    return [field, specifyField];
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  // "Are you bringing your team?" — Entrepreneur and Business Tycoon
  // only; showTeamSection (below, derived from `category`) gates
  // whether any of this actually renders or is submitted.
  const [teamEnabled, setTeamEnabled] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamErrors, setTeamErrors] = useState([]); // parallel array: { name, phone } | null per member
  const [teamTouched, setTeamTouched] = useState([]); // parallel array: { name, phone } booleans per member
  const showTeamSection = category === "entrepreneur" || category === "businessTycoon";

  const resetTeamState = () => {
    setTeamEnabled(false);
    setTeamMembers([]);
    setTeamErrors([]);
    setTeamTouched([]);
  };

  const handleTeamToggle = (nextEnabled) => {
    setTeamEnabled(nextEnabled);
    if (!nextEnabled) {
      // Switching YES -> NO: hide and fully clear team state so no
      // stale member data or validation errors can ever be submitted
      // once the section is hidden again.
      setTeamMembers([]);
      setTeamErrors([]);
      setTeamTouched([]);
    } else if (teamMembers.length === 0) {
      // Switching NO -> YES for the first time: Member 1 appears
      // immediately, per spec.
      setTeamMembers([emptyTeamMember()]);
      setTeamErrors([{ name: null, phone: null }]);
      setTeamTouched([{ name: false, phone: false }]);
    }
  };

  const addTeamMember = () => {
    if (teamMembers.length >= MAX_TEAM_MEMBERS) return;
    setTeamMembers((prev) => [...prev, emptyTeamMember()]);
    setTeamErrors((prev) => [...prev, { name: null, phone: null }]);
    setTeamTouched((prev) => [...prev, { name: false, phone: false }]);
  };

  const handleTeamMemberChange = (index, fieldName) => (e) => {
    const rawValue = e.target.value;
    const sanitized = fieldName === "phone" ? sanitizeInput({ type: "tel" }, rawValue) : rawValue;
    setTeamMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [fieldName]: sanitized } : m))
    );
    setTeamErrors((prev) =>
      prev.map((err, i) => {
        if (i !== index) return err;
        if (!teamTouched[index]?.[fieldName]) return err;
        // Only this one field's error slot is touched — validating
        // and merging the whole {name, phone} pair here (as an
        // earlier version did) let blurring/changing one field
        // silently overwrite the other field's error using whatever
        // value it happened to hold at that instant.
        return { ...err, [fieldName]: validateTeamMemberField(fieldName, sanitized) };
      })
    );
  };

  const handleTeamMemberBlur = (index, fieldName) => () => {
    setTeamTouched((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [fieldName]: true } : t))
    );
    setTeamErrors((prev) =>
      prev.map((err, i) =>
        i === index
          ? { ...err, [fieldName]: validateTeamMemberField(fieldName, teamMembers[index][fieldName]) }
          : err
      )
    );
  };
  // Mobile only (see .reg-form--collapsed in components.css): controls
  // whether the form below the category cards is open. `category`
  // already defaults to "student" above regardless of initialCategory,
  // but this flag previously stayed false until a category was
  // explicitly tapped (Boolean(initialCategory) is false on a normal
  // page load/scroll-to-section, since initialCategory only arrives
  // from an external pre-selection elsewhere on the page) — leaving
  // the Student card unhighlighted and its form collapsed on first
  // mobile view, even though Student was already the selected
  // category in state. Starting true shows the (already-default)
  // Student form immediately, matching desktop's always-open
  // behavior; explicit taps on Visitor/Entrepreneur/Business Tycoon
  // still work exactly as before via chooseCategory below.
  const [hasSelected, setHasSelected] = useState(true);
  const firstErrorRef = useRef(null);
  const formRef = useRef(null);
  const panelRef = useRef(null);

  // The success card is much shorter than the full form it replaces —
  // that height collapse can shift the page enough for the browser to
  // land on whatever section now sits under the viewport (e.g. the
  // green CTA below Registration). On desktop, .reg-left/.reg-right
  // sit side by side, so scrolling to the whole #register section's
  // top puts "11 — Registration" / "Ready to be part of the event?"
  // and "Application received." in view together, as intended.
  //
  // On mobile (<=1024px, where .reg-left/.reg-right stack into one
  // column — confirmed by rendering the actual mobile page and
  // measuring positions), that same section-top scroll instead lands
  // the viewport at the top of .reg-left's heading + 3-step list,
  // which sits ABOVE the form panel — pushing "Application received."
  // (in .reg-panel, .reg-right) below the fold on a normal phone
  // screen, exactly the "user has to scroll manually" bug reported.
  // Scrolling to panelRef (.reg-panel, the element that actually
  // contains the success card) instead keeps desktop's existing
  // behavior (still inside the same section, so the heading above it
  // remains close by) while fixing mobile to show the success card
  // itself from its own top edge. #register's scroll-margin-top
  // still protects .reg-panel's own scroll position from the fixed
  // navbar, since .reg-panel is a descendant of #register.
  useEffect(() => {
    if (status !== "success") return;
    requestAnimationFrame(() => {
      const isMobile = window.matchMedia("(max-width: 1024px)").matches;
      const target = isMobile ? panelRef.current : document.getElementById("register");
      (target ?? panelRef.current)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [status]);

  // External category pre-selection (e.g. from the Categories section).
  useEffect(() => {
    if (initialCategory && initialCategory !== category) {
      setCategory(initialCategory);
      setValues(buildInitialValues(activeFields[initialCategory] || []));
      setErrors({});
      setTouched({});
      setStatus("idle");
      setHasSelected(true);
      resetTeamState();
    }
  }, [initialCategory, category]);

  const chooseCategory = (id) => {
    setCategory(id);
    setValues(buildInitialValues(activeFields[id] || []));
    setErrors({});
    setTouched({});
    setStatus("idle");
    setHasSelected(true);
    resetTeamState();
    if (onCategoryChanged) onCategoryChanged(id);
    // Intentionally no scrollIntoView/scrollTo here — selecting a
    // category must never move the page. The form reveals in place.
  };

  const handleChange = (field) => (e) => {
    const sanitized = sanitizeInput(field, e.target.value);
    const next = { ...values, [field.name]: sanitized };

    // Moving a category dropdown away from "Other" retires its
    // "Specify Other Category" follow-up field — clear its stale
    // value so it isn't silently submitted, and drop its error so a
    // previously-shown "Please specify your category." doesn't keep
    // showing for a field that's no longer on screen.
    let clearedFieldName = null;
    if (field.type === "select" && sanitized !== OTHER_VALUE) {
      clearedFieldName = `${field.name}Other`;
      next[clearedFieldName] = "";
    }

    setValues(next);

    // A dropdown selection is always a complete, deliberate choice —
    // unlike a text field mid-keystroke, there's no "still typing"
    // state to wait out — so it's marked touched and revalidated
    // immediately using `sanitized` (the value just chosen), not the
    // component's `values` state. Reading `values[field.name]` here
    // instead (e.g. via a follow-up blur) would still reflect the
    // value from before this selection, since this handler runs
    // synchronously before React commits the setValues above —
    // exactly the stale-closure race that could flash "Please choose
    // a category." right after a real option was picked.
    if (field.type === "select") {
      setTouched((prev) => ({ ...prev, [field.name]: true }));
    }
    if (touched[field.name] || clearedFieldName || field.type === "select") {
      setErrors((prev) => {
        const nextErrors = { ...prev, [field.name]: validateField(field, sanitized) };
        if (clearedFieldName) delete nextErrors[clearedFieldName];
        return nextErrors;
      });
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field.name]: true }));
    setErrors((prev) => ({
      ...prev,
      [field.name]: validateField(field, values[field.name]),
    }));
  };

  // Bug 2 fix: the category dropdown only validated itself reactively
  // (its own blur, or a selection) — it never got a chance to blur at
  // all if the user's very first interaction after opening the form
  // was to click straight into a LATER field (e.g. tapping "Business
  // Description" while "Select category" was still showing). Clicking
  // directly into another field never focuses the category trigger
  // first, so no blur event fires on it and it stays "untouched"
  // indefinitely — confirmed live: tabbing away from a focused,
  // empty trigger already showed the error correctly, but a direct
  // click into a field further down the form did not.
  //
  // Fixed generically rather than per-category: whenever ANY field in
  // the currently-rendered list gains focus, every required select
  // field that appears BEFORE it in that same list and is still
  // untouched gets marked touched and validated right here — this is
  // "the user tried to move to any field after the category dropdown"
  // exactly as specified, and it naturally covers Entrepreneur and
  // Business Tycoon with the same code path (keyed by field position,
  // not a hardcoded field name).
  const handleFocus = (field) => () => {
    const fieldIndex = fields.indexOf(field);
    const earlierUntouchedSelects = fields
      .slice(0, fieldIndex)
      .filter((f) => f.type === "select" && f.required && !touched[f.name]);

    if (earlierUntouchedSelects.length === 0) return;

    setTouched((prev) => {
      const next = { ...prev };
      earlierUntouchedSelects.forEach((f) => {
        next[f.name] = true;
      });
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      earlierUntouchedSelects.forEach((f) => {
        next[f.name] = validateField(f, values[f.name]);
      });
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate everything; collect errors and focus the first one.
    const nextErrors = {};
    fields.forEach((f) => {
      const err = validateField(f, values[f.name]);
      if (err) nextErrors[f.name] = err;
    });
    setErrors(nextErrors);
    setTouched(Object.fromEntries(fields.map((f) => [f.name, true])));

    // Team members: only validated/blocking when the toggle is YES —
    // reusing the exact same required/phone-pattern rules as the rest
    // of the form (validateTeamMember calls the same ERROR_MESSAGES
    // and PHONE_PATTERN). Every visible member (1-3) must be valid;
    // an invalid team member blocks Submit/Proceed to Payment exactly
    // like an invalid regular field does.
    let nextTeamErrors = teamErrors;
    if (teamEnabled && teamMembers.length > 0) {
      nextTeamErrors = teamMembers.map(validateTeamMember);
      setTeamErrors(nextTeamErrors);
      setTeamTouched(teamMembers.map(() => ({ name: true, phone: true })));
    }
    const hasTeamErrors =
      teamEnabled && nextTeamErrors.some((err) => err.name || err.phone);

    if (Object.keys(nextErrors).length > 0) {
      const firstName = fields.find((f) => nextErrors[f.name])?.name;
      firstErrorRef.current?.[firstName]?.focus();
      return;
    }
    if (hasTeamErrors) {
      return;
    }

    setStatus("submitting");
    try {
      const teamPayload =
        teamEnabled && teamMembers.length > 0
          ? { teamMembers: teamMembers.map((m) => ({ name: m.name.trim(), phone: m.phone.trim() })) }
          : {};
      const res = await submitRegistration({ category, ...values, ...teamPayload });

      if (fee > 0) {
        setStatus("payment_processing");

        try {
          const orderData = await createRazorpayOrder(res.registrationId, category);

          if (!window.Razorpay) {
            throw new Error("Razorpay SDK not loaded. Please check your internet connection.");
          }

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency || "INR",
            name: "BM Investment",
            description: "Event Registration",
            order_id: orderData.id,
            prefill: {
              name: values.fullName || values.founderName || values.contactPerson || "",
              email: values.email || "",
              contact: values.phone || ""
            },
            theme: {
              color: "#C6A462"
            },
            handler: async function (response) {
              console.log("Razorpay Success Callback received:", response);
              setStatus("payment_verifying");
              try {
                await verifyRazorpayPayment(
                  res.registrationId,
                  response.razorpay_order_id,
                  response.razorpay_payment_id,
                  response.razorpay_signature
                );
                setStatus("success");
              } catch (verifyErr) {
                console.error("Payment Verification Failed:", verifyErr);
                setStatus("idle");
                setErrors({ form: "Payment verification failed. Please contact support or try again." });
              }
            },
            modal: {
              ondismiss: function () {
                setStatus("idle");
              }
            }
          };

          const rzpInstance = new window.Razorpay(options);

          rzpInstance.on('payment.failed', function (response) {
            console.error("Payment Failed", response.error);
            setStatus("idle");
            setErrors({ form: "Payment failed. Please try again." });
          });

          rzpInstance.open();

        } catch (paymentErr) {
          console.error("Razorpay Error:", paymentErr);
          setStatus("idle");
          setErrors({ form: paymentErr.message || "Could not initialize payment. Please try again." });
        }
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("idle");
      setErrors({
        form: "Something went wrong. Please try again.",
      });
    }
  };

  // "Register another" must always return to the first/default
  // category (Student) regardless of which category was just
  // submitted — the previous version left `category` untouched, so
  // whatever was selected before submitting (e.g. Visitor, from a
  // prior "Switch to visitor" click, or any category the visitor had
  // chosen) stayed selected/highlighted after reset, and its fields
  // kept rendering instead of Student's. Explicitly setting category
  // back to "student" and rebuilding `values` from Student's own
  // fields (not the just-submitted category's fields) fixes both the
  // highlighted category and the fields actually shown.
  const reset = () => {
    setCategory("student");
    setValues(buildInitialValues(activeFields.student || []));
    setErrors({});
    setTouched({});
    setStatus("idle");
    resetTeamState();
    if (onCategoryChanged) onCategoryChanged("student");
  };

  const primaryName =
    values.fullName || values.founderName || values.contactPerson || "";
  const firstName = primaryName.split(" ")[0];

  return (
    <div className="reg-panel" ref={panelRef}>
      <div className="reg-panel-head">
        <h3 className="reg-panel-title">Register for the event</h3>
        <p className="reg-panel-step">Choose Your Category and Fill the form</p>
      </div>

      {status === "success" ? (
        <div className="reg-success" role="status" aria-live="polite">
          <span className="success-check">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M4 12.5 9.5 18 20 6.5" />
            </svg>
          </span>
          <h3 className="reg-success-title">Application received.</h3>
          <p className="reg-success-copy">
            Thank you{firstName ? `, ${firstName}` : ""} — you're one step
            closer to the event. Our team will be in touch with confirmation
            details and next steps.
          </p>
          <div className="reg-success-meta">
            <span className="reg-success-chip">
              {CATEGORY_LABEL[category]} — {DYNAMIC_CATEGORY_SHORT[category]}
            </span>
            {values.city ? (
              <span className="reg-success-chip">{values.city}</span>
            ) : null}
          </div>
          <p className="reg-success-note">
            <strong>Preview build.</strong> This form isn't connected to a live
            backend yet — nothing has been stored. The submit handler is ready
            to point at your API.
          </p>
          <div className="reg-success-actions">
            <button type="button" className="btn btn--light" onClick={reset}>
              Register another
            </button>
            <button
              type="button"
              className="btn btn--ghost-light"
              onClick={() => chooseCategory("visitor")}
            >
              Switch to visitor
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="reg-cats" role="group" aria-label="Choose your category">
            {activeCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`reg-cat ${category === c.id ? "is-active" : ""}`}
                aria-pressed={category === c.id}
                onClick={() => chooseCategory(c.id)}
              >
                <span className="reg-cat-name">{c.title}</span>
                <span className="reg-cat-short">{DYNAMIC_CATEGORY_SHORT[c.id]}</span>
              </button>
            ))}
          </div>

          <div
            className={`reg-form-collapse ${hasSelected ? "is-open" : ""}`.trim()}
            ref={formRef}
          >
            <form
              className="reg-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {fields.map((field, fieldIndex) => {
                const isLastField = fieldIndex === fields.length - 1;
                const error = errors[field.name];
                const isSelect = field.type === "select";
                const inputProps = {
                  id: `reg-${field.name}`,
                  name: field.name,
                  type: field.type === "textarea" || isSelect ? undefined : field.type,
                  placeholder: isSelect ? undefined : " ",
                  value: values[field.name] ?? "",
                  onChange: handleChange(field),
                  onBlur: handleBlur(field),
                  onFocus: handleFocus(field),
                  "aria-invalid": Boolean(error),
                  "aria-describedby": error ? `reg-${field.name}-error` : undefined,
                  autoComplete: field.autoComplete,
                  inputMode: field.type === "tel" ? "numeric" : field.type === "email" ? "email" : undefined,
                  maxLength: field.type === "tel" ? 10 : undefined,
                };
                const Tag = field.type === "textarea" ? "textarea" : isSelect ? "select" : "input";

                return (
                  <div className={`field ${error ? "has-error" : ""}`.trim()} key={field.name}>
                    {isSelect ? (
                      <CategorySelect
                        field={field}
                        value={values[field.name] ?? ""}
                        error={error}
                        onSelect={(opt) =>
                          handleChange(field)({ target: { value: opt } })
                        }
                        onBlur={handleBlur(field)}
                        onFocus={handleFocus(field)}
                        onTriggerMount={(node) => {
                          if (!firstErrorRef.current) firstErrorRef.current = {};
                          firstErrorRef.current[field.name] = node;
                        }}
                      />
                    ) : (
                      <Tag
                        className="field-input"
                        rows={field.rows}
                        ref={(node) => {
                          if (!firstErrorRef.current) firstErrorRef.current = {};
                          firstErrorRef.current[field.name] = node;
                        }}
                        {...inputProps}
                      />
                    )}
                    <label className={`field-label ${isSelect ? "field-label--floated" : ""}`.trim()} htmlFor={`reg-${field.name}`}>
                      {field.label}
                      {field.required ? " *" : ""}
                    </label>
                    {error ? (
                      <p className="field-error" id={`reg-${field.name}-error`}>
                        {error}
                      </p>
                    ) : field.hint ? (
                      <p className="field-hint">{field.hint}</p>
                    ) : null}
                    {isLastField ? (
                      <div className="reg-fee-block">
                        <div className="field field--display">
                          <p className="field-label field-label--static">Registration Fees *</p>
                          <p className="reg-fee-value">
                            {fee === 0 ? "Free" : `₹${fee.toLocaleString("en-IN")}`}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {showTeamSection ? (
                <div className="reg-team">
                  <div className="reg-team-head">
                    <span className="reg-team-question">Are you bringing your team?</span>
                    <div className="reg-team-toggle" role="group" aria-label="Are you bringing your team?">
                      <button
                        type="button"
                        className={`reg-team-toggle-btn ${!teamEnabled ? "is-active" : ""}`.trim()}
                        aria-pressed={!teamEnabled}
                        onClick={() => handleTeamToggle(false)}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        className={`reg-team-toggle-btn ${teamEnabled ? "is-active" : ""}`.trim()}
                        aria-pressed={teamEnabled}
                        onClick={() => handleTeamToggle(true)}
                      >
                        Yes
                      </button>
                    </div>
                  </div>

                  {teamEnabled ? (
                    <div className="reg-team-members">
                      {teamMembers.map((member, index) => (
                        <div className="reg-team-member" key={index}>
                          <p className="reg-team-member-title">Team Member {index + 1}</p>
                          <div className="reg-team-member-row">
                            <div
                              className={`field reg-team-field ${teamErrors[index]?.name ? "has-error" : ""}`.trim()}
                            >
                              <input
                                className="field-input"
                                id={`reg-team-${index}-name`}
                                name={`teamMemberName${index}`}
                                type="text"
                                placeholder=" "
                                value={member.name}
                                onChange={handleTeamMemberChange(index, "name")}
                                onBlur={handleTeamMemberBlur(index, "name")}
                                aria-invalid={Boolean(teamErrors[index]?.name)}
                                aria-describedby={
                                  teamErrors[index]?.name ? `reg-team-${index}-name-error` : undefined
                                }
                              />
                              <label className="field-label" htmlFor={`reg-team-${index}-name`}>
                                Member Name *
                              </label>
                              {teamErrors[index]?.name ? (
                                <p className="field-error" id={`reg-team-${index}-name-error`}>
                                  {teamErrors[index].name}
                                </p>
                              ) : null}
                            </div>
                            <div
                              className={`field reg-team-field ${teamErrors[index]?.phone ? "has-error" : ""}`.trim()}
                            >
                              <input
                                className="field-input"
                                id={`reg-team-${index}-phone`}
                                name={`teamMemberPhone${index}`}
                                type="tel"
                                placeholder=" "
                                inputMode="numeric"
                                maxLength={10}
                                value={member.phone}
                                onChange={handleTeamMemberChange(index, "phone")}
                                onBlur={handleTeamMemberBlur(index, "phone")}
                                aria-invalid={Boolean(teamErrors[index]?.phone)}
                                aria-describedby={
                                  teamErrors[index]?.phone ? `reg-team-${index}-phone-error` : undefined
                                }
                              />
                              <label className="field-label" htmlFor={`reg-team-${index}-phone`}>
                                Phone Number *
                              </label>
                              {teamErrors[index]?.phone ? (
                                <p className="field-error" id={`reg-team-${index}-phone-error`}>
                                  {teamErrors[index].phone}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}

                      {teamMembers.length < MAX_TEAM_MEMBERS ? (
                        <button
                          type="button"
                          className="reg-team-add"
                          onClick={addTeamMember}
                        >
                          + Add Team Member
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {errors.form ? (
                <p className="field-error" role="alert">
                  {errors.form}
                </p>
              ) : null}

              <div className="reg-form-foot">
                <button
                  type="submit"
                  className="btn btn--light btn--submit"
                  disabled={status === "submitting" || status === "payment_processing" || status === "payment_verifying"}
                >
                  {status === "submitting" || status === "payment_processing" || status === "payment_verifying" ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      {status === "payment_processing" ? "Opening Payment…" : status === "payment_verifying" ? "Verifying Payment…" : "Sending…"}
                    </>
                  ) : (
                    <>
                      {fee > 0 ? "Proceed to Payment" : "Submit registration"}
                      <span className="btn-arrow" aria-hidden="true">
                        →
                      </span>
                    </>
                  )}
                </button>
                <p className="form-note">
                  {fee > 0
                    ? "By submitting you agree to be contacted about this event. Click Proceed to Payment to complete your registration securely."
                    : "By submitting you agree to be contacted about this event. No payment required for student registration."}
                </p>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
