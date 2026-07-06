/* =============================================================
   Pudado · EcoBum — script.js
   Vanilla JavaScript. Kein Framework, keine externen Abhängigkeiten.
   Enthält:
   1. Mobile-Navigation (Hamburger)
   2. Footer-Jahr
   3. Toilettenpapier-Rechner
   4. Kontakt- & Newsletter-Formular (Demo, ohne Backend)
   5. DSGVO-/TDDDG-freundliche Cookie-Consent-Logik
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Jede Funktion einzeln absichern: Ein Fehler in einem Modul darf
  // die anderen (z. B. das Cookie-Banner) nicht blockieren.
  // initI18n zuerst, damit alle Texte in der richtigen Sprache stehen.
  [initI18n, initNav, initYear, initCalculator, initChecker, initImagePreview,
   initGallery, initContactForm, initNewsletterForm, initStickyCta, initCookieConsent,
   initScrollSpy, initReveal, initBrandVideo]
    .forEach(fn => { try { fn(); } catch (err) { console.error('Init-Fehler:', err); } });
});

/* -------------------------------------------------------------
   0. MEHRSPRACHIGKEIT (DE / EN / FR)
   Wörterbuch: translations.js (window.PUDADO_I18N)
   Auswahl wird in localStorage gespeichert.
   ------------------------------------------------------------- */
const LANG_KEY = 'pudado_lang';
window.PUDADO_LANG = 'de';
// Ursprünglicher <title> aus index.html (SEO-optimiert). Wird für die
// Standardsprache (de) beibehalten statt durch die kürzere Marketing-
// Variante aus translations.js überschrieben; nur bei echtem Wechsel
// auf en/fr wird ein übersetzter Titel gesetzt.
const DEFAULT_TITLE = document.title;

function t(key) {
  const dict = (window.PUDADO_I18N || {});
  const lang = window.PUDADO_LANG || 'de';
  return (dict[lang] && dict[lang][key]) || (dict.de && dict.de[key]) || key;
}

function applyLanguage(lang) {
  const dict = window.PUDADO_I18N || {};
  if (!dict[lang]) lang = 'de';
  window.PUDADO_LANG = lang;

  document.documentElement.lang = lang;
  if (lang === 'de') {
    document.title = DEFAULT_TITLE;
  } else if (dict[lang]['meta.title']) {
    document.title = dict[lang]['meta.title'];
  }

  // Textinhalte
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = dict[lang][el.getAttribute('data-i18n')];
    if (val != null) el.textContent = val;
  });
  // Platzhalter (dient hier zugleich als aria-label, da diese Felder kein sichtbares <label> haben)
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const val = dict[lang][el.getAttribute('data-i18n-ph')];
    if (val != null) {
      el.setAttribute('placeholder', val);
      el.setAttribute('aria-label', val);
    }
  });

  // aktive Sprach-Schaltfläche markieren
  document.querySelectorAll('#langSwitch button').forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-lang') === lang)
  );

  try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}

  // andere Module benachrichtigen (Rechner-Formatierung, Checker-Ergebnis)
  document.dispatchEvent(new CustomEvent('pudado:lang', { detail: { lang } }));
}

function initI18n() {
  let lang = 'de';
  try { lang = localStorage.getItem(LANG_KEY) || lang; } catch (_) {}
  const sw = document.getElementById('langSwitch');
  if (sw) {
    sw.querySelectorAll('button').forEach(btn =>
      btn.addEventListener('click', () => applyLanguage(btn.getAttribute('data-lang')))
    );
  }
  applyLanguage(lang);
}

/* -------------------------------------------------------------
   1. MOBILE-NAVIGATION
   ------------------------------------------------------------- */
function initNav() {
  const burger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (!burger || !nav) return;

  const toggle = (open) => {
    const isOpen = open !== undefined ? open : !nav.classList.contains('open');
    nav.classList.toggle('open', isOpen);
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? t('a11y.menu_close') : t('a11y.menu_open'));
  };

  burger.addEventListener('click', () => toggle());

  // Menü schließen, wenn ein Link geklickt wird
  nav.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => toggle(false))
  );
}

/* -------------------------------------------------------------
   2. FOOTER-JAHR
   ------------------------------------------------------------- */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------------
   3. TOILETTENPAPIER- & EINSPAR-KALKULATOR
   Modell auf Basis der Nutzereingaben. Alle Werte sind Schätzungen.
   Annahmen sind in der Methodik-Box ("So rechnen wir") transparent.
   Speichert Eingaben in localStorage, rechnet live, prüft Plausibilität.
   ------------------------------------------------------------- */
function initCalculator() {
  const form = document.getElementById('calcForm');
  if (!form) return;

  // Geprüfte Standardannahmen (Stand Juni 2026; Median aus dm/Rossmann/Aldi/Müller, 3-lagig)
  const SHEETS_PER_ROLL   = 200;   // Blätter pro Rolle (gerundeter Median)
  const DEFAULT_PRICE_ROLL = 0.36; // € pro Rolle (gerundeter Median regulärer Preise)
  const REDUCTION_FACTOR  = 0.50;  // Modellannahme – keine garantierte Wirkung

  const LOCALES = { de: 'de-DE', en: 'en-IE', fr: 'fr-FR' };
  const APPROX  = { de: 'ca.', en: 'approx.', fr: 'env.' };
  let nf0, euro, approx;
  function buildFormatters() {
    const lang = window.PUDADO_LANG || 'de';
    nf0   = new Intl.NumberFormat(LOCALES[lang] || 'de-DE', { maximumFractionDigits: 0 });
    euro  = new Intl.NumberFormat(LOCALES[lang] || 'de-DE', { style: 'currency', currency: 'EUR' });
    approx = APPROX[lang] || 'ca.';
  }
  buildFormatters();

  const $ = (id) => document.getElementById(id);
  function clamp(v, min, max, def) {
    if (!isFinite(v)) return def;
    return Math.min(max, Math.max(min, v));
  }
  function readNum(id, min, max, def) {
    const el = $(id);
    if (!el) return def;
    return clamp(parseFloat(String(el.value).replace(',', '.')), min, max, def);
  }

  function compute() {
    const persons   = clamp(Math.round(readNum('persons', 1, 10, 2)), 1, 10, 2);
    const rollsWeek = clamp(readNum('rollsWeek', 0.5, 30, 4), 0.5, 30, 4);
    const usage     = clamp(Math.round(readNum('usage', 0, 100, 70) / 10) * 10, 0, 100, 70);
    let priceRoll   = readNum('priceRoll', 0.05, 3, DEFAULT_PRICE_ROLL);
    if (!isFinite(priceRoll) || priceRoll <= 0) priceRoll = DEFAULT_PRICE_ROLL;

    const rollsYearNow  = rollsWeek * 52;
    const rollsMonthNow = rollsYearNow / 12;
    const sheetsYearNow = rollsYearNow * SHEETS_PER_ROLL;
    const costYearNow   = rollsYearNow * priceRoll;

    const reduction    = (usage / 100) * REDUCTION_FACTOR;
    const rollsYearEco = rollsYearNow * (1 - reduction);
    const rollsSaved   = Math.max(0, rollsYearNow - rollsYearEco);
    const sheetsSaved  = rollsSaved * SHEETS_PER_ROLL;
    const costYearEco  = rollsYearEco * priceRoll;
    const costDiff     = rollsSaved * priceRoll;

    return { persons, rollsWeek, usage, priceRoll, rollsYearNow, rollsMonthNow,
             sheetsYearNow, costYearNow, rollsYearEco, rollsSaved, sheetsSaved,
             costYearEco, costDiff };
  }

  const setTxt = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  const ca = (n) => approx + ' ' + nf0.format(Math.max(0, Math.round(n)));

  function render() {
    const r = compute();
    setTxt('usageVal', r.usage + ' %');
    // 4 Hauptergebnisse
    setTxt('rNow',  ca(r.rollsYearNow));
    setTxt('rEco',  ca(r.rollsYearEco));
    setTxt('rLess', ca(r.rollsSaved));
    setTxt('rCost', approx + ' ' + euro.format(Math.max(0, r.costDiff)));
    // Vergleichsbalken (gleiche Skala, Maximum = heutiger Verbrauch)
    const max = Math.max(r.rollsYearNow, 1);
    const ecoPct = Math.max(0, Math.min(100, (r.rollsYearEco / max) * 100));
    const bn = $('barNow'), be = $('barEco');
    if (bn) bn.style.width = '100%';
    if (be) be.style.width = ecoPct + '%';
    setTxt('barNowVal', nf0.format(Math.round(r.rollsYearNow)));
    setTxt('barEcoVal', nf0.format(Math.round(r.rollsYearEco)));
    // Weitere Ergebnisse (Akkordeon)
    setTxt('mRollsMonth', nf0.format(Math.round(r.rollsMonthNow)));
    setTxt('mPerPerson', nf0.format(Math.round(r.rollsYearNow / Math.max(1, r.persons))));
    setTxt('mSheetsYear', nf0.format(Math.round(r.sheetsYearNow)));
    setTxt('mSheetsLess', nf0.format(Math.round(r.sheetsSaved)));
    setTxt('mCostNow', euro.format(Math.max(0, r.costYearNow)));
    setTxt('mCostEco', euro.format(Math.max(0, r.costYearEco)));
  }

  // Stepper Personen
  const persInput = $('persons');
  function stepPersons(delta) {
    if (!persInput) return;
    persInput.value = clamp(Math.round(parseFloat(persInput.value) || 2) + delta, 1, 10, 2);
    render();
  }
  const pMinus = $('persMinus'), pPlus = $('persPlus');
  if (pMinus) pMinus.addEventListener('click', () => stepPersons(-1));
  if (pPlus)  pPlus.addEventListener('click', () => stepPersons(1));

  ['persons', 'rollsWeek', 'usage', 'priceRoll'].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener('input', render);
  });

  document.addEventListener('pudado:lang', () => { buildFormatters(); render(); });
  render();
}

/* -------------------------------------------------------------
   3b. EcoBum INSTALLATIONS-CHECKER (5 Schritte, Ampel)
   Score aus Fragen. Bilder bleiben lokal (siehe initImagePreview).
   ------------------------------------------------------------- */
function initChecker() {
  const root = document.getElementById('checker');
  if (!root) return;
  const btn = document.getElementById('chkBtn');
  const resultBox = document.getElementById('chkResult');
  const rTitle = document.getElementById('chkResultTitle');
  const rText = document.getElementById('chkResultText');
  const lists = {
    pro: document.getElementById('chkResultPro'),
    check: document.getElementById('chkResultCheck'),
    photos: document.getElementById('chkResultPhotos'),
    next: document.getElementById('chkResultNext')
  };
  const proBlock = document.getElementById('chkProBlock');
  const a = {}; // answers by data-q

  root.querySelectorAll('.chk-opts').forEach(group => {
    const q = group.getAttribute('data-q');
    group.querySelectorAll('button').forEach(opt => {
      opt.setAttribute('aria-pressed', 'false');
      opt.addEventListener('click', () => {
        group.querySelectorAll('button').forEach(b => { b.classList.remove('selected'); b.setAttribute('aria-pressed', 'false'); });
        opt.classList.add('selected'); opt.setAttribute('aria-pressed', 'true');
        a[q] = opt.getAttribute('data-val');
      });
    });
  });

  function evaluate() {
    const eck = a.eck || 'unsure', cistern = a.cistern || 'unsure', hose = a.hose || 'unsure',
          space = a.space || 'unsure', size = a.size || 'unsure', shutoff = a.shutoff || 'unsure';
    // Rot: kein Eckventil, Unterputz-Spülkasten, Wasser nicht abstellbar
    if (eck === 'no' || cistern === 'concealed' || shutoff === 'no') return 'red';
    // Grün: alle Kernbedingungen klar erfüllt
    if (eck === 'yes' && hose === 'yes' && cistern === 'visible' && space === 'yes'
        && (size === '38' || size === '12') && shutoff === 'yes') return 'green';
    // sonst Gelb
    return 'yellow';
  }

  function buildLists(score) {
    // Das spricht dafür (positive Signale)
    const pro = [];
    if (a.eck === 'yes') pro.push('chk.pro_eck');
    if (a.hose === 'yes') pro.push('chk.pro_hose');
    if (a.cistern === 'visible') pro.push('chk.pro_cistern');
    if (a.space === 'yes') pro.push('chk.pro_space');
    if (a.shutoff === 'yes') pro.push('chk.pro_shutoff');
    if (a.size === '38' || a.size === '12') pro.push('chk.pro_size');
    // Was du vor dem Kauf prüfen solltest
    const check = ['chk.r_check1', 'chk.r_check2', 'chk.r_check3'];
    if (a.hose === 'rigid') check.push('chk.r_check_hose');
    if (a.size === 'unsure') check.push('chk.r_check_size');
    if (a.space === 'little' || a.space === 'no') check.push('chk.r_check_space');
    if (a.shutoff !== 'yes') check.push('chk.r_check_shutoff');
    // Welche Fotos
    const photos = ['chk.up1', 'chk.up2', 'chk.up3', 'chk.up4'];
    // Nächste Schritte
    const next = [];
    if (score === 'green') next.push('chk.next_green');
    if (score === 'yellow') next.push('chk.next_yellow');
    if (score === 'red') next.push('chk.next_red');
    if (a.nodrill === 'yes' || a.glue === 'yes') next.push('chk.next_glue');
    next.push('chk.next_contact');
    return { pro, check, photos, next };
  }

  function fill(ul, keys) {
    if (!ul) return;
    ul.innerHTML = '';
    keys.forEach(k => { const li = document.createElement('li'); li.dataset.k = k; li.textContent = t(k); ul.appendChild(li); });
  }

  function render(score, sets) {
    resultBox.dataset.result = score;
    resultBox.classList.remove('green', 'yellow', 'red');
    resultBox.classList.add(score);
    rTitle.textContent = t('chk.s_' + score + '_t');
    rText.textContent = t('chk.s_' + score + '_d');
    fill(lists.pro, sets.pro);
    if (proBlock) proBlock.hidden = !(sets.pro && sets.pro.length);
    fill(lists.check, sets.check);
    fill(lists.photos, sets.photos);
    fill(lists.next, sets.next);
    resultBox.hidden = false;
  }

  // ---- Erweiterte Auswertung: Begründung, Anschlussweg, Teile, offene Punkte ----
  const el = (id) => document.getElementById(id);

  function buildWhy(score) {
    const keys = [];
    if (a.eck) keys.push('chk2.why_eck_' + (a.eck === 'yes' ? 'yes' : a.eck === 'no' ? 'no' : 'unsure'));
    if (a.hose) keys.push('chk2.why_hose_' + (a.hose === 'yes' ? 'yes' : a.hose === 'rigid' ? 'rigid' : 'unsure'));
    if (a.cistern === 'concealed') keys.push('chk2.why_cistern_concealed');
    if (a.dist) keys.push('chk2.why_dist_' + (['near', 'mid', 'far'].includes(a.dist) ? a.dist : 'unsure'));
    if (a.shutoff) keys.push('chk2.why_shutoff_' + (a.shutoff === 'yes' ? 'yes' : a.shutoff === 'no' ? 'no' : 'unsure'));
    if (a.glue === 'yes' || a.nodrill === 'yes') keys.push('chk2.why_mount_glue');
    else if (a.glue === 'no' && a.nodrill === 'no') keys.push('chk2.why_mount_drill');
    keys.push('chk2.why_concl_' + score);
    return keys;
  }

  function buildPath(score) {
    if (score === 'red') return { steps: [], note: 'chk2.path_red' };
    return { steps: ['chk2.path1', 'chk2.path2', 'chk2.path3', 'chk2.path4', 'chk2.path5'], note: 'chk2.path_note' };
  }

  function buildParts() {
    // Bestätigte EcoBum-Home-Set-Bestandteile (Lieferumfang) — „im Set enthalten“.
    // Der flexible Zulaufschlauch (set.l10) ist bereits regulärer Set-Bestandteil (kein
    // separater "möglicherweise zusätzlich nötig"-Eintrag mehr, um keine Dopplung zu
    // erzeugen). Ist die Anschlusssituation unklar/starr, wird nur sein Status auf
    // "manuell prüfen" gesetzt statt eine zweite Zeile für dieselbe Komponente zu zeigen.
    const hoseUnclear = a.hose === 'rigid' || a.hose === 'unsure' || !a.hose;
    const parts = ['set.l1', 'set.l2', 'set.l4', 'set.l7', 'set.l8', 'set.l9', 'set.l10', 'set.l11', 'set.l6']
      .map(k => ({ name: k, status: (k === 'set.l10' && hoseUnclear) ? 'chk2.manual' : 'chk2.in_set' }));
    return parts;
  }

  const hasPhotos = () => document.querySelectorAll('#checkerForm .chk-previews figure').length > 0;

  function buildOpen() {
    const o = [];
    if (!a.eck || a.eck === 'unsure') o.push('chk2.open_eck');
    if (a.cistern === 'concealed') o.push('chk2.open_cistern');
    if (a.hose === 'rigid') o.push('chk2.open_rigid');
    else if (!a.hose || a.hose === 'unsure') o.push('chk2.open_hose');
    if (!a.shutoff || a.shutoff === 'unsure') o.push('chk2.open_shutoff');
    if (!a.size || a.size === 'unsure') o.push('chk2.open_size');
    if (!a.dist || a.dist === 'unsure') o.push('chk2.open_dist');
    if (a.space === 'little' || a.space === 'no' || a.space === 'unsure' || !a.space) o.push('chk2.open_space');
    if (!a.glue && !a.nodrill) o.push('chk2.open_mount');
    if (!hasPhotos()) o.push('chk2.open_photo');
    return o;
  }

  function fillKeyed(parent, tag, keys) {
    if (!parent) return;
    parent.innerHTML = '';
    keys.forEach(k => { const node = document.createElement(tag); node.dataset.k = k; node.textContent = t(k); parent.appendChild(node); });
  }

  function renderExtended(score) {
    const why = buildWhy(score);
    if (el('chkWhyText')) el('chkWhyText').textContent = why.map(t).join(' ');
    if (el('chkWhyBlock')) el('chkWhyBlock').hidden = why.length === 0;

    const path = buildPath(score);
    fillKeyed(el('chkPathList'), 'li', path.steps);
    if (el('chkPathList')) el('chkPathList').hidden = path.steps.length === 0;
    if (el('chkPathNote')) { el('chkPathNote').dataset.k = path.note; el('chkPathNote').textContent = t(path.note); }
    if (el('chkPathBlock')) el('chkPathBlock').hidden = false;

    const partsList = el('chkPartsList');
    if (partsList) {
      partsList.innerHTML = '';
      buildParts().forEach(p => {
        const li = document.createElement('li');
        const name = document.createElement('span'); name.className = 'chk-part-name'; name.dataset.k = p.name; name.textContent = t(p.name);
        const badge = document.createElement('span');
        badge.className = 'chk-badge ' + (p.status === 'chk2.in_set' ? 'is-set' : p.status === 'chk2.maybe' ? 'is-maybe' : 'is-manual');
        badge.dataset.k = p.status; badge.textContent = t(p.status);
        li.appendChild(name); li.appendChild(badge); partsList.appendChild(li);
      });
    }
    if (el('chkPartsBlock')) el('chkPartsBlock').hidden = false;

    const open = buildOpen();
    fillKeyed(el('chkOpenList'), 'li', open.length ? open : ['chk2.open_none']);
    if (el('chkOpenBlock')) el('chkOpenBlock').hidden = false;
  }

  function run() {
    const score = evaluate();
    render(score, buildLists(score));
    renderExtended(score);
  }

  btn && btn.addEventListener('click', () => {
    run();
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Druck-Checkliste (statische Liste)
  const printBtn = document.getElementById('chkPrint');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  // Ergebnis-Pass drucken (saubere Druckansicht via window.print)
  const passPrint = el('chkPassPrint');
  if (passPrint) passPrint.addEventListener('click', () => {
    const dateEl = el('chkPassDate');
    if (dateEl) { const loc = { de: 'de-DE', en: 'en-IE', fr: 'fr-FR' }[window.PUDADO_LANG] || 'de-DE'; dateEl.textContent = new Date().toLocaleDateString(loc); }
    document.body.classList.add('print-pass');
    window.print();
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('print-pass'));

  // Bei Sprachwechsel: Ergebnis vollständig neu aufbauen (inkl. Erweiterungen)
  document.addEventListener('pudado:lang', () => {
    if (!resultBox.hidden) run();
  });
}

/* -------------------------------------------------------------
   3c. BILD-VORSCHAU (lokal, KEIN Upload)
   Zeigt gewählte Bilder als Vorschau mit Entfernen-Button.
   Dateien bleiben im Browser; Object-URLs werden wieder freigegeben.
   ------------------------------------------------------------- */
function initImagePreview() {
  document.querySelectorAll('.chk-file').forEach(input => {
    const target = document.getElementById(input.id.replace('File', 'Prev'));
    if (!target) return;
    const urls = [];
    input.addEventListener('change', () => {
      // alte Object-URLs freigeben
      urls.splice(0).forEach(u => URL.revokeObjectURL(u));
      target.innerHTML = '';
      const files = Array.from(input.files || []).filter(f => f.type.startsWith('image/'));
      files.forEach(file => {
        const url = URL.createObjectURL(file);
        urls.push(url);
        const fig = document.createElement('figure');
        fig.className = 'chk-thumb';
        const img = document.createElement('img');
        img.src = url; img.alt = file.name; img.loading = 'lazy';
        const rm = document.createElement('button');
        rm.type = 'button'; rm.className = 'chk-thumb-rm'; rm.setAttribute('aria-label', t('a11y.remove')); rm.textContent = '×';
        rm.addEventListener('click', () => { URL.revokeObjectURL(url); fig.remove(); });
        fig.appendChild(img); fig.appendChild(rm); target.appendChild(fig);
      });
    });
  });
}

/* -------------------------------------------------------------
   3e. LIFESTYLE-GALERIE
   Blendet die ganze Sektion aus, falls keine echten Fotos vorhanden
   sind (alle <figure> wurden per onerror entfernt). So bleibt die Seite
   sauber, solange noch keine assets/bath-*.jpg abgelegt wurden.
   ------------------------------------------------------------- */
function initGallery() {
  const grid = document.getElementById('lifestyleGallery');
  if (!grid) return;
  const section = document.getElementById('lifestyle');
  const check = () => { if (section && grid.querySelectorAll('figure').length === 0) section.hidden = true; };
  window.addEventListener('load', () => setTimeout(check, 100));
  setTimeout(check, 1800); // Fallback, falls 'load' bereits vorbei ist
}

/* -------------------------------------------------------------
   3d. STICKY MOBILE CTA
   Blendet die untere CTA-Leiste auf Mobil ein, sobald man am Hero
   vorbeigescrollt ist; blendet sie am Footer wieder aus.
   ------------------------------------------------------------- */
function initStickyCta() {
  const bar = document.getElementById('stickyCta');
  if (!bar) return;
  const hero = document.getElementById('hero');
  const footer = document.getElementById('footer');
  function update() {
    const y = window.scrollY || window.pageYOffset;
    const past = hero ? y > (hero.offsetTop + hero.offsetHeight - 120) : y > 400;
    const nearFooter = footer ? (y + window.innerHeight) > (footer.offsetTop + 40) : false;
    bar.classList.toggle('show', past && !nearFooter);
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* -------------------------------------------------------------
   4a. KONTAKTFORMULAR (Demo)
   WICHTIG: Es werden KEINE echten Daten gespeichert oder gesendet.
   TODO Backend: Hier später echten Endpoint anschließen, z. B.:
     - fetch('/api/contact', { method:'POST', body: JSON.stringify(data) })
     - oder einen Formulardienst (Formspree, Brevo, Mailjet ...)
   ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const msg = document.getElementById('contactMsg');
  const consent = document.getElementById('cConsent');

  const honeypot = document.getElementById('cHp');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot: ausgefüllt = vermutlich Bot -> still abbrechen (kein Fehler anzeigen)
    if (honeypot && honeypot.value.trim() !== '') { form.reset(); return; }

    if (!form.checkValidity() || !consent.checked) {
      showMessage(msg, t('kon.error'), true);
      form.reportValidity();
      return;
    }

    // ---- TODO BACKEND: echten Versand einbauen ----
    // const data = { name: cName.value, email: cEmail.value, message: cMessage.value };
    // try { const r = await fetch('DEIN_ENDPOINT', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
    //   if(!r.ok) throw 0; showMessage(msg, t('kon.success')); form.reset(); }
    // catch(_) { showMessage(msg, t('kon.error'), true); }
    // Bis ein Backend existiert: nur lokale Erfolgsmeldung, KEIN echter Versand.

    showMessage(msg, t('kon.success'));
    form.reset();
  });
}

/* -------------------------------------------------------------
   4b. NEWSLETTER-FORMULAR (Demo)
   WICHTIG: Es werden KEINE echten Daten gespeichert oder gesendet.
   TODO Newsletter-Service: Für Deutschland/EU ist ein echtes
   DOUBLE-OPT-IN-System Pflicht. Später anzuschließen:
     - Eintrag an Service senden (Brevo, CleverReach, rapidmail, Mailchimp+AVV)
     - Double-Opt-in-Bestätigungsmail auslösen
     - Abmeldelink + Einwilligungsnachweis (Zeitstempel/IP) speichern
   ------------------------------------------------------------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  const msg = document.getElementById('newsletterMsg');
  const consent = document.getElementById('nConsent');
  const honeypot = document.getElementById('nHp');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (honeypot && honeypot.value.trim() !== '') { form.reset(); return; }

    if (!form.checkValidity() || !consent.checked) {
      showMessage(msg, t('news.error'), true);
      form.reportValidity();
      return;
    }

    // ---- TODO NEWSLETTER-SERVICE: Double-Opt-in anschließen ----
    // Für DE/EU Pflicht: Eintrag an Dienst senden (Brevo/CleverReach/rapidmail/Mailchimp+AVV),
    // Bestätigungs-E-Mail (Double-Opt-in) auslösen, Abmeldelink + Einwilligungsnachweis speichern.
    // Bis dahin: KEIN echter Versand, nur lokale Bestätigung.

    showMessage(msg, t('news.success'));
    form.reset();
  });
}

function showMessage(el, text, isError) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('is-error', !!isError);
  el.hidden = false;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* -------------------------------------------------------------
   5. COOKIE-CONSENT (DSGVO / TDDDG-freundliche Grundlage)
   - Notwendige Cookies immer aktiv
   - Optionale Kategorien standardmäßig AUS
   - Auswahl wird in localStorage gespeichert
   - Footer-Link "Cookie-Einstellungen" öffnet das Fenster erneut
   HINWEIS: Diese Logik ist eine technische GRUNDLAGE. Sie ersetzt
   keine anwaltliche Prüfung. Tracking-Skripte erst NACH Zustimmung
   laden (siehe applyConsent()).
   ------------------------------------------------------------- */
const CONSENT_KEY = 'pudado_cookie_consent_v2';
/* Kategorien: necessary (immer), analytics, marketing, external_media */

function initCookieConsent() {
  const banner   = document.getElementById('cookieBanner');
  const modal    = document.getElementById('cookieModal');

  const btnAcceptAll       = document.getElementById('acceptAll');
  const btnAcceptNecessary = document.getElementById('acceptNecessary');
  const btnOpenSettings    = document.getElementById('openSettings');
  const btnModalNecessary  = document.getElementById('modalNecessary');
  const btnSaveSettings    = document.getElementById('saveSettings');
  const footerLink         = document.getElementById('openCookieSettings');

  const ckStats     = document.getElementById('ckStats');
  const ckMarketing = document.getElementById('ckMarketing');
  const ckMedia     = document.getElementById('ckMedia');

  // Gespeicherte Entscheidung lesen
  const saved = getConsent();

  if (saved) {
    applyConsent(saved);          // ggf. erlaubte Skripte laden
  } else {
    showBanner(banner);           // noch keine Entscheidung -> Banner zeigen
  }

  // --- Aktionen ---
  const all          = { necessary: true, analytics: true, marketing: true, external_media: true };
  const onlyNeeded   = { necessary: true, analytics: false, marketing: false, external_media: false };

  btnAcceptAll && btnAcceptAll.addEventListener('click', () => {
    saveConsent(all); hideBanner(banner); closeModal(modal); toast(t('ck.toast_all'));
  });

  btnAcceptNecessary && btnAcceptNecessary.addEventListener('click', () => {
    saveConsent(onlyNeeded); hideBanner(banner); closeModal(modal); toast(t('ck.toast_nec'));
  });

  btnModalNecessary && btnModalNecessary.addEventListener('click', () => {
    saveConsent(onlyNeeded); hideBanner(banner); closeModal(modal); toast(t('ck.toast_nec'));
  });

  btnOpenSettings && btnOpenSettings.addEventListener('click', () => openModal(modal, ckStats, ckMarketing, ckMedia));

  footerLink && footerLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(modal, ckStats, ckMarketing, ckMedia);
  });

  // Auswahl im Modal speichern
  btnSaveSettings && btnSaveSettings.addEventListener('click', () => {
    saveConsent({
      necessary: true,
      analytics: ckStats.checked,
      marketing: ckMarketing.checked,
      external_media: ckMedia.checked
    });
    hideBanner(banner);
    closeModal(modal);
    toast(t('ck.toast_saved'));
  });

  // Modal per Klick auf den Hintergrund schließen
  modal && modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
}

/* --- Consent Helpers --- */
function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function saveConsent(consent) {
  const record = { ...consent, timestamp: new Date().toISOString() };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(record)); } catch (_) {}
  applyConsent(record);
}

/* Hier wird entschieden, welche Skripte geladen werden dürfen.
   ====> WICHTIG: Tracking erst NACH Zustimmung laden. <====
   Beispiele unten zeigen, wo Google Analytics, Meta Pixel,
   TikTok Pixel oder externe Medien eingebunden werden. */
function applyConsent(consent) {
  if (consent.analytics) {
    // TODO: Google Analytics / Statistik ERST hier laden (nach Zustimmung).
    // z. B.: loadScript('https://www.googletagmanager.com/gtag/js?id=G-XXXX');
  }
  if (consent.marketing) {
    // TODO: Meta Pixel / TikTok Pixel ERST hier laden (nach Zustimmung).
  }
  if (consent.external_media) {
    // TODO: Externe Medien (YouTube, Vimeo, Maps) ERST hier nachladen (nach Zustimmung).
  }
}

/* Optionaler Helfer zum Nachladen von Skripten nach Zustimmung:
function loadScript(src) {
  const s = document.createElement('script');
  s.src = src; s.async = true;
  document.head.appendChild(s);
}
*/

/* --- UI Helpers --- */
function showBanner(b) { if (b) b.hidden = false; }
function hideBanner(b) { if (b) b.hidden = true; }

/* Kurze Bestätigungsmeldung unten einblenden */
let _toastTimer;
function toast(text) {
  let el = document.getElementById('cookieToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'cookieToast';
    el.className = 'cookie-toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = text;
  // Reflow erzwingen, damit die Transition immer läuft
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function openModal(modal, ckStats, ckMarketing, ckMedia) {
  if (!modal) return;
  // Aktuelle gespeicherte Auswahl in die Schalter übernehmen (sonst alle aus)
  const saved = getConsent();
  if (ckStats)     ckStats.checked     = saved ? !!saved.analytics      : false;
  if (ckMarketing) ckMarketing.checked = saved ? !!saved.marketing      : false;
  if (ckMedia)     ckMedia.checked     = saved ? !!saved.external_media : false;
  modal.hidden = false;
}
function closeModal(modal) { if (modal) modal.hidden = true; }

/* -------------------------------------------------------------
   6. AKTIVE NAVIGATION (Scroll-Spy)
   Nur auf Seiten mit gleichseitigen Ankern (Startseite).
   ------------------------------------------------------------- */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const sec = id && document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  if (!map.size) return;
  let current = null;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const a = map.get(e.target);
        if (a && a !== current) {
          links.forEach(l => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
          a.classList.add('active'); a.setAttribute('aria-current', 'location');
          current = a;
        }
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  map.forEach((a, sec) => obs.observe(sec));
}

/* -------------------------------------------------------------
   7. SUBTILE SCROLL-REVEAL-ANIMATIONEN
   Additiv & rein optisch: fügt ausgewählten Inhaltsblöcken die
   Klasse .reveal hinzu und blendet sie beim Scrollen sanft ein.
   Respektiert prefers-reduced-motion und ändert keine Inhalte,
   Links oder Funktionen. Bei fehlendem IntersectionObserver bleibt
   alles sichtbar (kein Verstecken ohne Einblend-Mechanik).
   ------------------------------------------------------------- */
function initReveal() {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  // Blöcke, die sanft eingeblendet werden (nur Layout-/Optik-Elemente).
  const selector = [
    '.section-head', '.hero-copy', '.hero-visual',
    '.card', '.usecase-card', '.wissen-card', '.situation-card', '.blog-card',
    '.compare-card', '.step', '.num-list', '.set-list', '.feature-list',
    '.product-visual', '.set-visual', '.how-figure', '.detail-strip figure',
    '.lifestyle-gallery .lg-item', '.detail-col', '.cert-note', '.leaf-band',
    '.media-band', '.checker', '.checklist', '.calc2-inputs', '.calc2-results',
    '.faq-item', '.install-card', '.article-body p', '.trust-band-inner'
  ].join(',');

  const items = Array.from(document.querySelectorAll(selector));
  if (!items.length) return;

  items.forEach(el => {
    el.classList.add('reveal');
    // Kleine, gestaffelte Verzögerung für Elemente in derselben Gruppe.
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.classList && c.classList.contains('reveal'));
      const idx = siblings.indexOf(el);
      if (idx > 0 && idx <= 5) el.classList.add('reveal-' + idx);
    }
  });

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        o.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach(el => obs.observe(el));

  // Sicherheitsnetz: falls der Observer (z. B. sehr kurze Seite) nicht
  // feuert, nach kurzer Zeit alles im sichtbaren Bereich einblenden.
  setTimeout(() => {
    items.forEach(el => {
      if (!el.classList.contains('in-view')) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in-view');
      }
    });
  }, 1200);
}

/* -------------------------------------------------------------
   12. BRAND-VIDEO (Pudado-Firmensignatur, dekorativ)
   CSS kann Video-Autoplay nicht stoppen, daher hier:
   Bei prefers-reduced-motion bleibt das erste Standbild stehen.
   ------------------------------------------------------------- */
function initBrandVideo() {
  const video = document.querySelector('.brand-signature video');
  if (!video) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
    return;
  }
  // Chromium startet stumme Autoplay-Videos außerhalb des Viewports nicht
  // zuverlässig; Pausieren außerhalb des Sichtbereichs spart zudem Akku.
  // play() kann vom Browser abgelehnt werden -> Promise-Fehler ignorieren.
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });
  obs.observe(video);
}

