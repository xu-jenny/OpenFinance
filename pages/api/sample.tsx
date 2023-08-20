import { prismaCli } from '@/prisma/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const name = req.query.name as string;
  // const { tableName } = req.body;
  console.log(name);
  let data;
  switch (name) {
    case 'WARN':
      data = await prismaCli.warnNotice.findMany({ take: 5 });
      break;
    case 'MN_CRIME':
      data = await prismaCli.minneapolisCrimeRate.findMany({ take: 5 });
      console.log(data);
    case 'MN_CRIME_FORCE':
      data = await prismaCli.minneapolisPoliceUseOfForce.findMany({ take: 5 });
    default:
      break;
  }
  //   const serializedOutput = JSON.stringify(data, (key, value) => {
  //     return typeof value === 'bigint' ? Number(value) : value;
  //   });
  res.status(200).send({ data });
}
