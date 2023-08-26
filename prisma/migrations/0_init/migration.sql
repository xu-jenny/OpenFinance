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
    "downloadInstruction" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TableMetaData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinneapolisCrimeRate" (
    "X" DOUBLE PRECISION NOT NULL,
    "Y" DOUBLE PRECISION NOT NULL,
    "Type" TEXT NOT NULL,
    "Case_Number" TEXT NOT NULL,
    "Case_NumberAlt" TEXT,
    "Reported_Date" TIMESTAMPTZ(6) NOT NULL,
    "Occurred_Date" TIMESTAMP(6),
    "NIBRS_Crime_Against" TEXT NOT NULL,
    "NIBRS_Group" TEXT NOT NULL,
    "NIBRS_Code" TEXT NOT NULL,
    "Offense_Category" TEXT NOT NULL,
    "Offense" TEXT NOT NULL,
    "Problem_Initial" TEXT,
    "Problem_Final" TEXT,
    "Address" TEXT,
    "Precinct" SMALLINT,
    "Neighborhood" TEXT,
    "Ward" SMALLINT,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "wgsXAnon" TEXT NOT NULL,
    "wgsYAnon" TEXT NOT NULL,
    "Crime_Count" INTEGER NOT NULL,
    "OBJECTID" INTEGER NOT NULL,

    CONSTRAINT "MinneapolisCrimeRate_pkey" PRIMARY KEY ("OBJECTID")
);

-- CreateTable
CREATE TABLE "MinneapolisPoliceUseOfForce" (
    "X" TEXT NOT NULL,
    "Y" TEXT NOT NULL,
    "ID" INTEGER NOT NULL,
    "CaseNumber" TEXT NOT NULL,
    "ResponseDate" TIMESTAMPTZ(6),
    "Problem" TEXT,
    "Is911Call" BOOLEAN,
    "PrimaryOffense" TEXT,
    "SubjectInjury" BOOLEAN,
    "ForceReportNumber" TEXT NOT NULL,
    "SubjectRole" TEXT,
    "SubjectRoleNumber" TEXT,
    "ForceType" TEXT,
    "ForceTypeAction" TEXT NOT NULL,
    "Race" TEXT,
    "Sex" TEXT,
    "EventAge" TEXT,
    "TypeOfResistance" TEXT,
    "Precinct" TEXT,
    "Neighborhood" TEXT,
    "TotalCityCallsForYear" INTEGER NOT NULL,
    "TotalPrecinctCallsForYear" TEXT,
    "TotalNeighborhoodCallsForYear" INTEGER NOT NULL,
    "CenterGBSID" TEXT NOT NULL,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "CenterX" TEXT NOT NULL,
    "CenterY" TEXT NOT NULL,
    "DateAdded" TIMESTAMPTZ(6) NOT NULL,
    "OBJECTID" INTEGER NOT NULL,

    CONSTRAINT "MinneapolisPoliceUseOfForce_pkey" PRIMARY KEY ("OBJECTID")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" TEXT NOT NULL,
    "llm_response" TEXT,
    "error" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

