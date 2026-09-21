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
  [initI18n, initNav, initYear, initCalculator,
   initContactForm, initNewsletterForm, initStickyCta, initCookieConsent,
   initScrollSpy, initReveal, initBrandVideos, initHeaderState,
   initMobileDisclosures, initFaqAccordion, initDisclosureAnchors]
    .forEach(fn => { try { fn(); } catch (err) { console.error('Init-Fehler:', err); } });
});

/* -------------------------------------------------------------
   0. MEHRSPRACHIGKEIT (DE / EN / FR)
   Wörterbuch: translations.js (window.PUDADO_I18N)
   Auswahl wird in localStorage gespeichert.
   ------------------------------------------------------------- */
const LANG_KEY = 'pudado_lang';
window.PUDADO_LANG = 'de';

/* Seitenkennung + im HTML gerenderte Meta-Werte.
   Jede Seite trägt ihren Schlüssel selbst (data-page am <body>), die Texte
   liegen als "meta.title.<key>" / "meta.desc.<key>" in translations.js.
   Damit gibt es keine Seitenliste im JS: eine neue Seite bringt ihr
   data-page mit und funktioniert, sobald ihre Schlüssel existieren.
   Die HTML-Werte sind der Rückfall – fehlt ein Schlüssel, bleibt der
   handgeschriebene Titel/die Description der Seite stehen. Früher wurde
   hier pauschal der STARTSEITEN-Titel gesetzt, wodurch Unterseiten beim
   Sprachwechsel ihren eigenen Titel verloren. */
const PAGE_KEY = document.body.getAttribute('data-page') || '';
const META_EL = document.querySelector('meta[name="description"]');
const HTML_TITLE = document.title;
const HTML_DESC = META_EL ? META_EL.getAttribute('content') : null;

/* Setzt Titel und Description für die aktuelle Seite in der aktiven Sprache. */
function applyMeta(dict, lang) {
  const d = dict[lang] || {};
  const title = PAGE_KEY && d['meta.title.' + PAGE_KEY];
  document.title = title || HTML_TITLE;

  if (!META_EL) return;
  const desc = PAGE_KEY && d['meta.desc.' + PAGE_KEY];
  if (desc || HTML_DESC != null) META_EL.setAttribute('content', desc || HTML_DESC);
}

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
  applyMeta(dict, lang);

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

  // andere Module benachrichtigen (z. B. Rechner-Formatierung)
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
  const mobile = window.matchMedia('(max-width: 1120px)');
  // Das Menü scrollt selbst, auch wenn Lenis den Seitenhintergrund sperrt.
  nav.setAttribute('data-lenis-prevent', '');

  const toggle = (open) => {
    const isOpen = open !== undefined ? open : !nav.classList.contains('open');
    nav.classList.toggle('open', isOpen);
    nav.inert = mobile.matches && !isOpen;
    burger.classList.toggle('active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? t('a11y.menu_close') : t('a11y.menu_open'));
    document.dispatchEvent(new CustomEvent('pudado:scroll-lock', {
      detail: { source: 'navigation', locked: isOpen }
    }));
    document.body.classList.toggle('nav-open', isOpen);
    if (isOpen) {
      const first = nav.querySelector('a, button');
      if (first) requestAnimationFrame(() => first.focus());
    } else if (open === false && burger.offsetParent !== null && nav.contains(document.activeElement)) {
      burger.focus();
    }
  };

  burger.addEventListener('click', () => toggle());
  const syncViewport = () => toggle(false);
  nav.inert = mobile.matches;
  if (mobile.addEventListener) mobile.addEventListener('change', syncViewport);
  else mobile.addListener(syncViewport);

  // Menü schließen, wenn ein Link geklickt wird
  nav.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => toggle(false))
  );

  document.addEventListener('keydown', (event) => {
    if (!nav.classList.contains('open')) return;
    const modal = document.getElementById('cookieModal');
    if (modal && !modal.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      toggle(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...Array.from(nav.querySelectorAll('a[href], button:not([disabled])')), burger]
      .filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/* -------------------------------------------------------------
   Mobile Progressive Disclosure
   Native <details> keeps every item searchable and keyboard-accessible.
   Desktop/tablet retain the complete presentation; smartphones start
   with focused summaries and can reveal every detail on demand.
   ------------------------------------------------------------- */
function initMobileDisclosures() {
  const mobile = window.matchMedia('(max-width: 700px)');
  const disclosures = Array.from(document.querySelectorAll(
    '.set-more, .faq-extra, .newsletter-disclosure, .calc-support-more, .detail-more, .footer-group'
  )).filter(detail => !detail.classList.contains('chapter-disclosure'));
  const steps = Array.from(document.querySelectorAll('#how .step'));
  const gridToggles = Array.from(document.querySelectorAll('[data-mobile-grid-toggle]'));

  const syncGridGroup = (button, expanded = false) => {
    const group = button.dataset.mobileGridToggle;
    const items = Array.from(document.querySelectorAll(`[data-mobile-collapsible="${group}"]`));
    const collapsible = mobile.matches;
    button.hidden = !collapsible;
    button.setAttribute('aria-expanded', String(collapsible && expanded));
    items.forEach(item => { item.hidden = collapsible && !expanded; });
  };

  const sync = () => {
    disclosures.forEach(detail => { detail.open = !mobile.matches; });
    steps.forEach((step, index) => { step.open = !mobile.matches || index === 0; });
    gridToggles.forEach(button => syncGridGroup(button, false));
  };

  gridToggles.forEach(button => button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    syncGridGroup(button, expanded);
  }));

  steps.forEach(step => step.addEventListener('toggle', () => {
    if (!mobile.matches || !step.open) return;
    steps.forEach(other => {
      if (other !== step) other.open = false;
    });
  }));

  sync();
  if (mobile.addEventListener) mobile.addEventListener('change', sync);
  else mobile.addListener(sync);
}

function initFaqAccordion() {
  const items = Array.from(document.querySelectorAll('#faq .faq-item'));
  items.forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    items.forEach(other => {
      if (other !== item) other.open = false;
    });
  }));
}

/* Reveal native disclosures before browser/Lenis anchor measurements.
   Old URLs continue to reach content after the homepage is condensed. */
function initDisclosureAnchors() {
  if (!document.body.classList.contains('home-compact')) return;

  const reveal = hash => {
    if (!hash || hash === '#') return null;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch (_) { return null; }
    const target = document.getElementById(id);
    if (!target) return null;
    for (let node = target; node; node = node.parentElement) {
      if (node.tagName === 'DETAILS') node.open = true;
    }
    target.querySelectorAll('[data-anchor-disclosure]').forEach(detail => {
      if (detail.dataset.anchorDisclosure === target.id) detail.open = true;
    });
    return target;
  };

  // Capture runs before motion.js's bubbling click listener measures the target.
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search) {
      reveal(url.hash);
    }
  }, true);

  const followHash = () => {
    const target = reveal(location.hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
  };
  window.addEventListener('hashchange', followHash);
  followHash();
  if (location.hash && document.fonts) document.fonts.ready.then(followHash);

  let refreshFrame;
  const refresh = () => {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  };
  document.querySelectorAll('main details').forEach(detail => detail.addEventListener('toggle', refresh));
  document.addEventListener('pudado:lang', refresh);
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
  // Konservative Website-Annahme: typisches Rollengewicht um ca. 100 g ×
  // ca. 1,8–2,5 kg CO₂e pro kg Tissue (je nach LCA-/EPD-Methodik) ≈ 0,18–0,25 kg.
  // Bewusst vereinfachte Verbraucherorientierung, keine vollständige Ökobilanz.
  const CO2E_PER_ROLL     = 0.20;  // kg CO₂e pro Rolle (geschätzt)

  const LOCALES = { de: 'de-DE', en: 'en-IE', fr: 'fr-FR' };
  const APPROX  = { de: 'ca.', en: 'approx.', fr: 'env.' };
  let nf0, nf1, euro, approx;
  function buildFormatters() {
    const lang = window.PUDADO_LANG || 'de';
    nf0   = new Intl.NumberFormat(LOCALES[lang] || 'de-DE', { maximumFractionDigits: 0 });
    nf1   = new Intl.NumberFormat(LOCALES[lang] || 'de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
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
    const rollsWeek = clamp(readNum('rollsWeek', 0, 30, 4), 0, 30, 4);
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

    // Geschätzter CO₂e-Fußabdruck des heutigen Verbrauchs (siehe CO2E_PER_ROLL)
    const co2YearNow = rollsYearNow * CO2E_PER_ROLL;
    const co2WeekNow = rollsWeek * CO2E_PER_ROLL;

    return { persons, rollsWeek, usage, priceRoll, rollsYearNow, rollsMonthNow,
             sheetsYearNow, costYearNow, rollsYearEco, rollsSaved, sheetsSaved,
             costYearEco, costDiff, co2YearNow, co2WeekNow };
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
    if (bn) bn.style.width = r.rollsYearNow > 0 ? '100%' : '0%';
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
    setTxt('mCo2Week', nf1.format(Math.max(0, r.co2WeekNow)) + ' kg');
    // CO₂e-Satz aus Übersetzungs-Template; Zahl wird lokalisiert eingesetzt
    setTxt('co2Result', t('rc2.co2_result').replace('{x}', nf0.format(Math.max(0, Math.round(r.co2YearNow)))));
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
   3d. STICKY MOBILE CTA
   Blendet die untere CTA-Leiste auf Mobil ein, sobald man am Hero
   vorbeigescrollt ist; blendet sie am Footer wieder aus.
   ------------------------------------------------------------- */
function initStickyCta() {
  const bar = document.getElementById('stickyCta');
  if (!bar) return;
  const hero = document.getElementById('hero');
  const contact = document.getElementById('kontakt');
  const footer = document.getElementById('footer');
  function update() {
    const y = window.scrollY || window.pageYOffset;
    const past = hero ? y > (hero.offsetTop + hero.offsetHeight - 120) : y > 400;
    const nearFooter = footer ? (y + window.innerHeight) > (footer.offsetTop + 40) : false;
    const nearContact = contact ? (y + window.innerHeight) > (contact.offsetTop + 80) : false;
    const interfaceLocked = document.body.classList.contains('nav-open')
      || !document.getElementById('cookieModal')?.hidden;
    bar.classList.toggle('show', past && !nearContact && !nearFooter && !interfaceLocked);
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
  const footerLinks        = document.querySelectorAll('#openCookieSettings, [data-cookie-settings]');

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
  // Prelaunch: Es sind keine optionalen Dienste eingebunden, deshalb gibt es im
  // UI auch keine Kategorie-Schalter mehr. Die Buttons "Alle akzeptieren" und
  // "Nur notwendige" im Modal existieren derzeit nicht – die Handler bleiben
  // null-sicher, damit sie sofort wieder greifen, wenn die Schalter zurückkommen.
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

  footerLinks.forEach((footerLink) => {
    footerLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modal, ckStats, ckMarketing, ckMedia);
    });
  });

  // Auswahl im Modal speichern
  // Ohne Kategorie-Schalter ist dieser Button ein reines "Schließen": es bleibt
  // bei der notwendigen Speicherung. Die Abfragen sind null-sicher, damit die
  // Logik unverändert weiterläuft, sobald es wieder Schalter gibt.
  btnSaveSettings && btnSaveSettings.addEventListener('click', () => {
    saveConsent({
      necessary: true,
      analytics: ckStats ? ckStats.checked : false,
      marketing: ckMarketing ? ckMarketing.checked : false,
      external_media: ckMedia ? ckMedia.checked : false
    });
    hideBanner(banner);
    closeModal(modal);
    toast(t(ckStats ? 'ck.toast_saved' : 'ck.toast_nec'));
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
function showBanner(b) {
  if (!b) return;
  b.hidden = false;
  document.dispatchEvent(new CustomEvent('pudado:scroll-lock', {
    detail: { source: 'cookie-banner', locked: true }
  }));
}
function hideBanner(b) {
  if (!b) return;
  b.hidden = true;
  document.dispatchEvent(new CustomEvent('pudado:scroll-lock', {
    detail: { source: 'cookie-banner', locked: false }
  }));
}

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

const modalStates = new WeakMap();
function openModal(modal, ckStats, ckMarketing, ckMedia) {
  if (!modal || !modal.hidden) return;
  const opener = document.activeElement;
  const background = Array.from(document.body.children).filter(el => el !== modal && !el.inert);
  background.forEach(el => { el.inert = true; });
  const focusable = () => Array.from(modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'))
    .filter(el => el.offsetParent !== null && !el.closest('[inert]'));
  const handleKey = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal(modal);
    } else if (event.key === 'Tab') {
      const items = focusable();
      const first = items[0], last = items[items.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  };
  modalStates.set(modal, { opener, background, handleKey });
  document.addEventListener('keydown', handleKey);
  // Aktuelle gespeicherte Auswahl in die Schalter übernehmen (sonst alle aus)
  const saved = getConsent();
  if (ckStats)     ckStats.checked     = saved ? !!saved.analytics      : false;
  if (ckMarketing) ckMarketing.checked = saved ? !!saved.marketing      : false;
  if (ckMedia)     ckMedia.checked     = saved ? !!saved.external_media : false;
  modal.hidden = false;
  // Oben beginnen statt auf kurzen Displays zur Schließen-Taste zu springen.
  const title = modal.querySelector('h2');
  if (title) title.setAttribute('tabindex', '-1');
  const first = title || focusable()[0];
  const card = modal.querySelector('.cookie-modal-card');
  if (card) card.scrollTop = 0;
  if (first) first.focus({ preventScroll: true });
  document.dispatchEvent(new CustomEvent('pudado:scroll-lock', {
    detail: { source: 'cookie-modal', locked: true }
  }));
}
function closeModal(modal) {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  const state = modalStates.get(modal);
  if (state) {
    document.removeEventListener('keydown', state.handleKey);
    state.background.forEach(el => { el.inert = false; });
    modalStates.delete(modal);
    const target = [state.opener, document.getElementById('openCookieSettings'), document.querySelector('.logo')]
      .find(el => el && el.isConnected && el.offsetParent !== null && !el.closest('[inert]'));
    if (target) target.focus({ preventScroll: true });
  }
  document.dispatchEvent(new CustomEvent('pudado:scroll-lock', {
    detail: { source: 'cookie-modal', locked: false }
  }));
}

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
  if (document.body.dataset.page === 'home' || reduce || !('IntersectionObserver' in window)) return;

  // Blöcke, die sanft eingeblendet werden (nur Layout-/Optik-Elemente).
  const selector = [
    '.section-head', '.hero-copy', '.hero-visual',
    '.card', '.usecase-card', '.situation-card', '.blog-card',
    '.duel', '.step', '.num-list', '.set-list', '.feature-list',
    '.product-visual', '.set-visual', '.how-figure', '.detail-strip figure',
    '.lifestyle-gallery .lg-item', '.detail-col', '.cert-note',
    '.media-band', '.calc2-inputs', '.calc2-results',
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
   TODO SOUND (bewusst NICHT aktiv): Optionales UI-Sounddesign ist
   vorbereitet als Konzept, nicht als Code. Regeln bei Umsetzung:
   - Opt-in-Toggle im Header/Footer, Standard AUS, Wahl in
     localStorage ('pudado_sound'), kein Sound ohne Nutzeraktion.
   - Nur 2-3 sehr leise UI-Sounds (Soft-Tap CTA, Bestätigung
     Foto-Auswahl, dezenter Chime Rechner-Ergebnis), je < 20 KB,
     WebAudio mit Gain ≈ 0.15, prefers-reduced-motion => stumm.
   - Erst umsetzen, wenn LIZENZIERTE Audio-Dateien unter
     assets/audio/ liegen – keine Fremdquellen, keine Platzhalter.
   ------------------------------------------------------------- */

/* -------------------------------------------------------------
   12. MARKENVIDEOS
   Ein gemeinsamer Observer steuert Ambient- und Ad-Videos. Filme laufen
   höchstens einmal weiter, werden außerhalb des Viewports pausiert und bei
   reduzierter Bewegung nicht automatisch gestartet.
   ------------------------------------------------------------- */
function initBrandVideos() {
  const videos = Array.from(document.querySelectorAll('.brand-stage-ambient, [data-brand-video]'));
  if (!videos.length) return;
  const updateControl = video => {
    const button = video.parentElement && video.parentElement.querySelector('[data-video-toggle]');
    const label = button && button.querySelector('[data-i18n]');
    if (!label) return;
    const key = video.paused ? 'video.play' : 'video.pause';
    label.setAttribute('data-i18n', key);
    label.textContent = t(key);
  };
  videos.forEach(video => {
    const button = video.parentElement && video.parentElement.querySelector('[data-video-toggle]');
    if (button) {
      button.addEventListener('click', () => {
        if (!video.paused) {
          video.dataset.userPaused = 'true';
          video.pause();
          return;
        }
        delete video.dataset.userPaused;
        if (video.ended) video.currentTime = 0;
        const p = video.play();
        if (p && p.catch) p.catch(() => {});
      });
      video.addEventListener('play', () => updateControl(video));
      video.addEventListener('pause', () => updateControl(video));
      video.addEventListener('ended', () => updateControl(video));
      updateControl(video);
    }
  });
  const isMobile = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion && reduceMotion.matches) {
    videos.forEach(video => {
      video.removeAttribute('autoplay');
      video.pause();
    });
    return;
  }
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        if (reduceMotion && reduceMotion.matches) return;
        if (e.target.ended || e.target.dataset.userPaused === 'true') return;
        const p = e.target.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        e.target.pause();
      }
    });
  }, { threshold: 0.15 });
  videos.forEach(video => {
    if (isMobile && video.classList.contains('brand-stage-ambient')) {
      video.pause();
      return;
    }
    obs.observe(video);
  });
  if (reduceMotion && reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', event => {
      videos.forEach(video => {
        if (event.matches) {
          video.pause();
          return;
        }
        const rect = video.getBoundingClientRect();
        if (!video.ended && video.dataset.userPaused !== 'true' && rect.bottom > 0 && rect.top < window.innerHeight) {
          const p = video.play();
          if (p && p.catch) p.catch(() => {});
        }
      });
    });
  }
}

/* -------------------------------------------------------------
   13. HEADER-ZUSTAND BEIM SCROLLEN
   Vertieft den Header-Schatten, sobald Inhalt unter die Leiste
   scrollt (CSS-Klasse .is-scrolled). Passiver Listener, nur ein
   classList-Toggle pro Wechsel – kein Layout-Thrash.
   ------------------------------------------------------------- */
function initHeaderState() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  let scrolled = false;
  const update = () => {
    const y = window.scrollY || window.pageYOffset;
    const next = y > 8;
    if (next !== scrolled) {
      scrolled = next;
      header.classList.toggle('is-scrolled', scrolled);
    }
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}
