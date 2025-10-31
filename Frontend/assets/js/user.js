// user.js
(function () {
  const SAFE_JSON = (raw) => { try { return JSON.parse(raw || '{}'); } catch { return {}; } };

  function applyHeader(user) {
    const img     = document.getElementById('avatarHeader');
    const nomeEl  = document.querySelector('.user-nome');
    const emailEl = document.querySelector('.user-email');

    if (nomeEl)  nomeEl.textContent  = user.name  || 'Usuário';
    if (emailEl) emailEl.textContent = user.email || '';

    if (img) {
      const url = user.avatar_url;
      const ts  = user.avatar_updated_at; // número (Date.now())
      if (url) {
        img.onerror = () => { img.onerror = null; img.src = 'assets/imagens/avatar-default.svg'; };
        img.src = url + (ts ? ((url.includes('?') ? '&' : '?') + 't=' + ts) : '');
      } else {
        img.src = 'assets/imagens/avatar-default.svg';
      }
    }
  }

  window.VetMateUser = {
    hydrate() {
      const user = SAFE_JSON(localStorage.getItem('vm_user'));
      applyHeader(user);
    },
    saveAndHydrate(patch) {
      const cur = SAFE_JSON(localStorage.getItem('vm_user'));
      const merged = { ...cur, ...patch };
      localStorage.setItem('vm_user', JSON.stringify(merged));
      applyHeader(merged);
    },
    async refresh() {
      try {
        const API_BASE = (window.API_BASE || 'http://localhost:8081/api').replace(/\/$/, '');
        const tok = localStorage.getItem('vm_token');
        if (!tok) return;
        const r = await fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${tok}` } });
        if (!r.ok) return;
        const d = await r.json();
        this.saveAndHydrate(d.user || {});
      } catch {}
    }
  };

  document.addEventListener('DOMContentLoaded', () => window.VetMateUser.hydrate());
  window.addEventListener('storage', (e) => {
    if (e.key === 'vm_user') window.VetMateUser.hydrate();
  });
})();
