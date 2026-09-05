import { HOW_IT_WORKS } from "../data/eventData.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function HowItWorks({ onRegister }) {
  return (
    <section className="how section" id="how" aria-labelledby="how-title">
      <div className="container">
        <SectionHeading
          eyebrow="06 — How It Works"
          title={
            <span id="how-title">
              Join collaborate create <span className="t-italic t-brass">impact.</span>
            </span>
          }
          dark
        />
        <p className="sec-lede">
          BMI Startup &amp; Business Launch 2026 is more than an event. It is
          the beginning of a movement to build future ready businesses and a
          stronger India.
        </p>
        <p className="sec-lede how-lede-accent">
          <strong className="t-italic t-brass">Be part of something bigger.</strong>
        </p>

        <div className="how-grid">
          {HOW_IT_WORKS.map((step, i) => (
            <Reveal className="how-cell" key={step.index} delay={i * 80} as="article">
              <p className="how-step">Step {step.index}</p>
              <p className="how-num" aria-hidden="true">
                {step.index}
              </p>
              <h3 className="how-title">{step.title}</h3>
              <p className="how-desc">{step.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="how-foot" delay={120}>
          <span>Capacity is limited — registration is the only way.</span>
          <button type="button" className="btn btn--light" onClick={onRegister}>
            Start your registration
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
