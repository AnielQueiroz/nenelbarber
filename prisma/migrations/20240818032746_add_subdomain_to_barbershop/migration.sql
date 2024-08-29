/*
  Warnings:

  - A unique constraint covering the columns `[subdomain]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subdomain` to the `Barbershop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "subdomain" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_subdomain_key" ON "Barbershop"("subdomain");
