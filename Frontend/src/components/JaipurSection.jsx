import { EVENT, IMAGES } from "../data/eventData.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function JaipurSection({ onRegister, onExploreCategories }) {
  return (
    <section className="jaipur section" id="jaipur" aria-labelledby="jaipur-title">
      <div className="container">
        <div className="jaipur-grid">
          <Reveal className="jaipur-media">
            <div className="jaipur-media-frame">
              <img
                src={IMAGES.jaipur}
                alt="Hawa Mahal in Jaipur illuminated at night"
                loading="lazy"
              />
            </div>
            <p className="jaipur-caption">
              The Pink City — tradition with an eye on tomorrow
            </p>
          </Reveal>

          <div className="jaipur-content">
            <Reveal>
              <SectionHeading
                eyebrow="10 — The Venue"
                title={
                  <span id="jaipur-title">
                    The next conversation{" "}
                    <span className="t-italic t-brass">starts in Jaipur.</span>
                  </span>
                }
                dark
              />
            </Reveal>

            <Reveal delay={100}>
              <p className="jaipur-copy">
                A city of <strong>craft and commerce</strong> home to a
                growing student andstartup ecosystem, campuses like{" "}
                <strong>MNIT</strong>, and a generation of founders who
                build for India. Jaipur isn't just the backdrop.{" "}
                <strong>It's part of the pitch.</strong>
              </p>
            </Reveal>

            <Reveal delay={180}>
              <dl className="jaipur-rows">
                <div className="jaipur-row">
                  <dt className="jaipur-row-label">Event date</dt>
                  <dd className="jaipur-row-value jaipur-row-value--date">{EVENT.date}</dd>
                </div>
                <div className="jaipur-row">
                  <dt className="jaipur-row-label">Location</dt>
                  <dd className="jaipur-row-value">{EVENT.city}</dd>
                </div>
                <div className="jaipur-row">
                  <dt className="jaipur-row-label">Venue</dt>
                  <dd className="jaipur-row-value">{EVENT.venue.status}</dd>
                </div>
                <div className="jaipur-row">
                  <dt className="jaipur-row-label">Participation</dt>
                  <dd className="jaipur-row-value">By registration</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={240}>
              <div className="jaipur-ctas">
                <button type="button" className="btn btn--light" onClick={onRegister}>
                  Register interest
                  <span className="btn-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <button
                  type="button"
                  className="btn btn--ghost-light"
                  onClick={onExploreCategories}
                >
                  See the categories
                </button>
              </div>
              <p className="jaipur-note">{EVENT.venue.note}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
