# ExaCare Design System — Extracted Specification

**Source:** `https://www.exacare.com` (deployment `dpl_6uTBiNGgWV3eayXr7GvWot8Rtpk2`)
**Method:** static extraction from the three shipped stylesheets and the JavaScript bundles. No headed browser run — anything that only exists at runtime is flagged.
**Machine-readable companion:** [`design-tokens.json`](./design-tokens.json)
**Motion spec:** [`MOTION.md`](./MOTION.md) / [`motion.json`](./motion.json)

| | |
|---|---|
| Framework | Next.js App Router (route group `(web)`), React `19.2.0-canary-0bdb9206-20250818` |
| CSS | **Tailwind CSS v4.2.4** (banner comment in the compiled sheet) + CSS Modules for block-level rules |
| Content | Sanity (GROQ queries and `data-sanity` presentation attributes are inlined in the bundle) |
| Stylesheets | `31497ea371de0bbc.css` (98.6 KB, theme/base/components/utilities + global typography) · `3878138f0d8eeb6c.css` (13.6 KB, CSS-module block rules) · `505e5108b920fded.css` (1.2 KB, `@font-face`) |

---

## 0. The one convention that makes everything else readable

```css
:root { --rem-size: 10px; }
html   { font-size: var(--rem-size); }
```

**1rem === 10px.** Every authored value is `pxValue / 10` in rem — `1.8rem` is 18px, `6.4rem` is 64px, `--spacing-48` is `4.8rem` is 48px. If you keep a 16px root, multiply every number in this document by 1.6.

Caveat: Tailwind's own built-in scales were computed against 16px and are *not* rescaled, so `--container-5xl: 64rem` renders as **640px** here, not 1024px. The design never uses them; treat them as dead weight.

Other global root values:

```css
html { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; -ms-overflow-style: none; position: relative }
body { background: var(--color-background); letter-spacing: -.02em; font-size: 1.8rem; line-height: 140% }
:root, [data-theme], body { color: var(--color-text-primary) }
```

And one global text-rendering rule applied to `*`:

```css
* {
  font-feature-settings: "kern" 1;   /* + -moz/-ms/-o/-webkit prefixes */
  font-kerning: normal;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: #0000;
}
```

---

## 1. Colour

### 1.1 The idea

Two neutrals and one accent. **`#5d5146` warm dark brown as ink, `#fef9ed` warm off-white as canvas, `#f9f665` lemon as the only brand signal.** Everything else in the system is an *alpha ramp of those same two neutrals* — which is precisely why the page reads as expensive: there is no third hue doing structural work, so every surface, hairline and overlay is optically the same material at a different density.

There are twelve pastels in the palette, but they are referenced 1–2 times each in the whole stylesheet. They exist as a CMS-selectable swatch set for icon tiles and label chips, plus two semantic roles in the comparison table.

**No `oklch()` anywhere.** Every value is plain hex (8-digit hex for alpha). The only colour-space feature used is Tailwind v4's `in oklab` gradient interpolation and `color-mix(in oklab, …)` inside `@supports`.

### 1.2 Raw palette

| Token | Value | Role |
|---|---|---|
| `--color-cloud` | `#fef9ed` | Primary page background (warm bone) |
| `--color-earth-dark` | `#5d5146` | Primary ink; dark-theme surface |
| `--color-earth-light` | `#8a7867` | Secondary ink |
| `--color-earth-button-active` | `#84715f` | Dark-button hover fill |
| `--color-lemon` | `#fffd86` | Brand accent (highlighter) |
| `--color-lemon-button` | `#f9f665` | Primary button fill |
| `--color-lemon-button-active` | `#f3f05a` | Primary button hover fill |
| `--color-taupe` | `#f8edda` | Secondary surface / nav pill / foreground |
| `--color-tan` | `#a9978a` | Hairline + muted surface base |
| `--color-white` | `#ffffff` | `white` button variant |
| `--color-avatar-ring` | `#d5cfc1` | Avatar rings / stacked-avatar borders |

Decorative pastels (rare, CMS-selectable):

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--color-sea` | `#b7cded` | | `--color-forest` | `#a6bd6a` |
| `--color-mist` | `#e0eaf8` | | `--color-sprout` | `#ddf0ae` |
| `--color-lake` | `#7a93b4` | | `--color-meadow` | `#838f61` *(semantic: tick)* |
| `--color-orchid` | `#f4ccf9` | | `--color-coral` | `#ff936f` *(semantic: cross)* |
| `--color-blossom` | `#fedfef` | | `--color-apricot` | `#ffd6a2` |
| `--color-plum` | `#8c748a` | | `--color-clay` | `#b4854b` |

### 1.3 Alpha ramps

Two ramps. `oatmeal-*` is taupe over dark; `earth-*` is the ink over light. This is the workhorse of the whole system.

| oatmeal (base `#f8edda`) | Value | α | | earth (base `#5d5146`) | Value | α |
|---|---|---|---|---|---|---|
| `--color-oatmeal-10` | `#f8edda1a` | .10 | | `--color-earth-5` | `#5d51460d` | .05 |
| `--color-oatmeal-15` | `#f8edda26` | .15 | | `--color-earth-10` | `#5d51461a` | .10 |
| `--color-oatmeal-20` | `#f8edda33` | .20 | | `--color-earth-15` | `#5d514626` | .15 |
| `--color-oatmeal-30` | `#f8edda4d` | .30 | | `--color-earth-20` | `#5d514633` | .20 |
| `--color-oatmeal-40` | `#f8edda66` | .40 | | `--color-earth-30` | `#5d51464d` | .30 |
| `--color-oatmeal-50` | `#f8edda80` | .50 | | `--color-earth-40` | `#5d514666` | .40 |
| `--color-oatmeal-60` | `#f8edda99` | .60 | | `--color-earth-50` | `#5d514680` | .50 |
| `--color-oatmeal-80` | `#f8eddacc` | .80 | | `--color-earth-60` | `#5d5146cc` | **.80** ⚠ |

⚠ `--color-earth-60` is named 60 but its value is `cc` = 0.8 alpha. Inconsistency in the source; replicate the *value*, not the name.

One tan alpha: `--color-tan-25: #a9978a40` (0.25).

### 1.4 Semantic layer & theming

Theming is **per-section**, via `data-theme="dark"` on the `<section>` element — not per-page. **There is no `prefers-color-scheme` query anywhere in the stylesheet.**

| Semantic token | `:root` (default) | `[data-theme=light]` | `[data-theme=dark]` |
|---|---|---|---|
| `--color-text-primary` | `earth-dark` | `earth-dark` | `cloud` |
| `--color-text-secondary` | `earth-light` | `earth-light` | `cloud` |
| `--color-foreground` | `taupe` | `taupe` | `earth-light` |
| `--color-background` | `cloud` | `cloud` | `earth-dark` |
| `--color-border` | `earth-20` | **`earth-10`** | `oatmeal-15` |
| `--color-accent` | `lemon` | `lemon` | `lemon` |
| `--color-feature-timer-tab-surface` | `earth-10` | `earth-10` | `oatmeal-30` |
| `--color-feature-timer-tab-fill` | `earth-20` | `earth-20` | `oatmeal-60` |
| `--color-header` | `taupe` | *(inherits)* | *(inherits — nav never inverts)* |
| `--border` | `.1rem solid var(--color-border)` | same | same |

Two things to copy:
1. `[data-theme=light]` is **not** identical to `:root` — the border alpha halves from 0.2 to 0.1. The default is slightly heavier than the explicitly-light case.
2. The nav pill keeps `--color-header: taupe` through both themes; it is a constant object floating over changing content.

### 1.5 Top six colours by usage

Counted as `var(--color-X)` references in the shipped CSS plus Tailwind colour-utility hits (`bg-/text-/border-/from-/via-/to-/fill-/ring-/shadow-`) across the four rendered documents (home, platform, skilled-nursing, about-us).

| # | Colour | Tokens | Hits | Where it does the work |
|---|---|---|---|---|
| 1 | `#5d5146` | `earth-dark`, `text-primary` | 298 | All ink; dark-section background; dark button fill |
| 2 | `#fef9ed` | `cloud`, `background` | 300 | Page canvas; text on dark; `white` button surface |
| 3 | `#5d514633` | `earth-20`, `border` | 104 | Every hairline — nav pill, block dividers, table rules, button outlines |
| 4 | `#a9978a` | `tan`, `tan-25` | 44 | Secondary button fill (`tan/25` → `tan/50`), quote-card rule |
| 5 | `#f9f665` / `#f3f05a` | `lemon-button`, `lemon-button-active` | 69 | Primary CTA and its hover — the single brand signal |
| 6 | `#f8edda` | `taupe`, `header`, `foreground`, whole `oatmeal-*` ramp | 89 | Nav pill, alternating surface, every translucent light overlay on dark |

---

## 2. Typography

### 2.1 Faces

Two families, loaded through `next/font/local` with metric-override fallbacks, `font-display: optional`.

| | Body | Display |
|---|---|---|
| CSS var | `--font-family` | `--font-heading` |
| next/font family | `fontDiatype` | `fontSeason` |
| **Real family name** | **ABC Diatype** (Dinamo) | **Season Mix** (Blaze Type — the family marketed as "Season") |
| Stack | `var(--font-diatype,"ABC Diatype"), ui-sans-serif, system-ui, sans-serif` | `var(--font-season,"Season Mix"), ui-sans-serif, system-ui, sans-serif` |
| Weights shipped | 400 (`ABCDiatype-Regular`, 50.8 KB) · 700 (`ABCDiatype-Bold`, 56.6 KB) | **400 only** (`SeasonMix-Regular`, 61.9 KB) + **400 italic** (`SeasonMix-RegularItalic`, 65.3 KB) |
| Fallback face | `local("Arial")` · ascent 97.41% · descent 26.97% · line-gap 0% · size-adjust 99.38% | `local("Times New Roman")` · ascent 91.55% · descent 23.85% · line-gap 0% · size-adjust 106.49% |

*(Family names confirmed by reading the `name` table of each woff2 with `fc-scan`; the CSS only exposes the obfuscated `fontDiatype` / `fontSeason` aliases.)*

**Roles.** Diatype does all body, UI, labels, buttons and nav. Diatype Bold appears **only** inside rich text (`.txt b, .txt strong`) and comparison-table headers — never in a heading.

Season Mix does every heading level, the AgendaCards watermark, the testimonial quote body, and HubSpot form headings. **It only ships at weight 400.** Hierarchy is carried entirely by size and by tracking that tightens from `-0.01em` to `-0.04em` as the size grows. No bold headings exist on the site.

**The italic is the premium accent.** The base reset deliberately makes headings inherit font-style (`h1 em, h1 i { font-style: inherit }`) so italics only fire where rich text asks for them (`.txt em { font-style: italic }`). An editor marks a phrase italic in Sanity and it renders mid-sentence in Season Mix Italic. The HeroSummit typewriter animates this explicitly: characters type in upright, then flip to italic 450 ms after the line finishes (see MOTION.md).

### 2.2 Type scale

Classes apply directly (`.h1`, `.b2`, `.label`) **and** cascade onto bare tags inside a `.txt` container that is not `.txt-post` — `:where(.txt:not(.txt-post)) h2`. Responsive variants exist as `.md:h1` etc. There is **one** breakpoint in the whole scale (768px), plus a single `lg:b3` exception at 1024px.

| Class | Face | base (<768px) | md (≥768px) | Typical use |
|---|---|---|---|---|
| `.display` | Season | 4.8rem/110% · `-.02em` | **8rem**/120% · `-.04em` | Stat numbers |
| `.h1` | Season | 3.6rem/110% · `-.01em` | **6.4rem**/110% · `-.02em` | Block headline |
| `.h2` | Season | 3rem/120% · `-.01em` | **5.5rem**/120% · `-.02em` | Section headline |
| `.h3` | Season | 3rem/120% · `-.01em` | 4rem/120% · `-.01em` | |
| `.h4` | Season | 3rem/120% · `-.01em` | 3.2rem/130% · `0` | |
| `.h5` | Season | 2.4rem/140% · `-.01em` | 2.6rem/140% · `-.01em` | |
| `.h6` | Season | 2.4rem/140% · `-.01em` | 2rem/140% · `-.01em` | Eyebrow (`b4 md:h6`) |
| `.b1` | Diatype | 2rem/130% · `-.02em` | 2.6rem/130% · `-.02em` | Lead paragraph |
| `.b2` | Diatype | 1.8rem/140% · `-.005em` | 2rem/130% · `-.005em` | Feature titles, FAQ questions |
| `.b3` | Diatype | 1.6rem/145% · `-.01em` | 1.8rem/145% · `-.01em` | **Default body copy**; also `.txt-post` |
| `.b4` | Diatype | 1.4rem/150% · `0` | 1.6rem/150% · `0` | Nav links, captions, button label |
| `.b5` | Diatype | 1.4rem/150% · `0` | 1.4rem/150% · `0` | Small button label, footer links |
| `.b6` | Diatype | 1.2rem/150% · `0` | 1.2rem/150% · `0` | Fine print |
| `.label` | Diatype | 1.2rem/150% · **`+.02em`** | 1.4rem/150% · **`+.02em`** | Step pills, cursor tooltip, tertiary button |
| `body` | Diatype | 1.8rem/140% · `-.02em` | 2rem/130% · `-.02em` | |
| `.lg:b3` | Diatype | — | *(≥1024px)* 1.8rem/140% · `-.01em` | |
| `.b4.md:b3` | Diatype | 1.4rem/150% · `0` | 1.8rem/145% · `-.01em` | Composite escape hatch |

Note `.h2`, `.h3` and `.h4` are **the same size** below 768px (3rem/120%) — the base rule groups them. They only diverge at md. Same for `.h5`/`.h6`.

### 2.3 The tracking ladder

Tracking tightens monotonically as size grows. This is the single detail that most makes the type feel drawn rather than set.

| Size band | Tracking |
|---|---|
| 12–14px `.label` | **+0.02em** |
| 12–16px `.b4/.b5/.b6` | `0` |
| 16–18px `.b3` | `-0.01em` |
| 18–20px `.b2` | `-0.005em` |
| 20–26px `.b1`, `body` | `-0.02em` |
| 24–40px `.h3`–`.h6` | `-0.01em` → `0` |
| 55–64px `.h1`/`.h2` @md | `-0.02em` |
| 80px `.display` @md | **-0.04em** |

`.label` is the only positive-tracking style in the system, and it is never uppercased — there is no `text-transform` in the stylesheet at all.

### 2.4 Rich text (`.txt` / `.txt-post`)

| Rule | Value |
|---|---|
| `.txt b, .txt strong` | `font-weight: 700` |
| `.txt em` | `font-style: italic` |
| `.txt a` | `color: inherit; text-decoration: underline; text-decoration-thickness: .1rem; text-underline-offset: .2em; transition: text-decoration-color .2s` |
| `.txt a:hover` *(hover:hover)* | `text-decoration-color: #0000` — **the underline fades away on hover**, it does not appear |
| Block flow | `p, h1–h6, blockquote, hr, ol, ul, table { margin-top: 1em }`, reset to `0` on `:first-child` |
| Lists | `padding-left: 2em; list-style-position: outside`; `ul` disc, `ol` decimal; `li + li { margin-top: var(--spacing-8) }` |
| Tables | `border: var(--border); border-collapse: collapse; width:100%`; `td/th { padding: .7rem 1rem }`; `thead th { font-weight: 700; border-left: var(--border) }` |
| `.txt-content-table` | Borderless variant — `td/th { padding: var(--spacing-20) }`, vertical rules only via `border-left` on `:not(:first-child)`, `thead th { font-weight: 400 }` |
| `.txt-post` flow | `> * + * { margin-top: var(--spacing-24) }`; headings `:not(:first-child)` get `var(--spacing-48)`; media/quote/embed/stats/table blocks *and their next sibling* get `var(--spacing-48)` |
| `sub`, `sup` | `font-size: .75em; line-height: 0` |
| `.jobs-meta-row > span + span::before` | `content: "•"; padding-inline: .3em` |

---

## 3. Spacing & layout

### 3.1 The spacing scale

Tailwind v4 `--spacing-N` tokens where N is the px value.

```
0 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64 · 72 · 96 · 128 · 148
```

There is deliberately **no 40, 56, 80 or 112 step**. The jump from 32 → 48 → 64 → 72 → 96 → 128 is what gives sections their generous, non-uniform rhythm.

### 3.2 Responsive rhythm tokens

| Token | base | ≥768px | ≥1024px |
|---|---|---|---|
| `--spacing-section-padding-s` | `3.2rem` | `4.8rem` | `4.8rem` |
| `--spacing-section-padding-m` | `4.8rem` | `8rem` | `8rem` |
| `--spacing-section-padding-l` | `6.4rem` | `11.2rem` | `11.2rem` |
| `--spacing-margins` (page gutter) | `2rem` | `2rem` | **`4.8rem`** |
| `--spacing-gutter` (grid gap) | `2rem` | **`1.2rem`** | `1.2rem` |

Note the counter-move: **grid gutters shrink** (20px → 12px) at md while **page margins grow** (20px → 48px) at lg. Content gets denser while the page gets more air around it.

### 3.3 Layout variables

| Variable | Value | Note |
|---|---|---|
| `--max-width` | `160rem` (1600px) | The `.wrap` cap |
| `--vp-width` | `100vw` | |
| `--vp-height` | `100vh` → `100dvh` under `@supports (height:100dvh)` | **Also overwritten at runtime** to `window.visualViewport.height` in px on resize/orientationchange, so sticky stages track real mobile chrome |
| `--layout-height` | `calc(var(--vp-height) - var(--header-height))` | Sticky-stage height |
| `--nav-height` | `5.4rem` → `6.2rem` @768 | The floating pill itself |
| `--header-height` | `7.2rem` → `9.2rem` @768 | Pill + its top offset |
| `--header-submenu-top` | `calc(1rem + var(--nav-height))` | |
| `--banner-offset` | runtime: `max(0, bannerHeight − scrollY)px` | Header is `top: var(--banner-offset, 0px)` |
| `--banner-height` | runtime: measured banner height | |

Z-index ladder: `--z-main:1 · --z-footer:2 · --z-modal:3 · --z-header:4 · --z-banner:5 · --z-dialog:6`. Blocks additionally receive an inline `style="z-index:N"` incrementing in document order, so later sections stack above earlier ones — necessary for the sticky/scale hero effects.

### 3.4 The container

```css
.wrap {
  width: 100%;
  max-width: var(--max-width);        /* 160rem = 1600px */
  padding-inline: var(--spacing-margins);
  margin-inline: auto;
}
```

`.wrap` is the only page container. Inner content then uses one of ~40 hard max-widths. The recurring measures:

| Purpose | Values |
|---|---|
| Headline measure (dominant) | `76.8rem` (768px) |
| Nav pill & mega-menu | `96rem` (960px) |
| Feature copy | `52.8` · `55` · `58` · `60` · `64.7` · `77rem` |
| Media | `40` · `50` · `65` · `75` · `100` · `130rem` |
| Grids | `103` · `112` · `124` · `128` · `134.4rem` |
| Page | `160rem` |

### 3.5 Breakpoints

The compiled CSS only branches at **three widths**: 640, 768, 1024. Tailwind's rem-based `container` variants (40/48/64/80/96rem) are generated but unused.

| Name | px | What changes |
|---|---|---|
| `sm` | 640 | Button min-heights, some block paddings, quote-card gaps, team grid → 12 cols |
| `md` | 768 | **The whole type scale**, grid gutter shrinks, section paddings step up, parallax turns on |
| `lg` | 1024 | Page margins 2rem → 4.8rem, sticky/pinned block variants activate, desktop nav |

JS media queries, for parity:

| Consumer | Query |
|---|---|
| Layout store | mobile 0–639 · tablet 640–1023 · desktop ≥1024 |
| Carousel | `(min-width:640px)` → tablet, `(min-width:1024px)` → desktop |
| FeatureStages sticky | `(min-width:1024px)` — below that it degrades to a stacked list |
| FeatureScroll parallax | `(min-width:768px)` — parallax is off on mobile |

Container queries (rare, precise):

```
@container (min-width:1344px)       ScrollStages side rules
@container not (min-width:1343px)   ScrollStages padding reset
@container not (min-width:1439px)   FeatureTimer border-x reset
container-type: inline-size         .AgendaCards_card
```

Two height queries exist as escape hatches for short viewports: `@media (min-height:600px)` (FeatureTimer drops its `min-h-(--vp-height)`) and `@media (min-width:768px) and (min-height:1001px)`.

---

## 4. Shape & surface

### 4.1 Radii

| Token | Value |
|---|---|
| `--radius-small` | `1.2rem` (12px) |
| `--radius-medium` | `2rem` (20px) |
| `--radius-large` | `3rem` (30px) |
| Pill (all buttons) | `rounded-[10rem]` (100px) |
| Circles | `rounded-full` — icon buttons, nav pill, step pills, avatars |
| Form fields | `0.4rem` (HubSpot inputs/textarea) |
| Quote card | `calc(3rem * var(--quote-scale))` — 30px mobile, 40.5px at md |
| Floating highlight card | `0.7rem` at lg, proportionally scaled below: `calc(0.7rem*14.04/26)`, `calc(0.7rem*18/26)` |
| Icon tile | `.2rem` → `.5rem` at sm |

Hero media frames use `rounded-b-large` only — square top, rounded bottom — so they meet the header flush.

### 4.2 The hairline

```css
--border: .1rem solid var(--color-border);
```

Applied through arbitrary properties — `[border:var(--border)]`, `[border-left:var(--border)]`, `[border-right:var(--border)]` — rather than Tailwind `border-*` utilities. That way width, style and colour swap together with the theme from a single token. The width is always 1px; only the alpha changes (0.2 default / 0.1 light / oatmeal 0.15 dark).

### 4.3 Shadows

Shadows are rare and always **soft, warm, offset-down, negatively-spread**. There is no generic black drop shadow anywhere.

| Use | Value |
|---|---|
| Photo card (FoundersNote) | `0 1.2rem 3.2rem -0.8rem var(--color-earth-30)` |
| Label chip | `0 0.4rem 1.2rem -0.2rem var(--color-earth-20)` |
| Large panel (lg only) | `0 2rem 4.8rem -1.2rem var(--color-earth-20)` |
| Video play plate | `0 0 2rem 0.4rem rgba(255,255,255,0.05), 0 0 3.2rem 0.6rem rgba(255,255,255,0.05)` |
| Floating highlight card | `0 4px 4px 0 rgba(0,0,0,0.12)` |

The pattern to copy: **large blur, large negative spread, colour taken from the ink alpha ramp — not black.** `-0.8rem` spread on a `3.2rem` blur keeps the shadow tucked under the object.

### 4.4 Blur

| Token / class | Value | Where |
|---|---|---|
| `--blur-sm` | `8px` | Tailwind `.blur` |
| `--blur-md` | `12px` | |
| `backdrop-blur-md` | `blur(12px)` | **Mobile nav pill only** — over `bg-header` + `border-earth-5` |
| `backdrop-blur-[6px]` | `blur(6px)` | ScrollStages step pill + progress label, over `bg-text-primary/20` |
| `lg:blur-[1px]` | | Background texture **video** on desktop |
| `lg:blur-[3px]` | | Background texture **still** on desktop (wrapper is `-inset-[6px]` so the blur never reveals an edge) |
| `blur-[2.5px]` | | Misc |

### 4.5 Gradients

**There are no decorative brand gradients.** Every gradient does one of three jobs.

**(a) Dissolve media into the canvas**

```html
<div class="pointer-events-none absolute inset-x-0 bottom-0 h-[150%] md:h-[200%]
            bg-gradient-to-t from-background via-background/50 to-background/0"></div>
```
→ `linear-gradient(to top in oklab, #fef9ed, color-mix(in oklab,#fef9ed 50%,transparent) 50%, transparent)`.
Note the height: **150% of the element, 200% at md** — the fade is taller than the thing it fades, which is what stops it looking like a band.

**(b) Legibility scrims over photography**

```html
<div class="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-transparent"></div>
<div class="absolute inset-x-0 bottom-0 z-1 h-[50%] rounded-b-small
            bg-linear-to-t from-[rgba(0,0,0)] to-transparent"></div>
```
Two stacked scrims on team cards: a full-height soft one and a bottom-half hard one.

**(c) The highlighter sweep** — the one expressive gradient

```css
background-image: linear-gradient(var(--color-accent), var(--color-accent));
background-repeat: no-repeat;
background-position: left center;
box-decoration-break: clone;           /* + -webkit- */
/* animated: background-size 0% 100% → 100% 100% */
```

Plus one ambient radial stack, used only inside the centred testimonial quote card:

```css
background-image:
  radial-gradient(ellipse 50% 41.5% at 50% 41.5%, #b7cded, #b7cded00),
  radial-gradient(ellipse 50% 41.5% at 50% 41.5%, #b7cded, #b7cded00),
  radial-gradient(ellipse 44.12% 42.15% at 48.88% 57.85%, #fedfef 50%, #fedfef00 100%);
/* on a div: aspect-[1886/1803] w-[246.53%] left-[101.41%]
   -translate-x-1/2 -translate-y-[41.6%] rotate-[34.65deg]  */
```

Deliberately far larger than its frame and rotated 34.65°, so only a soft off-centre corner of the aurora is ever visible.

And `.rfm-overlay::before/::after` from react-fast-marquee: `linear-gradient(to right, var(--gradient-color), rgba(255,255,255,0))` at `var(--gradient-width)`, mirrored on the right with `rotateZ(180deg)`.

### 4.6 Image treatment

- Media is almost always `overflow-hidden` + `rounded-medium` (20px) or `rounded-large` (30px).
- Every `<Image>` gets an explicit `sizes` map `{small, medium, large}` compiled to `(max-width:639px) X, (min-width:640px) and (max-width:1023px) Y, (min-width:1024px) Z`, with `quality={100}`.
- Recurring aspect ratios: `228/300` (founder photos) · `333/400` (team cards) · `350/220` → `588/354` (collage frame) · `555/580` · `1034/560` · `1050/1182` · `201/232` · `5/7` · `2689/11` and `355/326` (footer wordmark) · `113/18` (logo).
- **Texture system.** A `Texture` component is layered behind many sections: three moods `dark` / `mid` / `light` (plus `resources` and `comparisonTable`), each with a still `.webp` in desktop/mobile/background cuts and an optional looping `.mp4` at `/assets/textures/{dark,mid,light}.mp4`, rendered at 90–100 % opacity and blurred 1–3 px at lg. It supports `bg-fixed` variants for parallax-less depth.
- **No masks or clip-paths** except `.sr-only` (`clip-path: inset(50%)`) and the footer wordmark reveal.

---

## 5. The block system

Every page is a stack of `<section>` elements from a fixed vocabulary of **41 block types**. Padding is expressed through two custom properties set by the block's CSS-module class:

```css
.Blocks_block                       { --block-pt: 0px; --block-pad-bottom: 0px }
.Blocks_block.Blocks_blockDefault   { --block-pt: var(--spacing-48); --block-pad-bottom: var(--spacing-48) }
.Blocks_block.Blocks_Hero           { --block-pt: var(--spacing-section-padding-m); --block-pad-bottom: 0px }
/* … one rule per type, with media-query overrides … */
```

The markup then bridges `--block-pt` to the value children actually consume:

```html
<section class="relative isolate Blocks_block__xpgOf Blocks_Headline__vFAaJ
                [--block-pad-top:var(--block-pt)]"
         data-block-type="Headline" data-theme="light" style="z-index:2">
```

…and the first Hero on a page instead declares
`[--block-pad-top:calc(var(--header-height)+var(--block-pt))]` so it clears the fixed nav. Children use `pt-[var(--block-pad-top)] pb-[var(--block-pad-bottom)]`.

**This indirection is worth copying.** One wrapper component owns the entire vertical rhythm of the site; a designer changes a block type's breathing room in one CSS rule without touching the component.

### 5.1 Full block table

`s/m/l` = `--spacing-section-padding-s/m/l`; `mg` = `--spacing-margins`; plain numbers = `--spacing-N`.

| Block | `--block-pt` | `--block-pad-bottom` | Responsive overrides |
|---|---|---|---|
| **Hero** | `m` | `0` | — |
| **HeroColumns** | `32` | `mg` | — |
| **HeroFramed** | `8` | `mg` | sm: pt `20` |
| **HeroFullwidth** | `0` | `0` | — |
| **HeroSummit** | `l` | `0` | — |
| **FoundersNote** | `l` | `l` | — |
| **Headline** | `72` | `72` | — |
| **LogosGrid** | `32` | `32` | sm: `48`/`48` |
| **LogosTicker** | `32` | `32` | sm: `48`/`48` |
| **IconBlocks** | `mg` | `mg` | — |
| **Stats** | `mg` | `48` | lg: pb `72` |
| **Testimonial** | `0` | `0` | — |
| **TestimonialsMediaCards** | `72` | `72` | — |
| **TestimonialsQuoteCards** | `72` | `72` | — |
| **TestimonialsTextCards** | `72` | `72` | — |
| **CardsGrid** | `48` | `48` | sm: `72`/`72` |
| **CardsGradient** | `l` | `m` | md: pt `128` |
| **AgendaCards** | `l` | `l` | — |
| **IconCards** | `l` | `l` | — |
| **ItemsGrid** | `48` | `32` | sm: pb `48` |
| **List** | `64` | `64` | lg: `72`/`96` |
| **Team** | `48` | `48` | sm: `72`/`96` |
| **Compare** | `48` | `48` | md: `72`/`96` · lg: `l`/`l` |
| **Bento** | `72` | `mg` | md: pt `l` · lg: pb `mg` |
| **SideBySide** | `48` | `48` | — |
| **SummitPricing** | `l` | `l` | md: `128`/`96` |
| **SummitDetails** | `l` | `l` | md: `128`/`128` |
| **TextImage** | `48` | `0` | md: pt `48` |
| **Cta** | `0` | `0` | — |
| **CtaBackground** | `mg` | `mg` | — |
| **ContactForm** | `mg` | `mg` | — |
| **BlogSummary** | `48` | `48` | sm: `72`/`72` |
| **Jobs** | `48` | `72` | sm: pb `96` |
| **FeatureScroll** | `72` | `72` | md: `0`/`0` |
| **FeatureStages** | `s` | `s` | lg: `m`/`mg` |
| **FeatureTabs** | `48` | `48` | lg: `72`/`72` |
| **FeatureTimer** | `0` | `0` | — |
| **ScrollStages** | `0` | `0` | — |
| **Divider** | `0` | `0` | — |

The four blocks with `0`/`0` (`FeatureTimer`, `ScrollStages`, `Cta`, `HeroFullwidth`) manage their own spacing because they are full-viewport or edge-bleeding.

### 5.2 Notable block layouts

**Hero** — `grid h-(--vp-height) min-h-[50rem] grid-cols-1 grid-rows-1 overflow-hidden bg-background`. Media layer and copy layer occupy the same grid cell; the copy layer carries `data-theme="dark"` so it inverts independently of the section. Media frame is `rounded-b-large`.

**HeroFramed** — centred copy stack (`b4 md:h6` eyebrow → `h1 md:h2` → `b4 md:b3` → button), then a `perspective-[132rem]` wrapper around a `origin-bottom transform-3d will-change-transform` media plate. This is the only 3D transform in the system.

**FoundersNote** — absolutely-positioned two-photo collage inside `aspect-350/220` (lg `aspect-588/354`, `w-[110%]`). Photo 1: `left-0 top-[12%] w-[42%] aspect-228/300`, rotated `-3deg`. Photo 2: `left-[54%] top-0 w-[42%]` (lg `left-[50%] w-[38%]`), rotated `+6deg`. Each has a `bg-sea` label chip pinned near its bottom edge.

**FeatureScroll** — the section carries `border-t border-border`. Each item is `md:grid md:grid-cols-12 md:gap-gutter`: copy on cols 1–7 with `md:pr-gutter md:[border-right:var(--border)]`, media on cols 8–12 with `md:pb-72` (`md:pb-128` on the last). Media is capped `md:max-w-[50rem] md:ml-auto md:py-32`. Copy measure is `max-w-[58rem]`.

**FeatureStages** *(lg only)* — an `aria-hidden` spacer of `h-(--layout-height)` followed by *n* × `h-[150vh]` rows, with an absolutely-positioned three-column overlay:

```
md:grid-cols-[minmax(0,1fr)_minmax(35rem,1fr)_minmax(0,1fr)]
lg:grid-cols-[minmax(0,1fr)_minmax(48rem,1fr)_minmax(0,1fr)]
```

Each column is `sticky top-0 flex min-h-(--layout-height) items-center justify-center pt-[calc(var(--header-height)+var(--spacing-20))]`. Even-index copy renders left, odd-index right, each statically offset by the ladder `['-20%','0%','10%','25%']`. Below 1024px it degrades to `flex-col gap-y-72`.

**FeatureTabs** — `grid-cols-12 gap-gutter`. A sticky left rail at `lg:col-start-1 lg:col-end-3` (`h-(--vp-height) border-l border-border`) carries a 10×10 px marker square and a `gap-16 pl-[3rem]` tab list; content sits at `lg:col-start-3 lg:col-end-11`.

**ScrollStages** — `grid-cols-1` with a sticky full-viewport texture in row 1 and the content also in row 1. Desktop: left rail of steps with `pt-[calc(var(--vp-height)/2)]`, items `py-128` (first `pb-128`, last `pt-128 pb-[calc(var(--spacing-128)*2)]`), copy `max-w-[44rem] pr-[9rem]`; right column is a sticky `h-(--vp-height)` media well. A centred 1px rule spans the block with a travelling 10×10 marker. Vertical rules at left/right `--spacing-margins` appear only at `@container (min-width:1344px)`.

**FeatureTimer** — `min-h-(--vp-height)` (dropped at `min-height:600px`). Horizontally scrollable tab row `gap-8 lg:gap-x-16 scrollbar-hidden` that becomes `md:flex-wrap md:justify-center`. Tabs are `rounded-full px-[1.5rem] py-[0.6rem] b4`. A 1px full-bleed border sits under the row. Copy `max-w-[41.7rem] md:max-w-[58rem]`; screenshot `max-w-[100rem]` with `mb-[-.1rem]` so it kisses the section edge.

**Team** — `ul grid-cols-6 gap-margins` → `sm:grid-cols-12 gap-gutter`. Normal member `col-span-6 sm:col-span-6 lg:col-span-4`; featured `col-span-6`. Card is `aspect-333/400 rounded-small overflow-hidden` with two stacked scrims and an expand-button.

**TestimonialsQuoteCards** — an Embla carousel with `align:'center'`, `containScroll:false`, `startIndex: floor((n-1)/2)`; `perView` 1.15 / 1.15 / 1.6784 and gaps 20 / 20 / 60 px. The card uses a single scale variable:

```css
.TestimonialsQuoteCards_card {
  --card-t: 1;  --card-min-scale: 1;
  scale: calc(1 - (1 - var(--card-min-scale)) * var(--card-t));
  transform-origin: var(--card-origin, 50%) center;
}
@media (min-width:768px) { .TestimonialsQuoteCards_card { --card-min-scale: .7399 } }
.TestimonialsQuoteCards_featureLayer { opacity: calc(1 - var(--card-t)) }
```

Internally the card uses `--quote-scale` (1 mobile, **1.3516** at md) and expresses every dimension as `calc(Xrem * var(--quote-scale))` — padding `3.2rem`, gap `2rem`, radius `3rem`, quote `1.8rem/1.4/-0.02em` in the display face, meta `1.6rem/1.5`, avatar `10rem` → `13.324rem`. The whole card scales as one unit rather than by breakpoint.

**AgendaCards** — the only container-query-driven type and the only outlined text:

```css
.AgendaCards_card      { container-type: inline-size }
.AgendaCards_watermark { font-family: var(--font-heading);
                         font-size: clamp(4rem, 26cqw, 9rem);
                         letter-spacing: -.04em;
                         color: transparent;
                         -webkit-text-stroke: .1rem var(--color-earth-50) }
```

**SummitDetails** — the one place headings drop to the body face: `:is(h1..h6) { font-family: var(--font-family); font-size: 2rem; font-weight: 400; line-height: 130%; letter-spacing: -.02em }` (2.6rem at md).

**Bento** — ships `bento.4e75c094.webp` (2880×1576) and `bento-mobile.73f9efce.webp` (1000×1024). Its React component lives in a lazy chunk that 404s at the path the webpack manifest advertises, so its internals could not be read statically.

---

## 6. Buttons & links

### 6.1 Base

```
inline-flex items-center justify-center rounded-[10rem]
transition-all duration-300 ease-in-out cursor-pointer
```

### 6.2 Sizes

| Kind | regular | small |
|---|---|---|
| Text button | `min-h-[40px] px-[2rem] py-[0.8rem] sm:min-h-[4.8rem] sm:max-h-[4.8rem] sm:px-[2.4rem] sm:py-[1.2rem]` | `min-h-[40px] px-[2rem] py-[0.8rem] sm:min-h-[3.7rem] sm:max-h-[3.7rem] sm:px-20 sm:py-8` |
| Icon button | `size-[40px] rounded-full sm:size-[4.8rem]` | `size-[40px] rounded-full sm:size-[4rem]` |
| Tertiary | `min-h-[5.5rem] px-24 py-12` | `min-h-[4.1rem] px-20 py-8` |
| Label class | `b4` | `b5` |

Note the mobile floor of **40px** on everything — the touch target never drops below it, and only at `sm` do buttons take their designed height.

### 6.3 Variants

| Variant | Fill | Border | Hover fill | Text | Hover transform |
|---|---|---|---|---|---|
| `primary` / light | `lemon-button` `#f9f665` | `1px earth-20` | `lemon-button-active` `#f3f05a` | `earth-dark` | `scale(1.0375)` |
| `primary` / dark | `earth-dark` | — | `earth-button-active` `#84715f` | `cloud` | `scale(1.0375)` |
| `secondary` / light | `tan/25` | — | `tan/50` | `earth-dark` | `scale(1.0375)` |
| `secondary` / dark | `oatmeal-80` | — | `taupe` | `earth-dark` | `scale(1.0375)` |
| `white` | `white` | `1px earth-20` | `cloud` | `earth-dark` | `scale(1.0375)` |
| `tertiary` | transparent, `px-0 py-0 gap-[0.8rem]` | — | — | `earth-dark` (or `cloud` on dark) | **none** |
| `iconPrimary` / light | `lemon-button` | `1px earth-30` | `lemon-button-active` | `earth-dark` | none |
| `iconPrimary` / dark | `earth-dark` | — | `earth-button-active` | `cloud` | none |
| `iconSecondary` / light | `tan/25` | — | `tan/50` | `earth-dark` | none |
| `iconSecondary` / dark | `oatmeal-80` | — | `taupe` | `earth-dark` | none |

`transform-gpu` is applied alongside the scale. **1.0375 is a deliberately tiny 3.75 % lift** — it reads as the surface pressing toward you rather than a pop.

Tertiary buttons render their label as `b4` on mobile and the `label` class at `sm+`, and always carry an `arrowRight` icon in a `size-[2.6rem] rounded-full bg-lemon-button` chip whose SVG is `scale-[1.2]`; the chip goes `bg-lemon-button-active` on group hover over 300 ms.

### 6.4 The icon slide

Every tertiary/icon button wraps its glyph in a two-copy track:

```html
<div class="h-full w-full scale-x-[-1]">
  <div class="flex h-full w-[200%] shrink-0 transform-gpu transition-transform duration-500 ease-in-out
              motion-reduce:transform-none motion-reduce:group-hover:translate-x-0
              group-hover:-translate-x-1/2 group-hover/cta:-translate-x-1/2">
    <div class="flex h-full w-1/2 shrink-0 items-center justify-center scale-x-[-1]"><Icon/></div>
    <div class="flex h-full w-1/2 shrink-0 items-center justify-center scale-x-[-1]"><Icon/></div>
  </div>
</div>
```

On hover the track slides `-50%` over 500 ms: the arrow exits right while an identical one enters from the left. Infinite-looking, no JS, and the double `scale-x-[-1]` keeps the glyph reading forward.

### 6.5 The expand button

```css
.expand-button::before,
.expand-button::after {
  content: ""; position: absolute; top: 50%; left: 50%;
  width: 1.5rem; height: .1rem;
  background-color: currentColor; transform-origin: 50%;
}
.expand-button::before { transform: translate(-50%,-50%) rotate(0) }
.expand-button::after  { transform: translate(-50%,-50%) rotate(90deg);
                         transition: transform .3s ease-in-out }
.expand-button[aria-expanded="true"]::after { transform: translate(-50%,-50%) rotate(180deg) }
@media (prefers-reduced-motion:reduce) { .expand-button::after { transition: none } }
```

A plus that rotates into a minus. Sizes `size-[40px] sm:size-[4rem]` (small) or `sm:size-[4.8rem]`. Themes: light `bg-oatmeal-40 hover:bg-oatmeal-50`, dark `bg-earth-40 hover:bg-earth-50`; `color: var(--color-cloud)` in both.

### 6.6 Links

| Link | Treatment |
|---|---|
| Rich text | Permanently underlined (`.1rem`, offset `.2em`); on hover `text-decoration-color` transitions to transparent over 200 ms — **the underline recedes** |
| Nav | `b4 text-primary transition-opacity duration-300 ease-in-out`; while any submenu is open the other items drop to `opacity-30` |
| Footer / on-dark | `b5 text-cloud transition-opacity hover:opacity-70` |

---

## 7. Header & navigation

```html
<header class="fixed lg:pointer-events-none inset-x-0 top-(--banner-offset,0px)
               z-(--z-header) h-(--nav-height) pt-20">
```

The header is `pointer-events-none` at lg so only the pill itself is clickable — the rest of the bar lets scroll and hover through.

**Desktop pill** — `mx-auto max-w-[96rem] h-(--nav-height) rounded-full bg-header py-8 px-16 [border:var(--border)] overflow-hidden pointer-events-auto!`. Logo `h-[2.2rem] w-[12rem] ml-8` (inline SVG, `viewBox 0 0 113 18`). The nav `ul` is `flex gap-[2rem]`; when there are **≤4 items** it is absolutely centred with `transform: translateX(calc(-50% - 1.6rem))` — an optical correction for the logo's weight on the left.

**Chevron** — a 10×6 SVG at `stroke-width: 1.25`, `inline-block transition-transform duration-200`, `rotate-180` when open.

**Header CTAs** — two pills:
```
inline-flex items-center justify-center rounded-[10rem] border border-earth-20 b5 text-primary
transition-colors transition-background duration-300
min-h-[40px] px-[2rem] py-[0.8rem] sm:min-h-[3.7rem] sm:max-h-[3.7rem] sm:px-20 sm:py-8
```
one `bg-cloud hover:bg-transparent`, one `bg-lemon-button hover:bg-lemon-button-active`.

**Mobile pill** — `mx-auto max-w-[96rem] h-(--nav-height) rounded-full border border-earth-5 bg-header px-20 backdrop-blur-md gap-16`. This is the only place `backdrop-blur-md` (12px) is used. The burger is two `1.5px × 24px` bars at `-translate-y-[3px]` / `translate-y-[3px]` that rotate ±45° and collapse to `-translate-y-1/2` when `group-data-active`, over `transition-transform duration-200`.

**Mega-menu** —
```
absolute inset-x-0 top-(--nav-height) z-(--z-header) w-full transform-gpu pt-[1rem]
style="transform-origin: 50% 0"
  └── overflow-hidden rounded-medium bg-header pt-16 pl-16 pr-16 pb-32 [border:var(--border)]
        └── grid min-h-[20rem] grid-cols-2 gap-20
```

The CTA card inside is a `group/cta` whose image sits in `relative overflow-hidden rounded-small` with an inner `transform-gpu transition-transform duration-500 ease-in-out will-change-transform group-hover/cta:scale-[1.06]`; image ratio `9/16`, `object-fit: cover`.

Switching directly between two submenus **morphs the panel height**: the old height is pinned inline, a reflow is forced (`el.offsetHeight`), then `transition: height 0.2s ease-in-out` runs to the new height and the inline styles are removed on `transitionend`. Skipped under reduced motion and when the delta is under 0.5 px.

**Banner coupling** — a JS handler writes `--banner-offset = max(0, bannerHeight − window.scrollY)px` onto `documentElement`, so the header rides up exactly as fast as the announcement banner scrolls away, with no snap. Dismissal persists in `localStorage['exa_banner_dismissed']`.

---

## 8. Forms

HubSpot embedded forms, restyled entirely through `--hsf-*` custom properties on `.HubspotForm_shell`:

```css
.HubspotForm_shell {
  width: 100%; overflow: visible;
  color: var(--color-text-primary);
  border-radius: var(--radius-small, 1.2rem);
  padding: 2rem;                          /* md: 3.2rem 2rem */
  background: var(--color-earth-10);
}
[data-theme=dark] .HubspotForm_shell { background: var(--color-oatmeal-10) }
```

A `shellTextured` variant makes the background transparent, sets `position:relative; isolation:isolate`, and inserts an absolutely-positioned `.textureLayer` at `z-index:-1` with `border-radius: inherit`.

Key tokens:

| Token | Value |
|---|---|
| `--hsf-global__font-size` | `1.6rem` |
| `--hsf-row__horizontal-spacing` / `--hsf-row__vertical-spacing` | `2rem` / `2rem` |
| `--hsf-module__vertical-spacing` | `0.4rem` |
| `--hsf-field-label__font-size` | `1.4rem` |
| `--hsf-field-input__border-radius` | `0.4rem` |
| `--hsf-field-input__padding` | `0 1rem` |
| `--hsf-field-input__border-width` | `0` (textarea: `0.1rem`) |
| `--hsf-button__border-radius` | `9999px` |
| `--hsf-button__padding` | `1.2rem 2rem` |
| `--hsf-button__background-color` | `var(--color-accent)` |
| `--hsf-button__hover-background-color` | `var(--color-lemon-button-active)` |
| `--hsf-global-error__color` | `#ff3b3b` |

`#ff3b3b` is the only red in the system and is **hard-coded, not a token** — worth fixing if you replicate.

Overrides on HubSpot's own classes: `.hsfc-TextInput { font-size: 1.8rem; line-height: 145%; letter-spacing: -.01em; height: 4.5rem }` · `.hsfc-Button { transition: all .3s ease-in-out; transform: scale(1) → scale(1.0375) on hover }` · radio/checkbox inputs `2.5rem` square · `.hsfc-RadioFieldGroup__Options { margin-top: 2.4rem }`. On submit, `.HubspotForm_shellSubmitted { min-height: 0; overflow: hidden; padding-block: 1.6rem }` and `.hs-form-html { display: none !important }`.

---

## 9. Other components

**Accordion** — Radix `type="single" collapsible`. Item `border-b border-border`; trigger `group flex w-full items-center justify-between gap-20 py-24 text-left`; question `b2 text-balance`; toggle `size-[4rem] rounded-full bg-oatmeal-60 group-hover:bg-oatmeal-80 transition-colors duration-300` with a chevron on `transition-transform duration-300 ease-in-out group-data-[state=open]:-rotate-180`; answer `b4 pb-24 leading-relaxed lg:pr-[6rem]`.

**Carousel** — Embla. Slide basis is computed rather than fractional:
`calc((100% - (gap × ceil(perView − 1))) / perView)` with `marginRight: gap`, so fractional `perView` values like `1.6784` produce an exact peek. The progress bar is a 2 px `<progress>` (`mt-48`, track `bg-border/35` + `bg-border`, value `bg-text-primary`, all `rounded-full`) whose value is `clamp(scrollProgress × 100, 33, 100)` — it never starts empty.

**Custom cursor** — Motion+ `Cursor`. Injects `* { cursor: none !important }` when not in follow mode. Zones resolve `[data-cursor]` → `a, button, input[type=button]` (*pointer*) → `p, textarea, input[type=text], h1..h6` (*text*) → *default*. Sizes: default 17×17, pointer 31×31 (or the target's bounding box + 5 px when magnetic+morph), text 4 × computed font-size. `border-radius: 20px`, `z-index: 99999`, `position: fixed`, `pointer-events: none`. The tooltip body is `flex min-h-[3.3rem] items-center rounded-large bg-earth-dark px-16` with `label text-cloud whitespace-nowrap` inside.

**Stat counters** — `number-flow`, driven purely by a `0 → n` value change on in-view. Defaults: `transformTiming` 900 ms on a 90-stop `linear()` easing string, `opacityTiming` 450 ms `ease-out`, `respectMotionPreference: true`. It registers four custom properties (`--_number-flow-d-opacity`, `--_number-flow-dx`, `--_number-flow-d-width`, `--_number-flow-d`).

---

## 10. Tailwind theme values that ship

Useful to know because they bound which utilities exist, even though the design rarely uses them.

```css
--font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", …
--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, …
--container-xs:20rem  --container-sm:24rem  --container-md:28rem  --container-lg:32rem
--container-2xl:42rem --container-3xl:48rem --container-4xl:56rem --container-5xl:64rem
--font-weight-normal:400  --font-weight-medium:500  --font-weight-semibold:600
--leading-normal:1.5  --leading-relaxed:1.625
--animate-spin: spin 1s linear infinite
--animate-pulse: pulse 2s cubic-bezier(.4,0,.6,1) infinite
--blur-sm:8px  --blur-md:12px
--default-transition-duration:.15s
--default-transition-timing-function: cubic-bezier(.4,0,.2,1)
```

Remember: these are 16px-relative. `--container-5xl: 64rem` is 640px at `--rem-size: 10px`.

---

## 11. How to replicate the feel — the short version

1. **Set `html { font-size: 10px }` first.** Everything else assumes it.
2. **Two neutrals, one accent, and alpha ramps of the neutrals for everything else.** A warm dark ink (`#5d5146`), a warm off-white canvas (`#fef9ed`), one saturated accent (`#f9f665`). Build the `-5/-10/-15/-20/-30/-40/-50/-60/-80` ramps over both. Resist adding a third structural hue.
3. **Theme per section, not per page.** `data-theme="dark"` on a `<section>`; the nav pill keeps its own colour through both.
4. **One hairline token.** `--border: .1rem solid var(--color-border)` applied as `[border:var(--border)]`. Every rule on the site is the same 1px, and it themes in one place.
5. **Headings at weight 400 in a display serif.** Let scale and tracking (down to `-0.04em` at 80px) do the work. Reserve the italic cut for a deliberate accent phrase.
6. **One positive-tracking style** (`+0.02em`, 12–14px) for chips, pills and tertiary-button text. Never uppercase.
7. **One block wrapper owns all vertical rhythm.** `--block-pt` / `--block-pad-bottom` set by a per-type class, consumed by children. Change breathing room without touching components.
8. **Gutters shrink as margins grow.** 20px → 12px grid gap at md while page margins go 20px → 48px at lg.
9. **Shadows come from the ink alpha ramp, with big blur and big negative spread.** No black.
10. **Gradients only fade, scrim or highlight.** Make the fade taller than the object (150–200 %) so it never reads as a band.

---

*Continue to [`MOTION.md`](./MOTION.md) for the animation mechanics.*
