const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const username = process.env.GITLAB_USERNAME || 'BernardoQuina';
  const output = 'gitlab-contribs.png';

  // Navigate to your GitLab activity page
  const url = `https://gitlab.com/users/${username}/activity`;
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 400 });
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the contribution calendar to render (try both selectors, up to 60s)
  await page.waitForSelector(
    '[data-qa-selector="contrib_calendar"], .contrib-calendar', 
    { timeout: 60000 }
  );

  // Screenshot just the calendar element
  const cal = await page.$(
    '[data-qa-selector="contrib_calendar"], .contrib-calendar'
  );

  await cal.screenshot({ path: output });

  await browser.close();
  console.log(`Saved GitLab contributions to ${output}`);
})();
