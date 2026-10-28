import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';

const output = resolve('artifacts/verification');
const axeSource = await readFile(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const systemChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const chromePath = process.env.CHROME_PATH || (process.platform === 'win32' && existsSync(systemChrome) ? systemChrome : undefined);

test('Landing: production browser verification', { timeout: 180_000 }, async (suite) => {
  await mkdir(output, { recursive: true });
  const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
  const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const errors = [];
  const failures = [];
  const metrics = [];
  const open = async (viewport = { width: 1440, height: 1000 }, options = {}) => {
    const context = await browser.newContext({ viewport, ...options });
    await context.addInitScript(() => {
      window.__openedUrls = [];
      window.open = (address) => { window.__openedUrls.push(String(address)); return null; };
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    return { page, context };
  };
  const subtest = async (name, run) => suite.test(name, run);
  try {
    await subtest('all local links, image files and semantic structure', async () => {
      const { page, context } = await open();
      try {
        const result = await page.evaluate(async () => {
          document.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
          await Promise.all([...document.images].map((image) => image.decode()));
          const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
          return {
            headings: document.querySelectorAll('h1').length,
            sections: document.querySelectorAll('main > section').length,
            footerOutsideMain: !document.querySelector('main footer'),
            duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
            brokenLinks: [...document.querySelectorAll('a[href^="#"], use[href^="#"]')].map((a) => a.getAttribute('href')).filter((href) => !document.getElementById(href.slice(1))),
            imagesValid: [...document.images].every((image) => image.naturalWidth > 0 && image.alt.trim()),
            unlabeledFields: [...document.querySelectorAll('input, select, textarea')].filter((field) => !field.labels.length).length,
            language: document.documentElement.lang,
          };
        });
        assert.equal(result.headings, 1);
        assert.equal(result.sections, 8);
        assert.equal(result.footerOutsideMain, true);
        assert.deepEqual(result.duplicateIds, []);
        assert.deepEqual(result.brokenLinks, []);
        assert.equal(result.imagesValid, true);
        assert.equal(result.unlabeledFields, 0);
        assert.equal(result.language, 'es');
      } finally { await context.close(); }
    });

    await subtest('privacy notice page loads and links back', async () => {
      const { page, context } = await open();
      try {
        await page.locator('.footer-bottom a[href$="aviso-de-privacidad.html"]').click();
        await page.waitForLoadState('networkidle');
        assert.equal(await page.locator('h1').textContent(), 'Aviso de privacidad');
        assert.equal(await page.locator('a[href="mailto:axelcernas@gmail.com"]').count() > 0, true);
        assert.equal(await page.locator('.brand-logo img').evaluate((image) => image.naturalWidth > 0), true);
      } finally { await context.close(); }
    });

    await subtest('desktop navigation and visible keyboard focus', async () => {
      const { page, context } = await open();
      try {
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.skip-link').evaluate((element) => element === document.activeElement && element.matches(':focus-visible')), true);
        await page.locator('#site-nav a[href="#modalidades"]').click();
        assert.ok(page.url().endsWith('#modalidades'));
        assert.equal(await page.locator('.modality').count(), 2);
      } finally { await context.close(); }
    });

    await subtest('mobile touch menu, anchor closing and Escape focus', async () => {
      const { page, context } = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
      try {
        const toggle = page.locator('.menu-toggle');
        await toggle.tap();
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        assert.equal(await page.locator('body').evaluate((element) => element.classList.contains('nav-open')), true);
        await page.locator('#site-nav a[href="#modalidades"]').tap();
        assert.ok(page.url().endsWith('#modalidades'));
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        await page.evaluate(() => window.scrollTo(0, 0));
        await toggle.tap();
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(await toggle.evaluate((element) => element === document.activeElement), true);
      } finally { await context.close(); }
    });

    await subtest('FAQ initial state, one answer at a time, keyboard and resizing', async () => {
      const { page, context } = await open();
      try {
        assert.equal(await page.locator('.faq-trigger[aria-expanded="true"]').count(), 0);
        await page.locator('#faq-trigger-1').click();
        assert.equal(await page.locator('#faq-panel-1').evaluate((panel) => panel.inert), false);
        assert.equal(await page.locator('#faq-trigger-1').getAttribute('aria-expanded'), 'true');
        await page.locator('#faq-trigger-2').click();
        assert.equal(await page.locator('.faq-trigger[aria-expanded="true"]').count(), 1);
        assert.equal(await page.locator('#faq-panel-1').evaluate((panel) => panel.inert), true);
        await page.keyboard.press('ArrowDown');
        assert.equal(await page.locator('#faq-trigger-3').evaluate((element) => element === document.activeElement), true);
        await page.keyboard.press('Home');
        assert.equal(await page.locator('#faq-trigger-1').evaluate((element) => element === document.activeElement), true);
        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForTimeout(450);
        const height = await page.locator('#faq-panel-2').evaluate((panel) => ({ height: parseFloat(panel.style.maxHeight), content: panel.scrollHeight }));
        assert.ok(height.height >= height.content - 1);
        await page.locator('#faq-trigger-2').click();
        assert.equal(await page.locator('.faq-trigger[aria-expanded="true"]').count(), 0);
      } finally { await context.close(); }
    });

    await subtest('contact destinations and WhatsApp messages', async () => {
      const { page, context } = await open();
      try {
        assert.equal(await page.locator('[data-contact="phone"]').getAttribute('href'), 'tel:+523122281628');
        assert.equal(await page.locator('[data-contact="email"] a').getAttribute('href'), 'mailto:axelcernas@gmail.com');
        assert.equal(await page.locator('[data-contact="instagram"]').getAttribute('href'), 'https://www.instagram.com/danthe_axel_/');
        const links = await page.locator('[data-whatsapp]').evaluateAll((anchors) => anchors.map((a) => ({ href: a.href, message: a.dataset.whatsappMessage, target: a.target, rel: a.rel })));
        assert.ok(links.length >= 5);
        for (const link of links) {
          const destination = new URL(link.href);
          assert.equal(destination.origin + destination.pathname, 'https://wa.me/523122281628');
          assert.ok(destination.searchParams.get('text').length > 10);
          if (link.message) assert.equal(destination.searchParams.get('text'), link.message);
          assert.equal(link.target, '_blank');
          assert.ok(link.rel.includes('noreferrer'));
        }
      } finally { await context.close(); }
    });

    await subtest('form rejects missing and invalid data', async () => {
      const { page, context } = await open();
      try {
        await page.locator('#contact-form').evaluate((form) => form.requestSubmit());
        assert.deepEqual(await page.evaluate(() => window.__openedUrls), []);
        await page.locator('#contact-name').fill('Ana');
        await page.locator('#contact-message').fill('Mejorar mi rendimiento');
        await page.locator('#contact-form').evaluate((form) => form.requestSubmit());
        assert.deepEqual(await page.evaluate(() => window.__openedUrls), []);
      } finally { await context.close(); }
    });

    await subtest('form rejects whitespace-only name or objective', async () => {
      const { page, context } = await open();
      try {
        await page.locator('#contact-name').fill('   ');
        await page.locator('#contact-mode').selectOption('Online');
        await page.locator('#contact-message').fill('   ');
        await page.locator('#contact-form').evaluate((form) => form.requestSubmit());
        assert.deepEqual(await page.evaluate(() => window.__openedUrls), []);
      } finally { await context.close(); }
    });

    await subtest('valid form prepares Unicode-safe message with popup fallback', async () => {
      const { page, context } = await open();
      try {
        await page.locator('#contact-name').fill('  Ana Núñez  ');
        await page.locator('#contact-mode').selectOption('Online');
        await page.locator('#contact-message').fill('  Fuerza & hábitos, 3 días/semana  ');
        await page.locator('.form-submit').click();
        const addresses = await page.evaluate(() => window.__openedUrls);
        assert.equal(addresses.length, 1);
        const destination = new URL(addresses[0]);
        assert.equal(destination.pathname, '/523122281628');
        const message = destination.searchParams.get('text');
        assert.ok(message.includes('Nombre: Ana Núñez\n'));
        assert.ok(message.endsWith('Objetivo: Fuerza & hábitos, 3 días/semana'));
        assert.equal(await page.locator('#contact-status a').getAttribute('href'), addresses[0]);
        assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      } finally { await context.close(); }
    });

    await subtest('continuous passage, pause control, hover pause and seamless loop', async () => {
      const { page, context } = await open();
      try {
        const passage = page.locator('[data-cases-marquee]');
        const toggle = page.locator('[data-cases-pause]');
        await passage.scrollIntoViewIfNeeded();
        assert.equal(await passage.locator('.case-study').count(), 6);
        assert.equal(await passage.locator('.cases-grid[aria-hidden="true"]').evaluate((group) => group.inert), true);
        assert.equal(await toggle.isVisible(), true);
        const progress = () => passage.locator('.cases-runway').evaluate((element) => element.getAnimations()[0].currentTime);
        const before = await progress();
        await page.waitForTimeout(200);
        assert.ok(await progress() > before + 100);
        await passage.hover();
        const hovered = await progress();
        await page.waitForTimeout(200);
        assert.ok(await progress() - hovered < 20, 'hover should pause the passage');
        await page.mouse.move(0, 0);
        await toggle.click();
        assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
        assert.equal(await toggle.textContent().then((text) => text.trim()), 'Reanudar casos');
        await page.mouse.move(0, 0);
        const paused = await progress();
        await page.waitForTimeout(200);
        assert.ok(await progress() - paused < 20, 'button should pause the passage');
        await toggle.click();
        assert.equal(await toggle.getAttribute('aria-pressed'), 'false');
        await page.mouse.move(0, 0);
        await page.locator('#preguntas').scrollIntoViewIfNeeded();
        const afterScroll = await progress();
        await page.waitForTimeout(200);
        assert.ok(await progress() > afterScroll + 100);
        const gap = await passage.evaluate((element) => {
          const runway = element.querySelector('.cases-runway');
          const animation = runway.getAnimations()[0];
          const time = animation.currentTime;
          animation.pause();
          animation.currentTime = 0;
          const start = runway.children[0].children[0].getBoundingClientRect().left;
          animation.currentTime = animation.effect.getTiming().duration - 0.01;
          const end = runway.children[1].children[0].getBoundingClientRect().left;
          animation.currentTime = time;
          animation.play();
          return Math.abs(start - end);
        });
        assert.ok(gap < 1, `Loop discontinuity: ${gap}px`);
      } finally { await context.close(); }
    });

    for (const width of [320, 390, 768, 1024, 1440]) {
      await subtest(`responsive layout and body scale at ${width}px`, async () => {
        const { page, context } = await open({ width, height: 1000 });
        try {
          const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth, body: getComputedStyle(document.querySelector('.hero-description')).fontSize, input: getComputedStyle(document.querySelector('#contact-name')).fontSize }));
          metrics.push({ viewport: width, ...dimensions });
          assert.ok(dimensions.content <= dimensions.width + 1, JSON.stringify(dimensions));
          assert.equal(dimensions.body, '16px');
          assert.equal(dimensions.input, '16px');
          if (width === 390 || width === 1440) {
            await page.evaluate(async () => {
              for (const image of document.images) image.loading = 'eager';
              await Promise.all([...document.images].map((image) => image.decode()));
            });
            for (const element of await page.locator('[data-reveal]').all()) await element.evaluate((node) => node.classList.add('is-visible'));
            await page.screenshot({ path: resolve(output, `page-${width}.png`), fullPage: true, animations: 'disabled' });
            await page.locator('#preguntas').screenshot({ path: resolve(output, `faq-${width}.png`), animations: 'disabled' });
          }
        } finally { await context.close(); }
      });
    }

    await subtest('200% text scaling at mobile and desktop', async () => {
      for (const width of [390, 1440]) {
        const { page, context } = await open({ width, height: 1000 });
        try {
          await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
          const dimensions = await page.evaluate(() => ({ viewport: innerWidth, client: document.documentElement.clientWidth, content: document.documentElement.scrollWidth, offenders: [...document.querySelectorAll('body *')].filter((element) => !element.closest('.cases-marquee, .icon-sprite') && getComputedStyle(element).visibility !== 'hidden' && element.getBoundingClientRect().right > innerWidth + 1).slice(0, 10).map((element) => `${element.tagName}.${element.className?.baseVal ?? element.className}`) }));
          assert.ok(dimensions.content <= dimensions.client + 1, JSON.stringify(dimensions));
        } finally { await context.close(); }
      }
    });

    await subtest('reduced motion: static cards, one readable copy and closed FAQ', async () => {
      const { page, context } = await open({ width: 390, height: 844 }, { reducedMotion: 'reduce' });
      try {
        assert.equal(await page.locator('.cases-marquee').evaluate((element) => element.classList.contains('is-moving')), false);
        assert.equal(await page.locator('.cases-grid[aria-hidden="true"]').isVisible(), false);
        assert.equal(await page.locator('[data-cases-pause]').isVisible(), false);
        assert.equal(await page.locator('.faq-trigger[aria-expanded="true"]').count(), 0);
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.waitForTimeout(80);
        assert.equal(await page.locator('.cases-marquee').evaluate((element) => element.classList.contains('is-moving')), true);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForTimeout(80);
        assert.equal(await page.locator('.cases-marquee').evaluate((element) => element.classList.contains('is-moving')), false);
      } finally { await context.close(); }
    });

    await subtest('SEO metadata, social preview and favicons', async () => {
      const { page, context } = await open();
      try {
        const meta = await page.evaluate(() => {
          const value = (selector) => document.querySelector(selector)?.getAttribute('content') ?? document.querySelector(selector)?.getAttribute('href');
          let structured = null;
          try { structured = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent); } catch { structured = null; }
          return {
            title: document.title,
            description: value('meta[name="description"]'),
            canonical: value('link[rel="canonical"]'),
            ogImage: value('meta[property="og:image"]'),
            ogUrl: value('meta[property="og:url"]'),
            twitterCard: value('meta[name="twitter:card"]'),
            structuredType: structured?.['@type'],
            structuredPhone: structured?.telephone,
            icons: [...document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')].map((link) => link.href),
          };
        });
        assert.ok(meta.title.includes('Colima'));
        assert.ok(meta.description.length >= 70 && meta.description.length <= 170, `description length ${meta.description.length}`);
        for (const absolute of [meta.canonical, meta.ogImage, meta.ogUrl]) assert.match(absolute, /^https:\/\//);
        assert.equal(meta.twitterCard, 'summary_large_image');
        assert.equal(meta.structuredType, 'ProfessionalService');
        assert.equal(meta.structuredPhone, '+52 312 228 1628');
        assert.ok(meta.icons.length >= 4);
        for (const asset of [...meta.icons, `${url}og-image.jpg`]) {
          const response = await page.request.get(asset);
          assert.equal(response.status(), 200, asset);
          assert.match(response.headers()['content-type'], /^image\//, asset);
        }
      } finally { await context.close(); }
    });

    for (const [name, path] of [['home', ''], ['privacy notice', 'aviso-de-privacidad.html']]) {
      for (const width of [390, 1440]) {
        await subtest(`axe-core accessibility audit: ${name} at ${width}px`, async () => {
          const { page, context } = await open({ width, height: 900 });
          try {
            if (path) await page.goto(`${url}${path}`, { waitUntil: 'networkidle' });
            // Audit the settled page: the hero fades in, and mid-fade text is semi-transparent.
            await page.evaluate(() => Promise.all(document.getAnimations()
              .filter((animation) => animation.effect?.getTiming().iterations !== Infinity)
              .map((animation) => animation.finished)));
            await page.addScriptTag({ content: axeSource });
            const violations = await page.evaluate(async () => {
              const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } });
              return result.violations.map((violation) => `${violation.id} (${violation.impact}): ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`);
            });
            assert.deepEqual(violations, []);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
          } finally { await context.close(); }
        });
      }
    }

    await subtest('keyboard reaches every control in order, including the form submit', async () => {
      const { page, context } = await open();
      try {
        const reached = [];
        for (let index = 0; index < 40; index += 1) {
          await page.keyboard.press('Tab');
          reached.push(await page.evaluate(() => document.activeElement.matches('.form-submit') ? 'submit' : document.activeElement.id || document.activeElement.tagName));
          if (reached.at(-1) === 'submit') break;
        }
        assert.equal(reached.at(-1), 'submit', reached.join(' > '));
        assert.ok(reached.indexOf('contact-name') < reached.indexOf('contact-mode') && reached.indexOf('contact-mode') < reached.indexOf('contact-message'));
      } finally { await context.close(); }
    });

    await subtest('floating WhatsApp button only on desktop and current footer year', async () => {
      const desktop = await open({ width: 1440, height: 900 });
      const mobile = await open({ width: 390, height: 844 });
      try {
        assert.equal(await desktop.page.locator('.whatsapp-float').isVisible(), true);
        assert.equal(await mobile.page.locator('.whatsapp-float').isVisible(), false);
        assert.equal(await desktop.page.locator('[data-current-year]').textContent(), String(new Date().getFullYear()));
      } finally { await desktop.context.close(); await mobile.context.close(); }
    });

    await subtest('mobile image weight stays within budget', async () => {
      const { page, context } = await open({ width: 390, height: 844 }, { deviceScaleFactor: 3 });
      try {
        const images = await page.evaluate(async () => {
          const all = [...document.images];
          all.forEach((image) => { image.loading = 'eager'; });
          await Promise.all(all.map((image) => image.decode().catch(() => null)));
          const sizes = new Map(performance.getEntriesByType('resource')
            .filter((entry) => /\.(webp|jpe?g|png|avif)(\?|$)/.test(entry.name))
            .map((entry) => [entry.name, entry.encodedBodySize]));
          return { bytes: [...sizes.values()].reduce((total, size) => total + size, 0), files: sizes.size, hero: document.querySelector('.hero-photo img').currentSrc };
        });
        const kb = Math.round(images.bytes / 1024);
        metrics.push({ mobileImageKB: kb, mobileImageFiles: images.files });
        assert.ok(images.files >= 10, `only ${images.files} images measured`);
        assert.ok(kb <= 1000, `images weigh ${kb} KB on a 3x phone (budget 1000 KB)`);
        assert.match(images.hero, /hero-coaching/);
      } finally { await context.close(); }
    });

    await subtest('works without JavaScript: visible menu, direct WhatsApp links, no form data in the URL', async () => {
      const { page, context } = await open({ width: 390, height: 844 }, { javaScriptEnabled: false });
      try {
        assert.equal(await page.locator('.menu-toggle').isVisible(), false);
        assert.equal(await page.locator('#site-nav a[href="#casos"]').isVisible(), true);
        assert.equal(await page.locator('#contact-form').isVisible(), false);
        const hrefs = await page.locator('[data-whatsapp]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
        assert.ok(hrefs.length >= 5);
        for (const href of hrefs) assert.match(href, /^https:\/\/wa\.me\/523122281628\?text=/);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
      } finally { await context.close(); }
    });

    await subtest('double submit opens WhatsApp only once', async () => {
      const { page, context } = await open();
      try {
        await page.locator('#contact-name').fill('Ana');
        await page.locator('#contact-mode').selectOption('Online');
        await page.locator('#contact-message').fill('Fuerza');
        await page.locator('#contact-form').evaluate((form) => { form.requestSubmit(); form.requestSubmit(); });
        assert.equal((await page.evaluate(() => window.__openedUrls)).length, 1);
      } finally { await context.close(); }
    });

    await subtest('no JavaScript errors or HTTP failures', () => {
      assert.deepEqual(errors, []);
      assert.deepEqual(failures, []);
    });
  } finally {
    await writeFile(resolve(output, 'browser-results.json'), JSON.stringify({ browser: browser.version(), errors, failures, metrics }, null, 2));
    await browser.close();
    await new Promise((done) => server.httpServer.close(done));
  }
});
