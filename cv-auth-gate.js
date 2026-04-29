// ============================================================
// CampusVazhi — Auth Gate v5
//
// WhatsApp / Telegram links:
//   → Lead capture modal (Name + Phone, no Google required)
//   → Saves to cta_leads table → opens group link
//
// Mock Test links:
//   → Google Sign-In + Phone modal
//   → Saves to students table → navigates to mock test
// ============================================================
(function () {
  'use strict';

  var SB_URL = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_URL) || 'https://txyimbzkutnkaphyvifg.supabase.co';
  var SB_KEY = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_ANON_KEY) || 'sb_publishable_REz6tM-s9uOZsCElHF2FVg_N_ma-1j5';

  var PENDING_CHAT = 'cv_pending_chat';
  var PENDING_NAV  = 'cv_pending_nav';
  var PENDING_MODE = 'cv_pending_mode';

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

  function groupType(href) {
    if (!href) return 'group';
    if (href.includes('whatsapp') || href.includes('wa.me')) return 'whatsapp_group';
    if (href.includes('t.me') || href.includes('telegram')) return 'telegram_group';
    return 'group';
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

  // Save anonymous lead to cta_leads (anon key, no auth required)
  function saveLead(name, phone, ctaType) {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var exam = page.toLowerCase().includes('tancet') ? 'TANCET'
             : page.toLowerCase().includes('cat') ? 'CAT'
             : 'General';
    return fetch(SB_URL + '/rest/v1/cta_leads', {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: name || '',
        phone: phone,
        email: '',
        exam: exam,
        cta_type: ctaType || 'group_join',
        source_page: page
      })
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  // ── STYLES ───────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('cv-gate-css')) return;
    var s = document.createElement('style');
    s.id = 'cv-gate-css';
    s.textContent = [
      '.cvg-overlay{position:fixed;inset:0;background:rgba(15,27,45,0.75);display:flex;align-items:center;justify-content:center;z-index:2147483647;padding:20px;backdrop-filter:blur(5px);animation:cvgFade .2s ease}',
      '@keyframes cvgFade{from{opacity:0}to{opacity:1}}',
      '.cvg-modal{background:#fff;border-radius:20px;padding:32px;width:100%;max-width:440px;position:relative;box-shadow:0 24px 80px rgba(0,0,0,.35);animation:cvgUp .25s ease}',
      '@keyframes cvgUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}',
      '.cvg-close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:22px;color:#94A3B8;cursor:pointer;line-height:1;padding:4px;transition:color .15s}',
      '.cvg-close:hover{color:#334155}',
      '.cvg-badge{display:inline-block;background:#ECFDF5;color:#059669;font-size:11px;font-weight:800;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.04em;margin-bottom:12px}',
      '.cvg-emoji{font-size:40px;text-align:center;margin-bottom:8px}',
      '.cvg-title{font-size:20px;font-weight:900;color:#0F1B2D;text-align:center;margin-bottom:6px;line-height:1.25}',
      '.cvg-sub{font-size:13px;color:#64748B;text-align:center;line-height:1.55;margin-bottom:20px}',
      '.cvg-label{font-size:12px;font-weight:700;color:#374151;margin-bottom:5px;display:block}',
      '.cvg-field{margin-bottom:12px}',
      '.cvg-input{width:100%;padding:12px 14px;border:2px solid #E2E8F0;border-radius:10px;font-size:15px;color:#1E293B;outline:none;font-family:inherit;transition:border-color .2s;box-sizing:border-box}',
      '.cvg-input:focus{border-color:#0D9488;box-shadow:0 0 0 3px rgba(13,148,136,.08)}',
      '.cvg-input::placeholder{color:#94A3B8}',
      '.cvg-btn-primary{width:100%;padding:14px;background:#0D9488;color:#fff;border:none;border-radius:11px;font-size:15px;font-weight:800;cursor:pointer;transition:background .2s;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px}',
      '.cvg-btn-primary:hover{background:#0F766E}',
      '.cvg-btn-primary:disabled{opacity:.6;cursor:not-allowed}',
      '.cvg-divider{display:flex;align-items:center;gap:10px;margin:16px 0}',
      '.cvg-divider-line{flex:1;height:1px;background:#E2E8F0}',
      '.cvg-divider-text{font-size:12px;color:#94A3B8;font-weight:600;white-space:nowrap}',
      '.cvg-google{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 20px;background:#fff;border:2px solid #E2E8F0;border-radius:11px;font-size:14px;font-weight:700;color:#1E293B;cursor:pointer;transition:all .2s;font-family:inherit}',
      '.cvg-google:hover{border-color:#4285F4;background:#F8FAFF}',
      '.cvg-google:disabled{opacity:.6;cursor:not-allowed}',
      '.cvg-err{background:#FEF2F2;color:#DC2626;padding:10px 14px;border-radius:8px;font-size:13px;margin-top:8px;display:none;border-left:3px solid #DC2626}',
      '.cvg-note{font-size:11px;color:#94A3B8;text-align:center;margin-top:14px;line-height:1.6}'
    ].join('');
    document.head.appendChild(s);
  }

  // ── MODAL HELPERS ────────────────────────────────────────
  function removeModal(id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  }

  // ── MODAL 1: LEAD CAPTURE (WhatsApp / Telegram) ──────────
  // Name + Phone → Google Sign-In (mandatory) → save lead → open link
  function showLeadModal(href) {
    injectStyles();
    var isWA = href.includes('whatsapp') || href.includes('wa.me');
    var groupLabel = isWA ? 'WhatsApp' : 'Telegram';
    var groupEmoji = isWA ? '&#x1F4AC;' : '&#x2708;&#xFE0F;';
    sessionStorage.setItem(PENDING_CHAT, href);
    sessionStorage.setItem(PENDING_MODE, 'chat');
    removeModal('cvg-lead');

    var el = document.createElement('div');
    el.className = 'cvg-overlay';
    el.id = 'cvg-lead';
    el.innerHTML =
      '<div class="cvg-modal">' +
        '<button class="cvg-close" id="cvg-lead-close">&#x2715;</button>' +
        '<div style="text-align:center"><div class="cvg-badge">Free Community Group</div></div>' +
        '<div class="cvg-emoji">' + groupEmoji + '</div>' +
        '<div class="cvg-title">Join our ' + groupLabel + ' Group</div>' +
        '<div class="cvg-sub">Free TANCET tips, mock tests &amp; mentor support on ' + groupLabel + '. Sign in with Google to join — takes 10 seconds.</div>' +

        '<div class="cvg-field">' +
          '<label class="cvg-label">Your Name</label>' +
          '<input class="cvg-input" id="cvg-lead-name" type="text" placeholder="e.g. Priya Rajan" autocomplete="name">' +
        '</div>' +
        '<div class="cvg-field">' +
          '<label class="cvg-label">WhatsApp Number <span style="color:#EF4444">*</span></label>' +
          '<input class="cvg-input" id="cvg-lead-phone" type="tel" placeholder="+91 98765 43210" maxlength="15" autocomplete="tel">' +
        '</div>' +
        '<div class="cvg-err" id="cvg-lead-err"></div>' +

        '<button class="cvg-google" id="cvg-lead-google" style="margin-top:4px;width:100%;padding:13px 20px;font-size:15px;font-weight:800;">' +
          '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>' +
          'Continue with Google' +
        '</button>' +

        '<div class="cvg-note">&#x1F512; Free forever &nbsp;&#xB7;&nbsp; No spam &nbsp;&#xB7;&nbsp; We never share your data</div>' +
      '</div>';

    document.body.appendChild(el);

    document.getElementById('cvg-lead-close').onclick = function () { removeModal('cvg-lead'); };
    el.addEventListener('click', function (ev) { if (ev.target === el) removeModal('cvg-lead'); });

    // Google button — validate phone first, then OAuth
    document.getElementById('cvg-lead-google').onclick = function () {
      var name  = (document.getElementById('cvg-lead-name').value || '').trim();
      var phone = (document.getElementById('cvg-lead-phone').value || '').trim();
      var err   = document.getElementById('cvg-lead-err');

      if (!phone || phone.replace(/\D/g, '').length < 7) {
        err.textContent = 'Please enter your WhatsApp number before continuing.';
        err.style.display = 'block';
        document.getElementById('cvg-lead-phone').focus();
        return;
      }
      err.style.display = 'none';

      // Store in sessionStorage — used after OAuth redirect
      sessionStorage.setItem('cv_pending_phone', phone);
      if (name) sessionStorage.setItem('cv_pending_name', name);

      var gbtn = document.getElementById('cvg-lead-google');
      if (gbtn) { gbtn.disabled = true; gbtn.textContent = 'Redirecting to Google…'; }

      if (typeof cvSupabase === 'undefined') {
        alert('Auth not loaded. Please refresh and try again.');
        return;
      }
      cvSupabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href }
      });
    };

    // Enter on phone → trigger Google button
    document.getElementById('cvg-lead-phone').addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') document.getElementById('cvg-lead-google').click();
    });
    setTimeout(function () {
      var ni = document.getElementById('cvg-lead-name');
      if (ni) ni.focus();
    }, 200);
  }

  // ── MODAL 2: MOCK TEST — Google + Phone ──────────────────
  function showMockModal(href) {
    injectStyles();
    var absUrl = href;
    try { absUrl = new URL(href, window.location.href).href; } catch (e) {}
    sessionStorage.setItem(PENDING_NAV, absUrl);
    sessionStorage.setItem(PENDING_MODE, 'mock');
    removeModal('cvg-mock');

    var el = document.createElement('div');
    el.className = 'cvg-overlay';
    el.id = 'cvg-mock';
    el.innerHTML =
      '<div class="cvg-modal">' +
        '<button class="cvg-close" id="cvg-mock-close">&#x2715;</button>' +
        '<div style="text-align:center"><div class="cvg-badge">Free Mock Test</div></div>' +
        '<div class="cvg-emoji">&#x1F4DD;</div>' +
        '<div class="cvg-title">Sign in to take the test</div>' +
        '<div class="cvg-sub">Free account — track your scores, percentile &amp; progress across all mock tests.</div>' +

        '<div class="cvg-field">' +
          '<label class="cvg-label">&#x1F4F1; WhatsApp Number <span style="color:#EF4444">*</span></label>' +
          '<input class="cvg-input" id="cvg-mock-phone" type="tel" placeholder="+91 98765 43210" maxlength="15" autocomplete="tel">' +
        '</div>' +
        '<div class="cvg-err" id="cvg-mock-err"></div>' +

        '<button class="cvg-google" id="cvg-mock-google">' +
          '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>' +
          'Continue with Google' +
        '</button>' +

        '<div class="cvg-note">&#x1F512; Free forever &nbsp;·&nbsp; No spam &nbsp;·&nbsp; We never share your data</div>' +
      '</div>';

    document.body.appendChild(el);

    document.getElementById('cvg-mock-close').onclick = function () { removeModal('cvg-mock'); };
    el.addEventListener('click', function (ev) { if (ev.target === el) removeModal('cvg-mock'); });

    document.getElementById('cvg-mock-google').onclick = function () {
      var phone = (document.getElementById('cvg-mock-phone').value || '').trim();
      var err   = document.getElementById('cvg-mock-err');
      if (!phone || phone.replace(/\D/g, '').length < 7) {
        err.textContent = 'Please enter your WhatsApp number before signing in.';
        err.style.display = 'block';
        document.getElementById('cvg-mock-phone').focus();
        return;
      }
      err.style.display = 'none';
      sessionStorage.setItem('cv_pending_phone', phone);
      var gbtn = document.getElementById('cvg-mock-google');
      if (gbtn) { gbtn.disabled = true; gbtn.textContent = 'Redirecting to Google…'; }
      if (typeof cvSupabase === 'undefined') {
        alert('Auth not loaded. Please refresh and try again.');
        return;
      }
      cvSupabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href }
      });
    };

    setTimeout(function () {
      var pi = document.getElementById('cvg-mock-phone');
      if (pi) pi.focus();
    }, 200);
  }

  // ── GATE TRIGGERS ────────────────────────────────────────
  function triggerChatGate(href) {
    if (!isSignedIn()) {
      showLeadModal(href);
      return;
    }
    // Already signed in — check if phone saved
    getSession().then(function (session) {
      if (!session) { showLeadModal(href); return; }
      getPhone(session).then(function (phone) {
        if (!phone) { showLeadModal(href); return; }
        window.open(href, '_blank');
      });
    });
  }

  function triggerMockGate(href) {
    var absUrl = href;
    try { absUrl = new URL(href, window.location.href).href; } catch (e) {}
    if (!isSignedIn()) { showMockModal(absUrl); return; }
    getSession().then(function (session) {
      if (!session) { showMockModal(absUrl); return; }
      getPhone(session).then(function (phone) {
        if (!phone) { showMockModal(absUrl); return; }
        window.location.href = absUrl;
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
      if (a.dataset.cvgMode === 'chat') {
        triggerChatGate(a.dataset.cvgUrl);
      } else {
        triggerMockGate(a.dataset.cvgUrl);
      }
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

  // ── POST OAUTH REDIRECT ──────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      var mode = sessionStorage.getItem(PENDING_MODE);
      if (!mode) return;
      if (!isSignedIn()) return;

      var pendingPhone = sessionStorage.getItem('cv_pending_phone');
      var pendingName  = sessionStorage.getItem('cv_pending_name');

      getSession().then(function (session) {
        if (!session) return;

        function proceed() {
          sessionStorage.removeItem('cv_pending_phone');
          sessionStorage.removeItem('cv_pending_name');
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

        if (pendingPhone) {
          // Save phone to students table
          savePhone(pendingPhone, session).then(function () {
            // Also save lead for chat mode
            if (mode === 'chat') {
              var chatUrl = sessionStorage.getItem(PENDING_CHAT) || '';
              saveLead(pendingName || '', pendingPhone, groupType(chatUrl));
            }
            proceed();
          });
        } else {
          getPhone(session).then(function (phone) {
            if (phone) {
              proceed();
            } else {
              // Phone still missing — show the right modal
              var dest = mode === 'mock'
                ? sessionStorage.getItem(PENDING_NAV)
                : sessionStorage.getItem(PENDING_CHAT);
              if (mode === 'mock') showMockModal(dest || '');
              else showLeadModal(dest || '');
            }
          });
        }
      });
    }, 1000);
  });

})();
