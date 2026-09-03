import { HIGHLIGHTS } from "../data/eventData.js";
import Marquee from "./Marquee.jsx";
import Reveal from "./Reveal.jsx";

export default function Highlights() {
  return (
    <section
      className="highlights"
      id="highlights"
      aria-label="Event highlights"
    >
      <div className="container">
        <Reveal className="highlights-top">
          <p className="eyebrow eyebrow--emerald">09 — Event Highlights</p>
          <p className="highlights-line">What's in the room</p>
        </Reveal>
      </div>

      <Reveal>
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
