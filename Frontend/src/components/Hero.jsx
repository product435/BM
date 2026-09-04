import { EVENT, HERO_TICKER, IMAGES } from "../data/eventData.js";
import Marquee from "./Marquee.jsx";
import Reveal from "./Reveal.jsx";

export default function Hero({ onRegister, onExplore }) {
  return (
    <section className="hero" id="home" aria-label="Event introduction">
      <div className="hero-media">
        <video
          className="hero-video"
          src="/images/Apna_Jaipur.mp4"
          poster={IMAGES.hero}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="container hero-inner">
        <Reveal>
          <p className="eyebrow">
            Capital. Capability. Connections.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="hero-title">
            <span className="line">
              Where <span className="t-italic t-brass">ideas</span>
            </span>
            <span className="line">
              meet <span className="t-italic">opportunity</span>
            </span>
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p className="hero-sub">
            A curated platform for founders, innovators, operating
            businesses, industry leaders and strategic partners to connect,
            build and scale. — in{" "}
            <strong>{EVENT.city}</strong>, on the{" "}
            <strong>{EVENT.date}</strong> — to explore what comes next.
          </p>
        </Reveal>

        <Reveal delay={340}>
          <div className="hero-ctas">
            <button type="button" className="btn btn--light" onClick={onRegister}>
              Register now
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <button type="button" className="btn btn--ghost-light" onClick={onExplore}>
              Explore the event
            </button>
          </div>
        </Reveal>
      </div>

      <div className="hero-meta">
        <div className="container hero-meta-grid">
          <div className="hero-meta-block">
            <p className="hero-meta-label">Location</p>
            <p className="hero-meta-value">{EVENT.city}, Rajasthan</p>
          </div>
          <div className="hero-meta-block hero-meta-block--center">
            <p className="hero-meta-label">The date</p>
            <p className="hero-meta-value hero-meta-value--date">{EVENT.date}</p>
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
        <Marquee items={HERO_TICKER} speed={40} />
      </div>
    </section>
  );
}
