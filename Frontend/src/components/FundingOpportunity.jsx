import { FUNDING_THEMES, IMAGES, SCHOOL_FUNDING } from "../data/eventData.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function FundingOpportunity({ onRegister }) {
  return (
    <section
      className="funding section"
      id="opportunity"
      aria-labelledby="funding-title"
    >
      <div className="container funding-grid">
        <div className="funding-content">
          <Reveal>
            <SectionHeading
              eyebrow="05 — Funding & Opportunity"
              title={
                <span id="funding-title" className="funding-title">
                  Big ideas deserve{" "}
                  <span className="t-italic t-brass">a bigger stage.</span>
                </span>
              }
              dark
            />
          </Reveal>

          <Reveal delay={120}>
            <p className="funding-copy">
              The heart of the event: <strong>opportunity conversations</strong>{" "}
              that turn interest into momentum. Startups exploring funding,
              businesses planning their next scale, and investors looking for
              what comes next.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <ul className="funding-themes" aria-label="Opportunity themes">
              {FUNDING_THEMES.map((theme) => (
                <li className="funding-theme" key={theme}>
                  {theme}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={280}>
            <aside className="school-note" aria-label="School funding initiative">
              <div className="school-note-head">
                <span className="school-note-count">{SCHOOL_FUNDING.count}</span>
                <span className="school-note-label">{SCHOOL_FUNDING.label}</span>
              </div>
              <p className="school-note-body">{SCHOOL_FUNDING.body}</p>
              <ul className="school-list">
                {SCHOOL_FUNDING.schools.map((school) => (
                  <li className="school-row" key={school.name}>
                    <span>{school.name}</span>
                    <span className="school-row-status">{school.status}</span>
                  </li>
                ))}
              </ul>
              <p className="school-note-foot">{SCHOOL_FUNDING.note}</p>
            </aside>
          </Reveal>
        </div>

        <Reveal className="funding-media" delay={160}>
          <div className="funding-media-frame">
            <img
              src={IMAGES.pitch}
              alt="An entrepreneur presenting a startup plan to a room of listeners"
              loading="lazy"
            />
          </div>
          <p className="funding-media-caption">
            <span>Opportunity in the making</span>
            <span>Pitch · Listen · Scale</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
