import puppeteer from "puppeteer";
import { prisma } from "../src/lib/prisma";

const BASE = "http://localhost:3000";

async function getSessionCookie() {
  const session = await prisma.session.findFirst({
    where: { expires: { gt: new Date() } },
  });
  if (!session) throw new Error("No active session in qa.db");
  return session.sessionToken;
}

async function run() {
  const errors: string[] = [];
  const token = await getSessionCookie();

  const [productCount, blogCount, newsCount, contactCount, mediaCount] =
    await Promise.all([
      prisma.product.count({ where: { deletedAt: null } }),
      prisma.blogPost.count({ where: { deletedAt: null } }),
      prisma.newsPost.count({ where: { deletedAt: null } }),
      prisma.contact.count({ where: { deletedAt: null } }),
      prisma.mediaAsset.count(),
    ]);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
    });
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    page.on("requestfailed", (req) =>
      errors.push(`network: ${req.url()} — ${req.failure()?.errorText}`),
    );

    await page.setCookie({
      name: "authjs.session-token",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
    });

    await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h2", { timeout: 10000 });

    const text = await page.evaluate(() => document.body.innerText);
    if (!text.includes("Welcome back")) {
      throw new Error(`Dashboard heading not found. Page text: ${text.slice(0, 500)}`);
    }
    const upper = text.toUpperCase();
    for (const label of [
      "PRODUCTS",
      "BLOGS",
      "NEWS",
      "CONTACT ENQUIRIES",
      "MEDIA FILES",
      "QUICK ACTIONS",
    ]) {
      if (!upper.includes(label)) {
        throw new Error(`Missing dashboard section: ${label}`);
      }
    }

    const productStat = await page.evaluate(() => {
      const body = document.body.innerText.toUpperCase();
      const match = body.match(/\[ TOTAL PRODUCTS \][\s\S]*?(\d+)/);
      return match?.[1] ?? null;
    });
    if (productStat !== String(productCount)) {
      throw new Error(
        `Product count mismatch: UI=${productStat} DB=${productCount}`,
      );
    }

    const blogStat = await page.evaluate(() => {
      const body = document.body.innerText.toUpperCase();
      const match = body.match(/\[ TOTAL BLOGS \][\s\S]*?(\d+)/);
      return match?.[1] ?? null;
    });
    if (blogStat !== String(blogCount)) {
      throw new Error(`Blog count mismatch: UI=${blogStat} DB=${blogCount}`);
    }

    const href = await page.$eval(
      'a[href="/admin/products/new"]',
      (el) => (el as HTMLAnchorElement).href,
    );
    if (!href.includes("/admin/products/new")) {
      throw new Error("Quick action link broken");
    }

    if (errors.length > 0) {
      throw new Error(`Browser errors:\n${errors.join("\n")}`);
    }

    console.log(
      JSON.stringify({
        status: "PASS",
        db: { productCount, blogCount, newsCount, contactCount, mediaCount },
      }),
    );
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

run().catch((err) => {
  console.error("DASHBOARD MODULE: FAIL", (err as Error).message);
  process.exit(1);
});
