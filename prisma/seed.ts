import { PrismaClient, State } from "@prisma/client";
import { parse } from "csv-parse"
import fs from "fs";

const prisma = new PrismaClient();

async function seed() {
    const fileContent = fs.readFileSync("/Users/jennyxu/Desktop/projects/openfinance/prisma/data/co_processed.csv", "utf-8");
    let warnNotices: { companyName: any; noticeDate: Date; layoffDate: Date | null; numAffected: number; state: "CO"; }[] = [];
    parse(fileContent, {
      delimiter: ',',
      columns: true,
      skip_empty_lines: true,
    }, async (error, result) => {
      if (error) {
        console.error(error);
      }
      for (const item of result) {
        if (item.companyName == null || isNaN(new Date(item.noticeDate).getTime())){
          console.log(item)
          continue;
        } else {
          const layoffDate = new Date(item.layoffDate);
          const isValidDate = !isNaN(layoffDate.getTime());
  
          // Create a new WarnNotice record
          const warnNotice = {
            companyName: item.companyName,
            noticeDate: new Date(item.noticeDate),
            layoffDate: isValidDate ? layoffDate : null,
            numAffected: isNaN(item.numAffected) ? -1 : Number(item.numAffected),
            state: State.CO,
          };
          warnNotices.push(warnNotice);
        }
      }
      // await prisma.$transaction(warnNotices.map(warnNotice => prisma.warnNotice.create({ data: warnNotice })));
      await prisma.warnNotice.createMany({
        data: warnNotices,
        skipDuplicates: true, // Optional: skip duplicate records
      });
    });
}

seed()
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});
