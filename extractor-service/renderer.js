import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function launchBrowser() {
    const isProduction = process.env.NODE_ENV === 'production';

    return await puppeteer.launch({
        headless: true,
        // In local Windows dev, we used a hardcoded path. In production, we omit it
        // so puppeteer uses the installed chrome in the Docker container.
        ...(isProduction ? {} : { executablePath: 'C:\\Users\\Manoj\\.cache\\puppeteer\\chrome\\win64-145.0.7632.77\\chrome-win64\\chrome.exe' }),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    });
}

export async function setupPage(browser) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    // Intercept and block heavy media assets only
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['media', 'video', 'websocket'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });

    return page;
}

export async function navigate(page, url) {
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (e) {
        if (e.name === 'TimeoutError') {
            console.log(`[Timeout] ${url} failed networkidle2, falling back to domcontentloaded...`);
            // The page might still be loading, we can just proceed with what we have, 
            // but puppeteer might have thrown. If it threw, we navigate again with domcontentloaded
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } else {
            throw e;
        }
    }

    // Wait for CSS animations/transitions and any JS-driven style initialization to settle
    await new Promise(r => setTimeout(r, 800));
}
