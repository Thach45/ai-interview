-- Replace the legacy users.role column with normalized RBAC relations.
CREATE TYPE "http_method" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" "user_role" NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "roles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "roles_code_key" UNIQUE ("code")
);

INSERT INTO "roles" ("code", "display_name", "description", "updated_at") VALUES
    ('CANDIDATE', 'Candidate', 'Người dùng ứng viên', CURRENT_TIMESTAMP),
    ('MODERATOR', 'Moderator', 'Nhân sự vận hành', CURRENT_TIMESTAMP),
    ('ADMIN', 'Administrator', 'Quản trị hệ thống', CURRENT_TIMESTAMP);

CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id"),
    CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- Preserve every existing legacy assignment before removing the column.
INSERT INTO "user_roles" ("user_id", "role_id")
SELECT "users"."id", "roles"."id"
FROM "users"
JOIN "roles" ON "roles"."code" = "users"."role";

ALTER TABLE "users" DROP COLUMN "role";

CREATE TABLE "permissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "method" "http_method" NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "uq_permissions_method_path" UNIQUE ("method", "path")
);
CREATE INDEX "idx_permissions_path" ON "permissions"("path");

CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id"),
    CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "role_permissions_permission_id_idx" ON "role_permissions"("permission_id");
