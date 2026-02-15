# Specification

## Summary
**Goal:** Add account recovery within the app via user-defined security questions (minimum 2), set up during first onboarding after Internet Identity sign-in.

**Planned changes:**
- Extend backend user account state to persist per-user security question/answer pairs (minimum 2), with answers stored as a non-reversible salted hash, and expose a boolean indicating whether setup is completed.
- Add backend endpoints for authenticated users to (a) set/replace security questions (enforcing 2+), and (b) verify submitted answers to enable a recovery flow that allows resetting/changing security questions after successful verification.
- Add a frontend “Security Questions Setup” onboarding step shown after login when setup is not complete, requiring at least two custom Q/A entries before proceeding to the dashboard/protected areas.
- Add a frontend “Account Recovery” page for authenticated users to answer their security questions; on success, allow setting new security questions (minimum 2); on failure, show a generic error without revealing which answers were wrong.
- Add/adjust backend upgrade/migration handling as needed so existing user profiles remain intact and existing users default to “not set up.”

**User-visible outcome:** After signing in, users who haven’t set security questions must create at least two before using the app; signed-in users can later visit an account recovery page to verify answers and then change/reset their security questions (without email/SMS).
