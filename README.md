# Adithyan — Independent by Design

A single-page portfolio site for an independent designer/developer, featuring a WebGL 3D hero sculpture, scroll-triggered reveal animations, a scrolling marquee, and two project case studies. Built as one self-contained HTML file — no build step, no dependencies to install.

**Live demo:** _add your deployed link here_

## Features

- **Interactive 3D hero** — a procedurally deformed, animated sculpture built with [Three.js](https://threejs.org/), reacting to pointer movement
- **Graceful fallback** — a static gradient orb replaces the WebGL scene if rendering fails or the context is lost
- **Entrance animations** — the hero eyebrow, heading, copy, and CTA fade up in a staggered sequence on load
- **Scroll-reveal** — section headers, project cards, the about block, and the contact section fade and slide into view as you scroll to them, powered by `IntersectionObserver`
- **Scrolling marquee** — the discipline ticker loops continuously and pauses on hover
- **Animated nav** — links get a sweeping underline on hover
- **Accessible by default** — skip link, `aria-label`s throughout, keyboard-friendly project dialogs, and full `prefers-reduced-motion` support (disables all entrance, reveal, marquee, and 3D animation, showing the final state instantly)
- **Responsive layout** — adapts from desktop down to mobile with a dedicated breakpoint at 800px
- **Project showcase** — click a project card to open a modal with more detail, driven by a simple JS data array
- **Zero build tools** — pure HTML/CSS/JS; Three.js and fonts are loaded from CDNs at runtime

## Tech Stack

| Layer | Tool |
|---|---|
| Structure | HTML5 |
| Styling | Vanilla CSS (custom properties, grid, flexbox, keyframe animations) |
| Scroll effects | `IntersectionObserver` (vanilla JS, no library) |
| 3D/Animation | [Three.js](https://threejs.org/) (loaded via `jsdelivr` CDN, ES module) |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) & [DM Sans](https://fonts.google.com/specimen/DM+Sans) via Google Fonts |

## Getting Started

No installation required — it's a static file.

```bash
# Clone or download the repo, then just open the file
open index.html          # macOS
start index.html         # Windows
```

For the best experience (some browsers restrict ES module imports over `file://`), serve it locally instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project Structure

```
.
└── index.html   # everything — markup, styles, and scripts in one file
```

## Customization

Before publishing, update the placeholders marked in the source:

- **Name** — replace `ADITHYAN` in the logo, page title, and footer, and "Your Name" in the About section and image alt text
- **Email** — swap the `mailto:` link in the contact section for your own address
- **Projects** — edit the `projects` array in the `<script>` block (title, description, accent color) and the matching `.art-one` / `.art-two` markup
- **Colors** — adjust the CSS custom properties in `:root` (`--bg`, `--accent`, etc.) to restyle the whole site
- **Copy** — hero tagline, about paragraph, and skills tags are all plain text in the markup
- **Animation timing** — hero entrance delays live inline on `.eyebrow`, `h1`, `.hero-copy`, and `.cta`; the marquee speed is the `26s` value in the `marquee` animation rule; scroll-reveal threshold is the `0.15` value passed to `IntersectionObserver` in the script
- **Adding new reveal elements** — add the `reveal` class to any element and it will automatically fade in when scrolled into view

## Browser Support

Works in all modern evergreen browsers. Three.js requires WebGL; on unsupported devices or if the context is lost, the fallback static orb is shown automatically. All animations respect the OS-level "reduce motion" accessibility setting.

## License

Add your preferred license here (e.g. MIT).
