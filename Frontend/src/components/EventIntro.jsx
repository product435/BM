import { EVENT, IMAGES, INTRO_STATS, INTRO_WORDS } from "../data/eventData.js";
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
<<<<<<< HEAD
                  <span className="t-italic t-emerald">A place</span> where
                  ambition meets opportunity.
=======
                  <span className="t-italic t-emerald">A room full</span> of
                  possibilities.
>>>>>>> origin/main
                </span>
              }
            />
          </div>

          <Reveal className="intro-copy-col" delay={120}>
<<<<<<< HEAD
            <p className="intro-copy intro-copy--tight">
              {EVENT.org} is where <strong>ambitious minds</strong> come
              together — founders with ideas, investors looking for
              opportunity, <strong>students ready to learn and build</strong>,
              and businesses ready to grow.
            </p>
            <p className="intro-copy">
              One city. One powerful gathering. A space to connect, learn,
              collaborate and create what comes next.
=======
            <p className="intro-copy">
              {EVENT.org} is bringing {EVENT.city} a different kind of gathering —
              one where the room is built for <strong>ideas</strong>,{" "}
              <strong>startups</strong> and <strong>business</strong>, and the
              agenda runs on <strong>ambition</strong>.
            </p>
            <p className="intro-copy">
              Entrepreneurs pitch. Investors listen. Students learn. Businesses
              connect. One city, one day — on the {EVENT.date} — for everyone
              who believes an idea can become something bigger.
>>>>>>> origin/main
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
<<<<<<< HEAD
          <div className="intro-media-frame">
            <img
              className="intro-media-fg"
              src={IMAGES.networking}
              alt="BM Sir — Belief, Consistency & Hard Work, the ultimate mantra of success"
              loading="lazy"
            />
          </div>
          <p className="intro-media-caption">
            <span>The place — networking, conversations &amp; real connections</span>
=======
          <img
            src={IMAGES.networking}
            alt="People in conversation at an indoor business event"
            loading="lazy"
          />
          <p className="intro-media-caption">
            <span>The room — networking, conversations &amp; real connections</span>
>>>>>>> origin/main
            <span>{EVENT.city}, Rajasthan</span>
          </p>
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
          Venue and capacity figures are being finalized — details will be
          confirmed ahead of the event.
        </p>
      </div>
    </section>
  );
}
