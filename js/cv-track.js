// ============================================================
// CampusVazhi — Behaviour Tracker  v1.0
// Fires events to Supabase cv_events table.
// Events: page_view, cta_click, download_click, faq_expand,
//         outbound_click, form_submit, page_exit
// ============================================================
(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────
  var SB_URL = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_URL)
    || 'https://txyimbzkutnkaphyvifg.supabase.co';
  var SB_KEY = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_ANON_KEY)
    || 'sb_publishable_REz6tM-s9uOZsCElHF2FVg_N_ma-1j5';
  var TABLE = 'cv_events';

  // ── SESSION ─────────────────────────────────────────────
  function getSession() {
    try {
      var k = 'cv_sid';
      var sid = sessionStorage.getItem(k);
      if (!sid) {
        sid = 'cv-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
        sessionStorage.setItem(k, sid);
      }
      return sid;
    } catch (e) { return 'cv-anon'; }
  }

  // ── HELPERS ─────────────────────────────────────────────
  var SESSION_ID = getSession();
  var PAGE_START = Date.now();
  var MAX_SCROLL = 0;

  function device() {
    return window.innerWidth <= 768 ? 'mobile' : 'desktop';
  }

  function pageName() {
    var p = window.location.pathname;
    var f = p.split('/').pop() || 'index.html';
    return f === '' ? 'index.html' : f;
  }

  function pageTitle() {
    return document.title || pageName();
  }

  function isExternal(href) {
    if (!href) return false;
    if (href.startsWith('#') || href.startsWith('javascript')) return false;
    try {
      var u = new URL(href, window.location.href);
      return u.hostname !== window.location.hostname;
    } catch (e) { return false; }
  }

  function isDownload(el) {
    if (el.hasAttribute('download')) return true;
    var href = el.getAttribute('href') || '';
    return /\.(pdf|doc|docx|xls|xlsx|zip|ppt|pptx)(\?|$)/i.test(href);
  }

  function isCTA(el) {
    var tag = el.tagName;
    var cls = el.className || '';
    var txt = (el.textContent || '').trim().toLowerCase();
    if (tag === 'BUTTON') return true;
    if (typeof cls === 'string' && /\b(btn|cta|button)\b/i.test(cls)) return true;
    var ctaWords = ['download','get ','start','join','register','book','enroll','apply','try','view','explore','access','unlock','calculate','predict','check','compare'];
    return ctaWords.some(function (w) { return txt.startsWith(w); });
  }

  function closest(el, selector) {
    while (el && el !== document) {
      if (el.matches && el.matches(selector)) return el;
      el = el.parentElement;
    }
    return null;
  }

  function labelFor(el) {
    var txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return txt.substring(0, 80) || el.id || el.className || '?';
  }

  // ── SEND EVENT ───────────────────────────────────────────
  function send(eventType, metadata) {
    var body = JSON.stringify({
      session_id: SESSION_ID,
      event_type: eventType,
      page: pageName(),
      device: device(),
      metadata: metadata || {}
    });
    // Use sendBeacon for exit events; fetch for everything else
    if (eventType === 'page_exit' && navigator.sendBeacon) {
      var blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(SB_URL + '/rest/v1/' + TABLE + '?apikey=' + SB_KEY, blob);
    } else {
      fetch(SB_URL + '/rest/v1/' + TABLE, {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': 'Bearer ' + SB_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: body,
        keepalive: true
      }).catch(function () {}); // silent fail — never break the user experience
    }
  }

  // ── SCROLL TRACKING ──────────────────────────────────────
  function onScroll() {
    var docH = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight, 1
    );
    var viewH = window.innerHeight || 1;
    var scrolled = (window.scrollY || window.pageYOffset) + viewH;
    var pct = Math.round((scrolled / docH) * 100);
    if (pct > MAX_SCROLL) MAX_SCROLL = pct;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── PAGE VIEW ────────────────────────────────────────────
  function firePageView() {
    send('page_view', {
      title: pageTitle(),
      referrer: document.referrer || '',
      url: window.location.href
    });
  }

  // ── CLICK TRACKING ───────────────────────────────────────
  document.addEventListener('click', function (e) {
    var target = e.target;

    // FAQ expand
    var faqQ = closest(target, '.faq-q');
    if (faqQ) {
      var faqText = (faqQ.textContent || '').replace(/[+\-−]/g, '').replace(/\s+/g, ' ').trim();
      send('faq_expand', { question: faqText.substring(0, 100) });
      return;
    }

    // Links
    var anchor = closest(target, 'a[href]');
    if (anchor) {
      var href = anchor.getAttribute('href') || '';
      if (isDownload(anchor)) {
        send('download_click', { file: href, label: labelFor(anchor) });
      } else if (isExternal(href)) {
        send('outbound_click', { url: href, label: labelFor(anchor) });
      } else if (isCTA(anchor)) {
        send('cta_click', { label: labelFor(anchor), href: href });
      }
      return;
    }

    // Buttons and CTA elements
    var btn = closest(target, 'button, [role="button"]');
    if (btn) {
      send('cta_click', { label: labelFor(btn) });
      return;
    }

    // Any div/span acting as a CTA
    if (isCTA(target)) {
      send('cta_click', { label: labelFor(target) });
    }
  }, true); // capture phase so sidebar/modal clicks aren't missed

  // ── FORM SUBMIT TRACKING ─────────────────────────────────
  document.addEventListener('submit', function (e) {
    var form = e.target;
    var id = form.id || form.action || 'form';
    send('form_submit', { form_id: id, action: form.action || '' });
  }, true);

  // ── PAGE EXIT ────────────────────────────────────────────
  function firePageExit() {
    var timeSpent = Math.round((Date.now() - PAGE_START) / 1000);
    send('page_exit', {
      time_spent_sec: timeSpent,
      scroll_depth_pct: MAX_SCROLL
    });
  }

  // visibilitychange is more reliable than beforeunload on mobile
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') firePageExit();
  });
  window.addEventListener('beforeunload', firePageExit);

  // ── INIT ─────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', firePageView);
  } else {
    firePageView();
  }

})();
