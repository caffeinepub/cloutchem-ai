# Specification

## Summary
**Goal:** Add a public “CloudCam AI – FAQ & Help Center” page and link to it from the app footer.

**Planned changes:**
- Create a new public FAQ & Help Center page that renders the user-provided English FAQ content, including sections for Subscriptions, Camera & Captures, Account & Login, and Support.
- Display the support email as “infocloudchemai@gmail.com” both as visible text and as a clickable `mailto:` link.
- Add a new public route (e.g., `/faq`) in the TanStack Router so the page is accessible without authentication.
- Add a footer navigation link to the FAQ page alongside existing Terms and Privacy links, matching current footer link styling.
- Style the FAQ page to match existing static/legal pages (layout, Card usage, typography, spacing, separators) and keep it responsive.

**User-visible outcome:** Users can visit `/faq` (without signing in) to read the FAQ & Help Center content, and can navigate to it from the footer; clicking the support email opens their email client.
