/**
 * Context Window Demo Component
 * Interactive demonstration of LLM context/memory limits
 */

(function() {
  'use strict';

  // Sample messages for business scenario
  const SAMPLE_MESSAGES = [
    {
      type: 'user',
      text: 'Summarize last week\'s project meeting',
      tokens: 450
    },
    {
      type: 'ai',
      text: 'The team discussed Q2 milestones, budget allocation for marketing, and the new product launch timeline. Key decisions included increasing marketing spend by 15%.',
      tokens: 680
    },
    {
      type: 'user',
      text: 'What was the budget decision?',
      tokens: 320
    },
    {
      type: 'ai',
      text: 'The budget was increased by 15% for marketing initiatives. This includes digital advertising, content creation, and influencer partnerships for the Q2 campaign.',
      tokens: 590
    },
    {
      type: 'user',
      text: 'Draft a follow-up email to stakeholders',
      tokens: 380
    },
    {
      type: 'ai',
      text: 'Subject: Q2 Project Update - Key Decisions\n\nDear Stakeholders,\n\nFollowing our project meeting, I wanted to share the key outcomes and next steps...',
      tokens: 720
    },
    {
      type: 'user',
      text: 'Add a section about timeline changes',
      tokens: 410
    },
    {
      type: 'ai',
      text: 'I\'ve added the timeline section. The launch has been moved from March 15th to April 1st to accommodate additional testing phases.',
      tokens: 520
    }
  ];

  class ContextWindowDemo {
    constructor(element, options = {}) {
      this.element = element;
      this.options = {
        maxTokens: options.maxTokens || 8000,
        tokensPerUserMessage: options.tokensPerUserMessage || 400,
        aiResponseDelay: options.aiResponseDelay || 800,
        ...options
      };

      this.messages = [];
      this.currentTokens = 0;
      this.sampleIndex = 0;

      this.init();
    }

    init() {
      this.cacheElements();
      this.bindEvents();
      this.updateDisplay();
    }

    cacheElements() {
      this.messagesContainer = this.element.querySelector('#contextMessages');
      this.tokenMeterFill = this.element.querySelector('#tokenMeterFill');
      this.tokenCount = this.element.querySelector('#tokenCount');
      this.tokenMax = this.element.querySelector('#tokenMax');
      this.input = this.element.querySelector('#contextInput');
      this.sendBtn = this.element.querySelector('#contextSendBtn');
      this.sizeBtns = this.element.querySelectorAll('.context-window__size-btn');
    }

    bindEvents() {
      // Send button click
      this.sendBtn.addEventListener('click', () => this.handleSend());

      // Enter key in input
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });

      // Size toggle buttons
      this.sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const size = parseInt(btn.dataset.size, 10);
          this.setWindowSize(size);

          // Update active state
          this.sizeBtns.forEach(b => b.classList.remove('context-window__size-btn--active'));
          btn.classList.add('context-window__size-btn--active');
        });
      });
    }

    handleSend() {
      const text = this.input.value.trim();

      if (text) {
        // Use user's custom message
        this.addMessage(text, 'user', this.options.tokensPerUserMessage);
        this.input.value = '';

        // Simulate AI response after delay
        setTimeout(() => {
          this.addAIResponse();
        }, this.options.aiResponseDelay);
      } else {
        // Use next sample message pair
        this.addNextSamplePair();
      }
    }

    addNextSamplePair() {
      if (this.sampleIndex >= SAMPLE_MESSAGES.length) {
        this.sampleIndex = 0; // Loop back
      }

      const userMsg = SAMPLE_MESSAGES[this.sampleIndex];
      if (userMsg && userMsg.type === 'user') {
        this.addMessage(userMsg.text, userMsg.type, userMsg.tokens);
        this.sampleIndex++;

        // Add AI response after delay
        setTimeout(() => {
          const aiMsg = SAMPLE_MESSAGES[this.sampleIndex];
          if (aiMsg && aiMsg.type === 'ai') {
            this.addMessage(aiMsg.text, aiMsg.type, aiMsg.tokens);
            this.sampleIndex++;
          }
        }, this.options.aiResponseDelay);
      }
    }

    addAIResponse() {
      // Generate a contextual AI response
      const responses = [
        { text: 'I understand. Let me help you with that request based on our conversation.', tokens: 450 },
        { text: 'Based on what we\'ve discussed, here\'s my recommendation for moving forward with the project.', tokens: 520 },
        { text: 'I\'ve noted that information. Would you like me to incorporate it into our current discussion?', tokens: 480 },
        { text: 'That\'s a great point. Let me expand on how this connects to our earlier topics.', tokens: 440 }
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      this.addMessage(response.text, 'ai', response.tokens);
    }

    addMessage(text, type, tokens) {
      const message = { text, type, tokens, id: Date.now() };
      this.messages.push(message);
      this.currentTokens += tokens;

      // Create and append message element
      const messageEl = this.createMessageElement(message);
      this.messagesContainer.appendChild(messageEl);

      // Check for overflow and remove old messages
      this.handleOverflow();

      // Update display
      this.updateDisplay();

      // Scroll to bottom
      this.scrollToBottom();
    }

    createMessageElement(message) {
      const div = document.createElement('div');
      div.className = `context-window__message context-window__message--${message.type}`;
      div.dataset.id = message.id;
      div.dataset.tokens = message.tokens;

      const avatar = message.type === 'user' ? 'U' : 'AI';
      const role = message.type === 'user' ? 'You' : 'Assistant';

      div.innerHTML = `
        <div class="context-window__message-avatar">${avatar}</div>
        <div class="context-window__message-content">
          <div class="context-window__message-role">${role}</div>
          <div class="context-window__message-text">${this.escapeHtml(message.text)}</div>
        </div>
        <div class="context-window__message-tokens">${message.tokens}</div>
      `;

      return div;
    }

    handleOverflow() {
      while (this.currentTokens > this.options.maxTokens && this.messages.length > 0) {
        this.removeOldestMessage();
      }

      // Update overflow indicator
      const hasOverflow = this.messages.length > 0 && this.currentTokens >= this.options.maxTokens * 0.9;
      this.element.classList.toggle('context-window--has-overflow', hasOverflow);
    }

    removeOldestMessage() {
      const oldestMessage = this.messages.shift();
      if (!oldestMessage) return;

      this.currentTokens -= oldestMessage.tokens;

      // Find and animate out the DOM element
      const messageEl = this.messagesContainer.querySelector(`[data-id="${oldestMessage.id}"]`);
      if (messageEl) {
        messageEl.classList.add('context-window__message--exiting');

        // Remove after animation completes
        setTimeout(() => {
          messageEl.remove();
        }, 500); // Match CSS animation duration
      }
    }

    setWindowSize(size) {
      const previousMax = this.options.maxTokens;
      this.options.maxTokens = size;

      // Update display
      this.tokenMax.textContent = size.toLocaleString();

      // If shrinking, may need to remove messages
      if (size < previousMax) {
        this.handleOverflow();
      }

      this.updateDisplay();
    }

    updateDisplay() {
      // Update token counter with animation
      this.animateCounter(this.tokenCount, this.currentTokens);

      // Update meter fill
      const percentage = Math.min((this.currentTokens / this.options.maxTokens) * 100, 100);
      this.tokenMeterFill.style.width = `${percentage}%`;

      // Update meter color based on usage
      this.tokenMeterFill.classList.remove(
        'context-window__meter-fill--warning',
        'context-window__meter-fill--danger',
        'context-window__meter-fill--pulse'
      );

      if (percentage >= 90) {
        this.tokenMeterFill.classList.add('context-window__meter-fill--danger', 'context-window__meter-fill--pulse');
      } else if (percentage >= 70) {
        this.tokenMeterFill.classList.add('context-window__meter-fill--warning');
      }
    }

    animateCounter(element, target) {
      const current = parseInt(element.textContent.replace(/,/g, ''), 10) || 0;
      const duration = 300;
      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(current + (target - current) * easeOut);

        element.textContent = value.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    }

    scrollToBottom() {
      this.messagesContainer.scrollTo({
        top: this.messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML.replace(/\n/g, '<br>');
    }

    // Public API
    reset() {
      this.messages = [];
      this.currentTokens = 0;
      this.sampleIndex = 0;
      this.messagesContainer.innerHTML = '';
      this.updateDisplay();
      this.element.classList.remove('context-window--has-overflow');
    }
  }

  // Auto-initialize on DOM ready
  function init() {
    const contextWindow = document.getElementById('contextWindowDemo');
    if (contextWindow) {
      window.contextWindowDemo = new ContextWindowDemo(contextWindow);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.ContextWindowDemo = ContextWindowDemo;
})();
