/* Minimal geometric line icons — one per participation path. */
const ICONS = {
  student: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" />
      <path d="M6 10.5V15c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
      <path d="M21.5 8.5V14" />
    </svg>
  ),
  startup: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M4 17 10 11l3.5 3.5L20 8" />
      <path d="M14 8h6v6" />
      <path d="M4 21h16" />
    </svg>
  ),
  school: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M4 21V10l8-6 8 6v11" />
      <path d="M12 4v6" />
      <path d="M9 21v-4h6v4" />
      <path d="M9 13h6" />
    </svg>
  ),
  visitor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M4 8V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
      <path d="M4 16v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
      <path d="M4 8a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3V8Z" />
      <path d="M20 8a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3V8Z" />
      <path d="M8 9.5h8" />
      <path d="M8 13h8" />
    </svg>
  ),
};

export default function CategoryCard({ category, inverted = false, onSelect }) {
  return (
    <article className={`cat-card ${inverted ? "cat-card--inverted" : ""}`}>
      <div className="cat-top">
        <span className="cat-icon">{ICONS[category.id]}</span>
        <span className="cat-index">/{category.index}</span>
      </div>
      <h3 className="cat-title">{category.title}</h3>
      <p className="cat-tagline">{category.tagline}</p>
      <p className="cat-desc">{category.description}</p>
      <button
        type="button"
        className="cat-cta"
        onClick={() => onSelect(category.id)}
        aria-label={`${category.cta} — go to registration`}
      >
        {category.cta}
        <span aria-hidden="true">→</span>
      </button>
    </article>
  );
}
