import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";
import RegistrationForm from "./RegistrationForm.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { REGISTRATION_FEES } from "../data/eventData.js";
import { EVENT_FOCUS_DECLARATION } from "../data/legalContent.js";

export default function Registration({
  selectedCategory,
  onCategoryChanged,
  previewData
}) {
  const [data, setData] = useState(null);
  const [formConfig, setFormConfig] = useState(null);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      return;
    }

    const fetchData = async () => {
      const { data: regData, error } = await supabase
        .from("registration_content")
        .select("*")
        .eq("id", 1)
        .single();
      
      if (regData && !error) {
        setData(regData);
      }

      const { data: configData, error: configError } = await supabase
        .from("form_config")
        .select("*")
        .eq("id", 1)
        .single();
      
      if (configData && !configError) {
        setFormConfig(configData);
      }
    };

    fetchData();
  }, [previewData]);

  const eyebrow = data?.eyebrow || "11 — Registration";
  const titleHtml = data?.title || `Ready to be <span class="t-italic t-emerald">part of the event?</span>`;
  const lede = data?.lede || "Seats are limited and the event is curated. Tell us who's coming and how you want to show up.";
  
  const defaultSteps = [
    { title: "Choose your category.", description: "Early Innovator, Visitor, Entrepreneur or Business Tycoon." },
    { title: "Share your details.", description: "Including sector screening and compliance declarations." },
    { title: "We review & confirm.", description: "Applications may be screened before confirmation." }
  ];
  const steps = data?.steps || defaultSteps;

  // Root cause of Entrepreneur/Business Tycoon showing "Free" with no
  // QR: the form_config.categories row seeded by the original
  // migration has no `fee` key on any category at all. `cat.fee ?? 0`
  // silently resolved every category with a missing fee to 0 — which
  // is invisible for Student (0 is the correct fee) and only visible
  // once a category is genuinely paid. Any category an admin has
  // since edited via the form builder (which does save a real `fee`
  // value) works correctly; Entrepreneur/Business Tycoon apparently
  // never were, so they fell through to 0. Normalizing here: prefer
  // Supabase's fee only when it's an actual number (Number.isFinite
  // rejects undefined/null/NaN, but still accepts a deliberate 0),
  // otherwise fall back to this category's own known default fee
  // (REGISTRATION_FEES) instead of a blanket 0 for every category.
  const dynamicFees = formConfig?.categories?.reduce((acc, cat) => ({
    ...acc,
    [cat.id]: Number.isFinite(cat.fee) ? cat.fee : (REGISTRATION_FEES[cat.id] ?? 0)
  }), {}) || {
    student: data?.fee_student ?? 0,
    visitor: data?.fee_visitor ?? 500,
    entrepreneur: data?.fee_entrepreneur ?? 1000,
    businessTycoon: data?.fee_business_tycoon ?? 2000
  };
  const upiId = data?.upi_id || "bmipresents@upi";

  return (
    <section
      className="registration section"
      id="register"
      aria-labelledby="register-title"
    >
      <div className="container">
        <div className="reg-grid">
          <div className="reg-left">
            <Reveal>
              <SectionHeading
                eyebrow={eyebrow}
                title={
                  <span id="register-title" dangerouslySetInnerHTML={{ __html: titleHtml }} />
                }
                lede={lede}
              />
            </Reveal>

            <Reveal delay={100}>
              <ol className="reg-steps" aria-label="What happens next">
                {steps.map((step, index) => (
                  <li className="reg-step" key={index}>
                    <span className="reg-step-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="reg-step-text">
                      <strong>{step.title}</strong> {step.description}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={140}>
              <p
                className="reg-compliance-note"
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.8125rem",
                  lineHeight: 1.55,
                  opacity: 0.8,
                  maxWidth: "28rem",
                }}
              >
                {EVENT_FOCUS_DECLARATION}
              </p>
              <p
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.75rem",
                  lineHeight: 1.5,
                  opacity: 0.7,
                  maxWidth: "28rem",
                }}
              >
                Registration fees (where applicable) are for event participation only — not an investment or capital contribution.
              </p>
            </Reveal>
          </div>

          <Reveal className="reg-right" delay={120}>
            <RegistrationForm
              initialCategory={selectedCategory}
              onCategoryChanged={onCategoryChanged}
              dynamicFees={dynamicFees}
              dynamicUpiId={upiId}
              dynamicCategories={formConfig?.categories}
              dynamicFields={formConfig?.form_fields}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
