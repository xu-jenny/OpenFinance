import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from "path";
import { openaiComplete } from "@/utils/openai-client";
import { createQuery } from "@/utils/prisma-client";
import { prismaCli } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

const tableMetaDataMap = {
    "MN_CRIME": `MinneapolisCrimeRate:
    Address: address where the crime occured
    Precinct: Minnepolis precinct where the crime occured. Int
    Neighborhood: Neighborhood where the crime occured. Enum
    Ward: Minnepolis ward where the crime occured. Int
    Latitude: Latitude of the crime. Float
    Longitude: Longitude of the crime. Float
    Type: Offense type, an enum that can be Crime Offenses (NIBRS), Shots Fired Calls, Gunshot Wound Victims or Additional Crime Metrics
    Case_Number: ID of the case
    Case_NumberAlt: Alternative ID of the case, provide this ID only if asked
    Reported_Date: datetime of when the case was reported
    Occurred_Date: datetime of when the case occured
    NIBRS_Crime_Against: who the crime against, an enum that can be Property, Person, Society or Non NIBRS Data
    Offense_Category: offense category, an enum
    Offense: offense type, an enum
    Problem_Initial: initial problem when reported
    Problem_Final: occured problem on site
    `,
    "MN_CRIME_FORCE": `
    CaseNumber: Case number, can be used to join with other tables
ResponseDate: datetime of police reponse
Problem: problem of the case, enum
Is911Call: true if the case is reported by 911Call. Boolean
PrimaryOffense: Code number of the offense
SubjectInjury: true if the subject is injured. Boolean
ForceReportNumber: number of times the police used force in this case. Int
SubjectRole: role of the subject. Enum
SubjectRoleNumber: role of the subject in number format. Int
ForceType: type of force applied by officer. Enum
ForceTypeAction: specific action force action applied by the officer. Enum
Race: Race of the subject. Enum with values Black, White, Asian, Native American, Pacific Islander, Unknown, Other / Mixed Race, not recorded
Sex: Sex of the subject. Enum with values Male, Female, not recorded, Unknown
EventAge: Age of the subject. Int
TypeOfResistance: type of resistance from the subject. Enum with values Tensed, Commission of Crime
Precinct: Minnepolis precinct where the crime occured. Int
Neighborhood: Neighborhood where the crime occured. Enum
TotalCityCallsForYear: total calls received in the year in the city
TotalPrecinctCallsForYear: total calls received in the year in the precinct
TotalNeighborhoodCallsForYear: total calls received in the year in the Neighborhood, 
Latitude: Latitude of the crime. Float
Longitude: Longitude of the crime. Float
    `,
    "WARN": `WarnNotice:
    companyName (String): name of the company that posted the notice
    noticeDate (DateTime): the date the notice was posted
    layoffDate (DateTime): the date the layoff will actually happen
    numAffected (Int): the number of employees affected
    state (String): the state in which the layoff will happen. State is represented by its 2 letter abbreviation, such as NY, NJ, CA, etc.)`
}

const tableExampleMap = {
    "MN_CRIME": `request: time of day when there is the highest case reported in each Precinct
    output: SELECT "Precinct" AS precinct, TO_CHAR(TIME '00:00' + INTERVAL '1 minute' * (EXTRACT(HOUR FROM "Reported_Date") * 60 + EXTRACT(MINUTE FROM "Reported_Date")), 'HH:MI') AS Time_Of_Highest_Case FROM "MinneapolisCrimeRate" WHERE "Case_Number" IN (SELECT MAX("Case_Number") FROM "MinneapolisCrimeRate" GROUP BY "Precinct");
    request: average number of cases in each neighborhood at each hour of the day
    output: SELECT "Neighborhood", EXTRACT(HOUR FROM "Reported_Date") AS Hour, AVG(COUNT("Case_Number")) OVER (PARTITION BY "Neighborhood", EXTRACT(HOUR FROM "Reported_Date")) AS Average_Cases FROM "MinneapolisCrimeRate" GROUP BY "Neighborhood", EXTRACT(HOUR FROM "Reported_Date");`,
    "MN_CRIME_FORCE": `request: neighborhood with the highest number of cases involving the of force
    output: SELECT "Neighborhood" as neighborhood, COUNT(*) AS NumCasesInvolvingForce FROM "MinneapolisPoliceUseOfForce" GROUP BY neighborhood ORDER BY NumCasesInvolvingForce DESC;`,
    "WARN": `request: total number of employees laid off in each state in the past 6 months
    output: SELECT "state", SUM("numAffected") AS "totalAffected" FROM "WarnNotice" WHERE DATE_TRUNC('day', "layoffDate") >= DATE_TRUNC('month', NOW() - INTERVAL '6 months') GROUP BY "state"
    request:  number of employees laid of in New York vs California
    output: SELECT SUM("numAffected") AS "NY", SUM(CASE WHEN "state" = 'CA' THEN "numAffected" ELSE 0 END) AS "CA" FROM "WarnNotice";
    request: yoy layoffs percent change at national level
    output: WITH yearly_layoffs AS (SELECT EXTRACT(YEAR FROM "layoffDate") AS dt_time, SUM("numAffected") AS numLayoffs FROM "WarnNotice" WHERE "layoffDate" >= (CURRENT_DATE - INTERVAL '5 years') GROUP BY EXTRACT(YEAR FROM "layoffDate")) SELECT time, numLayoffs, LAG(numLayoffs) OVER (ORDER BY time) AS previousNumLayoffs, CAST(((numLayoffs - COALESCE(LAG(numLayoffs) OVER (ORDER BY time), 0)) / NULLIF(COALESCE(LAG(numLayoffs) OVER (ORDER BY time), 0), 0)) * 100 AS numeric(10, 1)) AS value FROM yearly_layoffs ORDER BY time;`
}

function constructPrompt(tableNames: string[], question: string){
    const filePath = path.join(process.cwd(), 'prompts', 'analyze.txt');
    let prompt = fs.readFileSync(filePath, 'utf8');

    // @ts-ignore
    let metadatas = tableNames.map(name => tableMetaDataMap[name]).join('\n')
    // @ts-ignore
    let examples = tableNames.map(name => tableExampleMap[name]).join('\n')

    prompt = prompt.replace("{{tables}}", metadatas)
    prompt = prompt.replace("{{examples}}", examples)
    prompt = prompt.replace("{{question}}", question)
    return prompt
}

async function handleLLMResponse(question: string, response: string){
    if(response == 'Query Not Supported') {
        createQuery(question, response, "UNDEFINED_SQL")
        throw new IllegalSQLError()
    }
    createQuery(question, response, undefined)
    let data: any = await prismaCli.$queryRaw(Prisma.raw(response));
    return data.map((obj: any) => JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v)));
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const encodedTableNames = req.query.tables as string;
    console.log(encodedTableNames)
    if(!encodedTableNames){
        return res.status(400).json({ message: 'No table names in the request' });
    }
    const { message } = req.body;
    console.log(message)
    if (!message) {
      return res.status(400).json({ message: 'No message in the request' });
    }

    const decodedTableNames = encodedTableNames ? decodeURIComponent(encodedTableNames).split(',') : [];
    const prompt = constructPrompt(decodedTableNames, message)
    try {
        let sql = await openaiComplete(prompt);
        console.log(sql)
        const serializedArray = await handleLLMResponse(message, sql)
        res.status(200).json({ data: serializedArray, sql });
    } catch (error) {
        createQuery(message, undefined, error as string)
        console.log('error', error);
        res.status(400).json({ message: 'Server error, please try again later!' });
    }
  }