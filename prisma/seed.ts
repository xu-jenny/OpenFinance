import { PrismaClient, State } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const warnNotice1 = await prisma.warnNotice.create({
    data: {
      noticeDate: new Date("2023-01-01"),
      layoffDate: new Date("2023-02-01"),
      numAffected: 100,
      state: State.NEWYORK,
    },
  });

  const warnNotice2 = await prisma.warnNotice.create({
    data: {
      noticeDate: new Date("2023-03-01"),
      numAffected: 50,
      state: State.CALIFORNIA,
    },
  });

  console.log({ warnNotice1, warnNotice2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
