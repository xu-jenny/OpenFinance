import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { SupabaseVectorStore } from 'langchain/vectorstores';
import { openai, openaiComplete } from '@/utils/openai-client';
import { makeChain } from '@/utils/makechain';
import { prismaCli } from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import { createQuery } from '@/utils/prisma-client';
import { Sql } from '@prisma/client/runtime';

async function execSql(query: string) {
  const result = await prismaCli.$queryRaw`${query}`;
  return result;
}
// use SQL if size of tables needed is more than 300MB
// LLM chain:
// 1. determine which tables and how much memory the operation requires. If more than 100MB use Sql
// 2. based on answer above, pull table schemas & construct prompt
// 3. viz - convert the output data to chart acceptable format. If output data is too big generate script for conversion
const POLICE_PROMPT=`Generate a single SQL query that fulfills a question.
The SQL can only be reading and you should not generate any table alternation queries. Output "Query Not Supported" for any non-read requests.

These are the table schemas. All columns are text unless otherwise noted:
MinneapolisCrimeRate:
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

MinneapolisPoliceUseOfForce:
ID: Id of the 
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

Make sure the generated SQL query is valid before outputting it. Column names shuld be surrounded with double quotations, while values should be surrounded with single quoataions.

Here are some examples
request: time of day when there is the highest case reported in each Precinct
output: SELECT "Precinct" AS precinct, TO_CHAR(TIME '00:00' + INTERVAL '1 minute' * (EXTRACT(HOUR FROM "Reported_Date") * 60 + EXTRACT(MINUTE FROM "Reported_Date")), 'HH:MI') AS Time_Of_Highest_Case FROM "MinneapolisCrimeRate" WHERE "Case_Number" IN (SELECT MAX("Case_Number") FROM "MinneapolisCrimeRate" GROUP BY "Precinct");

request: delete all rows from New York
output: Query Not Supported

request: average number of cases in each neighborhood at each hour of the day
output: SELECT "Neighborhood", EXTRACT(HOUR FROM "Reported_Date") AS Hour, AVG(COUNT("Case_Number")) OVER (PARTITION BY "Neighborhood", EXTRACT(HOUR FROM "Reported_Date")) AS Average_Cases FROM "MinneapolisCrimeRate" GROUP BY "Neighborhood", EXTRACT(HOUR FROM "Reported_Date");

request: neighborhood with the highest number of cases involving the of force
output: SELECT "Neighborhood" as neighborhood, COUNT(*) AS NumCasesInvolvingForce FROM "MinneapolisPoliceUseOfForce" GROUP BY neighborhood ORDER BY NumCasesInvolvingForce DESC;

request: percentage of cases involving use of force in each Neighborhood
output: SELECT m."Neighborhood" as neighborhood, COUNT(uof."ID") AS NumCasesInvolvingForce, COUNT(uof."ID") * 100.0 / COUNT(m."Case_Number") AS PercentageOfCasesInvolvingForce FROM "MinneapolisCrimeRate" m LEFT JOIN "MinneapolisPoliceUseOfForce" uof ON m."Case_Number" = uof."CaseNumber" GROUP BY m."Neighborhood" ORDER BY PercentageOfCasesInvolvingForce DESC;

request: number of cases in each month and the number of cases that involved use of force in each month
output: SELECT TO_CHAR(CAST(m."Occurred_Date" AS DATE), 'YYYY-MM') AS Month, COUNT(m."Case_Number") AS NumCases, COUNT(uof."ID") AS NumCasesInvolvingForce, COUNT(uof."ID") * 100.0 / COUNT(m."Case_Number") AS PercentageOfCasesInvolvingForce FROM "MinneapolisCrimeRate" m LEFT JOIN "MinneapolisPoliceUseOfForce" uof ON m."Case_Number" = uof."Case_Number" GROUP BY TO_CHAR(CAST(m."Occurred_Date" AS DATE), 'YYYY-MM') ORDER BY TO_CHAR(CAST(m."Occurred_Date" AS DATE), 'YYYY-MM');

Remember to only output the SQL query or the "Query Not Supported" response. Make sure the SQL query is correct before outputting it. Do not output any other words.
`

const WARN_PROMPT=`Generate a single SQL query that fulfills a request. 
The SQL can only be reading and you should not generate any table alternation queries. Output "Query Not Supported" for any non-read requests.

These are the table schemas:
WarnNotice:
companyName (String): name of the company that posted the notice
noticeDate (DateTime): the date the notice was posted
layoffDate (DateTime): the date the layoff will actually happen
numAffected (Int): the number of employees affected
state (String): the state in which the layoff will happen. State is represented by its 2 letter abbreviation, such as NY, NJ, CA, etc.)

Make sure the generated SQL query is valid before outputting it. Column names shuld be surrounded with double quotations, while values should be surrounded with single quoataions.

Here are some examples:
request: total number of employees laid off in each state in the past 6 months
output: SELECT "state", SUM("numAffected") AS "totalAffected" FROM "WarnNotice" WHERE DATE_TRUNC('day', "layoffDate") >= DATE_TRUNC('month', NOW() - INTERVAL '6 months') GROUP BY "state"

request:  number of employees laid of in New York vs California
output: SELECT SUM("numAffected") AS "NY", SUM(CASE WHEN "state" = 'CA' THEN "numAffected" ELSE 0 END) AS "CA" FROM "WarnNotice";

request: delete all rows from New York
output: Query Not Supported

If the request is a time series request, then output the time unit (such as year, month) column name as "dt_time". Alway output any time columns in proper datetime format, and prefix the column name with "dt_". Always name the request value column as "value". Example:
request: MoM change in texas layoffs
output: WITH monthly_layoffs AS (SELECT DATE_TRUNC('month', "layoffDate") AS layoff_month, SUM("numAffected") AS total_layoffs FROM "WarnNotice" WHERE state = 'TX' AND "layoffDate" >= (CURRENT_DATE - INTERVAL '1 year') GROUP BY DATE_TRUNC('month', "layoffDate")) SELECT layoff_month as dt_time, total_layoffs, total_layoffs - LAG(total_layoffs, 1) OVER (ORDER BY layoff_month) AS value FROM monthly_layoffs ORDER BY layoff_month;

Be mindful that the sql runner does not support nested aggregate functions, and window functions such as LAG cannot be used directly inside aggregate functions. An example:
request: yoy layoffs percent change at national level
output: WITH yearly_layoffs AS (SELECT EXTRACT(YEAR FROM "layoffDate") AS dt_time, SUM("numAffected") AS numLayoffs FROM "WarnNotice" WHERE "layoffDate" >= (CURRENT_DATE - INTERVAL '5 years') GROUP BY EXTRACT(YEAR FROM "layoffDate")) SELECT time, numLayoffs, LAG(numLayoffs) OVER (ORDER BY time) AS previousNumLayoffs, CAST(((numLayoffs - COALESCE(LAG(numLayoffs) OVER (ORDER BY time), 0)) / NULLIF(COALESCE(LAG(numLayoffs) OVER (ORDER BY time), 0), 0)) * 100 AS numeric(10, 1)) AS value FROM yearly_layoffs ORDER BY time;

Here is an example of an incorrect output, because it violates the rule that window functions cannot be used directly inside aggregate functions: SELECT EXTRACT(YEAR FROM "layoffDate") AS time, SUM("numAffected") AS numLayoffs, SUM(LAG("numAffected") OVER (ORDER BY EXTRACT(YEAR FROM "layoffDate"))) AS previousNumLayoffs, CAST(((numLayoffs - previousNumLayoffs) / CAST(previousNumLayoffs AS float)) * 100 AS numeric(10, 1)) AS value FROM "WarnNotice" WHERE "layoffDate" >= (CURRENT_DATE - INTERVAL '5 years') GROUP BY EXTRACT(YEAR FROM "layoffDate") ORDER BY time;

Remember to only output the SQL query or the "Query Not Supported" response. Make sure the SQL query is correct before outputting it. Do not output any other words.`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
  try {
    const GPT_PROMPT = `${POLICE_PROMPT}
request: ${sanitizedQuestion}
output:`;

    // let sql = `SELECT "Precinct" AS precinct, TO_CHAR(TIME '00:00' + INTERVAL '1 minute' * (EXTRACT(HOUR FROM "Reported_Date") * 60 + EXTRACT(MINUTE FROM "Reported_Date")), 'HH:MI') AS Time_Of_Highest_Case FROM "MinneapolisCrimeRate" WHERE "Case_Number" IN (SELECT MAX("Case_Number") FROM "MinneapolisCrimeRate" GROUP BY "Precinct");`
    let sql = await openaiComplete(GPT_PROMPT);
    console.log(sql);
    // if (sql == 'Time Not Supported' || 
    if(sql == 'Query Not Supported') {
      createQuery(question, sql, undefined)
      return res
        .status(400)
        .json({
          message:
            // 'We only support queries for the past 12 months, please upgrade to access historical data.',
            'We only support read operations'
        });
    }
    // let sql = `SELECT SUM("numAffected") AS "totalAffected" FROM "WarnNotice" WHERE "state" = 'CO' AND DATE_TRUNC('day', "noticeDate") >= DATE_TRUNC('month', NOW() - INTERVAL '2 months');`
    // let sql = `SELECT TO_CHAR(DATE_TRUNC('month', "noticeDate"), 'YYYY-MM') AS "month", SUM(CASE WHEN "state" = 'CO' THEN "numAffected" ELSE 0 END) AS "CO", SUM(CASE WHEN "state" = 'FL' THEN "numAffected" ELSE 0 END) AS "FL" FROM "WarnNotice" WHERE DATE_TRUNC('day', "noticeDate") >= DATE_TRUNC('month', NOW() - INTERVAL '3 months') GROUP BY "month";`
    let data: any = await prismaCli.$queryRaw(Prisma.raw(sql));
    console.log(data)
    const serializedArray = data.map((obj: any) =>
    JSON.stringify(obj, (_, v) => (typeof v === 'bigint' ? v.toString() : v)),
    );
    res.status(200).json({ data: serializedArray, sql });
    // createQuery(question, sql, undefined)

  } catch (error) {
    console.log('error', error);
    res.status(400).json({ message: 'Server error, please try again later!' });
    // createQuery(question, undefined, error as string)
  }
}
