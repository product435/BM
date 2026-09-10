import { Link } from "react-router-dom";
import LegalLayout from "./LegalLayout.jsx";
import { CONTACT_PAGE } from "../data/legalContent.js";
import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "../data/eventData.js";

export default function Contact() {
  const { title, eyebrow, intro, email, note } = CONTACT_PAGE;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <LegalLayout eyebrow={eyebrow} title={title}>
      <p style={{ marginBottom: "1.5rem", lineHeight: 1.65, opacity: 0.9 }}>{intro}</p>
      <p style={{ marginBottom: "0.75rem", lineHeight: 1.65 }}>
        <strong>Email:</strong>{" "}
        <a href={`mailto:${email}`} style={{ textDecoration: "underline" }}>
          {email}
        </a>
      </p>
      <p style={{ marginBottom: "0.75rem", lineHeight: 1.65 }}>
        <strong>WhatsApp:</strong>{" "}
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
          Message us
        </a>
      </p>
      <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", opacity: 0.75, lineHeight: 1.55 }}>{note}</p>
      <p style={{ marginTop: "1.5rem" }}>
        <Link to="/compliance" style={{ textDecoration: "underline", marginRight: "1rem" }}>
          Compliance note
        </Link>
        <Link to="/privacy" style={{ textDecoration: "underline", marginRight: "1rem" }}>
          Privacy
        </Link>
        <Link to="/terms" style={{ textDecoration: "underline" }}>
          Terms
        </Link>
      </p>
    </LegalLayout>
  );
}
