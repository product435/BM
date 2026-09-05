import { EVENT as DEFAULT_EVENT, HERO_TICKER as DEFAULT_HERO_TICKER, IMAGES as DEFAULT_IMAGES } from "../data/eventData.js";
import Marquee from "./Marquee.jsx";
import Reveal from "./Reveal.jsx";

export default function Hero({
  onRegister,
  onExplore,
  eventData = DEFAULT_EVENT,
  heroTicker = DEFAULT_HERO_TICKER,
  heroImages = DEFAULT_IMAGES,
  // Additional text overrides
  eyebrow = "Capital. Capability. Connections.",
  titleLine1 = ["Where", "ideas"],
  titleLine2 = ["meet", "opportunity"],
  subText = `A curated platform for founders, innovators, operating businesses, industry leaders and strategic partners to connect, build and scale. — in ${eventData.city}, on the ${eventData.date} — to explore what comes next.`,
  primaryCtaText = "Register now",
  secondaryCtaText = "Explore the event",
}) {
  return (
    <section className="hero" id="home" aria-label="Event introduction">
      <div className="hero-media">
        {heroImages.hero.endsWith('.mp4') ? (
          <video
            className="hero-video"
            src={heroImages.hero}
            poster={DEFAULT_IMAGES.hero}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        ) : (
          <img
            src={heroImages.hero}
            alt="Hero Background"
            className="hero-video"
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        )}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="container hero-inner">
        <Reveal>
          <p className="eyebrow">
            {eyebrow}
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="hero-title">
            <span className="line">
              {titleLine1[0]} <span className="t-italic t-brass">{titleLine1[1]}</span>
            </span>
            <span className="line">
              {titleLine2[0]} <span className="t-italic">{titleLine2[1]}</span>
            </span>
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="hero-sub">
            A curated platform for Innovators, Founders, Operating
            Businesses, Industry Leaders and Strategic Partners to connect,
            build and scale, In{" "}
            <strong>{EVENT.city}</strong>, on the{" "}
            <strong>{EVENT.date}</strong> to explore what comes next.
          </p>
        </Reveal>

        <Reveal delay={340}>
          <div className="hero-ctas">
            <button type="button" className="btn btn--light" onClick={onRegister}>
              {primaryCtaText}
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <button type="button" className="btn btn--ghost-light" onClick={onExplore}>
              {secondaryCtaText}
            </button>
          </div>
        </Reveal>
      </div>

      <div className="hero-meta">
        <div className="container hero-meta-grid">
          <div className="hero-meta-block">
            <p className="hero-meta-label">Location</p>
            <p className="hero-meta-value">{eventData.city}, Rajasthan</p>
          </div>
          <div className="hero-meta-block hero-meta-block--center">
            <p className="hero-meta-label">The date</p>
            <p className="hero-meta-value hero-meta-value--date">{eventData.date}</p>
          </div>
          <div className="hero-meta-block hero-meta-block--scroll">
            <div className="scroll-cue" aria-hidden="true">
              <span>Scroll</span>
              <span className="scroll-line" />
            </div>
          </div>
        </div>
      </div>

      <div className="hero-ticker">
        <Marquee items={heroTicker} speed={40} />
      </div>
    </section>
  );
}
