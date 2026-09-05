import {
  EVENT,
  IMAGES,
  INTRO_MEDIA_CAPTION,
  INTRO_STATS,
  INTRO_WORDS,
} from "../data/eventData.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

export default function EventIntro() {
  return (
    <section className="intro section" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="intro-grid">
          <div className="intro-title-col">
            <SectionHeading
              eyebrow="01 — The Event"
              title={
                <span id="about-title">
                  More than an event.{" "}
                  <span className="t-italic t-emerald">A place</span> where
                  ambition meets opportunity.
                </span>
              }
            />
          </div>

          <Reveal className="intro-copy-col" delay={120}>
            <p className="intro-copy intro-copy--tight">
              {EVENT.org} Startup &amp; Business Launch brings together{" "}
              <strong>promising ideas</strong>, executing startups, operating
              businesses, entrepreneurs, industry experts and{" "}
              <strong>strategic partners</strong> on one curated platform. The
              objective goes beyond investment selected ventures may also
              receive access to management guidance, technology, networks,
              operational support and strategic expertise.
            </p>
            <p className="intro-copy">
              One city. One powerful gathering. A space to connect, learn,
              collaborate and create what comes next.
            </p>
            <ul className="intro-words" aria-label="What the event is about">
              {INTRO_WORDS.map((word, i) => (
                <li className="intro-word" key={word}>
                  {String(i + 1).padStart(2, "0")} — {word}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="intro-media" delay={80}>
          <div className="intro-media-frame">
            <img
              className="intro-media-fg"
              src={IMAGES.networking}
              alt="BM Sir — Belief, Consistency & Hard Work, the ultimate mantra of success"
              loading="lazy"
            />
          </div>
          <div className="intro-media-caption">
            <div className="intro-media-caption-main">
              <p className="intro-media-headline">{INTRO_MEDIA_CAPTION.headline}</p>
              <ul className="intro-media-pills" aria-label="What this platform offers">
                {INTRO_MEDIA_CAPTION.pills.map((pill) => (
                  <li key={pill}>{pill}</li>
                ))}
              </ul>
            </div>
            <span className="intro-media-location">{EVENT.city}, Rajasthan</span>
          </div>
        </Reveal>

        <Reveal className="intro-stats" delay={60}>
          {INTRO_STATS.map((stat) => (
            <div className="intro-stat" key={stat.label}>
              <p className="intro-stat-value">
                {stat.value === "TBA" ? <em>TBA</em> : stat.value}
              </p>
              <p className="intro-stat-label">{stat.label}</p>
            </div>
          ))}
        </Reveal>
        <p className="intro-note">
          Venue and capacity figures are being finalized details will be
          confirmed ahead of the event.
        </p>
      </div>
    </section>
  );
}
