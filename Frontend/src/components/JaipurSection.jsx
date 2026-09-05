import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function JaipurSection({
  onRegister,
  onExploreCategories,
  venueData = null
}) {
  const content = venueData || {
    eyebrow: "10 — The Venue",
    title_line_1: "The next conversation",
    title_line_2: "starts in Jaipur.",
    description: "A city of craft and commerce — home to a growing student-and-startup ecosystem, campuses like MNIT, and a generation of founders who build for India. Jaipur isn't just the backdrop. It's part of the pitch.",
    image_url: "https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800",
    image_caption: "The Pink City — tradition with an eye on tomorrow",
    event_date: "20th",
    location: "Jaipur",
    venue_status: "To be announced",
    participation_text: "By registration",
    venue_note: "Precise location will be shared with confirmed attendees to maintain the privacy of the gathering."
  };
  return (
    <section className="jaipur section" id="jaipur" aria-labelledby="jaipur-title">
      <div className="container">
        <div className="jaipur-grid">
          <Reveal className="jaipur-media">
            <div className="jaipur-media-frame">
              <img
                src={content.image_url}
                alt="Venue"
                loading="lazy"
              />
            </div>
            <p className="jaipur-caption">
              {content.image_caption}
            </p>
          </Reveal>

          <div className="jaipur-content">
            <Reveal>
              <SectionHeading
                eyebrow={content.eyebrow}
                title={
                  <span id="jaipur-title">
                    {content.title_line_1}{" "}
                    <span className="t-italic t-brass">{content.title_line_2}</span>
                  </span>
                }
                dark
              />
            </Reveal>

            <Reveal delay={100}>
              <p className="jaipur-copy">
                {content.description.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index}>{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </p>
            </Reveal>

            <Reveal delay={180}>
              <dl className="jaipur-rows">
                <div className="jaipur-row">
                  <dt className="jaipur-row-label">Event date</dt>
                  <dd className="jaipur-row-value jaipur-row-value--date">{content.event_date}</dd>
                </div>
                <div className="jaipur-row">
                  <dt className="jaipur-row-label">Location</dt>
                  <dd className="jaipur-row-value">{content.location}</dd>
                </div>
                <div className="jaipur-row">
                  <dt className="jaipur-row-label">Venue</dt>
                  <dd className="jaipur-row-value">{content.venue_status}</dd>
                </div>
                <div className="jaipur-row">
                  <dt className="jaipur-row-label">Participation</dt>
                  <dd className="jaipur-row-value">{content.participation_text}</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={240}>
              <div className="jaipur-ctas">
                <button type="button" className="btn btn--light" onClick={onRegister}>
                  Register interest
                  <span className="btn-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <button
                  type="button"
                  className="btn btn--ghost-light"
                  onClick={onExploreCategories}
                >
                  See the categories
                </button>
              </div>
              <p className="jaipur-note">{content.venue_note}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
