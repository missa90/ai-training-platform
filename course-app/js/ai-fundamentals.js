/**
 * AI Fundamentals Course - Interactive Components
 * Handles slide navigation and interactive demo functionality
 */

(function() {
  'use strict';

  // ============================================================================
  // State Management
  // ============================================================================

  const state = {
    currentSlide: 1,
    totalSlides: 11,
    completedSlides: new Set(),
    comparisonPlaying: false,
    predictionAnimated: false,
    capabilitySimVisible: {}
  };

  // Load saved progress from localStorage
  const savedProgress = localStorage.getItem('ai-fundamentals-progress');
  if (savedProgress) {
    try {
      const progress = JSON.parse(savedProgress);
      state.completedSlides = new Set(progress.completedSlides || []);
      state.currentSlide = progress.currentSlide || 1;
    } catch (e) {
      console.warn('Failed to load saved progress');
    }
  }

  // ============================================================================
  // Slide Navigation
  // ============================================================================

  function initSlideNavigation() {
    const slides = document.querySelectorAll('.lesson-slide');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const dots = document.querySelectorAll('.lesson-nav__dot');
    const outlineItems = document.querySelectorAll('.lesson-outline__item');

    // Go to specific slide
    function goToSlide(slideNum) {
      if (slideNum < 1 || slideNum > state.totalSlides) return;

      // Mark current slide as completed
      state.completedSlides.add(state.currentSlide);
      state.currentSlide = slideNum;
      saveProgress();

      // Update slides
      slides.forEach((slide, index) => {
        const isActive = index + 1 === slideNum;
        slide.classList.toggle('lesson-slide--active', isActive);
        slide.setAttribute('aria-hidden', !isActive);
      });

      // Update navigation buttons
      prevBtn.disabled = slideNum === 1;
      nextBtn.disabled = slideNum === state.totalSlides;
      if (slideNum === state.totalSlides) {
        nextBtn.innerHTML = '<span>Complete</span>';
      } else {
        nextBtn.innerHTML = `<span>Next</span>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>`;
      }

      // Update dots
      dots.forEach((dot, index) => {
        const dotSlide = index + 1;
        dot.classList.toggle('lesson-nav__dot--active', dotSlide === slideNum);
        dot.classList.toggle('lesson-nav__dot--completed', state.completedSlides.has(dotSlide));
        dot.setAttribute('aria-selected', dotSlide === slideNum);
      });

      // Update outline
      outlineItems.forEach((item) => {
        const itemSlide = parseInt(item.dataset.slide);
        item.classList.toggle('lesson-outline__item--active', itemSlide === slideNum);
        item.classList.toggle('lesson-outline__item--completed', state.completedSlides.has(itemSlide));
        item.setAttribute('aria-current', itemSlide === slideNum ? 'true' : 'false');
      });

      // Update progress bar
      updateProgress();

      // Announce slide change for screen readers
      announceSlideChange(slideNum);
    }

    // Event listeners
    prevBtn.addEventListener('click', () => goToSlide(state.currentSlide - 1));
    nextBtn.addEventListener('click', () => {
      if (state.currentSlide === state.totalSlides) {
        // Mark course as complete
        state.completedSlides.add(state.totalSlides);
        saveProgress();
        // Could redirect or show completion modal
      } else {
        goToSlide(state.currentSlide + 1);
      }
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideNum = parseInt(dot.dataset.slide);
        goToSlide(slideNum);
      });
    });

    outlineItems.forEach(item => {
      item.addEventListener('click', () => {
        const slideNum = parseInt(item.dataset.slide);
        goToSlide(slideNum);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Don't navigate if focus is in an input
      if (e.target.matches('input, textarea')) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToSlide(state.currentSlide + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToSlide(state.currentSlide - 1);
      } else if (e.key === 'Escape') {
        // Could close sidebar on mobile or go back
      }
    });

    // Initialize to saved slide
    goToSlide(state.currentSlide);
  }

  function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressLabel = document.getElementById('progressLabel');
    const sidebarFill = document.getElementById('sidebarProgressFill');
    const sidebarText = document.getElementById('sidebarProgressText');

    const percentage = (state.currentSlide / state.totalSlides) * 100;

    if (progressFill) {
      progressFill.style.setProperty('--progress', `${percentage}%`);
    }
    if (progressLabel) {
      progressLabel.textContent = `Section ${state.currentSlide} of ${state.totalSlides}`;
    }
    if (sidebarFill) {
      sidebarFill.style.width = `${percentage}%`;
    }
    if (sidebarText) {
      sidebarText.textContent = `${state.currentSlide}/${state.totalSlides} sections`;
    }
  }

  function announceSlideChange(slideNum) {
    const slide = document.querySelector(`[data-slide="${slideNum}"]`);
    const title = slide?.querySelector('.slide-title')?.textContent || `Section ${slideNum}`;

    // Create or update live region
    let liveRegion = document.getElementById('slide-announcer');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'slide-announcer';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = `Section ${slideNum} of ${state.totalSlides}: ${title}`;
  }

  function saveProgress() {
    const progress = {
      currentSlide: state.currentSlide,
      completedSlides: Array.from(state.completedSlides)
    };
    localStorage.setItem('ai-fundamentals-progress', JSON.stringify(progress));

    // Also update XP if all slides completed
    if (state.completedSlides.size === state.totalSlides) {
      const currentXP = parseInt(localStorage.getItem('user-xp') || '0');
      localStorage.setItem('user-xp', currentXP + 300); // 50 XP per section
    }
  }

  // ============================================================================
  // Section 1: AI Comparison Demo
  // ============================================================================

  function initComparisonDemo() {
    const playBtn = document.getElementById('comparisonPlayBtn');
    const resetBtn = document.getElementById('comparisonResetBtn');
    const timeWithout = document.getElementById('timeWithout');
    const timeWith = document.getElementById('timeWith');
    const timeSaved = document.getElementById('timeSaved');
    const promptText = document.getElementById('aiPromptText');
    const resultText = document.getElementById('aiResultText');
    const tasks = document.querySelectorAll('.ai-comparison__task');

    if (!playBtn) return;

    const demoData = {
      tasks: [
        { time: 60, label: 'Research competitor messaging' },
        { time: 90, label: 'Write draft #1' },
        { time: 45, label: 'Review and revise' },
        { time: 120, label: 'Write drafts #2-5' },
        { time: 30, label: 'Final editing' }
      ],
      prompt: 'Write a promotional email for our new AI training platform. Target: mid-market SaaS companies. Tone: professional but approachable. Include: key benefits, social proof mention, and clear CTA.',
      result: 'Subject: Transform Your Team\'s AI Skills in 30 Days\n\nHi [Name],\n\nWhat if your team could 10x their productivity with AI—without the steep learning curve?\n\nOur AI Training Platform has helped 500+ companies like yours master practical AI skills...',
      totalTimeWithout: 5.75, // hours
      totalTimeWith: 15 // minutes
    };

    let currentTask = 0;
    let animationInterval = null;

    function reset() {
      currentTask = 0;
      state.comparisonPlaying = false;
      if (animationInterval) clearInterval(animationInterval);

      tasks.forEach(task => {
        task.classList.remove('ai-comparison__task--active', 'ai-comparison__task--complete');
      });

      timeWithout.textContent = '0';
      timeWith.textContent = '0';
      timeSaved.textContent = '—';
      promptText.textContent = '';
      resultText.textContent = '';

      playBtn.style.display = 'inline-flex';
      resetBtn.style.display = 'none';
    }

    function playDemo() {
      if (state.comparisonPlaying) return;
      state.comparisonPlaying = true;

      playBtn.style.display = 'none';
      resetBtn.style.display = 'inline-flex';

      // Animate "Without AI" side
      let elapsedHours = 0;
      const taskDuration = 600; // ms per task

      function animateTask() {
        if (currentTask >= demoData.tasks.length) {
          // Show "With AI" side
          setTimeout(animateWithAI, 500);
          return;
        }

        const task = tasks[currentTask];
        task.classList.add('ai-comparison__task--active');

        setTimeout(() => {
          task.classList.remove('ai-comparison__task--active');
          task.classList.add('ai-comparison__task--complete');
          elapsedHours += demoData.tasks[currentTask].time / 60;
          timeWithout.textContent = elapsedHours.toFixed(1);
          currentTask++;
          animateTask();
        }, taskDuration);
      }

      function animateWithAI() {
        // Type out prompt
        let promptIndex = 0;
        const promptInterval = setInterval(() => {
          if (promptIndex <= demoData.prompt.length) {
            promptText.textContent = demoData.prompt.substring(0, promptIndex);
            promptIndex += 3;
          } else {
            clearInterval(promptInterval);
            // Show result
            setTimeout(() => {
              let timeCount = 0;
              const timeInterval = setInterval(() => {
                timeCount += 1;
                timeWith.textContent = timeCount;
                if (timeCount >= demoData.totalTimeWith) {
                  clearInterval(timeInterval);
                  resultText.textContent = demoData.result;

                  // Show time saved
                  const hoursSaved = demoData.totalTimeWithout - (demoData.totalTimeWith / 60);
                  timeSaved.textContent = `${hoursSaved.toFixed(1)} hours`;
                  state.comparisonPlaying = false;
                }
              }, 50);
            }, 300);
          }
        }, 20);
      }

      animateTask();
    }

    playBtn.addEventListener('click', playDemo);
    resetBtn.addEventListener('click', reset);
  }

  // ============================================================================
  // Section 2: LLM Demo (Tokenization & Prediction)
  // ============================================================================

  function initLLMDemo() {
    const tokenInput = document.getElementById('tokenInput');
    const tokenizeBtn = document.getElementById('tokenizeBtn');
    const tokenOutput = document.getElementById('tokenOutput');
    const tokenCount = document.getElementById('tokenCount');
    const tokenCountValue = document.getElementById('tokenCountValue');
    const animatePredictionBtn = document.getElementById('animatePredictionBtn');
    const predictionBars = document.querySelectorAll('.llm-demo__prediction-bar');
    const flowSteps = document.querySelectorAll('.llm-demo__flow-step');

    if (!tokenizeBtn) return;

    // Simple tokenization simulation (not actual BPE)
    function tokenize(text) {
      // Split by whitespace and common subwords
      const tokens = [];
      const words = text.split(/\s+/);

      words.forEach(word => {
        if (word.length > 6) {
          // Split longer words
          tokens.push(word.substring(0, Math.ceil(word.length / 2)));
          tokens.push(word.substring(Math.ceil(word.length / 2)));
        } else {
          tokens.push(word);
        }
      });

      return tokens.filter(t => t.length > 0);
    }

    tokenizeBtn.addEventListener('click', () => {
      const text = tokenInput.value.trim();
      if (!text) return;

      const tokens = tokenize(text);

      // Clear and show tokens with animation
      tokenOutput.innerHTML = '';

      tokens.forEach((token, index) => {
        setTimeout(() => {
          const tokenEl = document.createElement('span');
          tokenEl.className = 'llm-demo__token';
          tokenEl.textContent = token;
          tokenOutput.appendChild(tokenEl);
        }, index * 100);
      });

      // Show token count
      setTimeout(() => {
        tokenCount.style.display = 'flex';
        tokenCountValue.textContent = tokens.length;

        // Animate flow step 1
        flowSteps[0]?.classList.add('llm-demo__flow-step--active');
      }, tokens.length * 100 + 200);
    });

    // Prediction animation
    if (animatePredictionBtn) {
      animatePredictionBtn.addEventListener('click', () => {
        if (state.predictionAnimated) {
          // Reset
          predictionBars.forEach(bar => {
            bar.classList.remove('llm-demo__prediction-bar--animated');
          });
          flowSteps.forEach(step => step.classList.remove('llm-demo__flow-step--active'));
          state.predictionAnimated = false;
          animatePredictionBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>See Prediction Process</span>
          `;
          return;
        }

        state.predictionAnimated = true;
        animatePredictionBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          <span>Reset</span>
        `;

        // Animate flow steps
        flowSteps.forEach((step, index) => {
          setTimeout(() => {
            step.classList.add('llm-demo__flow-step--active');
          }, index * 400);
        });

        // Animate prediction bars
        setTimeout(() => {
          predictionBars.forEach((bar, index) => {
            setTimeout(() => {
              bar.classList.add('llm-demo__prediction-bar--animated');
            }, index * 150);
          });
        }, 800);
      });
    }
  }

  // ============================================================================
  // Section 3: Capability Simulator (Interactive Demos)
  // ============================================================================

  function initCapabilitySimulator() {
    const simulator = document.getElementById('capabilitySimulator');
    if (!simulator) return;

    const tabs = simulator.querySelectorAll('.capability-tab');
    const panels = simulator.querySelectorAll('.capability-panel');

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const capability = tab.dataset.capability;

        // Update active tab
        tabs.forEach(t => t.classList.remove('capability-tab--active'));
        tab.classList.add('capability-tab--active');

        // Update active panel
        panels.forEach(panel => {
          const isActive = panel.dataset.panel === capability;
          panel.classList.toggle('capability-panel--active', isActive);
        });
      });
    });

    // Email Generate Button
    const emailBtn = document.getElementById('emailGenerateBtn');
    const emailResponse = document.getElementById('emailResponse');
    if (emailBtn && emailResponse) {
      emailBtn.addEventListener('click', () => {
        emailBtn.disabled = true;
        emailBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
          </svg>
          Generating...
        `;

        setTimeout(() => {
          emailResponse.classList.add('visible');
          emailBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Generated
          `;
        }, 1200);
      });
    }

    // Analysis Generate Button
    const analysisBtn = document.getElementById('analysisGenerateBtn');
    const analysisResponse = document.getElementById('analysisResponse');
    if (analysisBtn && analysisResponse) {
      analysisBtn.addEventListener('click', () => {
        analysisBtn.disabled = true;
        analysisBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
          </svg>
          Analyzing...
        `;

        setTimeout(() => {
          analysisResponse.classList.add('visible');
          analysisBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Analysis Complete
          `;
        }, 1000);
      });
    }

    // Code Generate Button
    const codeBtn = document.getElementById('codeGenerateBtn');
    const codeResponse = document.getElementById('codeResponse');
    if (codeBtn && codeResponse) {
      codeBtn.addEventListener('click', () => {
        codeBtn.disabled = true;
        codeBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
          </svg>
          Generating...
        `;

        setTimeout(() => {
          codeResponse.classList.add('visible');
          codeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Formula Ready
          `;
        }, 800);
      });
    }

    // Research Generate Button
    const researchBtn = document.getElementById('researchGenerateBtn');
    const researchResponse = document.getElementById('researchResponse');
    if (researchBtn && researchResponse) {
      researchBtn.addEventListener('click', () => {
        researchBtn.disabled = true;
        researchBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
          </svg>
          Researching...
        `;

        setTimeout(() => {
          researchResponse.classList.add('visible');
          researchBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Summary Ready
          `;
        }, 1500);
      });
    }

    // Creative Generate Button
    const creativeBtn = document.getElementById('creativeGenerateBtn');
    const creativeResponse = document.getElementById('creativeResponse');
    if (creativeBtn && creativeResponse) {
      creativeBtn.addEventListener('click', () => {
        creativeBtn.disabled = true;
        creativeBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
          </svg>
          Brainstorming...
        `;

        setTimeout(() => {
          creativeResponse.classList.add('visible');
          creativeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Ideas Generated
          `;
        }, 1100);
      });
    }
  }

  // ============================================================================
  // Section 5: Context Engineering Demo
  // ============================================================================

  function initContextDemo() {
    const replayBtn = document.getElementById('contextReplayBtn');
    const brainStatus = document.getElementById('brainStatus');
    const brain = document.querySelector('.context-demo__brain');
    const messages = document.querySelectorAll('.context-demo__message');
    const divider = document.querySelector('.context-demo__divider');

    if (!replayBtn) return;

    let isPlaying = false;

    function resetDemo() {
      messages.forEach(msg => msg.classList.remove('visible'));
      divider?.classList.remove('visible');
      brain?.classList.remove('context-demo__brain--active', 'context-demo__brain--reset');
      if (brainStatus) brainStatus.textContent = 'Empty';
    }

    function playDemo() {
      if (isPlaying) return;
      isPlaying = true;
      resetDemo();

      replayBtn.disabled = true;
      replayBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
        </svg>
        Playing...
      `;

      // Message 1: User introduces themselves
      setTimeout(() => {
        messages[0]?.classList.add('visible');
        brain?.classList.add('context-demo__brain--active');
        if (brainStatus) brainStatus.textContent = 'Knows: Sarah, Acme Corp';
      }, 500);

      // Message 2: AI responds
      setTimeout(() => {
        messages[1]?.classList.add('visible');
      }, 1500);

      // Session divider appears
      setTimeout(() => {
        divider?.classList.add('visible');
        brain?.classList.remove('context-demo__brain--active');
        brain?.classList.add('context-demo__brain--reset');
        if (brainStatus) brainStatus.textContent = 'Memory Wiped!';
      }, 3000);

      // Message 3: User asks question
      setTimeout(() => {
        messages[2]?.classList.add('visible');
      }, 4000);

      // Message 4: AI doesn't know
      setTimeout(() => {
        messages[3]?.classList.add('visible');
        if (brainStatus) brainStatus.textContent = 'No memory of Sarah';
      }, 5000);

      // Reset button
      setTimeout(() => {
        isPlaying = false;
        replayBtn.disabled = false;
        replayBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          Replay Animation
        `;
      }, 6500);
    }

    replayBtn.addEventListener('click', playDemo);
  }

  // ============================================================================
  // Section 10: Prompt Playground
  // ============================================================================

  function initPromptPlayground() {
    const promptInput = document.getElementById('promptInput');
    const analyzeBtn = document.getElementById('analyzePromptBtn');
    const feedbackSection = document.getElementById('promptFeedback');
    const scoreEl = document.getElementById('promptScore');
    const feedbackItems = document.getElementById('feedbackItems');
    const suggestionEl = document.getElementById('promptSuggestion');
    const copyBtns = document.querySelectorAll('.prompt-example-card__copy');

    if (!analyzeBtn) return;

    // Prompt analysis criteria
    const criteria = [
      {
        id: 'length',
        label: 'Sufficient length (10+ words)',
        check: (text) => text.split(/\s+/).length >= 10
      },
      {
        id: 'specificity',
        label: 'Includes specific details',
        check: (text) => /\b(specific|exactly|particular|detailed|include|format|style|tone)\b/i.test(text)
      },
      {
        id: 'context',
        label: 'Provides context or background',
        check: (text) => /\b(for|about|regarding|context|background|audience|purpose)\b/i.test(text)
      },
      {
        id: 'format',
        label: 'Specifies format or structure',
        check: (text) => /\b(format|structure|bullet|list|paragraph|email|report|steps)\b/i.test(text)
      }
    ];

    function analyzePrompt() {
      const text = promptInput.value.trim();
      if (!text) {
        feedbackSection.style.display = 'none';
        return;
      }

      const results = criteria.map(c => ({
        ...c,
        passed: c.check(text)
      }));

      const passedCount = results.filter(r => r.passed).length;
      const score = passedCount / criteria.length;

      // Show feedback
      feedbackSection.style.display = 'block';

      // Score badge
      let scoreClass, scoreText;
      if (score >= 0.75) {
        scoreClass = 'prompt-playground__feedback-score--good';
        scoreText = 'Good';
      } else if (score >= 0.5) {
        scoreClass = 'prompt-playground__feedback-score--medium';
        scoreText = 'Needs Work';
      } else {
        scoreClass = 'prompt-playground__feedback-score--poor';
        scoreText = 'Too Vague';
      }
      scoreEl.className = `prompt-playground__feedback-score ${scoreClass}`;
      scoreEl.textContent = scoreText;

      // Feedback items
      feedbackItems.innerHTML = results.map(r => `
        <div class="prompt-feedback-item ${r.passed ? 'prompt-feedback-item--pass' : 'prompt-feedback-item--fail'}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            ${r.passed
              ? '<polyline points="20 6 9 17 4 12"></polyline>'
              : '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
            }
          </svg>
          <span>${r.label}</span>
        </div>
      `).join('');

      // Suggestion
      const failed = results.filter(r => !r.passed);
      if (failed.length > 0) {
        const suggestions = {
          length: 'Add more details about what you want.',
          specificity: 'Be more specific about your requirements.',
          context: 'Provide context or background information.',
          format: 'Specify the desired format or structure.'
        };
        suggestionEl.innerHTML = `<strong>Tip:</strong> ${suggestions[failed[0].id]}`;
      } else {
        suggestionEl.innerHTML = '<strong>Great prompt!</strong> This has all the elements of an effective prompt.';
      }
    }

    analyzeBtn.addEventListener('click', analyzePrompt);
    promptInput.addEventListener('input', () => {
      if (feedbackSection.style.display === 'block') {
        analyzePrompt();
      }
    });

    // Copy buttons for examples
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.dataset.copy;
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Show copied feedback
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          setTimeout(() => {
            btn.innerHTML = originalHTML;
          }, 1500);
        });
      });
    });
  }

  // ============================================================================
  // Mobile Sidebar Toggle
  // ============================================================================

  function initMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarMobileToggle');
    const overlay = document.getElementById('sidebarOverlay');

    if (!toggle || !sidebar) return;

    function toggleSidebar() {
      sidebar.classList.toggle('is-open');
      overlay?.classList.toggle('is-visible');
    }

    toggle.addEventListener('click', toggleSidebar);
    overlay?.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking a lesson link (mobile)
    const outlineItems = document.querySelectorAll('.lesson-outline__item');
    outlineItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          toggleSidebar();
        }
      });
    });
  }

  // ============================================================================
  // Intersection Observer for Scroll Animations
  // ============================================================================

  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.interactive-demo').forEach(el => {
      observer.observe(el);
    });
  }

  // ============================================================================
  // Initialize All
  // ============================================================================

  function init() {
    initSlideNavigation();
    initComparisonDemo();
    initLLMDemo();
    initCapabilitySimulator();
    initContextDemo();
    initPromptPlayground();
    initMobileSidebar();
    initScrollAnimations();
    updateProgress();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
