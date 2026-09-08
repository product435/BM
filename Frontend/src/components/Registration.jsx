import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";
import RegistrationForm from "./RegistrationForm.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Registration({
  selectedCategory,
  onCategoryChanged,
  previewData
}) {
  const [data, setData] = useState(null);

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
    };

    fetchData();
  }, [previewData]);

  const eyebrow = data?.eyebrow || "11 — Registration";
  const titleHtml = data?.title || `Ready to be <span class="t-italic t-emerald">part of the event?</span>`;
  const lede = data?.lede || "Seats are limited and the event is curated. Tell us who's coming and how you want to show up.";
  
  const defaultSteps = [
    { title: "Choose your category.", description: "Student, Visitor, Entrepreneur or Business Tycoon." },
    { title: "Share your details.", description: "The form adapts to your path." },
    { title: "We confirm your seat.", description: "You show up on the day and make the event count." }
  ];
  const steps = data?.steps || defaultSteps;

  const dynamicFees = {
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
          </div>

          <Reveal className="reg-right" delay={120}>
            <RegistrationForm
              initialCategory={selectedCategory}
              onCategoryChanged={onCategoryChanged}
              dynamicFees={dynamicFees}
              dynamicUpiId={upiId}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
