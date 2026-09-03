/**
 * GuestCard — renders one guest.
 * If `guest.image` is provided, the photo replaces the monogram
 * placeholder automatically. Everything else is data-driven.
 */
export default function GuestCard({ guest, index }) {
  const hasImage = Boolean(guest.image);

  return (
    <article className="guest-card">
      <div className="guest-media">
        <span className="guest-index" aria-hidden="true">
          /{String(index + 1).padStart(2, "0")}
        </span>
        <span className="guest-mark" aria-hidden="true" />
        {hasImage ? (
          <img src={guest.image} alt={`Portrait of ${guest.name}`} loading="lazy" />
        ) : (
          <span className="guest-initials" aria-hidden="true">
            {guest.initials}
          </span>
        )}
      </div>
      <div className="guest-body">
        <h3 className="guest-name">{guest.name}</h3>
        <p className="guest-role">{guest.role}</p>
        <p className="guest-desc">{guest.description}</p>
      </div>
    </article>
  );
}
