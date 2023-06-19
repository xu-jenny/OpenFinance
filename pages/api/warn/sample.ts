import { prismaCli } from "@/prisma/prisma";


export default async function handle(req, res) {
  const warnNotices = await prismaCli.warnNotice.findMany({ take: 5 });
  res.json(warnNotices);
}