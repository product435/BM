/**
 * SectionHeading — consistent editorial heading treatment.
 * props: eyebrow, title (node), lede, dark (tone), center
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  dark = false,
  center = false,
  className = "",
}) {
  return (
    <div
      className={`sec-head ${center ? "sec-head--center" : ""} ${className}`.trim()}
    >
      <p className={`eyebrow ${center ? "eyebrow--center" : ""} ${dark ? "" : "eyebrow--emerald"}`.trim()}>
        {eyebrow}
      </p>
      <h2 className="sec-title">{title}</h2>
      {lede ? (
        <p className="sec-lede" style={center ? { marginInline: "auto" } : undefined}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}
