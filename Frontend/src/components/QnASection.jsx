import { useState } from "react";
import { QA_FAQ } from "../data/eventData.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { useSiteContent } from "../context/SiteContext.jsx";

export default function QnASection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { content } = useSiteContent();
  const qaSession = content?.faq;

  if (!qaSession) return null;

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
                lede="An open-floor conversation, not a monologue. Bring the questions you've been sitting on — the event is listening."
                dark
              />
            </Reveal>
          </div>

          <Reveal className="qa-quote" delay={120}>
            <blockquote>“{qaSession.quote}”</blockquote>
          </Reveal>

          <Reveal className="qa-faq" delay={160}>
            <p className="qa-faq-title">FAQ</p>
            <div className="qa-faq-list">
              {QA_FAQ.map((item, i) => {
                const open = openIndex === i;
                return (
                  <div className="qa-faq-item" key={item.question}>
                    <button
                      type="button"
                      className="qa-faq-toggle"
                      aria-expanded={open}
                      aria-controls={`qa-faq-panel-${i}`}
                      onClick={() => setOpenIndex(open ? -1 : i)}
                    >
                      <span className="qa-faq-question">{item.question}</span>
                      <span
                        className={`qa-faq-icon ${open ? "is-open" : ""}`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                    <div
                      id={`qa-faq-panel-${i}`}
                      className={`qa-faq-panel ${open ? "is-open" : ""}`}
                    >
                      <div className="qa-faq-panel-inner">
                        <p className="qa-faq-answer">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
