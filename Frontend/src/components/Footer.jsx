import { Link } from "react-router-dom";
import { EVENT, NAV_LINKS, WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "../data/eventData.js";
import { INDEPENDENCE_DISCLAIMER } from "../data/legalContent.js";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsappIcon,
  XIcon,
  YoutubeIcon,
} from "./SocialIcons.jsx";

const PARTICIPATE_LINKS = [
  { label: "Early Innovator", href: "#categories" },
  { label: "Visitor", href: "#categories" },
  { label: "Entrepreneur", href: "#categories" },
  { label: "Business Tycoon", href: "#categories" },
];

const LEGAL_LINKS = [
  { label: "Compliance", to: "/compliance" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Contact", to: "/contact" },
];

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const socialLinks = [
  { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61593793123130", icon: FacebookIcon },
  { name: "Instagram", url: "https://www.instagram.com/bmin.vestment/", icon: InstagramIcon },
  { name: "X / Twitter", url: "#", icon: XIcon },
  { name: "YouTube", url: "https://www.youtube.com/@BMIInvestment-h4z", icon: YoutubeIcon },
  { name: "WhatsApp", url: whatsappHref, icon: WhatsappIcon },
];

export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  const linkProps = (id) => ({
    href: `#${id}`,
    onClick: (e) => {
      e.preventDefault();
      if (onNavigate) onNavigate(id);
      else window.location.href = `/#${id}`;
    },
  });

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="footer-brand-mark" {...linkProps("home")} aria-label="BMI — back to top">
              <img
                className="footer-logo"
                src="/images/full_logo.png"
                alt={`${EVENT.org} — Independent non-education business growth platform.`}
              />
            </a>
            <p className="footer-tagline">
              Where ideas meet opportunity. An independent non-education
              business growth forum for founders who build.
            </p>
          </div>

          <nav className="footer-col" aria-label="Footer — explore">
            <p className="footer-title">Explore</p>
            <div className="footer-links">
              {NAV_LINKS.map((link) => (
                <a className="footer-link" key={link.id} {...linkProps(link.id)}>
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <nav className="footer-col footer-col--participate" aria-label="Footer — participate">
            <p className="footer-title">Participate</p>
            <div className="footer-links">
              {PARTICIPATE_LINKS.map((link) => (
                <a
                  className="footer-link"
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate("categories");
                    else window.location.href = "/#categories";
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <nav className="footer-col" aria-label="Footer — legal">
            <p className="footer-title">Legal</p>
            <div className="footer-links">
              {LEGAL_LINKS.map(({ label, to }) => (
                <Link className="footer-link" key={to} to={to}>
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          <nav className="footer-col" aria-label="Footer — connect">
            <p className="footer-title">Connect</p>
            <div className="footer-links">
              {socialLinks.map(({ name, url, icon: Icon }) => (
                <a
                  className="footer-link footer-link--social"
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="footer-link-icon" />
                  {name}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <p
          className="footer-disclaimer"
          style={{
            marginTop: "2rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            fontSize: "0.75rem",
            lineHeight: 1.55,
            opacity: 0.72,
            maxWidth: "52rem",
          }}
        >
          {INDEPENDENCE_DISCLAIMER}
        </p>

        <div className="footer-bottom">
          <span>
            © {year} {EVENT.org} — {EVENT.city}, India
          </span>
          <span>Lineup, venue &amp; capacity subject to change</span>
          <span>Independent · Non-education · Process-driven</span>
        </div>
      </div>
    </footer>
  );
}
