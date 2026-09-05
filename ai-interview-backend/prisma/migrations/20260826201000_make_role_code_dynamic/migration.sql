ALTER TABLE "roles"
  ALTER COLUMN "code" TYPE VARCHAR(50) USING "code"::text;

DROP TYPE "user_role";
