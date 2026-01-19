/**
 * Best Practices Components
 * Prompt Studio (Before/After) and Future Timeline
 */

(function() {
  'use strict';

  // Sample prompt examples by category
  const PROMPT_EXAMPLES = {
    email: [
      {
        before: {
          prompt: 'Write me an email about the project update.',
          issues: ['No audience specified', 'No tone guidance', 'Missing key details'],
          result: 'Subject: Project Update<br><br>Hi team,<br><br>I wanted to give you a quick update on the project. Things are going well and we\'re making progress. Let me know if you have any questions.<br><br>Best regards',
          quality: 'Generic'
        },
        after: {
          prompt: '<strong>Audience:</strong> C-suite executives<br><strong>Tone:</strong> Professional, data-driven<br><strong>Length:</strong> 150 words max<br><br>Write an email updating leadership on Q2 project status. Include: 85% milestone completion, $12K under budget, risk: vendor delay (mitigation in place). End with next steps.',
          improvements: ['Context at start & end', 'Specific constraints', 'Explicit requirements'],
          result: 'Subject: Q2 Project Status: 85% Complete, Under Budget<br><br>Leadership team,<br><br>Our Q2 initiative is tracking ahead of plan:<br>• <strong>Progress:</strong> 85% of milestones achieved<br>• <strong>Budget:</strong> $12K under forecast<br>• <strong>Risk:</strong> Vendor delay identified; backup supplier secured<br><br><strong>Next steps:</strong> Final deliverables by March 15. Steering committee review scheduled for March 10.<br><br>Questions? I\'m available Thursday.',
          quality: 'Actionable'
        }
      },
      {
        before: {
          prompt: 'Draft a follow-up email to Sarah.',
          issues: ['Who is Sarah?', 'What context?', 'What\'s the goal?'],
          result: 'Hi Sarah,<br><br>Just following up on our conversation. Let me know when you have a chance to discuss further.<br><br>Thanks!',
          quality: 'Vague'
        },
        after: {
          prompt: '<strong>Context:</strong> Sarah = VP of Marketing at Acme Corp<br><strong>Previous:</strong> Demo call last Tuesday, she asked about pricing<br><strong>Goal:</strong> Schedule follow-up to present proposal<br><br>Write a follow-up email. Reference the integration feature she was excited about. Suggest 2 specific times next week.',
          improvements: ['Person identified', 'History provided', 'Clear objective'],
          result: 'Hi Sarah,<br><br>Great speaking with you Tuesday about how we can streamline Acme\'s campaign workflows. I know the <strong>Salesforce integration</strong> caught your attention—I\'ve prepared a custom proposal showing the ROI for your team.<br><br>Could we reconnect? I\'m available:<br>• Tuesday 2-3pm<br>• Wednesday 10-11am<br><br>Looking forward to it.',
          quality: 'Personalized'
        }
      },
      {
        before: {
          prompt: 'Write an email declining a meeting.',
          issues: ['No reason given', 'No alternative offered', 'Could seem dismissive'],
          result: 'Hi,<br><br>Unfortunately I won\'t be able to make the meeting. Sorry about that.<br><br>Thanks',
          quality: 'Abrupt'
        },
        after: {
          prompt: '<strong>Situation:</strong> Declining a vendor demo meeting<br><strong>Reason:</strong> Already committed to a competitor<br><strong>Relationship:</strong> Want to keep door open for future<br><strong>Tone:</strong> Gracious, professional<br><br>Decline politely while maintaining the relationship for potential future needs.',
          improvements: ['Reason explained', 'Future-oriented', 'Relationship preserved'],
          result: 'Hi [Name],<br><br>Thank you for reaching out about a demo. After careful consideration, we\'ve decided to move forward with a solution that better fits our current stack.<br><br>That said, I\'ve been impressed by your product updates. Would you mind keeping me on your newsletter? We\'ll be reassessing vendors in Q3, and I\'d like to stay informed.<br><br>Appreciate your understanding.',
          quality: 'Diplomatic'
        }
      }
    ],
    analysis: [
      {
        before: {
          prompt: 'Analyze this data for me.',
          issues: ['What data?', 'What kind of analysis?', 'What\'s the objective?'],
          result: 'I\'d be happy to help analyze data. Could you please share the specific data you\'d like me to look at and what insights you\'re hoping to gain?',
          quality: 'Needs Info'
        },
        after: {
          prompt: '<strong>Data:</strong> Q1 sales by region (attached)<br><strong>Objective:</strong> Identify underperforming regions<br><strong>Criteria:</strong> Compare to Q1 last year + regional targets<br><strong>Output:</strong> Top 3 concerns with recommended actions<br><br>Focus on actionable insights, not just observations.',
          improvements: ['Data specified', 'Clear criteria', 'Output format defined'],
          result: '<strong>Q1 Regional Performance Analysis</strong><br><br><strong>Top 3 Concerns:</strong><br>1. <strong>Midwest:</strong> -18% YoY (target miss: $340K). Action: Deploy top rep from Central; review pricing strategy.<br>2. <strong>Northeast:</strong> -12% YoY (target miss: $220K). Action: Investigate competitor wins; schedule customer calls.<br>3. <strong>Southwest:</strong> Flat growth despite 15% target. Action: Marketing campaign refresh; territory realignment.<br><br>Recommend steering committee review by Friday.',
          quality: 'Actionable'
        }
      },
      {
        before: {
          prompt: 'What do you think about our pricing?',
          issues: ['No competitive context', 'No target customer', 'No specific concern'],
          result: 'Pricing strategy depends on many factors like your target market, competition, costs, and value proposition. Without more details, I can\'t provide specific recommendations.',
          quality: 'Generic'
        },
        after: {
          prompt: '<strong>Our pricing:</strong> $99/mo starter, $299/mo pro<br><strong>Competitors:</strong> CompA: $79/mo, CompB: $149/mo<br><strong>Our differentiation:</strong> Better support, more integrations<br><strong>Problem:</strong> Losing deals at $299 tier<br><br>Analyze our pricing position and suggest adjustments for the Pro tier.',
          improvements: ['Market context', 'Specific problem', 'Competitive data'],
          result: '<strong>Pricing Analysis: Pro Tier</strong><br><br><strong>Issue:</strong> $299 creates 3x jump from Starter—psychological barrier.<br><br><strong>Recommendations:</strong><br>1. Add $199 "Growth" tier between Starter and Pro<br>2. Reposition Pro at $349 with premium features (24/7 support, dedicated CSM)<br>3. Highlight integration value ($X/mo saved vs. point solutions)<br><br><strong>Expected impact:</strong> 15-20% improvement in Starter→Pro conversion.',
          quality: 'Strategic'
        }
      }
    ],
    content: [
      {
        before: {
          prompt: 'Write a blog post about AI.',
          issues: ['Topic too broad', 'No target audience', 'No angle specified'],
          result: 'Title: The Rise of Artificial Intelligence<br><br>Artificial intelligence is transforming our world in many ways. From healthcare to transportation, AI is making an impact...<br><br>[Generic overview continues]',
          quality: 'Generic'
        },
        after: {
          prompt: '<strong>Topic:</strong> How small businesses can use AI chatbots<br><strong>Audience:</strong> Non-technical small business owners<br><strong>Angle:</strong> Practical, cost-saving focus<br><strong>Length:</strong> 800 words<br><strong>Include:</strong> 3 real examples, implementation steps, cost range<br><br>Tone: Friendly, encouraging, not intimidating.',
          improvements: ['Specific topic', 'Defined audience', 'Clear structure'],
          result: '<strong>How Any Small Business Can Add an AI Chatbot (Without Breaking the Bank)</strong><br><br>What if you could answer customer questions at 3am without hiring night staff? That\'s exactly what Sarah\'s Bakery did...<br><br>[Continues with specific examples, step-by-step guide, and pricing tiers from $0-$50/mo]',
          quality: 'Targeted'
        }
      },
      {
        before: {
          prompt: 'Create social media content.',
          issues: ['Which platform?', 'What topic?', 'What tone?'],
          result: 'Here are some social media post ideas:<br>1. Share industry news<br>2. Post behind-the-scenes content<br>3. Ask engaging questions<br>[Generic suggestions]',
          quality: 'Template'
        },
        after: {
          prompt: '<strong>Platform:</strong> LinkedIn<br><strong>Goal:</strong> Thought leadership for B2B SaaS<br><strong>Topic:</strong> Our new feature launch<br><strong>Tone:</strong> Professional but human<br><strong>CTA:</strong> Drive to product page<br><br>Create 3 post variations: 1) Story-driven, 2) Data-focused, 3) Question-based. Each under 200 words.',
          improvements: ['Platform-specific', 'Goal-oriented', 'Multiple options'],
          result: '<strong>Option 1 (Story):</strong><br>"Last month, a customer asked: \'Why does this take 47 clicks?\' Today, it takes 3. Here\'s what we built..."<br><br><strong>Option 2 (Data):</strong><br>"We analyzed 10,000 workflows. The result: 73% contained redundant steps. Our new feature eliminates them automatically..."<br><br><strong>Option 3 (Question):</strong><br>"What\'s the most time-consuming part of your week? For 68% of ops teams, it\'s manual data entry. What if that went to zero?..."',
          quality: 'Strategic'
        }
      }
    ],
    strategy: [
      {
        before: {
          prompt: 'Help me plan Q2.',
          issues: ['What area?', 'What resources?', 'What goals?'],
          result: 'Q2 planning should consider your goals, resources, and market conditions. What specific areas would you like to focus on?',
          quality: 'Needs Info'
        },
        after: {
          prompt: '<strong>Area:</strong> Marketing Q2 plan<br><strong>Budget:</strong> $150K<br><strong>Goal:</strong> 500 new MQLs (currently 300/quarter)<br><strong>Constraints:</strong> Team of 3, no new hires approved<br><strong>What worked Q1:</strong> Webinars (40% of MQLs)<br><br>Create a channel-by-channel plan with budget allocation and expected MQLs per channel.',
          improvements: ['Specific constraints', 'Measurable goal', 'Historical context'],
          result: '<strong>Q2 Marketing Plan: 500 MQL Target</strong><br><br><strong>Channel Allocation:</strong><br>• Webinars (double down): $50K → 250 MQLs<br>• LinkedIn Ads: $40K → 120 MQLs<br>• Content/SEO: $30K → 80 MQLs<br>• Events: $20K → 50 MQLs<br>• Buffer: $10K<br><br><strong>Key Assumptions:</strong><br>• Webinar frequency: 2x/month (up from 1x)<br>• Need 1 contractor for content support<br><br><strong>Risk:</strong> Heavy webinar dependency. Mitigation: Test podcast launch in May.',
          quality: 'Actionable'
        }
      }
    ]
  };

  /**
   * Prompt Studio Component
   */
  class PromptStudio {
    constructor(element) {
      this.element = element;
      this.currentCategory = 'email';
      this.currentExample = 0;

      this.init();
    }

    init() {
      this.cacheElements();
      this.bindEvents();
      this.showExample(0);
    }

    cacheElements() {
      this.categoryBtns = this.element.querySelectorAll('.prompt-studio__category');
      this.beforePrompt = this.element.querySelector('#beforePrompt');
      this.beforeIssues = this.element.querySelector('#beforeIssues');
      this.beforeResult = this.element.querySelector('#beforeResult');
      this.afterPrompt = this.element.querySelector('#afterPrompt');
      this.afterImprovements = this.element.querySelector('#afterImprovements');
      this.afterResult = this.element.querySelector('#afterResult');
      this.navDots = this.element.querySelectorAll('.prompt-studio__nav-dot');
      this.prevBtn = this.element.querySelector('#promptPrev');
      this.nextBtn = this.element.querySelector('#promptNext');
    }

    bindEvents() {
      // Category buttons
      this.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const category = btn.dataset.category;
          this.setCategory(category);
        });
      });

      // Navigation
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.navigate(1));
      }

      // Dot navigation
      this.navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.showExample(index));
      });
    }

    setCategory(category) {
      this.currentCategory = category;
      this.currentExample = 0;

      // Update button states
      this.categoryBtns.forEach(btn => {
        btn.classList.toggle('prompt-studio__category--active', btn.dataset.category === category);
      });

      // Update nav dots count
      this.updateNavDots();

      // Show first example
      this.showExample(0);
    }

    updateNavDots() {
      const examples = PROMPT_EXAMPLES[this.currentCategory] || [];
      const dotsContainer = this.element.querySelector('.prompt-studio__nav-dots');

      if (dotsContainer) {
        dotsContainer.innerHTML = examples.map((_, i) =>
          `<span class="prompt-studio__nav-dot ${i === 0 ? 'prompt-studio__nav-dot--active' : ''}" data-example="${i}"></span>`
        ).join('');

        // Rebind dot events
        this.navDots = this.element.querySelectorAll('.prompt-studio__nav-dot');
        this.navDots.forEach((dot, index) => {
          dot.addEventListener('click', () => this.showExample(index));
        });
      }
    }

    showExample(index) {
      const examples = PROMPT_EXAMPLES[this.currentCategory] || [];
      if (index < 0 || index >= examples.length) return;

      this.currentExample = index;
      const example = examples[index];

      // Update before section
      if (this.beforePrompt) {
        this.beforePrompt.innerHTML = `<p>${example.before.prompt}</p>`;
      }
      if (this.beforeIssues) {
        this.beforeIssues.innerHTML = example.before.issues.map(issue =>
          `<div class="prompt-studio__issue">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>${issue}</span>
          </div>`
        ).join('');
      }
      if (this.beforeResult) {
        this.beforeResult.innerHTML = example.before.result;
        const qualityEl = this.element.querySelector('.prompt-studio__panel--before .prompt-studio__result-quality');
        if (qualityEl) qualityEl.textContent = example.before.quality;
      }

      // Update after section
      if (this.afterPrompt) {
        this.afterPrompt.innerHTML = `<p>${example.after.prompt}</p>`;
      }
      if (this.afterImprovements) {
        this.afterImprovements.innerHTML = example.after.improvements.map(imp =>
          `<div class="prompt-studio__improvement">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${imp}</span>
          </div>`
        ).join('');
      }
      if (this.afterResult) {
        this.afterResult.innerHTML = example.after.result;
        const qualityEl = this.element.querySelector('.prompt-studio__panel--after .prompt-studio__result-quality');
        if (qualityEl) qualityEl.textContent = example.after.quality;
      }

      // Update nav dots
      this.navDots.forEach((dot, i) => {
        dot.classList.toggle('prompt-studio__nav-dot--active', i === index);
      });

      // Update button states
      this.updateNavButtons();
    }

    navigate(direction) {
      const examples = PROMPT_EXAMPLES[this.currentCategory] || [];
      const newIndex = this.currentExample + direction;

      if (newIndex >= 0 && newIndex < examples.length) {
        this.showExample(newIndex);
      }
    }

    updateNavButtons() {
      const examples = PROMPT_EXAMPLES[this.currentCategory] || [];

      if (this.prevBtn) {
        this.prevBtn.disabled = this.currentExample === 0;
      }
      if (this.nextBtn) {
        this.nextBtn.disabled = this.currentExample >= examples.length - 1;
      }
    }
  }

  /**
   * Future Timeline Component
   */
  class FutureTimeline {
    constructor(element) {
      this.element = element;
      this.currentYear = '2026';

      this.init();
    }

    init() {
      this.cacheElements();
      this.bindEvents();
    }

    cacheElements() {
      this.years = this.element.querySelectorAll('.future-timeline__year');
      this.selectorBtns = this.element.querySelectorAll('.future-timeline__selector-btn');
    }

    bindEvents() {
      this.selectorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const year = btn.dataset.year;
          this.showYear(year);
        });
      });
    }

    showYear(year) {
      this.currentYear = year;

      // Update year visibility
      this.years.forEach(yearEl => {
        yearEl.classList.toggle('future-timeline__year--active', yearEl.dataset.year === year);
      });

      // Update button states
      this.selectorBtns.forEach(btn => {
        btn.classList.toggle('future-timeline__selector-btn--active', btn.dataset.year === year);
      });
    }
  }

  // Auto-initialize
  function init() {
    const promptStudio = document.getElementById('promptStudio');
    if (promptStudio) {
      window.promptStudio = new PromptStudio(promptStudio);
    }

    const futureTimeline = document.getElementById('futureTimeline');
    if (futureTimeline) {
      window.futureTimeline = new FutureTimeline(futureTimeline);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export
  window.PromptStudio = PromptStudio;
  window.FutureTimeline = FutureTimeline;
})();
