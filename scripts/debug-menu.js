import puppeteer from 'puppeteer-core';
import { createStaticServer } from './serve-dir.js';
import path from 'path';

const clientServer = createStaticServer(path.resolve('client/dist'), true);
await new Promise((resolve) => clientServer.listen(3001, resolve));

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true
});

const page = await browser.newPage();
await page.setViewport({ width: 375, height: 667 });
await page.goto('http://localhost:3001/index.html', { waitUntil: 'networkidle0' });

const before = await page.$eval('#navLinks', el => el.classList.contains('show'));
console.log('Before click:', before);

const toggle = await page.$('#menuToggle');
await toggle.click();
await new Promise(r => setTimeout(r, 400));

const after = await page.$eval('#navLinks', el => el.classList.contains('show'));
const text = await page.$eval('#menuToggle', el => el.textContent.trim());
console.log('After click:', after, 'buttonText:', JSON.stringify(text));

await toggle.click();
await new Promise(r => setTimeout(r, 400));
const closed = !await page.$eval('#navLinks', el => el.classList.contains('show'));
console.log('Closed:', closed);

await browser.close();
clientServer.close();
