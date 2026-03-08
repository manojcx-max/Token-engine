# Database & Authentication

## User Table

Fields:
- id
- email
- password_hash
- plan_type (free/pro)
- extractions_today
- last_extraction_date

## Extraction Log Table

Fields:
- id
- user_id
- url
- extraction_time
- success_flag
- tokens_count

## Free Plan Limits

- 2 extractions per day
- No file download

## Pro Plan

- Unlimited extractions
- File download enabled
