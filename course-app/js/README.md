# JavaScript Architecture

This directory contains the JavaScript for the AI Training Platform.

## File Structure

```
js/
├── main.js                 # Central initialization and shared utilities
├── ai-fundamentals.js      # AI Fundamentals course specific logic
├── components/             # Reusable component scripts
│   ├── header.js           # Header interactions (search, notifications, user menu)
│   ├── sidebar.js          # Sidebar collapse/expand functionality
│   ├── theme-switcher.js   # Light/dark/system theme handling
│   ├── context-window.js   # Context window demo component
│   ├── context-timeline.js # Context timeline demo component
│   ├── rag-demo.js         # RAG demonstration component
│   ├── memory-explorer.js  # Memory explorer demo component
│   ├── best-practices.js   # Best practices demo component
│   └── header-icons.js     # (UNUSED) SVG icon library with ES6 exports
└── pages/                  # Page-specific scripts
    ├── lesson.js           # Lesson page interactions
    └── profile.js          # Profile page interactions
```

## Patterns Used

### Component Initialization

Most components use one of two patterns:

**Class-based (header.js, sidebar.js)**
```javascript
class ComponentName {
  constructor() {
    this.init();
  }
  init() { /* ... */ }
}

// Auto-initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.componentName = new ComponentName();
});
```

**IIFE with Class (theme-switcher.js)**
```javascript
(function() {
  'use strict';

  class ThemeSwitcher { /* ... */ }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export
  window.ThemeSwitcher = ThemeSwitcher;
})();
```

Both patterns work well. The IIFE pattern provides better scope isolation.

## Known Issues

### header-icons.js (Unused)
This file exports an icon library using ES6 module syntax (`export const`), but the project doesn't use a bundler and loads scripts via `<script>` tags without `type="module"`. This file is effectively dead code.

**Options:**
- Convert to window global export for use without modules
- Remove if icons are embedded in HTML
- Add bundler (webpack/vite) to enable ES6 imports

### Large Files
- `main.js` (~989 lines) - Consider splitting by feature
- `ai-fundamentals.js` (~872 lines) - Acceptable (course-specific)

## Loading Order

Scripts should be loaded in this order:
1. theme-switcher.js (applies theme before render)
2. sidebar.js
3. header.js
4. main.js (initializes Intersection Observer animations)
5. Page-specific scripts

## Custom Events

The theme switcher dispatches:
```javascript
window.dispatchEvent(new CustomEvent('themechange', {
  detail: { theme: 'light|dark|system', resolvedTheme: 'light|dark' }
}));
```

Components can listen:
```javascript
window.addEventListener('themechange', (e) => {
  console.log('Theme changed to:', e.detail.resolvedTheme);
});
```
