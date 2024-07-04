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

document.getElementById('install').addEventListener('click', async () => {
    try {
        const downloadLink = await getLatestVersion();
        if (downloadLink) {
            window.location.href = downloadLink; // Esto redirige el navegador al enlace de descarga
        } else {
            alert('No se encontró la última versión.');
        }
    } catch (error) {
        console.error('Error al obtener la última versión:', error);
        alert('Hubo un error al intentar obtener la última versión.');
    }
})