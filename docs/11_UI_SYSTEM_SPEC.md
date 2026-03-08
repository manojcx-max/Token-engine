# UI SYSTEM SPECIFICATION
Project: TokenExtract
Design Goal: Figma-level minimal, precise, professional tool UI.

---

# 1. DESIGN PRINCIPLES

1. Functional > Decorative
2. Neutral foundation
3. Subtle elevation only
4. Tight spacing rhythm (8px grid)
5. Clear hierarchy
6. No gradients
7. No heavy shadows
8. No rounded-pill buttons
9. No marketing layout

This is a utility tool, not a landing page.

---

# 2. GRID & LAYOUT

## Base Grid
8px spacing system.

All spacing must be multiples of 8:
8 / 16 / 24 / 32 / 40 / 48

## Container

Max width: 920px
Center aligned.
Padding left/right: 24px
Vertical spacing between sections: 32px

## Vertical Rhythm

Section title → content spacing: 16px
Card padding: 24px
Element spacing inside cards: 16px

---

# 3. COLOR TOKENS

## LIGHT MODE

--bg-primary: #FFFFFF
--bg-surface: #F8F9FA
--border-default: #E5E7EB
--text-primary: #111827
--text-secondary: #6B7280
--accent: #0D99FF
--accent-hover: #007BE5
--code-bg: #F3F4F6

## DARK MODE

--bg-primary: #1E1E1E
--bg-surface: #2A2A2A
--border-default: #3A3A3A
--text-primary: #F3F4F6
--text-secondary: #9CA3AF
--accent: #0D99FF
--accent-hover: #2AA4FF
--code-bg: #252526

Accent remains identical between themes for brand consistency.

---

# 4. TYPOGRAPHY SYSTEM

Primary Font: Inter
Code Font: JetBrains Mono

## Font Weights
400 – Regular
500 – Medium
600 – Semibold

## Scale

H1:
Size: 28px
Weight: 600
Line height: 36px

Section Title:
Size: 14px
Weight: 600
Letter spacing: 0.02em
Uppercase optional

Body:
Size: 14px
Weight: 400
Line height: 22px

Small text:
Size: 12px
Weight: 400

Code:
Size: 13px
Weight: 400

---

# 5. COMPONENT SYSTEM

## Top Bar

Height: 56px
Border bottom: 1px solid border-default
Background: bg-primary

Left:
Logo text: TokenExtract
Font: 16px / 600

Right:
Theme toggle button

No shadow.

---

## Input Section Card

Background: bg-surface
Border: 1px solid border-default
Radius: 8px
Padding: 24px

Inside:
- Label (small)
- Input field
- Primary button aligned right

### Input Field

Height: 40px
Padding: 0 12px
Border: 1px solid border-default
Radius: 6px
Background: bg-primary
Font: 14px

Focus state:
Border: accent
Outline: none

---

## Primary Button

Height: 40px
Padding: 0 16px
Radius: 6px
Background: accent
Color: white
Font weight: 500
No shadow

Hover:
Background: accent-hover

Active:
Slight brightness reduction

---

## Secondary Button (Copy / Download)

Height: 32px
Padding: 0 12px
Radius: 6px
Border: 1px solid border-default
Background: transparent
Font size: 13px

Hover:
Background: bg-surface

---

## Section Cards (Results)

Each result block is its own card.

Structure:
Title (14px / 600)
16px spacing
Content

Radius: 8px
Border: 1px solid border-default
Padding: 24px
Background: bg-surface

Spacing between cards: 24px

---

## Color Swatches

Size: 56x56
Radius: 6px
Border: 1px solid border-default

Hex label below:
12px text
Centered

Spacing between swatches: 16px

Grid layout:
Auto-fit
Min column: 80px

---

## Font Display

Show font name
Then sample text:
"The quick brown fox..."

Sample size: 16px
Spacing below name: 8px

---

## Radius Preview

Box:
Width: 64px
Height: 40px
Background: accent (low opacity 10%)
Border: 1px solid border-default

Show label under each:
sm / md / lg

---

## Code Block

Background: code-bg
Border: 1px solid border-default
Radius: 8px
Padding: 16px
Font: JetBrains Mono
Overflow-x: auto

Header above code block:
Right aligned:
[Copy] [Download]

---

# 6. DARK MODE TOGGLE

Top right toggle:
Icon button
32x32
Radius: 6px
Border: 1px solid border-default
No background

Hover:
Background: bg-surface

Theme preference stored in localStorage.

---

# 7. LOADING STATE

When extracting:
- Disable button
- Replace button text with spinner + "Analyzing"
- Slight opacity reduction of input

No full-page loaders.
No overlays.

---

# 8. ERROR STATE

If extraction fails:
Show inline error card:
Background: subtle red tint
Border: 1px solid muted red
Text: 13px

No modal.
No alert().

---

# 9. RESPONSIVENESS

Below 768px:
- Reduce container padding to 16px
- Stack button below input
- Reduce swatch size to 48px

No complex mobile layout required for V1.

---

# 10. WHAT NOT TO DO

- No gradients
- No neon colors
- No big hero section
- No oversized typography
- No drop shadows larger than 0 1px 2px rgba(0,0,0,0.05)
- No animation beyond 150ms fade

This must feel precise and controlled.
