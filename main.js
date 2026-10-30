/**
 * Viernes 13 en Mi Gusto - Proyección Exclusiva en Vicente López
 * Interaction & Scroll Engine
 * Mi Gusto Empanadas
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Modern Scroll Reveal & Scroll Trigger Engine
  setupScrollReveal();

  // 3. Lateral Lurking Slasher System (Jason & Mask sliding in from edges)
  setupLateralLurkers();

  // 4. Navbar Scroll Reveal (Hidden at initial fullscreen hero, visible on scroll)
  setupNavbarScroll();

  // 5. Hero Button Smooth Scroll to Reservation Form
  setupReserveButtonScroll();

  // 6. Reservation Form Handler & LocalStorage
  setupReservationForm();

  // 7. Subtle Blood Drops Rain Particles
  spawnBloodDrops();

  // 8. Non-constant Periodic Thunder (Web Audio API, no rain)
  setupPeriodicThunderAudio();
});

/**
 * Navbar Reveal on Scroll
 * Keeps navbar invisible at top of fullscreen video, reveals it smoothly on scroll down
 */
function setupNavbarScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > window.innerHeight * 0.35) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Smooth Scroll from Hero CTA and Nav CTA to Reservation Form
 */
function setupReserveButtonScroll() {
  const reserveBtns = document.querySelectorAll('a[href="#reservar"]');
  const target = document.getElementById('reservar');
  if (!target) return;

  reserveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

/**
 * Modern IntersectionObserver Scroll Reveal Engine
 * Reveals elements with data-reveal attributes smoothly as you scroll
 */
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Lateral Lurkers: Jason Voorhees and Hockey Mask stalking from screen borders
 */
function setupLateralLurkers() {
  const jasonLurker = document.getElementById('lurkerJason');
  const maskLurker = document.getElementById('lurkerMask');
  const detallesSection = document.getElementById('detalles');

  if (!jasonLurker && !maskLurker) return;

  let ticking = false;

  function updateLurkersOnScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Verificar si el usuario se posicionó en la última sección ("Todo lo que tenés que saber") o en el footer
    let isAtEndOrFooter = false;
    if (detallesSection) {
      const rect = detallesSection.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.72) {
        isAtEndOrFooter = true;
      }
    }

    if (isAtEndOrFooter) {
      // Desaparecer Jason y la máscara por completo
      jasonLurker?.classList.remove('is-visible', 'is-deep-stalking');
      maskLurker?.classList.remove('is-visible');
      if (jasonLurker) {
        jasonLurker.style.translate = '';
      }
      ticking = false;
      return;
    }

    // Sección 1 a 2: Jason comienza a asomarse por la derecha
    if (scrollY > windowHeight * 0.35) {
      jasonLurker?.classList.add('is-visible');
    } else {
      jasonLurker?.classList.remove('is-visible');
    }

    // Sección 2 & 3: La máscara emerge por la izquierda
    if (scrollY > windowHeight * 0.7) {
      maskLurker?.classList.add('is-visible');
    } else {
      maskLurker?.classList.remove('is-visible');
    }

    // Sección de formulario: Jason acecha más profundo
    const fullHeight = document.documentElement.scrollHeight - windowHeight;
    const progress = Math.min(1, Math.max(0, scrollY / fullHeight));
    if (progress > 0.25 && progress < 0.65) {
      jasonLurker?.classList.add('is-deep-stalking');
    } else {
      jasonLurker?.classList.remove('is-deep-stalking');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateLurkersOnScroll);
      ticking = true;
    }
  }, { passive: true });

  updateLurkersOnScroll();

  // Mouse Parallax reaction on Jason
  window.addEventListener('mousemove', (e) => {
    if (!jasonLurker) return;
    const mouseXRatio = (e.clientX / window.innerWidth) - 0.5;
    const mouseYRatio = (e.clientY / window.innerHeight) - 0.5;

    if (jasonLurker.classList.contains('is-visible')) {
      const offsetX = mouseXRatio * -15;
      const offsetY = mouseYRatio * -12;
      jasonLurker.style.translate = `${offsetX}px ${offsetY}px`;
    }
  }, { passive: true });
}

/**
 * Ambient Falling Blood Drops Particles
 */
function spawnBloodDrops() {
  const container = document.getElementById('bloodParticles');
  if (!container) return;

  const totalDrops = 14;
  for (let i = 0; i < totalDrops; i++) {
    const drop = document.createElement('div');
    drop.className = 'blood-drop';

    const duration = 7 + Math.random() * 8;
    const delay = Math.random() * 8;
    const left = Math.random() * 100;
    const height = 10 + Math.random() * 12;

    drop.style.left = `${left}%`;
    drop.style.height = `${height}px`;
    drop.style.animationDuration = `${duration}s`;
    drop.style.animationDelay = `${delay}s`;

    container.appendChild(drop);
  }
}

/**
 * Intelligent Capacity Manager (Max 34 places)
 * Recauda reservas reales registradas en localStorage
 */
const TOTAL_CAPACITY = 34;
const BASE_RESERVED = 0;

function getReservedSeats() {
  const reservations = JSON.parse(localStorage.getItem('migusto_vl_reservas') || '[]');
  const extraSeats = reservations.reduce((acc, r) => acc + (parseInt(r.guests, 10) || 1), 0);
  return Math.min(TOTAL_CAPACITY, BASE_RESERVED + extraSeats);
}

function updateCapacityDisplay() {
  const reserved = getReservedSeats();
  const remaining = Math.max(0, TOTAL_CAPACITY - reserved);

  const reservedEl = document.getElementById('reservedNumber');
  const remainingEl = document.getElementById('remainingHighlight');

  if (reservedEl) reservedEl.textContent = reserved;
  if (remainingEl) {
    if (remaining > 0) {
      remainingEl.textContent = `¡Últimos ${remaining} lugares!`;
      remainingEl.style.color = '';
    } else {
      remainingEl.textContent = `¡Lugares agotados!`;
      remainingEl.style.color = '#ff1744';
    }
  }
}

/**
 * Official Reservation Form Handler
 */
function setupReservationForm() {
  const form = document.getElementById('reservaForm');
  const successBox = document.getElementById('successState');
  const nameDisplay = document.getElementById('registeredName');
  const phoneDisplay = document.getElementById('registeredPhone');
  const guestsDisplay = document.getElementById('registeredGuests');
  const copyBtn = document.getElementById('copyCodeBtn');

  // Initialize capacity counter on load
  updateCapacityDisplay();

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const guests = document.getElementById('userGuests').value;

    if (!name || !phone || !guests) return;

    // Save to local storage for persistence
    const reservations = JSON.parse(localStorage.getItem('migusto_vl_reservas') || '[]');
    reservations.push({
      name,
      phone,
      guests,
      sucursal: 'Vicente López',
      date: new Date().toISOString()
    });
    localStorage.setItem('migusto_vl_reservas', JSON.stringify(reservations));

    // Update real-time capacity counter
    updateCapacityDisplay();

    // Fire Slasher Confetti
    fireSlasherConfetti();

    // Show Success State
    form.style.display = 'none';
    if (successBox) {
      successBox.style.display = 'flex';
      if (nameDisplay) nameDisplay.textContent = name;
      if (phoneDisplay) phoneDisplay.textContent = phone;
      if (guestsDisplay) guestsDisplay.textContent = `${guests} ${guests === '1' ? 'persona' : 'personas'}`;
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // Copy Reservation Code
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('V13-VL-2026').then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '¡Copiado! 🎟️';
        copyBtn.style.background = '#8a0303';

        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.style.background = '';
          if (window.lucide) window.lucide.createIcons();
        }, 2200);
      });
    });
  }
}

/**
 * Slasher Confetti (Blood Red, Lake Teal, Dark Charcoal, Bone White)
 */
function fireSlasherConfetti() {
  if (typeof confetti !== 'function') return;

  const count = 220;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 30,
    startVelocity: 55,
    colors: ['#e50914', '#8a0303', '#111111']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#00e5a3', '#0a1410', '#e50914']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.2,
    colors: ['#e50914', '#d7c8a8', '#00e5a3']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.4,
    colors: ['#ffffff', '#04070a', '#e50914']
  });
}

/**
 * Periodic Thunder Audio Synthesizer (Web Audio API)
 * Pure rolling slasher thunder (zero rain, zero continuous hiss).
 */
function setupPeriodicThunderAudio() {
  let audioCtx = null;
  let hasUserInteracted = false;
  let thunderTimer = null;
  const overlay = document.getElementById('lightningOverlay');

  function initAudioContext() {
    if (hasUserInteracted) return;
    hasUserInteracted = true;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // First thunder strike after 6 to 10 seconds
      const initialDelay = 6000 + Math.random() * 4000;
      thunderTimer = setTimeout(() => {
        triggerThunderWithSchedule();
      }, initialDelay);
    } catch (err) {
      console.warn('AudioContext not allowed or supported:', err);
    }

    ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
      window.removeEventListener(evt, initAudioContext);
    });
  }

  ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
    window.addEventListener(evt, initAudioContext, { passive: true });
  });

  function triggerThunderWithSchedule() {
    playThunderStrike();
    const nextInterval = 28000 + Math.random() * 20000;
    thunderTimer = setTimeout(triggerThunderWithSchedule, nextInterval);
  }

  function playThunderStrike() {
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (overlay) {
      overlay.classList.remove('flash');
      void overlay.offsetWidth;
      overlay.classList.add('flash');
    }

    const sampleRate = audioCtx.sampleRate;
    const duration = 4.5;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
      b6 = white * 0.115926;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter 1: Low-pass filter (NO rain, NO hiss)
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    const now = audioCtx.currentTime;
    lowpass.frequency.setValueAtTime(140, now);
    lowpass.frequency.linearRampToValueAtTime(240, now + 0.35);
    lowpass.frequency.exponentialRampToValueAtTime(75, now + duration);

    // Filter 2: Sub-bass resonance filter for deep chest-thump punch
    const subBass = audioCtx.createBiquadFilter();
    subBass.type = 'peaking';
    subBass.frequency.value = 65;
    subBass.Q.value = 2.2;
    subBass.gain.value = 9;

    // Gain envelope
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.32, now + 0.06);
    masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.28);
    masterGain.gain.exponentialRampToValueAtTime(0.26, now + 0.65);
    masterGain.gain.exponentialRampToValueAtTime(0.12, now + 1.2);
    masterGain.gain.exponentialRampToValueAtTime(0.19, now + 1.9);
    masterGain.gain.exponentialRampToValueAtTime(0.06, now + 2.8);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(lowpass);
    lowpass.connect(subBass);
    subBass.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }
}
