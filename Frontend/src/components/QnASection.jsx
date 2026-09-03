import { QA_SESSION } from "../data/eventData.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function QnASection() {
  return (
    <section className="qa section" id="qa" aria-labelledby="qa-title">
      <div className="container">
        <div className="qa-grid">
          <div className="qa-left">
            <Reveal>
              <span className="qa-mark" aria-hidden="true">
                “
              </span>
              <SectionHeading
                eyebrow="08 — Q&A Session"
                title={
                  <span id="qa-title">
                    Ask. <span className="t-italic t-brass">Challenge.</span>{" "}
                    Learn.
                  </span>
                }
                lede="An open-floor conversation, not a monologue. Bring the questions you've been sitting on — the room is listening."
                dark
              />
            </Reveal>
          </div>

          <Reveal className="qa-quote" delay={120}>
            <blockquote>“{QA_SESSION.quote}”</blockquote>
          </Reveal>

          <Reveal className="qa-steps" delay={160}>
            {QA_SESSION.steps.map((step) => (
              <div className="qa-step" key={step.index}>
                <span className="qa-step-index">{step.index}</span>
                <div>
                  <h3 className="qa-step-title">{step.title}</h3>
                  <p className="qa-step-text">{step.text}</p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="qa-host" delay={200}>
            <div>
              <p className="qa-host-label">On the floor</p>
              <p className="qa-host-name">{QA_SESSION.host}</p>
            </div>
            <p className="qa-host-note">{QA_SESSION.hostNote}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
