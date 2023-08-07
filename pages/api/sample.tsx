import { prismaCli } from '@/prisma/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { tableName } = req.body;
  let data;
  switch (tableName) {
    case 'WARN':
      data = await prismaCli.warnNotice.findMany({ take: 5 });
      break;
    case 'CrimeRate':
      data = await prismaCli.minneapolisCrimeRate.findMany({ take: 5 });
      console.log(data);
    case 'UseOfForce':
      data = await prismaCli.minneapolisPoliceUseOfForce.findMany({ take: 5 });
    default:
      break;
  }
  //   const serializedOutput = JSON.stringify(data, (key, value) => {
  //     return typeof value === 'bigint' ? Number(value) : value;
  //   });
  res.status(200).send({ data });
}
