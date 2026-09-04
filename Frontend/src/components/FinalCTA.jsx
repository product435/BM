import { EVENT, SECTOR_FOCUS } from "../data/eventData.js";
import Carousel from "./Carousel.jsx";
import Reveal from "./Reveal.jsx";

export default function FinalCTA({ onRegister, onExploreCategories }) {
  return (
    <section className="cta-final" id="cta" aria-labelledby="cta-title">
      <div className="container sector-focus">
        <Reveal>
          <p className="eyebrow eyebrow--center">Last call — {EVENT.city}</p>
        </Reveal>

        <Reveal>
          <h3 className="cta-final-title">
            Investing in India's
            <br />
            <span className="t-italic">tomorrow.</span>
          </h3>
        </Reveal>

        <Reveal delay={80}>
          <Carousel
            items={SECTOR_FOCUS}
            trackClassName="sector-track"
            itemClassName="sector-card"
            variant="dark"
            ariaLabel="Investing in India's tomorrow — sectors"
            renderItem={(sector) => (
              <>
                <span className="sector-card-index">{sector.index}</span>
                <p className="sector-card-title">{sector.title}</p>
                <p className="sector-card-desc">{sector.description}</p>
              </>
            )}
          />
        </Reveal>
      </div>

      <div className="cta-final-inner">
        <span className="cta-ghost" aria-hidden="true">
          {EVENT.city} · {EVENT.date}
        </span>

        <Reveal delay={100}>
          <h2 className="sector-focus-title" id="cta-title">
            Your next idea could start here.
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p className="cta-final-sub">
            BMI focuses on scalable businesses and innovative startups across
            high-growth sectors driving our economy forward.
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
    </section>
  );
}
