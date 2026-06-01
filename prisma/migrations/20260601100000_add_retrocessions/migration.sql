-- CreateEnum
CREATE TYPE "RetrocessionDirection" AS ENUM ('RECEIVED', 'PAID');

-- CreateEnum
CREATE TYPE "RetrocessionStatus" AS ENUM ('DRAFT', 'DUE', 'SETTLED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Retrocession" (
    "id" TEXT NOT NULL,
    "cabinetId" TEXT NOT NULL,
    "direction" "RetrocessionDirection" NOT NULL,
    "status" "RetrocessionStatus" NOT NULL DEFAULT 'DUE',
    "label" TEXT NOT NULL,
    "counterparty" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "settledAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Retrocession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Retrocession_cabinetId_direction_idx" ON "Retrocession"("cabinetId", "direction");

-- CreateIndex
CREATE INDEX "Retrocession_cabinetId_status_idx" ON "Retrocession"("cabinetId", "status");

-- CreateIndex
CREATE INDEX "Retrocession_cabinetId_periodStart_periodEnd_idx" ON "Retrocession"("cabinetId", "periodStart", "periodEnd");

-- AddForeignKey
ALTER TABLE "Retrocession" ADD CONSTRAINT "Retrocession_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
