# ENGINEERING_GUIDELINES.md

## Purpose

This document defines the engineering rules that govern the entire project.

Every implementation, refactor, architectural decision, and feature must comply with these guidelines.

These rules are mandatory.

---

# Source of Truth

Before performing any work, always read:

1. ENGINEERING_GUIDELINES.md
2. PROJECT_SPEC.md
3. ROADMAP.md
4. DECISIONS.md

If any conflict exists:

ENGINEERING_GUIDELINES.md takes precedence.

---

# Core Principles

The project must always prioritize:

- Correctness over speed
- Maintainability over shortcuts
- Simplicity over unnecessary complexity
- Readability over clever code
- Modularity over monolithic implementations
- Reusability over duplication

---

# No Assumptions Policy

Never assume missing requirements.

If information is missing:

- Stop.
- Explain what information is missing.
- Ask for clarification.

Never invent:

- Business rules
- Tournament rules
- API behavior
- Database fields
- User workflows

---

# Architecture

The application must follow Clean Architecture principles.

The dependency flow must always be:

UI

↓

API Routes

↓

Application Services

↓

Repositories

↓

Data Providers

↓

Google Sheets Provider

No layer may bypass another.

---

# Data Abstraction Layer

Google Sheets is NOT the application's database.

Google Sheets is ONLY a persistence provider.

Business logic must never know that Google Sheets exists.

Future migration to another persistence provider must require changing only the Data Provider implementation.

---

# Repository Pattern

All data access must go through repositories.

Examples:

- TournamentRepository
- TeamRepository
- InstitutionRepository
- SpeakerRepository
- AdjudicatorRepository
- VenueRepository
- RoomRepository
- RoundRepository
- DebateRepository
- BallotRepository
- RankingRepository

Repositories expose business-oriented operations.

Repositories never expose Google Sheets logic.

---

# Service Layer

Business rules belong only inside Services.

Examples:

- PairingService
- RankingService
- BallotService
- AdjudicatorAllocationService
- TournamentService

Services may communicate with repositories.

Services must never communicate directly with Google Sheets.

---

# Domain Rules

Tournament rules must remain isolated.

British Parliamentary logic must never appear inside:

- React Components
- API Routes
- Data Providers

All BP rules belong inside Domain Services.

This allows supporting additional debate formats in the future.

---

# UI Rules

React components must only:

- Display information
- Handle user interaction
- Call API endpoints

React components must never:

- Implement tournament logic
- Calculate rankings
- Generate pairings
- Validate tournament rules

---

# API Rules

API Routes are orchestration layers.

Responsibilities:

- Validate requests
- Call services
- Return responses

API Routes must never:

- Implement business logic
- Access Google Sheets directly

---

# Google Sheets Rules

Google Sheets access is restricted to the Google Sheets Provider.

Never access Google Sheets from:

- Components
- Services
- Repositories
- API Routes

Only the Provider may communicate with the Google Sheets API.

---

# Code Quality

All code must be:

- Readable
- Modular
- Predictable
- Strongly typed
- Self-explanatory

Avoid unnecessary comments.

Prefer expressive naming.

---

# TypeScript

Use strict TypeScript.

Avoid:

- any
- unknown (unless justified)
- unsafe casting

Create explicit interfaces and types whenever possible.

---

# Naming

Use consistent naming.

Examples:

Services

TeamService

Repositories

TeamRepository

Providers

GoogleSheetsProvider

Components

TeamTable

Hooks

useTeams

Types

Team

Constants

MAX_ROUNDS

---

# SOLID

All implementations should follow SOLID principles.

Especially:

- Single Responsibility
- Dependency Inversion
- Open/Closed Principle

---

# DRY

Never duplicate logic.

If logic appears more than once:

Extract it.

---

# KISS

Prefer simple solutions.

Avoid over-engineering.

---

# YAGNI

Do not build functionality that is not required by PROJECT_SPEC.md.

---

# Feature Development

Before implementing a feature:

1. Read PROJECT_SPEC.md
2. Read ROADMAP.md
3. Analyze current implementation
4. Reuse existing modules
5. Identify dependencies

Never implement features outside the roadmap unless explicitly requested.

---

# Refactoring

Refactoring must not change behavior.

Goals:

- Improve readability
- Improve maintainability
- Reduce duplication

---

# Breaking Changes

Never introduce breaking changes without approval.

If unavoidable:

Explain:

- Why
- Impact
- Migration strategy

Wait for approval.

---

# Error Handling

Every operation must:

- Validate input
- Handle failures gracefully
- Return meaningful errors

Never expose:

- Internal stack traces
- Secrets
- Credentials

---

# Validation

Validate:

- API requests
- Forms
- Environment variables
- Imported data

Never trust client input.

---

# Environment Variables

Secrets must never be hardcoded.

Always use environment variables.

Google credentials must remain server-side.

---

# Logging

Log only useful operational information.

Never log:

- Secrets
- Tokens
- Credentials

---

# Performance

Prefer:

- Efficient algorithms
- Lazy loading
- Server Components where appropriate
- Minimal API calls

Avoid unnecessary renders.

---

# Testing Mindset

Every new module should be easy to test.

Favor pure functions whenever possible.

Business logic should not depend on UI.

---

# Pairing Engine

The Pairing Engine must remain an isolated module.

Responsibilities:

- Pair teams
- Assign positions
- Avoid repeated opponents
- Balance positions
- Balance Government/Opposition
- Balance Opening/Closing
- Handle BYEs
- Respect tournament constraints

No UI code may exist inside the Pairing Engine.

---

# Ranking Engine

The Ranking Engine must remain independent.

Responsibilities:

- Calculate rankings
- Wins
- Team points
- Speaker points
- Tie-breaks

No persistence logic may exist inside the Ranking Engine.

---

# Adjudicator Allocation

Judge allocation must be an isolated service.

Responsibilities:

- Conflict avoidance
- Panel generation
- Chair assignment
- Workload balancing

---

# Documentation

Whenever architecture changes:

Update:

- DECISIONS.md

Whenever a milestone finishes:

Update:

- ROADMAP.md

Whenever requirements change:

Update:

- PROJECT_SPEC.md

---

# Project Evolution

The system must remain extensible.

Future support for additional debate formats must require adding new implementations rather than modifying existing modules.

---

# Implementation Workflow

For every task:

1. Read the .ai/ directory.
2. Analyze the existing implementation.
3. Reuse existing code whenever possible.
4. Design before coding.
5. Implement one logical milestone only.
6. Verify the project builds successfully.
7. Update ROADMAP.md.
8. Update DECISIONS.md if architecture changed.
9. Stop and wait for approval before starting the next milestone.

---

# AI Agent Rules

Always:

- Preserve architecture.
- Preserve modularity.
- Preserve abstraction.
- Preserve readability.
- Reuse existing implementations.

Never:

- Assume missing requirements.
- Duplicate logic.
- Mix business logic with UI.
- Access Google Sheets outside the Provider.
- Skip roadmap phases.
- Rewrite working code unnecessarily.
- Change architecture silently.

The objective is to build a production-ready, maintainable, scalable British Parliamentary Debate Tournament Management System inspired by the workflow of PLERD while remaining an original implementation.