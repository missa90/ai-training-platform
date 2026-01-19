# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains corporate AI training courses developed by [Intraverse AI](https://intraverseai.com/). The training materials address the gap in AI skills within enterprise environments.

### Key Differentiators
- **Custom client solutions**: Each training course is tailored to address specific client problems and use cases
- **Interactive animations**: Courses use dynamic, interactive web-based animations rather than static PowerPoint presentations
- **Hands-on engagement**: Focus on experiential learning over passive content consumption

## Architecture

### Project Structure
```
course-app/
├── css/
│   ├── base/           # Design tokens, reset, typography
│   │   ├── tokens.css  # CSS custom properties (colors, spacing, fonts)
│   │   ├── reset.css   # CSS reset/normalize
│   │   └── typography.css
│   ├── layouts/        # Page-level layout systems
│   │   ├── main-layout.css  # Sidebar + content area structure
│   │   └── grid.css    # Grid utilities
│   ├── components/     # Reusable UI components
│   │   ├── sidebar.css
│   │   ├── header.css
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── search-modal.css
│   │   ├── notifications.css
│   │   ├── skeleton.css
│   │   └── onboarding.css
│   ├── pages/          # Page-specific styles
│   │   ├── courses.css
│   │   ├── tools.css
│   │   ├── community.css
│   │   └── profile.css
│   ├── utilities/      # Utility classes
│   │   ├── spacing.css
│   │   └── animations.css
│   └── main.css        # Entry point (imports all above)
├── js/
│   └── main.js         # JavaScript interactions
├── pages/
│   └── index.html      # Main dashboard page
└── assets/             # Images, icons, fonts
```

### Design System
- **CSS Custom Properties**: All theming via `tokens.css` (colors, spacing, typography, shadows)
- **Naming Convention**: BEM-like pattern (`.component__element--modifier`)
- **Dark Theme**: Default dark UI with accent colors (indigo primary, cyan, amber, purple)
- **Responsive Breakpoints**: 1400px, 1200px, 1024px, 768px, 640px, 480px

### Key Components
1. **Sidebar**: Collapsible navigation with sections (main nav, tools, learning path, weekly progress)
2. **Header**: Sticky with search trigger (Cmd+K), streak badge, notifications, user menu
3. **Search Modal**: Global search with live filtering across courses, tools, community
4. **Notifications Panel**: Dropdown with tabs (All/Unread), notification types
5. **Onboarding Flow**: Multi-step modal with progress indicators
6. **Skeleton Loading**: Shimmer animation placeholders for async content

### JavaScript Patterns
- IIFE module pattern for initialization
- Event delegation for dynamic content
- localStorage for user preferences (sidebar collapse, onboarding completion)
- Intersection Observer for scroll-triggered animations
- Keyboard shortcuts (Cmd+K for search, Escape to close modals)

## Build & Development Commands

### Development
```bash
# Open in browser (no build step required - vanilla HTML/CSS/JS)
open course-app/pages/index.html

# Or use a local server for proper module loading
npx serve course-app
```

### Testing Features
```javascript
// Trigger onboarding flow (in browser console)
window.showOnboarding()

// Search modal
// Press Cmd+K (Mac) or Ctrl+K (Windows)
```

### Git Workflow
```bash
git add .
git commit -m "feat: description"
git push origin main
```

**Repository**: https://github.com/missa90/ai-training-platform

## Content Guidelines

When developing training materials for this repository:
- Prioritize interactive elements that demonstrate AI concepts through hands-on experience
- Design for client customization - avoid hardcoding company-specific examples
- Ensure animations enhance understanding rather than distract from core concepts

## Development History

### Sprint 1-3 (Completed)
- Foundation layout (sidebar + main content grid)
- Navigation sidebar with collapsible sections
- Header with search trigger, streak badge, user menu
- Courses page with grid cards and filters
- Tools page with tool categories
- Community page with discussions
- Profile page with stats and achievements

### Sprint 4 (Completed - Jan 2026)
- Global search modal (Cmd+K shortcut)
- Notification center panel
- Skeleton loading states
- Mobile responsiveness improvements
- Onboarding flow for new users

### Future Sprints (Planned)
- Sprint 5: Form components, tooltips, dropdown menus
- Sprint 6: Data visualization, charts, progress tracking
- Sprint 7: Course player interface, video controls
- Sprint 8: Settings pages, accessibility improvements
