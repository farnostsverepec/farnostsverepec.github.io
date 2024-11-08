const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const path = require('path');

const DESCRIPTION = "Farský kostol Najsvätejšej Trojice v obci Sverepec je jej hlavnou dominantou. Jeho základný kameň požehnal papež Ján Pavol II. 20. 4. 1990, počas svojej návštevy v Bratislave. Kostol bol postavený z iniciatívy dekana Pavla Trnku, ktorý takto naplnil túžbu obyvateľov obce mať svoj vlastný kostol. Vďaka patrí aj všetkým ostatným rodákom, živým a dnes už aj mŕtvym, ktorí pomáhali pri jeho výstavbe prácou a finančne. Kostol Najsvätejšej Trojice vysvätil dňa 26. mája 2002 Ján Chryzostom kardinál Korec, nitriansky biskup.",
      TITLE = "Farnosť Sverepec",
      IMAGE = "https://farnostsverepec.github.io/KostolSverepec.jpg";

const routes = [
    {
        path: '/',
        canonical: 'https://farnostsverepec.github.io/'
    },
    {
        path: '/oFarnosti',
        canonical: 'https://farnostsverepec.github.io/oFarnosti'
    },
    {
        path: '/404',
        canonical: 'https://farnostsverepec.github.io/404'
    },
    {
        path: '/farskeOznamy',
        canonical: 'https://farnostsverepec.github.io/farskeOznamy'
    },
    {
        path: '/aktuality',
        canonical: 'https://farnostsverepec.github.io/aktuality'
    },
    {
        path: '/fotogaleria',
        canonical: 'https://farnostsverepec.github.io/fotogaleria'
    },
    {
        path: '/kontakty',
        canonical: 'https://farnostsverepec.github.io/kontakty'
    }
];

async function prerender() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const route of routes) {
        const fileName = route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`;
        const filePath = path.join(__dirname, 'build', fileName);

        // Create directory if it doesn't exist
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });

        // Load the page
        const fullUrl = `file://${path.join(__dirname, 'build', 'index.html')}`;
        await page.goto(fullUrl);
        await page.waitForSelector('#root');

        // Inject meta tags
        await page.evaluate(({ canonical, title, description, image }) => {
            // Set title
            document.title = title;

            // Set description
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = 'description';
                document.head.appendChild(metaDescription);
            }
            metaDescription.content = description;

            // Set Open Graph meta tags
            const ogTags = {
                'og:title': title,
                'og:description': description,
                'og:image': image,
                'og:url': canonical,
                'og:type': 'website'
            };

            for (const [property, content] of Object.entries(ogTags)) {
                let ogTag = document.querySelector(`meta[property="${property}"]`);
                if (!ogTag) {
                    ogTag = document.createElement('meta');
                    ogTag.setAttribute('property', property);
                    document.head.appendChild(ogTag);
                }
                ogTag.content = content;
            }

            // Set Twitter meta tags
            const TwitterTags = {
                'twitter:title': title,
                'twitter:description': description,
                'twitter:image': image,
                'twitter:card': 'summary_large_image'
            };

            for (const [property, content] of Object.entries(TwitterTags)) {
                let twitterTag = document.querySelector(`meta[name="${property}"]`);
                if (!twitterTag) {
                    twitterTag = document.createElement('meta');
                    twitterTag.setAttribute('name', property);
                    document.head.appendChild(twitterTag);
                }
                twitterTag.content = content;
            }

            // Set theme-color meta tag
            let themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (!themeColorMeta) {
                themeColorMeta = document.createElement('meta');
                themeColorMeta.name = 'theme-color';
                document.head.appendChild(themeColorMeta);
            }
            themeColorMeta.content = '#0F0F0F';

            // Set canonical URL
            let canonicalLink = document.querySelector('link[rel="canonical"]');
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.rel = 'canonical';
                document.head.appendChild(canonicalLink);
            }
            canonicalLink.href = canonical;

            // Set robots meta tag
            let robots = document.querySelector('meta[name="robots"]');
            if (!robots) {
                robots = document.createElement('meta');
                robots.name = 'robots';
                document.head.appendChild(robots);
            }
            robots.content = 'index, follow';

            // Apply stylesheet link
            let stylesheetLink = document.querySelector('link[href="/index.css"]');
            if (!stylesheetLink) {
                stylesheetLink = document.createElement('link');
                stylesheetLink.rel = 'stylesheet';
                stylesheetLink.href = '/index.css';
                document.head.appendChild(stylesheetLink);
            }

            document.documentElement.setAttribute('data-location', new URL(canonical).pathname.replace(/(?<!^)\/$/, ''));
        }, { canonical: route.canonical, title: TITLE, description: DESCRIPTION, image: IMAGE });

        const html = await page.content();
        await fs.writeFile(filePath, html);
    }

    // Generate sitemap.xml
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${route.canonical}</loc>
    <changefreq>weekly</changefreq>
  </url>`).join('\n')}
</urlset>`;

    await fs.writeFile(path.join(__dirname, 'build', 'sitemap.xml'), sitemapContent);

    await browser.close();
}

prerender().catch(console.error);