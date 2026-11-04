import puppeteer from 'puppeteer-core';
import { createStaticServer } from './serve-dir.js';
import path from 'path';

const legacyServer = createStaticServer(path.resolve('legacy'), false);
await new Promise((resolve) => legacyServer.listen(8081, resolve));

const clientServer = createStaticServer(path.resolve('client/dist'), true);
await new Promise((resolve) => clientServer.listen(3002, resolve));

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true
});

const page = await browser.newPage();
await page.setViewport({ width: 375, height: 667 });

await page.goto('http://localhost:8081/about.html', { waitUntil: 'networkidle0' });
const legBox = await page.evaluate(() => {
  return {
    header: document.querySelector('header')?.offsetHeight,
    h1: document.querySelector('h1')?.offsetHeight,
    card: document.querySelector('.card')?.offsetHeight,
    p_vision: document.querySelector('[data-i18n="about.vision_desc"]')?.offsetHeight,
    p_mission: document.querySelector('[data-i18n="about.mission_desc"]')?.offsetHeight,
    ul_method: document.querySelector('ul')?.offsetHeight,
    footer: document.querySelector('footer')?.offsetHeight,
    body: document.body.offsetHeight
  };
});

await page.goto('http://localhost:3002/about.html', { waitUntil: 'networkidle0' });
const migBox = await page.evaluate(() => {
  return {
    header: document.querySelector('header')?.offsetHeight,
    h1: document.querySelector('h1')?.offsetHeight,
    card: document.querySelector('.card')?.offsetHeight,
    p_vision: document.querySelector('[data-i18n="about.vision_desc"]')?.offsetHeight,
    p_mission: document.querySelector('[data-i18n="about.mission_desc"]')?.offsetHeight,
    ul_method: document.querySelector('ul')?.offsetHeight,
    footer: document.querySelector('footer')?.offsetHeight,
    body: document.body.offsetHeight
  };
});

console.log('Legacy:', legBox);
console.log('Migrated:', migBox);

await browser.close();
legacyServer.close();
clientServer.close();
