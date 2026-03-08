# Rate Limiting

## Goals

Prevent:
- Abuse
- Scraping misuse
- Bot flooding

## Limits

- 2 free extractions/day
- 1 request per 30 seconds

## Enforcement

Check:
- user.extractions_today
- Compare with limit
- Reset daily at midnight UTC
