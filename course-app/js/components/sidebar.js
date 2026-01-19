/**
 * ============================================
 * SIDEBAR NAVIGATION COMPONENT
 * ============================================
 * Handles sidebar interactivity including:
 * - Collapse/expand on tablet breakpoint
 * - Mobile menu toggle
 * - Active state management
 * - Progress ring animation
 * - XP bar animation
 * - Smooth transitions and accessibility
 * ============================================
 */

class Sidebar {
  constructor(options = {}) {
    // Configuration
    this.config = {
      sidebarSelector: '.sidebar',
      toggleSelector: '.sidebar__toggle',
      mobileToggleSelector: '.sidebar__mobile-toggle',
      itemSelector: '.sidebar__item',
      progressRingSelector: '.sidebar__progress-ring-fill',
      xpBarSelector: '.sidebar__user-xp-fill',
      collapsedClass: 'collapsed',
      openClass: 'open',
      activeClass: 'active',
      tabletBreakpoint: 1024,
      mobileBreakpoint: 768,
      storageKey: 'sidebar-collapsed',
      animationDuration: 300,
      ...options
    };

    // DOM elements
    this.sidebar = document.querySelector(this.config.sidebarSelector);
    this.toggle = document.querySelector(this.config.toggleSelector);
    this.mobileToggle = document.querySelector(this.config.mobileToggleSelector);
    this.items = document.querySelectorAll(this.config.itemSelector);
    this.progressRing = document.querySelector(this.config.progressRingSelector);
    this.xpBar = document.querySelector(this.config.xpBarSelector);

    // State
    this.isCollapsed = false;
    this.isMobileOpen = false;
    this.currentPath = window.location.pathname;

    if (!this.sidebar) {
      console.warn('Sidebar element not found');
      return;
    }

    this.init();
  }

  /**
   * Initialize sidebar functionality
   */
  init() {
    this.restoreState();
    this.setupEventListeners();
    this.setActiveItem();
    this.animateProgressRing();
    this.animateXPBar();
    this.handleResize();
  }

  /**
   * Restore sidebar state from localStorage
   */
  restoreState() {
    const savedState = localStorage.getItem(this.config.storageKey);
    if (savedState === 'true' && window.innerWidth >= this.config.mobileBreakpoint) {
      this.collapse();
    }
  }

  /**
   * Save sidebar state to localStorage
   */
  saveState() {
    localStorage.setItem(this.config.storageKey, this.isCollapsed);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Desktop/tablet toggle
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleCollapse());
    }

    // Mobile toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobile());
    }

    // Nav items
    this.items.forEach(item => {
      item.addEventListener('click', (e) => this.handleItemClick(e, item));
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (this.isMobileOpen &&
          !this.sidebar.contains(e.target) &&
          !this.mobileToggle.contains(e.target)) {
        this.closeMobile();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());

    // Keyboard accessibility
    this.sidebar.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  /**
   * Toggle sidebar collapse (desktop/tablet)
   */
  toggleCollapse() {
    if (this.isCollapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  /**
   * Collapse sidebar
   */
  collapse() {
    this.sidebar.classList.add(this.config.collapsedClass);
    this.isCollapsed = true;
    this.saveState();
    this.announceState('Sidebar collapsed');
  }

  /**
   * Expand sidebar
   */
  expand() {
    this.sidebar.classList.remove(this.config.collapsedClass);
    this.isCollapsed = false;
    this.saveState();
    this.announceState('Sidebar expanded');
  }

  /**
   * Toggle mobile menu
   */
  toggleMobile() {
    if (this.isMobileOpen) {
      this.closeMobile();
    } else {
      this.openMobile();
    }
  }

  /**
   * Open mobile menu
   */
  openMobile() {
    this.sidebar.classList.add(this.config.openClass);
    this.isMobileOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    this.announceState('Menu opened');
  }

  /**
   * Close mobile menu
   */
  closeMobile() {
    this.sidebar.classList.remove(this.config.openClass);
    this.isMobileOpen = false;
    document.body.style.overflow = '';
    this.announceState('Menu closed');
  }

  /**
   * Handle item click
   */
  handleItemClick(e, item) {
    const href = item.getAttribute('href');

    // If it's a valid link, set active state
    if (href && href !== '#') {
      this.setActiveItem(href);
    }

    // Close mobile menu on item click
    if (window.innerWidth < this.config.mobileBreakpoint) {
      setTimeout(() => this.closeMobile(), this.config.animationDuration);
    }

    // Custom event for analytics or app logic
    this.sidebar.dispatchEvent(new CustomEvent('sidebar:itemClick', {
      detail: {
        item,
        href,
        text: item.querySelector('.sidebar__item-text')?.textContent
      }
    }));
  }

  /**
   * Set active item based on current path or provided path
   */
  setActiveItem(path = null) {
    const targetPath = path || this.currentPath;

    this.items.forEach(item => {
      const itemPath = item.getAttribute('href');

      if (itemPath === targetPath) {
        item.classList.add(this.config.activeClass);
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove(this.config.activeClass);
        item.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Animate progress ring on load
   */
  animateProgressRing() {
    if (!this.progressRing) return;

    const percentage = parseInt(this.progressRing.getAttribute('data-progress') || 65);
    const radius = 54; // Circle radius
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Set initial state
    this.progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    this.progressRing.style.strokeDashoffset = circumference;

    // Animate after a short delay
    setTimeout(() => {
      this.progressRing.style.strokeDashoffset = offset;
    }, 100);

    // Update percentage text with count-up animation
    const percentageElement = document.querySelector('.sidebar__progress-percentage');
    if (percentageElement) {
      this.animateNumber(percentageElement, 0, percentage, 1000);
    }
  }

  /**
   * Animate XP bar on load
   */
  animateXPBar() {
    if (!this.xpBar) return;

    const current = parseInt(this.xpBar.getAttribute('data-current') || 2450);
    const max = parseInt(this.xpBar.getAttribute('data-max') || 3000);
    const percentage = (current / max) * 100;

    // Set initial state
    this.xpBar.style.width = '0%';

    // Animate after a short delay
    setTimeout(() => {
      this.xpBar.style.width = `${percentage}%`;
    }, 200);

    // Update XP text with count-up animation
    const xpCurrentElement = document.querySelector('.sidebar__user-xp-current');
    if (xpCurrentElement) {
      this.animateNumber(xpCurrentElement, 0, current, 1000, true);
    }
  }

  /**
   * Animate number count-up
   */
  animateNumber(element, start, end, duration, useCommas = false) {
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const current = Math.floor(start + (end - start) * easeOut);
      element.textContent = useCommas ? current.toLocaleString() : current;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = useCommas ? end.toLocaleString() : end;
      }
    };

    requestAnimationFrame(updateNumber);
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const width = window.innerWidth;

    // Close mobile menu on resize to tablet/desktop
    if (width >= this.config.mobileBreakpoint && this.isMobileOpen) {
      this.closeMobile();
    }

    // Auto-collapse on tablet, expand on desktop
    if (width >= this.config.mobileBreakpoint && width < this.config.tabletBreakpoint) {
      // Tablet: collapse by default
      if (!this.isCollapsed) {
        this.collapse();
      }
    } else if (width >= this.config.tabletBreakpoint) {
      // Desktop: restore saved state or expand
      const savedState = localStorage.getItem(this.config.storageKey);
      if (savedState !== 'true' && this.isCollapsed) {
        this.expand();
      }
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(e) {
    // ESC to close mobile menu
    if (e.key === 'Escape' && this.isMobileOpen) {
      this.closeMobile();
      this.mobileToggle?.focus();
    }

    // Arrow key navigation between items
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const focusedItem = document.activeElement;
      const itemsArray = Array.from(this.items);
      const currentIndex = itemsArray.indexOf(focusedItem);

      if (currentIndex !== -1) {
        e.preventDefault();
        const nextIndex = e.key === 'ArrowDown'
          ? (currentIndex + 1) % itemsArray.length
          : (currentIndex - 1 + itemsArray.length) % itemsArray.length;

        itemsArray[nextIndex].focus();
      }
    }
  }

  /**
   * Announce state changes for screen readers
   */
  announceState(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Update progress (for dynamic updates)
   */
  updateProgress(percentage) {
    if (!this.progressRing) return;

    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    this.progressRing.style.strokeDashoffset = offset;
    this.progressRing.setAttribute('data-progress', percentage);

    const percentageElement = document.querySelector('.sidebar__progress-percentage');
    if (percentageElement) {
      const currentValue = parseInt(percentageElement.textContent);
      this.animateNumber(percentageElement, currentValue, percentage, 500);
    }

    // Dispatch event for external listeners
    this.sidebar.dispatchEvent(new CustomEvent('sidebar:progressUpdate', {
      detail: { percentage }
    }));
  }

  /**
   * Update XP (for dynamic updates)
   */
  updateXP(current, max) {
    if (!this.xpBar) return;

    const percentage = (current / max) * 100;
    this.xpBar.style.width = `${percentage}%`;
    this.xpBar.setAttribute('data-current', current);
    this.xpBar.setAttribute('data-max', max);

    const xpCurrentElement = document.querySelector('.sidebar__user-xp-current');
    const xpMaxElement = document.querySelector('.sidebar__user-xp-max');

    if (xpCurrentElement) {
      const currentValue = parseInt(xpCurrentElement.textContent.replace(/,/g, ''));
      this.animateNumber(xpCurrentElement, currentValue, current, 500, true);
    }

    if (xpMaxElement) {
      xpMaxElement.textContent = max.toLocaleString();
    }

    // Dispatch event for external listeners
    this.sidebar.dispatchEvent(new CustomEvent('sidebar:xpUpdate', {
      detail: { current, max, percentage }
    }));
  }

  /**
   * Update badge count
   */
  updateBadge(itemSelector, count) {
    const item = document.querySelector(itemSelector);
    if (!item) return;

    let badge = item.querySelector('.sidebar__item-badge');

    if (count > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'sidebar__item-badge';
        item.appendChild(badge);
      }
      badge.textContent = count > 99 ? '99+' : count;
    } else if (badge) {
      badge.remove();
    }
  }

  /**
   * Destroy sidebar instance
   */
  destroy() {
    // Remove event listeners
    if (this.toggle) {
      this.toggle.removeEventListener('click', this.toggleCollapse);
    }
    if (this.mobileToggle) {
      this.mobileToggle.removeEventListener('click', this.toggleMobile);
    }

    // Reset body overflow
    document.body.style.overflow = '';

    // Clear state
    this.isCollapsed = false;
    this.isMobileOpen = false;
  }
}

/**
 * ============================================
 * AUTO-INITIALIZATION
 * ============================================
 * Initialize sidebar when DOM is ready
 */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.sidebar = new Sidebar();
    });
  } else {
    window.sidebar = new Sidebar();
  }
}

/**
 * ============================================
 * EXPORTS
 * ============================================
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sidebar;
}
