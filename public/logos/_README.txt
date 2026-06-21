Drop real logo image files here, named EXACTLY as referenced in
/public/exams.xml's <logo> tag for each entry, e.g.:

  jee.svg        → JEE Main
  neet.svg       → NEET UG
  upsc.svg       → UPSC CSE
  gate.svg       → GATE
  cat.svg        → CAT
  ssc.svg        → SSC CGL
  passport.svg   → Passport Photo service
  pan.svg        → PAN Card service
  visa.svg       → US Visa service
  resume.svg     → Resume Photo service

PNG, JPG, and WEBP also work — just update the filename + extension in
the <logo> tag in exams.xml to match what you upload.

Until a real logo is added, the UI automatically falls back to a colored
initials badge (see src/components/ExamLogo.tsx), so nothing breaks.
