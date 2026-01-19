/**
 * Lesson Page Controller
 * Handles slide navigation, progress tracking, and keyboard controls
 */

(function() {
  'use strict';

  class LessonController {
    constructor() {
      this.currentSlide = 1;
      this.totalSlides = 0;
      this.slides = [];

      this.init();
    }

    init() {
      this.cacheElements();
      if (!this.lessonStage) return;

      this.totalSlides = this.slides.length;
      this.bindEvents();
      this.updateDisplay();
    }

    cacheElements() {
      this.lessonStage = document.querySelector('.lesson-stage');
      this.slides = document.querySelectorAll('.lesson-slide');
      this.prevBtn = document.getElementById('prevSlide');
      this.nextBtn = document.getElementById('nextSlide');
      this.dots = document.querySelectorAll('.lesson-nav__dot');
      this.progressFill = document.querySelector('.lesson-progress__fill');
      this.progressLabel = document.querySelector('.lesson-progress__label');
      this.outlineItems = document.querySelectorAll('.lesson-outline__item');
    }

    bindEvents() {
      // Navigation buttons
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.goToPrevious());
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.goToNext());
      }

      // Navigation dots
      this.dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const slideNum = parseInt(dot.dataset.slide, 10);
          this.goToSlide(slideNum);
        });
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => this.handleKeyboard(e));

      // Outline items
      this.outlineItems.forEach((item, index) => {
        item.addEventListener('click', () => this.goToSlide(index + 1));
      });
    }

    handleKeyboard(e) {
      // Don't capture if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          this.goToPrevious();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          this.goToNext();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(1);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides);
          break;
      }
    }

    goToSlide(slideNum) {
      if (slideNum < 1 || slideNum > this.totalSlides) return;
      if (slideNum === this.currentSlide) return;

      // Update slide visibility
      this.slides.forEach((slide, index) => {
        const isActive = index + 1 === slideNum;
        slide.classList.toggle('lesson-slide--active', isActive);
      });

      this.currentSlide = slideNum;
      this.updateDisplay();
    }

    goToNext() {
      if (this.currentSlide < this.totalSlides) {
        this.goToSlide(this.currentSlide + 1);
      }
    }

    goToPrevious() {
      if (this.currentSlide > 1) {
        this.goToSlide(this.currentSlide - 1);
      }
    }

    updateDisplay() {
      // Update navigation buttons
      if (this.prevBtn) {
        this.prevBtn.disabled = this.currentSlide === 1;
      }

      if (this.nextBtn) {
        const isLast = this.currentSlide === this.totalSlides;
        this.nextBtn.disabled = isLast;

        // Change text on last slide
        const span = this.nextBtn.querySelector('span');
        if (span) {
          span.textContent = isLast ? 'Complete' : 'Next';
        }
      }

      // Update dots
      this.dots.forEach((dot, index) => {
        const isActive = index + 1 === this.currentSlide;
        const isCompleted = index + 1 < this.currentSlide;
        dot.classList.toggle('lesson-nav__dot--active', isActive);
        dot.classList.toggle('lesson-nav__dot--completed', isCompleted);
      });

      // Update progress bar
      const progress = (this.currentSlide / this.totalSlides) * 100;
      if (this.progressFill) {
        this.progressFill.style.setProperty('--progress', `${progress}%`);
      }

      // Update progress label
      if (this.progressLabel) {
        this.progressLabel.textContent = `Section ${this.currentSlide} of ${this.totalSlides}`;
      }

      // Update outline
      this.outlineItems.forEach((item, index) => {
        const isActive = index + 1 === this.currentSlide;
        const isCompleted = index + 1 < this.currentSlide;
        item.classList.toggle('lesson-outline__item--active', isActive);
        item.classList.toggle('lesson-outline__item--completed', isCompleted);
      });
    }
  }

  // Initialize on DOM ready
  function init() {
    window.lessonController = new LessonController();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.LessonController = LessonController;
})();
