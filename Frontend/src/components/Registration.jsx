import { EVENT } from "../data/eventData.js";
import RegistrationForm from "./RegistrationForm.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function Registration({ selectedCategory, onCategoryChanged }) {
  return (
    <section
      className="registration section"
      id="register"
      aria-labelledby="register-title"
    >
      <div className="container">
        <div className="reg-grid">
          <div className="reg-left">
            <Reveal>
              <SectionHeading
                eyebrow="11 — Registration"
                title={
                  <span id="register-title">
                    Ready to be{" "}
                    <span className="t-italic t-emerald">part of the event?</span>
                  </span>
                }
                lede="Seats are limited and the event is curated. Tell us who's coming — and how you want to show up."
              />
            </Reveal>

            <Reveal delay={100}>
              <ol className="reg-steps" aria-label="What happens next">
                <li className="reg-step">
                  <span className="reg-step-index">01</span>
                  <span className="reg-step-text">
                    <strong>Choose your category.</strong> Student, visitor,
                    entrepreneur or business tycoon.
                  </span>
                </li>
                <li className="reg-step">
                  <span className="reg-step-index">02</span>
                  <span className="reg-step-text">
                    <strong>Share your details.</strong> The form adapts to
                    your path.
                  </span>
                </li>
                <li className="reg-step">
                  <span className="reg-step-index">03</span>
                  <span className="reg-step-text">
                    <strong>We confirm your seat.</strong> You show up on the{" "}
                    {EVENT.date} and make the event count.
                  </span>
                </li>
              </ol>
            </Reveal>

            <Reveal delay={180}>
              <aside className="reg-glance" aria-label="Event capacity at a glance">
                <p className="reg-glance-title">The event at a glance</p>
                <div className="reg-glance-rows">
                  <div className="reg-glance-row">
                    <span>Invitations planned</span>
                    <span>{EVENT.capacity.invitations}</span>
                  </div>
                  <div className="reg-glance-row">
                    <span>Businesses expected</span>
                    <span>{EVENT.capacity.businesses}</span>
                  </div>
                  <div className="reg-glance-row">
                    <span>Visitor capacity</span>
                    <span>{EVENT.capacity.visitors}</span>
                  </div>
                </div>
                <p className="reg-glance-note">{EVENT.capacity.note}</p>
              </aside>
            </Reveal>
          </div>

          <Reveal className="reg-right" delay={120}>
            <RegistrationForm
              initialCategory={selectedCategory}
              onCategoryChanged={onCategoryChanged}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
