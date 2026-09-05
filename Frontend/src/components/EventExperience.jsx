import {
  EXPERIENCE_CLOSING_LINE,
  EXPERIENCE_HIGHLIGHTS,
  EXPERIENCE_STEPS,
  WHAT_TO_EXPECT,
} from "../data/eventData.js";
import Carousel from "./Carousel.jsx";
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
                What makes BMI <span className="t-italic t-emerald">different?</span>
              </span>
            }
            className="sec-head--inline"
          />
          <p className="exp-note">
            More than funding a structured ecosystem built around
            evaluation, expertise, support and meaningful business
            connections.
          </p>
        </div>

        <Carousel
          items={EXPERIENCE_STEPS}
          trackClassName="exp-grid"
          itemClassName="exp-cell"
          variant="light"
          ariaLabel="What makes BMI different"
          showDots
          renderItem={(step, i) => (
            <Reveal delay={i * 70} as="article">
              <p className="exp-num" aria-hidden="true">
                {step.index}
              </p>
              <h3 className="exp-title">{step.title}</h3>
              <p className="exp-desc">{step.description}</p>
            </Reveal>
          )}
        />

        <Reveal className="exp-sub" delay={60}>
          <p className="exp-sub-title">Key Experience Highlights</p>
          <Carousel
            items={EXPERIENCE_HIGHLIGHTS}
            trackClassName="exp-highlights"
            itemClassName="exp-highlight"
            variant="light"
            ariaLabel="Key experience highlights"
            showDots
            renderItem={(item) => (
              <>
                <span className="exp-highlight-index">{item.index}</span>
                <p className="exp-highlight-title">{item.title}</p>
                <p className="exp-highlight-desc">{item.description}</p>
              </>
            )}
          />
        </Reveal>

        <Reveal className="exp-sub" delay={100}>
          <p className="exp-sub-title">What to Expect</p>
          <ul className="exp-expect" aria-label="What to expect">
            {WHAT_TO_EXPECT.map((point) => (
              <li className="exp-expect-item" key={point}>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140}>
          <p className="exp-closing">{EXPERIENCE_CLOSING_LINE}</p>
        </Reveal>
      </div>
    </section>
  );
}
