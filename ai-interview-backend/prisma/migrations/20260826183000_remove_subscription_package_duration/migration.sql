-- Credits are consumable balances and do not expire. Package duration is not a
-- subscription concept, so remove it from the persisted package definition.
ALTER TABLE "subscription_packages"
DROP COLUMN "duration_days";
