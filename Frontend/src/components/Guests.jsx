import { GUESTS_NOTE } from "../data/guests.js";
import GuestCard from "./GuestCard.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { useSiteContent } from "../context/SiteContext.jsx";

export default function Guests() {
  const { content } = useSiteContent();
  const guests = content?.guests || [];
  return (
    <section className="guests section" id="guests" aria-labelledby="guests-title">
      <div className="container">
        <div className="guests-head">
          <SectionHeading
            eyebrow="07 — The Guests"
            title={
              <span id="guests-title">
                Meet the people{" "}
                <span className="t-italic t-emerald">shaping</span> the
                conversation.
              </span>
            }
            className="sec-head--inline"
          />
          <p className="guests-note">{GUESTS_NOTE}</p>
        </div>

        <div className="guest-grid">
          {guests.map((guest, i) => (
            <Reveal key={guest.id} delay={(i % 3) * 90}>
              <GuestCard guest={guest} index={i} />
            </Reveal>
          ))}
        </div>

        <div className="guests-foot">
          <span>Roles &amp; session details — being finalized</span>
          <span>Jaipur · {`\u2192`} the 20th</span>
        </div>
      </div>
    </section>
  );
}
