# Memory Management System

This directory contains the glial-inspired memory management system for the AI Training Platform project. The system mirrors neuroscience principles where astrocytes capture memories, oligodendrocytes consolidate them over time, and microglia prune stale information.

## Directory Structure

```
memory/
├── sessions/                    # Raw session captures (60-day retention)
│   ├── 2026-01-19-*.md         # Sprint sessions (unconsolidated → consolidated)
│   ├── 2026-01-20-*.md         # Production readiness session
│   └── CONSOLIDATION-REPORT-*.md
├── archived/                    # Pruned but preserved items (permanent)
│   └── [empty currently - pruning begins after 60 days]
└── metadata/                    # Tracking and indices
    ├── importance-scores.json
    ├── access-log.json
    └── *-CONSOLIDATION-SUMMARY.txt
```

## How to Search Memory

### Search Recent Sessions (Last 30 Days)

```bash
# Find all production-related decisions
Grep pattern="DECISION|production" path="memory/sessions/"

# List all session files by name
Glob pattern="memory/sessions/*.md"

# Search for specific topic (e.g., "user menu")
Grep pattern="user menu" path="memory/sessions/" output_mode="content"
```

### Search by Memory Type

```bash
# Find decisions
Grep pattern="Type: DECISION" path="memory/sessions/"

# Find solutions/fixes
Grep pattern="Type: SOLUTION" path="memory/sessions/"

# Find learnings/insights
Grep pattern="Type: LEARNING" path="memory/sessions/"
```

### Search by Tag

```bash
# Find all critical items
Grep pattern="#critical" path="memory/sessions/"

# Find pattern-related memories
Grep pattern="#pattern" path="memory/sessions/"

# Find accessibility-related items
Grep pattern="#accessibility" path="memory/sessions/"
```

## Session Capture Format

Every captured session follows this structure:

```markdown
---
date: YYYY-MM-DD
type: [sprint | planning | review | incident | feature-completion]
status: [unconsolidated | day-consolidated | consolidated]
importance: [score + tags]
tags: #tag1 #tag2
---

# [Session Title]

## Key Decisions
- Decision made: Rationale
- Alternatives considered: Why rejected

## Action Items
- [ ] Task - Owner: Name - Due: Date

## Technical Insights
- Insight: Context

## Blockers
- Blocker: Status

## Files Modified
| File | Change | Status |
|------|--------|--------|
```

## Importance Scoring System

### Base Score (Access Pattern)
- Last accessed 0-7 days: +5
- Last accessed 8-14 days: +3
- Last accessed 15-30 days: +1
- Not accessed 31+ days: 0

### Contextual Boosts (Emotional Salience)
- User explicitly tagged #important: +10
- Associated with successful outcome: +7
- Referenced in multiple domains: +5
- Recurring pattern (3+ occurrences): +4
- User used emphasis ("CRITICAL", "!!!!"): +8
- Created during incident/crisis: +6

### Protection Thresholds
- Score >= 15: Permanent protection
- Score 10-14: Extended retention (90 days)
- Score 5-9: Standard retention (30 days)
- Score < 5: Pruning candidate

## Multi-Stage Pruning Lifecycle

Items move through stages based on age and importance:

| Stage | Age | Action | Tag |
|-------|-----|--------|-----|
| Active | 0-30 days | Monitor and reference | #active |
| Stabilization | 0-14 days (all items) | Protected; don't archive | #stabilizing |
| Candidate | 30+ days, score < 5 | Review for relevance | #pruning-candidate |
| Review | 45+ days, originally flagged | Re-evaluate importance | #review-needed |
| Archive | 60+ days, no active reference | Move to memory/archived/ | #archived |

## Glial Functions in This System

### Astrocytes (CAPTURE)
- Form memory traces from sessions
- Extract emotional/contextual salience
- Assign importance scores
- Persist raw session data in memory/sessions/

### Oligodendrocytes (CONSOLIDATE)
- Integrate sessions into CLAUDE.md over hours→days
- Identify patterns (mentioned 2+ times = pattern)
- Merge duplicate concepts
- Cross-reference related memories
- Progressive refinement (unconsolidated → day-consolidated → consolidated)

### Microglia (PRUNE)
- Apply multi-stage tagging based on age
- Check protection signals before removal
- Move old items to memory/archived/ (never delete)
- Maintain pruning efficiency (keep system lean)

## Recent Consolidations

### Production Readiness Phase (2026-01-20)
- **Sessions Captured**: 2026-01-20-production-readiness-completion.md
- **Patterns Added**: Pattern 11 (Consistent Header Components)
- **CLAUDE.md Lines Modified**: +12 (Pattern 11 + Phase description)
- **Status**: CONSOLIDATED - Platform now production ready

### Sprint 10 Expansion (2026-01-19)
- **Sessions Captured**: 2026-01-19-sprint-10-ai-fundamentals-expansion.md
- **Patterns Validated**: Pattern 9 (Tabbed Interfaces), Pattern 10 (Quantified Metrics)
- **CLAUDE.md Lines Modified**: +40 (New patterns + Sprint 10 details)
- **Status**: CONSOLIDATED - Module expansion complete

### Sprint 7 Course Launch (2026-01-19)
- **Sessions Captured**: 2026-01-19-sprint-7-planning.md
- **Patterns Validated**: Pattern 3 (Scenario-Based Learning), Pattern 4 (Side-by-Side Comparison)
- **Status**: CONSOLIDATED - Context Engineering course ready

## When to Invoke Memory System

### CAPTURE
- After sprint completion
- After major decision (especially trade-offs)
- After bug fix (document pattern)
- Before context switch (snapshot for resumption)

### CONSOLIDATE
- Daily at end of work session (Phase 1: Immediate)
- Every 3 days (Phase 2: Daily Synthesis)
- Weekly (Phase 3: Multi-Day Integration + Phase 4: Deep Consolidation)

### PRUNE
- Every 2 weeks (check for candidates)
- When CLAUDE.md exceeds 500 lines
- When searching becomes slow/inefficient

### RETRIEVE
- Before major architectural decisions
- When user asks "What did we decide about X?"
- When encountering familiar problems
- During sprint planning (check velocity patterns)

## CLAUDE.md: The Consolidated Memory

The main project file `/Users/mahmoudissa/Desktop/AI Applications/training/CLAUDE.md` serves as the oligodendrocyte-consolidated memory - the stable, refined version of the project's current state and patterns.

**Current Status**:
- Lines: 435/500 (87% utilization)
- Patterns: 11 validated, production-tested
- Sections: 6 major (Overview, Architecture, Patterns, Best Practices, History, Future)
- Last Updated: 2026-01-20 (Production Readiness consolidation)

**Key Sections**:
1. **Memory Retrieval Guide** (Lines 5-54) - Teaches future sessions how to search
2. **Project Overview** (Lines 56-64) - Company, differentiators, mission
3. **Architecture** (Lines 66-127) - Technical structure, design system, components
4. **Validated Patterns** (Lines 165-239) - 11 cross-sprint patterns with evidence
5. **Development History** (Lines 268-432) - Sprints 1-10 + Production Readiness
6. **Future Sprints** (Lines 427-432) - Roadmap and planned work

## Next Consolidation Cycle

**Date**: 2026-02-03 (15 days from last consolidation)
**Scope**: Sessions from 2026-01-19 exit stabilization period; assess pruning candidates
**Expected Actions**:
- Review all 2026-01-19 sessions for archival fitness
- Check protection signals before any removal
- Move candidates to memory/archived/2026-01/
- Update importance scores metadata
- Potentially add new patterns if cross-session themes emerge

## Quick Reference: Command Patterns

### Find Related Sessions
```bash
Grep pattern="context engineering" path="memory/sessions/" output_mode="files_with_matches"
```

### List Sessions by Date
```bash
Glob pattern="memory/sessions/2026-01-*.md"
```

### Search for Decisions
```bash
Grep pattern="DECISION.*rationale" path="memory/sessions/" output_mode="content" -A 2
```

### Find Blocked Work
```bash
Grep pattern="BLOCKER|blocker" path="memory/sessions/" output_mode="content"
```

### Check Protection Status
```bash
Grep pattern="#protect|#keep|#core" path="memory/sessions/" output_mode="files_with_matches"
```

## Memory Health Dashboard

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Active Sessions | 9 | 10-20 | ✅ Healthy |
| Pruning Candidates | 0 | < 3 | ✅ Optimal |
| CLAUDE.md Lines | 435 | < 500 | ✅ Efficient |
| Patterns Total | 11 | 8-12 | ✅ Optimal |
| Cross-References | Validated | Linked | ✅ Complete |
| Last Consolidation | 2026-01-20 | < 3 days | ✅ Recent |

## Integration with CLAUDE.md

This memory system **feeds into and from** CLAUDE.md:

```
Raw Session (memory/sessions/)
         ↓
    CONSOLIDATE (Oligodendrocyte)
         ↓
  CLAUDE.md (Refined, Stable)
         ↓
    NEXT SESSION (Claude Code reads CLAUDE.md)
         ↓
    Uses memory to inform decisions & patterns
```

The Memory Retrieval Guide in CLAUDE.md teaches all future Claude Code sessions how to search memory/ when they need extended context beyond CLAUDE.md.

---

**System Status**: OPERATIONAL
**Last Maintenance**: 2026-01-20
**Next Review**: 2026-01-27 (routine check)
**Next Pruning**: 2026-02-03 (when stabilization ends)
