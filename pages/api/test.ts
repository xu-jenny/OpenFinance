import { supabaseClient } from '@/utils/supabase-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prismaCli } from '@/prisma/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('handling test function');
  const result = await prismaCli.$queryRaw`SELECT * FROM "WarnNotice"`;
  console.log(result);
  res.status(200).json({ message: result });
}
