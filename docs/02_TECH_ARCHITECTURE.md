# Technical Architecture

## Stack

Frontend:
- Antigravity UI
- Minimal interface
- Auth + Stripe via Antigravity

Backend:
- Server function for scraping
- Fetch HTML
- Fetch linked CSS
- Parse styles

Optional (if needed later):
- Node microservice using Puppeteer

## Flow

1. User inputs URL
2. Backend validates URL
3. Server fetches HTML
4. Extract CSS links
5. Fetch CSS files
6. Parse:
   - Colors
   - Fonts
   - Border radius
7. Normalize values
8. Generate token object
9. Return structured result

## Performance Target

- Max page size: 5MB
- Timeout: 15 seconds
- CSS parsing limit: 1MB per file
