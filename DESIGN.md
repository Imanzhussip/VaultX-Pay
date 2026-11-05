---
name: VaultX Pay
description: One HK$ account for paying friends back, presented as a retail bank in committed cobalt.
colors:
  primary: "#2341e0"
  brand-hover: "#1b32b8"
  brand-deep: "#121c6b"
  sky: "#eef1ff"
  ink: "#0b1020"
  muted: "#5b6275"
  ground: "#f3f5fa"
  surface: "#ffffff"
  raised: "#eef1f7"
  active: "#e6eaff"
  line: "#e3e6ee"
  rule: "#eef0f5"
  control: "#cfd4df"
  positive: "#1f7a4d"
  negative: "#c4242a"
  on-cobalt-text: "#dfe5ff"
  on-deep-text: "#d6dcff"
  on-deep-icon: "#aebcff"
  paused-card: "#646a7d"
  error-wash: "#ffedea"
  error-ink: "#831c1e"
  success-wash: "#dcfae5"
  success-ink: "#04250e"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Geist, system-ui, sans-serif"
    fontSize: "72px"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  display-close:
    fontFamily: "Bricolage Grotesque, Geist, system-ui, sans-serif"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bricolage Grotesque, Geist, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  figure:
    fontFamily: "Bricolage Grotesque, Geist, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: "48px"
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  title:
    fontFamily: "Bricolage Grotesque, Geist, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "32px"
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: "30px"
  body-home:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "27px"
  app-title:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "32px"
    letterSpacing: "-0.015em"
  app-balance:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "40px"
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  body:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "24px"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  card: "10px"
  tile: "16px"
  photo: "20px"
  band: "28px"
  full: "999px"
spacing:
  gutter-sm: "20px"
  gutter: "32px"
  panel: "20px"
  stack: "12px"
  section-sm: "80px"
  section: "128px"
  container: "1280px"
  sidebar: "256px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
  button-pill-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "52px"
  button-on-brand:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "52px"
  button-on-brand-hover:
    backgroundColor: "{colors.sky}"
  button-outline-on-brand:
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "52px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "40px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "20px"
  nav-item-active:
    backgroundColor: "{colors.active}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
  split-result:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.primary}"
    typography: "{typography.figure}"
    rounded: "{rounded.tile}"
    padding: "16px 20px"
  card-face:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "20px"
  error-note:
    backgroundColor: "{colors.error-wash}"
    textColor: "{colors.error-ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: VaultX Pay

## Overview

**Creative North Star: "The Cobalt High Street"**

VaultX Pay is a retail bank played straight: a white bank header, a full-bleed committed-cobalt hero, then white and pale-sky sections, a brand-night security band and an ink footer. The world is owned by one idea, paying friends back, and every surface proves itself with the product's own machinery (a working split calculator, a phone drawn from the real send screen, a statement whose rows carry the balance after them) rather than with claims. Real Hong Kong photography (tram, dim sum, Star Ferry, Mong Kok, harbour at night) carries the place; everything product-shaped is drawn in HTML.

Two densities share one palette. The public home runs at 17px body on a 1280px container with 80 to 128px section rhythm, Bricolage Grotesque display and generous pills. The signed-in app runs at 14px body on a pale cool ground with 8px bordered panels, Geist-only headings and 6px controls: the same bank, behind the counter. Depth is earned by objects that sit on top of something (the split card on the hero photo, the phone, the front card of a fan); everything else is flat and separated by hairlines.

Motion is narrative and always settles. Headlines rise line by line once the display font has loaded, photos drift on scroll, statement rows arrive in order, the phone types a transfer and the security steps light in sequence. Loops play only while on screen, stop after three runs, carry a visible Pause control, and under reduced motion show their final, informative frame.

**Key Characteristics:**
- Committed cobalt (#2341e0) owns the hero, primary actions, the mark and the active card face.
- White and pale sky alternate below the hero; brand-night (#121c6b) is reserved for proof and the close.
- Bricolage Grotesque bold for public display; Geist for all reading text and for every app heading.
- Tabular figures on every amount; money is always shown as HK$1,320.25.
- 20px radii on photos and feature cards; pills for public actions; 6 to 8px in the app.
- Flat hairline structure; soft, cool, negative-spread shadows only under lifted objects.

## Colors

A cool, single-accent bank palette: one saturated cobalt, its night tone, a pale sky wash, and blue-tinted neutrals.

### Primary
- **Committed Cobalt** (primary): the hero field, primary buttons, the vault-dial mark, active card faces, step numerals, check discs, the split result figure, link-hover text, text selection, caret and chart line. Exposed in code under three aliases (`primary`, `brand`, `data`) that must stay equal.
- **Pressed Cobalt** (brand-hover): hover and pressed state of cobalt buttons only.
- **Brand Night** (brand-deep): the security band and the scrim behind the closing harbour photo (as `rgb(18 28 107 / 0.94 → 0.1)`). Proof reads apart from offer because it sits on this tone.

### Secondary
- **Pale Sky** (sky): alternate section ground (cards section), split result tile, step-number discs, hover wash for public links and ghost buttons, hover of the white on-brand button.

### Neutral
- **Ink** (ink): all text on light grounds, the footer ground, phone bezel, selected chips, tooltip ground, focus ring.
- **Slate** (muted): secondary text, table headers, captions, chart axis ink.
- **Cool Ground** (ground): signed-in app background and the phone screen.
- **Paper** (surface): public page ground, panels, inputs.
- **Raised** (raised): balance-preview wells, skeletons, app nav hover.
- **Active Wash** (active): the selected app nav item.
- **Line** (line): panel borders, section dividers, quick-link grid.
- **Rule** (rule): row separators inside ledgers and statements.
- **Control** (control): input borders, dashed empty-state borders, the strong row rule above "Balance after", placeholder amount in the phone.
- **Paused Slate** (paused-card): the face of a paused card.

### On-dark tints
- **Cobalt Mist** (on-cobalt-text): body copy on the cobalt hero and the closing band.
- **Night Mist** (on-deep-text): body copy on brand-night; **Night Icon** (on-deep-icon) for safeguard icons there. White at 60 to 90% opacity covers footer text.

### Status
- **Positive** (positive): incoming amounts and a positive net change only. Outgoing amounts stay ink; red is not used for ordinary spending.
- **Negative** (negative): a negative net change and "more than you have" warnings.
- **Error / Success notes** (error-wash + error-ink, success-wash + success-ink): inline alert and sent confirmations.
- **Avatar tints**: four fixed pastel pairs (sky `#dcebf7`/`#0f3b66`, mint `#dff1e3`/`#1d4d27`, teal `#d9f0ee`/`#0e4a45`, sand `#f6e8d5`/`#6b3d0e`) hashed from a person's email for initials discs.

### Named Rules
**The One Cobalt Rule.** There is one accent. Every interactive emphasis is cobalt or ink; no second hue enters the chrome. Green and red appear only on amounts and status.

**The Night Is For Proof Rule.** Brand Night grounds the security explanation and the close, never an offer section or the app.

## Typography

**Display Font:** Bricolage Grotesque (self-hosted, weights 500 to 800, optical sizing on), falling back to Geist
**Body Font:** Geist (400 to 700, Google Fonts), falling back to Inter, system-ui
**Label/Mono Font:** Geist Mono, used only for the SQL transaction sample on the auth aside

**Character:** Bricolage's tight, slightly quirky bold gives the public bank a voice of its own; Geist keeps every sentence, form and figure plain and legible.

### Hierarchy
- **Display** (700, 44 / 60 / 72px across breakpoints, 1.02, -0.03em): the hero headline only, set as two lines that rise separately.
- **Display close** (700, 40 / 56 to 60px, 1.04, -0.025em): the security band and closing band headlines.
- **Headline** (700, 36 / 48px, 1.08, -0.02em): every other public section headline.
- **Figure** (700, 40px / 48px, -0.02em, tabular): the split calculator result; the phone amount uses the same voice at 36px.
- **Title** (700, 24 to 26px, 32px, -0.01em, Bricolage): card titles (Split a bill, photo captions, quick-link heading).
- **Lead** (400, 18 to 19px, 30px): the paragraph under hero and band headlines.
- **Body (home)** (400, 17px / 27px): public reading text, max about 520 to 640px wide; list titles step up to 18 to 19px semibold.
- **App title** (700, 24px / 32px, -0.015em, Geist): page headers in the signed-in app and auth screens.
- **Body (app)** (400, 14px / 20px): the app's base size; panel headings are 16px medium.
- **Label** (400, 12 to 13px, 16 to 20px): table headers, captions, sub-lines, timestamps. Sentence case, no tracking.

### Named Rules
**The Two Rooms Rule.** Bricolage speaks only on the public site (and in the wordmark). Inside the app, headings are Geist bold; the display face never appears on a form or ledger.

**The Tabular Money Rule.** Every amount, date, time and count uses tabular figures, and every currency value reads HK$1,320.25 with a true minus sign for outgoing money.

## Layout

The public page is a stack of full-width bands over a 1280px centred container with 20px gutters (32px from sm). Sections pad 80px vertically and 128px from lg; the hero pads 48/64px on mobile and 80/96px on desktop. Desktop compositions use a 12-column grid with asymmetric splits (6/6 hero, 7/5 photo mosaic, 5/7 statement, 7/5 security headline, 4/8 FAQ). The header is a sticky 72px white bar with a hairline bottom; anchored sections offset by 88px. On mobile the split calculator rises out of the hero photo by 96px instead of overlapping its corner, and the nav becomes a full-screen white sheet with 28px Bricolage links.

The signed-in app is a 256px sticky sidebar plus fluid content (padding 20/24/32px), collapsing below lg to a 48px sticky top bar and a full-screen menu sheet. Panels sit in a 12px-gap grid (2:1 on xl). Auth screens split 50/50: form column (max 400px) left, a cobalt explanation aside right.

## Elevation & Depth

Flat by default. Structure comes from 1px hairlines (line, rule) and tonal grounds (ground, sky, raised). Shadows exist only under objects that physically sit on top of another layer, and they are soft, deep and negative-spread, tinted with ink or brand night rather than black.

### Shadow Vocabulary
- **Lifted card** (`box-shadow: 0 24px 48px -16px rgb(11 16 32 / 0.45)`): the split calculator over the hero photo.
- **Device** (`box-shadow: 0 32px 64px -24px rgb(11 16 32 / 0.5)`): the phone mock.
- **Card in hand** (`box-shadow: 0 28px 48px -20px rgb(18 28 107 / 0.6)`): the front card of the fanned pair.

### Named Rules
**The Only-What-Sits-On-Top Rule.** Panels, inputs, buttons and app surfaces carry no drop shadow. A drop shadow is allowed only when an object overlaps a photo or another object.

## Shapes

A soft, friendly geometry with a clear size ladder: 4px skeletons, 6px buttons and inputs, 8px app panels, 10px card faces (true 1.586 card ratio), 16px inner tiles (split result, phone tiles, transfer steps), 20px photos and feature cards, 28px for the closing band, 46/36px for the phone bezel and screen. Public calls to action and header buttons are full pills; app buttons are 6px. Circles mark people (initials discs), step numerals and check discs. Icons are a single 24px-grid stroke set at 1.6px, round caps and joins, drawn in `currentColor`.

## Components

### Buttons
Confident and plain: medium weight, no icons by default, a 3% press-in on `:active`.
- **Shape:** 6px corners in the app (36px tall); full pill on the public site (44px header, 52px large).
- **Primary:** cobalt with white text; hover to pressed cobalt.
- **On cobalt:** white pill with cobalt text (hover pale sky), paired with an outline pill drawn as a 1.5px inset white ring at 70% (hover white at 10%).
- **Ghost:** text-only pill that takes the pale-sky wash on hover (header Log in, mobile actions).
- **Secondary (app):** light grey fill with ink text.
- **Focus:** 2px ink outline at 2px offset; white on dark bands (`.on-dark`). Disabled is 60% opacity with a not-allowed cursor.

### Chips
- **Style:** 32px, 6px corners, 13px text; unselected is white with a control-grey border (ink on hover); selected is solid ink with white text. Used for "people you have paid before".
- **Segmented control:** 32px segments inside a raised track for Add / Withdraw.

### Cards / Containers
- **Corner Style:** 8px app panels; 20px public feature cards and photos.
- **Background:** white on cool ground (app) or on white/sky (public).
- **Shadow Strategy:** none, except the three lifted objects in Elevation.
- **Border:** 1px line.
- **Internal Padding:** 20px app; 24 to 28px public feature cards.

### Inputs / Fields
- **Style:** 40px tall (48px in the split calculator), white, 1px control border, 6px corners, 500-weight label 8px above. Currency inputs carry a muted "HK$" prefix inside the field at 12px left.
- **Focus:** border and 2px outline both go to ink, no offset.
- **Error:** an inline note in error wash with error ink, never a red border alone. Overspend is shown in the balance preview in negative red.

### Navigation
- **Public header:** wordmark left, five 15px anchor links as pills (hover pale sky + cobalt text), Log in ghost pill and Open an account cobalt pill right.
- **App sidebar:** 32px rows (36px on touch), 6px corners, 16px stroke icons; muted text, raised wash on hover, active wash with ink text when current.
- **Tabs:** text tabs with a 2px ink underline on the selected tab and a muted count.

### Ledger and Statement (signature)
Four columns (Date, Movement, Amount, Balance after), 56 to 60px rows divided by the faint rule, 12 to 13px muted headers in sentence case. Incoming amounts are green with a plus sign; outgoing stay ink with a true minus. Balance after is always shown, muted, right-aligned. On mobile it collapses to two lines per row with the balance under the amount. On the home page the rows arrive in order (70ms stagger) when the statement scrolls into view.

### Balance Preview
A raised well of three 36px rows (Balance now, this change, Balance after) with a control-grey rule and a bold 16px total; the total turns negative red with a one-line explanation when the amount exceeds the balance.

### Split Calculator (signature)
A white 20px card lifted over the hero photo: bill total with HK$ prefix, a bordered people stepper (2 to 12) with 44px hit areas, and a pale-sky result tile whose cobalt figure rolls from HK$0 on arrival (1100ms after a 450ms delay) and to each new value in 450ms with a quartic ease-out. A screen-reader-only live line states the result in words.

### Phone Mock and Transfer Steps (demo loops)
The phone is the real send screen drawn in HTML inside an ink bezel; it types an amount, presses Send and shows the sent state. The transfer steps are three translucent-white tiles on brand night with a progress bar that lights Lock, Move, Save in order. Both are demo loops: they advance only while 40% visible, stop after three runs, offer a Pause/Play pill beneath them, and when stopped or under reduced motion show their final, complete frame.

### Card Face
A 1.586-ratio, 10px card in cobalt (paused: slate with a "Paused" pill) showing the mark, network, masked last four with wide tracking, and expiry.

### Motion grammar
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for state transitions (120 to 150ms); `cubic-bezier(0.16, 1, 0.3, 1)` for entrances (700 to 800ms).
- **Entrance:** hero lines rise from 0.3em with 90ms stagger, gated on the display font being loaded; lead and buttons fade up 14px; the split card rises 24px.
- **Scroll:** photos are pre-scaled to 1.08 and pan 3.5 to 5% with scroll-driven timelines; story photos unmask from an inset clip; the card pair fans in. All scroll effects are behind `@supports (animation-timeline: view())`.
- **Reduced motion:** every keyframe animation is declared only under `prefers-reduced-motion: no-preference`; transitions drop to 0ms; the rolling number jumps; loops show their final frame; smooth anchor scrolling is off.

## Do's and Don'ts

### Do:
- **Do** let committed cobalt (#2341e0) fill the first band of a public page and drive every primary action.
- **Do** show money as HK$1,320.25 in tabular figures, green only for incoming, with the balance after wherever a movement is listed.
- **Do** prove features with the product's own UI drawn in HTML (forms, statements, card faces), not screenshots or invented figures.
- **Do** use real Hong Kong photography at 20px radius, credited in the footer.
- **Do** keep app surfaces flat: 1px line borders, 8px panels, 20px padding, 12px gaps.
- **Do** give every looping demo a Pause control, an in-view gate, a run limit and a settled final frame.

### Don't:
- **Don't** introduce a second accent hue; status green and red never style chrome.
- **Don't** use Bricolage Grotesque inside the signed-in app beyond the wordmark.
- **Don't** put drop shadows on panels, buttons or inputs; reserve them for objects lifted over a photo or another object (the inset ring of the outline pill is a border, not elevation).
- **Don't** colour outgoing amounts red; red means a problem, not spending.
- **Don't** add customer counts, ratings, testimonials, licences or rates as proof.
