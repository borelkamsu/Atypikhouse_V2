# AtypikHouse Design Guidelines

## Design Approach: Exact Landing Page Recreation

**CRITICAL**: This design must exactly match the provided screenshots (land1-5.jpg)
**Key Principles**: 
- Couleurs exactes: Vert #16A433, Orange #FF8C00
- Layout identique aux captures d'écran
- Mêmes boutons, même typographie, même espacement

---

## Couleurs (EXACTES selon screenshots)

### Palette principale
- **Primary Green**: `#16A433` - Boutons "S'inscrire", "Rechercher", "Créer un hébergement"
- **Orange**: `#FF8C00` - Bouton "Devenir propriétaire", icônes de fonctionnalités
- **Dark Footer**: `#2D3748` - Fond du footer
- **White**: `#FFFFFF` - Fond principal, texte sur fonds sombres
- **Black**: `#1A202C` - Texte principal
- **Gray Light**: `#F7FAFC` - Fonds de sections
- **Gray Text**: `#718096` - Texte secondaire

---

## Typography System

**Playfair Display** (Headings - Serif elegance):
- H1: 48px/56px (mobile: 32px/40px) - Bold
- H2: 36px/44px (mobile: 28px/36px) - Bold
- H3: 24px/32px (mobile: 20px/28px) - Semibold

**Inter** (Body - Modern clarity):
- Body Large: 18px/28px - Regular
- Body: 16px/24px - Regular
- Small: 14px/20px - Regular
- Button Text: 16px/24px - Medium
- Navigation: 15px/20px - Medium

---

## Layout System

**Spacing Scale**: Tailwind units 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Breakpoints**:
- Mobile: base (< 768px)
- Tablet: md (768px - 1024px)
- Desktop: lg (1024px+)

**Container Strategy**:
- Max-width: 1280px (max-w-7xl) for main content
- Property grids: max-w-6xl
- Reading content: max-w-4xl

---

## Component Library

### Header (Sticky)
- Clean white background with subtle shadow on scroll
- Logo left, navigation center, "Host" + User menu right
- Mobile: Logo left, hamburger right, full-screen overlay menu
- Height: 80px desktop, 64px mobile
- Search bar integration below header on homepage (sticky on scroll)

### Hero Section
- Full-width immersive image showcase (60vh mobile, 75vh desktop)
- Large centered headline with Playfair Display
- Subheadline with Inter
- Primary CTA button with blurred background overlay
- Subtle gradient overlay for text readability

### Property Cards (Grid System)
- Desktop: 3-column grid (grid-cols-3)
- Tablet: 2-column (grid-cols-2)
- Mobile: Single column (grid-cols-1)
- Card anatomy: Full-bleed image (aspect-ratio 4:3), property type badge, title, location, price prominent
- Rounded corners (rounded-xl), hover lift effect

### Search & Filters
- Horizontal filter pills on desktop
- Collapsible filter drawer on mobile
- Location, Dates, Property Type, Guests, Price Range
- Sticky on property listing pages

### Property Detail Page
- Image gallery (5-8 images) with masonry layout on desktop
- Mobile: Swipeable carousel
- Two-column layout: Details left (2/3), Booking card right (1/3) - sticky
- Amenities with icons, description, reviews, map
- Mobile: Stacked single column with fixed booking CTA footer

### Footer (Rich)
- Four-column desktop layout: About, Hosting, Support, Newsletter
- Social links, trust badges (payment methods, certifications)
- Mobile: Accordion sections
- Newsletter signup with email input + CTA

### Forms (Booking, Contact)
- Single column layout, max-width 480px
- Consistent input styling: 48px height, rounded corners
- Date pickers, guest selectors with custom styling
- Clear validation states

### Navigation (Mobile)
- Slide-in menu from right
- Full screen overlay with blurred backdrop
- Large touch targets (min 48px)
- Close button top-right

---

## Images

**Hero Section**: 
Full-width panoramic image showcasing a stunning atypical property (treehouse at sunset, floating cabin on lake). High-quality, aspirational photography establishing the adventure theme.

**Property Cards**: 
Each card displays hero shot of the property. Mix of perspectives - exteriors, unique features (dome windows, spiral staircases), contextual landscapes.

**Property Details**: 
Gallery of 6-8 images including: exterior beauty shot, interior living spaces, unique architectural features, surrounding nature/views, amenities (hot tub, deck).

**Feature Sections**: 
3-4 lifestyle images showing guests enjoying properties - couples in cozy cabins, families in treehouses, morning coffee on floating house decks. Authentic, non-stock photography.

**Trust Indicators**: 
Host profile photos (circular thumbnails), verification badges as icons.

All images should emphasize natural settings, architectural uniqueness, and experiential moments that highlight the "atypical" positioning.