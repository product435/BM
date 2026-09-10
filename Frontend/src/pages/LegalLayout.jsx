import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";

/**
 * Shared chrome for Compliance / Privacy / Terms / Contact pages.
 */
export default function LegalLayout({ eyebrow, title, lastUpdated, children }) {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <header
        className="header is-scrolled"
        style={{ position: "sticky", top: 0, zIndex: 50 }}
      >
        <div className="container nav">
          <Link to="/" className="nav-brand" aria-label="BMI — home">
            <img className="nav-logo" src="/images/full_logo.png" alt="BMI logo" />
          </Link>
          <nav className="nav-links" aria-label="Legal navigation">
            <Link className="nav-link" to="/compliance">
              Compliance
            </Link>
            <Link className="nav-link" to="/privacy">
              Privacy
            </Link>
            <Link className="nav-link" to="/terms">
              Terms
            </Link>
            <Link className="nav-link" to="/contact">
              Contact
            </Link>
          </nav>
          <div className="nav-actions">
            <Link to="/#register" className="btn btn--light nav-cta">
              Register for the event
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="section" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div className="container" style={{ maxWidth: "42rem" }}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 style={{ marginTop: "0.5rem", marginBottom: "0.75rem", fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            {title}
          </h1>
          {lastUpdated && (
            <p style={{ fontSize: "0.8125rem", opacity: 0.65, marginBottom: "2rem" }}>
              Last updated: {lastUpdated}
            </p>
          )}
          {children}
          <p style={{ marginTop: "2.5rem" }}>
            <Link to="/" style={{ textDecoration: "underline" }}>
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
