import { EVENT, NAV_LINKS } from "../data/eventData.js";

const PARTICIPATE_LINKS = [
  { label: "Student", href: "#categories" },
  { label: "Startup", href: "#categories" },
  { label: "School", href: "#categories" },
  { label: "Visitor", href: "#categories" },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "X / Twitter", href: "#" },
  { label: "YouTube", href: "#" },
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
              {SOCIAL_LINKS.map((link) => (
                <a
                  className="footer-link"
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <span className="ext" aria-hidden="true">
                    ↗
                  </span>
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
