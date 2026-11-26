# Tafaqqad (تفقّد) – frontend: notes for Claude

Graduation project: a property-inspection platform. A client books an inspection from a licensed engineering
office, the office assigns an engineer and sets the final price, the engineer writes a report.
I am **Mahmoud, backend Person A** (accounts, roles, admin, offices – backend 100% done).
**Backend Person B** (DawoodObeid) builds bookings, payments, reports and reviews.
My current job: **link the React pages to the backend endpoints that already exist**, one page group at a time.

## Stack
- React 19 + Vite + react-router 7. Arabic, right to left, Cairo font, teal `#0d6e75` (`var(--primary)`,
  tokens in `src/index.css`).
- Pages use **inline `style={{…}}`** – keep that, don't refactor styling. The portal header / layout use CSS files
  (they need hover, active and screen-width rules).
- Backend: ASP.NET Core Web API (.NET 10) at `https://localhost:7281/api` (`VITE_API_URL` in `.env`).
  It is a separate repository (folder `Tafaqqad`, main branch `master`).
  CORS allows ports 3000, 5173, 4200 only – run Vite on **5173**.
- Some files use Windows line endings (CRLF). Keep each file's existing line endings.

## How to work with me (keep this format)
- **One substep at a time.** For each: short why → the change → a **numbered test table**
  (browser behaviour, Network tab, Swagger/DB checks, expected result) → the **git commit command**.
- Run `npm run build` and `npx eslint <changed files>` yourself after every change.
  (Every page has an unused `import React` lint warning – ignore that one only.)
- **Wait for my "ok" after each substep.** If I say "don't start the next step", wait.
- **Git:** one branch per step, commit after each substep, push + merge (PR on GitHub) after the step.
  The main branch of this repo is **`main`** (`git checkout main && git pull && git checkout -b <branch>`).
  **Never commit to `main`.** Run `git status` before `git add`; add only the files of the substep.
  Check that `git status` names the expected branch and files before `git commit` (I tend to paste several
  commands at once, so an early failure is easy to miss).
- Change only what the substep needs. Don't rewrite things that work.
- If a business rule isn't written anywhere, ask me one short question instead of guessing.
- Never ask for or print secrets (User Secrets: `Jwt:Key`, seeded admin password).
- Every reply ends with exactly two lines:
  `Progress on your part: X% (linked screens / 28; backend 100% done)`
  `Tokens left: I can't see this number.`

## Shared frontend code (already built – reuse it)
- `src/api/client.js` – `api(path, { method, body, form })`, `saveSession`, `getToken`, `getUser`, `clearSession`.
  Errors are thrown as `{ status, code, message, errors, retryAfterSeconds }`; status 0 = server unreachable
  (Arabic message). A 401 clears the session. localStorage keys `tafaqqad_token`, `tafaqqad_user`.
- `src/api/auth.js` – `forgotPassword`, `resetPassword`, `getMe`, `authErrorMessage`.
- `src/api/offices.js` – public offices calls, `logoSrc`, `PROPERTY_TYPES`, `WEEKDAYS`, `SORT_OPTIONS`,
  `propertyTypeLabel`, `weekdayLabel`, `formatPrice` ("60 د.أ"), `priceRowLabel`, `formatTime`, `memberSinceYear`.
- `src/api/officePortal.js` – profile, prices, schedule, engineers, dashboard, activity; `portalErrorMessage`,
  engineer form helpers.
- `src/api/admin.js` – admin offices (list, suspend, reactivate), audit logs; `adminErrorMessage`.
- `src/api/activity.js` – audit rows → Arabic (`activityText`, `actionLabel`, `formatActivityTime`).
- `src/api/bookings.js` – `createBooking`, `bookableDates(workingHours)`, `formatBookingDate`, `bookingNumber`,
  `bookingErrorMessage`.
- `src/api/redirect.js` – `safeFrom(from)`: only internal paths, used to return after login.
- `src/hooks/useCompare.js` – compare selection in localStorage (`tafaqqad_compare`, 2–4 offices).
- `src/hooks/useOffice.js` – office name shown in the portal header (`setOfficeName` after a rename).
- **Portals (admin, office, engineer):** `components/PortalLayout` (`PortalHeader` + fixed right `PortalSidebar`,
  drawer under 900px). The menus are in `AdminLayout` / `OfficeLayout` / `EngineerLayout`; routes are nested under
  them in `App.jsx`, so a portal page renders only its own content (`components/OfficePage` gives title + width).
- `OfficeAvatar.jsx` – logo or first letter. `RequireRole.jsx` – route guard by role; saves `state.from`.
- Pattern for loading data (React 19 lint-friendly): keep `result = { key, data, error }` in state,
  `loading = result.key !== requestKey`, and call setState only inside `.then/.catch` (with an `ignore` flag).
- Show **Arabic messages only** – never the backend's English `message`. Some endpoints send no error code:
  match the English text to choose an Arabic message.
  429 → "حاولت كثيراً، حاول مجدداً بعد N دقيقة" using `retryAfterSeconds`.

## Status
**Linked (21 of the 28 original screens):** Login, Register, VerifyOtp, SetPassword, ForgotPassword,
ForgotPasswordSent, ResetPassword, ResetLinkInvalid, RegisterCompany, RequestSubmitted, Home, Companies,
CompanyDetails, CompareCompanies, BookInspection, AdminRequests, AdminRequestDetails, AdminOffices, CompanyProfile,
AddEngineer, CompanyDashboard.
Since then CompanyProfile was split into `/company/info`, `/prices`, `/schedule`, `/engineers`; the admin log
has its own page `/admin/audit-log`; engineers got a read-only `/engineer/profile`.

**Cleanup (F7), branch `cleanup`:** F7a (portals, logo, favicon) committed. F7b (made-up text, Arabic-only errors,
lint) in progress. **F7c (backend repo) still to do:** delete `WeatherForecast.cs`, rename
`Controllers/Admin/dminAuditLogsController.cs`, README section for `/client/bookings`.

**Waiting for Person B – keep the mock:** MyBookings, BookingDetails, Payment (card data must never be sent to
our API), InspectionReport, CompanyOrders, EngineerInspections, WriteReport.
The office dashboard shows booking numbers as «— قريباً» (the backend returns fixed zeros).

## Decisions already made
- Public pages (G4): fields the public API doesn't give (reviews, engineers list, license number, experience) are
  **removed from the UI**; show "عضو في تفقّد منذ {year}", engineer count, daily capacity instead.
  The office portal does show engineers' years of experience (the backend has it). The UI is not final.
- Compare: max 4 offices (backend limit), unavailable ones (`missingIds`) are removed from the selection.
- Booking: map pin is a placeholder ("قريباً"), `lat`/`lng` sent as null.
- No admin "resend activation" for offices that are already approved (no endpoint); the account-request page
  has its own resend.
- Engineers cannot edit their own details (no endpoint); the office manager does.

## Open questions
- Home says the payment is released after the report is delivered, and that there is a property history.
  Neither is built (Person B). Keep, reword or remove?

## Mappings
- Property type: شقة/فيلا/مكتب أو محل/أرض ↔ `Apartment`/`Villa`/`Commercial`/`Land`.
- Office status: نشطة/ملفه غير مكتمل/موقوفة ↔ `Active`/`Incomplete`/`Suspended`.
- Weekdays as English names `Sunday…Saturday`; the public office details list starts on Saturday, the office
  portal schedule on Sunday.
- Dates: booking dates are `yyyy-MM-dd` (Jordan). `createdAt` and audit rows are UTC (no `Z`) – show in Asia/Amman.

## Test data (made in F0c)
Admin (User Secrets), office1 + office2 (Active, prices, schedule; capacity and hours get changed during tests),
engineer1, client1. Emails, OTP codes and set-password / reset links are printed in the API log.
