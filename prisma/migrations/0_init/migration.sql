-- CreateEnum
CREATE TYPE "State" AS ENUM ('NY', 'NJ', 'CA', 'WA', 'CO', 'FL', 'TX', 'NC', 'MI', 'MD');

-- CreateTable
CREATE TABLE "WarnNotice" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyName" TEXT NOT NULL,
    "noticeDate" TIMESTAMP(3) NOT NULL,
    "layoffDate" TIMESTAMP(3),
    "numAffected" INTEGER NOT NULL,
    "state" "State" NOT NULL,

    CONSTRAINT "WarnNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" TEXT NOT NULL,
    "llm_response" TEXT,
    "error" TEXT,
    "uid" UUID NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableMetaData" (
    "id" SERIAL NOT NULL,
    "tableName" TEXT NOT NULL,
    "promptSchema" TEXT NOT NULL,

    CONSTRAINT "TableMetaData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

