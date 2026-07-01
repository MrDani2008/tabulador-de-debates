# PROJECT_SPEC.md

# British Parliamentary Debate Tournament Management System

Version: 1.0

Status: Active

---

# 1. Project Overview

## Purpose

The purpose of this project is to build a complete web-based British Parliamentary Debate Tournament Management System inspired by the workflow and functionality of PLERD while remaining an entirely original implementation.

The application is intended to simplify every stage of tournament administration, from tournament setup to final rankings and public result publication.

The system must be production-ready, scalable, maintainable, and easy to extend.

---

# 2. Vision

The long-term vision of this project is to provide tournament organizers with a modern, intuitive, and reliable platform capable of managing debate tournaments of different sizes without requiring a traditional database server.

The application should offer a professional experience comparable to established tabulation software while remaining lightweight, easy to deploy, and simple to maintain.

Google Sheets will initially serve as the persistence provider, allowing organizers to inspect and edit tournament data directly when necessary.

The architecture must allow replacing Google Sheets with another persistence provider in the future without modifying the business logic.

---

# 3. Project Goals

The system must:

- Reduce manual tournament administration.
- Automate repetitive tournament tasks.
- Minimize human error.
- Generate fair tournament pairings.
- Automatically calculate rankings.
- Manage judges and conflicts.
- Publish tournament information.
- Maintain complete tournament history.
- Support future expansion.
- Remain modular and maintainable.

---

# 4. Scope

The application manages every stage of a British Parliamentary tournament.

This includes:

- Tournament creation
- Tournament configuration
- Team management
- Institution management
- Speaker management
- Adjudicator management
- Venue management
- Room management
- Round management
- Pairing generation
- Judge allocation
- Ballot management
- Results management
- Ranking generation
- Tournament statistics
- Public information
- Reports
- Administration

The application does not attempt to replace external authentication providers or communication platforms.

---

# 5. Target Users

The application is designed for multiple user roles.

## Tournament Administrator

Responsible for:

- Creating tournaments
- Configuring tournaments
- Managing users
- Managing settings
- Publishing information
- Closing tournaments

---

## Tab Director

Responsible for:

- Managing rounds
- Generating pairings
- Allocating adjudicators
- Managing conflicts
- Reviewing ballots
- Publishing pairings
- Publishing standings

---

## Adjudicators

Responsible for:

- Viewing assignments
- Reviewing debate information
- Entering ballots
- Submitting scores
- Writing comments

---

## Team Members

Responsible for:

- Viewing pairings
- Viewing schedules
- Viewing results
- Viewing standings

Teams never modify tournament data.

---

## Public Users

Public users may access:

- Pairings
- Standings
- Results
- Statistics

Public users have read-only access.

---

# 6. Tournament Format

The first supported debate format is:

British Parliamentary Debate.

The architecture must allow future support for additional debate formats without requiring significant changes to the existing codebase.

Examples of future formats include:

- World Schools Debate
- Asian Parliamentary
- American Parliamentary
- Lincoln-Douglas

Support for future formats should be implemented by extending domain services rather than modifying existing logic.

---

# 7. Functional Objectives

The application must provide a complete tournament workflow.

The expected workflow is:

Tournament Creation

↓

Tournament Configuration

↓

Institution Registration

↓

Team Registration

↓

Speaker Registration

↓

Adjudicator Registration

↓

Venue Registration

↓

Room Registration

↓

Round Creation

↓

Automatic Pairing

↓

Automatic Adjudicator Allocation

↓

Pairing Review

↓

Round Publication

↓

Ballot Submission

↓

Result Validation

↓

Standings Update

↓

Statistics Update

↓

Next Round

↓

Tournament Completion

↓

Final Standings

↓

Reports

---

# 8. Core Design Principles

The application must prioritize:

- Reliability
- Simplicity
- Performance
- Maintainability
- Scalability
- Readability
- Extensibility
- Data consistency

Every feature must support these principles.

---

# 9. Functional Reference

PLERD serves only as a functional reference.

The application must never copy:

- Source code
- User interface
- Visual assets
- Branding
- Internal implementation

Only the workflow and functional concepts may inspire the implementation.

The resulting software must remain an independent original project.

---

# 10. Persistence Strategy

Google Sheets will be used as the initial persistence provider.

Google Sheets is not considered part of the business layer.

Business logic must never depend directly on Google Sheets.

Every persistence operation must pass through:

Repository Layer

↓

Data Provider Layer

↓

Google Sheets Provider

This abstraction guarantees future migration to another persistence provider with minimal changes.

---

# 11. Deployment

The application must be deployable on Vercel.

Deployment should require minimal configuration.

No dedicated backend server should be necessary.

The project must use Next.js server capabilities whenever appropriate.
---

# 12. Functional Requirements

The application must provide every feature required to manage an entire British Parliamentary Debate Tournament from registration to final standings.

All features described below are considered part of the initial production release unless otherwise specified.

---

# 13. Tournament Management

The system must allow administrators to create and manage one or multiple tournaments.

Each tournament must be independent.

A tournament must contain:

- General information
- Tournament settings
- Institutions
- Teams
- Speakers
- Adjudicators
- Venues
- Rooms
- Rounds
- Pairings
- Ballots
- Rankings
- Statistics

The system must allow:

- Create tournament
- Edit tournament
- Archive tournament
- Duplicate tournament
- Delete tournament
- Open tournament
- Close tournament
- Publish tournament

Tournament settings must include:

- Tournament name
- Tournament logo
- Start date
- End date
- Number of preliminary rounds
- Elimination rounds
- Number of judges per debate
- Team size
- Speaker configuration
- Ranking rules
- Tie-break rules
- Ballot configuration
- Public visibility

---

# 14. Institution Management

Institutions represent the organizations to which teams and adjudicators belong.

The system must allow:

- Create institutions
- Edit institutions
- Delete institutions
- Search institutions
- Filter institutions
- Activate institutions
- Deactivate institutions

Each institution should contain:

- Name
- Short name
- Country
- Region
- Contact information
- Status

The system must allow multiple teams and adjudicators to belong to the same institution.

Institution information must be used during conflict detection.

---

# 15. Team Management

The system must support complete team administration.

Each team belongs to one tournament.

Each team belongs to one institution.

Each team contains one or more speakers according to tournament configuration.

The system must allow:

- Create teams
- Edit teams
- Delete teams
- Activate teams
- Deactivate teams
- Search teams
- Filter teams
- Import teams
- Export teams

Each team should store:

- Team name
- Institution
- Team code
- Category
- Status
- Registration date

Each team must maintain a complete tournament history.

---

# 16. Speaker Management

Speakers belong to teams.

The system must allow:

- Register speakers
- Edit speakers
- Remove speakers
- Search speakers
- Filter speakers

Each speaker should contain:

- Full name
- Institution
- Team
- Email
- Phone
- Category
- Status

The system must maintain speaker statistics throughout the tournament.

Statistics may include:

- Speaker scores
- Average score
- Highest score
- Ranking position
- Number of speeches

---

# 17. Adjudicator Management

The system must support complete adjudicator administration.

The system must allow:

- Register adjudicators
- Edit adjudicators
- Delete adjudicators
- Activate adjudicators
- Deactivate adjudicators
- Search adjudicators
- Filter adjudicators

Each adjudicator should contain:

- Full name
- Institution
- Category
- Experience level
- Availability
- Contact information
- Notes

Conflict management should support:

- Institution conflicts
- Team conflicts
- Personal conflicts
- Manual restrictions

Adjudicators must maintain tournament statistics including:

- Debates judged
- Chair assignments
- Panel assignments
- Average workload

---

# 18. Venue Management

A venue represents a physical location where debates take place.

The system must allow:

- Create venues
- Edit venues
- Delete venues
- Activate venues
- Deactivate venues

Each venue should contain:

- Name
- Address
- Description
- Status

Each venue contains one or more rooms.

---

# 19. Room Management

Rooms belong to venues.

The system must allow:

- Create rooms
- Edit rooms
- Delete rooms
- Activate rooms
- Deactivate rooms

Each room should contain:

- Room name
- Venue
- Capacity
- Accessibility notes
- Status

Rooms are used during pairing generation.

A room may host only one debate per round.

---

# 20. Round Management

Rounds represent the primary tournament cycle.

The system must allow:

- Create rounds
- Edit rounds
- Delete rounds
- Open rounds
- Close rounds
- Publish rounds
- Lock rounds
- Unlock rounds
- Duplicate rounds

Each round should contain:

- Round number
- Round type
- Status
- Pairings
- Judge assignments
- Results

Possible statuses include:

- Draft
- Generated
- Published
- Active
- Closed
- Archived

Only one round may remain active at a time.

---

# 21. Debate Management

Each debate belongs to one round.

Each debate contains:

- Four teams
- Assigned room
- Assigned adjudicators
- Ballot
- Results

The system must maintain debate history for auditing purposes.

Each debate must record:

- AG
- AO
- BG
- BO

Positions should remain immutable after publication unless explicitly unlocked by an administrator.

---

# 22. Pairing Engine

The Pairing Engine is one of the core components of the application.

It must remain isolated from UI and persistence.

Its responsibilities include:

- Generate pairings
- Assign debate positions
- Assign rooms
- Respect tournament constraints
- Detect conflicts
- Produce deterministic results whenever possible

The pairing algorithm should prioritize:

- Avoid repeated opponents
- Balance Government and Opposition
- Balance Opening and Closing positions
- Balance AG
- Balance AO
- Balance BG
- Balance BO
- Balance room usage
- Minimize institutional clashes
- Handle BYEs automatically
- Support manual adjustments

Every generated pairing should be reproducible using the same tournament state.

---

# 23. Adjudicator Allocation

Judge allocation must remain independent from the Pairing Engine.

Responsibilities include:

- Allocate chairs
- Allocate panel members
- Avoid conflicts
- Balance workload
- Respect availability
- Respect manual exclusions

Administrators must be able to manually override automatic allocations.

All overrides should be recorded for auditing.
---

# 24. Ballot Management

Ballots represent the official record of each debate.

Each debate must have one ballot.

The system must support:

- Ballot creation
- Ballot editing
- Ballot validation
- Ballot locking
- Ballot submission
- Ballot review
- Ballot approval

Each ballot should include:

- Debate
- Round
- Room
- Adjudicators
- Team rankings
- Team points
- Speaker scores
- Comments
- Validation status
- Submission timestamp

The application must prevent incomplete ballots from being approved.

Only authorized users may modify approved ballots.

---

# 25. Results Management

The system must automatically process results after a ballot is approved.

Responsibilities include:

- Store debate results
- Store team points
- Store speaker scores
- Update standings
- Update statistics
- Update team history
- Update speaker history

Result modifications must trigger automatic recalculation.

No manual recalculation should be required.

---

# 26. Standings

The application must generate live tournament standings.

Standings must update immediately after results are confirmed.

The system must calculate:

- Team ranking
- Speaker ranking
- Institution statistics

Ranking calculations must support:

- Wins
- Team points
- Speaker points
- Average score
- Tie-break rules

Tie-break rules must be configurable from tournament settings.

Historical standings should remain available.

---

# 27. Statistics

The system must automatically generate tournament statistics.

Examples include:

Tournament statistics

- Registered teams
- Active teams
- Completed rounds
- Remaining rounds
- Total debates

Team statistics

- Wins
- Losses
- Government appearances
- Opposition appearances
- Opening appearances
- Closing appearances
- AG appearances
- AO appearances
- BG appearances
- BO appearances
- Average score

Speaker statistics

- Total speeches
- Average score
- Highest score
- Lowest score

Adjudicator statistics

- Debates judged
- Chair assignments
- Panel assignments
- Average workload

Room statistics

- Number of debates hosted
- Usage percentage

Institution statistics

- Teams
- Speakers
- Judges
- Average ranking

Statistics must update automatically.

---

# 28. Dashboard

The Dashboard serves as the application's main control panel.

It should provide an overview of the tournament.

Information may include:

- Current tournament
- Current round
- Tournament progress
- Upcoming debates
- Published pairings
- Live standings
- Alerts
- Recent activity

The Dashboard should prioritize usability during live tournaments.

---

# 29. Public Pages

The application must include public pages.

Public users should not require authentication.

Public pages may include:

- Tournament information
- Published pairings
- Current round
- Team standings
- Speaker standings
- Results
- Statistics

Public pages must be read-only.

---

# 30. Reports

The application must support exporting tournament data.

Supported exports include:

- CSV
- Excel
- PDF

Exportable information includes:

- Teams
- Institutions
- Speakers
- Adjudicators
- Pairings
- Ballots
- Results
- Rankings
- Statistics

Exports should reflect the current tournament state.

---

# 31. Search

The application should provide global search functionality.

Search should support:

- Teams
- Speakers
- Institutions
- Adjudicators
- Rooms
- Rounds

Search results should update efficiently.

---

# 32. Filtering

Every management page should support filtering.

Examples include:

- Institution
- Category
- Status
- Round
- Room
- Judge category
- Team category

Filtering should support combining multiple filters.

---

# 33. Administration

The application must include administrative functionality.

Administrators should manage:

- Tournament settings
- User permissions
- Visibility
- Configuration
- Audit history

Administrative actions should be logged whenever appropriate.

---

# 34. Google Sheets Integration

Google Sheets is the initial persistence provider.

Responsibilities include:

- Read data
- Write data
- Update data
- Delete data
- Synchronize data

Google Sheets should remain completely isolated from business logic.

Every persistence operation must pass through:

Repository

↓

Data Provider

↓

Google Sheets Provider

No other layer may communicate directly with Google Sheets.

---

# 35. Technical Requirements

The project must use:

Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend

- Next.js API Routes

Validation

- Zod

Forms

- React Hook Form

Tables

- TanStack Table

Deployment

- Vercel

Persistence

- Google Sheets API

The technology stack should remain consistent throughout the project.

---

# 36. Architecture Requirements

The project must follow Clean Architecture.

Dependency flow must always remain:

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

Business logic must never bypass these layers.

The project must implement:

- Repository Pattern
- Service Layer
- Data Abstraction Layer
- Dependency Injection where appropriate
- Modular design
- Reusable components
- Strong typing

Future migration away from Google Sheets should require replacing only the Provider implementation.

---

# 37. Security Requirements

The application must:

- Protect credentials
- Validate all requests
- Validate imported data
- Validate exported data
- Restrict administrative actions
- Protect server-side secrets

Google credentials must never reach the client.

Environment variables must store sensitive information.

---

# 38. Performance Requirements

The application should prioritize:

- Fast page loads
- Minimal API requests
- Efficient data synchronization
- Lazy loading where appropriate
- Efficient rendering
- Scalable architecture

Performance optimizations must never compromise maintainability.

---

# 39. Accessibility

The interface should be usable by all tournament staff.

The application should support:

- Keyboard navigation
- Responsive layouts
- Clear visual hierarchy
- Accessible forms
- Accessible tables

Accessibility should be considered throughout development.

---

# 40. Future Expansion

The architecture should allow future implementation of:

- Additional debate formats
- Multiple persistence providers
- Authentication providers
- Mobile application
- Offline synchronization
- Real-time collaboration
- Notifications
- Live updates
- Advanced analytics
- API integrations

Future functionality should extend existing architecture instead of replacing it.

---

# 41. Success Criteria

The project will be considered successful when it:

- Supports complete British Parliamentary tournaments.
- Produces fair and reproducible pairings.
- Correctly allocates adjudicators.
- Automatically calculates standings.
- Maintains accurate tournament history.
- Publishes tournament information.
- Remains modular and maintainable.
- Can replace Google Sheets without affecting business logic.
- Is production-ready.
- Can be deployed on Vercel with minimal configuration.

---

# End of Specification