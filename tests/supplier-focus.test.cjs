const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'translations.js'), 'utf8'), context);
test('supplier hero prioritizes contact and states development status in every language', () => {
  const hero = html.split('id="hero"')[1].split('</section>')[0];
  assert.match(hero, /href="#kontakt" class="btn btn-primary"/);
  assert.match(hero, /data-i18n="supplier.status"/);
  for (const lang of ['de', 'en', 'fr']) {
    for (const key of ['supplier.status', 'supplier.lead', 'supplier.contact', 'supplier.trust']) {
      assert.ok(context.window.PUDADO_I18N[lang][key], `${lang}:${key}`);
    }
  }
});
test('curated product visuals, second film retained and no removed modules restored', () => {
  const imageSources = [...html.matchAll(/<img src="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(imageSources, ['assets/ecobum-prototype02-bathroom.jpg', 'assets/ecobum-product-studio.webp', 'assets/ecobum-set-studio.webp', 'assets/ecobum-connection-studio.webp']);
  imageSources.forEach(source => assert.ok(fs.existsSync(path.join(root, source)), source));
  const hero = html.split('id="hero"')[1].split('</section>')[0];
  const imageSource = hero.match(/<img src="([^"]+)"/)[1];
  assert.ok(fs.existsSync(path.join(root, imageSource)), 'hero image exists locally');
  assert.match(html, /ecobum-ad-02.webm/);
  assert.doesNotMatch(html, /id="checker"|id="how"|ecobum-ad-01/);
});
