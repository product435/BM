import { useState } from "react";
import { WHY_ITEMS } from "../data/eventData.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function WhyItMatters({ onExploreCategories }) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="why section" id="why" aria-labelledby="why-title">
      <div className="container">
        <div className="why-grid">
          <div className="why-left">
            <SectionHeading
              eyebrow="02 — Why It Matters"
              title={
                <span id="why-title">
                  Why this <span className="t-italic t-brass">event</span>{" "}
                  matters.
                </span>
              }
              lede="Opportunity rarely announces itself. This event exists so the people building things and the people backing them can find each other in person."
              dark
            />
            <button
              type="button"
              className="btn btn--ghost-light"
              onClick={onExploreCategories}
            >
              Explore the categories
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          <div className="why-right">
            {WHY_ITEMS.map((item, i) => {
              const open = openIndex === i;
              return (
                <Reveal className="why-item" key={item.index} delay={i * 60}>
                  <button
                    type="button"
                    className="why-toggle"
                    aria-expanded={open}
                    aria-controls={`why-panel-${item.index}`}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                  >
                    <span className="why-index">{item.index}</span>
                    <span className="why-title">{item.title}</span>
                    <span className={`why-icon ${open ? "is-open" : ""}`} aria-hidden="true">
                      +
                    </span>
                  </button>
                  <div
                    id={`why-panel-${item.index}`}
                    className={`why-panel ${open ? "is-open" : ""}`}
                  >
                    <div className="why-panel-inner">
                      <div className="why-panel-content">
                        <p className="why-panel-text">{item.description}</p>
                        <div className="why-tags">
                          {item.tags.map((tag) => (
                            <span className="why-tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
