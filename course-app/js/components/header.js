/**
 * Header Component - AI Training Platform
 * Handles search trigger, notifications, user menu, and streak badge
 */

class Header {
  constructor() {
    this.elements = {
      searchTrigger: document.querySelector('.header__search-trigger'),
      notificationsTrigger: document.querySelector('.header__notifications'),
      userMenuTrigger: document.querySelector('.header__user'),
      streakBadge: document.querySelector('.header__streak'),
    };

    this.state = {
      userMenuOpen: false,
      notificationsOpen: false,
    };

    this.init();
  }

  init() {
    this.setupSearchTrigger();
    this.setupKeyboardShortcuts();
    this.setupNotifications();
    this.setupUserMenu();
    this.setupStreakAnimation();
  }

  /**
   * Setup global search trigger
   */
  setupSearchTrigger() {
    if (!this.elements.searchTrigger) return;

    this.elements.searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSearch();
    });

    // Accessibility: Enter key activation
    this.elements.searchTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openSearch();
      }
    });
  }

  /**
   * Setup keyboard shortcuts (Cmd+K or Ctrl+K)
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }

      // Escape key to close any open menus
      if (e.key === 'Escape') {
        this.closeAllMenus();
      }
    });
  }

  /**
   * Open global search modal
   * TODO: Integrate with actual search component
   */
  openSearch() {
    // Placeholder for search modal integration
    // This will be connected to the actual search modal component later
    // Example: window.searchModal?.open();

    // Show user feedback
    this.showTemporaryFeedback(this.elements.searchTrigger);
  }

  /**
   * Setup notifications trigger
   */
  setupNotifications() {
    if (!this.elements.notificationsTrigger) return;

    this.elements.notificationsTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleNotifications();
    });

    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
      if (
        this.state.notificationsOpen &&
        !this.elements.notificationsTrigger.contains(e.target)
      ) {
        this.closeNotifications();
      }
    });
  }

  /**
   * Toggle notifications panel
   * TODO: Integrate with actual notifications component
   */
  toggleNotifications() {
    this.state.notificationsOpen = !this.state.notificationsOpen;

    if (this.state.notificationsOpen) {
      this.elements.notificationsTrigger.classList.add('is-active');

      // Close user menu if open
      this.closeUserMenu();

      // Placeholder for notifications panel integration
      // Example: window.notificationsPanel?.open();
    } else {
      this.closeNotifications();
    }
  }

  /**
   * Close notifications panel
   */
  closeNotifications() {
    this.state.notificationsOpen = false;
    this.elements.notificationsTrigger?.classList.remove('is-active');

    // Placeholder for notifications panel integration
    // Example: window.notificationsPanel?.close();
  }

  /**
   * Setup user menu trigger
   */
  setupUserMenu() {
    if (!this.elements.userMenuTrigger) return;

    this.elements.userMenuTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleUserMenu();
    });

    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        this.state.userMenuOpen &&
        !this.elements.userMenuTrigger.contains(e.target)
      ) {
        this.closeUserMenu();
      }
    });
  }

  /**
   * Toggle user menu dropdown
   * TODO: Integrate with actual user menu component
   */
  toggleUserMenu() {
    this.state.userMenuOpen = !this.state.userMenuOpen;

    if (this.state.userMenuOpen) {
      this.elements.userMenuTrigger.classList.add('is-open');

      // Close notifications if open
      this.closeNotifications();

      // Placeholder for user menu dropdown integration
      // Example: window.userMenuDropdown?.open();
    } else {
      this.closeUserMenu();
    }
  }

  /**
   * Close user menu
   */
  closeUserMenu() {
    this.state.userMenuOpen = false;
    this.elements.userMenuTrigger?.classList.remove('is-open');

    // Placeholder for user menu dropdown integration
    // Example: window.userMenuDropdown?.close();
  }

  /**
   * Close all open menus
   */
  closeAllMenus() {
    this.closeNotifications();
    this.closeUserMenu();
  }

  /**
   * Setup streak badge pulse animation on load
   */
  setupStreakAnimation() {
    if (!this.elements.streakBadge) return;

    // Wait for initial animation to complete
    setTimeout(() => {
      this.elements.streakBadge.classList.add('is-pulsing');

      // Stop pulsing after 2 cycles (4 seconds)
      setTimeout(() => {
        this.elements.streakBadge.classList.remove('is-pulsing');
      }, 4000);
    }, 500);
  }

  /**
   * Show temporary visual feedback on element
   * @param {HTMLElement} element - Element to show feedback on
   */
  showTemporaryFeedback(element) {
    if (!element) return;

    element.style.transform = 'scale(0.98)';
    setTimeout(() => {
      element.style.transform = '';
    }, 100);
  }

  /**
   * Update notification badge count
   * @param {number} count - Number of unread notifications
   */
  updateNotificationCount(count) {
    const badge = this.elements.notificationsTrigger?.querySelector(
      '.header__notification-badge'
    );

    if (!badge) return;

    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count.toString();
      badge.style.display = 'flex';

      // Animate badge update
      badge.style.animation = 'none';
      setTimeout(() => {
        badge.style.animation = '';
      }, 10);
    } else {
      badge.style.display = 'none';
    }
  }

  /**
   * Update streak count
   * @param {number} days - Number of consecutive days
   */
  updateStreakCount(days) {
    const streakText = this.elements.streakBadge?.querySelector(
      '.header__streak-text'
    );

    if (!streakText) return;

    streakText.textContent = `${days} day streak`;

    // Pulse animation on update
    this.elements.streakBadge.classList.add('is-pulsing');
    setTimeout(() => {
      this.elements.streakBadge.classList.remove('is-pulsing');
    }, 2000);
  }

  /**
   * Update user avatar
   * @param {Object} userData - User data object
   * @param {string} userData.name - User's name
   * @param {string} [userData.avatar] - URL to avatar image
   */
  updateUserAvatar(userData) {
    const avatar = this.elements.userMenuTrigger?.querySelector(
      '.header__user-avatar'
    );

    if (!avatar) return;

    if (userData.avatar) {
      avatar.innerHTML = `<img src="${userData.avatar}" alt="${userData.name}">`;
    } else {
      // Show initials if no avatar
      const initials = userData.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      avatar.textContent = initials;
    }
  }
}

// Initialize header when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.headerComponent = new Header();
  });
} else {
  window.headerComponent = new Header();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Header;
}
