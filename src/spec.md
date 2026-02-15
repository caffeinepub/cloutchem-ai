# Specification

## Summary
**Goal:** Enable Stripe-hosted checkout for upgrading authenticated users from Free to Pro, with clear return flows and a way to refresh subscription status.

**Planned changes:**
- Add a single frontend configuration surface for Stripe checkout URL (required) and optional success/cancel return URLs, with a clear error state when not configured.
- Update the authenticated dashboard to show an “Upgrade to Pro” CTA for Free users that navigates to the configured Stripe checkout URL, and a “You are on Pro” state for Pro users.
- Add dedicated frontend routes/pages for Stripe checkout success and cancellation, each with a clear status message and a button to return to the dashboard (and/or retry from cancel).
- Add a “Refresh subscription status” action on the dashboard that re-fetches the current user profile via the existing React Query refetch/invalidation pattern.

**User-visible outcome:** Free-tier users can click “Upgrade to Pro” to go to Stripe checkout and return to the app on success/cancel pages; after payment, users can refresh their subscription status on the dashboard to see updated tier changes without reloading.
