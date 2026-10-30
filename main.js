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

  // 5. Sound Ambience FX (Synthesized Halloween Sound using Web Audio API)
  setupSpookyAudio();

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
 * Web Audio API synthesizer for spooky mysterious wind / drone ambience
 */
function setupSpookyAudio() {
  const btn = document.getElementById('audioToggle');
  const icon = document.getElementById('audioIcon');
  if (!btn) return;

  let audioCtx = null;
  let isPlaying = false;
  let droneOsc = null;
  let lfo = null;
  let gainNode = null;

  btn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isPlaying) {
      // Start ambient synth drone
      droneOsc = audioCtx.createOscillator();
      const droneOsc2 = audioCtx.createOscillator();
      lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      gainNode = audioCtx.createGain();

      droneOsc.type = 'sawtooth';
      droneOsc.frequency.value = 55; // A1 low drone

      droneOsc2.type = 'sine';
      droneOsc2.frequency.value = 55.4; // slight beating

      // Low pass filter
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;

      // LFO modulation
      lfo.frequency.value = 0.2;
      lfoGain.gain.value = 60;
      lfo.connect(filter.frequency);

      // Volume
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3);

      droneOsc.connect(filter);
      droneOsc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      droneOsc.start();
      droneOsc2.start();
      lfo.start();

      isPlaying = true;
      btn.style.background = '#ff6a00';
      btn.style.color = '#000';
      btn.title = 'Silenciar ambiente tenebroso';
    } else {
      if (gainNode) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
        setTimeout(() => {
          if (droneOsc) droneOsc.stop();
          if (lfo) lfo.stop();
          isPlaying = false;
        }, 1000);
      }
      btn.style.background = '';
      btn.style.color = '';
      btn.title = 'Activar sonido tenebroso';
    }
  });
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
