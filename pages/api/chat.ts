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
    // response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: `
    //   Generate a single SQL query that fulfills a request.

    //   These are the table schemas:
    //   WarnNotice:
    //   companyName (String): name of the company that posted the notice
    //   noticeDate (DateTime): the date the notice was posted
    //   layoffDate (DateTime): the date the layoff will take effect
    //   numAffected (Int): the number of employees affected
    //   state (String): the state in which the layoff will happen. State is represented by its 2 letter abbreviation, such as NY, NJ, CA, etc.)

    //   Make sure the generated SQL query is valid before outputting it. Column names shuld be surrounded with double quotations, while values should be surrounded with single quoataions.

    //   Here are some examples:
    //   request: total number of employees laid off in each state in the past 3 months
    //   output: SELECT "state", SUM("numAffected") AS "totalAffected" FROM "WarnNotice" WHERE DATE_TRUNC('day', "noticeDate") >= DATE_TRUNC('month', NOW() - INTERVAL '3 months') GROUP BY "state"
      
    //   request: number affected in New York vs California
    //   output: SELECT SUM("numAffected") AS "NY", SUM(CASE WHEN "state" = 'CA' THEN "numAffected" ELSE 0 END) AS "CA" FROM "WarnNotice";

    //   Only output the SQL query. Make sure the SQL query is correct before outputting it. Do not output any other words.
    //   request: ${question}
    //   output:`,
    //   temperature: 0.1,
    //   // max_tokens: 128,
    //   top_p: 1,
    //   frequency_penalty: 0.0,
    //   presence_penalty: 0.0,
    // });
    // console.log('response', response['data']);
    // let sql = Prisma.sql(response['data']['choices'][0]['text'].trim())
    let sql = `SELECT SUM("numAffected") AS "totalAffected" FROM "WarnNotice" WHERE "state" = 'CO' AND DATE_TRUNC('day', "noticeDate") >= DATE_TRUNC('month', NOW() - INTERVAL '2 months');`
    let query = Prisma.sql`(${sql})`
    let data = await prismaCli.$queryRaw`${sql}`

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
    // let data = await prismaCli.$queryRaw`
    // SELECT 
    //   SUM("numAffected") AS "NY", 
    //   SUM(CASE WHEN "state" = 'CA' THEN "numAffected" ELSE 0 END) AS "CA" 
    // FROM "WarnNotice";`

    console.log("data", data)
    data = convertBigInts(data)
    res.status(200).json({data})

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
