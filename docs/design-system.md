# Admin Panel Design System

## 1. Color Palette (AutoDroop Branding)
- **Primary:** `#8B1A1A` (Deep Maroon/Red) - Primary brand actions, "droop" emphasis.
- **Accent/Text:** `#121313` (Dark Charcoal) - Primary text, "Auto" emphasis, headers.
- **Secondary:** `#454F5B` (Light Slate/Grey) - Secondary details, icons, borders.
- **Background (Light):** `#FFFFFF` (Pure White)
- **Surface (Light):** `#FFFFFF`
- **Background (Dark):** `#1A1C1E` (Deep Zinc/Charcoal)
- **Surface (Dark):** `#121313` (Dark Charcoal)
- **Primary-1:** `#FBEBEB` (Light Pinkish Maroon) - Used for badges, avatars, and soft backgrounds.

## 2. Branding Guidelines
- **Logo/Text:** Always use Charcoal for "**Auto**" and Maroon for "**droop**".
- **Visual Style:** High-contrast, enterprise-grade, and mobile-responsive.

## 3. Typography Scale (Inter / Roboto)
- **h1:** 2.5rem (40px), 700 weight, tight tracking
- **h2:** 2rem (32px), 600 weight
- **h3:** 1.5rem (24px), 600 weight
- **subtitle1:** 1.125rem (18px), 500 weight
- **body1:** 1rem (16px), 400 weight (Base)
- **body2:** 0.875rem (14px), 400 weight (Secondary text)
- **caption:** 0.75rem (12px), 500 weight, uppercase

## 4. Spacing System (8pt Grid)
- `xs`: 4px | `sm`: 8px | `md`: 16px | `lg`: 24px | `xl`: 32px | `xxl`: 48px

## 5. Border Radius System
- **Small (Inputs, Badges):** 8px
- **Medium (Buttons, Cards):** 16px
- **Large (Modals, Bottom Sheets):** 24px

## 6. Elevation System (Shadows)
- **Light Mode:** Modern soft shadows. `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02)`
- **Dark Mode:** Shadows are largely replaced by borders `border: 1px solid rgba(255,255,255,0.1)` and surface elevation colors.

## 7. Component Principles
- **Buttons:** 8px radius. No uppercase text. Smooth active scaling effect (0.97).
- **Forms:** Filled inputs with background color `rgba(0, 0, 0, 0.03)` (Light) or `rgba(255, 255, 255, 0.03)` (Dark). No underline.
- **Tables:** Flat design, sticky headers, rounded borders.
- **Animations:** 400ms `cubic-bezier(0.4, 0, 0.2, 1)` for theme toggles and layout transitions.