# AI Training Platform - Layout Structure

## Overview

The main layout structure has been implemented with a modern, responsive design featuring a fixed sidebar, sticky header, and mobile-optimized navigation.

## Files Created

### CSS Files

1. **`/css/layouts/main-layout.css`** - Main app layout structure
   - `.app-container` - Root container (min-height 100vh, flex)
   - `.sidebar` - Fixed left sidebar (240px width, collapsible)
   - `.main-content` - Main content area (flex: 1, with margin for sidebar)
   - `.header` - Sticky header (64px height, backdrop blur)
   - `.page-content` - Scrollable content area
   - Responsive breakpoints for tablet and mobile

2. **`/css/layouts/grid.css`** - Grid system utilities
   - CSS Grid layouts (2, 3, 4 column grids)
   - Auto-fit/auto-fill responsive grids
   - Dashboard-specific grids (stats-grid, course-grid)
   - Flexbox utilities
   - Gap utilities

3. **`/css/utilities/spacing.css`** - Spacing utilities
   - Margin classes (m-*, mx-*, my-*, mt-*, mb-*, ml-*, mr-*)
   - Padding classes (p-*, px-*, py-*, pt-*, pb-*, pl-*, pr-*)
   - Width/height utilities
   - Overflow utilities
   - Position utilities

4. **`/css/utilities/animations.css`** - Animation utilities
   - Keyframe animations (fadeIn, slideIn, scaleIn, pulse, spin, etc.)
   - Animation classes (animate-fade-in, animate-slide-in-*, etc.)
   - Transition utilities
   - Hover effects (hover-lift, hover-scale, hover-glow)
   - Loading states (skeleton loaders)
   - Stagger animations for lists

5. **`/css/main.css`** - Main CSS entry point
   - Imports all CSS files in correct order:
     1. Design tokens
     2. Reset styles
     3. Typography
     4. Layouts
     5. Utilities
     6. Components

### HTML Files

1. **`/pages/index.html`** - Dashboard page template
   - Semantic HTML5 structure
   - Accessible navigation (ARIA labels)
   - Responsive layout
   - Placeholder content for:
     - Welcome section
     - Stats grid (4 cards)
     - Continue learning section (course grid)
   - Mobile bottom navigation

### JavaScript Files

1. **`/js/main.js`** - Main JavaScript functionality
   - Mobile menu toggle with overlay
   - Smooth scroll for anchor links
   - Active navigation highlighting
   - Lazy loading for images
   - Keyboard navigation support
   - Accessibility features

### Assets

1. **`/assets/favicon.svg`** - App favicon (indigo gradient icon)

## Layout Structure

```
.app-container
  ├── .sidebar (240px fixed left, collapsible to 64px)
  │   ├── .sidebar-header (Logo)
  │   └── .sidebar-nav (Navigation items)
  │
  ├── .main-content (flex: 1, margin-left: 240px)
  │   ├── .header (sticky top, 64px height)
  │   │   ├── .header-left (title, menu toggle)
  │   │   └── .header-right (notifications, user avatar)
  │   │
  │   └── .page-content (scrollable, padding: 32px)
  │       ├── Welcome section
  │       ├── Stats grid (4 columns, responsive)
  │       └── Course grid (3 columns, responsive)
  │
  └── .mobile-nav (bottom nav, mobile only)
```

## Responsive Behavior

### Desktop (1024px+)
- Sidebar: 240px wide, fixed left
- Main content: margin-left 240px
- Mobile nav: hidden

### Tablet (768px - 1023px)
- Sidebar: 64px collapsed by default
- Main content: margin-left 64px
- Expandable sidebar on hover/click

### Mobile (< 768px)
- Sidebar: hidden by default (slides in from left when opened)
- Main content: full width, no margin
- Mobile nav: visible at bottom (64px height)
- Overlay backdrop when sidebar is open

## CSS Custom Properties (Variables)

All layout dimensions use CSS custom properties from `/css/base/tokens.css`:

- `--sidebar-width: 240px`
- `--sidebar-width-collapsed: 64px`
- `--header-height: 64px`
- `--z-fixed: 300` (sidebar z-index)
- `--z-sticky: 200` (header z-index)

## Design System

### Colors
- Dark theme (near-black backgrounds)
- Indigo primary accent (#6366f1)
- Cyan, amber, emerald, purple accent colors
- Subtle borders with low opacity

### Typography
- Display font: Space Grotesk (headings)
- Body font: DM Sans (text)
- Mono font: JetBrains Mono (code)

### Spacing Scale
- 4px base unit (--space-1 to --space-20)
- Consistent spacing throughout

### Animations
- Smooth transitions (300ms default)
- Spring easing for transforms
- Reduced motion support

## Accessibility Features

- Semantic HTML5 elements (nav, header, main, aside)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible states
- Reduced motion support
- Screen reader friendly
- Color contrast compliance

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- CSS Custom Properties
- IntersectionObserver API (with graceful degradation)
- Smooth scroll behavior

## Next Steps

To use this layout in your application:

1. **Open the dashboard:**
   - Open `/pages/index.html` in a browser to view the layout

2. **Customize content:**
   - Replace placeholder content with actual data
   - Add real course thumbnails and stats

3. **Build components:**
   - Create reusable components (buttons, cards, modals)
   - Add component-specific CSS files

4. **Add interactivity:**
   - Connect to backend API for data
   - Implement user authentication
   - Add course progress tracking

5. **Enhance features:**
   - Add search functionality
   - Implement filters and sorting
   - Create interactive course player

## File Paths Reference

All paths in this documentation are relative to `/course-app/` directory:

- CSS: `/css/main.css`
- Pages: `/pages/index.html`
- JavaScript: `/js/main.js`
- Assets: `/assets/favicon.svg`

## Testing the Layout

To test the responsive layout:

1. Open `/pages/index.html` in a browser
2. Use browser dev tools to test different screen sizes:
   - Desktop: 1920px width
   - Tablet: 768px - 1023px width
   - Mobile: 375px - 767px width
3. Test mobile menu toggle functionality
4. Verify keyboard navigation (Tab key)
5. Test with screen reader for accessibility

## Notes

- All animations respect `prefers-reduced-motion` setting
- Scrollbars are styled for consistent appearance
- Layout uses semantic HTML for better SEO
- Mobile-first approach with progressive enhancement
