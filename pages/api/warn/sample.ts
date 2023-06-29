import { prismaCli } from '@/prisma/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const warnNotices = await prismaCli.warnNotice.findMany({ take: 5 });
  res.json(warnNotices);
}
