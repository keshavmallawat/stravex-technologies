import puppeteer from "puppeteer";
import { prisma } from "../src/lib/prisma";

const BASE = "http://localhost:3000";
const errors: string[] = [];

async function run() {
  const session = await prisma.session.findFirst({
    where: { expires: { gt: new Date() } },
  });
  if (!session) throw new Error("No active session in qa.db");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (text.includes("404")) return;
        errors.push(`console: ${text}`);
      }
    });
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    page.on("requestfailed", (req) =>
      errors.push(`network: ${req.url()} — ${req.failure()?.errorText}`),
    );

    await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1", { timeout: 10000 });
    const loginText = await page.evaluate(() => document.body.innerText);
    if (!loginText.includes("Stravex CMS") || !loginText.includes("Google")) {
      throw new Error(`Login page content unexpected: ${loginText.slice(0, 200)}`);
    }

    await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.location.pathname.includes("/admin/login"), { timeout: 10000 });

    await page.setCookie({
      name: "authjs.session-token",
      value: session.sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
    });
    await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => !document.body.innerText.includes("Sign in with Google"),
      { timeout: 10000 },
    );

    await page.goto(`${BASE}/admin/products`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(
      () => !window.location.pathname.includes("/admin/login"),
      { timeout: 10000 },
    );

    if (errors.length > 0) {
      throw new Error(`Browser errors:\n${errors.join("\n")}`);
    }

    console.log("AUTH MODULE: PASS");
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

run().catch((err) => {
  console.error("AUTH MODULE: FAIL", (err as Error).message);
  process.exit(1);
});
