/*
  Warnings:

  - The values [pending,approved,suspended,rejected] on the enum `DriverApproval` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,paid,failed,refunded] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [requested,accepted,driver_enroute,picked_up,in_transit,completed,cancelled,no_driver] on the enum `RideStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [admin,rider,driver] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."DriverApproval_new" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED');
ALTER TABLE "public"."Driver" ALTER COLUMN "approvalStatus" DROP DEFAULT;
ALTER TABLE "public"."Driver" ALTER COLUMN "approvalStatus" TYPE "public"."DriverApproval_new" USING ("approvalStatus"::text::"public"."DriverApproval_new");
ALTER TYPE "public"."DriverApproval" RENAME TO "DriverApproval_old";
ALTER TYPE "public"."DriverApproval_new" RENAME TO "DriverApproval";
DROP TYPE "public"."DriverApproval_old";
ALTER TABLE "public"."Driver" ALTER COLUMN "approvalStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentStatus_new" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Payment" ALTER COLUMN "status" TYPE "public"."PaymentStatus_new" USING ("status"::text::"public"."PaymentStatus_new");
ALTER TYPE "public"."PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "public"."PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "public"."Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."RideStatus_new" AS ENUM ('REQUESTED', 'ACCEPTED', 'DRIVER_ENROUTE', 'PICKED_UP', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'NO_DRIVER');
ALTER TABLE "public"."Ride" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."RideStatusHistory" ALTER COLUMN "status" TYPE "public"."RideStatus_new" USING ("status"::text::"public"."RideStatus_new");
ALTER TABLE "public"."Ride" ALTER COLUMN "status" TYPE "public"."RideStatus_new" USING ("status"::text::"public"."RideStatus_new");
ALTER TYPE "public"."RideStatus" RENAME TO "RideStatus_old";
ALTER TYPE "public"."RideStatus_new" RENAME TO "RideStatus";
DROP TYPE "public"."RideStatus_old";
ALTER TABLE "public"."Ride" ALTER COLUMN "status" SET DEFAULT 'REQUESTED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('ADMIN', 'RIDER', 'DRIVER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."UserRole_new" USING ("role"::text::"public"."UserRole_new");
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'RIDER';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Driver" ALTER COLUMN "approvalStatus" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Ride" ALTER COLUMN "status" SET DEFAULT 'REQUESTED';

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'RIDER';
