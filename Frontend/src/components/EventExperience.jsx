import { EXPERIENCE_STEPS } from "../data/eventData.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function EventExperience() {
  return (
    <section className="experience section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="exp-head">
          <SectionHeading
            eyebrow="03 — The Experience"
            title={
              <span id="experience-title">
                Six moves. <span className="t-italic t-emerald">One room.</span>
              </span>
            }
            className="sec-head--inline"
          />
          <p className="exp-note">
            Every hour is designed to move you forward — from first handshake
            to final takeaway.
          </p>
        </div>

        <div className="exp-grid">
          {EXPERIENCE_STEPS.map((step, i) => (
            <Reveal className="exp-cell" key={step.index} delay={i * 70} as="article">
              <p className="exp-num" aria-hidden="true">
                {step.index}
              </p>
              <h3 className="exp-title">{step.title}</h3>
              <p className="exp-desc">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
