// CampusVazhi — Cookie Consent
// Lightweight banner for GA4 compliance
(function(){
  if (localStorage.getItem('cv_cookie_consent')) return;

  var banner = document.createElement('div');
  banner.id = 'cvCookieBanner';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#0F1B2D;color:#CBD5E1;padding:14px 20px;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;z-index:9999;font-size:13px;font-family:Inter,system-ui,sans-serif;box-shadow:0 -2px 16px rgba(0,0,0,0.15)';
  banner.innerHTML = '<span>We use cookies to improve your experience and analyse site usage. <a href="./privacy.html" style="color:#14B8A6;text-decoration:underline">Privacy Policy</a></span><button id="cvCookieAccept" style="background:#0D9488;color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit">Accept</button><button id="cvCookieDecline" style="background:transparent;color:#94A3B8;border:1px solid #374151;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit">Decline</button>';

  document.body.appendChild(banner);

  document.getElementById('cvCookieAccept').addEventListener('click', function(){
    localStorage.setItem('cv_cookie_consent', 'accepted');
    banner.remove();
  });

  document.getElementById('cvCookieDecline').addEventListener('click', function(){
    localStorage.setItem('cv_cookie_consent', 'declined');
    // Disable GA4 tracking
    window['ga-disable-' + ((typeof CV_CONFIG !== 'undefined' && CV_CONFIG.GA_MEASUREMENT_ID) || '')] = true;
    banner.remove();
  });
})();
