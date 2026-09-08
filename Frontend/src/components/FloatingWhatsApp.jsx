import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "../data/eventData.js";

/**
 * FloatingWhatsApp — fixed bottom-right chat button, mounted once at
 * the app root (see App.jsx). Independent of the footer CONNECT →
 * WhatsApp link; both exist side by side.
 *
 * The number/message live in eventData.js (WHATSAPP_NUMBER /
 * WHATSAPP_MESSAGE) so they can be updated in one place later.
 */
export default function FloatingWhatsApp() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      className="floating-whatsapp"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <img src="/images/whatsapp_icon.png" alt="" className="floating-whatsapp-icon" />
    </a>
  );
}
