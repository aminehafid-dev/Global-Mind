import puppeteer from 'puppeteer-core';
import { createStaticServer } from './serve-dir.js';
import path from 'path';

const legacyServer = createStaticServer(path.resolve('legacy'), false);
await new Promise((resolve) => legacyServer.listen(8082, resolve));

const clientServer = createStaticServer(path.resolve('client/dist'), true);
await new Promise((resolve) => clientServer.listen(3003, resolve));

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true
});

const page = await browser.newPage();
await page.setViewport({ width: 375, height: 667 });

await page.goto('http://localhost:8082/about.html', { waitUntil: 'networkidle0' });
await page.evaluate(() => window.setLanguage('ar'));
const legHtml = await page.$eval('ul', el => el.innerHTML);

await page.goto('http://localhost:3003/about.html', { waitUntil: 'networkidle0' });
const migHtml = await page.$eval('ul', el => el.innerHTML);

console.log('Legacy UL:', legHtml);
console.log('Migrated UL:', migHtml);

await browser.close();
legacyServer.close();
clientServer.close();
