# exacare.com — copy & communication analysis

A working guide for mimicking the *mechanics* of exacare.com's copy with your own words.
Every quoted line is evidence from the live site (captured 2026‑09‑13, 40 pages). Every
pattern is restated as a fill‑in template. **Nothing here is meant to be copied verbatim —
the templates are the deliverable, the quotes are the proof.**

**Corpus.** 13 "core" marketing pages (`/`, `/platform`, `/admissions`, `/reimbursement`,
`/skilled-nursing-software`, `/skilled-nursing`, `/home-health`, `/hospice`, `/about-us`,
`/summit-2027`, `/careers`, `/contact`, `/resources/customer-stories`) = **6,618 words**,
plus 5 long‑form customer stories (~189 paragraphs) analysed separately. Blog/news used
only to confirm tone.

**How numbers in this doc were produced.** Word counts, verb counts, punctuation counts and
casing tests were computed over `copy.json` (every text node, tagged by block + role) and
the decoded RSC payloads in `rsc/` — not estimated. Where a block only renders step 1
server‑side (`ScrollStages`, `FeatureTimer`, `Faq`), the remaining steps/answers were
recovered from the RSC payload and are included below.

---

## 1. Voice and tone rules

### 1.1 Person

| Pronoun | Core marketing pages | Hero + feature bodies only | Inside customer quotes |
|---|---|---|---|
| we / our / us | 46 / 28 / 8 | 23 / 6 / 0 | 71 / 44 / 11 |
| you / your | 27 / 36 | 12 / 20 | 5 / 0 |
| they / their | 12 / 3 | 1 / 0 | 8 / 2 |
| I / my / me | 5 / 1 / 0 | 0 | 24 / 4 / 3 |

Three rules fall out of this:

1. **"Your teams" is the default subject of a benefit.** Not "users", not "customers", not
   "you". 68 uses of *teams* vs 8 of *customer* and 0 of *user* on the core pages.
   > "…so **your teams** can move faster with confidence."
   > "Give **teams** time back for care."
2. **"We" appears only where a human has to be on the hook** — mechanism claims, beliefs,
   and the founder voice. It never appears in a benefit sentence.
   > "More than intelligence, **we** help you take action" · "How **we're** different from
   > other skilled nursing software" · "Things **we** believe" · "Built for a problem **we** saw up close"
3. **"I" is reserved for quotes.** 24 first‑person singulars, all inside customer
   testimonials. The brand never speaks as an individual except in the signed founders' note.

**Template.** Benefit sentences: `so your [role-plural] can [verb] [outcome]`.
Mechanism/claim sentences: `we [verb] [what we do differently]`. Never mix them in one sentence.

### 1.2 Register

Plain operational English at roughly an 8th‑grade reading level, with domain nouns left
untranslated. Contractions are used freely (**61** on the core pages: *we're, you'll, don't,
haven't, can't, what's*), which is what keeps it from reading corporate. Industry
vocabulary is never softened or explained — *PDPM, PCC, MatrixCare, eFax, concurrent
reviews, carve‑outs, L2+, census, referral packet, prior authorization, SNF days* all appear
unglossed. The premium feel comes from **confidence plus restraint**, not from vocabulary.

> "Analyze managed care contracts, justify higher acuity levels, and identify reimbursement
> opportunities before claims are submitted."

**Template.** Write for the practitioner, not their boss's boss. Use the exact nouns the
buyer uses in a stand‑up meeting; spend your simplicity budget on the *verbs* and *sentence
shapes* instead.

### 1.3 Sentence length distribution (computed)

| Element | n | mean words | median | range | typical band (p25–p75) |
|---|---|---|---|---|---|
| H1 (hero headline) | 12 | **5.2** | 5 | 2–13 | 3–6 |
| H2 (section headline) | 64 | **4.6** | 4 | 1–24 | 3–5 |
| H3 (feature/card headline) | 61 | **5.6** | 5 | 1–16 | 3–7 |
| Eyebrow | 15 | **4.2** | 5 | 2–6 | 2–5 |
| Hero subhead | 15 | **18.0** | 19 | 4–42 | 7–22 |
| Feature body (1 card / 1 step) | 97 | **18.1** | 16 | 8–37 | 14–21 |
| Bullet (Compare / List) | 69 | **9.2** | 8 | 4–34 | 6–10 |
| CTA label | 91 | **2.8** | 3 | 1–5 | 2–3 |
| Testimonial quote (marketing pages) | 15 | **29.1** | 28 | 19–41 | 24–35 |
| Testimonial quote (story pages) | 59 | **32.1** | 32 | 10–57 | 21–43 |
| Story body paragraph | 189 | **37.7** | 37 | 1–106 | 23–51 |

**Sentences per feature body: mean 1.3, median 1, max 4.** Two‑thirds of feature bodies are
a *single sentence*. That is the single most distinctive quantitative fact about this copy.

Hero subhead length varies by hero variant, deliberately:

| Hero variant | subhead words | Used for |
|---|---|---|
| `HeroFramed` | 18–19 | Segment pages (skilled nursing / home health / hospice) |
| `Hero` | 19–22 | Home, platform, about |
| `HeroColumns` | 27 | Admissions (one dense product) |
| `HeroFullwidth` | 31–42 | Reimbursement, careers (most explanation needed) |
| `HeroSummit` | 4–9 | Event page (headline does the work) |

**Template.** Headline ≤ 6 words. Subhead 18–22 words, one sentence. Feature headline
3–7 words. Feature body **one sentence, 14–21 words** (two only when you truly need a
mechanism + a consequence). CTA 2–3 words.

### 1.4 Verb choices

**Verbs in headings** (H1+H2+H3 across the 12 core pages, 130 headings):

| verb | n | verb | n | verb | n |
|---|---|---|---|---|---|
| move / moving | 8 / 2 | secure | 3 | admit | 2 |
| help | 3 | make / makes | 3 / 3 | see | 2 |
| support | 3 | take | 2 | join | 2 |

plus one each: *connects, applies, drives, accelerate, coordinate, starts, standardize,
reduce, give, respond, smooth, improve, address, learn, stay, save, register, build*.

**Verbs that open a feature label** (58 unique labels): *Analyze* ×2, *Review* ×2,
*Connect, Track, Say, Admit, Identify, Grow, Centralize, Verify, Push, Extract, Estimate,
Maximize, Stay, Move, Standardize, Reduce, Give, Respond, Smooth, Improve, Address,
Accelerate, Coordinate, Support, Raise, Bring* — all bare imperatives in base form.

**Verbs in CTAs** (35 linked CTAs): **Book ×15, Learn ×9, View ×5, Explore ×3, See ×2, Save ×1.**
Six verbs total, across the whole site.

The verb set is deliberately small and physical: things you *do to work* (review, analyze,
verify, centralize, push, track, extract) and things that *happen to a number* (grow,
reduce, improve, maximize, standardize). There are **no abstract verbs of enablement**
(no *empower, enable, unlock, transform, revolutionize, streamline* in the brand's own
voice — see 1.6).

**Template.** Build a fixed verb kit of ~20 operational verbs before you write a page, and
never leave it. Reserve *your* strongest verb for the CTA and use the same CTA verb
site‑wide.

### 1.5 Punctuation habits (verified counts, core pages)

| Mark | Count | How it is used |
|---|---|---|
| `!` | **0** | Zero exclamation marks in the brand's own prose. The only `!` anywhere in the corpus is inside a customer quote ("My 'aha!' moment…"). |
| `?` | 15 | **All 15 are FAQ questions.** No rhetorical questions in headlines or body. |
| `—` (em dash) | 13 | Only to attach a consequence to a list: "…all in minutes." / "one inbox, one workflow" |
| `–` (en dash) | 4 | Only inside pulled quotes, as the customer wrote it |
| `;` | 2 | Effectively unused |
| `:` | 6 | Only in the founders' note and the story sub‑heads |
| `…` | 1 | One elided quote |

**Periods on headlines — the rule is mechanical:**

| Level | ends with `.` |
|---|---|
| H1 | **0 / 12** |
| H2 | **7 / 64** |
| H3 | **0 / 61** |
| Eyebrow | 0 / 15 |
| CTA | 0 / 91 |
| Feature label | 1 / 97 |
| Feature body | **95 / 97** |

The 7 H2s that carry periods are *exactly* the multi‑fragment headlines:

> "Deeper context. Faster workflows. Better decisions." · "Faster decisions. Stronger
> performance." · "Faster admits. Fewer suprises." · "Support the right acuity. Secure the
> right reimbursement."

**Rule:** a headline takes terminal punctuation **only when it is two or three parallel
fragments**. One clause = no period, ever. (Note "suprises" — a live typo on `/admissions`.
Even the best‑made sites ship them; proofread yours.)

### 1.6 Banned‑feeling patterns (each verified by search)

| Pattern | Evidence |
|---|---|
| Exclamation marks | 0 in brand voice |
| Rhetorical questions | 0 outside FAQ blocks |
| Title Case headlines | 0 / 12 H1, 0 / 64 H2, 0 / 15 eyebrows. Sentence case everywhere. |
| "solution" as a product word | 44 hits — **every single one** is the customer name *Creative Solutions in Healthcare*, an advisor's job title, or a quote ("a solutions provider"). Never the product. |
| *transform / unlock / empower / best-in-class / world-class / innovate* | Present **only** inside customer quotes and third‑party bios. Zero in the brand's own descriptive prose. |
| *leverage, synergy, seamless, robust, turnkey, holistic, frictionless, cutting-edge, revolutionary, game-changing, next-generation, state-of-the-art, ecosystem, paradigm, disrupt, delight, supercharge, 10x* | **0 occurrences anywhere in the corpus.** |
| "Artificial intelligence" spelled out | 0. Always "AI" (52×). |
| Vague attribution ("a large SNF operator") | 0. Every quote has a full name, title and company. |
| Unsupported superlatives | Superlatives are rationed — *most* 4, *best* 8, *leading* 6, *only* 3 — and each one is anchored to a checkable axis: "The **most** connected platform in admissions"; "more referral platforms, hospital systems, and EHRs than **any** platform on the market." |
| Emoji | 0 |

**Template.** Before publishing, run a kill‑list search over your draft. If a hype word
survives, it must be inside a quotation mark with a person's name attached.

### 1.7 How numbers are written

Always numerals. Always the compact unit. Always rounded to two significant figures.

`7 min` · `8 min` · `34 hrs` · `15%` · `40%+` · `99%` · `$380K+` · `$900K` · `3.4M` ·
`2.6x` · `2,000+` · `300+` · `150+` · `9.8+` · `under 60 seconds` · `in minutes, not hours`

Conventions actually observed:
- **`+` means "at least"** and is doing persuasion work: `2,000+`, `$380K+`, `40%+`, `300+`.
- **`~` only appears inside quotes** (`~$900K`, `~2,000`) — the brand itself never hedges a
  number it puts in its own voice.
- **A raw duration beats a percentage** when the duration is small: "7 min referral response
  time" rather than "83% faster".
- **Spelled‑out numbers appear only in running prose**, never in a stat:
  "…in less than **five** minutes" (body) vs "**7 min**" (stat).
- **No footnotes, no sources, no "up to"** anywhere on the marketing pages.

**Template.** `[numeral][compact unit][+ if it's a floor]` + `[2–9 word lowercase noun
phrase]`. Example shape: `34 hrs / saved for care staff each week`.

### 1.8 How the customer is named

| Word | Core pages | What it denotes |
|---|---|---|
| teams / team | 68 / 20 | **the reader** — the default subject |
| facility / facilities | 20 / 13 | the unit of operation |
| building / buildings | 12 / 8 | the same unit, in operator slang |
| branch / branches | 4 / 5 | the same unit, home‑health/hospice slang |
| staff | 14 | the people whose time you give back |
| operators / operator | 11 / 1 | **the buyer archetype** |
| leaders / leader | 7 / 2 | the economic buyer |
| patient / patients | 13 / 8 | the person downstream |
| resident / residents | 1 / 1 | rare; only in EHR/bed‑board contexts |
| hospital / hospitals | 7 / 7 | the counterparty you must respond to |

Note the register‑matching: the segment pages swap the unit noun to match how that segment
talks. `/skilled-nursing` says **"across buildings"**; `/home-health` and `/hospice` say
**"across branches"** — same sentence, one word changed.

> skilled nursing: "Decisions vary by staff member and **building**"
> home health: "Visibility into performance varies by **branch**"

**Template.** Pick one reader noun (`your [teams]`), one unit noun that changes per segment
(`[buildings] / [branches] / [regions]`), one buyer noun (`[operators]`), and one downstream
noun (`[patients]`). Use them consistently; swap only the unit noun between segment pages.

### 1.9 How the product is named

- **Always lowercase `exacare ai`** — 175 occurrences, **0** capitalised variants. The
  lowercase is the wordmark, and it's preserved mid‑sentence.
- It is used as a **grammatical subject that acts**: "exacare ai reads full referral packets…",
  "exacare ai pulls referrals from hospital portals…", "exacare ai consolidates referrals…".
  This is the core rhetorical move — the product is an actor, not a container.
- Secondary names: **"the platform"** (18×), **"our platform"** (1×), **"AI"** (52×, as a
  modifier: *contextual AI, AI-powered, AI agents, AI analysis*). Capability names are
  capitalised only as UI labels: *Admissions, Insurance verification, Prior authorization,
  Bed board, Data center, eSign, Concurrent reviews*.
- On the SEO page the product name is deliberately replaced by the **category** phrase:
  "the leading skilled nursing admissions software", "skilled nursing AI software". Same
  sentences, keyword‑loaded nouns.

**Template.** `[product name] [transitive verb] [the object the buyer struggles with]`.
If your product name can't take a transitive verb in a sentence, your positioning is a
category, not a product.

### 1.10 The italic serif word — complete inventory and rule

The site sets exactly one word (or one short phrase) of some headlines in an italic serif
face. Here is **every occurrence across the marketing pages**, recovered from the rendered
HTML (`<em class="italic">`) and confirmed against the Sanity portable‑text `marks:["em"]`
in the RSC payload:

| # | Page(s) | Line (italic marked with *…*) | Block | Category |
|---|---|---|---|---|
| 1 | `/` | "Our platform ***connects*** the systems post-acute care teams rely on…" | Headline | **mechanism verb** |
| 2 | `/platform` | "More than intelligence, we help you take ***action***" | FeatureStages | **payoff noun** |
| 3 | `/`, `/platform`, `/admissions`, `/reimbursement` | "Across the care ***journey***" | FeatureTabs | **scope noun** |
| 4 | `/`, `/platform` | "Move care ***forward***" | CtaBackground | **direction noun** |
| 5 | `/admissions` | "Move admissions ***forward***" | CtaBackground | direction noun |
| 6 | `/reimbursement` | "Move reimbursement ***forward***" | CtaBackground | direction noun |
| 7 | `/skilled-nursing` | "Move skilled nursing ***forward***" | CtaBackground | direction noun |
| 8 | `/home-health` | "Move home health ***forward***" | CtaBackground | direction noun |
| 9 | `/hospice` | "Move hospice ***forward***" | CtaBackground | direction noun |
| 10 | `/skilled-nursing-software` | "See why we're the ***leading*** skilled nursing software" | CtaBackground | **claim qualifier** |
| 11 | `/summit-2027` | "The ***real*** agentic standard" | HeroSummit | claim qualifier |
| 12 | `/summit-2027` | "Now it can ***do*** the work" | FoundersNote ¶2 | mechanism verb |
| 13 | `/summit-2027` | "…built this Summit around the ***real*** agentic standard" | FoundersNote ¶3 | claim qualifier |
| 14 | `/summit-2027` | "And we mean the ***standard*** part too" | FoundersNote ¶4 | claim qualifier |
| 15 | `/about-us` | "…named to the ***Forbes 30 Under 30*** list in 2025" | Team bio | **proper title** (conventional, not rhetorical) |

**The rule, stated precisely:**

1. **One italic per line. Never two.** (15/15.)
2. **Never the first word** of the line. (15/15 — the closest is word 2 in "The *real*…".)
3. **Never a product name, never a number, never a proper noun** — except the single
   conventional case of a publication title in a bio.
4. It is always **the word the sentence turns on** — remove it and the sentence keeps its
   grammar but loses its point. It lands on one of four things:
   - the **mechanism verb** (*connects*, *do*) — "here's what actually happens";
   - the **payoff or direction noun** (*action*, *forward*, *journey*) — "here's where you end up";
   - the **claim qualifier** (*real*, *leading*, *standard*) — "here's the word we're staking a claim on";
   - a **proper title** in prose (the Forbes case).
5. **Scarcity is the mechanism.** 15 italics against 130 headings on the core pages ≈ one
   italic per ~9 headings. The two places it is *guaranteed* to appear are the closing CTA
   headline on every page and the single manifesto/claim headline of the site.

**Template.**
```
Closing CTA on every page:   Move [your noun] ‹forward›        ← one repeated direction word
Manifesto headline (once):   [Product] ‹[mechanism verb]› [the thing your buyer juggles]
Claim headline (rarely):     The ‹real› [category standard]  /  the ‹leading› [category]
```
Pick **one** italic word per page. If you italicise two, both stop working.

---

## 2. Page architecture

Legend for the "job" column: **attention · problem · proof · mechanism · objection · CTA**.

### 2.1 `/` (home) — top of funnel

| # | Block | Copy carried | Job |
|---|---|---|---|
| 1 | `Hero` | eyebrow "Trusted by 2,000+ care teams" · H1 "The AI platform for post-acute care operations" · 22w subhead · `Book a demo` | **attention** + instant social proof before the claim |
| 2 | `Headline` | 24‑word manifesto H2 with italic *connects* · `Explore the platform` | **mechanism in one breath** — the thesis of the company |
| 3 | `Cta` (product cards) | 2 cards: "Admissions / Turn referrals into revenue" · "Reimbursement / Strengthen reimbursement from the start" | **route** — send the reader to the product that matches their pain |
| 4 | `Stats` | 7 min · 15% · 40% · $380K+ | **proof (numeric)** |
| 5 | `TestimonialsMediaCards` | H2 "Relief your teams can feel" + 3 named quotes | **proof (human)** — and the emotional promise |
| 6 | `FeatureScroll` | H2 "Deeper context. Faster workflows. Better decisions." + 4 differentiators | **objection: why not a keyword tool / an incumbent?** |
| 7 | `FeatureTabs` | H2 "Across the care *journey*" + 3 segment tabs → `Learn more` | **route** — segment self-selection |
| 8 | `CtaBackground` | eyebrow "Trusted by 2,000+ care teams" · H2 "Move care *forward*" · `Book a demo` | **CTA** |

### 2.2 `/platform` — the canonical product overview

| # | Block | Job |
|---|---|---|
| 1 | `Hero` | attention — category claim ("Intelligent infrastructure for post-acute care") |
| 2 | `Cta` (product cards, H2 "Skilled nursing products") | route to the two revenue products |
| 3 | `FeatureStages` | mechanism — H2 "More than intelligence, we help you take *action*" + 4 capability claims |
| 4 | `LogosTicker` | proof — H2 "The most connected platform in admissions" over 9 integration logos |
| 5 | `ScrollStages` (dark) | mechanism — "How it works" in 4 steps |
| 6 | `Testimonial` | proof — one named CEO quote + `View customer stories` |
| 7 | `FeatureTabs` | route — "Across the care *journey*" |
| 8 | `LogosGrid` | **objection: is it safe?** — "Fully compliant, fully secure" (HIPAA, SOC 2 Type II, encryption, tenant isolation) |
| 9 | `CtaBackground` | CTA |

Note the position of the security block: **second to last, after the reader already wants
it.** Compliance is treated as an objection, not a feature.

### 2.3 `/admissions` and `/reimbursement` — the product page skeleton

| # | `/admissions` | `/reimbursement` | Job |
|---|---|---|---|
| 1 | `HeroColumns` "From referral to decision in minutes" | `HeroFullwidth` "Reimbursement clarity starts at admission" | attention — a *time* or *timing* promise |
| 2 | `FeatureStages` "Faster admits. Fewer suprises." | `Bento` "Support the right acuity. Secure the right reimbursement." | problem→benefit reframe, 3–4 chunks |
| 3 | `Stats` (3) | `Stats` (3) | proof (numeric) |
| 4 | `ScrollStages` "How it works" (5 steps) | `ScrollStages` "How it works" (4 steps) | mechanism |
| 5 | `TestimonialsTextCards` (result‑headline + quote) | `TestimonialsMediaCards` (2 quotes) | proof (human) |
| 6 | `FeatureTabs` "Across the care *journey*" | `FeatureTabs` | route / objection ("does this fit my setting?") |
| 7 | `CtaBackground` "Move admissions *forward*" | `CtaBackground` "Move reimbursement *forward*" | CTA |

### 2.4 `/skilled-nursing`, `/home-health`, `/hospice` — the segment page skeleton

Byte‑for‑byte parallel. The only differences are the segment noun, the unit noun
(*buildings* → *branches*), and the capability list.

| # | Block | Copy | Job |
|---|---|---|---|
| 1 | `HeroFramed` | "Smarter [segment] operations" + 18–19w subhead + `Book a demo` | attention |
| 2 | `LogosTicker` | 16 named customer logos, no headline | **proof before argument** |
| 3 | `FeatureScroll` | "Faster decisions. Stronger performance." + 3–4 benefit headlines | benefit |
| 4 | `FeatureTimer` (dark) | "Core capabilities" + 4–7 auto-rotating capability tabs | mechanism / feature depth |
| 5 | `Compare` | "The difference exacare ai makes" — Before/After bullets **+ 3 stats appended** | **problem + proof in one block** |
| 6 | `Testimonial` (SNF) or `TextImage` (HH/hospice) | quote, or "Make fast, defensible admission decisions" → `Explore Admissions` | proof / cross-sell |
| 7 | `Cta` product cards (SNF only) | "Products for skilled nursing" | route |
| 8 | `CtaBackground` | "Move [segment] *forward*" | CTA |

### 2.5 `/skilled-nursing-software` — the SEO / demand-capture page (15 blocks)

`ContactForm` (hero **is** the form) → `Stats` → `ScrollStages` → `FeatureTimer` → `Bento`
→ `TestimonialsTextCards` → `Compare` → `FeatureTabs` (by **role**, not segment) → `Faq` →
`CtaBackground`.

Job differences from the product page: the form is **above the fold instead of a button**;
the keyword phrase is repeated in every headline ("skilled nursing" appears in 8 of its 9
H2s); and a **6‑question FAQ** carries every objection explicitly (speed, size fit,
integrations, security, implementation time, **price**). This is the only page on the site
that names an objection out loud.

### 2.6 `/about-us`, `/careers`, `/summit-2027`, `/contact`

| Page | Sequence | Macro-job |
|---|---|---|
| `/about-us` | `Hero` → `SideBySide` (origin story, 3 ¶) → `LogosTicker` (investors) → `Testimonial` (CEO) → `List` ("Things we believe", 4 tenets) → `Team` (2 founders + 9 advisors) → `CtaBackground` ("Join us") | **credibility of the people**, ending in recruiting |
| `/careers` | `HeroFullwidth` → `CardsGrid` (7 values) → `FeatureTabs` (life) → `Testimonial` (CEO) → `ItemsGrid` (4 offers) → `Cta` (locations) → `CtaBackground` → `Jobs` | values → proof → offer → roles |
| `/summit-2027` | `HeroSummit` → `TestimonialsQuoteCards` (5 attendee quotes **before any argument**) → `FoundersNote` → `Stats` → `CardsGradient` ("Why you should be there") → `IconCards` ("Who attends") → `SummitDetails` → `AgendaCards` → `SummitPricing` (+ 9‑question FAQ) | proof → manifesto → proof → reasons → qualification → logistics → price |
| `/contact` | `ContactForm` (H1 + 4 stat bullets + 1 quote) → `IconBlocks` (email, phone, address) | conversion with the proof re‑stated *beside the form* |

### 2.7 The recurring macro-structure

Across the six pages that sell the product, the spine is identical:

```
ATTENTION   Hero (+ eyebrow proof)
PROOF       LogosTicker  or  Stats          ← proof arrives within one scroll, before the argument
BENEFIT     FeatureScroll / FeatureStages / Bento   (3–4 chunks)
MECHANISM   ScrollStages "How it works"  /  FeatureTimer "Core capabilities"
PROBLEM     Compare  Before → After
PROOF       Testimonial(s) with named operators
OBJECTION   FeatureTabs (fit) · LogosGrid (security) · Faq (price, time, size)
CTA         CtaBackground  "Move [noun] forward"
```

**Roughly one block in three is a proof block** (computed: home 25%, platform 33%,
admissions 29%, reimbursement 29%, SNF‑software 30%, skilled‑nursing 38%, home‑health 29%,
hospice 29%). Every product/segment page ends on the same three‑word CTA headline shape.

### 2.8 Skeleton template A — **product page** (fill in)

```
1  HERO            H1 ≤6w: [time-or-timing promise]           CTA: Book a demo
                   Sub 18–27w: "[product] [verb]s [X], [verb]s [Y], and [verb]s [Z]
                                so [your teams] can [outcome]."
2  BENEFIT GRID    H2 (2 fragments + periods): "[Comparative]. [Comparative]."
                   4 × [3–5w label] + [1 sentence, 14–21w]
3  STATS           3–4 × [numeral+unit] / [2–9w lowercase label]
4  HOW IT WORKS    H2: "How it works"  ·  4–5 × [imperative step label] + [1 sentence]
5  TESTIMONIALS    1–2 × [result headline with a number] + [25–40w quote]
                                                       + [Name, Title at Company]
                   CTA: View customer stories
6  FIT / TABS      H2: "Across the [scope noun]"  ·  3 tabs × [1–2 sentences] + Learn more
7  CLOSING CTA     eyebrow "Trusted by [N]+ [reader plural]"
                   H2: "Move [page noun] forward"   CTA: Book a demo
```

### 2.9 Skeleton template B — **segment page** (fill in)

```
1  HERO            H1 3–4w: "Smarter [segment] operations"     CTA: Book a demo
                   Sub 18–19w: "Connect [A], [B], and [C] in one [adjective] workflow
                                so [segment] teams can [outcome] and [outcome]."
2  LOGOS           12–16 named customers · no headline · no caption
3  BENEFITS        H2: "[Comparative noun phrase]. [Comparative noun phrase]."
                   3–4 × [3–7w benefit headline] + [1 sentence, 14–27w]
4  CAPABILITIES    H2: "Core capabilities" · 4–7 tabs, each [1–2w label] + [17–23w sentence]
5  BEFORE / AFTER  H2: "The difference [product] makes"
                   5–6 Before bullets (5–16w) · 5–8 After bullets (mirrored, +2 extra)
                   3 stats appended inside the same block
6  CROSS-SELL      eyebrow "Products for [segment]" · H2 [5w] · 20w body · CTA Explore [Product]
7  CLOSING CTA     eyebrow "Trusted by [N]+ [segment] teams" · H2 "Move [segment] forward"
```

---

## 3. Block-level copy formulas

Word‑count bounds below are measured over the 12 core pages (`n` = number of text nodes).

### 3.1 Hero — 5 variants, one formula

**Eyebrow** (only on home + closing CTAs): `Trusted by [N]+ [reader plural]` — 5–6 words, no period.
**Headline:** 3–6 words (mean 5.2; max 13 on `/about-us`). Sentence case. No period. No product name.
**Subhead:** one sentence, 18–22 words on a standard hero. Always the same grammar:
`[product] [verb]s [object], [verb]s [object], and [verb]s [object] so [your teams] can [outcome].`
**CTA:** exactly one, always `Book a demo` → `/contact`. Heroes never carry two buttons.

Real examples:
> **The AI platform for post-acute care operations** — "exacare ai centralizes referrals,
> analyzes admissions packets, and handles reimbursement workflows so your teams can move
> faster with confidence." (home, 6w/22w)

> **From referral to decision in minutes** — "exacare ai reviews every referral against your
> criteria, verifies insurance, and surfaces clinical and financial risk so your team makes
> the right call in minutes, not hours." (`/admissions`, 6w/27w)

> **Smarter hospice operations** — "Connect intake, admissions, and eligibility in one
> AI-powered workflow so hospice teams can move faster and more confidently."
> (`/hospice`, 3w/18w)

Three headline shapes are in use, and only three:
1. **Category claim:** `[Adjective] [category noun] for [market]` — "Intelligent infrastructure for post-acute care"
2. **Transformation in time:** `From [input] to [decision] in [duration]` — "From referral to decision in minutes"
3. **Comparative state:** `Smarter [segment] operations` — repeated verbatim across all three segment pages

**Template**
```
H1:    [Adjective] [category] for [market]
   or  From [messy input] to [clean output] in [duration]
   or  Smarter [segment] [operations|workflows]
Sub:   [product] [verb]s [noun], [verb]s [noun], and [verb]s [noun]
       so [your teams] can [verb] [adverbially: faster / with confidence].
CTA:   [one verb + one object]           → the single conversion page
```

### 3.2 Stats — n=18 stat pairs, 3 or 4 per block

Position: always immediately after the hero or after the first benefit grid. Never at the bottom.
**Value:** 1 token. **Label:** 2–9 words (mean 4.2), lowercase, no period, noun phrase — never a sentence.

Four *kinds* of number appear, and they cover four different buying objections:

| Kind | Examples | The objection it answers |
|---|---|---|
| **Speed** (raw duration) | `7 min` referral response time · `8 min` prior authorization submission time | "we can't respond fast enough" |
| **Growth** (%) | `15%` increase in admissions · `40%+` of managed care days in L2+ | "will this move census?" |
| **Money** ($) | `$380K+` per facility reimbursement increase | "what's the return?" |
| **Scale / trust** | `3.4M` referrals processed since inception · `2,000+` care teams | "is this real at my size?" |
| **Time returned** | `34 hrs` saved for care staff each week | "will my staff feel it?" |

Note the segment pages all reuse the **same three** (`7 min / 15% / 34 hrs`), and the SEO
page adds a scale number (`3.4M`). Stats are never sourced or footnoted.

Labels observed: *referral response time · increase in admissions · of managed care days in
L2+ · per facility reimbursement increase · saved for care staff each week · referrals
processed since inception · referral response time across the top 10% of SNFs*.

**Template**
```
[numeral][compact unit][+]     [2–9 word lowercase noun phrase, no period]
Pick one of each: speed · growth · money · scale.  Never more than 4.
```

### 3.3 FeatureScroll / FeatureStages / Bento — the benefit grid (n=97 label+body pairs)

Universal chunking: **[3–5 word label] + [one sentence, 14–21 words].**
Labels: mean 3.9 words, range 1–7, no period (1/97 exception). Bodies: mean 18.1 words,
median 1 sentence, 95/97 end in a period.

Two label grammars, used consistently:

| Grammar | When | Examples |
|---|---|---|
| **Bare imperative verb phrase** (reader is the actor) | benefit grids on product & segment pages | "Say yes, faster" · "Admit right-fit patients" · "Identify risk early" · "Grow your census" · "Reduce preventable denials" · "Give teams time back for care" |
| **Noun phrase** (product is the actor) | differentiator grids | "Context beyond keywords" · "Deeper integrations" · "Real-time dedicated support" · "Trained on your organization" · "Purpose-built for post-acute care" |

The body always does one of two jobs, never both loosely: **(a) name the mechanism**, or
**(b) name the consequence** — and when it does both it uses "so" or a comma splice of
parallel verbs.

> "Analyze documentation beyond keyword match, applying facility-specific criteria
> automatically to determine clinical and financial fit." (mechanism, 19w)
> "Improve admission conversion and protect reimbursement through consistent, defensible
> decisions." (consequence, 12w)
> "exacare ai consolidates referrals from every source into a single intake view — so
> nothing slips through and no one is toggling between portals to stay current." (both, 27w)

**Section headline above the grid** — 4–8 words, and this is where the parallel‑fragment
pattern lives:
> "Faster decisions. Stronger performance." · "Deeper context. Faster workflows. Better
> decisions." · "Faster admits. Fewer suprises." · "Support the right acuity. Secure the
> right reimbursement."

**Template**
```
H2:    [Comparative adj] [noun]. [Comparative adj] [noun].          (2–3 fragments, periods)
Label: [Imperative verb] [object][, adverb]                          3–5 words, no period
Body:  [One sentence, 14–21 words] naming either the mechanism OR the consequence.
```

### 3.4 ScrollStages — "How it works" (n=34 step nodes; steps 2–n recovered from RSC)

Always titled **"How it works"** (3 words) — except on the SEO page, where the keyword is
inserted: "How our admissions software works". Eyebrow is a literal `Step 1`…`Step n`.
4–5 steps. Each step: **[imperative label, 2–6 words] + [one sentence, 10–30 words]**.

Full step sets (recovered from the RSC payloads — only step 1 renders server‑side):

**`/platform` (4 steps)**
1. *Connect your systems* — "Integrate referral portals, EHRs like PCC or MatrixCare, and eFax into one operational hub."
2. *Analyze referrals with AI* — "Context-aware AI reads full referral packets, flags clinical risks, and estimates reimbursement — all in minutes."
3. *Review insights and respond* — "Teams review AI insights, collaborate internally, and respond to hospitals faster and with better information."
4. *Track performance and manage census* — "Monitor census, assign beds, and track performance across facilities with real-time dashboards."

**`/admissions` (5 steps)** — *Centralize referrals · Analyze referral packets in minutes ·
Verify insurance and safety checks · Review and decide · Push data to your EHR*

**`/reimbursement` (4 steps)** — *Extract clinical and insurance details · Estimate
reimbursements early · Maximize what you're owed · Stay ahead of every concurrent review*

**`/skilled-nursing-software` (4 steps)** — same as `/platform` with the keyword swapped
into step 1 ("…into one skilled nursing admissions workflow").

The step sequence is always the **same four verbs of a workflow**: *ingest → analyse →
decide → measure*. That is the argument: you are not buying an analysis, you are buying a loop.

**Template**
```
H2:      How it works                                     (or: How our [keyword] works)
Eyebrow: Step 1 / Step 2 / …
Step:    [Imperative verb] [object]                       2–6 words
         [One sentence, 10–30 words] naming what happens and to what.
Order:   ingest → analyse → decide → measure.  4–5 steps, never more.
```

### 3.5 FeatureTabs — the "fit" block (n=26 tab labels, 34 bodies)

Two uses, same shape:
- **By care setting** — H2 "Across the care *journey*", tabs `For Skilled Nursing` /
  `For Home Health` / `For Hospice`, each with 1–2 sentences and a `Learn more` link.
- **By role** (SEO page) — H2 "Skilled nursing software for your entire care team", tabs
  `For Admissions Teams` / `For DONs & Clinical Teams` / `For Operations Leaders` /
  `For Managed Care Teams`, 1 sentence each, **no link**.

Tab labels are the only **Title Case** text on the site, and always begin with `For `.
Tab body writes to the *constraint* of that audience first, then the promise:

> "Move at the speed hospitals expect. Admissions teams can review full referral packets in
> minutes and respond quickly without sacrificing clinical or financial rigor."
> "High referral volume, complex documentation, and tight response windows demand
> consistent, defensible decision-making across facilities."
> "Hospice referrals require fast, compassionate coordination across providers, families,
> and care teams to ensure timely responses."

**Template**
```
H2:    Across the [scope noun]      |  [Category] for your entire [team noun]
Tab:   For [Segment or Role]                                  ← Title Case, 2–4 words
Body:  [Their constraint in their words]. [What they get, one sentence.]
CTA:   Learn more → /[segment]                                 (only on the fit-by-segment version)
```

### 3.6 FeatureTimer — "Core capabilities" (n=24 tabs, 4 bodies)

H2 is 2–5 words, almost always literally **"Core capabilities"**. Tabs are **bare product
nouns, 1–4 words**, sentence case, never verbs: *Admissions · Insurance verification ·
Prior authorization · Concurrent reviews · Bed board · Data center · eSign · Eligibility
check · Geography & payer fit · EHR integration · Hospice eligibility flagging ·
Centralized documentation*. Each body is **one sentence, 17–23 words**, and each begins with
a verb the *product* performs:

> *Admissions* — "Review referral packets in under 60 seconds as contextual AI recommends
> admit or decline decisions with transparent reasoning."
> *Insurance verification* — "Verify member status, in-network coverage, SNF benefit days,
> and financial responsibility (copays, deductibles, OOP max)."
> *Concurrent reviews* — "Track every next review date, build clinical justifications for
> continued skilled care, and get the organized package to the payer, all in the same place
> the prior authorization was run."
> *eSign* — "Send, sign, and track documents all within exacare ai and sync to EHR."

Note the parenthetical in *Insurance verification*: the only place on the site where jargon
is stacked deliberately, to prove depth to a specialist reader.

**Template**
```
H2:   Core capabilities
Tab:  [Product noun]                       1–4 words, sentence case, no verb
Body: [Verb] [object], [verb] [object], and [verb] [object]   ·  one sentence, 17–23 words
      (once per page, allow a specialist parenthetical to prove depth)
```

### 3.7 Compare — Before / After (n=48 bullets, 4 blocks)

H2: 5–8 words, always neutral and always naming the product:
> "The difference exacare ai makes" (×3) · "A better way to manage skilled nursing admissions"

Column heads are literally **"Before exacare ai" / "After exacare ai"** — the product name
is used as the *hinge* of time, which is why the block works.

Bullets: 5–16 words (mean 8.9), no periods, **mirrored one-for-one** and then the After
column adds 2 extra lines that have no Before counterpart. Three stats are appended inside
the same block on the segment pages, so the contrast lands on a number.

**The actual contrast axes** (constant across all four Compare blocks):

| # | Axis | Before | After |
|---|---|---|---|
| 1 | **Location of work** | "toggle between multiple referral portals with no central source of truth" | "All referrals are centralized in one place" |
| 2 | **Communication** | "Communication is buried in email, texts, and portals" | "Teams communicate easily with tagging, threaded comments, and an integrated hospital chat" |
| 3 | **Depth vs speed of review** | "Referral packets are reviewed under time pressure, key details missed" | "Full packets are read and analyzed in under 60 seconds" |
| 4 | **When the money truth arrives** | "PDPM considerations happen downstream, after key decisions are made" | "Financial risk and reimbursement potential surfaced upfront" |
| 5 | **Manual vs automatic** | "Managed care authorizations take hours of staff time" | "Managed care authorization workflows are handled automatically" |
| 6 | **Consistency** | "Decisions vary by staff member and building" | "Decisions are documented, communicated, and consistent across buildings" |
| 7 | *(After‑only)* **Standardisation** | — | "Custom facility-level criteria are applied automatically" |
| 8 | *(After‑only)* **Leadership visibility** | — | "Leadership gets insights to act more strategically" |

On `/home-health` and `/hospice` the same axes appear with the branch vocabulary and one
segment‑specific axis swapped in (*care transition opportunities missed* → *hospice
eligibility flagged during intake*; *referral pipelines break down silently* → *proactive
reporting*).

Grammar rule worth stealing: **Before bullets are written in the passive or in the "teams
do X" voice** (blame the system, never the reader); **After bullets are written with the
work as the subject** ("All referrals are centralized", "Gaps flagged at intake") so nobody
has to be the hero.

**Template**
```
H2:        The difference [product] makes
Columns:   Before [product]  |  After [product]
Rows:      6 mirrored pairs on these axes:
           where the work lives · how people talk · how deep the review is ·
           when the financial truth arrives · manual vs automatic · consistency
           + 2 After-only rows (standardisation, leadership visibility)
Bullets:   5–16 words, no period.  Before = passive/system-blaming.  After = work-as-subject.
Append:    3 stats inside the same block.
```

### 3.8 Testimonials — 4 block variants

| Variant | Quote length | Attribution format | Extra |
|---|---|---|---|
| `Testimonial` (single, large) | 19–41w (mean 30) | `Name, Title at Company` on one line | + `View customer stories` |
| `TestimonialsMediaCards` (3-up) | 19–26w (mean 24) | `Name, Title at Company` | H2 "Relief your teams can feel" |
| `TestimonialsTextCards` (2-up) | 35–39w (mean 37) | `Name, Title at Company` | **H3 result headline above each quote** |
| `TestimonialsQuoteCards` (summit) | 27–36w (mean 30) | `Name` / `Title` / `Company` on 3 lines | no headline at all |

The `TestimonialsTextCards` variant is the strongest pattern on the site: it puts the
**outcome as an H3 headline** and the quote underneath as the evidence.

> **2.6x increase in referral-to-admit win rate**
> "I'm helping our Hinsdale building, and we'll get 40, maybe 50 referrals a day. Having
> exacare ai just smooths our referral process out so much and makes it 20 times easier. I
> truly couldn't be happier with the switch." — *Jessica Dikun, Regional Director of
> Admissions at Pearl Healthcare*

> **$900K in annual savings unlocked**
> "What used to be highly manual, fragmented workflows are now streamlined and data-driven,
> allowing our teams across over 30 facilities to move faster, make more confident decisions,
> and capture opportunities we would have otherwise missed." — *Tim Fields, CEO at Ignite
> Medical Resorts*

**What the quotes actually praise** — categorised across all 15 marketing‑page quotes:

| Theme | Count | Example |
|---|---|---|
| Time / speed returned | 5 | "we're now able to say yes more often, and much more quickly" |
| Money (named figure) | 4 | "unlock ~$900K in annual savings" |
| Census / volume | 3 | "a noticeable increase in census, which I directly correlate with exacare ai" |
| Partnership & culture (not features) | 3 | "truly ingrained in our culture" |

Roughly one quote in five is about **the vendor relationship rather than the product** —
a deliberate premium move: it says "we are the kind of company you keep".

**Template**
```
H3:     [numeral][unit] [outcome noun phrase]        ← the result, as the headline
Quote:  25–40 words, first person plural, at least one concrete detail
        (a facility name, a daily volume, a time)
Attrib: [Full Name], [Exact Title] at [Company]      ← never anonymise, never abbreviate the title
Ratio:  4 outcome quotes : 1 relationship quote
```

### 3.9 FoundersNote — `/summit-2027`

Structure is exactly four paragraphs, 27–63 words each (mean 44), signed with two bare names.

| ¶ | Job | Opening words |
|---|---|---|
| H2 | frame | "Why we built the Summit" |
| H3 | byline | "A note from the exacare ai founders" |
| 1 | **the shared irritation** (27w) | "Two years ago, every vendor in skilled nursing started making the same promise…" |
| 2 | **concede what's true, then name the cost** (63w) | "The promise is true. Software used to record your work. Now it can *do* the work… But when every company uses the same words, they stop meaning anything." |
| 3 | **what we did about it** (54w) | "That's why we built this Summit around the *real* agentic standard." |
| 4 | **hold ourselves to it + invitation** (32w) | "And we mean the *standard* part too. It's a bar for the whole industry to hold vendors to, **including us**. We hope you'll come see for yourself." |
| sign‑off | | `Laird Russell` / `Ben Willox` — **names only, no titles, no signature image** |

The rhetorical engine here is worth copying wholesale: **concede the category's claim, then
indict the category's language, then take on the cost yourself** ("including us").

**Template**
```
H2:  Why we built [the thing]
H3:  A note from the [company] founders
¶1 (25–30w):  Everyone in [category] started promising [X].
¶2 (55–65w):  The promise is true. [What genuinely changed.] But when every company uses the
              same words, they stop meaning anything. You're left to [the reader's burden]
              while [the pressures they actually face].
¶3 (50–55w):  That's why we built [the thing] around [your standard]. We'll show you
              [proof format], and the people [doing the talking] will be your peers.
¶4 (30–35w):  And we mean the [standard] part too. It's a bar for the whole industry —
              including us. We hope you'll come see for yourself.
Sign:  [Name] / [Name]        ← first names + surnames only
```

### 3.10 Faq — `/skilled-nursing-software` and `/summit-2027`

H2 is literally **"FAQs"** (1 word) or "Frequently asked questions". Questions are **6–13
words (mean 10.7)** and are written **in the reader's voice, with "our" and "we"**, not the
brand's:

> "Can exacare ai work with **our** skilled nursing facility's EHR and referral sources?"
> "How long does it take to implement exacare ai?" · "How much does exacare ai cost?"

Answer length: **40–95 words**, and every answer opens with a **one‑word verdict** —
`Yes.` (3 of 6 on the product FAQ), or a direct declarative — before explaining.

> **Q:** "Is exacare ai secure and compliant for skilled nursing data?"
> **A:** "**Yes.** exacare ai handles SNF patient data under HIPAA with audit-ready,
> timestamped records… so teams can see what was reviewed, when it was reviewed, and what
> evidence informed the recommendation." (68w)

> **Q:** "How much does exacare ai cost?"
> **A:** "Pricing depends on the number of facilities and which capabilities you use
> (admissions, insurance verification, reimbursement). Single-facility plans and
> multi-facility agreements are available. Book a demo for a quote scoped to your
> operation." (36w — the shortest answer on the page, and it still answers.)

The six questions map one‑to‑one onto the six real objections: **speed, size fit,
integration, security, time‑to‑value, price.** The summit FAQ adds the event equivalents
(who, what's included, refunds, approval, dress, agenda, travel, "do I need to be a
customer", speakers).

**Template**
```
H2: FAQs
Q:  6–13 words, in the reader's voice, using "our/we/my"
A:  40–95 words. Open with "Yes." or a flat declarative. Then mechanism. Then consequence.
Cover, in this order: speed · does it fit my size · does it fit my stack ·
                      is it safe · how long to value · what does it cost
Never dodge price: name the variables, then point at the one CTA.
```

### 3.11 Cta and CtaBackground — the closing ask

**`CtaBackground`** (10 instances, on every marketing page) is the most formulaic block on
the site:

```
eyebrow  "Trusted by 2,000+ [reader] teams"     5–6 words
H2       "Move [page noun] forward"             2–3 words, with 'forward' in italic serif
CTA      "Book a demo"                          3 words → /contact
```

Every variant, verbatim: *Move care forward* (home, platform) · *Move admissions forward* ·
*Move reimbursement forward* · *Move skilled nursing forward* · *Move home health forward* ·
*Move hospice forward* · *Move your team forward* (stories) · plus two off‑pattern ones:
*See why we're the leading skilled nursing software* (SEO page) and *Join us* (about + careers).

The eyebrow is **re‑scoped per page** — "Trusted by 2,000+ **care** teams" on home,
"…**admissions** teams" on `/admissions`, "…**reimbursement** teams" on `/reimbursement`,
"…**hospice** teams" on `/hospice`. Same number, narrowed noun. That narrowing is what
makes a generic proof line feel specific.

**`Cta`** (the card variant, 4 instances) routes rather than closes:
```
H2         [3–4 words]: "Skilled nursing products" · "Products for skilled nursing" · "Where we work"
card link  [Product name]                    1–3 words
card head  [Imperative benefit, 4–6 words]   "Turn referrals into revenue"
                                             "Strengthen reimbursement from the start"
                                             "Make faster, defensible admission decisions"
card body  [One sentence, 17–27 words]
```

**Template**
```
CLOSING:  eyebrow  Trusted by [N]+ [narrowed reader noun] teams
          H2       [Verb] [page noun] ‹[direction word]›      ← 3 words, one italic
          CTA      [Your single conversion verb + object]
ROUTING:  H2 [3–4w category label] · card: [Product] / [4–6w imperative benefit] / [17–27w sentence]
```

### 3.12 Bento / IconCards / CardsGradient / CardsGrid / ItemsGrid

All five are the same "label + paragraph" card grid with different lengths:

| Block | Used on | Label | Body | Notes |
|---|---|---|---|---|
| `Bento` | reimbursement, SEO page | 3–5w noun phrase | 10–23w, 1 sentence | asymmetric grid; used for **differentiators** |
| `CardsGradient` | summit | 5–11w, can be a full clause | 15–37w (mean 24) | headline card carries a 1‑sentence thesis above the grid |
| `IconCards` | summit | 2–5w **audience name** | 13–30w | qualification block: who this is for |
| `CardsGrid` | careers | 4–10w **value statement** | 15–32w | values; labels are full sentences here |
| `ItemsGrid` | careers | 4–6w **offer** | 16–29w | what you get |

The two non‑product pages are where the labels are allowed to become sentences:
> "The world is moving fast. We move faster." · "We keep the patient downstream of every
> decision" · "Only the best belong here" · "Radical candor, zero politics"

Sharpest example of the CardsGradient pattern — the thesis line above the grid does the
persuading, the cards just support it:
> "Every conference in skilled nursing has added an AI session. This is the only one where
> AI is the agenda."

**Template**
```
Product-page card:   [3–5w noun phrase]           + [1 sentence, 10–23w]
Values card:         [4–10w declarative sentence] + [1–2 sentences, 15–32w]
Audience card:       [2–5w role name]             + [their stake, 13–30w]
Above a card grid:   one 20–25w thesis sentence that the cards then evidence.
```

### 3.13 Long-form customer story (5 pages, near-identical skeleton)

| Element | Formula | Bounds |
|---|---|---|
| H1 | `How [Customer] [past-tense verb] [specific number/outcome] [with product]` | 12–16 words |
| Dek (h4) | One sentence stacking 3 results | 30–45 words |
| Sticky ToC | Introduction · The Customer · The Challenge: [subtitle] · The Solution: [subtitle] · The Implementation: [subtitle] · The Impact · What's Next · **Book a demo** | Title Case (the only place on the site) |
| Stats | 3, pulled from the story | 2–9w labels |
| "Key Results" | 4–6 bullets, each with a number **and a baseline** | 12–30w |
| "Customer Snapshot" | Customer Since · Size at implementation · Region · Industry · Products | 1 line each |
| "The Stakeholders" | Name, Title + a 60–90w career paragraph each | 3–4 people |
| Body rhythm | 1 paragraph of narration → 1 pulled quote → repeat | ¶ mean 37w, quotes mean 32w |
| Impact | one h4 **per result, each stating the delta with both endpoints** | "Referral response time decreased by 80%, from 30 minutes to 6 minutes" |
| Close | "What's Next" → `Share on LinkedIn` → 3 related stories → `Move your team forward` | |

The strongest transferable device: **every impact heading names the before and after
number**, not just the delta.

> "Acceptance rate grew from 52% to 60%" · "Managed care processing time dropped 52%, from
> 22 minutes to 10 minutes" · "Hospital response times are down 90%+"

**Template**
```
H1:   How [Customer] [verb-ed] [number + outcome] with [product]
Dek:  By [replacing/changing X] with [product], [Customer] [result 1], [result 2], and [result 3].
Body: narrate one beat → quote the person who lived it → narrate the next beat
Impact headings: [metric] [direction] [delta], from [before] to [after]
```

---

## 4. Proof and credibility mechanics

### 4.1 Where each proof type sits in the flow

| Proof type | Position | Form |
|---|---|---|
| **Trust eyebrow** | Above the H1 on home; above the H2 in every closing CTA | "Trusted by 2,000+ care teams" — **proof arrives before the first claim** |
| **Customer logos** (`LogosTicker`) | Block 2 on all three segment pages — before any argument | 16 named operators: Avante, Benedictine, ClearView, Creative Solutions in Healthcare, Dialyze Direct, Eden Senior Care, Evergreen, Ignite, Journey, Majestic Care, Monarch, NHCA, PACS, Pearl Healthcare, Prestige, Sweetwater Care. **No headline over them.** |
| **Integration logos** | Mid-page on `/platform` | 9 systems (Aidin, eFax, Epic, Inovalon, MatrixCare, PointClickCare, Episodic, WellSky, Aida) under "The most connected platform in admissions" — a *capability* claim proved by logos |
| **Investor logos** | `/about-us`, after the origin story | Foundation Capital, Insight Partners, Bienville Capital, under "Backed by world class investors" |
| **Stats** | Block 3–4, right after hero or first benefit grid | 3–4 numbers, no sources |
| **Quotes** | Mid-page, after the mechanism | full name + exact title + company |
| **Compliance** | **Second-to-last block** on `/platform` | HIPAA · SOC 2 Type II · Encryption · Tenant isolation · Per-client data segregation · Annual assessments, training, and BAAs · Insurance |
| **Advisory board** | `/about-us` only | 9 named operators with real titles at real companies — proof by association, placed where a skeptic goes to check |
| **Awards** | Almost absent | exactly one: "Forbes 30 Under 30" inside a founder bio, in italics |

### 4.2 Ratio of claim to proof

Measured as proof blocks ÷ content blocks (excluding dividers):

| Page | proof blocks | share | proof atoms (stats + quotes + logo walls) |
|---|---|---|---|
| `/skilled-nursing` | 3 / 8 | 38% | 5 |
| `/platform` | 3 / 9 | 33% | 3 |
| `/skilled-nursing-software` | 3 / 10 | 30% | 7 |
| `/admissions` · `/reimbursement` · `/home-health` · `/hospice` | 2 / 7 | 29% | 4–5 |
| `/` | 2 / 8 | 25% | 7 |
| `/careers` | 1 / 8 | 12% | 1 |

**Rule of thumb to steal: one block in three is proof, and the reader hits proof twice
before they hit the second argument.** The home page carries the most proof atoms (7)
because it has the least context.

### 4.3 How specificity is used

Specificity is applied in four places, and vagueness everywhere else is what makes them land:

1. **Named people with exact titles** — never "a director", always "Jessica Dikun, Regional
   Director of Admissions at Pearl Healthcare"; "Austin Steele, Chief Strategy Officer at
   Journey"; "Chuck Moody, Senior Vice President of Clinical Services".
2. **Named facilities and volumes inside quotes** — "I'm helping our **Hinsdale** building,
   and we'll get **40, maybe 50** referrals a day"; "**60%** of our business is managed care";
   "across over **30** facilities".
3. **Named third-party systems** — PointClickCare, MatrixCare, PCC, Epic, WellSky, Aidin,
   Inovalon, eFax. Naming the systems you integrate with is itself a credibility claim.
4. **Named units of pain** — "200, 300 pages of hospital documentation", "20 different
   systems", "24 to 48 hours", "60–90 minutes it takes to read a referral packet by hand".

Conversely, **nothing is specific about the product's internals** — no model names, no
architecture, no benchmark tables. The specificity budget is spent entirely on *the
customer's world*.

**Template.** For every claim, ask: can I attach a name, a number, a system, or a duration
from the customer's world? If not, cut the claim rather than hedging it.

---

## 5. Persuasion arc

### 5.1 The argument end to end

The whole site makes one argument, in five moves:

1. **Problem — the industry was never built as a system.**
   > "Post-acute care was never built to work as a system. It was built for isolated tasks,
   > stitched together with tools that don't share context or coordinate action."
2. **Cost — fragmentation shows up as time, and time shows up as lost admissions.**
   > "Referral packets are reviewed under time pressure, key details missed" ·
   > "Managed care authorizations take hours of staff time" ·
   > "You'd get a referral with 200, 300 pages of hospital documentation and be expected to
   > answer in 30 minutes."
   The unspoken middle term is always the same: *hospitals place patients with whoever
   answers first* (stated explicitly only once, in the FAQ: "Hospitals typically place
   patients with the first one or two providers who respond, so speed wins the bed.").
3. **Mechanism — read the whole packet in context, in minutes, and act on it.**
   > "exacare ai reads full referral packets in context, identifying clinical signals and
   > risks that keyword-based tools miss." ·
   > "More than intelligence, we help you take *action*."
4. **Outcome — speed becomes census becomes money, and staff get time back.**
   > `7 min` · `15% increase in admissions` · `$380K+ per facility` · `34 hrs saved for care
   > staff each week`
5. **Meaning — and the point of all of it is care, not software.**
   > "We help with the heavy lifting, so your teams can focus on care" ·
   > "When we remove the barriers and give time back to our teams, that time becomes what
   > matters most: better care, stronger connections, and lives changed."

Note move 5. The site consistently ends one level *above* the product: the last emotional
beat is care, not ROI. That is the premium move — the numbers are the argument, the mission
is the close.

### 5.2 How objections are pre-empted

| Objection | Where it is answered | How |
|---|---|---|
| "AI just keyword-matches" | `FeatureScroll` / `Bento`, block 3–6 | "Context beyond keywords" · "not just scanning for keywords" · "99% accuracy" |
| "It won't connect to my stack" | `LogosTicker` + `Bento` + FAQ | 9 integration logos; "more referral platforms, hospital systems, and EHRs than any platform on the market"; "No rip-and-replace and no engineering lift on your side" |
| "Is it safe with PHI?" | `LogosGrid`, second-to-last on `/platform`; FAQ | HIPAA, SOC 2 Type II, tenant isolation, BAAs, "audit-ready, timestamped records" |
| "AI is a black box / I can't defend the decision" | `/about-us` belief #4 + feature copy | "AI should be explainable, not a black box. We show our work, surfacing the reasoning behind every recommendation so teams can act with confidence and **defend every decision**." · "transparent reasoning" · "defensible decisions" (×5) |
| "Too small / too big for us" | FAQ | "supports single-facility operators through enterprise skilled nursing organizations running 150+ buildings" |
| "Implementation will eat my year" | FAQ + customer story headings | "Most teams are live quickly…"; "160 skilled nursing facilities and 3,000+ users live within **48 hours**" |
| "What does it cost?" | FAQ, answered not dodged | "Pricing depends on the number of facilities and which capabilities you use… Book a demo for a quote scoped to your operation." |
| "Will my staff actually use it?" | Testimonials + support claim | "Reach an in-house, on-shore, live member of our support team in **less than five minutes**" |

**The word "defensible" is the site's signature objection-killer** — it appears in five
places and converts an AI-risk objection into a compliance *benefit*.

### 5.3 How the CTA escalates through a page

A single page never varies its ask. The escalation is in **commitment cost**, not in urgency:

```
Hero          Book a demo            (high intent, offered immediately, once)
Mid-page      Explore the platform / Learn more / View customer stories   (low-cost reads)
Closing       Book a demo            (the same ask, now with proof behind it)
```

There is **no urgency language anywhere** on the product pages — no countdowns, no "limited
spots", no "act now". The only scarcity on the entire site is on the event page, and it is
framed as *quality control rather than pressure*:
> "Attendance is capped and registration is approved, not automatic, because we know the
> value of this event is who's in the room." · "Super Early Bird $649 — Available until
> October 31st, 2026" · "Coming soon" · "Until sold out"

CTA destination counts across the core pages: `/contact` **16**, `/resources/customer-stories`
5, `/skilled-nursing` 3, `/home-health` 3, `/hospice` 2, `/admissions` 2, `/careers#open-roles` 2,
`/platform` 1, `#pricing` 1. **Nearly half of all links point at the one conversion page.**

### 5.4 Home page vs deep product page

| | `/` (home) | `/admissions` (product) |
|---|---|---|
| H1 posture | **Category claim** — "The AI platform for post-acute care operations" | **Outcome promise** — "From referral to decision in minutes" |
| Proof timing | eyebrow *above* the H1 | proof deferred to block 3; hero carries no eyebrow |
| Manifesto | yes — a whole 24‑word `Headline` block, the only one on the site | none |
| Mechanism | one 4‑item differentiator grid, no step-by-step | full 5‑step `ScrollStages` walkthrough |
| Named capabilities | 0 | 5 workflow steps + insurance/EHR/bed board specifics |
| Quotes | 3 short (24w avg), breadth of names | 2 long (37w avg), each headed by a **number** |
| Routing blocks | 2 (product cards + segment tabs) | 1 (segment tabs) |
| Emotional register | highest — "Relief your teams can feel" | lowest — operational throughout |
| Jargon density | low (PDPM appears 0×) | high (PDPM, SNF days, acuity, denials) |

**The rule:** the home page sells *the category and the feeling*; the product page sells
*the workflow and the number*. Breadth of proof up top, depth of mechanism down deep.

---

## 6. Headline library

Italic word marked `*like this*`. All lines are from the 13 core pages unless noted.

### 6.1 H1s by rhetorical type

**Category claim** (state what kind of thing you are)
- "The AI platform for post-acute care operations" — `/`
- "Intelligent infrastructure for post-acute care" — `/platform`
- "The leading skilled nursing admissions software" — `/skilled-nursing-software` (SEO)

**Outcome promise** (state the transformation)
- "From referral to decision in minutes" — `/admissions`
- "Reimbursement clarity starts at admission" — `/reimbursement`

**Comparative state** (the same line, re-pointed per segment)
- "Smarter skilled nursing operations" — `/skilled-nursing`
- "Smarter home health operations" — `/home-health`
- "Smarter hospice operations" — `/hospice`

**Empathy / identity**
- "We help with the heavy lifting, so your teams can focus on care" — `/about-us`
- "Build with us" — `/careers`

**Conversion**
- "See exacare ai in action" — `/contact`

**Story** (`How [customer] [verb-ed] [number]`)
- "How Creative Solutions in Healthcare consolidated 20 referral portals and surfaced 50%+ more referral volume"
- "How Ignite Medical Resorts saved $900,000 annually by centralizing admissions and managed care with exacare ai"
- "How Pearl Healthcare increased census by 43% in their second quarter with exacare ai"
- "How Exceptional Living Centers turned faster referral review into 32% more admissions"
- "How St. Croix County scaled a careful admissions process with AI-supported referral review"

### 6.2 H2s by rhetorical type

**Contrast / parallel fragments** (always with periods)
- "Deeper context. Faster workflows. Better decisions." — `/`
- "Faster decisions. Stronger performance." — all three segment pages
- "Faster admits. Fewer suprises." — `/admissions` *(sic)*
- "Support the right acuity. Secure the right reimbursement." — `/reimbursement`

**Mechanism**
- "How it works" — `/platform`, `/admissions`, `/reimbursement`
- "How our admissions software works" — `/skilled-nursing-software`
- "More than intelligence, we help you take *action*" — `/platform`
- "Our platform *connects* the systems post-acute care teams rely on and applies AI to help them make faster, more confident admissions and reimbursement decisions." — `/` (the site's only manifesto headline)
- "Core capabilities" — segment pages
- "AI-powered skilled nursing facility software" — SEO page

**Outcome promise**
- "Make fast, defensible admission decisions" — `/home-health`, `/hospice`
- "Turn referrals into revenue" *(card head)* · "Strengthen reimbursement from the start" *(card head)*
- "A better way to manage skilled nursing admissions" — SEO page

**Empathy / problem**
- "Relief your teams can feel" — `/`
- "Built for a problem we saw up close" — `/about-us`
- "The difference exacare ai makes" — segment pages

**Identity / belief**
- "Things we believe" — `/about-us`
- "What we stand for" · "What you'll get here" · "Life at exacare ai" · "Where we work" — `/careers`
- "Moving care forward, together" — `/platform`, `/skilled-nursing`
- "Join us" — `/about-us`, `/careers`

**Proof**
- "The most connected platform in admissions" — `/platform`
- "Fully compliant, fully secure" — `/platform`
- "Backed by world class investors" — `/about-us`
- "Proven skilled nursing software, with real admissions growth" — SEO page

**Routing / scope**
- "Across the care *journey*" — `/`, `/platform`, `/admissions`, `/reimbursement`
- "Skilled nursing products" · "Products for skilled nursing" · "Skilled nursing software for your entire care team"

**Closing**
- "Move care *forward*" · "Move admissions *forward*" · "Move reimbursement *forward*" ·
  "Move skilled nursing *forward*" · "Move home health *forward*" · "Move hospice *forward*" ·
  "Move your team *forward*"
- "See why we're the *leading* skilled nursing software" — SEO page

**Event (summit)**
- "The *real* agentic standard" (H1) · "Why we built the Summit" · "Why you should be there" ·
  "Who attends" · "The details" · "Agenda at a glance" · "Save your spot for the exacare ai Summit"

### 6.3 H3 / feature-headline library, by type

**Imperative benefit** — "Say yes, faster" · "Admit right-fit patients" · "Identify risk
early" · "Grow your census" · "Move at the speed hospitals expect" · "Standardize
performance across buildings" · "Reduce preventable denials" · "Give teams time back for
care" · "Respond quickly with full context" · "Address eligibility upfront" · "Improve
consistency across branches" · "Smooth care transitions before they become problems" ·
"Accelerate admissions with confidence" · "Coordinate with clarity and speed" · "Support
better hospice admissions and transitions"

**Differentiator noun phrase** — "Context beyond keywords" · "Deeper integrations" ·
"Deeper skilled nursing integrations" · "Intelligence that drives action" · "Real-time
dedicated support" · "Trained on your organization" · "Purpose-built for post-acute care" ·
"Continuously learning & improving" · "AI that does work for you" · "Prior authorization for
SNFs" · "Streamlined authorization workflows" · "Clinically accurate classification" ·
"Enhanced care for better outcomes" · "One place for every referral" · "Referral conversion
insights"

**Workflow step (imperative)** — "Connect your systems" · "Analyze referrals with AI" ·
"Review insights and respond" · "Track performance and manage census" · "Centralize
referrals" · "Analyze referral packets in minutes" · "Verify insurance and safety checks" ·
"Review and decide" · "Push data to your EHR" · "Extract clinical and insurance details" ·
"Estimate reimbursements early" · "Maximize what you're owed" · "Stay ahead of every
concurrent review"

**Result headline (number first)** — "2.6x increase in referral-to-admit win rate" ·
"$900K in annual savings unlocked"

**Value statement (careers)** — "Only the best belong here" · "Raise the bar on ownership" ·
"The world is moving fast. We move faster." · "Radical candor, zero politics" · "We work even
harder to keep our partners than we did to earn them initially" · "We keep the patient
downstream of every decision" · "Bring good vibes and win together"

### 6.4 CTA label library (counts and destinations)

**Conversion CTAs**

| Label | n | Destination |
|---|---|---|
| **Book a demo** | **21** | `/contact` (the only conversion ask on the site) |
| See exacare ai in action *(page H1 over the form)* | 1 | `/contact` |
| Save your spot | 1 | `#pricing` (summit) |
| Register | 1 | (summit pricing) |

**Learn-more CTAs**

| Label | n | Destination |
|---|---|---|
| Learn more | 9 | `/skilled-nursing` ×3, `/home-health` ×3, `/hospice` ×2, `/contact` ×1 |
| View customer stories | 5 | `/resources/customer-stories` |
| View all | 5 | `/resources/customer-stories` |
| Explore Admissions | 2 | `/admissions` |
| Explore the platform | 1 | `/platform` |

**Recruiting / social**

| Label | n | Destination |
|---|---|---|
| See open roles | 2 | `/careers#open-roles` |
| Share on LinkedIn | 5 | (story pages) |

**Non-navigational labels** (tabs, toggles, accordions — no href): `For Skilled Nursing` ×4,
`For Home Health` ×3, `For Hospice` ×3, `For Admissions Teams`, `For DONs & Clinical Teams`,
`For Operations Leaders`, `For Managed Care Teams`, `Pause automatic rotation` ×4,
`Admissions` ×3, `Insurance verification` ×2, `Prior authorization` ×2, `Bed board` ×2,
`Data center` ×2, `Concurrent reviews`, `eSign`, `Geography & payer fit` ×2,
`EHR integration` ×2, `Hospice eligibility flagging`, `Centralized documentation`,
`Eligibility check`, `Show bio for [Name]` ×11.

**Observations to steal**
- **Six CTA verbs in total:** *Book, Learn, View, Explore, See, Save.*
- **One conversion destination.** `/contact` takes 16 of 35 linked CTAs on the core pages.
- **The conversion CTA never changes wording.** Not "Get started", not "Talk to sales", not
  "Request pricing" — 21 identical instances of "Book a demo".
- **Segment CTAs never say the segment name** ("Learn more", not "Learn about hospice") —
  the surrounding tab already says it.
- Every accordion/tab control has a real accessible label (`Show bio for Laird Russell`,
  `Pause automatic rotation`), which is a copywriting job too.

---

## 7. Rewrite worksheet

Fill this in for your own product. Bounds are the measured exacare.com bounds; treat them as
hard limits until you have a reason.

### 7.0 Set your vocabulary first (do this before any page)

```
Product name (exact casing, used as a grammatical subject):  ______________________
Reader noun (plural, becomes "your ___"):                    ______________________
Unit noun per segment:      seg A ________  seg B ________  seg C ________
Buyer archetype noun:                                        ______________________
Downstream-beneficiary noun:                                 ______________________
The one conversion CTA (2–3 words), used site-wide:          ______________________
The direction word for every closing headline:               ______________________
Verb kit — ~20 operational verbs you will not stray from:
  ____________  ____________  ____________  ____________  ____________
  ____________  ____________  ____________  ____________  ____________
  ____________  ____________  ____________  ____________  ____________
  ____________  ____________  ____________  ____________  ____________
Kill list — words you will never use:  ____________________________________________
Four proof numbers:  speed ________  growth ________  money ________  scale ________
```

### 7.1 Product page worksheet

```
────────────────────────────────────────────────────────────────────────────
BLOCK 1 · HERO                                                    job: attention
  Eyebrow (optional, 5–6w, no period)   "Trusted by [N]+ [reader] teams"
  ▸ ______________________________________________________________________
  H1 (3–6 words, sentence case, no period, no product name)
     shape: [Adjective] [category] for [market]
         |  From [messy input] to [clean output] in [duration]
  ▸ ______________________________________________________________________
  Subhead (ONE sentence, 18–27 words)
     shape: [Product] [verb]s [X], [verb]s [Y], and [verb]s [Z]
            so [your teams] can [outcome] and [outcome].
  ▸ ______________________________________________________________________
  CTA (2–3 words, ONE button)                    ▸ __________________________
────────────────────────────────────────────────────────────────────────────
BLOCK 2 · BENEFIT GRID                                    job: problem → benefit
  H2 (2–3 parallel fragments WITH periods, 4–8 words total)
     shape: [Comparative] [noun]. [Comparative] [noun].
  ▸ ______________________________________________________________________
  Card 1  label (3–5w, imperative, no period)   ▸ __________________________
          body  (1 sentence, 14–21w, period)    ▸ __________________________
  Card 2  label ▸ ___________________  body ▸ ______________________________
  Card 3  label ▸ ___________________  body ▸ ______________________________
  Card 4  label ▸ ___________________  body ▸ ______________________________
────────────────────────────────────────────────────────────────────────────
BLOCK 3 · STATS                                               job: proof (numeric)
  Pick 3–4. Value = numeral + compact unit (+ if it's a floor).
  Label = 2–9 word lowercase noun phrase, no period, no source.
  1 ▸ ____________   ▸ _____________________________________  (speed)
  2 ▸ ____________   ▸ _____________________________________  (growth)
  3 ▸ ____________   ▸ _____________________________________  (money)
  4 ▸ ____________   ▸ _____________________________________  (scale / time back)
────────────────────────────────────────────────────────────────────────────
BLOCK 4 · HOW IT WORKS                                            job: mechanism
  H2 ▸ "How it works"  (or "How our [keyword] works")
  Order must be: ingest → analyse → decide → measure.
  Step 1  label (2–6w imperative) ▸ _______________________________________
          body  (1 sentence, 10–30w) ▸ ____________________________________
  Step 2  label ▸ __________________  body ▸ ______________________________
  Step 3  label ▸ __________________  body ▸ ______________________________
  Step 4  label ▸ __________________  body ▸ ______________________________
  Step 5 (optional) label ▸ ________  body ▸ ______________________________
────────────────────────────────────────────────────────────────────────────
BLOCK 5 · TESTIMONIALS                                         job: proof (human)
  Card 1  result headline (number first, 5–6w)  ▸ __________________________
          quote (25–40w, first person plural, one concrete detail)
          ▸ ____________________________________________________________
          attribution  [Full Name], [Exact Title] at [Company]
          ▸ ____________________________________________________________
  Card 2  headline ▸ ______________  quote ▸ ______________________________
          attribution ▸ ____________________________________________________
  CTA ▸ "View customer stories"                  ▸ __________________________
────────────────────────────────────────────────────────────────────────────
BLOCK 6 · FIT / SEGMENT TABS                                  job: route + objection
  H2 (4–6w) ▸ "Across the [scope noun]"          ▸ __________________________
  Tab A  "For [Segment]"  ▸ _______________________________________________
         body (1–2 sentences, 10–31w): [their constraint]. [what they get].
         ▸ ____________________________________________________________
  Tab B  ▸ _______________  body ▸ ________________________________________
  Tab C  ▸ _______________  body ▸ ________________________________________
  CTA per tab ▸ "Learn more" → /[segment]
────────────────────────────────────────────────────────────────────────────
BLOCK 7 · CLOSING CTA                                                  job: CTA
  Eyebrow (5–6w, narrowed to this page's reader)
  ▸ "Trusted by [N]+ ______________ teams"
  H2 (2–3 words, italicise the direction word)
  ▸ "[Verb] ______________ ‹______________›"
  CTA ▸ [your one conversion CTA, identical site-wide]
────────────────────────────────────────────────────────────────────────────
OPTIONAL · SECURITY / COMPLIANCE  (place SECOND-TO-LAST, not early)
  H2 (3–4w) ▸ "Fully [x], fully [y]"            ▸ __________________________
  Badges (1–5w each) ▸ ____________________________________________________
OPTIONAL · FAQ  (only on demand-capture pages)
  Q1 speed ▸ _______________________________  A (40–95w, open with a verdict)
  Q2 size fit ▸ ____________________________  A ▸ __________________________
  Q3 integrations ▸ ________________________  A ▸ __________________________
  Q4 security ▸ ____________________________  A ▸ __________________________
  Q5 time to value ▸ _______________________  A ▸ __________________________
  Q6 price  ▸ ______________________________  A ▸ __________________________
────────────────────────────────────────────────────────────────────────────
```

### 7.2 Segment page worksheet

```
────────────────────────────────────────────────────────────────────────────
BLOCK 1 · HERO (framed)                                           job: attention
  H1 (3–4 words) ▸ "Smarter [segment] [operations]"
  ▸ ______________________________________________________________________
  Subhead (ONE sentence, 18–19 words)
     shape: Connect [A], [B], and [C] in one [adjective] workflow
            so [segment] teams can [outcome] and [outcome].
  ▸ ______________________________________________________________________
  CTA ▸ [your one conversion CTA]
────────────────────────────────────────────────────────────────────────────
BLOCK 2 · LOGOS                                          job: proof before argument
  12–16 named customers. NO headline. NO caption. NO "trusted by".
  ▸ ______________________________________________________________________
────────────────────────────────────────────────────────────────────────────
BLOCK 3 · BENEFITS                                                  job: benefit
  H2 (2 fragments, periods) ▸ "[Comparative] [noun]. [Comparative] [noun]."
  ▸ ______________________________________________________________________
  1 label (3–7w) ▸ _____________  body (1 sentence, 14–27w) ▸ ______________
  2 label ▸ _____________________  body ▸ __________________________________
  3 label ▸ _____________________  body ▸ __________________________________
  4 label ▸ _____________________  body ▸ __________________________________
────────────────────────────────────────────────────────────────────────────
BLOCK 4 · CORE CAPABILITIES                                       job: mechanism
  H2 ▸ "Core capabilities"
  Tab 1 [product noun, 1–4w] ▸ __________  body (1 sentence, 17–23w) ▸ _____
  Tab 2 ▸ ____________________  body ▸ ____________________________________
  Tab 3 ▸ ____________________  body ▸ ____________________________________
  Tab 4 ▸ ____________________  body ▸ ____________________________________
  Tab 5–7 (optional) ▸ _____________________________________________________
  (Allow ONE specialist parenthetical somewhere, to prove depth.)
────────────────────────────────────────────────────────────────────────────
BLOCK 5 · BEFORE / AFTER                                     job: problem + proof
  H2 (5–8w) ▸ "The difference [product] makes"
  Column heads ▸ "Before [product]"  |  "After [product]"
  Write Before in passive / system-blaming voice. Write After with the work as subject.
  Axis                          Before (5–16w)              After (5–16w)
  1 where the work lives   ▸ _______________   ▸ ____________________________
  2 how people talk        ▸ _______________   ▸ ____________________________
  3 depth vs speed         ▸ _______________   ▸ ____________________________
  4 when money truth lands ▸ _______________   ▸ ____________________________
  5 manual vs automatic    ▸ _______________   ▸ ____________________________
  6 consistency            ▸ _______________   ▸ ____________________________
  7 (After only) standardisation           ▸ ____________________________
  8 (After only) leadership visibility     ▸ ____________________________
  Append 3 stats INSIDE this block ▸ _______________________________________
────────────────────────────────────────────────────────────────────────────
BLOCK 6 · CROSS-SELL                                                 job: route
  Eyebrow (3–4w) ▸ "Products for [segment]"
  H2 (5w) ▸ ______________________________________________________________
  Body (1 sentence, 20–21w) ▸ ______________________________________________
  CTA (2w) ▸ "Explore [Product]"
────────────────────────────────────────────────────────────────────────────
BLOCK 7 · CLOSING CTA                                                 job: CTA
  Eyebrow ▸ "Trusted by [N]+ [segment] teams"
  H2 ▸ "[Verb] [segment] ‹[direction word]›"
  CTA ▸ [your one conversion CTA]
────────────────────────────────────────────────────────────────────────────
```

### 7.3 Voice checklist — run every draft through this

**Length**
- [ ] Every H1 ≤ 6 words. Every section H2 ≤ 8 words.
- [ ] Every hero subhead is ONE sentence, 18–27 words.
- [ ] Every feature body is ONE sentence, 14–21 words (two only if you can defend it).
- [ ] Every CTA is 2–3 words.
- [ ] Every quote is 25–40 words.

**Punctuation and case**
- [ ] Zero exclamation marks in your own voice.
- [ ] Zero question marks outside the FAQ block.
- [ ] Headlines carry a period ONLY when they are 2–3 parallel fragments.
- [ ] Sentence case everywhere except tab labels (`For [Segment]`) and story section heads.
- [ ] Product name casing is identical in all 100% of instances.

**Voice**
- [ ] Benefit sentences say "your [teams]", never "users" or "customers".
- [ ] "We" appears only in mechanism, belief and founder copy — never in a benefit line.
- [ ] "I" appears only inside quotation marks.
- [ ] The product name is the grammatical subject of at least one verb per page.
- [ ] Every segment page swaps the unit noun (buildings / branches / regions).

**Kill list** — search the draft for each; if found, it must be inside a quote with a name:
- [ ] solution · platform-as-buzzword · leverage · seamless · robust · empower · unlock ·
      transform · innovative · cutting-edge · revolutionary · game-changing · next-generation ·
      turnkey · holistic · frictionless · best-in-class · world-class · supercharge · 10x ·
      "artificial intelligence" spelled out

**Numbers**
- [ ] All numerals, all compact units, all ≤ 2 significant figures.
- [ ] `+` used where the number is a floor; `~` never used in your own voice.
- [ ] 3–4 stats per page, covering speed / growth / money / scale.
- [ ] No footnotes, no "up to", no sources on the marketing pages.

**Proof**
- [ ] Roughly 1 content block in 3 is a proof block.
- [ ] The reader meets proof before the second argument.
- [ ] Every quote has a full name, exact title and company. Zero anonymised quotes.
- [ ] Every claim carries a name, a number, a named system, or a duration — or it is cut.
- [ ] Security/compliance is placed second-to-last, framed as an objection, not a feature.

**Structure**
- [ ] The page ends one level above the product (mission, not ROI).
- [ ] One conversion CTA wording, site-wide, unchanged.
- [ ] No urgency language anywhere except a genuinely capped event.
- [ ] Exactly ONE italic word on the page, and it is the word the sentence turns on.
- [ ] Closing headline is 2–3 words: `[Verb] [page noun] ‹[direction word]›`.

**The six most reusable formulas, in one place**

```
1. HERO SUBHEAD
   [Product] [verb]s [X], [verb]s [Y], and [verb]s [Z] so [your teams] can [outcome].

2. SECTION HEADLINE
   [Comparative adj] [noun]. [Comparative adj] [noun].          ← periods only here

3. FEATURE CHUNK
   [3–5 word imperative label]
   [One sentence, 14–21 words: the mechanism OR the consequence]

4. STAT
   [numeral][compact unit][+]  /  [2–9 word lowercase noun phrase]

5. RESULT-LED TESTIMONIAL
   [number + outcome, as an H3]
   "[25–40 word quote containing one concrete detail]"
   — [Full Name], [Exact Title] at [Company]

6. CLOSING CTA
   Trusted by [N]+ [narrowed reader noun] teams
   [Verb] [page noun] ‹[direction word]›
   [Your one conversion CTA]
```
