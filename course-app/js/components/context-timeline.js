/**
 * Context Timeline Component
 * Interactive visualization of context loss across multi-day projects
 */

(function() {
  'use strict';

  // Crisis point data
  const CRISIS_DATA = {
    1: {
      title: 'Session Break: Day 1 → Day 2',
      lost: [
        'Target audience details partially forgotten',
        'Budget constraints need re-explaining',
        'Launch date context reduced'
      ],
      timeAdded: 8
    },
    2: {
      title: 'Session Break: Day 2 → Day 3',
      lost: [
        'Rejected competitor mention strategy forgotten',
        'Approved messaging tone unclear',
        'Channel priorities need restating'
      ],
      timeAdded: 12
    },
    3: {
      title: 'Session Break: Day 3 → Day 4',
      lost: [
        'All Day 1 decisions pushed out of context',
        'Brand voice guidelines lost',
        'Budget constraints completely forgotten',
        'AI suggests previously rejected approaches'
      ],
      timeAdded: 25
    }
  };

  class ContextTimeline {
    constructor(element) {
      this.element = element;
      this.isPlaying = false;
      this.currentDay = 0;
      this.totalTimeLost = 0;
      this.animationTimeout = null;

      this.init();
    }

    init() {
      this.cacheElements();
      this.bindEvents();
      this.reset();
    }

    cacheElements() {
      this.days = this.element.querySelectorAll('.context-timeline__day');
      this.crisisPoints = this.element.querySelectorAll('.context-timeline__crisis-point');
      this.popup = this.element.querySelector('#crisisPopup');
      this.popupContent = this.element.querySelector('#crisisContent');
      this.popupClose = this.element.querySelector('.context-timeline__popup-close');
      this.crisisTime = this.element.querySelector('#crisisTime');
      this.playBtn = this.element.querySelector('#timelinePlayBtn');
      this.resetBtn = this.element.querySelector('#timelineResetBtn');
      this.timeLostDisplay = this.element.querySelector('#timeLost');
    }

    bindEvents() {
      // Play button
      if (this.playBtn) {
        this.playBtn.addEventListener('click', () => this.togglePlay());
      }

      // Reset button
      if (this.resetBtn) {
        this.resetBtn.addEventListener('click', () => this.reset());
      }

      // Crisis points
      this.crisisPoints.forEach(point => {
        point.addEventListener('click', (e) => {
          e.stopPropagation();
          const crisisId = point.dataset.crisis;
          this.showCrisisPopup(crisisId, point);
        });
      });

      // Close popup
      if (this.popupClose) {
        this.popupClose.addEventListener('click', () => this.hidePopup());
      }

      // Close popup on outside click
      document.addEventListener('click', (e) => {
        if (this.popup && !this.popup.contains(e.target) &&
            !e.target.closest('.context-timeline__crisis-point')) {
          this.hidePopup();
        }
      });

      // Keyboard support
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hidePopup();
        }
      });
    }

    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    play() {
      if (this.currentDay >= this.days.length) {
        this.reset();
      }

      this.isPlaying = true;
      this.element.classList.add('context-timeline--playing');
      this.updatePlayButton(true);
      this.animateNextDay();
    }

    pause() {
      this.isPlaying = false;
      this.element.classList.remove('context-timeline--playing');
      this.updatePlayButton(false);

      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
        this.animationTimeout = null;
      }
    }

    reset() {
      this.pause();
      this.currentDay = 0;
      this.totalTimeLost = 0;

      // Reset all days
      this.days.forEach(day => {
        day.classList.remove('context-timeline__day--active', 'context-timeline__day--complete', 'context-timeline__day--animating');
      });

      // Reset time display
      this.updateTimeLost(0);

      // Hide popup
      this.hidePopup();
    }

    animateNextDay() {
      if (!this.isPlaying || this.currentDay >= this.days.length) {
        this.pause();
        return;
      }

      const day = this.days[this.currentDay];

      // Mark previous days as complete
      for (let i = 0; i < this.currentDay; i++) {
        this.days[i].classList.add('context-timeline__day--complete');
        this.days[i].classList.remove('context-timeline__day--active');
      }

      // Animate current day
      day.classList.add('context-timeline__day--active', 'context-timeline__day--animating');

      // Add time lost for this transition (except first day)
      if (this.currentDay > 0) {
        const crisisData = CRISIS_DATA[this.currentDay];
        if (crisisData) {
          this.totalTimeLost += crisisData.timeAdded;
          this.animateTimeLost(this.totalTimeLost);
        }
      }

      this.currentDay++;

      // Schedule next day
      this.animationTimeout = setTimeout(() => {
        day.classList.remove('context-timeline__day--animating');
        this.animateNextDay();
      }, 1500);
    }

    showCrisisPopup(crisisId, anchorElement) {
      const data = CRISIS_DATA[crisisId];
      if (!data) return;

      // Populate content
      const listHtml = data.lost.map(item => `<li>${item}</li>`).join('');
      this.popupContent.innerHTML = `
        <p style="margin: 0 0 var(--space-2) 0; font-weight: var(--font-semibold); color: var(--text-primary);">
          ${data.title}
        </p>
        <ul>${listHtml}</ul>
      `;
      this.crisisTime.textContent = `+${data.timeAdded} min`;

      // Position popup near the anchor
      const rect = anchorElement.getBoundingClientRect();
      const timelineRect = this.element.getBoundingClientRect();

      // Show popup
      this.popup.classList.add('context-timeline__popup--active');
    }

    hidePopup() {
      if (this.popup) {
        this.popup.classList.remove('context-timeline__popup--active');
      }
    }

    updatePlayButton(isPlaying) {
      if (!this.playBtn) return;

      const icon = this.playBtn.querySelector('svg');
      const text = this.playBtn.querySelector('span');

      if (isPlaying) {
        this.playBtn.classList.add('context-timeline__play-btn--playing');
        icon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        text.textContent = 'Pause';
      } else {
        this.playBtn.classList.remove('context-timeline__play-btn--playing');
        icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        text.textContent = this.currentDay >= this.days.length ? 'Replay' : 'Play Timeline';
      }
    }

    updateTimeLost(minutes) {
      if (this.timeLostDisplay) {
        this.timeLostDisplay.textContent = `${minutes} min`;
      }
    }

    animateTimeLost(targetMinutes) {
      if (!this.timeLostDisplay) return;

      const current = parseInt(this.timeLostDisplay.textContent, 10) || 0;
      const duration = 500;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(current + (targetMinutes - current) * easeOut);

        this.timeLostDisplay.textContent = `${value} min`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }

  // Auto-initialize
  function init() {
    const timeline = document.getElementById('contextTimeline');
    if (timeline) {
      window.contextTimeline = new ContextTimeline(timeline);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export
  window.ContextTimeline = ContextTimeline;
})();
