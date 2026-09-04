import {
  EVENT_AGENDA,
  EVENT_VALUE_STRIP,
  EXPERIENCE_SPECIAL,
  HIGHLIGHTS,
} from "../data/eventData.js";
import Carousel from "./Carousel.jsx";
import Marquee from "./Marquee.jsx";
import Reveal from "./Reveal.jsx";

export default function Highlights() {
  return (
    <section
      className="highlights"
      id="highlights"
      aria-label="Event day experience and highlights"
    >
      <div className="container">
        <Reveal className="highlights-intro">
          <p className="eyebrow eyebrow--emerald">09 — Event Day Experience</p>
          <h2 className="highlights-heading">
            A full day of ideas, insights &amp; impact.
          </h2>
          <p className="highlights-sub">
            Curated sessions, expert interactions, founder pitches, business
            networking and investment opportunities — all in one powerful
            experience.
          </p>
        </Reveal>

        <Reveal className="agenda" delay={60}>
          <div className="agenda-head">
            <p className="agenda-title">Event Agenda</p>
          </div>
          <Carousel
            items={EVENT_AGENDA}
            trackClassName="agenda-track"
            itemClassName="agenda-item"
            variant="light"
            ariaLabel="Event agenda"
            renderItem={(item) => (
              <>
                <p className="agenda-time">{item.time}</p>
                <p className="agenda-item-title">{item.title}</p>
                <p className="agenda-item-desc">{item.description}</p>
              </>
            )}
          />
        </Reveal>

        <Reveal className="special" delay={100}>
          <p className="special-title">What Makes It Special?</p>
          <Carousel
            items={EXPERIENCE_SPECIAL}
            trackClassName="special-grid"
            itemClassName="special-item"
            variant="light"
            ariaLabel="What makes it special"
            renderItem={(item) => (
              <>
                <span className="special-index">{item.index}</span>
                <p className="special-item-title">{item.title}</p>
                <p className="special-item-desc">{item.description}</p>
              </>
            )}
          />
        </Reveal>

        <Reveal className="value-strip-block" delay={140}>
          <p className="special-title">What's in the event</p>
          <Carousel
            items={EVENT_VALUE_STRIP}
            trackClassName="value-strip"
            itemClassName="value-strip-item"
            variant="light"
            ariaLabel="What's in the event"
            renderItem={(item, i) => (
              <>
                <span className="value-strip-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="value-strip-title">{item.title}</p>
                <p className="value-strip-desc">{item.description}</p>
              </>
            )}
          />
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="marquee-row">
          <Marquee items={HIGHLIGHTS.slice(0, 4)} speed={36} />
        </div>
        <div className="marquee-row">
          <Marquee items={HIGHLIGHTS.slice(4)} reverse outlined speed={44} />
        </div>
      </Reveal>
    </section>
  );
}
