/**
 * Profile Page - Tab Navigation
 */

(function() {
  'use strict';

  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tabs__item');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Optional: Add keyboard navigation for tabs
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const activeTab = document.querySelector('.tabs__item.active');
      if (!activeTab) return;

      const tabs = Array.from(tabButtons);
      const currentIndex = tabs.indexOf(activeTab);

      let newIndex;
      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabs.length;
      } else {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      }

      tabs[newIndex].click();
      tabs[newIndex].focus();
    }
  });
})();
