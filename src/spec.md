# Specification

## Summary
**Goal:** Make Internet Identity the only authentication method for CloudCam AI, require login for feature access, and ensure a basic user account record is created on first use, while updating all UI branding text to “CloudCam AI”.

**Planned changes:**
- Implement/verify a clear Internet Identity-only login flow on the existing `/login` route (no email/password UI).
- Add route protection for feature pages (at minimum `/dashboard` and `/camera`) to redirect unauthenticated users to `/login`, and ensure logout revokes access to protected routes.
- Create and persist a basic user account record for each authenticated principal on first use (principal, createdAt, tier), safe to call multiple times.
- Replace inconsistent product/branding text across the UI so it consistently says “CloudCam AI” (English).

**User-visible outcome:** Users can sign in only with Internet Identity via `/login`; logged-out users are redirected to login when visiting Dashboard/Camera; after first login a basic account is automatically created; all UI text consistently refers to “CloudCam AI”.
