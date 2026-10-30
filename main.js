/**
 * Big Burger Black - Halloween Promo Interaction Engine
 * Mi Gusto Empanadas
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Spawn Ambient Flying Bats
  spawnBats();

  // 3. 3D Tilt Effect on Hero Burger Card
  setupCardTilt();

  // 4. Giveaway Form Handler & LocalStorage Registration
  setupGiveawayForm();

  // 5. Periodic Thunder Audio FX (Web Audio API, no rain, occasional strikes)
  setupPeriodicThunderAudio();

  // 6. Dynamic Live Counter Increment
  setupLiveCounter();
});

/**
 * Spawns animated bats randomly across the page
 */
function spawnBats() {
  const container = document.getElementById('batsContainer');
  if (!container) return;

  const batSvg = `
    <svg viewBox="0 0 24 16" fill="#181822" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4C10 0 6 0 3 2C0 4 0 9 2 11C4 13 8 10 11 7C11.5 8 12.5 8 13 7C16 10 20 13 22 11C24 9 24 4 21 2C18 0 14 0 12 4Z" />
    </svg>
  `;

  const totalBats = 8;
  for (let i = 0; i < totalBats; i++) {
    const bat = document.createElement('div');
    bat.className = 'bat';
    bat.innerHTML = batSvg;
    
    // Random timing & positioning
    const duration = 12 + Math.random() * 14;
    const delay = Math.random() * 10;
    const size = 18 + Math.random() * 20;

    bat.style.width = `${size}px`;
    bat.style.animationDuration = `${duration}s`;
    bat.style.animationDelay = `${delay}s`;
    bat.style.top = `${Math.random() * 80}%`;

    container.appendChild(bat);
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
 * Handles Form submission, validation, confetti explosion, coupon copy & persistence
 */
function setupGiveawayForm() {
  const form = document.getElementById('giveawayForm');
  const successBox = document.getElementById('successState');
  const emailDisplay = document.getElementById('registeredEmail');
  const copyBtn = document.getElementById('copyCodeBtn');

  if (!form) return;

  // Check if previously registered in this browser
  const savedEmail = localStorage.getItem('bbb_registered_email');
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
    const participants = JSON.parse(localStorage.getItem('bbb_participants') || '[]');
    participants.push({
      name,
      email,
      sucursal,
      date: new Date().toISOString()
    });
    localStorage.setItem('bbb_participants', JSON.stringify(participants));
    localStorage.setItem('bbb_registered_email', email);

    // Trigger Halloween Confetti Explosion
    fireHalloweenConfetti();

    // Show Success State
    displaySuccess(email, true);
  });

  function displaySuccess(email, triggerScroll) {
    form.style.display = 'none';
    successBox.style.display = 'block';
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
      navigator.clipboard.writeText('BIGBLACK15').then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '¡Copiado! 🔥';
        copyBtn.style.background = '#ff6a00';
        copyBtn.style.color = '#fff';

        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
          if (window.lucide) window.lucide.createIcons();
        }, 2200);
      });
    });
  }
}

/**
 * Spooky Halloween Confetti (Orange, Black, Toxic Green)
 */
function fireHalloweenConfetti() {
  if (typeof confetti !== 'function') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#ff6a00', '#ff841f', '#000000']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#39ff14', '#111111', '#ff6a00']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.2,
    colors: ['#9b30ff', '#ff6a00', '#39ff14']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.4,
    colors: ['#ffffff', '#000000', '#ff6a00']
  });
}

/**
 * Web Audio API synthesizer for realistic, non-constant thunder strikes
 * Pure deep rumble and acoustic cracks (zero rain, zero continuous hiss).
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
      // Trigger reflow to restart CSS animation
      void overlay.offsetWidth;
      overlay.classList.add('flash');
    }

    const sampleRate = audioCtx.sampleRate;
    const duration = 4.5; // seconds of rolling acoustic rumble
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate Pink/Brownish noise for warm low-end rumble (avoids harsh hiss)
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

    // Filter 1: Low-pass filter to completely block high frequencies (NO rain, NO hiss)
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    const now = audioCtx.currentTime;
    lowpass.frequency.setValueAtTime(140, now);
    lowpass.frequency.linearRampToValueAtTime(240, now + 0.35); // Initial clap crackle
    lowpass.frequency.exponentialRampToValueAtTime(75, now + duration);

    // Filter 2: Sub-bass resonance filter for the chest-thump rumble
    const subBass = audioCtx.createBiquadFilter();
    subBass.type = 'peaking';
    subBass.frequency.value = 65;
    subBass.Q.value = 2.2;
    subBass.gain.value = 9; // +9 dB boost to deep bass

    // Dynamic gain envelope: Thunder strike + rolling cloud echoes
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    // Sudden initial strike (50ms)
    masterGain.gain.exponentialRampToValueAtTime(0.32, now + 0.06);
    // Echo waves & rolling thunder
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
 * Micro counter that ticks up randomly to emulate live registrations
 */
function setupLiveCounter() {
  const el = document.getElementById('counterNumber');
  if (!el) return;

  let current = 1842;
  setInterval(() => {
    if (Math.random() > 0.6) {
      current += Math.floor(Math.random() * 2) + 1;
      el.textContent = current.toLocaleString('es-AR');
    }
  }, 4000);
}
