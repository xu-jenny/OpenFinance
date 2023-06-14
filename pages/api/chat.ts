import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { SupabaseVectorStore } from 'langchain/vectorstores';
import { openai } from '@/utils/openai-client';
import { supabaseClient } from '@/utils/supabase-client';
import { makeChain } from '@/utils/makechain';
import { prismaCli } from '@/prisma/prisma';
import { Prisma } from '@prisma/client';

async function execSql(query: string) {
  const result = await prismaCli.$queryRaw`${query}`
  return result
}

function convertBigInts(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertBigInts);
  } else if (typeof obj === 'object' && obj !== null) {
    let newObj = {};
    for (const key in obj) {
      newObj[key] = convertBigInts(obj[key]);
    }
    return newObj;
  } else if (typeof obj === 'bigint') {
    return Number(obj);
  } else {
    return obj;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { question, history } = req.body;

  if (!question) {
    return res.status(400).json({ message: 'No question in the request' });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  // res.writeHead(200, {
  //   'Content-Type': 'text/event-stream',
  //   'Cache-Control': 'no-cache, no-transform',
  //   Connection: 'keep-alive',
  // });

  // const sendData = (data: string) => {
  //   res.write(`data: ${data}\n\n`);
  // };

  // sendData(JSON.stringify({ data: '' }));

  // const model = openai;
  // // create the chain
  // const chain = makeChain();

  let response;
  try {
    console.log("invoking openai", question)
    response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
Generate a single SQL query that fulfills a request. 

These are the table schemas:
WarnNotice:
companyName (String): name of the company that posted the notice
noticeDate (DateTime): the date the notice was posted
layoffDate (DateTime): the date the layoff will take effect
numAffected (Int): the number of employees affected
state (String): the state in which the layoff will happen. State is represented by its 2 letter abbreviation, such as NY, NJ, CA, etc.)

Make sure the generated SQL query is valid before outputting it. Column names shuld be surrounded with double quotations, while values should be surrounded with single quoataions.

Here are some examples:
request: total number of employees laid off in each state in the past 6 months
output: SELECT "state", SUM("numAffected") AS "totalAffected" FROM "WarnNotice" WHERE DATE_TRUNC('day', "noticeDate") >= DATE_TRUNC('month', NOW() - INTERVAL '6 months') GROUP BY "state"

request:  number of employees laid of in New York vs California
output: SELECT SUM("numAffected") AS "NY", SUM(CASE WHEN "state" = 'CA' THEN "numAffected" ELSE 0 END) AS "CA" FROM "WarnNotice";

If the request is related to time period, make sure the request is not any longer than 12 months. If it is, output "Time Not Supported". Here are two examples:

request: number affected in each month in Colorado vs Florida in past 3 months
output: SELECT TO_CHAR(DATE_TRUNC('month', "noticeDate"), 'YYYY-MM') AS "month", SUM(CASE WHEN "state" = 'CO' THEN "numAffected" ELSE 0 END) AS "CO", SUM(CASE WHEN "state" = 'FL' THEN "numAffected" ELSE 0 END) AS "FL" FROM "WarnNotice" WHERE DATE_TRUNC('day', "noticeDate") >= DATE_TRUNC('month', NOW() - INTERVAL '3 months') GROUP BY "month"

request: number of employees laid off in each month in Colorado in the past 2 years
output: Time Not Supported

Remember to only output the SQL query or the "Time Not Supported" response. Make sure the SQL query is correct before outputting it. Do not output any other words.
request: ${question}
output:`,
      temperature: 0,
      max_tokens: 128,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    console.log('response', response['data']);
    let sql = response['data']['choices'][0]['text'].trim()
    if (sql == 'Time Not Supported'){
      return res.status(400).json({ message: "We only support queries for the past 12 months, please upgrade to access historical data."}) 
    }
    // let sql = `SELECT SUM("numAffected") AS "totalAffected" FROM "WarnNotice" WHERE "state" = 'CO' AND DATE_TRUNC('day', "noticeDate") >= DATE_TRUNC('month', NOW() - INTERVAL '2 months');`
    // let sql = `SELECT TO_CHAR(DATE_TRUNC('month', "noticeDate"), 'YYYY-MM') AS "month", SUM(CASE WHEN "state" = 'CO' THEN "numAffected" ELSE 0 END) AS "CO", SUM(CASE WHEN "state" = 'FL' THEN "numAffected" ELSE 0 END) AS "FL" FROM "WarnNotice" WHERE DATE_TRUNC('day', "noticeDate") >= DATE_TRUNC('month', NOW() - INTERVAL '3 months') GROUP BY "month";`
    let data = await prismaCli.$queryRaw(Prisma.raw(sql))

    // let data = await prismaCli.$queryRaw`
    // SELECT 
    //     "state",
    //     SUM("numAffected") AS "totalAffected"
    // FROM 
    //     "WarnNotice"
    // WHERE
    //     DATE_TRUNC('day', "noticeDate") >= DATE_TRUNC('month', NOW() - INTERVAL '3 months')
    // GROUP BY 
    //     "state"
    // LIMIT 5;
// `
    // SELECT 
    //   SUM("numAffected") AS "NY", 
    //   SUM(CASE WHEN "state" = 'CA' THEN "numAffected" ELSE 0 END) AS "CA" 
    // FROM "WarnNotice";`

    console.log("data", data)
    data = convertBigInts(data)
    res.status(200).json({data, sql})

    // let result = await prismaCli.$queryRaw`${sql.trim()}`execSql(sql.trim())
    // if ("sql" in response.lower()){
    //   result = supabaseClient.rpc(response)    // array of json
    //   console.log("result", result)
    //   return { "data": result }
    // }
  } catch (error) {
    console.log('error', error);
  } 
}
