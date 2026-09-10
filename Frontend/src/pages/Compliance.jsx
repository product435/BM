import LegalLayout from "./LegalLayout.jsx";
import { COMPLIANCE_PAGE } from "../data/legalContent.js";

export default function Compliance() {
  const { title, eyebrow, sections } = COMPLIANCE_PAGE;
  return (
    <LegalLayout eyebrow={eyebrow} title={title}>
      {sections.map((section) => (
        <section key={section.heading} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>{section.heading}</h2>
          {section.body.map((para, i) => (
            <p key={i} style={{ marginBottom: "0.75rem", lineHeight: 1.65, opacity: 0.9 }}>
              {para}
            </p>
          ))}
        </section>
      ))}
    </LegalLayout>
  );
}
