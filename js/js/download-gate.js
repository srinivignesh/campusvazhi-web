// CampusVazhi — Download Course Picker
// When user clicks any download/resource link, show a quick dropdown
// asking UG / MBA / Others before proceeding. No sign-in required.
(function(){
  // Skip if preference already saved
  var savedPref = localStorage.getItem('cv_course_pref');

  function createPicker(downloadUrl, triggerEl) {
    // If already saved, just download
    if (savedPref) {
      // Track download
      if (typeof cvTrack === 'function') {
        cvTrack('resource_download', { course: savedPref, url: downloadUrl });
      }
      window.open(downloadUrl, '_blank');
      return;
    }

    // Remove any existing picker
    var old = document.getElementById('cvCoursePicker');
    if (old) old.remove();

    // Create picker overlay
    var overlay = document.createElement('div');
    overlay.id = 'cvCoursePicker';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,27,45,0.6);backdrop-filter:blur(3px);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;animation:cvPickFade 0.2s ease';

    overlay.innerHTML = '<style>@keyframes cvPickFade{from{opacity:0}to{opacity:1}}@keyframes cvPickSlide{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}</style>'
      + '<div style="background:#fff;max-width:360px;width:100%;border-radius:14px;padding:28px 24px;position:relative;animation:cvPickSlide 0.25s ease 0.05s both;box-shadow:0 16px 48px rgba(0,0,0,0.2)">'
      + '<div style="font-size:18px;font-weight:700;color:#0F1B2D;margin-bottom:6px">What are you preparing for?</div>'
      + '<p style="font-size:13px;color:#6B7280;margin:0 0 18px;line-height:1.5">Quick pick so we can personalise your resources.</p>'
      + '<div id="cvPickOptions" style="display:flex;flex-direction:column;gap:8px">'
      + '<button data-course="UG" style="display:flex;align-items:center;gap:10px;padding:12px 16px;border:1.5px solid #E5E7EB;border-radius:10px;background:#fff;font-size:14px;font-weight:600;color:#0F1B2D;cursor:pointer;font-family:inherit;transition:all 0.15s;text-align:left"><span style="width:32px;height:32px;min-width:32px;border-radius:8px;background:#F0FDFA;display:flex;align-items:center;justify-content:center;font-size:16px">&#127891;</span>UG (Engineering / Medical)</button>'
      + '<button data-course="MBA" style="display:flex;align-items:center;gap:10px;padding:12px 16px;border:1.5px solid #E5E7EB;border-radius:10px;background:#fff;font-size:14px;font-weight:600;color:#0F1B2D;cursor:pointer;font-family:inherit;transition:all 0.15s;text-align:left"><span style="width:32px;height:32px;min-width:32px;border-radius:8px;background:#FEF3C7;display:flex;align-items:center;justify-content:center;font-size:16px">&#128188;</span>MBA / Management</button>'
      + '<button data-course="Others" style="display:flex;align-items:center;gap:10px;padding:12px 16px;border:1.5px solid #E5E7EB;border-radius:10px;background:#fff;font-size:14px;font-weight:600;color:#0F1B2D;cursor:pointer;font-family:inherit;transition:all 0.15s;text-align:left"><span style="width:32px;height:32px;min-width:32px;border-radius:8px;background:#EDE9FE;display:flex;align-items:center;justify-content:center;font-size:16px">&#127775;</span>Others / Exploring</button>'
      + '</div>'
      + '</div>';

    document.body.appendChild(overlay);

    // Add hover effects
    var btns = overlay.querySelectorAll('#cvPickOptions button');
    btns.forEach(function(btn) {
      btn.addEventListener('mouseenter', function() {
        btn.style.borderColor = '#0D9488';
        btn.style.background = '#F0FDFA';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.borderColor = '#E5E7EB';
        btn.style.background = '#fff';
      });

      btn.addEventListener('click', function() {
        var course = btn.getAttribute('data-course');
        localStorage.setItem('cv_course_pref', course);
        savedPref = course;

        // Save to Supabase if we have user info
        try {
          var sbUrl = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_URL) || '';
          var sbKey = (typeof CV_CONFIG !== 'undefined' && CV_CONFIG.SUPABASE_ANON_KEY) || '';
          var user = JSON.parse(localStorage.getItem('cv_user') || '{}');
          if (sbUrl && sbKey && user.phone) {
            fetch(sbUrl + '/rest/v1/leads', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': sbKey,
                'Authorization': 'Bearer ' + sbKey,
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({ name: user.name || '', phone: user.phone, goal: course, source: 'download_picker_' + window.location.pathname, created_at: new Date().toISOString() })
            });
          }
        } catch(e) {}

        // Track
        if (typeof cvTrack === 'function') {
          cvTrack('resource_download', { course: course, url: downloadUrl });
        }

        overlay.remove();
        window.open(downloadUrl, '_blank');
      });
    });

    // Close on backdrop click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
  }

  // Intercept all download links
  // Targets: links with download attribute, links to PDFs, links with class containing "download"
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[download], a[href$=".pdf"], a.download-btn, a.resource-download, button.download-btn, [data-download]');
    if (!link) return;

    var url = link.getAttribute('href') || link.getAttribute('data-download') || '';
    if (!url || url === '#') return;

    e.preventDefault();
    e.stopPropagation();
    createPicker(url, link);
  }, true);
})();
