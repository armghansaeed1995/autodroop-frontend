# Admin Panel Design System

## 1. Color Palette
- **Primary:** `#6366F1` (Indigo 500) - Used for primary actions, active states.
- **Secondary:** `#14B8A6` (Teal 500) - Used for secondary actions, accents.
- **Accent:** `#F43F5E` (Rose 500) - Used for highlights, callouts.
- **Background (Light):** `#F8FAFC` (Slate 50)
- **Surface (Light):** `#FFFFFF`
- **Background (Dark):** `#0F172A` (Slate 900)
- **Surface (Dark):** `#1E293B` (Slate 800)

## 2. Typography Scale (Inter / Roboto)
- **h1:** 2.5rem (40px), 700 weight, tight tracking
- **h2:** 2rem (32px), 600 weight
- **h3:** 1.5rem (24px), 600 weight
- **subtitle1:** 1.125rem (18px), 500 weight
- **body1:** 1rem (16px), 400 weight (Base)
- **body2:** 0.875rem (14px), 400 weight (Secondary text)
- **caption:** 0.75rem (12px), 500 weight, uppercase

## 3. Spacing System (8pt Grid)
- `xs`: 4px | `sm`: 8px | `md`: 16px | `lg`: 24px | `xl`: 32px | `xxl`: 48px

## 4. Border Radius System
- **Small (Inputs, Badges):** 6px
- **Medium (Buttons, Cards):** 12px
- **Large (Modals, Bottom Sheets):** 24px

## 5. Elevation System (Shadows)
- **Light Mode:** Soft, dispersed shadows. `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)`
- **Dark Mode:** Shadows are largely replaced by borders `border: 1px solid rgba(255,255,255,0.05)` and subtle glowing surface colors.

## 6. Component Principles
- **Buttons:** Fully rounded or 12px radius. No uppercase text. Smooth hover states.
- **Forms:** Filled inputs with background color `#F1F5F9` (Light) or `#334155` (Dark). No underline.
- **Tables:** Flat design, sticky headers, striped rows only on hover.
- **Animations:** 300ms `ease-in-out` for theme toggles and drawer slides. 150ms for button hovers.