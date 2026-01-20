/**
 * Theme Switcher Component
 * Handles theme switching between light, dark, and system preferences
 */

(function() {
  'use strict';

  class ThemeSwitcher {
    constructor() {
      this.STORAGE_KEY = 'theme';
      this.THEMES = ['light', 'dark', 'system'];
      this.theme = this.getSavedTheme();

      this.init();
    }

    init() {
      this.applyTheme();
      this.setupSystemPreferenceListener();
      this.setupThemeSelector();
      this.setupHeaderToggle();
    }

    /**
     * Get saved theme from localStorage or default to 'system'
     */
    getSavedTheme() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return this.THEMES.includes(saved) ? saved : 'system';
      } catch {
        return 'system';
      }
    }

    /**
     * Set and save theme preference
     */
    setTheme(theme) {
      if (!this.THEMES.includes(theme)) return;

      this.theme = theme;
      try {
        localStorage.setItem(this.STORAGE_KEY, theme);
      } catch {
        // localStorage unavailable (private browsing)
      }
      this.applyTheme();
      this.updateThemeSelector();

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme: this.theme, resolvedTheme: this.getResolvedTheme() }
      }));
    }

    /**
     * Apply theme to document
     */
    applyTheme() {
      const root = document.documentElement;

      if (this.theme === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', this.theme);
      }

      // Update meta theme-color for mobile browsers
      this.updateMetaThemeColor();
    }

    /**
     * Get the actual theme being displayed (resolves 'system' to actual value)
     */
    getResolvedTheme() {
      if (this.theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      return this.theme;
    }

    /**
     * Update meta theme-color for mobile browsers
     */
    updateMetaThemeColor() {
      const resolvedTheme = this.getResolvedTheme();
      const themeColor = resolvedTheme === 'light' ? '#ffffff' : '#0a0a0b';

      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.content = themeColor;
    }

    /**
     * Listen for system preference changes
     */
    setupSystemPreferenceListener() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

      mediaQuery.addEventListener('change', () => {
        if (this.theme === 'system') {
          this.updateMetaThemeColor();
          // Dispatch event so components can react
          window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: 'system', resolvedTheme: this.getResolvedTheme() }
          }));
        }
      });
    }

    /**
     * Setup theme selector buttons if they exist
     */
    setupThemeSelector() {
      const selector = document.querySelector('.theme-selector');
      if (!selector) return;

      const buttons = selector.querySelectorAll('.theme-selector__btn');

      buttons.forEach(btn => {
        const theme = btn.dataset.theme;

        // Set initial state
        if (theme === this.theme) {
          btn.classList.add('theme-selector__btn--active');
          btn.setAttribute('aria-checked', 'true');
        } else {
          btn.setAttribute('aria-checked', 'false');
        }

        // Click handler
        btn.addEventListener('click', () => {
          this.setTheme(theme);
        });

        // Keyboard handler for radiogroup pattern
        btn.addEventListener('keydown', (e) => {
          this.handleSelectorKeyboard(e, buttons);
        });
      });
    }

    /**
     * Handle keyboard navigation for theme selector
     */
    handleSelectorKeyboard(e, buttons) {
      const buttonArray = Array.from(buttons);
      const currentIndex = buttonArray.indexOf(e.target);

      let newIndex;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          newIndex = (currentIndex + 1) % buttonArray.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          newIndex = (currentIndex - 1 + buttonArray.length) % buttonArray.length;
          break;
        default:
          return;
      }

      e.preventDefault();
      buttonArray[newIndex].focus();
      this.setTheme(buttonArray[newIndex].dataset.theme);
    }

    /**
     * Update theme selector UI
     */
    updateThemeSelector() {
      const buttons = document.querySelectorAll('.theme-selector__btn');

      buttons.forEach(btn => {
        const isActive = btn.dataset.theme === this.theme;
        btn.classList.toggle('theme-selector__btn--active', isActive);
        btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });
    }

    /**
     * Setup header toggle button (simple light/dark toggle)
     */
    setupHeaderToggle() {
      const toggleBtn = document.getElementById('themeToggle');
      if (!toggleBtn) return;

      toggleBtn.addEventListener('click', () => {
        // Toggle between light and dark (ignore system)
        const resolvedTheme = this.getResolvedTheme();
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
      });
    }
  }

  // Initialize on DOM ready
  function init() {
    window.themeSwitcher = new ThemeSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for module usage
  window.ThemeSwitcher = ThemeSwitcher;
})();
