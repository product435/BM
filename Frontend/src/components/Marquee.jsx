/**
 * Marquee — a seamless editorial ticker.
 * items: string[] · reverse: direction · outlined: stroked type
 */
export default function Marquee({
  items = [],
  reverse = false,
  outlined = false,
  className = "",
  speed = 34,
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`marquee ${reverse ? "marquee--reverse" : ""} ${outlined ? "marquee--outline" : ""} ${className}`.trim()}
      style={{ "--marquee-speed": `${speed}s` }}
      aria-hidden="true"
    >
      <div className="marquee-track">
        <div className="marquee-group">
          {doubled.map((item, i) => (
            <span className="marquee-item" key={`${item}-${i}`}>
              {item}
              <span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
