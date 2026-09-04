import { EVENT, SECTOR_FOCUS, SECTOR_FOCUS_HEADING } from "../data/eventData.js";
import Reveal from "./Reveal.jsx";

export default function FinalCTA({ onRegister, onExploreCategories }) {
  return (
    <section className="cta-final" id="cta" aria-labelledby="cta-title">
      <div className="cta-final-inner">
        <span className="cta-ghost" aria-hidden="true">
          {EVENT.city} · {EVENT.date}
        </span>

        <Reveal>
          <p className="eyebrow eyebrow--center">Last call — {EVENT.city}</p>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="cta-final-title" id="cta-title">
            Your next idea
            <br />
            could <span className="t-italic">start here.</span>
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p className="cta-final-sub">
            BMI focuses on scalable businesses and innovative startups across
            high-growth sectors driving our economy forward.
            <br />
            The event is being assembled. The conversations are being planned.
            The only thing missing is you.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="cta-final-actions">
            <button type="button" className="btn btn--light" onClick={onRegister}>
              Register for the event
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <button
              type="button"
              className="btn btn--ghost-light"
              onClick={onExploreCategories}
            >
              Explore the categories
            </button>
          </div>
        </Reveal>

        <Reveal delay={380}>
          <p className="cta-final-meta">
            <span>{EVENT.date}</span>
            <span>{EVENT.city}</span>
            <span>Venue {EVENT.venue.status}</span>
          </p>
        </Reveal>
      </div>

      <div className="container sector-focus">
        <Reveal>
          <h3 className="sector-focus-title">{SECTOR_FOCUS_HEADING}</h3>
        </Reveal>

        <Reveal delay={80}>
          <div className="sector-track">
            {SECTOR_FOCUS.map((sector) => (
              <div className="sector-card" key={sector.index}>
                <span className="sector-card-index">{sector.index}</span>
                <p className="sector-card-title">{sector.title}</p>
                <p className="sector-card-desc">{sector.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
