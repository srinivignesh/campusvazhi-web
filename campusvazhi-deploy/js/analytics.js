// ============================================
// CampusVazhi — GA4 Analytics Loader + Event Tracking
// ============================================
// Loads Google Analytics (gtag.js) using the measurement ID from CV_CONFIG.
// Include this AFTER config.js on every page.

(function() {
  var id = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.GA_MEASUREMENT_ID) || '';
  if (!id || id === 'G-XXXXXXXXXX') return; // skip if not configured

  // Load gtag.js
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);

  // ============================================
  // Custom Event Helpers
  // ============================================
  // Usage: cvTrack('event_name', { key: 'value' })
  window.cvTrack = function(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  };

  // ============================================
  // Auto-track: WhatsApp Clicks
  // ============================================
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href*="wa.me"]');
    if (link) {
      cvTrack('whatsapp_click', {
        page: window.location.pathname,
        link_url: link.href
      });
    }
  });

  // ============================================
  // Auto-track: CTA Button Clicks
  // ============================================
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('a[href*="Book-Counselling"], a[href*="counselling"], .cta-btn, .hero-cta, [class*="cta"]');
    if (btn) {
      cvTrack('cta_click', {
        page: window.location.pathname,
        button_text: (btn.textContent || '').trim().substring(0, 50),
        link_url: btn.href || ''
      });
    }
  });

  // ============================================
  // Auto-track: Outbound Link Clicks (social, etc.)
  // ============================================
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[target="_blank"]');
    if (link && link.href && !link.href.includes('campusvazhi.com') && !link.href.includes('wa.me')) {
      cvTrack('outbound_click', {
        page: window.location.pathname,
        link_url: link.href,
        link_text: (link.textContent || '').trim().substring(0, 50)
      });
    }
  });

  // ============================================
  // Auto-track: Navigation between pages
  // ============================================
  var pageName = document.title || window.location.pathname;
  cvTrack('page_context', {
    page_path: window.location.pathname,
    page_title: pageName,
    referrer: document.referrer || 'direct'
  });

  // ============================================
  // Auto-track: Login / Signup events
  // ============================================
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href*="Login"]');
    if (link) {
      cvTrack('login_click', { page: window.location.pathname });
    }
  });

  // ============================================
  // Auto-track: Quiz / Calculator starts
  // ============================================
  if (window.location.pathname.includes('After12th-Quiz') || window.location.pathname.includes('quiz')) {
    cvTrack('quiz_page_view', { quiz_type: 'after_12th' });
  }
  if (window.location.pathname.includes('TNEA-Calculator') || window.location.pathname.includes('tnea')) {
    cvTrack('calculator_page_view', { calculator_type: 'tnea_cutoff' });
  }
  if (window.location.pathname.includes('College-Compare') || window.location.pathname.includes('college-compare')) {
    cvTrack('tool_page_view', { tool_type: 'college_compare' });
  }

  // ============================================
  // Auto-track: Scroll depth (25%, 50%, 75%, 100%)
  // ============================================
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return;
    var percent = Math.round((scrollTop / docHeight) * 100);
    [25, 50, 75, 100].forEach(function(mark) {
      if (percent >= mark && !scrollMarks[mark]) {
        scrollMarks[mark] = true;
        cvTrack('scroll_depth', {
          page: window.location.pathname,
          depth: mark + '%'
        });
      }
    });
  });

  // ============================================
  // Auto-track: Time on page (30s, 60s, 120s, 300s)
  // ============================================
  var timeMarks = [30, 60, 120, 300];
  timeMarks.forEach(function(seconds) {
    setTimeout(function() {
      if (!document.hidden) {
        cvTrack('time_on_page', {
          page: window.location.pathname,
          seconds: seconds
        });
      }
    }, seconds * 1000);
  });

})();
