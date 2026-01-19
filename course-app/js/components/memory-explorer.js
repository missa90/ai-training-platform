/**
 * Memory Explorer Component
 * Tabbed comparison of AI platform memory features
 */

(function() {
  'use strict';

  class MemoryExplorer {
    constructor(element) {
      this.element = element;
      this.currentTab = 'claude';

      this.init();
    }

    init() {
      this.cacheElements();
      this.bindEvents();
      this.showTab(this.currentTab);
    }

    cacheElements() {
      this.tabs = this.element.querySelectorAll('.memory-explorer__tab');
      this.panels = this.element.querySelectorAll('.memory-explorer__panel');
      this.comparisonToggle = this.element.querySelector('#comparisonToggle');
      this.comparisonSection = this.element.querySelector('.memory-explorer__comparison');
      this.comparisonTable = this.element.querySelector('#comparisonTable');
    }

    bindEvents() {
      // Tab clicks
      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabId = tab.dataset.tab;
          this.showTab(tabId);
        });
      });

      // Keyboard navigation for tabs
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('keydown', (e) => {
          this.handleTabKeyboard(e, index);
        });
      });

      // Comparison table toggle
      if (this.comparisonToggle) {
        this.comparisonToggle.addEventListener('click', () => {
          this.toggleComparison();
        });
      }
    }

    showTab(tabId) {
      this.currentTab = tabId;

      // Update tab states
      this.tabs.forEach(tab => {
        const isActive = tab.dataset.tab === tabId;
        tab.classList.toggle('memory-explorer__tab--active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Update panel states with animation
      this.panels.forEach(panel => {
        const isActive = panel.dataset.panel === tabId;

        if (isActive) {
          panel.classList.add('memory-explorer__panel--active');
          // Trigger reflow for animation
          panel.offsetHeight;
        } else {
          panel.classList.remove('memory-explorer__panel--active');
        }
      });
    }

    handleTabKeyboard(e, currentIndex) {
      const tabCount = this.tabs.length;
      let newIndex = currentIndex;

      switch (e.key) {
        case 'ArrowLeft':
          newIndex = (currentIndex - 1 + tabCount) % tabCount;
          break;
        case 'ArrowRight':
          newIndex = (currentIndex + 1) % tabCount;
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = tabCount - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      this.tabs[newIndex].focus();
      this.showTab(this.tabs[newIndex].dataset.tab);
    }

    toggleComparison() {
      const isOpen = this.comparisonSection.classList.toggle('memory-explorer__comparison--open');

      // Update toggle button text
      const toggleText = this.comparisonToggle.querySelector('span');
      if (toggleText) {
        toggleText.textContent = isOpen ? 'Hide Comparison Table' : 'View Comparison Table';
      }

      // Smooth scroll to table if opening
      if (isOpen && this.comparisonTable) {
        setTimeout(() => {
          this.comparisonTable.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }, 100);
      }
    }
  }

  // Auto-initialize
  function init() {
    const memoryExplorer = document.getElementById('memoryExplorer');
    if (memoryExplorer) {
      window.memoryExplorer = new MemoryExplorer(memoryExplorer);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export
  window.MemoryExplorer = MemoryExplorer;
})();
