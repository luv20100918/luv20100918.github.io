const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });
  
  await page.goto('http://localhost:4322/');
  await page.waitForTimeout(2000); // Wait for fonts and styles to load
  
  await page.screenshot({ 
    path: 'pixel-theme-screenshot.png',
    fullPage: false 
  });
  
  console.log('Screenshot saved as pixel-theme-screenshot.png');
  
  await browser.close();
})();