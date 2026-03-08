import { URL } from 'url';

export async function getInternalLinks(page, baseUrl, limit = 5) {
    try {
        const urlObj = new URL(baseUrl);
        const domain = urlObj.hostname;

        const links = await page.evaluate((domain, baseUrl) => {
            const currentUrl = new URL(baseUrl);
            return Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => {
                    try {
                        const url = new URL(href);
                        // Only same hostname, not the same page, no fragments
                        const isSameHost = url.hostname === domain;
                        const isNotSamePage = url.origin + url.pathname !== currentUrl.origin + currentUrl.pathname;
                        const isNotFragment = !href.includes('#');
                        const isNotSpecial = !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:');

                        return isSameHost && isNotSamePage && isNotFragment && isNotSpecial;
                    } catch (e) {
                        return false;
                    }
                });
        }, domain, baseUrl);

        // De-duplicate and filter common non-page paths
        const uniqueLinks = [...new Set(links)]
            .filter(l => !/\.(pdf|jpg|jpeg|png|gif|svg|zip|doc|docx|xls|xlsx|ppt|pptx|webp|mp4|webm)$/i.test(l))
            .filter(l => !l.includes('login') && !l.includes('signup') && !l.includes('register')) // Skip auth pages usually
            .slice(0, limit);

        return uniqueLinks;
    } catch (e) {
        console.error('Crawler Error:', e);
        return [];
    }
}
