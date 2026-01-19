# Header Component

A refined, accessible header bar for the AI Training Platform with global search, streak tracking, notifications, and user menu.

## Features

- **Global Search Trigger**: Keyboard shortcut (Cmd+K/Ctrl+K) with visual kbd badge
- **Streak Badge**: Animated badge showing user's learning streak with fire icon
- **Notifications**: Bell icon with count badge and pulse animations
- **User Menu**: Avatar with dropdown trigger
- **Fully Accessible**: Keyboard navigation, ARIA labels, focus states
- **Responsive**: Adapts from mobile to desktop viewports
- **Micro-interactions**: Subtle hover states, pulse animations, smooth transitions

## File Structure

```
course-app/
├── css/
│   └── components/
│       └── header.css           # Complete header styling
├── js/
│   └── components/
│       └── header.js            # Header interactivity
├── examples/
│   └── header-demo.html         # Live demo page
└── docs/
    └── components/
        └── header.md            # This file
```

## HTML Structure

```html
<header class="header">
  <div class="header__inner">
    <!-- Global Search Trigger -->
    <button class="header__search-trigger" type="button" aria-label="Open global search">
      <svg class="header__search-icon icon icon--search">...</svg>
      <span class="header__search-placeholder">Search courses, lessons...</span>
      <kbd class="header__search-kbd">
        <span>⌘</span>
        <span>K</span>
      </kbd>
    </button>

    <!-- Spacer -->
    <div class="header__spacer"></div>

    <!-- Streak Badge -->
    <div class="header__streak">
      <svg class="header__streak-icon icon icon--fire">...</svg>
      <span class="header__streak-text">7 day streak</span>
    </div>

    <!-- Notifications -->
    <button class="header__notifications" type="button" aria-label="Open notifications">
      <svg class="header__notifications-icon icon icon--bell">...</svg>
      <span class="header__notification-badge">5</span>
    </button>

    <!-- User Menu -->
    <button class="header__user" type="button" aria-label="Open user menu">
      <div class="header__user-avatar">JD</div>
      <svg class="header__user-dropdown-icon icon icon--chevron">...</svg>
    </button>
  </div>
</header>
```

## CSS Classes

### Layout
- `.header` - Main header container (sticky, 64px height)
- `.header__inner` - Flexbox inner container with padding

### Search
- `.header__search-trigger` - Search button (300px wide on desktop)
- `.header__search-icon` - Search icon (20px)
- `.header__search-placeholder` - Placeholder text
- `.header__search-kbd` - Keyboard shortcut badge

### Streak
- `.header__streak` - Streak badge container
- `.header__streak-icon` - Fire icon
- `.header__streak-text` - "X day streak" text
- `.header__streak.is-pulsing` - Add pulsing animation

### Notifications
- `.header__notifications` - Notification button
- `.header__notifications-icon` - Bell icon
- `.header__notification-badge` - Count badge (positioned top-right)
- `.header__notifications.is-active` - Active state
- `.header__notifications.is-loading` - Loading animation

### User Menu
- `.header__user` - User menu button
- `.header__user-avatar` - Avatar circle (32px)
- `.header__user-dropdown-icon` - Chevron icon
- `.header__user.is-open` - Open state (rotates chevron)

## JavaScript API

### Initialization

The header component auto-initializes on `DOMContentLoaded`:

```javascript
// Accessed globally
window.headerComponent
```

### Methods

#### `updateNotificationCount(count)`
Update notification badge count.

```javascript
headerComponent.updateNotificationCount(5);  // Shows "5"
headerComponent.updateNotificationCount(150); // Shows "99+"
headerComponent.updateNotificationCount(0);   // Hides badge
```

#### `updateStreakCount(days)`
Update streak badge count.

```javascript
headerComponent.updateStreakCount(14); // "14 day streak"
```

#### `updateUserAvatar(userData)`
Update user avatar with name and optional image.

```javascript
headerComponent.updateUserAvatar({
  name: 'John Doe',
  avatar: '/path/to/avatar.jpg' // Optional
});
```

#### `closeAllMenus()`
Close all open dropdowns/panels.

```javascript
headerComponent.closeAllMenus();
```

### Event Handlers (Placeholders)

The following methods are placeholders for integration with other components:

- `openSearch()` - Opens global search modal
- `toggleNotifications()` - Opens/closes notifications panel
- `toggleUserMenu()` - Opens/closes user menu dropdown

**Example integration:**

```javascript
// In header.js, modify openSearch():
openSearch() {
  console.log('🔍 Opening global search...');

  // Replace with actual modal
  window.searchModal?.open(); // Your search modal component
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` (Mac) / `Ctrl+K` (Windows) | Open global search |
| `Escape` | Close all menus |
| `Enter` / `Space` | Activate focused button |
| `Tab` | Navigate between elements |

## Responsive Behavior

### Desktop (≥ 768px)
- Search: 320px width with placeholder and kbd badge
- Streak: Shows icon + text
- All elements visible

### Tablet (< 768px)
- Search: 200px width, no placeholder, no kbd badge
- Streak: Icon only, no text
- Reduced padding and gaps

### Mobile (< 480px)
- Search: 40px icon-only button
- Streak: Icon only
- Minimal spacing

## Accessibility

- **ARIA labels**: All interactive elements have descriptive labels
- **Keyboard navigation**: Full keyboard support for all interactions
- **Focus indicators**: Custom focus-visible states with pulse animation
- **Screen reader support**: Proper semantic HTML and ARIA attributes
- **High contrast mode**: Increased border widths
- **Reduced motion**: Respects `prefers-reduced-motion` preference

## Animations

### Streak Badge
- **Entry**: Scale + fade animation on load
- **Pulse**: Optional pulsing ring effect (triggered on load and updates)

### Notification Badge
- **Bounce**: Spring animation when count changes

### Interactive Elements
- **Hover**: Subtle color and transform transitions
- **Active**: Pressed state with scale
- **Focus**: Pulsing outline animation

## Design Tokens Used

**Colors:**
- `--bg-primary`, `--bg-tertiary`, `--bg-quaternary`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--accent-primary`, `--accent-amber`, `--accent-error`
- `--border-subtle`, `--border-default`

**Spacing:**
- `--space-2`, `--space-3`, `--space-4`, `--space-6`
- `--header-height` (64px)

**Typography:**
- `--font-body`, `--font-mono`
- `--text-xs`, `--text-sm`
- `--font-medium`, `--font-semibold`, `--font-bold`

**Transitions:**
- `--duration-fast`, `--duration-normal`, `--duration-slow`
- `--ease-out`, `--ease-spring`, `--ease-in-out`

**Radius:**
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`

**Z-index:**
- `--z-sticky` (200)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

**CSS Features Used:**
- CSS Custom Properties
- Flexbox
- CSS Grid (not used but compatible)
- `backdrop-filter` (with fallback)
- CSS Transitions/Animations
- `focus-visible` pseudo-class

## Integration Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/css/base/tokens.css">
  <link rel="stylesheet" href="/css/base/reset.css">
  <link rel="stylesheet" href="/css/base/typography.css">
  <link rel="stylesheet" href="/css/components/header.css">
</head>
<body>
  <header class="header">
    <!-- Header content -->
  </header>

  <script src="/js/components/header.js"></script>
  <script>
    // Access header component
    window.addEventListener('load', () => {
      // Update notification count from API
      fetch('/api/notifications/count')
        .then(r => r.json())
        .then(data => {
          window.headerComponent.updateNotificationCount(data.unread);
        });

      // Update streak from API
      fetch('/api/user/streak')
        .then(r => r.json())
        .then(data => {
          window.headerComponent.updateStreakCount(data.days);
        });
    });
  </script>
</body>
</html>
```

## Customization

### Change Colors

Modify design tokens in `tokens.css`:

```css
:root {
  --accent-amber: #your-color;      /* Streak badge color */
  --accent-error: #your-color;      /* Notification badge */
  --accent-primary: #your-color;    /* Focus states */
}
```

### Adjust Sizes

```css
:root {
  --header-height: 72px;  /* Increase header height */
}
```

### Disable Animations

```css
.header__streak {
  animation: none !important;
}

.header__notification-badge {
  animation: none !important;
}
```

## Testing Checklist

- [ ] Cmd+K / Ctrl+K opens search
- [ ] Escape closes all menus
- [ ] Notification badge shows correct count
- [ ] Notification badge hides when count is 0
- [ ] Streak badge animates on load
- [ ] All buttons respond to keyboard (Enter, Space)
- [ ] Focus indicators visible on all interactive elements
- [ ] Hover states work on all buttons
- [ ] Responsive layout works at all breakpoints
- [ ] Screen reader announces all elements correctly
- [ ] High contrast mode shows visible borders

## Demo

View the live demo at:
```
/examples/header-demo.html
```

Open in browser and test:
- Click all interactive elements
- Press Cmd+K or Ctrl+K
- Use Tab to navigate
- Check console for event logs
- Use demo buttons to update counts

## Future Enhancements

**Planned:**
- [ ] Search modal component integration
- [ ] Notifications panel component
- [ ] User menu dropdown component
- [ ] Streak detail tooltip
- [ ] Dark/light theme toggle
- [ ] Profile settings shortcut
- [ ] Quick action menu

**Possible:**
- Avatar upload from header
- Inline search results preview
- Notification grouping by type
- Streak milestone celebrations
- Customizable keyboard shortcuts
