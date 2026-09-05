import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  CATEGORIES,
  CATEGORY_SHORT,
  FORM_FIELDS,
  PAYMENT_UPI_ID,
  REGISTRATION_FEES,
} from "../data/eventData.js";
import { supabase } from "../lib/supabase.js";

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

  return { ok: true };
}

const ERROR_MESSAGES = {
  required: "This field is required.",
  email: "Enter a valid email address.",
  phone: "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.",
  url: "Enter a valid URL starting with http:// or https://.",
  city: "Please enter a valid city name.",
};

// City accepts letters, spaces, and the punctuation real city names use
// (hyphen, apostrophe, dot) — no digits.
const CITY_PATTERN = /^[A-Za-z\s'.-]+$/;
// Indian mobile number: exactly 10 digits, starting 6-9.
const PHONE_PATTERN = /^[6-9]\d{9}$/;

function validateField(field, value) {
  const v = String(value ?? "").trim();
  if (field.required && !v) return ERROR_MESSAGES.required;
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

const CATEGORY_LABEL = {
  student: "Student",
  visitor: "Visitor",
  entrepreneur: "Entrepreneur",
  businessTycoon: "Business Tycoon",
};

export default function RegistrationForm({ initialCategory, onCategoryChanged }) {
  const [category, setCategory] = useState(initialCategory || "student");
  const fields = FORM_FIELDS[category] || [];
  // Registration Fees depend only on the selected CATEGORY (Student /
  // Visitor / Entrepreneur / Business Tycoon) — never on the typed
  // Role field. Read straight from the single REGISTRATION_FEES config.
  const fee = REGISTRATION_FEES[category] ?? 0;
  const qrValue = `upi://pay?pa=${PAYMENT_UPI_ID}&pn=BMI%20Presents&am=${fee}&cu=INR&tn=BMI%20${category}%20registration`;
  const [values, setValues] = useState(() => buildInitialValues(fields));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  // Mobile only (see .reg-form--collapsed in components.css): the form
  // stays hidden below the category cards until the visitor actually taps
  // a role, so the section doesn't dump every field on screen up front.
  // Desktop ignores this flag entirely and always shows the form.
  const [hasSelected, setHasSelected] = useState(Boolean(initialCategory));
  const firstErrorRef = useRef(null);
  const formRef = useRef(null);
  const panelRef = useRef(null);

  // The success card is much shorter than the full form it replaces —
  // that height collapse can shift the page enough for the browser to
  // land on whatever section now sits under the viewport (e.g. the
  // green CTA below Registration). Re-anchor to this panel once the
  // success state has actually rendered, so submitting never navigates
  // the visitor away from the Registration section.
  useEffect(() => {
    if (status !== "success") return;
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [status]);

  // External category pre-selection (e.g. from the Categories section).
  useEffect(() => {
    if (initialCategory && initialCategory !== category) {
      setCategory(initialCategory);
      setValues(buildInitialValues(FORM_FIELDS[initialCategory]));
      setErrors({});
      setTouched({});
      setStatus("idle");
      setHasSelected(true);
    }
  }, [initialCategory, category]);

  const chooseCategory = (id) => {
    setCategory(id);
    setValues(buildInitialValues(FORM_FIELDS[id]));
    setErrors({});
    setTouched({});
    setStatus("idle");
    setHasSelected(true);
    if (onCategoryChanged) onCategoryChanged(id);
    // Mobile: bring the newly-revealed form into view. No-op on desktop,
    // where the form is already visible beside the category cards.
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const handleChange = (field) => (e) => {
    const sanitized = sanitizeInput(field, e.target.value);
    const next = { ...values, [field.name]: sanitized };
    setValues(next);
    if (touched[field.name]) {
      setErrors((prev) => ({
        ...prev,
        [field.name]: validateField(field, sanitized),
      }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field.name]: true }));
    setErrors((prev) => ({
      ...prev,
      [field.name]: validateField(field, values[field.name]),
    }));
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

    if (Object.keys(nextErrors).length > 0) {
      const firstName = fields.find((f) => nextErrors[f.name])?.name;
      firstErrorRef.current?.[firstName]?.focus();
      return;
    }

    setStatus("submitting");
    try {
      await submitRegistration({ category, ...values });
      setStatus("success");
    } catch {
      setStatus("idle");
      setErrors({
        form: "Something went wrong. Please try again.",
      });
    }
  };

  const reset = () => {
    setValues(buildInitialValues(fields));
    setErrors({});
    setTouched({});
    setStatus("idle");
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
              {CATEGORY_LABEL[category]} — {CATEGORY_SHORT[category]}
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
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`reg-cat ${category === c.id ? "is-active" : ""}`}
                aria-pressed={category === c.id}
                onClick={() => chooseCategory(c.id)}
              >
                <span className="reg-cat-name">{c.title}</span>
                <span className="reg-cat-short">{CATEGORY_SHORT[c.id]}</span>
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
                const inputProps = {
                  id: `reg-${field.name}`,
                  name: field.name,
                  type: field.type === "textarea" ? undefined : field.type,
                  placeholder: " ",
                  value: values[field.name],
                  onChange: handleChange(field),
                  onBlur: handleBlur(field),
                  "aria-invalid": Boolean(error),
                  "aria-describedby": error ? `reg-${field.name}-error` : undefined,
                  autoComplete: field.autoComplete,
                  inputMode: field.type === "tel" ? "numeric" : field.type === "email" ? "email" : undefined,
                  maxLength: field.type === "tel" ? 10 : undefined,
                };
                const Tag = field.type === "textarea" ? "textarea" : "input";

                return (
                  <div className={`field ${error ? "has-error" : ""}`} key={field.name}>
                    <Tag
                      className="field-input"
                      rows={field.rows}
                      ref={(node) => {
                        if (!firstErrorRef.current) firstErrorRef.current = {};
                        firstErrorRef.current[field.name] = node;
                      }}
                      {...inputProps}
                    />
                    <label className="field-label" htmlFor={`reg-${field.name}`}>
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
                          <p className="field-label field-label--static">Registration Fees</p>
                          <p className="reg-fee-value">
                            {fee === 0 ? "Free" : `₹${fee.toLocaleString("en-IN")}`}
                          </p>
                        </div>

                        {fee > 0 ? (
                          <div className="reg-qr-panel">
                            <p className="reg-qr-title">Scan to pay</p>
                            <div className="reg-qr-code">
                              <QRCode value={qrValue} size={148} />
                            </div>
                            <p className="reg-qr-amount">Amount: ₹{fee.toLocaleString("en-IN")}</p>
                            <p className="reg-qr-note">
                              Payment verification will be confirmed by our team after
                              submission — this is not an automatic confirmation.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {errors.form ? (
                <p className="field-error" role="alert">
                  {errors.form}
                </p>
              ) : null}

              <div className="reg-form-foot">
                <button
                  type="submit"
                  className="btn btn--light btn--submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Submit registration
                      <span className="btn-arrow" aria-hidden="true">
                        →
                      </span>
                    </>
                  )}
                </button>
                <p className="form-note">
                  By submitting you agree to be contacted about this event.
                  No payment — registration only.
                </p>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
