/**
 * Main JavaScript - AI Training Platform
 * Handles UI interactions, animations, and state management
 */

(function() {
  'use strict';

  // ========================================================================
  // Animated Counter
  // ========================================================================

  function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  // ========================================================================
  // Page Load Animation
  // ========================================================================

  function initPageLoadAnimation() {
    // Add loaded class to body after a brief delay to trigger page entrance
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.body.classList.add('loaded');
      }, 50);
    });
  }

  // ========================================================================
  // Scroll-triggered Animations
  // Enhanced Intersection Observer for smooth scroll reveals
  // ========================================================================

  function initScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Trigger 50px before element enters viewport
      threshold: 0.1 // Trigger when 10% of element is visible
    };

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add staggered delay for children
          const delay = parseInt(entry.target.dataset.delay, 10) || 0;

          setTimeout(() => {
            entry.target.classList.add('visible');

            // Trigger counter animation if it's a stat card
            const counter = entry.target.querySelector('[data-count]');
            if (counter && !counter.dataset.counted) {
              const target = parseInt(counter.dataset.count, 10);
              animateCounter(counter, target);
              counter.dataset.counted = 'true'; // Prevent re-triggering
            }
          }, delay);

          // Unobserve after animation to improve performance
          animationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      '.animate-fade-up, .animate-fade-in, .animate-scale-in, .animate-fade-down, .animate-fade-left, .animate-fade-right'
    );

    animatedElements.forEach((el, index) => {
      // Add automatic stagger delay if not already set
      if (!el.dataset.delay) {
        el.dataset.delay = index * 75; // 75ms stagger by default
      }
      animationObserver.observe(el);
    });
  }

  // ========================================================================
  // Progress Ring Animation
  // ========================================================================

  function initProgressRings() {
    document.querySelectorAll('.sidebar__progress-ring-fill').forEach(ring => {
      const progress = parseInt(ring.dataset.progress, 10) || 0;
      const radius = ring.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;

      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference;

      // Animate after a short delay
      setTimeout(() => {
        const offset = circumference - (progress / 100) * circumference;
        ring.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
        ring.style.strokeDashoffset = offset;
      }, 300);
    });
  }

  // ========================================================================
  // XP Bar Animation
  // ========================================================================

  function initXPBars() {
    document.querySelectorAll('.sidebar__user-xp-fill').forEach(bar => {
      const current = parseInt(bar.dataset.current, 10) || 0;
      const max = parseInt(bar.dataset.max, 10) || 100;
      const percentage = (current / max) * 100;

      bar.style.width = '0%';

      setTimeout(() => {
        bar.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        bar.style.width = `${percentage}%`;
      }, 500);
    });
  }

  // ========================================================================
  // Stagger Children Animation
  // Enhanced to support all stagger variants
  // ========================================================================

  function initStaggerAnimations() {
    // Handle all stagger variants
    const staggerConfigs = [
      { selector: '.stagger-children-50', delay: 50 },
      { selector: '.stagger-children-100', delay: 100 },
      { selector: '.stagger-children-150', delay: 150 },
      { selector: '.stagger-children-200', delay: 200 }
    ];

    staggerConfigs.forEach(({ selector, delay }) => {
      document.querySelectorAll(selector).forEach(container => {
        const children = Array.from(container.children);
        children.forEach((child, index) => {
          // Set CSS custom property for stagger index
          child.style.setProperty('--stagger-index', index);
          // Also set inline delay as fallback
          child.style.transitionDelay = `${index * delay}ms`;
        });
      });
    });
  }

  // ========================================================================
  // Mobile Menu Toggle
  // ========================================================================

  function initMobileMenu() {
    const mobileToggle = document.getElementById('sidebarMobileToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar--open');
        mobileToggle.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
      });

      // Close on overlay click
      if (overlay) {
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('sidebar--open');
          mobileToggle.classList.remove('active');
          overlay.classList.remove('active');
          document.body.classList.remove('sidebar-open');
        });
      }

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('sidebar--open')) {
          sidebar.classList.remove('sidebar--open');
          mobileToggle.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
          document.body.classList.remove('sidebar-open');
        }
      });
    }
  }

  // ========================================================================
  // Sidebar Collapse (Desktop/Tablet)
  // ========================================================================

  function initSidebarCollapse() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar--collapsed');
        if (mainContent) mainContent.classList.toggle('main-content--expanded');

        // Save state to localStorage
        try {
          const isCollapsed = sidebar.classList.contains('sidebar--collapsed');
          localStorage.setItem('sidebarCollapsed', isCollapsed);
        } catch {
          // localStorage unavailable
        }
      });

      // Restore state from localStorage
      try {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
          sidebar.classList.add('sidebar--collapsed');
          if (mainContent) mainContent.classList.add('main-content--expanded');
        }
      } catch {
        // localStorage unavailable
      }
    }
  }

  // ========================================================================
  // Focus Trap Utility
  // ========================================================================

  function createFocusTrap(container) {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    let previousActiveElement = null;

    function getFocusableElements() {
      return Array.from(container.querySelectorAll(focusableSelectors))
        .filter(el => el.offsetParent !== null); // Only visible elements
    }

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }

    return {
      activate() {
        previousActiveElement = document.activeElement;
        container.addEventListener('keydown', handleKeyDown);
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      },
      deactivate() {
        container.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElement && previousActiveElement.focus) {
          previousActiveElement.focus();
        }
      }
    };
  }

  // ========================================================================
  // Search Modal
  // ========================================================================

  function initSearchModal() {
    const searchTrigger = document.getElementById('searchTrigger');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const searchEmpty = document.getElementById('searchEmpty');
    const searchResults = document.getElementById('searchResults');

    // Create focus trap for the search modal
    const searchFocusTrap = searchModal ? createFocusTrap(searchModal) : null;

    // Sample search data
    const searchData = {
      courses: [
        { title: 'Prompt Engineering Mastery', meta: 'Intermediate - 4h 30m', href: 'courses.html' },
        { title: 'RAG Fundamentals', meta: 'Beginner - 3h', href: 'courses.html' },
        { title: 'AI Ethics & Safety', meta: 'Advanced - 2h 15m', href: 'courses.html' },
        { title: 'Fine-tuning LLMs', meta: 'Advanced - 5h', href: 'courses.html' },
        { title: 'AI for Business Leaders', meta: 'Beginner - 2h', href: 'courses.html' }
      ],
      tools: [
        { title: 'Prompt Playground', meta: 'Experiment with prompts', href: 'tools.html' },
        { title: 'Template Library', meta: '50+ templates', href: 'tools.html' },
        { title: 'Code Sandbox', meta: 'Test AI code', href: 'tools.html' },
        { title: 'Model Compare', meta: 'Compare outputs', href: 'tools.html' }
      ],
      community: [
        { title: 'Best practices for fine-tuning LLMs?', meta: '24 replies', href: 'community.html' },
        { title: 'Share your RAG implementation tips', meta: '18 replies', href: 'community.html' },
        { title: 'Prompt Engineering Study Group', meta: '156 members', href: 'community.html' }
      ]
    };

    function openSearch() {
      if (searchModal) {
        searchModal.classList.add('active');
        searchModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        // Activate focus trap and focus on search input
        if (searchFocusTrap) {
          searchFocusTrap.activate();
        }
        searchInput?.focus();
      }
    }

    function closeSearch() {
      if (searchModal) {
        searchModal.classList.remove('active');
        searchModal.setAttribute('aria-hidden', 'true');
        if (searchInput) searchInput.value = '';
        document.body.style.overflow = '';
        resetSearch();
        // Deactivate focus trap and restore focus
        if (searchFocusTrap) {
          searchFocusTrap.deactivate();
        }
      }
    }

    function resetSearch() {
      if (searchEmpty) searchEmpty.style.display = 'block';
      if (searchResults) searchResults.style.display = 'none';
    }

    function performSearch(query) {
      if (!query.trim()) {
        resetSearch();
        return;
      }

      const q = query.toLowerCase();
      const results = {
        courses: searchData.courses.filter(item => item.title.toLowerCase().includes(q)),
        tools: searchData.tools.filter(item => item.title.toLowerCase().includes(q)),
        community: searchData.community.filter(item => item.title.toLowerCase().includes(q))
      };

      const hasResults = results.courses.length || results.tools.length || results.community.length;

      if (hasResults) {
        if (searchEmpty) searchEmpty.style.display = 'none';
        if (searchResults) searchResults.style.display = 'block';

        // Render results
        renderResults('searchResultsCourses', results.courses, 'course');
        renderResults('searchResultsTools', results.tools, 'tool');
        renderResults('searchResultsCommunity', results.community, 'community');
      } else {
        resetSearch();
      }
    }

    /**
     * Sanitize text to prevent XSS
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    function sanitizeText(text) {
      const div = document.createElement('div');
      div.textContent = String(text || '');
      return div.textContent;
    }

    /**
     * Create SVG icon element safely
     * @param {string} type - Icon type (course, tool, community)
     * @returns {SVGElement} SVG element
     */
    function createIconSvg(type) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', '20');
      svg.setAttribute('height', '20');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('aria-hidden', 'true');

      const iconPaths = {
        course: [
          { tag: 'path', d: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z' },
          { tag: 'path', d: 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' }
        ],
        tool: [
          { tag: 'path', d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' }
        ],
        community: [
          { tag: 'path', d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
          { tag: 'circle', cx: '9', cy: '7', r: '4' }
        ]
      };

      const paths = iconPaths[type] || [];
      paths.forEach(pathDef => {
        const el = document.createElementNS('http://www.w3.org/2000/svg', pathDef.tag);
        if (pathDef.d) el.setAttribute('d', pathDef.d);
        if (pathDef.cx) el.setAttribute('cx', pathDef.cx);
        if (pathDef.cy) el.setAttribute('cy', pathDef.cy);
        if (pathDef.r) el.setAttribute('r', pathDef.r);
        svg.appendChild(el);
      });

      return svg;
    }

    /**
     * Render search results safely using DOM methods
     * @param {string} containerId - Container element ID
     * @param {Array} items - Search result items
     * @param {string} type - Result type (course, tool, community)
     */
    function renderResults(containerId, items, type) {
      const container = document.getElementById(containerId);
      if (!container) return;

      // Clear existing content safely
      container.textContent = '';

      items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'search-modal__result';
        li.setAttribute('role', 'option');
        li.setAttribute('tabindex', '0');

        // Create icon container
        const iconDiv = document.createElement('div');
        iconDiv.className = `search-modal__result-icon search-modal__result-icon--${sanitizeText(type)}`;
        iconDiv.appendChild(createIconSvg(type));

        // Create content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'search-modal__result-content';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'search-modal__result-title';
        titleDiv.textContent = sanitizeText(item.title);

        const metaDiv = document.createElement('div');
        metaDiv.className = 'search-modal__result-meta';
        metaDiv.textContent = sanitizeText(item.meta);

        contentDiv.appendChild(titleDiv);
        contentDiv.appendChild(metaDiv);

        li.appendChild(iconDiv);
        li.appendChild(contentDiv);

        // Add click and keyboard handlers
        const href = sanitizeText(item.href);
        const navigateToResult = () => {
          // Validate href is a safe relative URL
          if (href && !href.includes('://') && !href.startsWith('javascript:')) {
            window.location.href = href;
          }
        };

        li.addEventListener('click', navigateToResult);
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateToResult();
          }
        });

        container.appendChild(li);
      });
    }

    // Track selected result index for keyboard navigation
    let selectedResultIndex = -1;

    /**
     * Get all visible search results
     * @returns {NodeListOf<Element>} All result elements
     */
    function getVisibleResults() {
      return searchModal?.querySelectorAll('.search-modal__result') || [];
    }

    /**
     * Update selection highlight
     * @param {number} newIndex - New index to select
     */
    function updateSelection(newIndex) {
      const results = getVisibleResults();
      if (results.length === 0) return;

      // Remove previous selection
      results.forEach(r => r.classList.remove('search-modal__result--selected'));

      // Wrap around
      if (newIndex < 0) newIndex = results.length - 1;
      if (newIndex >= results.length) newIndex = 0;

      selectedResultIndex = newIndex;

      // Add selection and scroll into view
      const selectedResult = results[selectedResultIndex];
      if (selectedResult) {
        selectedResult.classList.add('search-modal__result--selected');
        selectedResult.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        selectedResult.focus();
      }
    }

    /**
     * Handle keyboard navigation in search modal
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleSearchKeydown(e) {
      const results = getVisibleResults();

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          updateSelection(selectedResultIndex + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          updateSelection(selectedResultIndex - 1);
          break;
        case 'Enter':
          if (selectedResultIndex >= 0 && results[selectedResultIndex]) {
            e.preventDefault();
            results[selectedResultIndex].click();
          }
          break;
      }
    }

    // Event listeners
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && searchModal?.classList.contains('active')) {
        closeSearch();
      }
    });

    if (searchTrigger) {
      searchTrigger.addEventListener('click', openSearch);
    }

    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    if (searchModal) {
      searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearch();
      });

      // Add keyboard navigation for search results
      searchModal.addEventListener('keydown', handleSearchKeydown);
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        selectedResultIndex = -1; // Reset selection on new search
        performSearch(e.target.value);
      });
    }
  }

  // ========================================================================
  // Notifications Panel
  // ========================================================================

  function initNotifications() {
    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationsPanel = document.getElementById('notificationsPanel');
    const markAllRead = document.getElementById('markAllRead');
    const notificationBadge = document.getElementById('notificationBadge');
    const notificationsList = document.querySelector('.notifications-panel__list');

    function toggleNotifications() {
      notificationsPanel?.classList.toggle('active');
    }

    function closeNotifications() {
      notificationsPanel?.classList.remove('active');
    }

    function getUnreadCount() {
      return document.querySelectorAll('.notification-item--unread').length;
    }

    function updateBadges() {
      const unreadCount = getUnreadCount();

      // Update header badge
      if (notificationBadge) {
        notificationBadge.textContent = String(unreadCount);
        notificationBadge.style.display = unreadCount > 0 ? '' : 'none';
      }

      // Update tab badge
      const tabBadge = document.querySelector('.notifications-panel__tab-badge');
      if (tabBadge) {
        tabBadge.textContent = String(unreadCount);
      }
    }

    function markNotificationAsRead(item) {
      if (!item.classList.contains('notification-item--unread')) return;

      item.classList.remove('notification-item--unread');
      const indicator = item.querySelector('.notification-item__unread');
      if (indicator) indicator.remove();

      updateBadges();
    }

    function markAllAsRead() {
      document.querySelectorAll('.notification-item--unread').forEach(item => {
        item.classList.remove('notification-item--unread');
        const indicator = item.querySelector('.notification-item__unread');
        if (indicator) indicator.remove();
      });

      updateBadges();

      // If on Unread tab, show empty state
      const activeTab = document.querySelector('.notifications-panel__tab.active');
      if (activeTab?.dataset.tab === 'unread') {
        filterNotifications('unread');
      }
    }

    function filterNotifications(filter) {
      const items = document.querySelectorAll('.notification-item');

      items.forEach(item => {
        if (filter === 'all') {
          item.style.display = '';
        } else if (filter === 'unread') {
          item.style.display = item.classList.contains('notification-item--unread') ? '' : 'none';
        }
      });

      // Show empty state if no visible items in unread tab
      if (filter === 'unread') {
        const visibleItems = Array.from(items).filter(item =>
          item.classList.contains('notification-item--unread')
        );
        const emptyState = document.querySelector('.notifications-panel__empty');
        if (visibleItems.length === 0 && !emptyState) {
          // Create empty state if none exist
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'notifications-panel__empty';
          emptyDiv.innerHTML = `
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-muted); opacity: 0.5; margin-bottom: var(--space-3);">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <p style="color: var(--text-secondary); font-size: var(--text-sm);">All caught up!</p>
          `;
          notificationsList?.appendChild(emptyDiv);
        }
      } else {
        // Remove empty state on All tab
        const emptyState = document.querySelector('.notifications-panel__empty');
        if (emptyState) emptyState.remove();
      }
    }

    // Event listeners
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNotifications();
      });
    }

    if (markAllRead) {
      markAllRead.addEventListener('click', markAllAsRead);
    }

    // Individual notification click to mark as read
    if (notificationsList) {
      notificationsList.addEventListener('click', (e) => {
        const item = e.target.closest('.notification-item');
        if (item) {
          markNotificationAsRead(item);
        }
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (notificationsPanel?.classList.contains('active') &&
          !notificationsPanel.contains(e.target) &&
          !notificationsBtn?.contains(e.target)) {
        closeNotifications();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && notificationsPanel?.classList.contains('active')) {
        closeNotifications();
      }
    });

    // Tab switching with filtering
    document.querySelectorAll('.notifications-panel__tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.notifications-panel__tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterNotifications(tab.dataset.tab || 'all');
      });
    });

    // Initialize badge count
    updateBadges();
  }

  // ========================================================================
  // User Menu
  // ========================================================================

  function initUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const themeToggleMenu = document.getElementById('themeToggleMenu');
    const themeToggleLabel = document.getElementById('themeToggleLabel');
    const signOutBtn = document.getElementById('signOutBtn');

    if (!userDropdown || !userMenuBtn) return;

    function openUserMenu() {
      userDropdown.classList.add('is-open');
      userMenuBtn.setAttribute('aria-expanded', 'true');
      updateThemeLabel();
    }

    function closeUserMenu() {
      userDropdown.classList.remove('is-open');
      userMenuBtn.setAttribute('aria-expanded', 'false');
    }

    function toggleUserMenu() {
      if (userDropdown.classList.contains('is-open')) {
        closeUserMenu();
      } else {
        openUserMenu();
      }
    }

    function updateThemeLabel() {
      if (!themeToggleLabel) return;
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      themeToggleLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    // Toggle menu on button click
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleUserMenu();
    });

    // Theme toggle
    if (themeToggleMenu) {
      themeToggleMenu.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        try {
          localStorage.setItem('theme', newTheme);
        } catch {
          // localStorage unavailable
        }
        updateThemeLabel();
      });
    }

    // Sign out (demo: just reload page)
    if (signOutBtn) {
      signOutBtn.addEventListener('click', () => {
        // In production, this would call an auth logout endpoint
        // For demo, clear localStorage and reload
        try {
          localStorage.removeItem('onboardingComplete');
        } catch {
          // localStorage unavailable
        }
        window.location.reload();
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (userDropdown.classList.contains('is-open') &&
          !userDropdown.contains(e.target)) {
        closeUserMenu();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && userDropdown.classList.contains('is-open')) {
        closeUserMenu();
        userMenuBtn.focus();
      }
    });

    // Initialize theme label
    updateThemeLabel();
  }

  // ========================================================================
  // Onboarding Flow
  // ========================================================================

  function initOnboarding() {
    const onboarding = document.getElementById('onboarding');
    const skipBtn = document.getElementById('onboardingSkip');
    let currentStep = 1;
    const totalSteps = 4;

    function showOnboarding() {
      // Check if user has seen onboarding
      try {
        if (localStorage.getItem('onboardingComplete')) return;
      } catch {
        // localStorage unavailable, show onboarding
      }
      onboarding?.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function hideOnboarding() {
      onboarding?.classList.remove('active');
      document.body.style.overflow = '';
      try {
        localStorage.setItem('onboardingComplete', 'true');
      } catch {
        // localStorage unavailable
      }
    }

    function goToStep(step) {
      if (step < 1 || step > totalSteps) return;

      currentStep = step;

      // Update steps visibility
      document.querySelectorAll('.onboarding__step').forEach(s => {
        s.classList.remove('active');
      });
      document.querySelector(`.onboarding__step[data-step="${step}"]`)?.classList.add('active');
    }

    // Event listeners
    if (skipBtn) {
      skipBtn.addEventListener('click', hideOnboarding);
    }

    document.querySelectorAll('.onboarding__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'next') {
          goToStep(currentStep + 1);
        } else if (action === 'prev') {
          goToStep(currentStep - 1);
        } else if (action === 'complete') {
          hideOnboarding();
        }
      });
    });

    // Show onboarding on first visit (uncomment to enable)
    // showOnboarding();

    // Expose function to trigger onboarding manually (for testing)
    window.showOnboarding = showOnboarding;
  }

  // ========================================================================
  // Dropdown Menus
  // ========================================================================

  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown__trigger');

      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();

          // Close other dropdowns
          dropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove('is-open');
          });

          // Toggle current dropdown
          dropdown.classList.toggle('is-open');
        });
      }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('is-open');
        }
      });
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdowns.forEach(dropdown => dropdown.classList.remove('is-open'));
      }
    });

    // Handle dropdown item clicks
    document.querySelectorAll('.dropdown__item').forEach(item => {
      item.addEventListener('click', () => {
        // Close the dropdown after clicking an item
        const dropdown = item.closest('.dropdown');
        if (dropdown) {
          setTimeout(() => dropdown.classList.remove('is-open'), 100);
        }
      });
    });
  }

  // ========================================================================
  // Tooltips (JavaScript-enhanced)
  // ========================================================================

  function initTooltips() {
    // Most tooltips work via CSS with data-tooltip attribute
    // This is for dynamic/JS tooltips if needed

    // Add keyboard support for tooltip triggers
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      // Make focusable if not already
      if (!element.hasAttribute('tabindex') && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
        element.setAttribute('tabindex', '0');
      }
    });
  }

  // ========================================================================
  // Smooth Hover Effects
  // ========================================================================

  function initHoverEffects() {
    // Add hover class on touch devices
    document.querySelectorAll('.course-card, .stat-card, .activity-card, .path-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ========================================================================
  // Active Navigation Highlighting
  // ========================================================================

  function initActiveNav() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';

    document.querySelectorAll('.sidebar__item, .mobile-nav__item').forEach(item => {
      const href = item.getAttribute('href');
      if (href && (href === pageName || (pageName === 'index.html' && href === 'index.html'))) {
        item.classList.add('active');
      }
    });
  }

  // ========================================================================
  // Keyboard Navigation Support
  // ========================================================================

  function initKeyboardNav() {
    document.querySelectorAll('[role="button"]:not(button)').forEach(element => {
      element.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          element.click();
        }
      });
    });
  }

  // ========================================================================
  // Chart Animations (Sprint 6)
  // ========================================================================

  function initChartAnimations() {
    // Observe charts and animate when they enter viewport
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const chart = entry.target;

          // Animate line charts
          if (chart.classList.contains('chart--line')) {
            animateLineChart(chart);
          }

          // Animate bar charts
          if (chart.classList.contains('chart--bar-horizontal') || chart.classList.contains('chart--bar')) {
            animateBarChart(chart);
          }

          // Animate donut charts
          if (chart.classList.contains('chart--donut')) {
            animateDonutChart(chart);
          }

          chartObserver.unobserve(chart);
        }
      });
    }, { threshold: 0.2 });

    // Observe all chart containers
    document.querySelectorAll('.chart, .chart-container').forEach(chart => {
      chartObserver.observe(chart);
    });
  }

  function animateLineChart(chart) {
    const line = chart.querySelector('.chart__line--animated');
    const area = chart.querySelector('.chart__area');
    const points = chart.querySelectorAll('.chart__point');

    if (line) {
      const length = line.getTotalLength ? line.getTotalLength() : 500;
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;

      // Animate line drawing
      requestAnimationFrame(() => {
        line.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
        line.style.strokeDashoffset = '0';
      });
    }

    if (area) {
      area.style.opacity = '0';
      setTimeout(() => {
        area.style.transition = 'opacity 0.8s ease-out';
        area.style.opacity = '1';
      }, 800);
    }

    // Animate points with stagger
    points.forEach((point, index) => {
      point.style.opacity = '0';
      point.style.transform = 'scale(0)';
      setTimeout(() => {
        point.style.transition = 'opacity 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        point.style.opacity = '1';
        point.style.transform = 'scale(1)';
      }, 200 + (index * 100));
    });
  }

  function animateBarChart(chart) {
    const bars = chart.querySelectorAll('.bar-chart__bar--animated, .progress-bar__fill--animated');

    bars.forEach((bar, index) => {
      const targetWidth = bar.style.width;
      bar.style.width = '0';

      setTimeout(() => {
        bar.style.transition = 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        bar.style.width = targetWidth;
      }, index * 100);
    });
  }

  function animateDonutChart(chart) {
    const segments = chart.querySelectorAll('.donut-chart__segment');

    segments.forEach((segment, index) => {
      const dashArray = segment.getAttribute('stroke-dasharray');
      segment.style.strokeDasharray = '0 100';

      setTimeout(() => {
        segment.style.transition = 'stroke-dasharray 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        segment.style.strokeDasharray = dashArray;
      }, 200 + (index * 150));
    });
  }

  // ========================================================================
  // Progress Tracking Animations (Sprint 6)
  // ========================================================================

  function initProgressAnimations() {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;

          // Animate progress bars
          const progressBars = element.querySelectorAll('.progress-bar__fill:not(.progress-bar__fill--animated)');
          progressBars.forEach((bar, index) => {
            const targetWidth = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
              bar.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
              bar.style.width = targetWidth;
            }, index * 150);
          });

          // Animate milestone markers
          const milestones = element.querySelectorAll('.milestone-progress__step');
          milestones.forEach((milestone, index) => {
            milestone.style.opacity = '0';
            milestone.style.transform = 'translateY(10px)';
            setTimeout(() => {
              milestone.style.transition = 'opacity 0.4s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
              milestone.style.opacity = '1';
              milestone.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
          });

          // Animate streak days
          const streakDays = element.querySelectorAll('.streak-days__day');
          streakDays.forEach((day, index) => {
            day.style.opacity = '0';
            day.style.transform = 'scale(0.5)';
            setTimeout(() => {
              day.style.transition = 'opacity 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
              day.style.opacity = '1';
              day.style.transform = 'scale(1)';
            }, 100 + (index * 50));
          });

          progressObserver.unobserve(element);
        }
      });
    }, { threshold: 0.1 });

    // Observe progress containers
    document.querySelectorAll('.progress-stack, .milestone-progress, .streak-days, .goal-tracker').forEach(el => {
      progressObserver.observe(el);
    });
  }

  // ========================================================================
  // Heatmap Animation (Sprint 6)
  // ========================================================================

  function initHeatmapAnimation() {
    const heatmapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const heatmap = entry.target;
          const cells = heatmap.querySelectorAll('.heatmap__day');

          cells.forEach((cell, index) => {
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0)';

            // Staggered animation with wave effect
            const row = index % 7;
            const col = Math.floor(index / 7);
            const delay = (col * 30) + (row * 20);

            setTimeout(() => {
              cell.style.transition = 'opacity 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
              cell.style.opacity = '1';
              cell.style.transform = 'scale(1)';
            }, delay);
          });

          heatmapObserver.unobserve(heatmap);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.heatmap').forEach(heatmap => {
      heatmapObserver.observe(heatmap);
    });
  }

  // ========================================================================
  // Leaderboard Animation (Sprint 6)
  // ========================================================================

  function initLeaderboardAnimation() {
    const leaderboardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const leaderboard = entry.target;
          const items = leaderboard.querySelectorAll('.leaderboard__item');

          items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';

            setTimeout(() => {
              item.style.transition = 'opacity 0.4s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
              item.style.opacity = '1';
              item.style.transform = 'translateX(0)';
            }, index * 100);
          });

          leaderboardObserver.unobserve(leaderboard);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.leaderboard').forEach(leaderboard => {
      leaderboardObserver.observe(leaderboard);
    });
  }

  // ========================================================================
  // Metric Cards Animation (Sprint 6)
  // ========================================================================

  function initMetricCardAnimations() {
    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const value = card.querySelector('.metric-card__value');

          if (value && !value.dataset.animated) {
            // Parse numeric value
            const text = value.textContent;
            const numericMatch = text.match(/[\d.]+/);

            if (numericMatch) {
              const targetValue = parseFloat(numericMatch[0]);
              const suffix = text.replace(numericMatch[0], '');
              const isDecimal = targetValue % 1 !== 0;

              // Animate the value
              animateMetricValue(value, targetValue, suffix, isDecimal);
              value.dataset.animated = 'true';
            }
          }

          metricObserver.unobserve(card);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.metric-card').forEach(card => {
      metricObserver.observe(card);
    });
  }

  function animateMetricValue(element, target, suffix, isDecimal, duration = 1200) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = target * easeOut;

      element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ========================================================================
  // Initialize Everything
  // ========================================================================

  function init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    // Initialize page load animation first for smooth entrance
    initPageLoadAnimation();

    // Initialize all other features
    initMobileMenu();
    initSidebarCollapse();
    initSearchModal();
    initNotifications();
    initUserMenu();
    initOnboarding();
    initDropdowns();
    initTooltips();
    initScrollAnimations();
    initProgressRings();
    initXPBars();
    initStaggerAnimations();
    initHoverEffects();
    initActiveNav();
    initKeyboardNav();

    // Sprint 6: Chart & Analytics Animations
    initChartAnimations();
    initProgressAnimations();
    initHeatmapAnimation();
    initLeaderboardAnimation();
    initMetricCardAnimations();

  }

  init();

})();
