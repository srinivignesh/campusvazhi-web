// ============================================================
// CampusVazhi — Auth Gate for WhatsApp & Telegram links
// Flow: click link → if not signed in → Google sign-in modal
//       → after sign-in → WhatsApp number modal (mandatory)
//       → save phone → open original link
// ============================================================
(function () {
  'use strict';

  var SB_URL = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_URL) || 'https://txyimbzkutnkaphyvifg.supabase.co';
  var SB_KEY = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_ANON_KEY) || 'sb_publishable_REz6tM-s9uOZsCElHF2FVg_N_ma-1j5';
  var PENDING_KEY = 'cv_pending_chat';

  // ── HELPERS ─────────────────────────────────────────────
  function isChatLink(href) {
    if (!href) return false;
    return href.includes('wa.me') ||
           href.includes('whatsapp.com') ||
           href.includes('t.me') ||
           href.includes('telegram.me') ||
           href.includes('telegram.org');
  }

  function isSignedIn() {
    return localStorage.getItem('cv_signed_in') === '1';
  }

  async function getSession() {
    try {
      if (typeof cvSupabase === 'undefined') return null;
      var r = await cvSupabase.auth.getSession();
      return r.data && r.data.session ? r.data.session : null;
    } catch (e) { return null; }
  }

  async function getPhone(session) {
    try {
      var r = await fetch(
        SB_URL + '/rest/v1/students?select=phone&auth_id=eq.' + encodeURIComponent(session.user.id) + '&limit=1',
        { headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + session.access_token } }
      );
      var data = await r.json();
      return (data && data[0] && data[0].phone) ? data[0].phone : null;
    } catch (e) { return null; }
  }

  async function savePhone(phone, session) {
    try {
      var r = await fetch(
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
      );
      return r.ok;
    } catch (e) { return false; }
  }

  // ── STYLES ───────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('cv-gate-css')) return;
    var s = document.createElement('style');
    s.id = 'cv-gate-css';
    s.textContent = `
      .cvg-overlay {
        position: fixed; inset: 0;
        background: rgba(15,27,45,0.65);
        display: flex; align-items: center; justify-content: center;
        z-index: 999999; padding: 20px;
        backdrop-filter: blur(3px);
        animation: cvgFade .2s ease;
      }
      @keyframes cvgFade { from { opacity:0 } to { opacity:1 } }
      .cvg-modal {
        background: #fff; border-radius: 20px; padding: 36px 32px;
        width: 100%; max-width: 420px; position: relative;
        box-shadow: 0 24px 80px rgba(0,0,0,.28);
        animation: cvgUp .25s ease;
      }
      @keyframes cvgUp { from { transform:translateY(16px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      .cvg-close {
        position: absolute; top: 14px; right: 16px;
        background: none; border: none; font-size: 24px;
        color: #94A3B8; cursor: pointer; line-height: 1; padding: 4px;
      }
      .cvg-close:hover { color: #475569; }
      .cvg-emoji { font-size: 44px; text-align: center; margin-bottom: 10px; }
      .cvg-title { font-size: 21px; font-weight: 800; color: #0F1B2D; text-align: center; margin-bottom: 6px; }
      .cvg-sub { font-size: 14px; color: #64748B; text-align: center; line-height: 1.55; margin-bottom: 24px; }
      .cvg-google {
        width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px;
        padding: 13px 20px; background: #fff; border: 2px solid #E2E8F0;
        border-radius: 12px; font-size: 15px; font-weight: 700; color: #1E293B;
        cursor: pointer; transition: all .2s; margin-bottom: 10px; font-family: inherit;
      }
      .cvg-google:hover { border-color: #0D9488; background: #F0FDFA; }
      .cvg-google:disabled { opacity:.6; cursor:not-allowed; }
      .cvg-input {
        width: 100%; padding: 14px 16px; border: 2px solid #E2E8F0;
        border-radius: 12px; font-size: 16px; color: #1E293B; outline: none;
        margin-bottom: 12px; font-family: inherit; transition: border-color .2s;
        letter-spacing: .5px;
      }
      .cvg-input:focus { border-color: #0D9488; }
      .cvg-submit {
        width: 100%; padding: 14px; background: #0D9488; color: #fff;
        border: none; border-radius: 12px; font-size: 15px; font-weight: 700;
        cursor: pointer; transition: background .2s; font-family: inherit;
      }
      .cvg-submit:hover { background: #14B8A6; }
      .cvg-submit:disabled { opacity:.6; cursor:not-allowed; }
      .cvg-err {
        background: #FEF2F2; color: #EF4444; padding: 10px 14px;
        border-radius: 8px; font-size: 13px; margin-bottom: 12px; display: none;
      }
      .cvg-note { font-size: 12px; color: #94A3B8; text-align: center; margin-top: 14px; }
      .cvg-divider { border: none; border-top: 1px solid #F1F5F9; margin: 18px 0; }
    `;
    document.head.appendChild(s);
  }

  // ── MODAL: SIGN IN ───────────────────────────────────────
  function showSignInModal(href) {
    injectStyles();
    sessionStorage.setItem(PENDING_KEY, href);
    removeModal('cvg-signin');

    var el = document.createElement('div');
    el.className = 'cvg-overlay';
    el.id = 'cvg-signin';
    el.innerHTML =
      '<div class="cvg-modal">' +
        '<button class="cvg-close" onclick="cvgClose(\'cvg-signin\')">×</button>' +
        '<div class="cvg-emoji">💬</div>' +
        '<div class="cvg-title">Sign in to connect</div>' +
        '<div class="cvg-sub">Join free to chat with our mentors on WhatsApp &amp; Telegram. Takes just 10 seconds.</div>' +
        '<button class="cvg-google" id="cvg-goog-btn" onclick="cvgGoogleLogin()">' +
          '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>' +
          'Continue with Google' +
        '</button>' +
        '<div class="cvg-note">🔒 Free forever. No spam. We never share your data.</div>' +
      '</div>';

    document.body.appendChild(el);
    el.addEventListener('click', function (e) { if (e.target === el) cvgClose('cvg-signin'); });
  }

  // ── MODAL: PHONE ─────────────────────────────────────────
  function showPhoneModal(session, href) {
    injectStyles();
    window._cvgSession = session;
    window._cvgHref = href;
    removeModal('cvg-phone');

    var el = document.createElement('div');
    el.className = 'cvg-overlay';
    el.id = 'cvg-phone';
    el.innerHTML =
      '<div class="cvg-modal">' +
        '<div class="cvg-emoji">📱</div>' +
        '<div class="cvg-title">Almost there!</div>' +
        '<div class="cvg-sub">Enter your WhatsApp number so our mentor can reach you directly.</div>' +
        '<div class="cvg-err" id="cvg-ph-err"></div>' +
        '<input class="cvg-input" id="cvg-ph-inp" type="tel" placeholder="+91 98765 43210" maxlength="15" autocomplete="tel">' +
        '<button class="cvg-submit" id="cvg-ph-btn" onclick="cvgSavePhone()">Save &amp; Open →</button>' +
        '<div class="cvg-note">Used only to connect you with your CampusVazhi mentor.</div>' +
      '</div>';

    document.body.appendChild(el);

    setTimeout(function () {
      var inp = document.getElementById('cvg-ph-inp');
      if (inp) { inp.focus(); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') window.cvgSavePhone(); }); }
    }, 150);
  }

  function removeModal(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

  // ── GLOBAL FUNCTIONS ─────────────────────────────────────
  window.cvgClose = function (id) { removeModal(id); };

  window.cvgGoogleLogin = function () {
    var btn = document.getElementById('cvg-goog-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Redirecting to Google…'; }
    if (typeof cvSupabase === 'undefined') {
      alert('Auth not loaded. Please refresh and try again.');
      return;
    }
    cvSupabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });
  };

  window.cvgSavePhone = async function () {
    var inp = document.getElementById('cvg-ph-inp');
    var btn = document.getElementById('cvg-ph-btn');
    var err = document.getElementById('cvg-ph-err');
    var phone = (inp ? inp.value : '').trim();

    if (!phone || phone.replace(/\D/g, '').length < 7) {
      err.textContent = 'Please enter a valid WhatsApp number (at least 7 digits).';
      err.style.display = 'block'; return;
    }
    err.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Saving…';

    var session = window._cvgSession;
    var ok = await savePhone(phone, session);

    if (ok) {
      removeModal('cvg-phone');
      var url = window._cvgHref || sessionStorage.getItem(PENDING_KEY);
      sessionStorage.removeItem(PENDING_KEY);
      if (url) window.open(url, '_blank');
    } else {
      err.textContent = 'Could not save number. Please try again.';
      err.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Save & Open →';
    }
  };

  // ── CLICK INTERCEPTOR ────────────────────────────────────
  async function handleChatClick(e, anchor) {
    var href = anchor.getAttribute('href');
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!isSignedIn()) {
      showSignInModal(href);
      return;
    }

    var session = await getSession();
    if (!session) { showSignInModal(href); return; }

    var phone = await getPhone(session);
    if (!phone) { showPhoneModal(session, href); return; }

    // All good — open
    window.open(href, '_blank');
  }

  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href]');
    if (anchor && isChatLink(anchor.getAttribute('href'))) {
      handleChatClick(e, anchor);
    }
  }, true);

  // ── POST GOOGLE REDIRECT HANDLER ─────────────────────────
  // After Google OAuth redirect back to page, check pending URL + missing phone
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(async function () {
      var pending = sessionStorage.getItem(PENDING_KEY);
      if (!pending) return; // Nothing waiting

      if (!isSignedIn()) return; // Auth didn't complete

      var session = await getSession();
      if (!session) return;

      var phone = await getPhone(session);
      if (!phone) {
        showPhoneModal(session, pending);
      } else {
        sessionStorage.removeItem(PENDING_KEY);
        window.open(pending, '_blank');
      }
    }, 1000); // wait for supabase-client.js to finish handleAuthCallback
  });

})();
