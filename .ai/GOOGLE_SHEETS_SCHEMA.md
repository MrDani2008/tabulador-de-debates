# GOOGLE_SHEETS_SCHEMA.md

# Google Sheets Data Schema

Version: 1.0

Status: Active

---

## Purpose

This document defines the Google Sheets schema used by the persistence layer.

Each sheet represents one entity type. Column headers are case-sensitive and must match the entity field names used by the mapper configuration.

---

## Sheet Definitions

### Tournaments

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| name | name | string | yes |
| logo | logo | string | no |
| startDate | startDate | date | yes |
| endDate | endDate | date | yes |
| status | status | string | yes |
| settings | settings | json | yes |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

### Institutions

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| name | name | string | yes |
| shortName | shortName | string | yes |
| country | country | string | yes |
| region | region | string | no |
| contactEmail | contactEmail | string | no |
| contactPhone | contactPhone | string | no |
| status | status | string | yes |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

### Teams

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| tournamentId | tournamentId | string | yes |
| institutionId | institutionId | string | yes |
| name | name | string | yes |
| code | code | string | yes |
| category | category | string | yes |
| status | status | string | yes |
| registrationDate | registrationDate | date | yes |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

### Speakers

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| teamId | teamId | string | yes |
| institutionId | institutionId | string | yes |
| fullName | fullName | string | yes |
| email | email | string | no |
| phone | phone | string | no |
| status | status | string | yes |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

### Adjudicators

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| tournamentId | tournamentId | string | yes |
| institutionId | institutionId | string | yes |
| fullName | fullName | string | yes |
| category | category | string | yes |
| experience | experience | string | yes |
| email | email | string | no |
| phone | phone | string | no |
| notes | notes | string | no |
| status | status | string | yes |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

### Venues

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| tournamentId | tournamentId | string | yes |
| name | name | string | yes |
| address | address | string | no |
| description | description | string | no |
| status | status | string | yes |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

### Rooms

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| venueId | venueId | string | yes |
| tournamentId | tournamentId | string | yes |
| name | name | string | yes |
| capacity | capacity | number | yes |
| accessibilityNotes | accessibilityNotes | string | no |
| status | status | string | yes |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

### Rounds

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| tournamentId | tournamentId | string | yes |
| number | number | number | yes |
| type | type | string | yes |
| status | status | string | yes |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

### Debates

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| roundId | roundId | string | yes |
| tournamentId | tournamentId | string | yes |
| roomId | roomId | string | no |
| positions | positions | json | yes |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

### Ballots

| Column | Field | Type | Required |
|--------|-------|------|----------|
| id | id | string | yes |
| debateId | debateId | string | yes |
| roundId | roundId | string | yes |
| tournamentId | tournamentId | string | yes |
| rankings | rankings | json | yes |
| speakerScores | speakerScores | json | yes |
| comments | comments | string | no |
| status | status | string | yes |
| submittedAt | submittedAt | date | no |
| createdAt | createdAt | date | yes |
| updatedAt | updatedAt | date | yes |

---

## Sheet Naming Convention

Sheet names are PascalCase, matching the entity name (e.g., `Tournaments`, `Teams`, `Speakers`).

---

## Notes

- All entities include `id`, `createdAt`, and `updatedAt` columns.
- The `id` column is a UUID v4 string.
- Dates are stored as ISO 8601 strings.
- JSON fields are serialized with `JSON.stringify` and deserialized with `JSON.parse`.
- Boolean values are stored as `TRUE` / `FALSE`.
- Empty cells are deserialized as `undefined`.
