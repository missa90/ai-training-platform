# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Memory Retrieval Guide

When you need to recall past decisions, context, or learnings that aren't in this file:

### How to Search Memory

1. **Recent sessions** (last 30 days):
   ```bash
   # Search for keywords in session files
   Grep pattern="keyword" path="memory/sessions/"

   # List recent session files
   Glob pattern="memory/sessions/*.md"
   ```

2. **Archived memories** (older than 60 days):
   ```bash
   # Search archived items
   Grep pattern="keyword" path="memory/archived/"

   # Browse by month
   Glob pattern="memory/archived/YYYY-MM/*.md"
   ```

3. **By memory type**:
   - Decisions: Search for `Type: DECISION` or decision keywords
   - Solutions: Search for `Type: SOLUTION` or bug fixes
   - Learnings: Search for `Type: LEARNING` or technical insights
   - Patterns: Search for `Pattern observed` or recurring issues

4. **By tags**:
   ```bash
   Grep pattern="#tag-name" path="memory/"
   ```

### Memory File Locations

| Location | Contains | Retention |
|----------|----------|-----------|
| `memory/sessions/` | Raw session captures (sprints, planning, reviews) | 60 days |
| `memory/archived/` | Pruned but preserved items (historical reference) | Permanent |
| `memory/metadata/` | Importance scores, access logs | Permanent |

### When to Search Memory

- Before making architectural decisions (check for prior context)
- When user asks "what did we decide about X?"
- When encountering familiar problems (search for past solutions)
- When experiencing similar bugs (pattern matching)
- During sprint planning (check for velocity patterns)

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

## Validated Technical Patterns (Cross-Sprint Consolidation)

### Pattern 1: CSS-Only Component Philosophy (Sprints 5-6-7)
- **Evidence**: Tooltips (S5), Charts (S6), Course Animations (S7)
- **Validated Benefit**: Reduced bundle size, GPU-accelerated transforms, minimal reflow
- **Guidance**: Use CSS animations where possible; reserve JavaScript for initialization only
- **Exception**: Complex state management (use JS; CSS can't manage dynamic data)

### Pattern 2: Intersection Observer for Animation Performance (Sprints 6-7)
- **Evidence**: Chart animations (S6), Course component initialization (S7)
- **Validated Benefit**: Defers non-critical animations, improves perceived performance
- **Guidance**: Wrap scroll-triggered animations in Intersection Observer pattern
- **Implementation**: Single observer instance with multiple targets, stagger using index

### Pattern 3: Scenario-Based Learning for Content (Sprint 7)
- **Evidence**: Context Loss Timeline (4-day project), RAG demo (real query patterns)
- **Validated Benefit**: Increases emotional resonance, improves retention
- **Guidance**: Frame AI concepts within realistic business problems
- **Application**: Use for future course sections and concepts

### Pattern 4: Side-by-Side Comparison for Clarity (Sprint 7)
- **Evidence**: RAG in Action (Without RAG vs With RAG), improvement visualization
- **Validated Benefit**: Helps users understand value proposition, visual learning
- **Guidance**: When comparing features or approaches, show parallel before/after
- **Extension Opportunity**: Apply to other concept pairs (memory vs. no memory, etc.)

### Pattern 5: Grid-Based Layouts for Complex Components (Sprint 6-7)
- **Evidence**: Learning path refactor (S6), multi-section lesson layout (S7)
- **Validated Benefit**: Superior to flex+absolute positioning, better responsive behavior
- **Guidance**: Favor CSS Grid for 2D+ layouts; Flexbox for 1D linear arrangements
- **Anti-Pattern**: Mixing flex + absolute positioning (causes maintenance headaches)

### Pattern 6: Hidden Demo Sections for Feature Preservation (Sprints 4-6)
- **Evidence**: Settings (S4), Analytics (S6), future sections (S7)
- **Validated Benefit**: Implement without cluttering demo experience
- **Guidance**: Build features, hide via `display: none`, unhide for production
- **Implementation**: Use CSS class toggles or data attributes for feature flags

## Technical Patterns & Best Practices

### Component Architecture (Validated across Sprints 5-7)

**CSS-Only First Philosophy**:
- Tooltips, charts, progress components all use pure CSS animations
- Reduces bundle size and external dependencies
- Use JavaScript only for initialization (Intersection Observer patterns)
- Benefit: GPU-accelerated transforms, minimal reflow/repaint

**Layout Strategy by Complexity**:
- Simple items (1D): Use Flexbox
- Complex grid layouts (2D+): Use CSS Grid (proven in Sprint 6 learning path refactor)
- Avoid mixing flex + absolute positioning (causes maintenance headaches)

**Animation Orchestration**:
- Use Intersection Observer to defer non-critical animations
- Stagger animations using CSS custom properties and JavaScript index calculation
- Animation triggers should match user scroll position (perceived performance boost)

**Demo vs. Production**:
- Implement features in code but hide non-essential sections via CSS (`display: none`)
- Preserve for future use without cluttering current demo
- Example: Settings and Analytics sections in dashboard

### File Organization Pattern
- Component styles by domain: `components/charts.css`, `components/progress.css`, `components/stats.css`
- Page-specific overrides in `pages/[page-name].css` (e.g., courses.css for learning path)
- Base tokens and resets remain in `base/` (single source of truth)

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

### Sprint 5 (Completed - Jan 2026)
- Form components (inputs, textarea, select, checkbox, radio, toggle)
- Form validation states (error, success)
- Tooltips (CSS-only with data attributes, JS popovers)
- Dropdown menus (action menus, user menus, context menus)
- Settings section with demo forms
- Keyboard shortcut (kbd) styling

### Sprint 6 (Completed - Jan 2026) - Data Visualization & Charts
- CSS-only charts (line, bar, donut, sparklines) - no external libraries
- Progress components (milestone trackers, XP progress bars)
- Stats cards with metric displays
- Activity heatmaps (30-day streak calendar grid)
- Intersection Observer for scroll-triggered animations
- Learning path refactor: grid-based layout (replaced flex + absolute positioning)
- Bug fixes: Heatmap grid display, learning path overlapping elements
- Commit: 6a76cf6

**Key Technical Decisions**:
- CSS-only charts for performance (eliminates library dependencies)
- Intersection Observer for animation efficiency (lazy initialization on scroll)
- CSS Grid for complex multi-row layouts (superior to flex + positioning)

**Consolidated Pattern**: CSS-only component philosophy extending from Sprint 5 tooltips

**Impact**: Clean, performant visualization layer ready for dashboard analytics integration

### Sprint 7 (In Progress - Jan 2026) - Course Lesson Page & Interactive Components
- Course lesson page with slide-based navigation (presentation-style layout)
- Keyboard navigation (arrow keys for slide switching)
- Context Engineering course content and interactive demos
- Context Window Demo: Interactive token meter with overflow animation
- Context Loss Timeline: 4-day project scenario with crisis points and "Time Lost" counter
- RAG in Action Demo: Split-screen comparison (Without RAG vs With RAG)
- Research Agent content pipeline: Research Report → Outline → Implementation
- CSS-only animations following Sprint 5-6 patterns
- Intersection Observer for scroll-triggered component initialization
- Commit: (pending - in progress)

**Key Decisions**:
- Slide-based architecture for sequential storytelling
- CSS-only animations for performance (no animation libraries)
- Research-first content pipeline (AI agents validate accuracy)
- Deferred sections 4-6 after establishing patterns with first 3 sections

**Consolidated Patterns**:
- Scenario-based learning (fictional but realistic business problems)
- Side-by-side comparison visualization (before/after, with/without)
- Animation-first content delivery (visual concepts before text)

**Planned Remaining Work**:
- Section 4: Your Tools Today (Memory Feature Explorer)
- Section 5: Daily Best Practices (Interactive Habit Builder)
- Section 6: What's Coming Next (Future Timeline)
- Mobile responsiveness testing
- Final git commit

### Future Sprints (Planned)
- Sprint 8: Settings pages, accessibility improvements
- Sprint 9: Advanced animations, performance optimization
- Sprint 10+: Additional course content modules
