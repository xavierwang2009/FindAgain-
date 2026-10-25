---
name: FindAgain
description: Sculpture Garden, a warm and tactile interface for remembering everyday things.
colors:
  easy-sand: "#eee5d4"
  easy-ink: "#252c29"
  easy-surface: "#f8f2e7"
  easy-soft: "#e2d7c5"
  easy-line: "#c5baa7"
  easy-sub: "#625e51"
  easy-action: "#7e3b25"
  easy-on-action: "#fff8ed"
  easy-focus: "#936322"
  easy-field-line: "#807664"
  easy-delete: "#a4422b"
  immersive-sand: "#202923"
  immersive-ink: "#eee7d9"
  immersive-surface: "#2c3730"
  immersive-soft: "#354237"
  immersive-line: "#617064"
  immersive-sub: "#c0c5b9"
  immersive-action: "#d9b783"
  immersive-on-action: "#252c29"
  immersive-accent: "#e9c998"
  immersive-focus: "#f1c584"
  immersive-field-line: "#899b8c"
  immersive-delete: "#ffb8a2"
  success-bg: "#d5e5cf"
  success-text: "#27472b"
  error-bg: "#f5d9ce"
  error-text: "#792b17"
  sculpture-bronze: "#bc9e69"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(40px, 4.5vw, 60px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-.04em"
  display-easy:
    fontFamily: "Manrope, sans-serif"
    fontSize: "50px"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-.04em"
  display-mobile:
    fontFamily: "Manrope, sans-serif"
    fontSize: "36px"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-.035em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "17px"
    lineHeight: 1.5
  body-easy:
    fontFamily: "Manrope, sans-serif"
    fontSize: "20px"
    lineHeight: 1.5
  body-larger:
    fontFamily: "Manrope, sans-serif"
    fontSize: "24px"
    lineHeight: 1.5
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1.4em"
    fontWeight: 600
    letterSpacing: "-.03em"
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: ".9em"
    fontWeight: 600
  brand:
    fontFamily: "Manrope, sans-serif"
    fontSize: "25px"
    fontWeight: 800
    letterSpacing: "-1px"
rounded:
  control: "12px"
  card: "14px"
  dialog: "16px"
  switch: "30px"
  switch-option: "24px"
  circle: "50%"
spacing:
  field-gap: "9px"
  action-gap: "12px"
  grid-gap: "16px"
  field-column-gap: "18px"
  card-padding: "20px"
  section-padding: "28px"
  desktop-gutter: "48px"
  studio-gap: "64px"
components:
  button-primary:
    backgroundColor: "{colors.easy-action}"
    textColor: "{colors.easy-on-action}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-primary-immersive:
    backgroundColor: "{colors.immersive-action}"
    textColor: "{colors.immersive-on-action}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-secondary:
    backgroundColor: "{colors.easy-soft}"
    textColor: "{colors.easy-ink}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-text:
    textColor: "{colors.easy-action}"
    padding: "8px 0"
  input:
    backgroundColor: "{colors.easy-surface}"
    textColor: "{colors.easy-ink}"
    rounded: "{rounded.control}"
    padding: "14px"
  mode-switch:
    backgroundColor: "{colors.easy-soft}"
    rounded: "{rounded.switch}"
    padding: "5px"
  item-card:
    backgroundColor: "{colors.easy-surface}"
    textColor: "{colors.easy-ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  dialog:
    backgroundColor: "{colors.easy-surface}"
    textColor: "{colors.easy-ink}"
    rounded: "{rounded.dialog}"
    padding: "30px"
  count:
    backgroundColor: "{colors.easy-soft}"
    textColor: "{colors.easy-ink}"
    rounded: "{rounded.circle}"
    height: "28px"
---

# Design System: FindAgain

## Overview

**Creative North Star: "Sculpture Garden"**

Warm sand, ink green and bronze give familiar objects a quiet physical presence. Manrope typography and open task layouts make saving and finding the primary experience. Easy is the default; Immersive introduces a floating dimensional key beside the same controls.

The visual system is extracted from the final cascade in `app/redesign.css` and `app/sculpture.css`, with retained structural styles in `app/globals.css`. The older blue theme declarations are not the visual palette for this surface.

**Key Characteristics:**
- Warm, tactile colors with strong field boundaries.
- Spacious task controls and restrained surface rounding.
- Optional sculpture motion, with explicit rotation and pause controls.

## Colors

Easy pairs warm sand and cream surfaces with dark ink and rust actions. Immersive pairs ink green surfaces with pale text and bronze actions. The frontmatter owns exact values; theme-prefixed tokens describe each mode.

### Primary
- **Rust action / Bronze action:** primary Save and Find controls. Easy uses its action color for accents; Immersive has a separate lighter accent for emphasized words and icons.
- **Focus amber:** visible keyboard focus across controls, changing with the experience.

### Neutral
- **Sand / Ink green:** page background (`--sand`).
- **Ink / Pale parchment:** text (`--ink`).
- **Cream / Green surface:** fields, saved cards and dialogs (`--surface`).
- **Soft sand / Soft green:** secondary controls and icon discs (`--soft`).
- **Muted text:** supporting copy (`--sub`).
- **Divider line:** section boundaries (`--line`). Use the stronger `--field-line` for editable field boundaries.

### Status
Success uses the green status pair; errors use the clay status pair. Delete has a distinct mode-specific text color. Bronze material colors belong to the sculpture, not to unrelated form controls.

## Typography

**Display and body font:** locally served Manrope, with sans-serif fallback. Georgia appears only in the small sculpture engraving.

Display is medium weight with tight tracking. Task headings use semibold; labels remain explicit. Body size is 17px in Immersive, 20px in Easy, and 24px with larger text enabled (23px on mobile). Relative em sizes allow labels and buttons to follow the selected body size.

The hero uses the display clamp; Easy uses 50px. Both become 36px at the mobile breakpoint. Task headings use 1.4em, becoming 1.35em on mobile. The brand uses 25px, becoming 22px on mobile. Keep helper copy subordinate without replacing field labels.

## Layout

The header has a 1360px maximum width; the main region has a 1240px maximum. Desktop horizontal padding is 48px. Immersive uses a 1.15fr / 1fr task-and-scene grid with a 64px gap. Easy centers a single task column and saved region within 850px. The desktop scene is sticky, 24px from the top.

At 900px, horizontal padding becomes 24px, the studio gap becomes 30px, and item fields stack. At 650px, horizontal padding becomes 20px, the experience switch takes a full header row, and task controls precede the scene in a vertical stack. Saved cards use three desktop columns in Immersive, two in Easy, two at 900px, and one at 650px. Larger text uses a single task column and hides the scene.

The sculpture stage is 570px tall, changing to 430px at 600px. Its mobile object scale is .78. Do not confuse its 600px breakpoint with the application's 650px breakpoint.

## Elevation & Depth

Task surfaces are flat at rest, separated by tone and thin boundaries. Saved cards lift 3px on hover with a soft shadow. The sculpture uses perspective, stacked CSS geometry, material gradients and a cast shadow; these effects belong to the scene rather than the form.

### Shadow Vocabulary
- **Card hover:** `0 8px 24px #0002`.
- **Sculpture pedestal:** `0 28px 38px #0003`.
- **Sculpture cast shadow:** dark elliptical fill with `blur(11px)`.

## Shapes

Controls use 12px corners, saved cards 14px and dialogs 16px. The mode switch has a 30px outer radius and 24px option radii. The brand mark, item icons and count badge are circular. Workspace and task navigation remain open and unboxed. The 3D key combines a ring, shaft, collar and two teeth; its geometry is decorative.

## Components

### Buttons
Primary actions use action/on-action colors and 12px 18px padding, with a 52px minimum height. Save is 58px tall. Hover switches to ink/sand. Secondary buttons use soft/ink and hover to the divider tone. Text buttons use the accent with transparent backgrounds. Disabled buttons retain the inherited .55 opacity and use a not-allowed cursor.

Keyboard focus is a 3px focus-colored outline offset by 4px. Buttons transition background, color and transform over .2s. Voice buttons show their pressed state in action colors; their minimum height is 54px, or 60px in Easy.

### Inputs / Fields
Inputs use surface/ink, 12px corners, 14px padding and the stronger field-line stroke. Default minimum height is 58px; Easy item fields are 64px. Placeholder text uses the muted text color. The search container has a focus-within ring. Preserve visible labels, helper copy and explicit voice controls.

### Navigation
The top Easy / Immersive selector uses a soft pill container. Its selected option uses ink/sand and `aria-pressed`. Remember / Find tabs use an open underline treatment: muted inactive text, ink active text and a 3px action-colored active underline. These are separate navigation layers.

### Cards / Containers
Saved-item cards use surface backgrounds, 20px padding and 16px grid gaps. Icons sit in 48px soft circular discs; photos retain their content. Dialogs use surface backgrounds, line borders and 30px padding, reducing to 26px 22px on mobile. The count badge uses tabular numerals, soft background and ink text.

### Sculpture
Immersive includes a CSS 3D bronze key, orbital lines, a satellite sphere and a pedestal. Float and shadow loops last 8s; the satellite loop lasts 10s. Pointer rotation eases over .65s. Rotate and pause controls remain keyboard accessible. Pausing stops ambient loops. Reduced-motion preference disables animation and transitions globally; Easy has no decorative movement.

## Do's and Don'ts

### Do:
- **Do** use the semantic CSS variables so both experiences stay coherent.
- **Do** keep the task ahead of the scene on mobile and preserve larger text support.
- **Do** preserve visible focus and the stronger field-boundary tokens.
- **Do** keep both modes on the same local records and preserve the voice disclosure and review flow.

### Don't:
- **Don't** reuse the overridden blue globals as new visual tokens.
- **Don't** put saved user records or photos into decorative scene elements.
- **Don't** make decoration a prerequisite to saving or finding.
- **Don't** add ambient movement to Easy or override reduced motion.

### Phone task layout (October 25, 2026)
At 650px and below, omit the desktop introduction and decorative scene. Keep the experience selector, task tabs and 44px touch targets. Put 82px speech controls beside labeled inputs. Primary save and typical find answers fit a 375x667 viewport at normal text size; long data and enlarged text scroll naturally. Tabs read Save a place / Find my item.
