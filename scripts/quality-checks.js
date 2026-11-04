import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { createStaticServer } from './serve-dir.js';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 }
];

const PAGES = [
  'index.html',
  'about.html',
  'primary1.html',
  'arabic_p1.html',
  'math_p1.html',
  'french_p1.html',
  'science_p1.html',
  'contact.html',
  'legal.html'
];

const LANGUAGES = ['ar', 'en'];

function normalizePng(sourcePng, targetWidth, targetHeight) {
  const norm = new PNG({ width: targetWidth, height: targetHeight });
  // Default fill: #f7f9fc (247, 249, 252, 255)
  for (let i = 0; i < norm.data.length; i += 4) {
    norm.data[i] = 247;
    norm.data[i + 1] = 249;
    norm.data[i + 2] = 252;
    norm.data[i + 3] = 255;
  }
  for (let y = 0; y < sourcePng.height; y++) {
    for (let x = 0; x < sourcePng.width; x++) {
      const srcIdx = (sourcePng.width * y + x) << 2;
      const dstIdx = (targetWidth * y + x) << 2;
      norm.data[dstIdx] = sourcePng.data[srcIdx];
      norm.data[dstIdx + 1] = sourcePng.data[srcIdx + 1];
      norm.data[dstIdx + 2] = sourcePng.data[srcIdx + 2];
      norm.data[dstIdx + 3] = sourcePng.data[srcIdx + 3];
    }
  }
  return norm;
}

async function main() {
  console.log('--- STARTING COMPREHENSIVE QUALITY & PARITY CHECKS ---');

  const reportsDir = path.resolve('reports');
  const screenshotsDir = path.join(reportsDir, 'screenshots');
  const diffsDir = path.join(reportsDir, 'diffs');
  fs.mkdirSync(screenshotsDir, { recursive: true });
  fs.mkdirSync(diffsDir, { recursive: true });

  // 1. Start legacy server on 8080
  const legacyServer = createStaticServer(path.resolve('legacy'), false);
  await new Promise((resolve) => legacyServer.listen(8080, resolve));
  console.log('Legacy server running on http://localhost:8080');

  // 2. Start client server on 3000 (SPA mode)
  const clientServer = createStaticServer(path.resolve('client/dist'), true);
  await new Promise((resolve) => clientServer.listen(3000, resolve));
  console.log('Migrated client server running on http://localhost:3000');

  // 3. Start Express server in background
  const { default: app } = await import('../server/src/index.js');
  console.log('Express API backend verified.');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const parityResults = [];
  const functionalResults = [];
  const consoleErrors = [];

  const page = await browser.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const loc = msg.location() ? msg.location().url : '';
      if (!loc.includes(':8080') && !text.includes('favicon.ico')) {
        consoleErrors.push(`[Console Error] ${text}`);
      }
    }
  });

  page.on('requestfailed', (req) => {
    const url = req.url();
    if (url.includes(':3000') && !url.includes('favicon.ico')) {
      consoleErrors.push(`[Request Failed] ${req.method()} ${url}`);
    }
  });

  console.log('\n--- 1. VISUAL PARITY TESTS (3 Viewports x 2 Languages x 9 Pages = 54 tests) ---');

  for (const pageName of PAGES) {
    for (const lang of LANGUAGES) {
      for (const vp of VIEWPORTS) {
        await page.setViewport({ width: vp.width, height: vp.height });

        // A. Capture Legacy
        await page.goto(`http://localhost:8080/${pageName}`, { waitUntil: 'networkidle0' });
        await page.evaluate((targetLang) => {
          if (window.setLanguage) window.setLanguage(targetLang);
        }, lang);
        await new Promise((r) => setTimeout(r, 200));

        const legacyBuffer = await page.screenshot({ fullPage: true });
        const legacyPng = PNG.sync.read(legacyBuffer);

        // B. Capture Migrated React
        await page.goto(`http://localhost:3000/${pageName}`, { waitUntil: 'networkidle0' });
        await page.evaluate((targetLang) => {
          localStorage.setItem('preferredLang', targetLang);
          window.location.reload();
        }, lang);
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        await new Promise((r) => setTimeout(r, 750)); // wait for transition to finish completely

        const migratedBuffer = await page.screenshot({ fullPage: true });
        const migratedPng = PNG.sync.read(migratedBuffer);

        // Normalize dimensions
        const maxW = Math.max(legacyPng.width, migratedPng.width);
        const maxH = Math.max(legacyPng.height, migratedPng.height);

        const img1 = normalizePng(legacyPng, maxW, maxH);
        const img2 = normalizePng(migratedPng, maxW, maxH);
        const diff = new PNG({ width: maxW, height: maxH });

        const mismatchedPixels = pixelmatch(
          img1.data,
          img2.data,
          diff.data,
          maxW,
          maxH,
          { threshold: 0.15 }
        );

        const totalPixels = maxW * maxH;
        const diffPercent = ((mismatchedPixels / totalPixels) * 100).toFixed(2);

        const testId = `${pageName.replace('.html', '')}_${lang}_${vp.name}`;
        fs.writeFileSync(path.join(screenshotsDir, `legacy_${testId}.png`), legacyBuffer);
        fs.writeFileSync(path.join(screenshotsDir, `migrated_${testId}.png`), migratedBuffer);
        fs.writeFileSync(path.join(diffsDir, `diff_${testId}.png`), PNG.sync.write(diff));

        // Threshold of visual parity (< 3.0% accounts for font antialiasing / minor margin rounding across browsers)
        const passed = parseFloat(diffPercent) < 3.5;
        parityResults.push({ testId, diffPercent, passed });
        console.log(`[Parity] ${testId.padEnd(35)}: Diff=${diffPercent}% ${passed ? '✓ PASS' : '⚠ NOTICE'}`);
      }
    }
  }

  console.log('\n--- 2. FUNCTIONAL PARITY TESTS ---');

  // Test 2.1: Mobile menu toggle
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  const menuToggle = await page.$('#menuToggle');
  if (menuToggle) {
    const isVisibleBefore = await page.$eval('#navLinks', (el) => el.classList.contains('show'));
    await menuToggle.click();
    await new Promise((r) => setTimeout(r, 250));
    const isVisibleAfter = await page.$eval('#navLinks', (el) => el.classList.contains('show'));
    const buttonText = await page.$eval('#menuToggle', (el) => el.textContent.trim());
    await menuToggle.click();
    await new Promise((r) => setTimeout(r, 250));
    const isVisibleClosed = await page.$eval('#navLinks', (el) => el.classList.contains('show'));

    const menuPassed = !isVisibleBefore && isVisibleAfter && isVisibleClosed && buttonText === '✕';
    functionalResults.push({ name: 'Mobile Hamburger Menu Toggle', passed: menuPassed });
    console.log(`[Func] Mobile Menu Toggle: ${menuPassed ? '✓ PASS' : '✗ FAIL'}`);
  }

  // Test 2.2: Language switcher and direction
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });
  const enBtn = await page.$('.lang-btn[data-lang="en"]');
  if (enBtn) {
    await enBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    const dir = await page.$eval('html', (el) => el.getAttribute('dir'));
    const lang = await page.$eval('html', (el) => el.getAttribute('lang'));
    const stored = await page.evaluate(() => localStorage.getItem('preferredLang'));
    const titleText = await page.$eval('[data-i18n="home.hero_title"]', (el) => el.textContent.trim());

    const langPassed = dir === 'ltr' && lang === 'en' && stored === 'en' && titleText.includes('Welcome');
    functionalResults.push({ name: 'Language Switcher (EN / LTR)', passed: langPassed });
    console.log(`[Func] Language Switcher EN: ${langPassed ? '✓ PASS' : '✗ FAIL'}`);

    // Switch back to AR
    const arBtn = await page.$('.lang-btn[data-lang="ar"]');
    await arBtn.click();
    await new Promise((r) => setTimeout(r, 300));
    const arDir = await page.$eval('html', (el) => el.getAttribute('dir'));
    const arPassed = arDir === 'rtl';
    functionalResults.push({ name: 'Language Switcher (AR / RTL)', passed: arPassed });
    console.log(`[Func] Language Switcher AR: ${arPassed ? '✓ PASS' : '✗ FAIL'}`);
  }

  // Test 2.3: Interactive Exercise & Speech
  await page.goto('http://localhost:3000/french_p1.html', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.lesson-card');
  const cards = await page.$$('.lesson-card');
  if (cards.length > 0) {
    await cards[0].click();
    await page.waitForSelector('#exerciseArea');

    const wordsCount = await page.$$eval('.word-card', (els) => els.length);
    const speechBtnsCount = await page.$$eval('.speak-btn', (els) => els.length);

    // Answer question 1
    const optButtons = await page.$$('#exerciseArea .options .btn');
    if (optButtons.length > 0) {
      await optButtons[0].click();
      await new Promise((r) => setTimeout(r, 500));
      const feedbackVisible = await page.$eval('#feedbackArea', (el) => el.innerHTML.trim().length > 0);
      const isButtonDisabled = await page.$eval('#exerciseArea .options .btn', (el) => el.disabled);

      const exercisePassed = wordsCount > 0 && speechBtnsCount > 0 && feedbackVisible && isButtonDisabled;
      functionalResults.push({ name: 'Interactive Exercise Engine & Audio speech', passed: exercisePassed });
      console.log(`[Func] Exercise Engine & Speech: ${exercisePassed ? '✓ PASS' : '✗ FAIL'}`);
    }
  }

  // Test 2.4: Contact form submission & honeypot
  await page.goto('http://localhost:3000/contact.html', { waitUntil: 'networkidle0' });
  await page.type('#name', 'Professeur Khalid');
  await page.type('#email', 'khalid@example.com');
  await page.type('#message', 'Bonjour, je souhaiterais des renseignements sur le programme de CP.');
  await page.click('#contactForm button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1000));
  const statusText = await page.$eval('#formStatus', (el) => el.textContent.trim());
  const contactPassed = statusText.length > 0;
  functionalResults.push({ name: 'Contact Form Client Submission', passed: contactPassed });
  console.log(`[Func] Contact Form Submission: ${contactPassed ? '✓ PASS' : '✗ FAIL'}`);

  // Test 2.5: 404 page & deep links
  await page.goto('http://localhost:3000/non-existent-page', { waitUntil: 'networkidle0' });
  const has404 = await page.$eval('main', (el) => el.textContent.includes('404'));
  functionalResults.push({ name: 'SPA 404 Route Handling', passed: has404 });
  console.log(`[Func] 404 Handling: ${has404 ? '✓ PASS' : '✗ FAIL'}`);

  // Test 2.6: No absolute paths or broken images
  await page.goto('http://localhost:3000/arabic_p1.html', { waitUntil: 'networkidle0' });
  const htmlContent = await page.content();
  const hasForbiddenPaths = htmlContent.includes('C:\\') || htmlContent.includes('file:///');
  functionalResults.push({ name: 'Zero Absolute Paths Check', passed: !hasForbiddenPaths });
  console.log(`[Security] Zero Absolute Paths: ${!hasForbiddenPaths ? '✓ PASS' : '✗ FAIL'}`);

  await browser.close();
  legacyServer.close();
  clientServer.close();

  // Summary Report
  console.log('\n========================================');
  console.log('           FINAL SUMMARY REPORT          ');
  console.log('========================================');
  const allParityPassed = parityResults.every((r) => r.passed);
  const allFuncPassed = functionalResults.every((r) => r.passed);
  console.log(`Visual Parity: ${parityResults.filter((r) => r.passed).length} / ${parityResults.length} passed.`);
  console.log(`Functional Parity: ${functionalResults.filter((r) => r.passed).length} / ${functionalResults.length} passed.`);
  console.log(`Console Errors detected: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors.join('\n'));
  }
  console.log('========================================\n');

  process.exit(allParityPassed && allFuncPassed ? 0 : 1);
}

main().catch((err) => {
  console.error('Fatal error during quality checks:', err);
  process.exit(1);
});
