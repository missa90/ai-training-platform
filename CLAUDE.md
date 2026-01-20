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
  - **CRITICAL**: All colors MUST use CSS variables (var(--bg-primary), var(--overlay-bg), etc.)
  - Hardcoded colors break theme system; single rgba(10,10,11) hides UI in dark mode
- **Naming Convention**: BEM-like pattern (`.component__element--modifier`)
- **Dark Theme**: Default dark UI with accent colors (indigo primary, cyan, amber, purple)
- **Responsive Breakpoints**: 1400px, 1200px, 1024px, 768px, 640px, 480px
- **CSS @import Caching**: Add ?v=N query params to all @import statements to bypass browser caching
  - Example: `@import url('base/tokens.css?v=4');`
  - Browser caches @import files indefinitely; version params force refresh on changes

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

# CSS Cache-Busting for Development
# After modifying CSS files in base/, layouts/, components/, pages/, or utilities/:
# 1. Edit course-app/css/main.css
# 2. Update ?v=N query param (increment version number on all @import statements)
# 3. Save and reload browser page (browser will fetch fresh CSS due to new URL)
# Example: @import url('base/tokens.css?v=4'); → @import url('base/tokens.css?v=5');
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

### Pattern 7: CSS @import Cache-Busting for Theme Systems (Jan 2026)
- **Evidence**: Theme toggle bug fixed via ?v=N query params on all imports
- **Validated Benefit**: Solves browser caching of CSS files, enables dynamic theme switching
- **Guidance**: Always add version query params to @import statements: `@import url('file.css?v=4');`
- **Anti-Pattern**: Relying on browser refresh to apply CSS changes in development

### Pattern 8: Hardcoded Colors Break Theme Systems (Jan 2026)
- **Evidence**: rgba(10, 10, 11) hardcoded dark color hides UI elements in dark mode
- **Validated Benefit**: Using CSS variables (var(--bg-primary), var(--overlay-bg)) ensures theme compliance
- **Guidance**: Code review rule: All colors must use CSS variables, no rgba() or hex hardcoding
- **Implementation**: Grep for hardcoded color patterns, enforce variable usage

### Pattern 9: Tabbed Interface for Multi-Demo Sections (Sprint 10)
- **Evidence**: Section 3 Capability Simulator with 5 interactive demo tabs (Email, Analysis, Code, Research, Creative)
- **Validated Benefit**: Single component hosts multiple realistic scenarios; users compare demos via tab switching without cognitive overload
- **Guidance**: Use tabbed patterns when presenting multiple scenarios that need context and comparison
- **Implementation**: CSS :checked selector for radio button tabs + CSS Grid for responsive content layout (no JavaScript tab libraries)
- **Anti-Pattern**: Avoid tabs with >8 items; usability degrades beyond this threshold
- **Application**: Ideal for capability demos, feature comparisons, multi-workflow sections

### Pattern 10: Quantified Metrics for Enterprise Content (Sprint 10)
- **Evidence**: Section 8 Success Stories with concrete numbers (66% customer service automation, 90% time saved on legal review)
- **Validated Benefit**: Metrics are memorable and measurable; enable ROI comparisons; build credibility with enterprise decision-makers
- **Guidance**: Always pair AI success stories with quantified metrics; format as "[Number]% [Outcome]" or "[Number] [Unit] [Outcome]"
- **Examples**: "66% customer service automation", "90% time saved on legal review", "40% code generation accuracy improvement"
- **Application**: Essential for enterprise positioning, buyer education, case study credibility
- **Strategic Impact**: Differentiates training as ROI-focused (not just conceptual)

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

### Sprint 7 (Completed - Jan 2026) - Course Lesson Page & Interactive Components
- Course lesson page with slide-based navigation (presentation-style layout)
- Keyboard navigation (arrow keys for slide switching)
- Context Engineering course content and interactive demos
- Context Window Demo: Interactive token meter with overflow animation
- Context Loss Timeline: 4-day project scenario with crisis points and "Time Lost" counter
- RAG in Action Demo: Split-screen comparison (Without RAG vs With RAG)
- Research Agent content pipeline: Research Report → Outline → Implementation
- CSS-only animations following Sprint 5-6 patterns
- Intersection Observer for scroll-triggered component initialization
- Commit: 67af8e7 (theme toggle bug fix, gradient removal, CSS refactoring)

**Theme Toggle Bug Fix (Jan 19)**:
- **Problem**: Light/dark mode toggle not applying CSS changes
- **Root Cause**: Browser CSS @import caching preventing dynamic theme updates
- **Solution**: Added ?v=4 cache-bust query params to all @import statements in main.css
- **Additional Refinements**:
  - Removed linear-gradient() from button and course card backgrounds
  - Replaced hardcoded rgba(10, 10, 11) colors with CSS variables (var(--bg-primary), var(--overlay-bg))
  - Result: Clean visual hierarchy, fully functional theme system
- **Established Patterns**: Cache-busting for CSS development, 100% CSS variable usage for colors
- **Impact**: Theme system now reliable; sets precedent for color management

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

### Sprint 9 (Completed - Jan 2026) - AI Fundamentals Training Module (Initial)
- Complete AI Fundamentals course with 6 interactive sections
- Section 1: What is AI? - Before/after marketing scenario comparison demo
- Section 2: How LLMs Work - Token visualization and next-word prediction bars
- Section 3: AI Capabilities - 3D flip cards (Writing, Analysis, Code, Research, Translation)
- Section 4: AI Limitations - Hallucination example with fact-checking scenario
- Section 5: Your First Prompts - Interactive prompt playground with analysis feedback
- Section 6: Next Steps - Course pathway timeline with completion stats

### Sprint 10 (Completed - Jan 2026) - AI Fundamentals Module Expansion
- **Module expansion: 6 → 11 sections (83% growth)** with comprehensive enterprise coverage
- **Strategic positioning**: Covers new user journey (what is AI) → evaluation (landscape, benchmarks) → implementation (success stories, context engineering)

**Section 3 Enhancement: Capability Simulator** (Replaces 3D flip cards)
- Tabbed interface with 5 interactive live demos: Email Drafting, Data Analysis, Code Generation, Research, Creative
- Click-to-generate simulation buttons with CSS spin loading animation
- Each demo grounded in realistic business scenarios (user personalization)
- Benefit: Users find "their" use case visible and interactive (vs. abstract examples)

**New Sections Added**:
- **Section 4**: The AI Landscape - OpenAI, Anthropic, Google, Meta profiles with model names, strengths, best-for guidance
- **Section 5**: Context Engineering - Animated stateless memory demo with message sequence replay and context component breakdown
- **Section 7**: Agentic vs Non-Agentic AI - Side-by-side comparison panels, flow diagrams, traits checklist, decision guidance
- **Section 8**: AI Success Stories - 4 enterprise case studies (Customer Service, Legal, Software Dev, Marketing) with quantified metrics
- **Section 9**: AI Benchmarks & Evaluation - Benchmark cards (MMLU, HumanEval, GPQA, SWE-bench) with ROI guidance

**Technical Implementation**:
- Tabbed interface: CSS :checked selector + radio buttons (no JS tab library)
- Demo buttons: CSS spin animation for loading states
- Case study cards: CSS Grid responsive layout with hover states
- Message sequences: Staggered CSS animations for visual pacing
- All animations follow CSS-only philosophy from Sprint 5-7

**New Code**: ~4000 lines (HTML +1850, CSS +2200, JS updated for 11 slides)
**CSS cache-bust**: Updated to ?v=6
**Files Modified**: ai-fundamentals.html, ai-fundamentals.css, ai-fundamentals.js, main.css

**Patterns Validated** (2 new):
- Pattern 9: Tabbed Interface for multi-demo sections (emerging, proven in Section 3)
- Pattern 10: Quantified Metrics for enterprise content (emerging, proven in Section 8)

**Enterprise Impact**:
- Positions module as ROI-focused training (metrics + success stories)
- Covers entire buyer journey in single integrated module
- Establishes clear differentiation: awareness → evaluation → implementation

**Remaining Work**: Sections 10-11 deferred (Memory Feature Explorer, What's Coming Next) - built but hidden for future launch

### Future Sprints (Planned)
- **Sprint 11**: Settings pages, accessibility improvements (validate tabbed UI pattern across accessibility standards)
- **Sprint 12**: Advanced animations, performance optimization (apply quantified metrics pattern to new courses)
- **Sprint 13**: Prompt Engineering Advanced course (builds on Section 5 Context Engineering)
- **Sprint 14**: AI + Company Data course (builds on Section 8 Success Stories framework)
- **Sprint 15+**: Additional vertical-specific training modules (Industry-specific AI applications)
