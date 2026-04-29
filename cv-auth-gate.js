// ============================================================
// CampusVazhi — Auth Gate v4
// ALL protected links → Google sign-in + phone (mandatory)
// Gates:
//   1. WhatsApp / Telegram → opens in new tab after auth
//   2. Mock Test links     → navigates same tab after auth
// ============================================================
(function () {
  'use strict';

  var SB_URL = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_URL) || 'https://txyimbzkutnkaphyvifg.supabase.co';
  var SB_KEY = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_ANON_KEY) || 'sb_publishable_REz6tM-s9uOZsCElHF2FVg_N_ma-1j5';

  var PENDING_CHAT = 'cv_pending_chat'; // new-tab links (WA/TG)
  var PENDING_NAV  = 'cv_pending_nav';  // same-tab links (mock test)
  var PENDING_MODE = 'cv_pending_mode'; // 'chat' | 'mock'

  // ── LINK DETECTORS ──────────────────────────────────────
  function isChatLink(href) {
    if (!href) return false;
    return href.includes('wa.me') ||
           href.includes('whatsapp.com') ||
           href.includes('t.me/') ||
           href.includes('telegram.me') ||
           href.includes('telegram.org');
  }

  function isMockLink(href) {
    if (!href) return false;
    return href.includes('TANCET-Mock') || href.includes('tancet-mock');
  }

  // ── AUTH HELPERS ─────────────────────────────────────────
  function isSignedIn() {
    return localStorage.getItem('cv_signed_in') === '1';
  }

  function getSession() {
    return new Promise(function (resolve) {
      try {
        if (typeof cvSupabase === 'undefined') { resolve(null); return; }
        cvSupabase.auth.getSession().then(function (r) {
          resolve(r.data && r.data.session ? r.data.session : null);
        }).catch(function () { resolve(null); });
      } catch (e) { resolve(null); }
    });
  }

  function getPhone(session) {
    return fetch(
      SB_URL + '/rest/v1/students?select=phone&auth_id=eq.' + encodeURIComponent(session.user.id) + '&limit=1',
      { headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + session.access_token } }
    ).then(function (r) { return r.json(); }).then(function (data) {
      return (data && data[0] && data[0].phone) ? data[0].phone : null;
    }).catch(function () { return null; });
  }

  function savePhone(phone, session) {
    return fetch(
      SB_URL + '/rest/v1/students?auth_id=eq.' + encodeURIComponent(session.user.id),
      {
        method: 'PATCH',
        headers: {
          'apikey': SB_KEY,
          'Authorization': 'Bearer ' + session.access_token,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ phone: phone, updated_at: new Date().toISOString() })
      }
    ).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  // ── STYLES ───────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('cv-gate-css')) return;
    var s = document.createElement('style');
    s.id = 'cv-gate-css';
    s.textContent = [
      '.cvg-overlay{position:fixed;inset:0;background:rgba(15,27,45,0.72);display:flex;align-items:center;justify-content:center;z-index:2147483647;padding:20px;backdrop-filter:blur(4px);animation:cvgFade .2s ease}',
      '@keyframes cvgFade{from{opacity:0}to{opacity:1}}',
      '.cvg-modal{background:#fff;border-radius:20px;padding:36px 32px;width:100%;max-width:440px;position:relative;box-shadow:0 24px 80px rgba(0,0,0,.32);animation:cvgUp .25s ease}',
      '@keyframes cvgUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}',
      '.cvg-close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:24px;color:#94A3B8;cursor:pointer;line-height:1;padding:4px}',
      '.cvg-close:hover{color:#475569}',
      '.cvg-emoji{font-size:44px;text-align:center;margin-bottom:10px}',
      '.cvg-title{font-size:21px;font-weight:800;color:#0F1B2D;text-align:center;margin-bottom:6px}',
      '.cvg-sub{font-size:14px;color:#64748B;text-align:center;line-height:1.55;margin-bottom:20px}',
      '.cvg-google{width:100%;display:flex;align-items:center;justify-content:center;gap:12px;padding:13px 20px;background:#fff;border:2px solid #E2E8F0;border-radius:12px;font-size:15px;font-weight:700;color:#1E293B;cursor:pointer;transition:all .2s;font-family:inherit}',
      '.cvg-google:hover{border-color:#0D9488;background:#F0FDFA}',
      '.cvg-google:disabled{opacity:.6;cursor:not-allowed}',
      '.cvg-divider{display:flex;align-items:center;gap:10px;margin:16px 0}',
      '.cvg-divider-line{flex:1;height:1px;background:#F1F5F9}',
      '.cvg-divider-text{font-size:12px;color:#94A3B8;font-weight:600;white-space:nowrap}',
      '.cvg-phone-row{display:flex;gap:8px;align-items:stretch}',
      '.cvg-input{width:100%;padding:13px 16px;border:2px solid #E2E8F0;border-radius:12px;font-size:15px;color:#1E293B;outline:none;font-family:inherit;transition:border-color .2s;box-sizing:border-box}',
      '.cvg-input:focus{border-color:#0D9488}',
      '.cvg-submit{width:100%;padding:13px;background:#0D9488;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;transition:background .2s;font-family:inherit;margin-top:8px}',
      '.cvg-submit:hover{background:#0F766E}',
      '.cvg-submit:disabled{opacity:.6;cursor:not-allowed}',
      '.cvg-err{background:#FEF2F2;color:#EF4444;padding:10px 14px;border-radius:8px;font-size:13px;margin-top:10px;display:none}',
      '.cvg-note{font-size:12px;color:#94A3B8;text-align:center;margin-top:14px}',
      '.cvg-phone-label{font-size:12px;font-weight:700;color:#475569;margin:14px 0 6px;display:block}'
    ].join('');
    document.head.appendChild(s);
  }

  // ── MODAL HELPERS ────────────────────────────────────────
  function removeModal(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

  // ── MAIN SIGN-IN + PHONE MODAL ───────────────────────────
  // Single modal: Google sign-in on top, phone field below
  // mode: 'chat' | 'mock'
  function showAuthModal(href, mode) {
    injectStyles();

    var isMock = (mode === 'mock');
    var absUrl = href;
    try { absUrl = new URL(href, window.location.href).href; } catch (e) {}

    if (isMock) {
      sessionStorage.setItem(PENDING_NAV, absUrl);
    } else {
      sessionStorage.setItem(PENDING_CHAT, absUrl);
    }
    sessionStorage.setItem(PENDING_MODE, mode || 'chat');

    removeModal('cvg-signin');

    var el = document.createElement('div');
    el.className = 'cvg-overlay';
    el.id = 'cvg-signin';
    el.innerHTML =
      '<div class="cvg-modal">' +
        '<button class="cvg-close" id="cvg-close-btn">&#x2715;</button>' +
        '<div class="cvg-emoji">' + (isMock ? '&#x1F4DD;' : '&#x1F4AC;') + '</div>' +
        '<div class="cvg-title">' + (isMock ? 'Sign in to take the test' : 'Sign in to connect') + '</div>' +
        '<div class="cvg-sub">' + (isMock
          ? 'Free account — access full mock tests, track your scores &amp; percentile.'
          : 'Join free to chat with our mentors on WhatsApp &amp; Telegram.')
        + '</div>' +

        // Google button
        '<button class="cvg-google" id="cvg-goog-btn">' +
          '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>' +
          'Continue with Google' +
        '</button>' +

        // Divider
        '<div class="cvg-divider"><div class="cvg-divider-line"></div><div class="cvg-divider-text">then enter your WhatsApp number</div><div class="cvg-divider-line"></div></div>' +

        // Phone field (visible but disabled until signed in — enabled after OAuth return)
        '<label class="cvg-phone-label">&#x1F4F1; WhatsApp Number <span style="color:#EF4444">*</span></label>' +
        '<input class="cvg-input" id="cvg-ph-inp" type="tel" placeholder="+91 98765 43210" maxlength="15" autocomplete="tel">' +
        '<div class="cvg-err" id="cvg-ph-err"></div>' +
        '<button class="cvg-submit" id="cvg-ph-btn">Continue &#x2192;</button>' +

        '<div class="cvg-note">&#x1F512; Free forever · No spam · We never share your data</div>' +
      '</div>';

    document.body.appendChild(el);

    document.getElementById('cvg-close-btn').onclick = function () { removeModal('cvg-signin'); };
    el.addEventListener('click', function (ev) { if (ev.target === el) removeModal('cvg-signin'); });

    // "Continue" button — handles both paths:
    // Path A: not signed in → do Google OAuth (phone saved after redirect return)
    // Path B: already signed in but no phone → save phone and proceed
    document.getElementById('cvg-ph-btn').onclick = function () {
      var phone = (document.getElementById('cvg-ph-inp').value || '').trim();
      var err = document.getElementById('cvg-ph-err');

      if (!phone || phone.replace(/\D/g, '').length < 7) {
        err.textContent = 'Please enter your WhatsApp number first (at least 7 digits).';
        err.style.display = 'block';
        return;
      }
      err.style.display = 'none';

      // Save phone in sessionStorage so we can use it after OAuth redirect
      sessionStorage.setItem('cv_pending_phone', phone);

      if (!isSignedIn()) {
        // Not signed in yet — do Google OAuth
        var btn = document.getElementById('cvg-goog-btn');
        var pbtn = document.getElementById('cvg-ph-btn');
        if (btn) btn.disabled = true;
        if (pbtn) { pbtn.disabled = true; pbtn.textContent = 'Redirecting to Google…'; }
        if (typeof cvSupabase === 'undefined') {
          alert('Auth not loaded. Please refresh and try again.');
          return;
        }
        cvSupabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.href }
        });
      } else {
        // Already signed in — just save phone and proceed
        var pbtn2 = document.getElementById('cvg-ph-btn');
        if (pbtn2) { pbtn2.disabled = true; pbtn2.textContent = 'Saving…'; }
        getSession().then(function (session) {
          if (!session) { showAuthModal(href, mode); return; }
          savePhone(phone, session).then(function () {
            sessionStorage.removeItem('cv_pending_phone');
            removeModal('cvg-signin');
            resolveDestination(mode);
          });
        });
      }
    };

    // Also allow pressing Enter in phone field
    var inp = document.getElementById('cvg-ph-inp');
    if (inp) {
      inp.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') document.getElementById('cvg-ph-btn').click();
      });
      setTimeout(function () { inp.focus(); }, 200);
    }

    // Google button click — validate phone first
    document.getElementById('cvg-goog-btn').onclick = function () {
      document.getElementById('cvg-ph-btn').click();
    };
  }

  // ── RESOLVE DESTINATION ──────────────────────────────────
  function resolveDestination(mode) {
    if (mode === 'mock') {
      var url = sessionStorage.getItem(PENDING_NAV);
      sessionStorage.removeItem(PENDING_NAV);
      sessionStorage.removeItem(PENDING_MODE);
      if (url) window.location.href = url;
    } else {
      var url2 = sessionStorage.getItem(PENDING_CHAT);
      sessionStorage.removeItem(PENDING_CHAT);
      sessionStorage.removeItem(PENDING_MODE);
      if (url2) window.open(url2, '_blank');
    }
  }

  // ── GATE LOGIC ───────────────────────────────────────────
  function triggerGate(href, mode) {
    var absUrl = href;
    try { absUrl = new URL(href, window.location.href).href; } catch (e) {}

    if (!isSignedIn()) {
      showAuthModal(absUrl, mode);
      return;
    }
    getSession().then(function (session) {
      if (!session) { showAuthModal(absUrl, mode); return; }
      getPhone(session).then(function (phone) {
        if (!phone) { showAuthModal(absUrl, mode); return; }
        // Signed in + phone exists → go directly
        if (mode === 'mock') {
          window.location.href = absUrl;
        } else {
          window.open(absUrl, '_blank');
        }
      });
    });
  }

  // ── PATCH LINKS IN DOM ───────────────────────────────────
  function patchLink(a) {
    if (a.dataset.cvgPatched) return;
    var href = a.getAttribute('href');
    if (!href) return;

    var mode = null;
    if (isChatLink(href)) mode = 'chat';
    else if (isMockLink(href)) mode = 'mock';
    if (!mode) return;

    a.dataset.cvgPatched = '1';
    a.dataset.cvgUrl = href;
    a.dataset.cvgMode = mode;
    a.removeAttribute('href');
    a.style.cursor = 'pointer';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      triggerGate(a.dataset.cvgUrl, a.dataset.cvgMode);
    });
  }

  function patchAllLinks() {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) patchLink(links[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchAllLinks);
  } else {
    patchAllLinks();
  }

  if (window.MutationObserver) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'A') patchLink(node);
          var nested = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
          for (var i = 0; i < nested.length; i++) patchLink(nested[i]);
        });
      });
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  // ── POST OAUTH REDIRECT HANDLER ──────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      var mode = sessionStorage.getItem(PENDING_MODE);
      if (!mode) return;
      if (!isSignedIn()) return;

      var pendingPhone = sessionStorage.getItem('cv_pending_phone');

      getSession().then(function (session) {
        if (!session) return;

        function proceed() {
          sessionStorage.removeItem('cv_pending_phone');
          resolveDestination(mode);
        }

        if (pendingPhone) {
          // Phone was collected before OAuth — save it now
          savePhone(pendingPhone, session).then(proceed);
        } else {
          // Check if phone already exists
          getPhone(session).then(function (phone) {
            if (phone) {
              proceed();
            } else {
              // Show modal again, already signed in, just needs phone
              var dest = mode === 'mock'
                ? sessionStorage.getItem(PENDING_NAV)
                : sessionStorage.getItem(PENDING_CHAT);
              showAuthModal(dest || '', mode);
            }
          });
        }
      });
    }, 1000);
  });

})();
