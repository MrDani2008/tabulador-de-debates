# ROADMAP.md

# British Parliamentary Debate Tournament Management System

Version: 2.0

Status: Active

---

# Purpose

This roadmap defines the implementation order of the project.

Every feature must be implemented according to this roadmap.

The AI agent must never skip milestones unless explicitly instructed.

Only one milestone should be implemented at a time.

After completing a milestone:

- Verify the project builds successfully.
- Update this roadmap.
- Update DECISIONS.md if architectural changes were introduced.
- Stop and wait for approval before continuing.

---

# Current Status

Current Phase:

Phase 6 — Completed

Current Milestone:

Phase 7

---

# Phase 1 — Project Foundation

Status:

Completed

Objectives:

- Initialize project structure
- Configure Next.js
- Configure TypeScript
- Configure Tailwind CSS
- Configure shadcn/ui
- Configure environment variables
- Configure ESLint
- Configure Prettier
- Configure project aliases
- Configure folder structure
- Configure Git conventions

Deliverables:

- Working project
- Clean architecture
- Initial folders
- Development environment

---

# Phase 2 — Core Infrastructure

Status:

Completed

Objectives:

- Configuration module
- Constants
- Shared types
- Utilities
- Error handling
- Logging
- Validation layer
- Dependency structure

Deliverables:

- Shared project foundation

---

# Phase 3 — Google Sheets Persistence

Status:

Completed

Objectives:

- Google Sheets Provider
- Google Authentication
- Data Provider Layer
- Repository interfaces
- Repository implementations
- Connection testing
- Synchronization

Deliverables:

- Fully functional persistence layer

---

# Phase 4 — Tournament Core

Status:

Completed

Objectives:

- Tournament entity
- Tournament configuration
- Tournament settings
- General information

Deliverables:

- Tournament management

---

# Phase 5 — Institution Management

Status:

Completed

Objectives:

- CRUD Institutions
- Validation
- Search
- Filters

Deliverables:

- Institution module

---

# Phase 6 — Team Management

Status:

Completed

Objectives:

- CRUD Teams
- Team categories
- Team validation
- Team history
- Import
- Export

Deliverables:

- Team module

---

# Phase 7 — Speaker Management

Status:

Pending

Objectives:

- CRUD Speakers
- Statistics
- Team assignment

Deliverables:

- Speaker module

---

# Phase 8 — Adjudicator Management

Status:

Pending

Objectives:

- CRUD Adjudicators
- Categories
- Conflicts
- Availability
- Statistics

Deliverables:

- Adjudicator module

---

# Phase 9 — Venue & Room Management

Status:

Pending

Objectives:

- CRUD Venues
- CRUD Rooms
- Room assignment

Deliverables:

- Venue module
- Room module

---

# Phase 10 — Round Management

Status:

Pending

Objectives:

- Create rounds
- Publish rounds
- Lock rounds
- Round lifecycle

Deliverables:

- Round module

---

# Phase 11 — Pairing Engine

Status:

Pending

Objectives:

- Automatic pairings
- AG allocation
- AO allocation
- BG allocation
- BO allocation
- Position balancing
- Government/Opposition balancing
- Opening/Closing balancing
- Avoid repeated opponents
- Avoid institution conflicts
- BYE generation
- Manual adjustments

Deliverables:

- Complete pairing engine

---

# Phase 12 — Adjudicator Allocation Engine

Status:

Pending

Objectives:

- Automatic allocation
- Conflict detection
- Chair assignment
- Panel assignment
- Workload balancing
- Manual overrides

Deliverables:

- Allocation engine

---

# Phase 13 — Ballot Management

Status:

Pending

Objectives:

- Ballot creation
- Validation
- Approval
- Editing
- Locking

Deliverables:

- Ballot module

---

# Phase 14 — Results Processing

Status:

Pending

Objectives:

- Process ballots
- Calculate scores
- Update history
- Automatic recalculation

Deliverables:

- Results module

---

# Phase 15 — Standings Engine

Status:

Pending

Objectives:

- Team rankings
- Speaker rankings
- Institution rankings
- Tie-breaks
- Live updates

Deliverables:

- Ranking engine

---

# Phase 16 — Statistics Engine

Status:

Pending

Objectives:

- Team statistics
- Speaker statistics
- Judge statistics
- Room statistics
- Tournament statistics

Deliverables:

- Statistics module

---

# Phase 17 — Dashboard

Status:

Pending

Objectives:

- Tournament overview
- Statistics
- Alerts
- Live information

Deliverables:

- Dashboard

---

# Phase 18 — Public Interface

Status:

Pending

Objectives:

- Public pairings
- Public standings
- Public results
- Public statistics

Deliverables:

- Public pages

---

# Phase 19 — Reports

Status:

Pending

Objectives:

- CSV export
- Excel export
- PDF export

Deliverables:

- Reporting module

---

# Phase 20 — Administration

Status:

Pending

Objectives:

- User management
- Roles
- Permissions
- Audit log
- System settings

Deliverables:

- Administration module

---

# Phase 21 — Production Readiness

Status:

Pending

Objectives:

- Performance optimization
- Security review
- Accessibility review
- Error handling review
- Code cleanup
- Documentation review
- Deployment verification

Deliverables:

- Production-ready application

---

# Completion Criteria

The roadmap is complete when:

- Every phase is marked as Completed.
- The application builds successfully.
- All functional requirements from PROJECT_SPEC.md are implemented.
- All architectural decisions are documented.
- The application is deployable to Vercel.
- Google Sheets integration is fully operational.
- The system is considered production-ready.

---

# AI Agent Instructions

Always:

- Read this roadmap before implementation.
- Implement only the next pending phase.
- Do not skip phases.
- Do not work on multiple phases simultaneously.
- Update this document after completing a phase.
- Stop after each completed milestone and wait for approval.