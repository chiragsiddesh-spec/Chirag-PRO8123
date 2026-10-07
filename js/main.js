

/**
 * CHIRAG SIDDESH // COMPUTER SCIENCE PORTFOLIO
 * THEME: Subtle Premium Anime-Inspired Aesthetic
 * Interactive Core, Audio Synthesis, Particles, Avatar Mode & Easter Eggs
 */

(function () {
  'use strict';

  // State Management
  const state = {
    soundEnabled: false,
    particlesActive: true,
    opCursorEnabled: true,
    currentAvatar: 'real', // 'real' | 'avatar'
    audioCtx: null
  };

  /* ==========================================================================
     1. WEB AUDIO API SYNTHESIZER (NO EXTERNAL AUDIO FILES NEEDED)
     ========================================================================== */
  function initAudio() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        state.audioCtx = new AudioContext();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function playUiBlip(freq = 520, type = 'sine', duration = 0.08) {
    if (!state.soundEnabled || !state.audioCtx) return;
    try {
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio synthesis issue:', e);
    }
  }

  function playPowerUpSound() {
    if (!state.soundEnabled || !state.audioCtx) return;
    try {
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, state.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, state.audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.05, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn('Audio synthesis issue:', e);
    }
  }

  /* ==========================================================================
     2. ATMOSPHERIC SAKURA (CHERRY BLOSSOM) FALLING FLOWERS & PARTICLES ENGINE
     ========================================================================== */
  const canvas = document.getElementById('particles-canvas');
  let ctx = null;
  let flowerPetals = [];
  let mouse = { x: -100, y: -100, vx: 0, vy: 0 };
  let prevMouse = { x: -100, y: -100 };

  if (canvas) {
    ctx = canvas.getContext('2d');
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color palette: authentic Japanese Sakura hues + brand warm orange blossom tones
    const sakuraColors = [
      'rgba(255, 183, 197, ', // Classic cherry blossom pink
      'rgba(254, 205, 211, ', // Soft rose petal
      'rgba(251, 207, 232, ', // Delicate blush
      'rgba(244, 114, 182, ', // Vibrant magenta accent
      'rgba(254, 215, 170, ', // Warm peach petal
      'rgba(255, 133, 46, '   // Brand orange blossom accent
    ];

    // Flower count calibrated for silky 60 FPS performance
    const petalCount = 48;
    for (let i = 0; i < petalCount; i++) {
      const isFlower = Math.random() < 0.16; // 16% are complete 5-petal blossoms
      const depth = Math.random(); // 0 (far/small/slow) to 1 (near/large/fast)

      flowerPetals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height + 200) - 200,
        size: isFlower ? 12 + depth * 10 : 8 + depth * 10,
        speedY: 0.75 + depth * 1.4,
        speedX: 0.35 + depth * 0.75,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayRadius: 1.2 + depth * 1.8,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.025,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.02 + Math.random() * 0.035,
        opacity: 0.45 + depth * 0.45,
        color: sakuraColors[Math.floor(Math.random() * sakuraColors.length)],
        isFlower: isFlower,
        depth: depth
      });
    }

    window.addEventListener('mousemove', (e) => {
      mouse.vx = e.clientX - prevMouse.x;
      mouse.vy = e.clientY - prevMouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      prevMouse.x = e.clientX;
      prevMouse.y = e.clientY;
    });

    // Helper: Draw authentic single curved Sakura petal with notch
    function drawSakuraPetal(ctx, p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      // 3D tumbling oscillation effect
      const flipScale = Math.cos(p.flipAngle);
      ctx.scale(flipScale, 1);

      ctx.beginPath();
      // Base point
      ctx.moveTo(0, 0);
      // Left curve
      ctx.bezierCurveTo(-p.size * 0.5, -p.size * 0.3, -p.size * 0.65, -p.size * 0.85, -p.size * 0.15, -p.size);
      // Sakura tip notch
      ctx.lineTo(0, -p.size * 0.88);
      ctx.lineTo(p.size * 0.15, -p.size);
      // Right curve back to base
      ctx.bezierCurveTo(p.size * 0.65, -p.size * 0.85, p.size * 0.5, -p.size * 0.3, 0, 0);

      ctx.fillStyle = p.color + p.opacity + ')';
      ctx.fill();

      // Subtle center vein
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -p.size * 0.65);
      ctx.strokeStyle = p.color + (p.opacity * 0.45) + ')';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    // Helper: Draw complete 5-petal Sakura blossom flower
    function drawSakuraBlossom(ctx, p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const flipScale = Math.cos(p.flipAngle);
      ctx.scale(flipScale * 0.88, 0.88);

      // Draw 5 radiating petals
      for (let k = 0; k < 5; k++) {
        ctx.save();
        ctx.rotate((k * 2 * Math.PI) / 5);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size * 0.35, -p.size * 0.25, -p.size * 0.48, -p.size * 0.65, -p.size * 0.12, -p.size * 0.78);
        ctx.lineTo(0, -p.size * 0.7);
        ctx.lineTo(p.size * 0.12, -p.size * 0.78);
        ctx.bezierCurveTo(p.size * 0.48, -p.size * 0.65, p.size * 0.35, -p.size * 0.25, 0, 0);
        ctx.fillStyle = p.color + (p.opacity * 0.95) + ')';
        ctx.fill();
        ctx.restore();
      }

      // Golden central pistil
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#fbbf24';
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    function animateSakuraFlowers() {
      if (!state.particlesActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(animateSakuraFlowers);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flowerPetals.forEach((p) => {
        // Natural sinusoidal swaying motion
        p.swayPhase += p.swaySpeed;
        const currentSway = Math.sin(p.swayPhase) * p.swayRadius;

        p.x += p.speedX + currentSway;
        p.y += p.speedY;
        p.angle += p.angularSpeed;
        p.flipAngle += p.flipSpeed;

        // Subtle interactive wind draft on cursor proximity
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 1) {
          const force = (130 - dist) / 130;
          p.x += (dx / dist) * force * 3.5;
          p.y += (dy / dist) * force * 2.5;
        }

        // Screen boundary wrap
        if (p.y > canvas.height + 40) {
          p.y = -30;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 40) {
          p.x = -20;
        } else if (p.x < -40) {
          p.x = canvas.width + 20;
        }

        // Render petal or blossom
        if (p.isFlower) {
          drawSakuraBlossom(ctx, p);
        } else {
          drawSakuraPetal(ctx, p);
        }
      });

      requestAnimationFrame(animateSakuraFlowers);
    }
    animateSakuraFlowers();
  }

  /* ==========================================================================
     2B. PARALLAX VISUAL TRANSITIONS (HERO MOUSE PARALLAX & CARD 3D TILT)
     ========================================================================== */
  const heroSection = document.getElementById('hero');
  const heroMediaDossier = document.querySelector('.hero-media-wrapper');
  const heroBackdropGlow = document.querySelector('.hero-backdrop-glow');
  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  if (heroSection && heroMediaDossier) {
    window.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        targetParallaxX = nx * 14;
        targetParallaxY = ny * 14;
      }
    });

    function renderHeroParallax() {
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.08;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.08;

      if (heroMediaDossier) {
        heroMediaDossier.style.transform = `translate3d(${currentParallaxX.toFixed(2)}px, ${currentParallaxY.toFixed(2)}px, 0)`;
      }
      if (heroBackdropGlow) {
        heroBackdropGlow.style.transform = `translate3d(${(-currentParallaxX * 1.5).toFixed(2)}px, ${(-currentParallaxY * 1.5).toFixed(2)}px, 0)`;
      }

      requestAnimationFrame(renderHeroParallax);
    }
    renderHeroParallax();
  }

  // Interactive 3D Tilt Parallax on Project Cards
  document.querySelectorAll('.project-panel-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* ==========================================================================
     3. AVATAR SWITCHER (REAL PHOTO <-> ANIME AVATAR)
     ========================================================================== */
  const photoImg = document.getElementById('hero-profile-image');
  const btnReal = document.getElementById('switch-real-btn');
  const btnAvatar = document.getElementById('switch-avatar-btn');
  const hudSensorLabel = document.getElementById('hud-sensor-type');

  function setAvatarMode(mode) {
    if (!photoImg) return;
    initAudio();
    playUiBlip(680, 'triangle', 0.1);

    state.currentAvatar = mode;

    photoImg.style.opacity = '0';
    setTimeout(() => {
      if (mode === 'avatar') {
        photoImg.src = 'assets/anime_avatar.jpg';
        photoImg.alt = 'Chirag Siddesh Anime Avatar';
        if (hudSensorLabel) hudSensorLabel.textContent = 'MODE: DIGITAL AVATAR';
        btnAvatar?.classList.add('active');
        btnReal?.classList.remove('active');
      } else {
        photoImg.src = 'assets/chirag_photo.jpeg';
        photoImg.alt = 'Chirag Siddesh Photograph';
        if (hudSensorLabel) hudSensorLabel.textContent = 'MODE: VERIFIED PHOTO';
        btnReal?.classList.add('active');
        btnAvatar?.classList.remove('active');
      }
      photoImg.style.opacity = '1';
    }, 180);
  }

  btnReal?.addEventListener('click', () => setAvatarMode('real'));
  btnAvatar?.addEventListener('click', () => setAvatarMode('avatar'));

  /* ==========================================================================
     4. PROJECTS FILTERING & CASE FILE MODAL
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-panel-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      initAudio();
      playUiBlip(480, 'sine', 0.05);

      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project Dossier Modal
  const modalOverlay = document.getElementById('project-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-case-title');
  const modalSubtitle = document.getElementById('modal-case-subtitle');
  const modalImage = document.getElementById('modal-case-image');
  const modalDesc = document.getElementById('modal-case-desc');
  const modalSpecs = document.getElementById('modal-case-specs');
  const modalTechStack = document.getElementById('modal-case-stack');
  const modalGithubLink = document.getElementById('modal-github-link');

  const projectDetails = {
    'lost-found': {
      title: 'COLLEGE LOST & FOUND',
      subtitle: 'CASE FILE // CAMPUS RECOVERY PLATFORM',
      image: 'assets/proj_lost_found.jpg',
      desc: 'A production-oriented campus system designed to alleviate the daily friction of lost items across college departments, labs, and dorms. Features categorical filtering, photo verification, secure claiming workflows, and staff administration.',
      specs: [
        'Architecture: Layered MVC with relational schema design',
        'Authentication: Role-based access for students and campus admins',
        'Query Optimization: Indexed category and location search filters',
        'Status Lifecycle: Reported → Verifying → Claimed → Archived'
      ],
      tech: ['Java / Python', 'HTML5 / Modern CSS', 'SQLite / PostgreSQL', 'RESTful API']
    },
    'algo-visual': {
      title: 'ALGO-VISUALIZER // PATHFINDING ENGINE',
      subtitle: 'CASE FILE // GRAPH THEORY & HEURISTIC SEARCH',
      image: 'assets/proj_algo_visual.jpg',
      desc: 'An interactive algorithmic visualization tool demonstrating pathfinding and graph traversal algorithms in real-time. Allows users to draw dynamic barrier mazes, tune heuristic weights, and inspect step-by-step frontier expansions.',
      specs: [
        'Algorithms: Dijkstra, A* (Manhattan / Euclidean), BFS, DFS',
        'Visuals: 60 FPS animation loop with customizable speed multiplier',
        'Data Structures: Min-Heap priority queues, 2D adjacency grids',
        'Metrics: Real-time path cost, nodes visited, and execution time'
      ],
      tech: ['C++', 'JavaScript (ES6+)', 'HTML5 Canvas', 'Data Structures']
    },
    'iot-telemetry': {
      title: 'SMART WASTE MONITOR // IOT & DASHBOARD',
      subtitle: 'CASE FILE // HARDWARE TELEMETRY & CLOUD CONSOLE',
      image: 'assets/proj_iot_telemetry.jpg',
      desc: 'An intelligent hardware and software solution engineered to automate waste level monitoring across university facilities. Ultrasonic sensors report fill percentages to a central web telemetry dashboard to prevent overflows and optimize collection schedules.',
      specs: [
        'Hardware: Ultrasonic HC-SR04 sensors + Microcontroller unit',
        'Telemetry: Real-time capacity alerts at 80% & 95% fill thresholds',
        'Web Console: Responsive interactive map with node status indicators',
        'Efficiency: Reduces unnecessary manual campus collection rounds'
      ],
      tech: ['C++ / Embedded', 'IoT Sensors', 'Web Telemetry Dashboard', 'Chart.js']
    }
  };

  document.querySelectorAll('[data-open-case]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const caseId = trigger.getAttribute('data-open-case');
      const data = projectDetails[caseId];
      if (!data || !modalOverlay) return;

      initAudio();
      playUiBlip(620, 'sine', 0.1);

      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.subtitle;
      modalImage.src = data.image;
      modalDesc.textContent = data.desc;

      // Populate specs
      modalSpecs.innerHTML = '';
      data.specs.forEach((spec) => {
        const li = document.createElement('li');
        li.textContent = spec;
        modalSpecs.appendChild(li);
      });

      // Populate tech
      modalTechStack.innerHTML = '';
      data.tech.forEach((t) => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t;
        modalTechStack.appendChild(span);
      });

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (!modalOverlay) return;
    initAudio();
    playUiBlip(320, 'sine', 0.08);
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  /* ==========================================================================
     5. EASTER EGGS & SYSTEM ONLINE HUD
     ========================================================================== */
  const systemOverlay = document.getElementById('system-online-overlay');
  const systemCloseBtn = document.getElementById('system-online-close');
  const triggerSysBtn = document.getElementById('trigger-system-online');

  function triggerProtagonistMode() {
    initAudio();
    playPowerUpSound();

    if (systemOverlay) {
      systemOverlay.classList.add('active');
    }

    // Trigger speedlines burst
    const speedlines = document.querySelector('.speedlines-overlay');
    if (speedlines) {
      speedlines.classList.add('active');
      setTimeout(() => speedlines.classList.remove('active'), 2500);
    }
  }

  function closeSystemOverlay() {
    if (!systemOverlay) return;
    playUiBlip(360, 'sine', 0.08);
    systemOverlay.classList.remove('active');
  }

  triggerSysBtn?.addEventListener('click', triggerProtagonistMode);
  systemCloseBtn?.addEventListener('click', closeSystemOverlay);
  systemOverlay?.addEventListener('click', (e) => {
    if (e.target === systemOverlay) closeSystemOverlay();
  });

  // Hotkey Trigger: Shift + S or Ctrl + K
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeSystemOverlay();
    }
    if ((e.shiftKey && e.key.toLowerCase() === 's') || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      triggerProtagonistMode();
    }
  });

  // Scroll Completion Stamp Easter Egg (100% Page Scroll)
  const stampToast = document.getElementById('scroll-stamp-toast');
  let stampShown = false;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollPos >= docHeight - 80 && !stampShown) {
      stampShown = true;
      if (stampToast) {
        stampToast.classList.add('active');
        initAudio();
        playUiBlip(720, 'sine', 0.15);
        setTimeout(() => {
          stampToast.classList.remove('active');
        }, 6000);
      }
    }

    // Header blur/border on scroll
    const header = document.querySelector('.site-header');
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  /* ==========================================================================
     6. AUDIO TOGGLE & HUD CONTROLS
     ========================================================================== */
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const hudSoundToggle = document.getElementById('hud-ctrl-sound');

  function toggleSound() {
    initAudio();
    state.soundEnabled = !state.soundEnabled;
    const soundText = state.soundEnabled ? 'SFX: ON' : 'SFX: OFF';

    if (soundToggleBtn) {
      soundToggleBtn.innerHTML = state.soundEnabled ? '🔊' : '🔇';
      soundToggleBtn.classList.toggle('active', state.soundEnabled);
    }
    if (hudSoundToggle) {
      hudSoundToggle.innerHTML = (state.soundEnabled ? '🔊 ' : '🔇 ') + soundText;
      hudSoundToggle.classList.toggle('active', state.soundEnabled);
    }

    if (state.soundEnabled) {
      playUiBlip(600, 'sine', 0.1);
      showToast('AUDIO HUD: SYNTHESIZER ONLINE');
    } else {
      showToast('AUDIO HUD: MUTED');
    }
  }

  soundToggleBtn?.addEventListener('click', toggleSound);
  hudSoundToggle?.addEventListener('click', toggleSound);

  // Particles & Falling Flowers Toggle
  const hudParticlesToggle = document.getElementById('hud-ctrl-particles');
  hudParticlesToggle?.addEventListener('click', () => {
    state.particlesActive = !state.particlesActive;
    hudParticlesToggle.classList.toggle('active', state.particlesActive);
    hudParticlesToggle.innerHTML = `🌸 FLOWERS: ${state.particlesActive ? 'ON' : 'OFF'}`;
    showToast(`ATMOSPHERE: ${state.particlesActive ? 'SAKURA FLOWERS ACTIVE' : 'FLOWERS DORMANT'}`);
  });

  /* ==========================================================================
     7. TOAST NOTIFICATIONS & EMAIL COPY
     ========================================================================== */
  const hudToast = document.getElementById('hud-toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout = null;

  function showToast(msg) {
    if (!hudToast || !toastMessage) return;
    toastMessage.textContent = msg;
    hudToast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      hudToast.classList.remove('visible');
    }, 3200);
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  copyEmailBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    initAudio();
    playUiBlip(750, 'sine', 0.08);

    const email = 'cchiragsiddesh@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('COPIED TO CLIPBOARD: ' + email);
    }).catch(() => {
      showToast('DIRECT CONTACT: ' + email);
    });
  });

  /* ==========================================================================
     8. CONTACT FORM SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('portfolio-contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    initAudio();
    playPowerUpSound();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const msgInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : 'Recruiter / Collaborator';
    const senderEmail = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput && subjectInput.value.trim() ? subjectInput.value.trim() : 'Portfolio Contact / Inquiry';
    const msg = msgInput ? msgInput.value.trim() : '';

    // Direct mailto dispatch to cchiragsiddesh@gmail.com
    const mailtoUrl = `mailto:cchiragsiddesh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${msg}`)}`;
    window.location.href = mailtoUrl;

    showToast(`TRANSMISSION DISPATCHED // OPENING MAIL CLIENT FOR ${name.toUpperCase()}!`);

    // Reset fields
    if (contactForm) contactForm.reset();
  });

  /* ==========================================================================
     9. VERTICAL SIDEBAR NAVIGATION & MOBILE DRAWER
     ========================================================================== */
  const verticalSidebar = document.getElementById('vertical-sidebar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const verticalNavLinks = document.querySelectorAll('.vertical-nav-link');

  function openSidebar() {
    initAudio();
    playUiBlip(560, 'sine', 0.06);
    verticalSidebar?.classList.add('open');
    sidebarBackdrop?.classList.add('active');
    if (mobileToggle) mobileToggle.innerHTML = '✕';
    document.body.style.overflow = window.innerWidth <= 1024 ? 'hidden' : '';
  }

  function closeSidebar() {
    verticalSidebar?.classList.remove('open');
    sidebarBackdrop?.classList.remove('active');
    if (mobileToggle) mobileToggle.innerHTML = '☰';
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', () => {
    if (verticalSidebar?.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  sidebarBackdrop?.addEventListener('click', closeSidebar);

  verticalNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      initAudio();
      playUiBlip(640, 'triangle', 0.05);
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });

  /* ==========================================================================
     9A. SCROLLSPY // ACTIVE VERTICAL NAV LINK HIGHLIGHTER
     ========================================================================== */
  const sectionIds = ['hero', 'about', 'projects', 'skills', 'quests', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 180;
    let currentId = '';

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
        break;
      }
    }

    if (!currentId && sections.length > 0) {
      currentId = sections[0].getAttribute('id');
    }

    verticalNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  window.addEventListener('resize', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ==========================================================================
     9B. NIGHT / DAY MODE THEME ENGINE (CSS MEDIA QUERY DETECTION & TOGGLE)
     ========================================================================== */
  const navThemeBtn = document.getElementById('theme-toggle-btn');
  const navThemeIcon = document.getElementById('nav-theme-icon');
  const navThemeText = document.getElementById('nav-theme-text');
  const mobileThemeBtn = document.getElementById('mobile-theme-toggle-btn');
  const mobileThemeIcon = document.getElementById('mobile-nav-theme-icon');
  const heroThemeBtn = document.getElementById('hero-theme-toggle');
  const heroThemeIcon = document.getElementById('hero-theme-icon');
  const heroThemeLabel = document.getElementById('hero-theme-label');

  // CSS Media Query for Browser Default Color Scheme
  const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getEffectiveTheme() {
    const saved = localStorage.getItem('chirag_portfolio_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // Fall back to CSS media query detection of default browser theme
    return darkThemeMediaQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(theme, isUserManual = false) {
    if (isUserManual) {
      localStorage.setItem('chirag_portfolio_theme', theme);
    }
    document.documentElement.setAttribute('data-theme', theme);

    const isDark = theme === 'dark';
    if (navThemeIcon) navThemeIcon.textContent = isDark ? '🌙' : '☀️';
    if (navThemeText) navThemeText.textContent = isDark ? 'NIGHT' : 'DAY';
    if (mobileThemeIcon) mobileThemeIcon.textContent = isDark ? '🌙' : '☀️';
    if (heroThemeIcon) heroThemeIcon.textContent = isDark ? '🌙' : '☀️';
    if (heroThemeLabel) heroThemeLabel.textContent = isDark ? 'NIGHT MODE' : 'DAY MODE';
  }

  function toggleTheme() {
    initAudio();
    playUiBlip(540, 'triangle', 0.08);
    const current = document.documentElement.getAttribute('data-theme') || (darkThemeMediaQuery.matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    showToast(`THEME: ${next.toUpperCase()} MODE ACTIVE`);
  }

  // Listen to OS/Browser theme changes dynamically
  darkThemeMediaQuery.addEventListener('change', (e) => {
    const hasManual = localStorage.getItem('chirag_portfolio_theme');
    if (!hasManual) {
      applyTheme(e.matches ? 'dark' : 'light', false);
      showToast(`SYSTEM THEME DETECTED: ${e.matches ? 'NIGHT' : 'DAY'} MODE`);
    }
  });

  navThemeBtn?.addEventListener('click', toggleTheme);
  mobileThemeBtn?.addEventListener('click', toggleTheme);
  heroThemeBtn?.addEventListener('click', toggleTheme);

  // Apply initial theme based on saved preference or browser media query
  applyTheme(getEffectiveTheme(), false);

  /* ==========================================================================
     10. ONE PIECE ANIME THEMED CURSOR & MOVEMENT TRAIL ENGINE
     ========================================================================== */
  const opCursorPointer = document.getElementById('op-cursor-pointer');
  const opCursorAura = document.getElementById('op-cursor-aura');
  const opTrailContainer = document.getElementById('op-trail-container');
  const opCursorToggle = document.getElementById('hud-ctrl-cursor');

  let mouseX = -100;
  let mouseY = -100;
  let auraX = -100;
  let auraY = -100;
  let prevMouseX = -100;
  let prevMouseY = -100;
  let lastParticleTime = 0;

  // Detect if device supports hover / mouse
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function initOnePieceCursor() {
    if (!isFinePointer || !opCursorPointer || !opCursorAura) return;

    if (state.opCursorEnabled) {
      document.body.classList.add('op-cursor-enabled');
    }

    // Follower animation loop with smooth lerping
    function renderCursor() {
      if (state.opCursorEnabled) {
        // Direct pointer placement
        opCursorPointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

        // Smooth follower aura lerping
        auraX += (mouseX - auraX) * 0.24;
        auraY += (mouseY - auraY) * 0.24;
        opCursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
      }
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Mouse movement event
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!state.opCursorEnabled) return;

      opCursorPointer.style.opacity = '1';
      opCursorAura.style.opacity = '1';

      const now = performance.now();
      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      const speed = Math.hypot(vx, vy);

      // Spawn movement trail while moving
      if (speed > 1.2 && now - lastParticleTime > 22 && opTrailContainer) {
        lastParticleTime = now;
        spawnTrailParticle(mouseX, mouseY, vx, vy, speed);
      }

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    });

    // Window boundaries
    document.addEventListener('mouseleave', () => {
      if (opCursorPointer) opCursorPointer.style.opacity = '0';
      if (opCursorAura) opCursorAura.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (state.opCursorEnabled) {
        if (opCursorPointer) opCursorPointer.style.opacity = '1';
        if (opCursorAura) opCursorAura.style.opacity = '1';
      }
    });

    // Interactive Hover States
    document.addEventListener('mouseover', (e) => {
      if (!state.opCursorEnabled) return;
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .manga-panel, .filter-btn, .nav-link, .contact-link-card, .btn-manga-primary, .btn-manga-secondary');
      if (isInteractive) {
        opCursorPointer.classList.add('hovering');
        opCursorAura.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (!state.opCursorEnabled) return;
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .manga-panel, .filter-btn, .nav-link, .contact-link-card, .btn-manga-primary, .btn-manga-secondary');
      if (isInteractive) {
        opCursorPointer.classList.remove('hovering');
        opCursorAura.classList.remove('hovering');
      }
    });

    // Click reaction: Conqueror's Haki Ripple & Straw Hat click
    window.addEventListener('mousedown', (e) => {
      if (!state.opCursorEnabled) return;
      opCursorPointer.classList.add('clicking');
      triggerHakiBurst(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      if (!state.opCursorEnabled) return;
      opCursorPointer.classList.remove('clicking');
    });

    // HUD Toggle Button
    opCursorToggle?.addEventListener('click', toggleOnePieceCursor);
  }

  function spawnTrailParticle(x, y, vx, vy, speed) {
    if (!opTrailContainer) return;

    const rand = Math.random();
    const driftX = (Math.random() - 0.5) * 16 - vx * 0.16;
    const driftY = (Math.random() - 0.7) * 22 - vy * 0.16;
    const rot = Math.floor(Math.random() * 80 - 40);

    if (rand < 0.22) {
      // Manga text sparkle ("✦" / "★")
      const sparkle = document.createElement('span');
      sparkle.className = 'op-trail-sparkle';
      sparkle.textContent = rand < 0.11 ? '✦' : '★';
      sparkle.style.setProperty('--tx', `${x + (Math.random() * 10 - 5)}px`);
      sparkle.style.setProperty('--ty', `${y + (Math.random() * 10 - 5)}px`);
      sparkle.style.setProperty('--drift-x', `${driftX}px`);
      sparkle.style.setProperty('--drift-y', `${driftY}px`);
      opTrailContainer.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 550);
    } else {
      // One Piece Embers: Gold Straw, Crimson Haki, or Gear Vapor
      const p = document.createElement('div');
      p.className = 'op-trail-particle';

      let size = 4 + Math.random() * 4;
      let bg = '#fbbf24';
      let shadow = '0 0 8px #f59e0b';

      if (rand < 0.55) {
        // Straw Hat Gold Ember
        bg = Math.random() > 0.5 ? '#fbbf24' : '#f59e0b';
        shadow = '0 0 10px #f59e0b, 0 0 4px #fbbf24';
      } else if (rand < 0.85) {
        // Conqueror's Crimson Haki spark
        bg = Math.random() > 0.5 ? '#ef4444' : '#dc2626';
        shadow = '0 0 10px #ef4444, 0 0 4px #b91c1c';
        size = 3 + Math.random() * 3.5;
      } else {
        // Gear Steam vapor
        bg = 'rgba(255, 255, 255, 0.5)';
        shadow = '0 0 8px rgba(255, 255, 255, 0.4)';
        size = 6 + Math.random() * 5;
      }

      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.background = bg;
      p.style.boxShadow = shadow;
      p.style.setProperty('--tx', `${x + (Math.random() * 8 - 4)}px`);
      p.style.setProperty('--ty', `${y + (Math.random() * 8 - 4)}px`);
      p.style.setProperty('--drift-x', `${driftX}px`);
      p.style.setProperty('--drift-y', `${driftY}px`);
      p.style.setProperty('--init-scale', (Math.random() * 0.4 + 0.8).toFixed(2));
      p.style.setProperty('--init-op', (Math.random() * 0.3 + 0.7).toFixed(2));
      p.style.setProperty('--rot', `${rot}deg`);

      opTrailContainer.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }
  }

  function triggerHakiBurst(x, y) {
    if (!opTrailContainer) return;
    initAudio();
    playUiBlip(780, 'sine', 0.12);

    // Shockwave ripple
    const shockwave = document.createElement('div');
    shockwave.className = 'op-haki-shockwave';
    shockwave.style.left = `${x}px`;
    shockwave.style.top = `${y}px`;
    shockwave.style.width = '42px';
    shockwave.style.height = '42px';
    opTrailContainer.appendChild(shockwave);
    setTimeout(() => shockwave.remove(), 520);

    // Radial burst of 6 golden Haki sparks
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const distance = 25 + Math.random() * 20;
      const spark = document.createElement('div');
      spark.className = 'op-trail-particle';
      spark.style.width = '4px';
      spark.style.height = '4px';
      spark.style.background = i % 2 === 0 ? '#fbbf24' : '#ef4444';
      spark.style.boxShadow = i % 2 === 0 ? '0 0 10px #f59e0b' : '0 0 10px #ef4444';
      spark.style.setProperty('--tx', `${x}px`);
      spark.style.setProperty('--ty', `${y}px`);
      spark.style.setProperty('--drift-x', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--drift-y', `${Math.sin(angle) * distance}px`);
      spark.style.setProperty('--init-scale', '1');
      spark.style.setProperty('--init-op', '1');
      spark.style.setProperty('--rot', '0deg');
      opTrailContainer.appendChild(spark);
      setTimeout(() => spark.remove(), 550);
    }
  }

  function toggleOnePieceCursor() {
    initAudio();
    state.opCursorEnabled = !state.opCursorEnabled;

    if (state.opCursorEnabled) {
      document.body.classList.add('op-cursor-enabled');
      if (opCursorToggle) {
        opCursorToggle.innerHTML = '🏴‍☠️ OP CURSOR: ON';
        opCursorToggle.classList.add('active');
      }
      if (opCursorPointer) opCursorPointer.style.opacity = '1';
      if (opCursorAura) opCursorAura.style.opacity = '1';
      playUiBlip(680, 'triangle', 0.1);
      showToast('ONE PIECE THEME: STRAW HAT CURSOR ONLINE');
    } else {
      document.body.classList.remove('op-cursor-enabled');
      if (opCursorToggle) {
        opCursorToggle.innerHTML = '🏴‍☠️ OP CURSOR: OFF';
        opCursorToggle.classList.remove('active');
      }
      if (opCursorPointer) opCursorPointer.style.opacity = '0';
      if (opCursorAura) opCursorAura.style.opacity = '0';
      playUiBlip(340, 'sine', 0.08);
      showToast('ONE PIECE CURSOR: RESTORED DEFAULT');
    }
  }

  // Initialize cursor
  initOnePieceCursor();

  /* ==========================================================================
     11. DEVELOPER CONSOLE EASTER EGG
     ========================================================================== */
  console.log(
    `%c
   ______  __  __  ____  ____     ___     ______   _____ ____ ____  ____  ______ _____ __  __
  / ____/ / / / / /  _/ / __ \\   /   |   / ____/  / ___//  _// __ \\/ __ \\/ ____// ___// / / /
 / /     / /_/ /  / /  / /_/ /  / /| |  / / __    \\__ \\ / / / / / / / / / __/   \\__ \\/ /_/ / 
/ /___  / __  / _/ /  / _, _/  / ___ | / /_/ /   ___/ // / / /_/ / /_/ / /___   ___/ / __  /  
\\____/ /_/ /_/ /___/ /_/ |_|  /_/  |_| \\____/   /____//___//_____/_____/_____/  /____/_/ /_/   

  SYSTEM STATUS: ONLINE // 3RD SEMESTER CS // PROTAGONIST MODE
  "Build. Learn. Improve."
  Press [Shift + S] to engage System Online protocol.
    `,
    'color: #ff6b00; font-family: monospace; font-weight: bold;'
  );
})();
