import { EVENT, NAV_LINKS } from "../data/eventData.js";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from "./SocialIcons.jsx";

const PARTICIPATE_LINKS = [
  { label: "Student", href: "#categories" },
  { label: "Visitor", href: "#categories" },
  { label: "Entrepreneur", href: "#categories" },
  { label: "Business Tycoon", href: "#categories" },
];

/* Update URLs here once the real social profiles are ready. */
const socialLinks = [
  { name: "Facebook", url: "#", icon: FacebookIcon },
  { name: "Instagram", url: "#", icon: InstagramIcon },
  { name: "X / Twitter", url: "#", icon: XIcon },
  { name: "YouTube", url: "#", icon: YoutubeIcon },
];

export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  const linkProps = (id) => ({
    href: `#${id}`,
    onClick: (e) => {
      e.preventDefault();
      onNavigate(id);
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
                src="/images/Full_Logo.png"
                alt={`${EVENT.org} — Investment. Ideas, Execution, Growth.`}
              />
            </a>
            <p className="footer-tagline">
              Where ideas meet opportunity. A startup, business and investment
              event — built for the ones who build.
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
                    onNavigate("categories");
                  }}
                >
                  {link.label}
                </a>
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

        <div className="footer-bottom">
          <span>
            © {year} {EVENT.org} — {EVENT.city}, India
          </span>
          <span>Lineup, venue &amp; capacity subject to change</span>
          <span>Designed with ambition</span>
        </div>
      </div>
    </footer>
  );
}
