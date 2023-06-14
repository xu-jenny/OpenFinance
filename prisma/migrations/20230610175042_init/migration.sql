-- CreateEnum
CREATE TYPE "State" AS ENUM ('NEWYORK', 'NEWJERSEY', 'CALIFORNIA', 'WASHINGTON');

-- CreateTable
CREATE TABLE "WarnNotice" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noticeDate" TIMESTAMP(3) NOT NULL,
    "layoffDate" TIMESTAMP(3),
    "numAffected" INTEGER NOT NULL,
    "state" "State" NOT NULL,

    CONSTRAINT "WarnNotice_pkey" PRIMARY KEY ("id")
);
