# NaukariPhoto

A plain Vite + React app for preparing exam photos/signatures and other
document-photo services (passport, PAN, visa, etc.) to exact spec.

No TypeScript. No Figma-specific tooling. Deployable as a static site.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build for production

```bash
npm run build
```

Outputs a static site to `dist/`. Preview it locally with:

```bash
npm run preview
```

## Deploy

`dist/` is a plain static site — deploy it anywhere that serves static
files: Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3 + CloudFront,
nginx, etc. No server/runtime needed.

- **Vercel / Netlify**: point the build command at `npm run build` and the
  output directory at `dist`. No extra config required.
- **Any static host**: just upload the contents of `dist/` after running
  `npm run build`.

The only "backend" calls are in `src/services/imageService.js`, which
hits `http://localhost:8081` / `:8082` for image upload/resize — point
those at your real image-processing API before deploying, or the resizer
will fall back to a client-side canvas resize automatically.

## Adding a new exam or service

Everything about each exam/service — name, logo, colors, and required
documents with exact dimensions — lives in **`public/exams.xml`**. You
do not need to touch any component code to add one.

1. Open `public/exams.xml`.
2. Copy one `<entry>` block, paste it before `</catalog>`.
3. Give it a unique `id`, set `type="exam"` or `type="service"`.
4. Fill in `<name>` (shown on the card — keep it short, e.g. "JEE Main"),
   `<fullName>` (shown only in the expanded detail view), `<logo>`
   (filename), `<color>`/`<bg>` (accent colors), and `<date>`.
5. List each required document under `<documents>`, with dimensions in
   `<px>`, `<physical unit="cm|mm|inch" dpi="...">`, or both.
6. Drop the logo image file into `public/logos/` with the exact filename
   referenced in `<logo>`. Until you do, the card shows a colored
   initials badge automatically — nothing breaks.

Full inline instructions are also in the comment block at the top of
`exams.xml`.

The exam strip and the services strip both scroll horizontally and are
built to comfortably hold large catalogs (tested with up to ~30 entries)
without the page growing tall.

## Project structure

```
public/
  exams.xml        ← the catalog (edit this to add exams/services)
  logos/           ← drop logo image files here
src/
  components/      ← UI components (plain .jsx, no TypeScript)
  services/        ← XML catalog parser + image API client
  hooks/           ← useCatalog hook
  styles/          ← Tailwind v4 + design tokens
  App.jsx
  main.jsx
```
