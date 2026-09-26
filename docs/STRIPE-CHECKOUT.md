# Stripe checkout - 2026-09-26

Card checkout uses Stripe-hosted Checkout. Production keys and webhook secrets are stored only in Vercel. Prices come from persisted bookings/server pricing, never browser totals. Confirmation uses signed webhooks and the same server-side verification on the return page. It validates paid status, currency, amount, site and stored session ID. Pending/failed notifications return an error so Stripe retries; customers are told not to pay again. A database lock serializes duplicate fulfillment. Existing PayPal routes remain for in-flight payments.

Validation: TypeScript and production builds passed; mocked lifecycle tests cover unpaid, mismatched amount/site, retry and duplicate fulfillment. A real Stripe TEST Checkout was created and expired without a charge. No live card was charged. Actual email/operations delivery after a live payment remains to be observed.

Migration adds ecosystem_stripe_checkouts on first use; Buggy & Cenote adds stripe_session_id to its booking table when fulfilling. No existing booking is deleted. Email delivery is at-least-once if interrupted between sending and persistence.
