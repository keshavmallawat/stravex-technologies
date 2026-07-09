import { prisma } from "../src/lib/prisma";

async function main() {
  const allowlistCount = await prisma.adminAllowlist.count();
  const userCount = await prisma.user.count();
  const sessionCount = await prisma.session.count();
  const activeSessions = await prisma.session.count({
    where: { expires: { gt: new Date() } },
  });
  console.log(
    JSON.stringify({ allowlistCount, userCount, sessionCount, activeSessions }),
  );
  await prisma.$disconnect();
}

main();
