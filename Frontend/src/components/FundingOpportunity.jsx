import { BMI_SUPPORT_MODEL, FUNDING_AUDIENCE, IMAGES } from "../data/eventData.js";
import Carousel from "./Carousel.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function FundingOpportunity({ onRegister }) {
  return (
    <section
      className="funding section"
      id="opportunity"
      aria-labelledby="funding-title"
    >
      <div className="container funding-grid">
        <div className="funding-content">
          <Reveal>
            <SectionHeading
              eyebrow="05 — Funding & BMI Support"
              title={
                <span id="funding-title" className="funding-title">
                  Every idea deserves{" "}
                  <span className="t-italic t-brass">a bigger stage.</span>
                </span>
              }
              dark
            />
          </Reveal>

          <Reveal delay={120}>
            <p className="funding-copy">
              BMI believes in supporting ideas and businesses with the right
              blend of <strong>capital, capability, and connections</strong>{" "}
              to help them grow and scale.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="funding-list-label">Who is this for?</p>
            <ul className="funding-themes" aria-label="Who this is for">
              {FUNDING_AUDIENCE.map((item) => (
                <li className="funding-theme" key={item.index}>
                  <span className="funding-theme-index">{item.index}</span>
                  <span className="funding-theme-copy">
                    <span className="funding-theme-title">{item.title}</span>
                    <span className="funding-theme-desc">{item.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={280}>
            <aside className="school-note" aria-label="The BMI support model">
              <div className="school-note-head">
                <span className="school-note-label">{BMI_SUPPORT_MODEL.label}</span>
              </div>
              <Carousel
                items={BMI_SUPPORT_MODEL.items}
                trackClassName="school-list"
                itemClassName="school-row"
                variant="dark"
                bleed={false}
                ariaLabel="The BMI support model"
                renderItem={(item) => (
                  <>
                    <span className="school-row-index">{item.index}</span>
                    <span className="school-row-copy">
                      <span className="school-row-title">{item.title}</span>
                      <span className="school-row-desc">{item.description}</span>
                    </span>
                  </>
                )}
              />
            </aside>
          </Reveal>
        </div>

        <Reveal className="funding-media" delay={160}>
          <div className="funding-media-frame">
            <img
              src="/images/vikas sir.png"
              alt="Vikas — speaker at the BMI event"
              loading="lazy"
            />
          </div>
          <p className="funding-media-caption">
            <span>Opportunity in the making</span>
            <span>Pitch · Listen · Scale</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
