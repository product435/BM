import { CATEGORIES } from "../data/eventData.js";
import CategoryCard from "./CategoryCard.jsx";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function ParticipationCategories({ onSelectCategory }) {
  return (
    <section
      className="categories section"
      id="categories"
      aria-labelledby="categories-title"
    >
      <div className="container">
        <div className="exp-head">
          <SectionHeading
            eyebrow="04 — Participation"
            title={
              <span id="categories-title">
                Choose <span className="t-italic t-emerald">your path.</span>
              </span>
            }
            lede="Four ways to enter the event. Pick yours — the registration form adapts to how you'll show up."
            className="sec-head--inline"
          />
        </div>

        <div className="cat-grid">
          {CATEGORIES.map((category, i) => (
            <Reveal key={category.id} delay={i * 80}>
              <CategoryCard
                category={category}
                inverted={category.id === "entrepreneur"}
                onSelect={onSelectCategory}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
