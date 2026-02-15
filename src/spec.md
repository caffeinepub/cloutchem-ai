# Specification

## Summary
**Goal:** Implement Internet Identity as the only authentication method for CloudCam AI, with a working login-gated flow and automatic user profile creation.

**Planned changes:**
- Ensure all authentication UI and copy references Internet Identity (passwordless) only; do not add any username/password auth.
- Enforce route protection so unauthenticated users are redirected to `/login` when accessing `/dashboard` and `/camera`, and redirect to `/dashboard` after successful login.
- Create and persist a basic user account/profile record per authenticated principal on first use (using existing backend profile fields and the existing `getCallerUserProfile` flow).
- Update all product name/branding text in the UI to “CloudCam AI”, including the HTML document title.

**User-visible outcome:** Users can sign up/log in via Internet Identity, are prompted to log in when visiting protected pages, land on the dashboard after login, and have a persistent account profile automatically created on first use under consistent “CloudCam AI” branding.
