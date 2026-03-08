# Stripe Integration

## Plan

Pro Plan:
$19/month

## Steps

1. Create product in Stripe
2. Create recurring price
3. Store Stripe customer ID
4. Handle webhook:
   - payment_succeeded
   - subscription_canceled

## Upgrade Flow

- User clicks Upgrade
- Redirect to Stripe Checkout
- On success → update plan_type = pro
