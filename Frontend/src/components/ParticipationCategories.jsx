import { CATEGORIES } from "../data/eventData.js";
import Carousel from "./Carousel.jsx";
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
            lede="Four Categories to enter the event. Pick your registration form adapts to how you'll show up."
            className="sec-head--inline"
          />
        </div>

        <Carousel
          items={CATEGORIES}
          trackClassName="cat-grid"
          variant="light"
          ariaLabel="Choose your path"
          showDots
          renderItem={(category, i) => (
            <Reveal delay={i * 80}>
              <CategoryCard
                category={category}
                onSelect={onSelectCategory}
              />
            </Reveal>
          )}
        />
      </div>
    </section>
  );
}
