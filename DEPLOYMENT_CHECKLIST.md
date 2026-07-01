# Vercel Deployment Checklist - BP Tournament Manager

## Project Overview
- **Framework**: Next.js 16.2.9 (App Router)
- **Styling**: Tailwind CSS v4 + Shadcn/ui (@base-ui/react)
- **Backend**: Google Sheets API (serverless API routes)
- **Build Status**: ✅ Passing
- **Pages**: 18 (14 static, 4 dynamic)
- **API Routes**: 25 (all dynamic/serverless)

---

## Phase 1: Pre-Deployment Verification (Local)

### ✅ Build & Lint
```bash
# Run these locally first
npm run lint       # Must pass with 0 errors
npm run build      # Must complete successfully
```

**Expected Output:**
- 25 routes compiled
- 18 pages generated
- TypeScript type check passes

### ✅ Environment Variables (Local `.env.local`)
```
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SHEET_ID="1abc123... (from Google Sheets URL)"
NEXT_PUBLIC_APP_NAME="BP Tournament Manager"
```

---

## Phase 2: Google Sheets Setup

### Required Sheet Tabs (Case-Sensitive Names)
| Sheet Name | Purpose | Key Columns |
|------------|---------|-------------|
| `Tournaments` | Tournament data | id, name, startDate, endDate, status, settings (JSON) |
| `Institutions` | Institutions | id, name, shortName, country, region, contactEmail |
| `Teams` | Team registrations | id, tournamentId, institutionId, name, code, category |
| `Speakers` | Speaker data | id, teamId, institutionId, fullName, email, phone |
| `Adjudicators` | Judge data | id, tournamentId, institutionId, fullName, category, experience |
| `Conflicts` | Conflict tracking | id, adjudicatorId, institutionId, type, notes |
| `Venues` | Venue info | id, tournamentId, name, address, description |
| `Rooms` | Room details | id, venueId, tournamentId, name, capacity |
| `Rounds` | Round schedule | id, tournamentId, number, type, status |
| `Debates` | Debate assignments | id, roundId, tournamentId, roomId, positions (JSON) |
| `Ballots` | Ballot results | id, debateId, roundId, tournamentId, rankings (JSON), speakerScores (JSON) |
| `Users` | Admin users | id, email, name, role, institutionId, status |
| `Roles` | Role definitions | id, name, description, permissions (JSON) |
| `AuditLogs` | Audit trail | id, userId, action, resource, resourceId, details (JSON) |
| `SystemSettings` | App settings | id, key, value, description, category |

### Google Cloud Setup
1. **Create Service Account**
   - Go to Google Cloud Console → IAM & Admin → Service Accounts
   - Create new service account
   - Grant: **Editor** role on the Google Sheets API

2. **Enable APIs**
   - Google Sheets API
   - Google Drive API (optional, for file access)

3. **Generate Private Key**
   - Service Account → Keys → Add Key → JSON
   - Copy `private_key` and `client_email` to environment variables

4. **Share Spreadsheet**
   - Open your Google Sheet
   - Share with service account email (Editor access)
   - Copy Sheet ID from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

---

## Phase 3: Vercel Project Configuration

### 3.1 Create/Import Project in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import from GitHub repository
4. Framework Preset: **Next.js** (auto-detected)
5. Root Directory: `./` (default)

### 3.2 Environment Variables in Vercel
**Settings → Environment Variables → Add:**

| Variable | Value | Environment |
|----------|-------|-------------|
| `GOOGLE_SHEETS_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | Production, Preview, Development |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | `your-sa@project.iam.gserviceaccount.com` | Production, Preview, Development |
| `GOOGLE_SHEETS_SHEET_ID` | `1abc123...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | `BP Tournament Manager` | Production, Preview, Development |

> **Important**: The private key MUST include literal `\n` characters (not actual newlines). Copy directly from the JSON key file.

### 3.3 Vercel Configuration
`vercel.json` has been created with:
- **Security headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **Function timeouts**: 30s max duration for API routes
- **Region**: `iad1` (Virginia, closest to US)

### 3.4 Build & Output Settings
| Setting | Value |
|---------|-------|
| Build Command | `npm run build` |
| Output Directory | `.next` (default) |
| Install Command | `npm install` |
| Development Command | `npm run dev` |

---

## Phase 4: Post-Deployment Verification

### 4.1 Smoke Tests (Run After Deployment)
| Test | Expected Result |
|------|-----------------|
| Visit `https://your-app.vercel.app/` | Home page renders with title "BP Tournament Manager" |
| Visit `https://your-app.vercel.app/dashboard` | Dashboard loads with stat cards |
| Visit `https://your-app.vercel.app/public/pairings` | Public pairings page loads |
| Visit `https://your-app.vercel.app/public/standings` | Public standings page loads |
| Visit `https://your-app.vercel.app/public/results` | Public results page loads |
| Visit `https://your-app.vercel.app/public/statistics` | Public statistics page loads |
| `GET /api/tournaments` | Returns `{"data":[]}` or tournament list |
| `GET /api/institutions` | Returns `{"data":[]}` or institution list |
| `GET /api/teams` | Returns `{"data":[]}` or team list |
| `POST /api/tournaments` | Creates tournament (test with valid payload) |

### 4.2 Google Sheets Integration Test
```bash
# Test API with curl
curl -X POST https://your-app.vercel.app/api/tournaments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Tournament",
    "startDate": "2026-01-15T09:00:00.000Z",
    "endDate": "2026-01-17T18:00:00.000Z"
  }'
```

**Expected**: 201 Created with tournament data appearing in Google Sheets "Tournaments" tab.

### 4.3 UI Rendering Checklist
- [ ] Fonts load (Geist Sans/Mono)
- [ ] Tailwind styles apply (colors, spacing, dark mode)
- [ ] Shadcn/ui components render (Button, etc.)
- [ ] No console errors in browser DevTools
- [ ] Responsive layout works on mobile
- [ ] Dark mode toggle works (if implemented)

---

## Phase 5: Production Hardening

### 5.1 Domain & SSL
- [ ] Custom domain configured in Vercel
- [ ] SSL certificate active (auto-provisioned)
- [ ] DNS records pointing to Vercel

### 5.2 Monitoring & Analytics
- [ ] Vercel Analytics enabled
- [ ] Error tracking (Sentry, etc.) configured
- [ ] Log aggregation set up

### 5.3 Performance
- [ ] Static pages cached (ISR/SSG)
- [ ] API routes optimized (< 30s timeout)
- [ ] Images optimized (if any)

### 5.4 Security
- [ ] Environment variables not exposed in client bundle
- [ ] CSP headers configured (via vercel.json)
- [ ] Rate limiting considered for API routes

---

## Troubleshooting Quick Reference

| Issue | Likely Cause | Fix |
|-------|----------|-----|
| Build fails: "Module not found" | Case-sensitive import | Check import paths (Windows vs Linux) |
| API returns 500 | Google Sheets auth | Verify env vars in Vercel, check service account permissions |
| UI looks unstyled | Tailwind not compiling | Check `postcss.config.mjs`, `globals.css` imports |
| Fonts not loading | `next/font` issue | Verify `layout.tsx` imports Geist correctly |
| "Sheet not found" | Wrong tab name | Match exact PascalCase in Google Sheets |
| CORS errors | API called from browser | Use server-side API routes, not client-side fetch to Google |

---

## Rollback Plan

If deployment has issues:
1. **Vercel**: Go to Deployments → Click "..." on previous working deployment → "Promote to Production"
2. **Git**: `git revert` last commit → push → auto-deploy
3. **Env vars**: Revert Vercel environment variables to previous values

---

## Checklist Completion

- [ ] Phase 1: Local build & lint pass
- [ ] Phase 2: Google Sheets created with all tabs, service account configured
- [ ] Phase 3: Vercel project created, env vars set, vercel.json added
- [ ] Phase 4: All smoke tests pass on live URL
- [ ] Phase 5: Domain, monitoring, security configured

**Sign-off**: _________________ **Date**: _________________