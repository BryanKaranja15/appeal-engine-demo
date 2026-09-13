# ExaCare Motion Mechanics — Extracted Specification

**Source:** `https://www.exacare.com` (deployment `dpl_6uTBiNGgWV3eayXr7GvWot8Rtpk2`)
**Method:** static extraction from the shipped JavaScript chunks and CSS. Minified snippets are quoted where they are the evidence. No headed browser run — runtime-measured values are flagged at the end.
**Machine-readable companion:** [`motion.json`](./motion.json) · **Design tokens:** [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md)

---

## 1. Libraries detected

| Library | Version | Evidence | Used for |
|---|---|---|---|
| **motion / framer-motion** | **12.x** (exact patch not emitted; the `AcceleratedValue`/`accelerate` transform path implies **≥ 12.23**) | chunk `5690` module `775` exports the `motion` proxy (`m.P.div`); module `90095` = `AnimatePresence`; internals `visualElement`, `projection`, `framerAppearId`, `layoutId`, `MotionConfig`, `LayoutGroup`, `restSpeed`/`restDelta`, `backOut`/`circInOut`/`anticipate` | Everything scroll-, state- and presence-driven |
| **motion-plus (Motion+)** — `Cursor` | not emitted | chunk `302` module `58050`; injects `[data-motion-cursor="pointer"]` CSS and `* { cursor: none !important }`; `data-framer-portal-id:"motion-cursor"` | Carousel "Drag" cursor, logo tooltips |
| **react-intersection-observer** | not emitted | chunk `302` module `26304` exports `Wx` with the exact option set `{threshold, delay, trackVisibility, rootMargin, root, triggerOnce, skip, initialInView, fallbackInView, onChange}` and shared-observer `WeakMap` pooling | Stats, footer wordmark, Lottie, video autoplay |
| **react-fast-marquee** | not emitted (class prefix `rfm-`, injects its own `<style>`) | chunk `302` module `3045`; `.rfm-marquee-container`, `.rfm-overlay`, `@keyframes scroll` | LogosTicker |
| **embla-carousel-react** | not emitted | chunk `302` module `81722` exports `A` = `useEmblaCarousel`; `{loop, align, containScroll, startIndex, slidesToScroll, active}`, `scrollProgress()` | All carousels |
| **@lottiefiles/dotlottie-web** + **-react** | **0.63.0** | chunk `92d23bba`: `_="0.63.0", f="@lottiefiles/dotlottie-web"`, wasm fallback `https://unpkg.com/@lottiefiles/dotlottie-web@0.63.0/dist/dotlottie-player.wasm` | The `lottie` media type |
| **number-flow** | not emitted | chunk `302` module `52093`; `CSS.registerProperty` of `--_number-flow-d-opacity/-dx/-d-width/-d`, `defaultProps.transformTiming/opacityTiming/spinTiming` | Stat counters |
| **Radix UI** | not emitted | chunk `302`: `@radix-ui`, Accordion/Popper/FocusScope/Toolbar/ToggleGroup; `--radix-accordion-content-height` | FAQ accordion, pricing toggle |
| **sonner** | not emitted | chunk `4228` | Toasts |
| **zustand** | not emitted (high confidence) | chunk `9082` module `90492`, `create(set => …)` shape | Layout store |

### Not present

**GSAP · ScrollTrigger · Lenis · Locomotive · Swiper · Splide · keen-slider · react-spring · View Transitions API · CSS `scroll-timeline` / `animation-timeline`.**

Smooth scrolling is native: `html { scroll-behavior: smooth }` plus `window.scrollTo({ behavior: 'smooth' })`. Every scroll linkage is JavaScript — either framer-motion's `useScroll` or a hand-rolled rAF-throttled `getBoundingClientRect` loop.

---

## 2. The easing vocabulary

Five cubic-bezier arrays account for essentially every JS-driven motion on the site. Three are declared once per module and reused.

| Name | Array | CSS | Declared as | Job |
|---|---|---|---|---|
| **expoOut** | `[.16, 1, .3, 1]` | `cubic-bezier(.16,1,.3,1)` | `let d=[.16,1,.3,1]` (FoundersNote) · inline in FeatureStages | Entrance reveals — big, slow, decisive |
| **quintOut** | `[.22, 1, .36, 1]` | `cubic-bezier(.22,1,.36,1)` | `let u=[.22,1,.36,1]` (Highlight) · inline in FeatureStages media, footer wordmark | Crossfades and long clip/size reveals |
| **standard** | `[.4, 0, .2, 1]` | `cubic-bezier(.4,0,.2,1)` | `let h={duration:.3,ease:[.4,0,.2,1]}` (Team) · inline in ScrollStages, FeatureTimer | Short UI state changes (0.22–0.3 s) |
| **emphasizedDecel** | `[.2, 0, 0, 1]` | `cubic-bezier(.2,0,0,1)` | inline, header only | Mega-menu open |
| **cursorDefault** | `[.38, .12, .29, 1]` | `cubic-bezier(.38,.12,.29,1)` | `let K={duration:.15,ease:[.38,.12,.29,1]}` — Motion+ library default | Cursor morph |

`[.4,0,.2,1]` is also Tailwind's `--default-transition-timing-function`, so JS state changes and CSS transitions land on the same curve without anyone coordinating.

Hand-written CSS transitions use `ease-in-out` for almost everything and `ease-out` for the two long ones (the 1200 ms stat rule, the 300 ms timer tab).

### Duration bands

| Band | Range | What lives there |
|---|---|---|
| **Instant** | 0.09 – 0.30 s | Text swaps, tab crossfades, hover colour, chevrons, accordion |
| *(gap)* | 0.31 – 0.49 s | **Nothing** |
| **Hover** | 0.50 s | Icon slide, card zoom, tab-label opacity |
| *(gap)* | 0.51 – 0.89 s | **Nothing** |
| **Reveal** | 0.90 – 2.00 s | Photo entrances, highlight sweep, stat rule, footer wordmark |

That gap is the whole trick. There is nothing in the 0.4–0.8 s "generic web animation" band, which is why the site feels composed rather than busy.

### Springs

| Name | Config | ζ | Used by |
|---|---|---|---|
| `heroFramedLift` | `{stiffness:220, damping:32, mass:.35}` | ≈1.15 | HeroFramed rotateX + y; FeatureTabs media scale |
| `heroFramedOpacity` | `{stiffness:200, damping:28, mass:.35}` | ≈1.06 | HeroFramed opacity; FeatureTabs copy opacity |
| `featureTabsRailMarker` | `{stiffness:320, damping:34, mass:.45}` | ≈0.90 | FeatureTabs rail marker — the only one allowed a hint of overshoot |
| `summitPricingPill` | `{type:'spring', stiffness:420, damping:34}` | — | Shared-layout pricing toggle pill |
| `cursorFollow` | `{stiffness:1000, damping:100}` | — | Motion+ Cursor follow |
| `cursorMagneticSnap` | `{stiffness:600, damping:50}` | — | Motion+ Cursor magnetic snap |

Every authored spring is **critically damped or slightly over-damped** except the rail marker. Nothing bounces.

---

## 3. Scroll-linked patterns

### 3.1 `heroMediaScaleOnScroll` — Hero

| | |
|---|---|
| **Trigger** | scroll progress |
| **Driver** | `useScroll({ target: blockRef, offset: ['start start', 'end 25%'] })` |
| **Easing** | none — raw scroll linkage |

| Target | Property | From → To | Mapping |
|---|---|---|---|
| Outer frame `.origin-center.rounded-b-large.will-change-transform` | `scale` | `1 → 0.9` | `p => 1 - 0.1 * clamp(p, 0, 1)` |
| Inner media `.absolute.inset-0.h-(--vp-height).will-change-transform` | `scale` | `1 → 1.111` | `s => 1 / max(s, 0.001)` |

```js
let{scrollYProgress:t}=(0,u.L)({target:e,offset:["start start","end 25%"]}),
    l=(0,m.G)(t,e=>1-.1*Math.min(1,Math.max(0,e))),
    r=(0,m.G)(l,e=>1/Math.max(e,.001));
return{blockRef:e,scale:l,inverseScale:r}
```

**Effect.** The rounded frame shrinks to 90 % as you leave the hero while the image inside counter-scales by exactly the inverse — so the photograph appears locked at true size while its window closes around it. Far more expensive-looking than scaling the image itself, and it costs one extra `useTransform`.

---

### 3.2 `heroFramed3DLift` — HeroFramed

| | |
|---|---|
| **Trigger** | scroll — hand-rolled rAF-throttled `scroll` + `resize` listeners reading `getBoundingClientRect`, **not** `useScroll` |
| **Container** | `perspective-[132rem]` wrapper around a `origin-bottom transform-3d will-change-transform` plate |

Progress function (from the minified source, de-minified):

```js
function visibleProgress(rect, vh) {
  const h = rect.height;
  if (h <= 0) return 0;
  // less than half the element visible → 0
  if (Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) < 0.5 * h) return 0;
  const r = Math.max(1e-6, vh - 0.25 * vh);
  const a = clamp((vh - rect.top) / r);
  const n = clamp((vh - (vh - 0.5 * h)) / r);
  return n >= 1 ? 1 : clamp((a - n) / (1 - n));
}
function progress(rect, vh) {
  const lead = 0.25 * vh;
  if (rect.top > vh) return visibleProgress(rect, vh);
  if (rect.bottom < 0 || rect.top <= lead) return 1;
  return visibleProgress(rect, vh);
}
```

| Property | MotionValue init | `set(...)` | From → To | Spring |
|---|---|---|---|---|
| `rotateX` | `17.6` | `17.6 * (1 - p)` | `17.6deg → 0deg` | `{220, 32, .35}` |
| `y` | `22` | `22 * (1 - p)` | `22px → 0px` | `{220, 32, .35}` |
| `opacity` | `0.92` | `0.92 + 0.08 * p` | `0.92 → 1` | `{200, 28, .35}` |

```js
b=(0,s.d)(17.6),y=(0,o.z)(b,{stiffness:220,damping:32,mass:.35}),
L=(0,s.d)(22),  j=(0,o.z)(L,{stiffness:220,damping:32,mass:.35}),
w=(0,s.d)(.92),A=(0,o.z)(w,{stiffness:200,damping:28,mass:.35})
…
b.set(17.6*(1-l)),L.set(22*(1-l)),w.set(.92+.07999999999999996*l)
```

**Effect.** The product screenshot starts tipped back 17.6° on a 1320 px perspective and rises to flat as it enters view. The spring between raw scroll and applied transform is what keeps it feeling like a physical object rather than a scrubber. This is the single most "premium" move on the site.

> **Copy this exactly:** perspective `132rem`, tilt `17.6deg`, lift `22px`, opacity floor `0.92`, and always put a slightly over-damped spring between scroll and the transform.

---

### 3.3 `featureScrollParallax` — FeatureScroll

| | |
|---|---|
| **Trigger** | scroll progress, **desktop only** (`matchMedia('(min-width: 768px)')`; below md no `style` prop is applied at all) |
| **Driver** | `useScroll({ target: itemRef, offset: ['start end', 'end start'] })` |
| **Easing** | none — raw |

| Target | Property | From → To |
|---|---|---|
| Media column (`md:col-span-5`) | `y` | `0 → +130px` |
| Copy column (`md:col-span-7`) | `y` | `+20px → -110px` |

```js
let{scrollYProgress:x}=(0,s.L)({target:f,offset:["start end","end start"]}),
    p=(0,o.G)(x,e=>c?130*e:0),
    v=(0,o.G)(x,e=>c?20-130*e:0)
```

**Effect.** A 260 px counter-shear across the item's full viewport traversal. The vertical hairline between the columns (`md:[border-right:var(--border)]`) reads as a hinge the two halves rotate around.

---

### 3.4 `featureStagesStickyCrossfade` — FeatureStages *(≥1024px)*

Two **independent** scroll ranges, which is the clever part.

```js
let {scrollYProgress: C} = useScroll({ target: spacerRef,     offset: ["start end",  "start start"] }); // enter
let {scrollYProgress: E} = useScroll({ target: scrollRowsRef, offset: ["start start","end end"]     }); // stage
```

**Structure.** An `aria-hidden` spacer of `h-(--layout-height)`, then *n* × `h-[150vh]` rows, with an absolutely-positioned three-column overlay pinned `sticky top-0` over both.

**Index logic**

```js
useMotionValueEvent(C, "change", v => { if (v < .999) return setIndex(0); setFromStage(E.get()); });
useMotionValueEvent(E, "change", v => { if (C.get() < .999) return; setFromStage(v); });
// setFromStage: index = floor(clamp(v, 0, .9999) * itemCount)
```

The enter range gates the stage range. Nothing advances until the block is fully pinned.

**Centering transform**

```js
let k = useTransform([C, centerOffsetMV], ([t, l]) => -Number(l) * (1 - clamp(Number(t), 0, 1)));
// centerOffset = (spacer.offsetHeight - mediaEl.offsetHeight) / 2   — 0 below 1024px
```

Recomputed via `ResizeObserver` on both the spacer and the media element plus a `resize` listener. The whole overlay slides from `-centerOffset` to `0` as the block enters, so the media column lands optically centred rather than geometrically.

**Crossfades**

| Target | Property | Values | Transition |
|---|---|---|---|
| Left/right copy columns | `opacity` | `1` when index matches, else `0` | `{ duration: .95, delay: .2, ease: [.16,1,.3,1] }` |
| Media stack (`[grid-area:1/1]`) | `opacity` | same | `{ duration: .55, ease: [.22,1,.36,1] }` |

```js
let R={duration:.95,delay:.2,ease:[.16,1,.3,1]}
…
transition:{duration:.55,ease:[.22,1,.36,1]}
```

Each stage's copy also carries a **static** offset from the fixed ladder `['-20%','0%','10%','25%']`, so consecutive stages don't sit at the same vertical position.

Every `motion.div` here uses `initial:!1` — **no mount animation, only state-driven crossfades.**

> **Note the asymmetry:** the media crossfades in 0.55 s with no delay; the copy takes 0.95 s and starts 0.2 s later. The picture arrives first and the words settle after it.

---

### 3.5 `scrollStagesMidlineReveal` — ScrollStages

| | |
|---|---|
| **Trigger** | `useMotionValueEvent(scrollY, 'change')` — recomputed every scroll frame, plus `resize` and `ResizeObserver` |

**Per-step opacity** — a continuous focus gradient rather than a discrete active state:

```js
const mid = window.innerHeight / 2;
const radius = Math.max(0.85 * window.innerHeight, 1);
opacity[i] = clamp(1 - Math.abs(rect.top + rect.height/2 - mid) / radius, 0, 1);
```

Written as an inline `style.opacity` (lg only), with `pointerEvents:'none'` below `0.05`. State only updates when some step moves more than `0.002` — cheap hysteresis that stops React re-rendering on every pixel.

**Active index** — nearest step centre to `innerHeight/2`, with `-1` above the first and `n` below the last.

**Label index** — the same nearest-centre search but with a tail allowance past the last step:

```js
const tail = Math.min(420, Math.max(120, Math.round(0.26 * window.innerHeight)));
```

So the step pill lingers for up to 420 px after the last step scrolls past, instead of snapping away.

**Marker travel**

```js
let {scrollYProgress: H} = useScroll({ target: sectionRef, offset: ["start end","end start"] });
let T = useTransform(H, [0, 1], [0, Math.max(0, railHeight - 10)]);
```

Applied as `style={{ y: T }}` to a `relative will-change-transform` wrapper holding a 10×10 px `bg-text-primary` square on the centre rule.

**Step pill** — a *nested* `AnimatePresence`, which is the detail worth stealing:

```jsx
<AnimatePresence initial={false} mode="wait">
  {labelIndex >= 0 && (
    <motion.div
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      transition={{duration:.22, ease:[.4,0,.2,1]}}
      className="label absolute top-1/2 left-0 -translate-x-[calc(100%+1.5rem+5px)] -translate-y-1/2
                 rounded-full bg-text-primary/20 px-[1rem] py-4 backdrop-blur-[6px]">
      <AnimatePresence initial={false} mode="wait">
        <motion.span key={labelIndex}
          initial={{opacity:.78}} animate={{opacity:1}} exit={{opacity:.78}}
          transition={{duration:.09, ease:"easeOut"}}>
          {items[labelIndex].stepName}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )}
</AnimatePresence>
```

The **outer** presence handles the pill appearing/disappearing (0.22 s, 0→1). The **inner** one handles text changing between steps (0.09 s, **0.78→1**, never to zero). So consecutive steps read as a fast text swap inside a stable pill, not as a pill re-entering. The 0.78 floor is what makes it feel like a flicker of update rather than a fade.

---

### 3.6 `featureTabsScrollSpy` — FeatureTabs

Hand-rolled per-item rAF-throttled rect reads driving springs.

| Target | Property | Function | Range | Spring |
|---|---|---|---|---|
| Media frame (`origin-bottom rounded-medium will-change-transform`) | `scale` | `0.8 + 0.2 * clamp(1 - |cy - vh/2| / (0.42*vh))` | `0.8 → 1` | `{220, 32, .35}` |
| Copy block (`will-change-[opacity]`) | `opacity` | see below | `0 → 1` | `{200, 28, .35}` |

```js
// scale
.8 + .19999999999999996 * clamp(1 - Math.abs(rect.top + rect.height/2 - vh/2) / Math.max(1, .42*vh))

// opacity — asymmetric ramp
const cy = rect.top + rect.height/2, a = Math.max(1, .25*vh), r = vh/2;
cy < a  ? clamp(cy / a)
: cy > r ? clamp(1 - (cy - r) / Math.max(1, .45*vh))
: 1
```

The opacity ramp is deliberately asymmetric: it fades in over the top 25 vh but out over 45 vh below the midline, so copy holds full strength longer on the way out than on the way in.

**Rail marker** — `useSpring(useMotionValue(0), {stiffness:320, damping:34, mass:.45})`, positioned:

```js
-1  → 0
n   → railHeight - 10
else  clamp(tabBtn.top + tabBtn.height/2 - rail.top - 5, 0, railHeight - 10)
```

**Active detection** — nearest *image-frame* centre to `vh/2`; `-1` while the section top is below `0.5*vh`; `n` once the section bottom is above `0.75*vh`.

**Click to scroll** —

```js
window.scrollTo({ top: Math.max(0, itemCenterY - vh/2), behavior: "smooth" });
```

…and then a `programmatic` flag is held for **8000 ms** (or until a `scrollend` event), during which the scroll-spy is debounced **180 ms** so the rail doesn't fight the smooth scroll. Three listeners cooperate: `scroll` (debounced while programmatic), `resize` (ignored while programmatic), `scrollend` (cancels the flag).

> **Copy this.** Programmatic smooth-scroll + scroll-spy is the classic source of jank; the flag + `scrollend` + timeout fallback is the correct fix.

---

## 4. In-view triggered patterns

### 4.1 `foundersNotePhotoReveal` — FoundersNote

| | |
|---|---|
| **Trigger** | `whileInView` |
| **Viewport** | `{ once: true, amount: 0.25 }` |
| **Stagger** | baked into each child's `delay` — `0.12 * index` — **not** `staggerChildren` |

```js
let d = [.16,1,.3,1];
let m = {                                   // photo variants
  hidden: e => ({opacity:0, x:e.drift, y:48, rotate:0, scale:.96}),
  visible: e => ({opacity:1, x:0, y:0, rotate:e.rotate, scale:1,
                  transition:{duration:.9*!c, delay:c?0:e.delay, ease:d}})
};
let h = {                                   // label-chip variants
  hidden: {opacity:0, y:8},
  visible: e => ({opacity:1, y:0,
                  transition:{duration:.5*!c, delay:c?0:.45+e.delay, ease:d}})
};
<motion.div initial={c?"visible":"hidden"} whileInView="visible"
            viewport={{once:!0, amount:.25}}>
```

| Element | index | `drift` (x) | `rotate` | delay |
|---|---|---|---|---|
| Photo 1 | 0 | `-20` | `-3deg` | `0.00 s` |
| Photo 2 | 1 | `+20` | `+6deg` | `0.12 s` |
| Label 1 | 0 | — | — | `0.45 s` |
| Label 2 | 1 | — | — | `0.57 s` |

Photos: `opacity 0→1`, `y 48→0`, `scale .96→1`, `rotate 0→final`, **0.9 s** on expoOut.
Labels: `opacity 0→1`, `y 8→0`, **0.5 s** on expoOut.

**Effect.** Two photos fly in from opposite sides, rise 48 px and rotate *into* their final tilt — they settle onto the page like prints dropped on a desk rather than snapping into a grid. The labels arrive 0.45 s later, after the photos have landed.

**Reduced motion** — note the trick: `duration: .9 * !c` where `c = useReducedMotion()`. When reduced, `!c` is `0`, so duration becomes `0`, delay is forced to `0`, and `initial` flips from `"hidden"` to `"visible"`. The animation still *runs*, instantly. No branching code paths.

---

### 4.2 `highlightMarkSweep` — the signature beat

The inline rich-text `Highlight` component. This is the move that most defines the brand.

| | |
|---|---|
| **Trigger** | framer-motion `useInView(ref, { once: true, amount: 'some' })` |

**The mark**

```js
let d = {once:!0, amount:"some"};
let c = {backgroundImage:"linear-gradient(var(--color-accent), var(--color-accent))",
         backgroundRepeat:"no-repeat", backgroundPosition:"left center"};
let u = [.22,1,.36,1];

<motion.span role="mark"
  className="relative z-1 inline [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
  style={c}
  initial={{backgroundSize:"0% 100%"}}
  animate={inView ? {backgroundSize:"100% 100%"} : {backgroundSize:"0% 100%"}}
  transition={{duration:1.25, delay:.5, ease:u}}>
```

`box-decoration-break: clone` is what makes it survive a line wrap — each line fragment gets its own highlighter stroke.

**The floating card** — an optional media chip, `createPortal`-ed to `document.body` so it escapes every `overflow:hidden`:

```js
<motion.span style={{transformOrigin:"center bottom"}}
  initial={{opacity:0, scale:L, x:j, y:"5%"}}
  animate={inView ? {opacity:1, scale:L, x:j, y:"5%"} : {opacity:0, …}}
  transition={{opacity:{duration:.35, delay:1.75, ease:u}}}>
```

with `L = isSm ? 1.25 : 1.5625` and `j = isSm ? "50%" : "10%"`. Only `opacity` animates; scale and offset are static.

Positioning is recomputed on `resize` **and** on capture-phase `scroll` of both `window` and `document`:

```js
style={{ left: rect.left + rect.width/2, top: `calc(${rect.top}px + 0.45ex)` }}
```

Card sizes: `w-[14.04rem] md:w-[18rem] lg:w-[26rem]`, radius `calc(0.7rem*14.04/26)` → `calc(0.7rem*18/26)` → `0.7rem`, shadow `0 4px 4px 0 rgba(0,0,0,0.12)`. A video card is forced `autoplay loop autoPlayThreshold: 0`.

**Timeline**

| t | Event |
|---|---|
| `0.00 s` | phrase enters view (`amount: 'some'` = any part visible) |
| `0.50 s` | highlighter starts sweeping left→right |
| `1.75 s` | highlighter completes **and** the floating card begins fading in |
| `2.10 s` | card fully visible |

Two beats, perfectly butt-joined. The card's 1.75 s delay is exactly `0.5 + 1.25`.

---

### 4.3 `statsCountUp` — Stats

| | |
|---|---|
| **Trigger** | `useInView({ threshold: 0.2, triggerOnce: true })` (react-intersection-observer) |
| **Mechanism** | `<NumberFlow value={inView ? item.number : 0} prefix suffix />` — the count-up *is* the 0 → n value change |

number-flow defaults:

```js
transformTiming: { duration: 900,
  easing: "linear(0,.005,.019,.039,.066,.096,.129,.165,.202,.24,.278,.316,.354,.39,.426,.461,.494,.526,.557,.586,.614,.64,.665,.689,.711,.731,.751,.769,.786,.802,.817,.831,.844,.856,.867,.877,.887,.896,.904,.912,.919,.925,.931,.937,.942,.947,.951,.955,.959,.962,.965,.968,.971,.973,.976,.978,.98,.981,.983,.984,.986,.987,.988,.989,.99,.991,.992,.992,.993,.994,.994,.995,.995,.996,.996,.9963,.9967,.9969,.9972,.9975,.9977,.9979,.9981,.9982,.9984,.9985,.9987,.9988,.9989,1)" },
spinTiming: undefined,
opacityTiming: { duration: 450, easing: "ease-out" },
respectMotionPreference: true
```

**The companion beat** — a pure-CSS rule that draws itself:

```
before:absolute before:bottom-0 before:left-0 before:w-0 before:content-[""]
before:[border-left:var(--border)]
before:transition-[height] before:duration-1200 before:ease-out
```

with `before:h-0` → `before:h-full` flipped by the same `inView` boolean. **1200 ms** — the hairline draws upward while the number counts, and finishes about 300 ms after it. One reveal, two overlapping durations.

The number uses the `display` type style (48 → 80 px) or `h2` in the small variant; the caption is `b5`.

---

### 4.4 `footerWordmarkWipe` — the slowest thing on the site

```jsx
const {ref, inView} = useInView({triggerOnce:true, threshold:.5});
<motion.div className="w-full overflow-hidden"
  initial={{clipPath:"inset(0% 0 100% 0)"}}
  animate={inView ? {clipPath:"inset(0% 0 0 0)"} : {clipPath:"inset(0% 0 100% 0)"}}
  transition={{duration:2, delay:.25, ease:[.22,1,.36,1]}}>
```

**2 full seconds**, delayed 0.25 s, on quintOut. The wordmark is `aspect-[2689/11]` on desktop and `aspect-[355/326]` on mobile — an enormous horizontal lockup wiping up from nothing.

The component is keyed by `usePathname()`, so it **replays on every route change**.

---

### 4.5 `videoInViewAutoplay` — Media

```js
const threshold = clamp(autoPlayThreshold ?? 0.1, 0, 1);   // default 0.1
const {ref, inView, entry} = useInView({threshold, skip: !autoplay});
```

Plus a synchronous rect check on mount so an already-visible video starts without waiting for the observer's first callback:

```js
const p = (el, t) => {
  const r = el.getBoundingClientRect(), vh = window.innerHeight;
  const visible = Math.max(0, Math.min(vh, r.bottom) - Math.max(0, r.top));
  const ratio = r.height > 0 ? visible / r.height : 0;
  return t > 0 ? ratio >= t : (r.top < vh && r.bottom > 0);
};
```

`play()` on in-view, `pause()` on out. The play-button plate:

```
pointer-events-none absolute top-1/2 left-1/2 z-30 grid -translate-x-1/2 -translate-y-1/2
h-[6.48rem] w-[10.125rem] md:h-[8.8rem] md:w-[13.75rem] lg:h-[9.68rem] lg:w-[15.125rem]
rounded-small bg-earth-60
shadow-[0_0_2rem_0.4rem_rgba(255,255,255,0.05),0_0_3.2rem_0.6rem_rgba(255,255,255,0.05)]
transition-opacity duration-300 ease-in-out motion-reduce:transition-none
```

---

### 4.6 `lottiePlaybackModes` — three distinct scroll behaviours

`@lottiefiles/dotlottie-react` 0.63.0 behind a wrapper exposing `playInView`, `playThreshold` (default `0.25`), `playReverse`, `playScrollMidline`, `playScrollScrub`.

All three modes share one **batched scroll bus**: a single `passive` `scroll` listener and a single `resize` listener, each collapsed into one `requestAnimationFrame` per frame and fanned out to every subscribed player. Worth copying if you have many scroll-reactive elements.

| Mode | Behaviour |
|---|---|
| **playInView** | On first intersection while scrolling **down**: `setMode('forward'); play()`. If `playReverse` and the user scrolls back **up** into view: `setMode('reverse'); play()`. Direction is tracked from `window.scrollY` deltas on the shared bus. |
| **playScrollMidline** | `r = (innerHeight/2 - rect.top) / rect.height`. `r ≥ 0.5` → play forward to the last frame (no-op if already there); `r < 0.5` → play reverse to frame 0. Re-evaluated every scroll frame and after every `complete` event. |
| **playScrollScrub** | Frame is scrubbed directly: `start = innerHeight - 0.5*height`, `end = -height`, `raw = clamp((start - rect.top)/(start - end))`. The first observed `raw` is stored as a baseline `c` and the played range is remapped to `(raw - c)/(1 - c)` so the animation always begins at frame 0 wherever the user entered. `frame = t * (totalFrames - 1)` via `setFrame()`. `renderConfig` gets `freezeOnOffscreen: false`. |

`autoplay` is `true` only when *none* of the three modes is set. Whenever `inView` goes false the animation pauses.

---

## 5. Timer & loop patterns

### 5.1 `featureTimerAutoRotate` — FeatureTimer

| | |
|---|---|
| **Trigger** | load + in-view; manual tab click; play/pause control |
| **Per-tab duration** | **6000 ms** |

```js
const Z = useMotionValue(0);                 // 0..100
const z = useTransform(Z, v => `${v}%`);     // → the fill bar's width
…
const remaining = (100 - Z.get()) / 100 * 6e3;
const a = animate(Z, 100, {
  duration: remaining / 1000,
  ease: "linear",
  onComplete: () => { if (paused || !inView) return;
                      if (count >= 2) setIndex(i => (i + 1) % count); }
});
```

It animates *the remaining distance*, so unpausing resumes rather than restarts. Switching tab resets the value to 0.

**Visibility gate** — a plain `IntersectionObserver({ threshold: 0.2 })` on the section. Below 20 % visible the timer is suspended and the bar freezes. (Note: this block uses a raw `IntersectionObserver`, not the hook — the only place on the site that does.)

**Fill bar** — `<motion.div className="absolute inset-y-0 left-0 z-0 bg-feature-timer-tab-fill" style={{width: z}} />`, rendered only on the active tab and only when there is more than one.

**Panel swap**

```jsx
<AnimatePresence mode="wait" initial={false}>
  <motion.div key={activeIndex}
    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
    transition={{duration:.22, ease:[.4,0,.2,1]}}>
```

**Tab colour** — `transition-colors duration-300 ease-out` between `bg-transparent` and `bg-feature-timer-tab-surface`.

Accessibility is complete: `role=tablist/tab/tabpanel`, `aria-selected`, roving `tabIndex`, `aria-controls`/`aria-labelledby`, and `aria-pressed` + a changing `aria-label` ("Pause automatic rotation" / "Resume automatic rotation") on the control.

---

### 5.2 `heroSummitTypewriter` — HeroSummit tagline

```js
const p = animate && !useReducedMotion();
useEffect(() => {
  if (!p || total === 0) { setVisible(total); setItalic(hasItalic); setTyping(false); return; }
  setVisible(0); setItalic(false); setTyping(true);
  let t = 0;
  const iv = setInterval(() => {
    setVisible(t += 1);
    if (t >= total) { clearInterval(iv);
                      if (hasItalic) to = setTimeout(() => setItalic(true), 450); }
  }, 70);
  return () => { clearInterval(iv); to && clearTimeout(to) };
}, [p, total, hasItalic]);
```

| Beat | Timing |
|---|---|
| Character reveal | one every **70 ms** |
| Per-character fade | `transition-opacity duration-100 ease-out`, `opacity-0` → `opacity-100` |
| Italic flip | **450 ms** after the last character — all `em` characters swap `not-italic` → `italic` in one step |

Text is split into words (`inline-block whitespace-pre`) so nothing breaks mid-word, and an `sr-only` copy of the full string is rendered for screen readers alongside the `aria-hidden` animated version.

**The caret**

```jsx
<motion.span aria-hidden
  className="absolute top-[0.254em] left-full ml-[0.06em] h-[0.721em] w-[0.05em] bg-current"
  animate={{opacity:[1,1,0,0]}}
  transition={{duration:1.06, times:[0,.5,.5,1], repeat:Infinity, ease:"linear"}} />
```

The duplicated `0.5` stop in `times` makes the transition instantaneous — a hard square-wave blink at ~0.94 Hz, not a fade. Dimensions are all in `em` so the caret scales with the type.

Under reduced motion: all characters render immediately, italics apply immediately, no caret.

---

### 5.3 `logosTickerMarquee` — LogosTicker

`react-fast-marquee` with:

```js
{ autoFill: true, gradient: cms.show, gradientWidth: cms.width, gradientColor: cms.color,
  pauseOnHover: true, speed: 35 }
```

`speed` is **px per second**. The library computes:

```js
duration = autoFill ? (marqueeWidth * repeatCount) / speed
                    : (marqueeWidth < containerWidth ? containerWidth : marqueeWidth) / speed
```

```css
@keyframes scroll { 0% { transform: translateX(0%) } 100% { transform: translateX(-100%) } }
.rfm-marquee { animation: scroll var(--duration) linear var(--delay) var(--iteration-count);
               animation-play-state: var(--play);
               animation-direction: var(--direction) }
.rfm-marquee-container:hover div { animation-play-state: var(--pause-on-hover) }  /* → paused */
```

**Static fallback.** A hidden measuring row is rendered first; if its `scrollWidth ≤ containerWidth + 1` the marquee is replaced by a plain centred flex row with **no animation at all**. A `ResizeObserver` watches both container and measuring row. This is the right way to do a logo ticker — it never scrolls three logos pointlessly.

Per logo: `opacity-[0.65]` → `hover:opacity-100` over **300 ms**. Hovering a linked logo also feeds its title into the Motion+ cursor tooltip.

---

## 6. Presence & layout patterns

### 6.1 `megaMenuOpen` — Header submenu

```jsx
<AnimatePresence>{open && (
  <motion.div className="absolute left-0 right-0 top-(--nav-height) z-(--z-header) w-full transform-gpu pt-[1rem]"
    style={{transformOrigin:"50% 0"}}
    initial={reduced ? {opacity:0} : {scale:.97, opacity:0}}
    animate={{scale:1, opacity:1}}
    exit={reduced ? {opacity:0} : {scale:.97, opacity:0}}
    transition={reduced ? {opacity:{duration:.1}}
                        : {opacity:{duration:.1,  ease:[.2,0,0,1]},
                           scale:  {duration:.28, ease:[.2,0,0,1]}}}>
```

**Opacity 0.1 s, scale 0.28 s.** Decoupling them is what makes it feel instant but not abrupt — the panel is visible almost immediately and *finishes* growing afterwards.

**Height morph between submenus** — when the user slides from one trigger to another without closing:

```js
el.style.transition = "none";
el.style.height = `${previousHeight}px`;
el.offsetHeight;                                  // force reflow
el.style.transition = "height 0.2s ease-in-out";
el.style.height = `${newHeight}px`;
// on transitionend: remove both inline properties, cache the measured height
```

Only runs when `|newHeight - previousHeight| > 0.5px` and reduced motion is off.

**Sibling dim** — while any submenu is open, every other nav item drops to `opacity-30` over 300 ms (`transition-opacity duration-300 ease-in-out`). **Chevron** — `rotate-180` over 200 ms.

---

### 6.2 `summitPricingTogglePill` — shared-layout animation

```jsx
{isActive && (
  <motion.span layoutId="summit-pricing-toggle-pill" aria-hidden
    className="absolute inset-0 rounded-[10rem] bg-background"
    transition={reduced ? {duration:0} : {type:"spring", stiffness:420, damping:34}} />
)}
```

The only `layoutId` in the marketing site. The pill element is rendered *inside the active item*, so framer-motion's projection moves it between the two positions. Item styling: `b2 h-[5.6rem] rounded-[10rem] px-24 md:px-[4.2rem] transition-colors duration-300`, `text-text-primary` when active and `text-cloud` when not.

---

### 6.3 `teamCardBioReveal`

```js
let h = {duration:.3, ease:[.4,0,.2,1]};
```

| Layer | Config |
|---|---|
| Scrim `pointer-events-none absolute inset-0 rounded-small` | `initial={false}` · `animate={{backgroundColor: open ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0)"}}` · `transition=h` |
| Bio `scrollbar-hidden min-h-0 flex-1 overflow-y-auto` | `initial={false}` · `animate={{opacity: +!!open}}` · `transition=h` · `pointer-events-none` while closed |

The toggle is the CSS-only `.expand-button` (plus → minus, `transform .3s ease-in-out`). `aria-expanded` + `aria-controls` + `useId`.

---

### 6.4 `quoteCardsCarouselFocus` — no framer-motion at all

Pure CSS custom properties written from an Embla `scroll` handler.

```js
const onScroll = () => {
  const viewportCenter = root.getBoundingClientRect().left + root.clientWidth / 2;
  cards.forEach(card => {
    const r = (card.parentElement ?? card).getBoundingClientRect();
    const t = r.width > 0 ? (r.left + r.width/2 - viewportCenter) / r.width : 0;
    card.style.setProperty("--card-t",      Math.min(1, Math.abs(t)).toFixed(4));
    card.style.setProperty("--card-origin", t < 0 ? "100%" : "0%");
  });
};
```

```css
.TestimonialsQuoteCards_card {
  --card-t: 1;  --card-min-scale: 1;
  scale: calc(1 - (1 - var(--card-min-scale)) * var(--card-t));
  transform-origin: var(--card-origin, 50%) center;
}
@media (min-width: 768px) { .TestimonialsQuoteCards_card { --card-min-scale: .7399 } }
.TestimonialsQuoteCards_featureLayer { opacity: calc(1 - var(--card-t)) }
```

**No `transition` is declared** — the value tracks the drag frame-for-frame, which is exactly right for a direct-manipulation gesture. Off-centre cards shrink to **73.99 %** anchored on their *inner* edge (`--card-origin` flips 100%/0% by side), so they hinge toward the centre card. Simultaneously each card's pastel aurora layer fades to zero — only the centred card is lit.

Embla options: `align:'center'`, `containScroll:false`, `startIndex: floor((n-1)/2)`, `slidesToScroll:1`; `perView` 1.15 / 1.15 / **1.6784**, gaps 20 / 20 / 60 px. Progress bar value is `clamp(scrollProgress * 100, 33, 100)` — it never reads empty.

Server-rendered initial state matches: each card gets inline `--card-t: +(i !== centerIndex)` and `--card-origin` set to `50%`/`100%`/`0%` by position, so there is no flash before Embla's first scroll event.

---

### 6.5 `customCursor` — Motion+ Cursor

| | |
|---|---|
| Default transition | `{ duration: .15, ease: [.38,.12,.29,1] }` |
| Follow spring | `{ stiffness: 1000, damping: 100 }` |
| Magnetic | `{ morph: true, padding: 5, snap: 0.8 }`, snap spring `{ stiffness: 600, damping: 50 }` |
| Variants | `default {opacity:1, scale:1}` · `pressed {scale:.9}` · `exit {opacity:0, scale:0}` |
| `animate` array | `["default", state.type, magnetic && targetBox ? "magnetic" : "", visible ? (pressed ? "pressed" : "") : "exit"]` |
| Sizes | default `17×17` · pointer `31×31` (or `targetRect + 2×5px` when magnetic+morph) · text `4 × computed font-size` (fallback `4×20`) |
| Style | `borderRadius: 20px` (0 in follow mode) · `zIndex: 99999` (99998 follow) · `position: fixed` · `pointerEvents: none` · `willChange: transform` · `contain: layout` |
| Transform template | `translate(-{center.x*100}%, -{center.y*100}%) ${generated}` |

The root is a `<motion.div layout>` inside a `LayoutGroup`, so changing cursor type **layout-animates the size**. Zone resolution: `[data-cursor]` → `a, button, input[type=button]` (*pointer*) → `p, textarea, input[type=text], h1..h6` (*text*) → *default*, with `[data-cursor-zone]` read separately.

Used on this site only for: the carousel "Drag" label and per-logo link titles in the ticker.

---

## 7. CSS-side motion

### 7.1 All `@keyframes` in the system

```css
@keyframes faqAccordionDown { 0% { height: 0 }
                              to { height: var(--radix-accordion-content-height) } }

@keyframes faqAccordionUp   { 0% { height: var(--radix-accordion-content-height) }
                              to { height: 0 } }

@keyframes spin  { to { transform: rotate(1turn) } }
@keyframes pulse { 50% { opacity: .5 } }

/* injected at runtime by react-fast-marquee */
@keyframes scroll { 0%   { transform: translateX(0%) }
                    100% { transform: translateX(-100%) } }
```

```css
.faq-content[data-state=open]   { animation: faqAccordionDown .3s ease-in-out }
.faq-content[data-state=closed] { animation: faqAccordionUp   .3s ease-in-out }
@media (prefers-reduced-motion:reduce) {
  .faq-content[data-state=open], .faq-content[data-state=closed] { animation: none }
}
```

`--animate-spin: spin 1s linear infinite` and `--animate-pulse: pulse 2s cubic-bezier(.4,0,.6,1) infinite` are Tailwind defaults used for loading/skeleton states.

**Five keyframe sets total** on a site of this scale. Almost all motion is transitions and JS.

### 7.2 Transitions by component

| Component | Declaration | Trigger → change |
|---|---|---|
| Button (filled) | `transition-all duration-300 ease-in-out` | hover → fill steps to `-active`, `transform-gpu scale(1) → scale(1.0375)` |
| Button icon track | `transition-transform duration-500 ease-in-out` | hover → `translateX(0) → -50%` |
| Tertiary icon chip | `transition-colors duration-300 ease-in-out` | group hover → `lemon-button → lemon-button-active` |
| Header CTA pills | `transition-colors transition-background duration-300` | hover |
| Header nav links | `transition-opacity duration-300 ease-in-out` | any submenu open → siblings `opacity-30` |
| Header chevron | `transition-transform duration-200` | open → `rotate-180` |
| Mobile burger bars | `transition-transform duration-200` | `group-data-active` → `rotate ±45deg`, `-translate-y-1/2` |
| Mega-menu panel | `height 0.2s ease-in-out` (imperative) | submenu switch → height morph |
| Mega-menu CTA image | `transition-transform duration-500 ease-in-out will-change-transform` | hover → `scale-[1.06]` |
| Card / media | `transition-transform duration-500 will-change-transform` | hover → `scale-[1.02]` / `[1.03]` / `[1.06]` |
| `.expand-button::after` | `transition: transform .3s ease-in-out` | `aria-expanded` → `rotate(90deg) → rotate(180deg)` |
| FAQ chevron | `transition-transform duration-300 ease-in-out` | `data-state=open` → `-rotate-180` |
| FAQ toggle circle | `transition-colors duration-300` | group hover → `oatmeal-60 → oatmeal-80` |
| **Stats left rule** | `before:transition-[height] before:duration-1200 before:ease-out` | in-view → `before:h-0 → before:h-full` |
| Ticker logo | `transition-opacity duration-300` | hover → `0.65 → 1` |
| FeatureTimer tab | `transition-colors duration-300 ease-out` | active → `bg-feature-timer-tab-surface` |
| FeatureTabs rail label | `transition-opacity duration-500` | active → `0.45 → 1` |
| Video play plate | `transition-opacity duration-300 ease-in-out` | ready → visible |
| Rich-text link | `transition: text-decoration-color .2s` | hover → underline colour → transparent |
| Footer / dark link | `transition-opacity` (Tailwind 0.15 s) | hover → `opacity-70` |
| HubSpot submit | `transition: all .3s ease-in-out` | hover → `scale(1.0375)` |
| Disclosure rows | `transition-[grid-template-rows]` | the `0fr → 1fr` height trick |

Authored durations in use: **100 · 150 (Tailwind default) · 200 · 300 · 500 · 1000 · 1200 ms.**

### 7.3 Two global guards worth stealing

```css
html:not(.--loaded) * { transition: none !important }
```

`document.documentElement.classList.add('--loaded')` runs in a `useEffect` in the layout store initialiser. Nothing can transition before hydration, which kills the usual flash of animating theme and layout values on first paint.

```js
document.documentElement.style.setProperty(
  '--vp-height',
  `${window.visualViewport?.height ?? window.innerHeight}px`
);
```

Run on `resize` and `orientationchange`. Every `h-(--vp-height)` sticky stage tracks the *real* visual viewport, so mobile browser chrome appearing and disappearing doesn't break the pinned sections.

### 7.4 No CSS scroll-driven animations

There is **no** `scroll-timeline`, `animation-timeline`, `view-timeline` or `@scroll-timeline` anywhere. Every scroll linkage is JS.

---

## 8. Reduced motion

### CSS

```css
@media (prefers-reduced-motion:reduce) { html { scroll-behavior: auto } }
@media (prefers-reduced-motion:reduce) { .faq-content[data-state=open],
                                         .faq-content[data-state=closed] { animation: none } }
@media (prefers-reduced-motion:reduce) { .expand-button:after { transition: none } }
```

Plus Tailwind `motion-reduce:` variants on the button icon slide (`motion-reduce:transform-none motion-reduce:group-hover:translate-x-0`) and the video play plate (`motion-reduce:transition-none`).

### JavaScript

| Consumer | Handling |
|---|---|
| FoundersNote | `duration: .9 * !reduced` → 0; `delay` forced to 0; `initial` flips `"hidden"` → `"visible"` |
| HeroSummit typewriter | `animate && !reduced` — all characters and italics render immediately, no caret |
| SummitPricing pill | transition becomes `{duration: 0}` |
| Header mega-menu | bespoke `matchMedia('(prefers-reduced-motion: reduce)')` listener; opacity-only (`{opacity:{duration:.1}}`), no scale, height morph skipped |
| Motion+ Cursor | `{duration: 0}`; `cursor: none` is not injected |
| number-flow | `respectMotionPreference: true` in defaults |

### Gaps

**All seven scroll-linked patterns have no reduced-motion branch** — Hero scale, HeroFramed 3D lift, FeatureScroll parallax, FeatureStages, ScrollStages, FeatureTabs and the Lottie scrub modes all track scroll regardless of the preference. If you replicate this system, add one.

---

## 9. Pattern → block map

| Block / component | Trigger | What animates | Timing |
|---|---|---|---|
| **Hero** | scroll `['start start','end 25%']` | frame `scale 1→0.9`, media `scale 1→1.111` | raw, no easing |
| **HeroFramed** | scroll (rAF rect) | `rotateX 17.6→0`, `y 22→0`, `opacity .92→1` | springs `{220,32,.35}` / `{200,28,.35}` |
| **HeroSummit** | mount | per-char reveal; italic flip; caret blink | 70 ms/char · +450 ms · 1.06 s loop |
| **FoundersNote** | `whileInView` `{once, amount:.25}` | photos `x ±20, y 48, scale .96→1, rotate 0→∓3/6°`; chips `y 8→0` | 0.9 s / 0.5 s expoOut, 0.12 s stagger |
| **Headline / Highlight** | `useInView {once, amount:'some'}` | `backgroundSize 0%→100%`; floating card opacity | 1.25 s @ 0.5 s delay; 0.35 s @ 1.75 s |
| **LogosTicker** | always | CSS `translateX(0 → -100%)` | `width/35` s linear, infinite, pause on hover |
| **Stats** | `useInView {threshold:.2, once}` | number `0→n`; left rule `h-0→h-full` | 900 ms `linear()`; 1200 ms ease-out |
| **TestimonialsQuoteCards** | Embla `scroll` | `scale 1→0.7399` (md), aurora `opacity 1→0` | none — frame-locked to drag |
| **Team** | click | scrim `rgba(0,0,0,0)→0.8`; bio `opacity 0→1` | 0.3 s standard |
| **FeatureScroll** | scroll `['start end','end start']`, md+ | media `y 0→130`, copy `y 20→-110` | raw |
| **FeatureStages** | 2× scroll ranges, lg+ | copy + media opacity crossfade; overlay `y` centering | 0.95 s @ .2 s expoOut / 0.55 s quintOut |
| **FeatureTabs** | scroll (rAF rect) | media `scale .8→1`, copy `opacity 0→1`, rail marker `y` | springs `{220,32,.35}` / `{200,28,.35}` / `{320,34,.45}` |
| **FeatureTimer** | 6 s timer + in-view (IO 0.2) | tab fill `width 0→100%`; panel crossfade | 6000 ms linear; 0.22 s standard |
| **ScrollStages** | `scrollY` change | per-step opacity by midline proximity; marker `y`; pill swap | continuous; 0.22 s / 0.09 s |
| **SummitPricing** | tab change | shared-layout pill | spring `{420, 34}` |
| **FAQ** | Radix state | `height 0 ↔ content-height`; chevron `rotate-180` | 0.3 s ease-in-out |
| **Header** | hover | panel `scale .97→1` + `opacity`; height morph; sibling dim | 0.28 s / 0.1 s emphasizedDecel; 0.2 s; 0.3 s |
| **Footer wordmark** | `useInView {threshold:.5, once}` | `clipPath inset(0 0 100% 0) → inset(0)` | **2 s @ 0.25 s** quintOut |
| **Buttons** | hover | `scale 1→1.0375`; icon `translateX -50%`; fill colour | 0.3 s / 0.5 s ease-in-out |
| **Lottie** | in-view / midline / scrub | forward · reverse · frame-scrubbed | native Lottie frame rate |
| **Video** | in-view (IO, threshold 0.1) | play / pause | — |

---

## 10. Statistics

| | |
|---|---|
| Distinct animation patterns extracted | **21** |
| Distinct easing constants | **5** |
| Distinct spring configurations | **7** |
| CSS `@keyframes` sets | **5** |
| Scroll-linked patterns | **7** |
| In-view triggered patterns | **6** |
| Hover patterns | **6** |
| Timer / loop patterns | **3** |
| Distinct CSS transition groups | **22** |

---

## 11. How to replicate the feel

### The five rules

1. **Two easing curves for 90 % of everything.** `cubic-bezier(.16,1,.3,1)` for entrances, `cubic-bezier(.4,0,.2,1)` for UI state. Add `cubic-bezier(.22,1,.36,1)` only for long crossfades and reveals. Define them once as constants and import them — the site literally does `let d=[.16,1,.3,1]` at module scope.

2. **Mind the gap.** Entrances are slow (0.9–2 s), state changes are fast (0.09–0.30 s), and there is **nothing** in the 0.4–0.8 s band except hover transforms at exactly 0.5 s. Most sites live entirely in that missing band, which is why they feel generic.

3. **Never apply raw scroll to something the eye tracks.** Bound the range, then put a slightly over-damped spring between scroll and the transform (`stiffness 200–320, damping 28–34, mass 0.35–0.45`). Raw scroll is fine for parallax offsets and pin translations, where the eye is following the page rather than the element.

4. **Hover scale 1.02–1.06; buttons 1.0375.** The motion lives in colour and in the icon slide, not in size. A 3.75 % lift reads as the surface pressing toward you.

5. **One follow-through per reveal, never two.** Highlight sweep → card at 1.75 s. Stat number → rule at 1200 ms. Typewriter → italic flip at 450 ms. Photos → labels at 0.45 s. Each big moment gets exactly one companion beat on a delay, and the delay is always computed from the first beat's end, not guessed.

### Minimal stack

`framer-motion` + `react-intersection-observer` covers everything except the marquee (`react-fast-marquee`), the carousel (`embla-carousel-react`) and the counters (`number-flow`). **No GSAP, no smooth-scroll library.** Native `scroll-behavior: smooth` and `window.scrollTo({behavior:'smooth'})` do the job, and the sticky/pin effects are plain CSS `position: sticky` inside tall spacer elements.

### Three structural habits

- **Pin with spacers, not with `transform`.** FeatureStages and ScrollStages both build a tall scroll region out of ordinary `h-[150vh]` divs and lay a `position: sticky` overlay on top. No scroll-jacking, no layout thrash, and it degrades to a plain stacked list at small sizes by simply not applying the overlay.
- **Batch your scroll listeners.** The Lottie module runs one `passive` `scroll` listener and one `resize` listener for the whole page, each collapsed to a single `requestAnimationFrame` and fanned out to subscribers.
- **Guard hydration and the viewport.** `html:not(.--loaded) * { transition: none !important }` and a runtime `--vp-height` from `visualViewport`. Two small things that remove two whole categories of jank.

---

## 12. What could not be determined without a headed run

- **Actual pixel scroll ranges.** `useScroll` `offset` strings (`['start end','end start']` etc.) resolve against element heights measured at runtime.
- **The Bento block's motion.** Its component lives in a lazy chunk that returns 404 at the path the webpack manifest advertises. Only its two webp assets and its padding tokens are recoverable.
- **Whether a global `MotionConfig` / app-level `reducedMotion` is set.** The import exists in the library chunk but no call site appears in any served chunk.
- **Exact library versions** for motion, embla, react-fast-marquee, react-intersection-observer, number-flow, motion-plus and Radix — none of them emit a version string into the production bundle. Only `@lottiefiles/dotlottie-web` does (`0.63.0`), and React (`19.2.0-canary-0bdb9206-20250818`).
- **Runtime-computed values** such as the marquee's `--duration` (depends on the measured logo-row width) and the ScrollStages rail height.
- **Whether Wistia's player adds further animation** — only the wrapper options are visible in the bundle.
- **Perceived timing of the 53 lazy chunks** that 404; a headed run would reveal whether they are dead manifest entries or served under a different prefix.
