const puppeteer = require('puppeteer');

const URL_REPO = 'https://github.com/Taller-de-Programacion-1-1C2024-GRUPO1/TP-Jazz-Jackrabbit-2/releases/';
const TAG = 'a'
const ZIP = 'zip'

async function setDriver() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(URL_REPO, { waitUntil: 'networkidle2' });
    return { browser, page };
}

async function getLatestVersion() {
    const { browser, page } = await setDriver();
    // loop that waits for the first release to load in the github page (releases are loaded asynchronously)
    const latestVersion = await page.evaluate(() => {
        const links = document.querySelectorAll(TAG);
        for (let link of links) {
            if (link.href.includes(ZIP)) {
                return link.href;
            }
        }
        return null;
    });
    await browser.close();
    return latestVersion;
}

// Function to update the INSTALL button's href attribute
async function updateInstallButton() {
    const installButton = document.getElementById('install');
    try {
        const latestReleaseUrl = await fetchLatestGameRelease();
        installButton.href = latestReleaseUrl;
    } catch (error) {
        console.error('Error fetching the latest game release URL:', error);
    }
}
/*
// Call the function to update the INSTALL button on page load
document.addEventListener('DOMContentLoaded', updateInstallButton);
*/
