/**
 * RAG Demo Component
 * Interactive comparison showing AI responses with and without RAG
 */

(function() {
  'use strict';

  // Sample responses for different queries
  const QUERY_RESPONSES = {
    'What is our refund policy for enterprise customers?': {
      without: {
        text: 'Refund policies typically vary by company. Most enterprise agreements include terms for refunds within 30-60 days. I recommend checking your specific contract or contacting customer support for accurate information.',
        confidence: 35,
        sources: []
      },
      with: {
        text: 'Enterprise customers have a <strong>90-day full refund policy</strong> from contract signing. After 90 days, pro-rated refunds are available through Year 1. Contact your Account Manager or email enterprise@company.com to initiate.',
        confidence: 94,
        sources: ['Enterprise_Terms_2024.pdf', 'Refund_Policy_v3.docx', 'CS_Playbook.md']
      }
    },
    'How do I escalate a support ticket?': {
      without: {
        text: 'Support ticket escalation typically involves contacting a supervisor or using your ticketing system\'s escalation feature. Check with your IT department or support team for the specific process at your company.',
        confidence: 28,
        sources: []
      },
      with: {
        text: 'To escalate a ticket: 1) Add <strong>"[ESCALATE]"</strong> to the subject line, or 2) Click "Request Escalation" in the ticket portal. Critical issues (P1) are auto-escalated to the on-call engineer within 15 minutes. SLA: 4-hour response for escalated tickets.',
        confidence: 97,
        sources: ['Support_Escalation_SOP.pdf', 'SLA_Guidelines.docx']
      }
    },
    'What are our Q1 revenue targets?': {
      without: {
        text: 'Revenue targets vary by organization and are typically set during annual planning. I don\'t have access to your company\'s specific financial targets. Please consult your finance team or internal planning documents.',
        confidence: 15,
        sources: []
      },
      with: {
        text: 'Q1 2026 targets: <strong>$4.2M ARR</strong> (18% YoY growth). Breakdown: Enterprise $2.8M, Mid-market $1.1M, SMB $300K. Key milestone: 50 new enterprise logos by March 31. Pipeline requirement: 3.5x coverage.',
        confidence: 99,
        sources: ['2026_Revenue_Plan.xlsx', 'Board_Deck_Q1.pptx', 'Sales_Targets.csv']
      }
    }
  };

  // Default response for unknown queries
  const DEFAULT_RESPONSES = {
    without: {
      text: 'I don\'t have specific information about that topic. For accurate details, please consult your company\'s internal documentation or reach out to the relevant department.',
      confidence: 20,
      sources: []
    },
    with: {
      text: 'Based on your company knowledge base, I found relevant information. The specific details depend on your query, but I can provide accurate, sourced answers from your internal documents.',
      confidence: 85,
      sources: ['Internal_Docs.pdf', 'Company_Wiki.md']
    }
  };

  class RagDemo {
    constructor(element) {
      this.element = element;
      this.isProcessing = false;

      this.init();
    }

    init() {
      this.cacheElements();
      this.bindEvents();
      // Show initial state
      this.showResponses(this.queryInput.value);
    }

    cacheElements() {
      this.queryInput = this.element.querySelector('#ragQueryInput');
      this.queryBtn = this.element.querySelector('#ragQueryBtn');
      this.sampleBtns = this.element.querySelectorAll('.rag-demo__sample-btn');

      // Without RAG elements
      this.withoutProcess = this.element.querySelector('#withoutRagProcess');
      this.withoutResponse = this.element.querySelector('#withoutRagResponse');
      this.withoutSteps = this.withoutProcess.querySelectorAll('.rag-demo__step');

      // With RAG elements
      this.withProcess = this.element.querySelector('#withRagProcess');
      this.withResponse = this.element.querySelector('#withRagResponse');
      this.withSteps = this.withProcess.querySelectorAll('.rag-demo__step');
    }

    bindEvents() {
      // Query button
      this.queryBtn.addEventListener('click', () => this.runComparison());

      // Enter key in input
      this.queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.runComparison();
        }
      });

      // Sample query buttons
      this.sampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const query = btn.dataset.query;
          this.queryInput.value = query;
          this.runComparison();
        });
      });
    }

    async runComparison() {
      if (this.isProcessing) return;

      const query = this.queryInput.value.trim();
      if (!query) return;

      this.isProcessing = true;
      this.element.classList.add('rag-demo--processing');

      // Reset states
      this.resetSteps();
      this.hideResponses();

      // Animate both processes in parallel
      await Promise.all([
        this.animateWithoutRag(),
        this.animateWithRag()
      ]);

      // Show responses
      this.showResponses(query);

      this.isProcessing = false;
      this.element.classList.remove('rag-demo--processing');
    }

    resetSteps() {
      [...this.withoutSteps, ...this.withSteps].forEach(step => {
        step.classList.remove('rag-demo__step--active');
      });
    }

    hideResponses() {
      this.withoutResponse.classList.remove('rag-demo__response--visible');
      this.withResponse.classList.remove('rag-demo__response--visible');

      // Reset confidence bars
      const confidenceFills = this.element.querySelectorAll('.rag-demo__confidence-fill');
      confidenceFills.forEach(fill => {
        fill.classList.remove('rag-demo__confidence-fill--animated');
        fill.style.width = '0';
      });
    }

    async animateWithoutRag() {
      // Step 1: Question received
      await this.delay(200);
      this.withoutSteps[0].classList.add('rag-demo__step--active');

      // Step 2: No company data
      await this.delay(400);
      this.withoutSteps[1].classList.add('rag-demo__step--active');

      // Step 3: Generic response
      await this.delay(600);
      this.withoutSteps[2].classList.add('rag-demo__step--active');
    }

    async animateWithRag() {
      // Step 1: Question received
      await this.delay(200);
      this.withSteps[0].classList.add('rag-demo__step--active');

      // Step 2: Search knowledge base
      await this.delay(500);
      this.withSteps[1].classList.add('rag-demo__step--active');

      // Step 3: Documents retrieved
      await this.delay(800);
      this.withSteps[2].classList.add('rag-demo__step--active');

      // Step 4: Grounded response
      await this.delay(400);
      this.withSteps[3].classList.add('rag-demo__step--active');
    }

    showResponses(query) {
      const responses = QUERY_RESPONSES[query] || DEFAULT_RESPONSES;

      // Update Without RAG response
      this.updateResponse(
        this.withoutResponse,
        responses.without.text,
        responses.without.confidence,
        responses.without.sources,
        false
      );

      // Update With RAG response
      this.updateResponse(
        this.withResponse,
        responses.with.text,
        responses.with.confidence,
        responses.with.sources,
        true
      );

      // Show responses with delay
      setTimeout(() => {
        this.withoutResponse.classList.add('rag-demo__response--visible');
      }, 200);

      setTimeout(() => {
        this.withResponse.classList.add('rag-demo__response--visible');
        this.animateConfidenceBars();
      }, 400);
    }

    updateResponse(container, text, confidence, sources, isRag) {
      // Update text
      const textEl = container.querySelector('.rag-demo__response-text p');
      textEl.innerHTML = text;

      // Update confidence value
      const confidenceValue = container.querySelector('.rag-demo__confidence-value');
      if (isRag) {
        confidenceValue.textContent = `High (${confidence}%)`;
        confidenceValue.className = 'rag-demo__confidence-value rag-demo__confidence-value--high';
      } else {
        confidenceValue.textContent = 'Low';
        confidenceValue.className = 'rag-demo__confidence-value rag-demo__confidence-value--low';
      }

      // Update confidence bar data attribute
      const confidenceFill = container.querySelector('.rag-demo__confidence-fill');
      confidenceFill.style.setProperty('--confidence', `${confidence}%`);

      // Update sources
      const sourcesContainer = container.querySelector('.rag-demo__sources');
      if (sources.length > 0) {
        sourcesContainer.innerHTML = `
          <span class="rag-demo__sources-label">Sources:</span>
          <div class="rag-demo__sources-list">
            ${sources.map(s => `<span class="rag-demo__source-tag">${s}</span>`).join('')}
          </div>
        `;
      } else {
        sourcesContainer.innerHTML = `
          <span class="rag-demo__sources-label">Sources:</span>
          <span class="rag-demo__sources-none">No specific sources</span>
        `;
      }
    }

    animateConfidenceBars() {
      const confidenceFills = this.element.querySelectorAll('.rag-demo__confidence-fill');
      confidenceFills.forEach(fill => {
        setTimeout(() => {
          fill.classList.add('rag-demo__confidence-fill--animated');
        }, 100);
      });
    }

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // Auto-initialize
  function init() {
    const ragDemo = document.getElementById('ragDemo');
    if (ragDemo) {
      window.ragDemo = new RagDemo(ragDemo);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export
  window.RagDemo = RagDemo;
})();
