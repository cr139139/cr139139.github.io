# Ho Jin Choi — Research Portfolio

A static website for a robotics research portfolio. Runs on GitHub Pages with no build step.

## Deploy to GitHub Pages

1. Create a new repo (e.g. `cr139139.github.io` for a user site, or any name for a project site).
2. Copy everything in this folder to the repo root.
3. Commit & push.
4. In the repo's **Settings → Pages**, set the source to `Deploy from a branch`, branch `main`, folder `/ (root)`.

The site will be at `https://<username>.github.io/` (user site) or `https://<username>.github.io/<repo>/` (project site).

## Edit content

All paper/project/bio data lives in **`data.js`** — edit that single file to add papers, update your bio, etc. Each paper supports:
- `thumb` — optional path to a teaser image (e.g. `assets/papers/splatctrl.jpg`). If missing, a palette-aware placeholder is rendered automatically.
- `abstract` — shown in the expandable "+ Abstract" drawer.
- `bibtex` — shown in a copy-to-clipboard modal via the "{ } BibTeX" button.
- `links` — array of `{ kind, label, url }`. `kind` is one of `arxiv`, `paper`, `pdf`, `video`.

## Teaser images

Drop thumbnails into `assets/papers/` using the `id` of each paper as the filename
(e.g. `assets/papers/splatctrl.jpg`). 4:3 aspect ratio works best. Missing images
gracefully fall back to a generated placeholder.

## Dark mode

Follows the system preference by default. A three-state toggle in the top bar
(`Auto / Light / Dark`) persists to `localStorage`.

## Tweaks

Toggle the Tweaks panel (lower right) to try alternative font pairings,
spacing density, and publication layouts (rich / card / simple).
