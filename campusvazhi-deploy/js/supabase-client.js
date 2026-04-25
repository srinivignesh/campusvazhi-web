// ============================================
// CampusVazhi — Supabase Client + Auth Helper
// ============================================
// Requires: config.js loaded first, then Supabase CDN

// Initialize Supabase client
var cvSupabase = window.supabase.createClient(CV_CONFIG.SUPABASE_URL, CV_CONFIG.SUPABASE_ANON_KEY);

// ---- AUTH HELPERS ----

const cvAuth = {
  // Get current session
  async getSession() {
    const { data: { session } } = await cvSupabase.auth.getSession();
    return session;
  },

  // Get current user
  async getUser() {
    const session = await this.getSession();
    if (!session) return null;
    const { data } = await cvSupabase.from('students').select('*').eq('auth_id', session.user.id).single();
    return data;
  },

  // Magic link login (email-based, no Google OAuth needed)
  async loginWithMagicLink(email) {
    const { data, error } = await cvSupabase.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin + '/CampusVazhi-Login.html?auth=callback' }
    });
    if (error) console.error('Login error:', error);
    return { data, error };
  },

  // Google login (for future use when OAuth is configured)
  async loginWithGoogle() {
    const { data, error } = await cvSupabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/' }
    });
    if (error) console.error('Login error:', error);
    return { data, error };
  },

  // Logout
  async logout() {
    document.documentElement.classList.remove('logged-in');
    document.body.classList.remove('logged-in');
    // Force sidebar hidden immediately
    var sb = document.querySelector('.sidebar');
    var pw = document.querySelector('.page-wrap');
    if (sb) sb.style.setProperty('display', 'none', 'important');
    if (pw) pw.style.setProperty('margin-left', '0', 'important');
    localStorage.removeItem('cv_signed_in');
    localStorage.removeItem('cv_user');
    await cvSupabase.auth.signOut();
    window.location.href = './campusvazhi-home-v2.html';
  },

  // Check if logged in — redirect to login page if not
  async requireAuth() {
    const session = await this.getSession();
    if (!session) {
      window.location.href = './CampusVazhi-Login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return null;
    }
    return session;
  },

  // After Google OAuth callback — create/update student profile
  async handleAuthCallback() {
    const session = await this.getSession();
    if (!session) return;

    const user = session.user;
    const { data: existing } = await cvSupabase
      .from('students')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!existing) {
      // New user — insert basic profile from Google data
      await cvSupabase.from('students').insert({
        auth_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url || null,
      });
    }

    return session;
  },

  // Complete profile (called from login page after magic link auth)
  async completeProfile(data) {
    const session = await this.getSession();
    if (!session) throw new Error('Not logged in');

    const { error } = await cvSupabase
      .from('students')
      .update({
        phone: data.phone,
        exam_target: data.exam,
        city: data.city || null,
        updated_at: new Date().toISOString(),
      })
      .eq('auth_id', session.user.id);

    if (error) throw error;
    return true;
  },

  // Listen for auth state changes
  onAuthChange(callback) {
    cvSupabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

// ---- LEAD CAPTURE HELPERS ----

const cvLeads = {
  // Save CTA lead (Get Free Guide/Kit/Roadmap/Mock modals)
  async saveCTALead(data) {
    const { error } = await cvSupabase.from('cta_leads').insert({
      name: data.name || null,
      email: data.email || null,
      phone: data.phone || null,
      exam: data.exam || null,
      source_page: window.location.pathname,
      cta_type: data.cta_type || 'general',
    });
    if (error) console.error('CTA lead save error:', error);
    return !error;
  },

  // Save counselling booking
  async saveCounsellingLead(data) {
    const { error } = await cvSupabase.from('counselling_leads').insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone,
      exam: data.exam || null,
      preferred_date: data.preferred_date || null,
      message: data.message || null,
      source_page: window.location.pathname,
    });
    if (error) console.error('Counselling lead save error:', error);
    return !error;
  },

  // Save quiz results
  async saveQuizResult(data) {
    const session = await cvAuth.getSession();
    let studentId = null;
    if (session) {
      const student = await cvAuth.getUser();
      studentId = student?.id;
    }
    const { error } = await cvSupabase.from('quiz_results').insert({
      student_id: studentId,
      answers: data.answers,
      result: data.result,
      score: data.score,
    });
    if (error) console.error('Quiz save error:', error);
    return !error;
  },

  // Save calculator result
  async saveCalculatorResult(data) {
    const session = await cvAuth.getSession();
    let studentId = null;
    if (session) {
      const student = await cvAuth.getUser();
      studentId = student?.id;
    }
    const { error } = await cvSupabase.from('calculator_saves').insert({
      student_id: studentId,
      maths_marks: data.maths,
      physics_marks: data.physics,
      chemistry_marks: data.chemistry,
      cutoff_score: data.cutoff,
    });
    if (error) console.error('Calculator save error:', error);
    return !error;
  }
};

// ---- UI HELPERS ----

const cvUI = {
  // Update nav + sidebar to show logged-in state
  async updateNav() {
    const session = await cvAuth.getSession();
    const signInBtns = document.querySelectorAll('.nav-sign-in, [onclick*="openSignin"]');
    const userPills = document.querySelectorAll('.user-pill-wrap, .user-pill, #user-pill');

    // Get sidebar and page-wrap for direct style control
    const sidebar = document.querySelector('.sidebar');
    const pageWrap = document.querySelector('.page-wrap');

    if (session) {
      document.documentElement.classList.add('logged-in');
      document.body.classList.add('logged-in');
      localStorage.setItem('cv_signed_in', '1');

      // FORCE sidebar visible via inline style (overrides any CSS)
      if (sidebar) sidebar.style.setProperty('display', 'flex', 'important');
      if (pageWrap) pageWrap.style.setProperty('margin-left', '68px', 'important');

      const student = await cvAuth.getUser();
      const name = student?.full_name || session.user.email.split('@')[0];
      const initial = name.charAt(0).toUpperCase();

      // Persist user info for sidebar across pages
      localStorage.setItem('cv_user', JSON.stringify({ name: name, initial: initial }));

      // Hide sign-in buttons
      signInBtns.forEach(btn => btn.style.display = 'none');

      // Show user pill
      userPills.forEach(pill => {
        pill.style.display = 'flex';
        const avatar = pill.querySelector('.user-initial, .user-pill-avatar');
        if (avatar) avatar.textContent = initial;
        const nameEl = pill.querySelector('.user-name');
        if (nameEl) nameEl.textContent = name;
      });

      // Update sidebar avatar
      const sbAvatar = document.getElementById('sb-avatar');
      const sbName = document.getElementById('sb-name');
      if (sbAvatar) sbAvatar.textContent = initial;
      if (sbName) sbName.textContent = name;
    } else {
      document.documentElement.classList.remove('logged-in');
      document.body.classList.remove('logged-in');
      localStorage.removeItem('cv_signed_in');
      localStorage.removeItem('cv_user');

      // FORCE sidebar hidden via inline style
      if (sidebar) sidebar.style.setProperty('display', 'none', 'important');
      if (pageWrap) pageWrap.style.setProperty('margin-left', '0', 'important');

      signInBtns.forEach(btn => btn.style.display = '');
      userPills.forEach(pill => pill.style.display = 'none');
    }
  },

  // Show a toast notification
  toast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:24px;right:24px;background:${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#0D9488'};color:#fff;padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.15);transform:translateY(20px);opacity:0;transition:all 0.3s ease`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
  }
};

// ---- AUTO-INIT ----
// Run on every page load: check auth state, update nav
document.addEventListener('DOMContentLoaded', async () => {
  await cvAuth.handleAuthCallback();
  await cvUI.updateNav();
});
