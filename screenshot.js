const puppeteer = require('puppeteer');
const path = require('path');

const pages = [
  { name: 'home',        url: 'http://localhost:3000/' },
  { name: 'about',       url: 'http://localhost:3000/about.html' },
  { name: 'gallery',     url: 'http://localhost:3000/gallery.html' },
  { name: 'our-process', url: 'http://localhost:3000/our-process.html' },
  { name: 'contact',     url: 'http://localhost:3000/contact.html' },
];

const outDir = path.join(__dirname);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  for (const { name, url } of pages) {
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(outDir, `${name}-mobile.png`), fullPage: true });
    console.log(`captured ${name}`);
  }

  await browser.close();
})();
