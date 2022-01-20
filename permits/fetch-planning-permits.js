// npm install puppeteer
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs');

const downloadFile = (async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
});

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--start-maximized' // you can also use '--start-fullscreen'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});
  await page.goto('https://aca-prod.accela.com/alameda/Default.aspx');
  // await page.screenshot({ path: 'page1.png' });
  const [searchApplicationsLink] = await page.$x("//a[contains(., 'Search Applications')]");
  await Promise.all([
    page.waitForNavigation(),
    searchApplicationsLink.click()
  ])
  // await page.screenshot({ path: 'page2.png' });

  // NOTE: disabling this so we can instead get all the permits, not just Planning ones
  // await page.select('#ctl00_PlaceHolderMain_generalSearchForm_ddlGSPermitType', 'Planning/Pre-Application/NA/NA'),

  // await page.screenshot({ path: 'page2b.png' });
  await page.waitForTimeout(500)
  await page.click('#ctl00_PlaceHolderMain_btnNewSearch')
  await page.waitForTimeout(2000)
  // await page.screenshot({ path: 'page3.png' });
  await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './'});
  const [downloadLink] = await page.$x("//a[contains(., 'Download results')]");
  await downloadLink.click()
  await page.waitForTimeout(5000)
  await browser.close()
})();