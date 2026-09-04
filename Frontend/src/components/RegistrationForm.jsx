import { useEffect, useRef, useState } from "react";
import { CATEGORIES, CATEGORY_SHORT, FORM_FIELDS } from "../data/eventData.js";
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
  
  return { ok: true };
}

const ERROR_MESSAGES = {
  required: "This field is required.",
  email: "Enter a valid email address.",
  phone: "Enter a valid phone number (at least 10 digits).",
  url: "Enter a valid URL starting with http:// or https://.",
};

function validateField(field, value) {
  const v = String(value ?? "").trim();
  if (field.required && !v) return ERROR_MESSAGES.required;
  if (!v) return null;
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    return ERROR_MESSAGES.email;
  }
  if (field.type === "tel") {
    const digits = v.replace(/\D/g, "");
    if (digits.length < 10 || !/^[+\d][\d\s\-()]*$/.test(v)) return ERROR_MESSAGES.phone;
  }
  if (field.type === "url" && !/^https?:\/\/.+\..+/.test(v)) {
    return ERROR_MESSAGES.url;
  }
  return null;
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
  const [values, setValues] = useState(() => buildInitialValues(fields));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const firstErrorRef = useRef(null);

  // External category pre-selection (e.g. from the Categories section).
  useEffect(() => {
    if (initialCategory && initialCategory !== category) {
      setCategory(initialCategory);
      setValues(buildInitialValues(FORM_FIELDS[initialCategory]));
      setErrors({});
      setTouched({});
      setStatus("idle");
    }
  }, [initialCategory, category]);

  const chooseCategory = (id) => {
    setCategory(id);
    setValues(buildInitialValues(FORM_FIELDS[id]));
    setErrors({});
    setTouched({});
    setStatus("idle");
    if (onCategoryChanged) onCategoryChanged(id);
  };

  const handleChange = (field) => (e) => {
    const next = { ...values, [field.name]: e.target.value };
    setValues(next);
    if (touched[field.name]) {
      setErrors((prev) => ({
        ...prev,
        [field.name]: validateField(field, e.target.value),
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
    <div className="reg-panel">
      <div className="reg-panel-head">
        <h3 className="reg-panel-title">Register for the event</h3>
        <p className="reg-panel-step">Step 01 — Choose category</p>
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

          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            {fields.map((field) => {
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
                inputMode: field.type === "tel" ? "tel" : field.type === "email" ? "email" : undefined,
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
        </>
      )}
    </div>
  );
}
