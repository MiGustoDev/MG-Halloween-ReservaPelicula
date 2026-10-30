/**
 * Big Burger Black - Edición Viernes 13 (Camp Crystal Lake)
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

  // 4. Subtle Blood Drops Rain FX
  spawnBloodDrops();

  // 5. Hero Video Player Interaction
  setupHeroVideo();

  // 6. Crystal Lake Giveaway Form Handler
  setupGiveawayForm();

  // 7. Non-constant Periodic Thunder (Web Audio API, no rain)
  setupPeriodicThunderAudio();

  // 8. Survivor Counter Ticker
  setupLiveCounter();
});

/**
 * Hero Video Player Handler
 * Handles play/pause and custom overlay transitions
 */
function setupHeroVideo() {
  const video = document.getElementById('heroVideo');
  const overlay = document.getElementById('videoPlayOverlay');
  if (!video || !overlay) return;

  overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    video.play().catch(err => {
      console.log('Video playback note:', err);
    });
  });

  video.addEventListener('play', () => {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  });

  video.addEventListener('pause', () => {
    if (video.currentTime === 0 || video.ended) {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    }
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

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Optional: unobserve once revealed for performance
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Lateral Lurkers: Jason Voorhees and Hockey Mask stalking from screen borders
 * They slide out from the lateral margins based on scroll depth and mouse movement
 */
function setupLateralLurkers() {
  const jasonLurker = document.getElementById('lurkerJason');
  const maskLurker = document.getElementById('lurkerMask');

  if (!jasonLurker && !maskLurker) return;

  let ticking = false;

  function updateLurkersOnScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight - windowHeight;
    const progress = Math.min(1, Math.max(0, scrollY / fullHeight));

    // Section 1 (Hero to Story): Jason starts peeking from right
    if (scrollY > windowHeight * 0.25) {
      jasonLurker?.classList.add('is-visible');
    } else {
      jasonLurker?.classList.remove('is-visible');
    }

    // Section 2 & 3 (Story to Ingredients): Mask emerges from left
    if (scrollY > windowHeight * 0.75 && scrollY < windowHeight * 2.5) {
      maskLurker?.classList.add('is-visible');
    } else {
      maskLurker?.classList.remove('is-visible');
    }

    // Section 4 (Sorteo / Finale): Jason stalks deeper towards form
    if (progress > 0.65) {
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

  // Initial trigger
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
 * 3D Interactive Tilt on Hero Image Card
 */
function setupCardTilt() {
  const card = document.getElementById('burgerCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

/**
 * Crystal Lake Giveaway Form Handler
 */
function setupGiveawayForm() {
  const form = document.getElementById('giveawayForm');
  const successBox = document.getElementById('successState');
  const emailDisplay = document.getElementById('registeredEmail');
  const copyBtn = document.getElementById('copyCodeBtn');

  if (!form) return;

  // Check if previously registered in this browser
  const savedEmail = localStorage.getItem('bbb_crystal_lake_email');
  if (savedEmail) {
    displaySuccess(savedEmail, false);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const sucursal = document.getElementById('userSucursal').value;

    if (!email) return;

    // Save to local storage for persistent participation
    const participants = JSON.parse(localStorage.getItem('bbb_crystal_lake_participants') || '[]');
    participants.push({
      name,
      email,
      sucursal,
      date: new Date().toISOString()
    });
    localStorage.setItem('bbb_crystal_lake_participants', JSON.stringify(participants));
    localStorage.setItem('bbb_crystal_lake_email', email);

    // Fire Slasher Confetti Explosion (Blood red, night black, lake teal)
    fireSlasherConfetti();

    // Show Success State
    displaySuccess(email, true);
  });

  function displaySuccess(email, triggerScroll) {
    form.style.display = 'none';
    successBox.style.display = 'flex';
    emailDisplay.textContent = email;

    if (window.lucide) {
      window.lucide.createIcons();
    }

    if (triggerScroll) {
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Copy Coupon Code
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('JASON13').then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '¡Copiado! 🩸';
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
 * Occasional strikes every 25-45s after initial user gesture.
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

      // Schedule first thunder strike after 5 to 9 seconds
      const initialDelay = 5000 + Math.random() * 4000;
      thunderTimer = setTimeout(() => {
        triggerThunderWithSchedule();
      }, initialDelay);
    } catch (err) {
      console.warn('AudioContext not allowed or supported:', err);
    }

    // Clean up one-time interaction listeners
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
      window.removeEventListener(evt, initAudioContext);
    });
  }

  // Listen for first user gesture to unlock browser audio policy
  ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
    window.addEventListener(evt, initAudioContext, { passive: true });
  });

  function triggerThunderWithSchedule() {
    playThunderStrike();

    // Schedule next strike at an irregular, occasional interval (every 25 to 45 seconds)
    const nextInterval = 25000 + Math.random() * 20000;
    thunderTimer = setTimeout(triggerThunderWithSchedule, nextInterval);
  }

  function playThunderStrike() {
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Trigger visual lightning flicker in sync with the thunder
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

    // Pink / Brown noise generator for warm deep acoustics
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

    // Filter 1: Low-pass filter to block high frequencies (NO rain, NO hiss)
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

    // Dynamic gain envelope: Initial strike + rolling cloud echoes
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.32, now + 0.06);
    masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.28);
    masterGain.gain.exponentialRampToValueAtTime(0.26, now + 0.65);
    masterGain.gain.exponentialRampToValueAtTime(0.12, now + 1.2);
    masterGain.gain.exponentialRampToValueAtTime(0.19, now + 1.9);
    masterGain.gain.exponentialRampToValueAtTime(0.06, now + 2.8);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Connect node chain
    noiseSource.connect(lowpass);
    lowpass.connect(subBass);
    subBass.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }
}

/**
 * Live Survivor Counter Ticker
 */
function setupLiveCounter() {
  const el = document.getElementById('counterNumber');
  if (!el) return;

  let current = 2313;
  setInterval(() => {
    if (Math.random() > 0.6) {
      current += Math.floor(Math.random() * 2) + 1;
      el.textContent = current.toLocaleString('es-AR');
    }
  }, 4500);
}
