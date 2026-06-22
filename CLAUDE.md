# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static HTML/CSS/JS rebuild of the Chisel & Groove Studio Squarespace site (`chiselandgroovestudio.com`). Custom handcrafted furniture studio in Pittsboro, NC. Hosted on AWS Amplify at `preview.chiselandgroovestudio.com`.

## Stack

- HTML5 + CSS3 + vanilla JavaScript
- No frameworks, no build step
- CSS custom properties for brand tokens (`--cg-*` prefix)
- Mobile-first responsive (breakpoints: 768px, 1024px)

## Commands

```bash
npm install              # install Puppeteer (required for extract-styles)
npm run serve            # local dev server at http://localhost:3000 (no-cache headers)
npm run extract-styles   # extract computed styles from the live Squarespace site via Puppeteer
```

## Matching the Live Site

This is a rebuild of a Squarespace site. Squarespace injects styles at runtime via JavaScript — a plain HTTP fetch does not capture the final computed CSS. **Always use Puppeteer-extracted values, never guess.**

### Workflow

1. **Extract computed styles** from the live site:
   ```bash
   npm run extract-styles
   ```
   Outputs to `reference/`:
   - `computed-styles.json` — `getComputedStyle()` per element per page
   - `site-css.css` — all `<style>` blocks and loaded stylesheets
   - `site-fonts.json` / `site-colors.json` — detected fonts and colors

   > **Note (Windows):** `tools/extract-styles.js` has a hardcoded Mac Chrome path. Change `executablePath` to your local Chrome path (e.g. `C:\Program Files\Google\Chrome\Application\chrome.exe`) before running.

2. **Map computed values to our CSS** — use exact computed values, never approximate or round font sizes, colors, or spacing.

3. **Verify visually** — `npm run serve` then open `http://localhost:3000` in Chrome and compare against `chiselandgroovestudio.com`.

## CSS Architecture

| File | Purpose |
|------|---------|
| `css/variables.css` | Brand tokens only — colors (`--cg-*`), fonts, spacing (`--space-*`), layout |
| `css/base.css` | Reset, typography, layout primitives |
| `css/components.css` | Nav, footer, buttons, cards — shared across pages |
| `css/pages.css` | Page-specific styles |

**Font substitutions** (live Squarespace uses commercial fonts we can't license):
- PP-Fragment → **Cormorant Garamond** (Google Fonts, closest high-contrast serif)
- myriad-pro → **Source Sans 3** (Google Fonts, closest humanist sans-serif)

## JavaScript

| File | Responsibility |
|------|---------------|
| `js/nav.js` | Scroll threshold (adds `.is-scrolled` at 60px); mobile hamburger (`.is-open` on `#navMobile`); Escape key and link-click close |
| `js/gallery.js` | Lightbox open/close/prev/next; keyboard navigation (Arrow keys, Escape); focus management |
| `js/contact.js` | Formspree async form submission; disables submit button during request |

## Pages

| Page | File | Notes |
|------|------|-------|
| Home | `index.html` | Hero, intro, process teaser, gallery teaser, CTA |
| Our Process | `our-process.html` | Step-by-step craft process, FAQ section |
| Gallery | `gallery.html` | Photo grid with lightbox (driven by `js/gallery.js`) |
| About | `about.html` | Studio story, team |
| Contact | `contact.html` | Formspree form (`js/contact.js`) |
| Privacy | `privacy.html` | Data/privacy policy |

## Routing

Amplify (`amplify.yml`) redirects clean Squarespace-style URLs to `.html` files:
- `/gallery` → `gallery.html`
- `/our-process` → `our-process.html`
- `/about-1` → `about.html`
- `/contact` → `contact.html`

## Branch Strategy

- `feature/*` → PR to `preview` → deploys to `preview.chiselandgroovestudio.com`
- `preview` → PR to `main` → deploys to production
- Never push directly to `main` or `preview`
