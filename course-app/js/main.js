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
  // Search Modal
  // ========================================================================

  function initSearchModal() {
    const searchTrigger = document.getElementById('searchTrigger');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const searchEmpty = document.getElementById('searchEmpty');
    const searchResults = document.getElementById('searchResults');

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
        searchInput?.focus();
        document.body.style.overflow = 'hidden';
      }
    }

    function closeSearch() {
      if (searchModal) {
        searchModal.classList.remove('active');
        if (searchInput) searchInput.value = '';
        document.body.style.overflow = '';
        resetSearch();
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

    function renderResults(containerId, items, type) {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = items.map(item => `
        <li class="search-modal__result" data-href="${item.href}">
          <div class="search-modal__result-icon search-modal__result-icon--${type}">
            ${getIconSvg(type)}
          </div>
          <div class="search-modal__result-content">
            <div class="search-modal__result-title">${item.title}</div>
            <div class="search-modal__result-meta">${item.meta}</div>
          </div>
        </li>
      `).join('');

      // Add click handlers
      container.querySelectorAll('.search-modal__result').forEach(result => {
        result.addEventListener('click', () => {
          window.location.href = result.dataset.href;
        });
      });
    }

    function getIconSvg(type) {
      const icons = {
        course: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
        tool: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>',
        community: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>'
      };
      return icons[type] || '';
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
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
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

    function toggleNotifications() {
      notificationsPanel?.classList.toggle('active');
    }

    function closeNotifications() {
      notificationsPanel?.classList.remove('active');
    }

    function markAllAsRead() {
      document.querySelectorAll('.notification-item--unread').forEach(item => {
        item.classList.remove('notification-item--unread');
        const indicator = item.querySelector('.notification-item__unread');
        if (indicator) indicator.remove();
      });

      // Update badge
      if (notificationBadge) {
        notificationBadge.textContent = '0';
        notificationBadge.style.display = 'none';
      }

      // Update tab badge
      const tabBadge = document.querySelector('.notifications-panel__tab-badge');
      if (tabBadge) tabBadge.textContent = '0';
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

    // Tab switching
    document.querySelectorAll('.notifications-panel__tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.notifications-panel__tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Filter notifications based on tab (simplified - just visual)
      });
    });
  }

  // ========================================================================
  // User Menu
  // ========================================================================

  function initUserMenu() {
    const userMenuBtn = document.getElementById('userMenuBtn');

    if (userMenuBtn) {
      userMenuBtn.addEventListener('click', () => {
        // Navigate to profile for now
        window.location.href = 'profile.html';
      });
    }
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
