import { useEffect, useState } from "react";
import { EVENT, NAV_LINKS } from "../data/eventData.js";

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const go = (id) => {
    setMenuOpen(false);
    // Let the menu close before scrolling.
    window.setTimeout(() => onNavigate(id), 60);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container nav">
          <a
            href="#home"
            className="nav-brand"
            aria-label={`${EVENT.org} — ${EVENT.city} event, back to top`}
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
          >
            <img
              className="nav-logo"
              src="/images/BMI_Logo.png"
              alt={`${EVENT.org} logo`}
            />
          </a>

          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.id);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="btn btn--light nav-cta"
              onClick={() => go("register")}
            >
              Register now
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <button
              type="button"
              className={`nav-burger ${menuOpen ? "is-open" : ""}`}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <nav className="mobile-menu-links" aria-label="Mobile">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="mobile-menu-link"
              style={{ "--i": i }}
              onClick={(e) => {
                e.preventDefault();
                go(link.id);
              }}
            >
              <span className="m-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="m-label">{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="mobile-menu-foot">
          <span className="mobile-menu-meta">
            {EVENT.city} · {EVENT.date}
          </span>
          <button
            type="button"
            className="btn btn--light"
            onClick={() => go("register")}
          >
            Register now
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
