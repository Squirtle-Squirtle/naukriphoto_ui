import { useState } from "react";

/**
 * Renders an exam/service logo from the path declared in exams.xml.
 *
 * Props: { src, name, color, size?, rounded? }
 *
 * Falls back to a colored initials badge automatically if the image file
 * hasn't been dropped into /public/logos/ yet — so the UI never breaks
 * while real logo assets are being added.
 */
export default function ExamLogo({ src, name, color, size = 44, rounded = "rounded-xl" }) {
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center text-white font-extrabold shrink-0 ${rounded}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          fontSize: size * 0.36,
          fontFamily: "Plus Jakarta Sans, sans-serif",
        }}
        aria-label={name}
        role="img"
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center overflow-hidden shrink-0 bg-white ${rounded}`}
      style={{ width: size, height: size, border: `1.5px solid ${color}25` }}
    >
      <img
        src={src}
        alt={`${name} logo`}
        className="w-full h-full object-contain p-1.5"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
