import { supabaseClient } from '@/utils/supabase-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prismaCli } from '@/prisma/prisma';
import { createQuery } from '@/utils/prisma-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('handling test function');
  // const { uid } = req.body;
  let question = "national level layoffs month by month in the past 5 years"
  let sql = `WITH monthly_layoffs AS (SELECT DATE_TRUNC('month', "layoffDate") AS time, SUM("numAffected") AS value FROM "WarnNotice" WHERE "layoffDate" >= (CURRENT_DATE - INTERVAL '5 years') GROUP BY DATE_TRUNC('month', "layoffDate")) SELECT time, value FROM monthly_layoffs ORDER BY time;`
  createQuery(question, sql, undefined)
  // const result = await prismaCli.$queryRaw`SELECT * FROM "WarnNotice"`;
  // console.log(result);
  // res.status(200).json({ message: result });
}
