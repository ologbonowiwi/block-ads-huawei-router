import puppeteer from "puppeteer";
import { createFileCopy, getIps } from "./files.js";
import { disableIps } from "./navigation.js";

const PAGES_TO_RUN_PARALLEL = 100;

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: [
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
  ]
});

console.log('Creating file copy');

await createFileCopy();

console.log('Getting ips');

const allIps = await getIps();

const splittedIps = [];
const pages = [];

for (let i = 0; i < PAGES_TO_RUN_PARALLEL; i++) {
  splittedIps[i] = allIps.splice(0, Math.ceil(allIps.length / (PAGES_TO_RUN_PARALLEL - i)));
  pages[i] = await browser.newPage();
}

for await (const ips of splittedIps) {
  await disableIps(ips, pages.shift());
}

await browser.close();
