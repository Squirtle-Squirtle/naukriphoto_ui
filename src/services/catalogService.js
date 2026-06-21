// ════════════════════════════════════════════════════════════════════════
// Catalog loader
//
// This is the ONLY place that knows how to read /public/exams.xml.
// Every component downstream (ExamRow, ExamExpanded, DocSlot, the
// General Services row, the resizer's "fit to spec" helper, etc.)
// consumes the plain array this returns and never touches XML.
//
// To add a new exam or service: edit public/exams.xml only. No code
// here needs to change unless the XML *schema* itself changes.
//
// Shape of each entry returned by loadCatalog():
//   {
//     id, type ("exam" | "service"), name, fullName, category,
//     logoUrl, color, bg, date,
//     documents: [
//       {
//         id, label, type ("photo" | "signature" | "id" | "document"),
//         required, format: string[],
//         minSizeKB?, maxSizeKB?,
//         px?: { width, height },
//         physical?: { width, height, unit: "cm"|"mm"|"inch", dpi },
//         background?, notes?,
//       }, ...
//     ]
//   }
// ════════════════════════════════════════════════════════════════════════

const CATALOG_URL = "/exams.xml";

let cachedCatalog = null;
let inFlight = null;

function text(el) {
  return el?.textContent?.trim() ?? "";
}

function num(val) {
  if (val === null || val === undefined || val === "") return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
}

function parseDocKind(raw) {
  const allowed = ["photo", "signature", "id", "document"];
  return allowed.includes(raw) ? raw : "document";
}

function parsePxDimensions(dimsEl) {
  const pxEl = dimsEl?.querySelector(":scope > px");
  if (!pxEl) return undefined;
  const width = num(pxEl.getAttribute("width"));
  const height = num(pxEl.getAttribute("height"));
  if (width === undefined || height === undefined) return undefined;
  return { width, height };
}

function parsePhysicalDimensions(dimsEl) {
  const physEl = dimsEl?.querySelector(":scope > physical");
  if (!physEl) return undefined;
  const width = num(physEl.getAttribute("width"));
  const height = num(physEl.getAttribute("height"));
  const dpi = num(physEl.getAttribute("dpi")) ?? 200;
  const unitRaw = physEl.getAttribute("unit") ?? "cm";
  const unit = ["cm", "mm", "inch"].includes(unitRaw) ? unitRaw : "cm";
  if (width === undefined || height === undefined) return undefined;
  return { width, height, unit, dpi };
}

function parseDocument(docEl) {
  const id = docEl.getAttribute("id");
  const requiredRaw = docEl.getAttribute("required");
  const typeRaw = docEl.getAttribute("type") ?? "document";

  if (!id) return null;

  const label = text(docEl.querySelector(":scope > label")) || id;
  const formatRaw = text(docEl.querySelector(":scope > format"));
  const format = formatRaw
    ? formatRaw.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  const dimsEl = docEl.querySelector(":scope > dimensions");
  const px = parsePxDimensions(dimsEl);
  const physical = parsePhysicalDimensions(dimsEl);

  const minSizeKB = num(text(docEl.querySelector(":scope > minSizeKB")) || undefined);
  const maxSizeKB = num(text(docEl.querySelector(":scope > maxSizeKB")) || undefined);
  const background = text(docEl.querySelector(":scope > background")) || undefined;
  const notes = text(docEl.querySelector(":scope > notes")) || undefined;

  return {
    id,
    label,
    type: parseDocKind(typeRaw),
    required: requiredRaw === "true",
    format,
    minSizeKB,
    maxSizeKB,
    px,
    physical,
    background,
    notes,
  };
}

function parseEntry(entryEl) {
  const id = entryEl.getAttribute("id");
  const typeRaw = entryEl.getAttribute("type");
  if (!id) return null;

  const type = typeRaw === "service" ? "service" : "exam";
  const name = text(entryEl.querySelector(":scope > name"));
  const fullName = text(entryEl.querySelector(":scope > fullName")) || name;
  const category = text(entryEl.querySelector(":scope > category"));
  const logoFile = text(entryEl.querySelector(":scope > logo"));
  const color = text(entryEl.querySelector(":scope > color")) || "#3b3bf5";
  const bg = text(entryEl.querySelector(":scope > bg")) || "#eeeeff";
  const date = text(entryEl.querySelector(":scope > date"));

  const documentEls = Array.from(entryEl.querySelectorAll(":scope > documents > document"));
  const documents = documentEls.map(parseDocument).filter((d) => d !== null);

  if (!name) return null;

  return {
    id,
    type,
    name,
    fullName,
    category,
    logoUrl: logoFile ? `/logos/${logoFile}` : "/logos/_placeholder.svg",
    color,
    bg,
    date,
    documents,
  };
}

/**
 * Fetches and parses the XML catalog. Cached after first successful load —
 * call `invalidateCatalogCache()` if you need to force a re-fetch (e.g.
 * after editing exams.xml during development).
 */
export async function loadCatalog() {
  if (cachedCatalog) return cachedCatalog;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const res = await fetch(CATALOG_URL, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`Failed to load catalog (${res.status})`);
    }
    const xmlText = await res.text();
    const doc = new DOMParser().parseFromString(xmlText, "application/xml");

    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      throw new Error("exams.xml is not valid XML: " + parserError.textContent);
    }

    const entryEls = Array.from(doc.querySelectorAll("catalog > entry"));
    const entries = entryEls.map(parseEntry).filter((e) => e !== null);

    cachedCatalog = entries;
    return entries;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

export function invalidateCatalogCache() {
  cachedCatalog = null;
}

// ════════════════════════════════════════════════════════════════════════
// Unit conversion helpers
// ════════════════════════════════════════════════════════════════════════

const UNIT_TO_INCH = {
  inch: 1,
  cm: 1 / 2.54,
  mm: 1 / 25.4,
};

/** Converts a physical dimension spec ({width, height, unit, dpi}) to pixels. */
export function physicalToPx(phys) {
  const widthInch = phys.width * UNIT_TO_INCH[phys.unit];
  const heightInch = phys.height * UNIT_TO_INCH[phys.unit];
  return {
    width: Math.round(widthInch * phys.dpi),
    height: Math.round(heightInch * phys.dpi),
  };
}

/**
 * Resolves the best pixel target for a document: prefers an explicit
 * px spec, falling back to converting the physical spec at its given DPI.
 */
export function resolvePxTarget(doc) {
  if (doc.px) return doc.px;
  if (doc.physical) return physicalToPx(doc.physical);
  return undefined;
}

/** Human-readable spec string, e.g. "350×450 px (3.5×4.5 cm @ 254 DPI)". */
export function formatDimensions(doc) {
  const parts = [];
  if (doc.px) {
    parts.push(`${doc.px.width}×${doc.px.height} px`);
  }
  if (doc.physical) {
    const physStr = `${doc.physical.width}×${doc.physical.height} ${doc.physical.unit} @ ${doc.physical.dpi} DPI`;
    parts.push(doc.px ? `(${physStr})` : physStr);
  }
  return parts.join(" ");
}

/** Human-readable file spec, e.g. "JPG/PNG · 10–200 KB". */
export function formatFileSpec(doc) {
  const segments = [];
  if (doc.format.length) segments.push(doc.format.join("/"));

  if (doc.minSizeKB && doc.maxSizeKB) {
    segments.push(`${doc.minSizeKB}–${doc.maxSizeKB} KB`);
  } else if (doc.maxSizeKB) {
    segments.push(`max ${doc.maxSizeKB} KB`);
  } else if (doc.minSizeKB) {
    segments.push(`min ${doc.minSizeKB} KB`);
  }

  const dims = formatDimensions(doc);
  if (dims) segments.push(dims);
  if (doc.background) segments.push(doc.background);
  if (doc.notes) segments.push(doc.notes);

  return segments.join(" · ");
}
