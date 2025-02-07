/*
  Warnings:

  - A unique constraint covering the columns `[CI,email]` on the table `Representative` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Representative_phone_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Representative_CI_email_key" ON "Representative"("CI", "email");
