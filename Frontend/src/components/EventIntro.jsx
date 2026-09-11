import { useState, useEffect, Fragment } from "react";
import { supabase } from "../lib/supabase.js";
import {
  EVENT,
  IMAGES,
  INTRO_MEDIA_CAPTION,
  INTRO_STATS,
  INTRO_WORDS,
} from "../data/eventData.js";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

// Helper to convert bold markdown to HTML (since description uses **text** for bold)
const parseBold = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function EventIntro({ previewData }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (previewData) {
      setData(previewData);
      return;
    }

    const fetchData = async () => {
      const { data: introData, error } = await supabase
        .from("event_intro")
        .select("*")
        .eq("id", 1)
        .single();

      if (introData && !error) {
        setData(introData);
      }
    };

    fetchData();
  }, [previewData]);

  // Use dynamic data if available, fallback to constants
  const eyebrow = data?.eyebrow || "01 — The Event";

  // Safe HTML parsing for the title since we allow <span class="t-italic">
  const titleHtml = data?.title || `More than an event. <span class="t-italic t-emerald">A place</span> where ambition meets opportunity.`;

  const paragraph1 = data?.paragraph_1 || `${EVENT.org} Business Growth Forum brings together **promising ideas**, executing startups, operating businesses, entrepreneurs, industry experts and **strategic partners** on one curated platform — focused on non-education sectors. Selected ventures may receive access to management guidance, technology, networks, operational support and deal-specific capital connect.`;
  const paragraph2 = data?.paragraph_2 || `One city. One powerful gathering. A space to connect, learn, collaborate and create what comes next — with independent evaluation at every step.`;

  const introWords = data?.intro_words || INTRO_WORDS;
  const imageUrl = data?.image_url || IMAGES.networking;
  const mediaHeadline = data?.media_headline || INTRO_MEDIA_CAPTION.headline;
  const mediaPills = data?.media_pills || INTRO_MEDIA_CAPTION.pills;
  const mediaLocation = data?.media_location || `${EVENT.city}, Rajasthan`;
  const stats = data?.stats || INTRO_STATS;
  const footerNote = data?.footer_note || "";

  return (
    <section className="intro section" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="intro-grid">
          <div className="intro-title-col">
            <SectionHeading
              eyebrow={eyebrow}
              title={
                <span id="about-title" dangerouslySetInnerHTML={{ __html: titleHtml }} />
              }
            />
          </div>

          <Reveal className="intro-copy-col" delay={120}>
            <p className="intro-copy intro-copy--tight">
              {parseBold(paragraph1)}
            </p>
            <p className="intro-copy">
              {paragraph2}
            </p>
            <ul className="intro-words" aria-label="What the event is about">
              {introWords.map((word, i) => (
                <li className="intro-word" key={word}>
                  {String(i + 1).padStart(2, "0")} <span className="intro-word-sep">— </span>{word}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="intro-media" delay={80}>
          <div className="intro-media-frame">
            <img
              className="intro-media-fg"
              src={imageUrl}
              alt="Event Intro"
              loading="lazy"
            />
          </div>
          <div className="intro-media-caption">
            <div className="intro-media-caption-main">
              <p className="intro-media-headline">{mediaHeadline}</p>
              <ul
                className="intro-media-pills intro-media-pills--desktop"
                aria-label="What this platform offers"
              >
                {mediaPills.map((pill) => (
                  <li key={pill}>{pill}</li>
                ))}
              </ul>

              {/* Mobile only: the same words as three complete, unbreakable
                  rows (see .intro-media-pills--mobile) instead of the
                  desktop flex-wrap list, which splits mid-row on narrow
                  screens. */}
              <div
                className="intro-media-pills intro-media-pills--mobile"
                aria-label="What this platform offers"
              >
                {[
                  mediaPills.slice(0, 3),
                  mediaPills.slice(3, 6),
                  mediaPills.slice(6, 8),
                ].map((row, rowIndex) => (
                  <p className="intro-media-pills-row" key={rowIndex}>
                    {row.map((word) => (
                      <Fragment key={word}>
                        <span className="dot">•</span> {word}{" "}
                      </Fragment>
                    ))}
                  </p>
                ))}
              </div>
            </div>
            <span className="intro-media-location intro-media-location--desktop">
              {mediaLocation}
            </span>
          </div>
        </Reveal>

        <Reveal className="intro-stats" delay={60}>
          {stats.map((stat) => (
            <div className="intro-stat" key={stat.label}>
              <p className="intro-stat-value">
                {stat.value === "TBA" ? <em>TBA</em> : stat.value}
              </p>
              <p className="intro-stat-label">{stat.label}</p>
            </div>
          ))}
        </Reveal>
        <p className="intro-note">
          {footerNote}
        </p>
        <span className="intro-media-location intro-media-location--mobile">
          {EVENT.city}, Rajasthan
        </span>
      </div>
    </section>
  );
}
