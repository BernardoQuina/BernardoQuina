const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const username = process.env.GITLAB_USERNAME || 'BernardoQuina';
  const output = 'gitlab-contribs.png';

  // Navigate to your GitLab activity page
  const url = `https://gitlab.com/users/${username}`;
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 400 });
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait up to 60s for the calendar container
  await page.waitForSelector('.user-calendar', { timeout: 60000 });
  
  // Screenshot just the calendar container
  const cal = await page.$('.user-calendar');

  await cal.screenshot({ path: output });

  await browser.close();
  console.log(`Saved GitLab contributions to ${output}`);
})();
