# DECISIONS.md

# Architecture Decision Records (ADR)

Version: 1.0

This document records all important architectural decisions made during the development of the British Parliamentary Debate Tournament Management System.

Each decision is immutable once recorded. New changes must be added as new ADR entries.

---

# ADR-0001 — Adoption of Next.js as Primary Framework

## Status
Accepted

## Date
2026-06-30

## Context

The application requires a modern full-stack framework capable of handling:

- Server-side rendering
- API routes
- Frontend UI
- Deployment on Vercel
- Type-safe development with TypeScript

A framework is needed that reduces backend complexity while maintaining scalability.

---

## Decision

Next.js is adopted as the primary framework for the entire application.

The App Router architecture will be used.

---

## Consequences

### Positive

- Unified frontend and backend in a single framework
- Native support for Vercel deployment
- Simplified routing and API structure
- Strong TypeScript support
- Good performance and scalability

### Negative

- Some backend flexibility is reduced compared to standalone server frameworks
- Requires adherence to Next.js conventions

---

# ADR-0002 — Use of TypeScript as Primary Language

## Status
Accepted

## Date
2026-06-30

---

## Context

The system involves complex data structures including tournaments, debates, teams, adjudicators, and rankings.

Type safety is required to prevent runtime errors and improve maintainability.

---

## Decision

The entire codebase will be written in TypeScript with strict mode enabled.

---

## Consequences

### Positive

- Improved type safety
- Better developer experience
- Reduced runtime errors
- Easier refactoring

### Negative

- Slightly higher initial development complexity

---

# ADR-0003 — Google Sheets as Initial Persistence Layer

## Status
Accepted

## Date
2026-06-30

---

## Context

The system requires a lightweight, easily accessible persistence solution that:

- Does not require a dedicated database server
- Allows manual inspection of data
- Is easy to deploy
- Supports small to medium-scale tournaments

---

## Decision

Google Sheets will be used as the initial persistence provider.

It will not be part of the business logic layer.

All data access must go through a Data Provider abstraction layer.

---

## Consequences

### Positive

- Easy deployment
- Transparent data storage
- No database infrastructure required
- Easy debugging and manual editing

### Negative

- Limited performance at large scale
- API rate limits
- Requires careful abstraction to avoid coupling

---

# ADR-0004 — Adoption of Clean Architecture

## Status
Accepted

## Date
2026-06-30

---

## Context

The system contains complex business logic including:

- Pairing generation
- Judge allocation
- Ranking calculations
- Tournament lifecycle management

A structured architecture is required to avoid coupling and maintain scalability.

---

## Decision

The system will follow Clean Architecture principles with the following layers:

UI → API Routes → Services → Repositories → Data Providers → Google Sheets

---

## Consequences

### Positive

- Strong separation of concerns
- High maintainability
- Easy testing
- Easy migration of data layer

### Negative

- More initial boilerplate code
- Requires discipline to maintain boundaries

---

# ADR-0005 — Repository Pattern for Data Access

## Status
Accepted

## Date
2026-06-30

---

## Context

Direct data access would tightly couple business logic to Google Sheets.

A more abstract approach is required.

---

## Decision

All data access must go through repository interfaces.

Repositories will define domain-specific operations.

---

## Consequences

### Positive

- Decouples business logic from persistence
- Easier testing
- Easier migration to other databases

### Negative

- Additional abstraction layer complexity

---

# ADR-0006 — Separation of Domain Services

## Status
Accepted

## Date
2026-06-30

---

## Context

The system includes complex domain logic such as:

- Pairing engine
- Ranking engine
- Adjudicator allocation

These must not be mixed with UI or persistence logic.

---

## Decision

All core business logic will be implemented in isolated domain services.

---

## Consequences

### Positive

- Clear separation of logic
- Easier testing
- Better scalability
- Better maintainability

### Negative

- Requires strict architectural discipline

---

# ADR-0007 — PLERD as Functional Reference Only

## Status
Accepted

## Date
2026-06-30

---

## Context

The system aims to replicate the workflow of established debate tabulation systems.

However, direct copying is not allowed.

---

## Decision

PLERD will be used only as a functional reference.

No code, UI, or assets will be reused.

---

## Consequences

### Positive

- Ensures originality
- Avoids legal and licensing issues
- Encourages clean design

### Negative

- Requires manual design of all features

---

# ADR-0008 — Phase-Based Implementation Strategy

## Status
Accepted

## Date
2026-06-30

---

## Context

The system is large and cannot be implemented safely in a single step.

---

## Decision

The system will be implemented in sequential phases defined in ROADMAP.md.

Only one phase may be implemented at a time.

---

## Consequences

### Positive

- Controlled development process
- Easier debugging
- Clear progress tracking

### Negative

- Slower perceived development speed

---

# ADR-0009 — Generic Persistence Infrastructure

## Status

Accepted

## Date

2026-07-01

---

## Context

Phase 3 initially included entity-specific repositories (TournamentRepository, TeamRepository, etc.) alongside the persistence infrastructure.

This violated the project's implementation order: entity-specific repositories belong to the milestones where their corresponding domain entities are introduced.

Mixing infrastructure with domain-specific code creates premature coupling and violates YAGNI.

---

## Decision

The persistence layer provides only generic infrastructure:

- DataProvider interface
- Google Sheets Provider
- BaseRepository abstract class
- Mapper, batch, and retry utilities

Entity-specific repositories are not implemented until their corresponding domain milestone.

---

## Consequences

### Positive

- Persistence infrastructure is fully reusable
- No premature domain coupling
- Future repositories require minimal boilerplate
- Clear separation of infrastructure from domain
- Follows YAGNI principle

### Negative

- Slightly more setup when implementing first entity repository

---

# End of Decisions Document