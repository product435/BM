import { HIGHLIGHTS, EVENT_AGENDA, EXPERIENCE_SPECIAL, EVENT_VALUE_STRIP } from "../data/eventData.js";
import Carousel from "./Carousel.jsx";
import Marquee from "./Marquee.jsx";
import Reveal from "./Reveal.jsx";

export default function Highlights({ experienceData = null }) {
  const content = experienceData || {
    eyebrow: '09 — Event Day Experience',
    heading: 'A full day of ideas, insights & impact.',
    subheading: 'Curated sessions, expert interactions, founder pitches, business networking and investment opportunities — all in one powerful experience.',
    agenda: EVENT_AGENDA,
    special_items: EXPERIENCE_SPECIAL,
    value_strip: EVENT_VALUE_STRIP
  };

  const parseItems = (items) => {
    if (!items) return [];
    if (typeof items === 'string') {
      try {
        const parsed = JSON.parse(items);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(items) ? items : [];
  };

  const parsedAgenda = parseItems(content.agenda);
  const parsedSpecial = parseItems(content.special_items);
  const parsedValue = parseItems(content.value_strip);

  const agendaItems = parsedAgenda.length > 0 ? parsedAgenda : EVENT_AGENDA;
  const specialItems = parsedSpecial.length > 0 ? parsedSpecial : EXPERIENCE_SPECIAL;
  const valueStripItems = parsedValue.length > 0 ? parsedValue : EVENT_VALUE_STRIP;
  return (
    <section
      className="highlights"
      id="highlights"
      aria-label="Event day experience and highlights"
    >
      <div className="container">
        <Reveal className="highlights-intro">
          <p className="eyebrow eyebrow--emerald">{content.eyebrow}</p>
          <h2 className="highlights-heading">
            {content.heading}
          </h2>
          <p className="highlights-sub">
            Curated sessions, expert interactions, founder pitches, business
            networking and investment opportunities all in one powerful
            experience.
          </p>
        </Reveal>

        <Reveal className="agenda" delay={60}>
          <div className="agenda-head">
            <p className="agenda-title">Event Agenda</p>
          </div>
          <Carousel
            items={agendaItems}
            trackClassName="agenda-track"
            itemClassName="agenda-item"
            variant="light"
            ariaLabel="Event agenda"
            showDots
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
            items={specialItems}
            trackClassName="special-grid"
            itemClassName="special-item"
            variant="light"
            ariaLabel="What makes it special"
            showDots
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
            items={valueStripItems}
            trackClassName="value-strip"
            itemClassName="value-strip-item"
            variant="light"
            ariaLabel="What's in the event"
            showDots
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
