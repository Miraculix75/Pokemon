// js/intro.js
// Stabil: Intro spielt bei erstem Besuch vollständig.
// Play-Once via localStorage. Keine starren Timer, keine HEAD-Probe.

window.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'introPlayed:v1';
  const params = new URLSearchParams(location.search);
  const FORCE_INTRO = params.has('intro');       // optional: Intro erzwingen
  const RESET_INTRO = params.has('resetIntro');  // optional: Flag löschen

  const video = document.getElementById('introVideo');
  const grid = document.querySelector('.grid');

  if (!grid) return;

  // Dev/Testing: Flag gezielt löschen
  if (RESET_INTRO) {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  // Schon gesehen? (ohne Force)
  const alreadyPlayed = (() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; }
    catch { return false; }
  })();

  if (alreadyPlayed && !FORCE_INTRO) {
    if (video) video.style.display = 'none';
    grid.style.opacity = 1;
    return;
  }

  // Altes, bewährtes Verhalten (keine Timer/HEAD-Checks)
  grid.style.opacity = 0;

  if (!video) {
    grid.style.opacity = 1;
    return;
  }

  // Autoplay-Policy absichern
  video.muted = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'auto');

  // Start versuchen; bei Blockade: Inhalte zeigen (keine Hänger)
  const playPromise = video.play?.();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      grid.style.opacity = 1;
      video.style.display = 'none';
      // Optional: Flag setzen, um Loop zu vermeiden (deaktiviere, wenn du später nochmal versuchen willst)
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    });
  }

  // Sanfte Einblendung (wie im alten Code)
  video.addEventListener('timeupdate', () => {
    const percent = video.duration ? (video.currentTime / video.duration) : 0;
    grid.style.opacity = Math.min(percent * 2, 1);
  });

  // Am Ende: Inhalte zeigen & Flag setzen
  video.addEventListener('ended', () => {
    grid.style.opacity = 1;
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  });
});
