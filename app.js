(() => {
  const FALLBACK_MANIFEST = {
    mode: 'scenes',
    poster: './assets/scenes/scene-01.jpg',
    scenes: [
      './assets/scenes/scene-01.jpg',
      './assets/scenes/scene-02.jpg',
      './assets/scenes/scene-03.jpg',
      './assets/scenes/scene-04.jpg'
    ]
  };

  const ACT_RANGES = [
    [0.0, 0.24],
    [0.24, 0.52],
    [0.52, 0.78],
    [0.78, 1.01]
  ];

  const ACT_TARGETS = [0.02, 0.36, 0.65, 0.92];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('cinema-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const stage = document.getElementById('cinema-stage');
  const header = document.getElementById('site-header');
  const scrollCue = document.getElementById('scroll-cue');
  const sceneIndexEl = document.getElementById('scene-index');
  const waFloat = document.getElementById('wa-float');
  const acts = Array.from(document.querySelectorAll('.act'));
  const railSteps = Array.from(document.querySelectorAll('.rail-step'));

  let manifest = FALLBACK_MANIFEST;
  let images = [];
  let currentProgress = 0;
  let targetProgress = 0;
  let activeAct = 0;
  let lenis = null;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    render(currentProgress);
  }

  function drawCover(img, scale = 1, panX = 0, panY = 0, alpha = 1) {
    if (!img || !img.complete || !img.naturalWidth) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const baseScale = Math.max(cw / iw, ch / ih) * scale;
    const dw = iw * baseScale;
    const dh = ih * baseScale;
    const dx = (cw - dw) * 0.5 + panX * cw;
    const dy = (ch - dh) * 0.5 + panY * ch;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  }

  function render(progress) {
    const p = Math.max(0, Math.min(1, progress));
    ctx.fillStyle = '#0B1F22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!images.length) return;

    if (manifest.mode === 'frames') {
      const idx = Math.min(images.length - 1, Math.round(p * (images.length - 1)));
      let img = images[idx];
      if (!img || !img.complete || !img.naturalWidth) {
        img = images.find((im) => im && im.complete && im.naturalWidth);
      }
      drawCover(img, 1.01, 0, 0, 1);
      return;
    }

    // Mode A: Smooth 4-Scene Cinematic Engine (Ken Burns + Crossfade scrubbed by scroll)
    const count = images.length;
    if (count === 1) {
      drawCover(images[0], 1 + p * 0.08, 0, 0, 1);
      return;
    }

    const scaled = p * (count - 1);
    const i = Math.min(count - 2, Math.floor(scaled));
    const localT = scaled - i; // 0..1 inside segment

    // Subtle alternating pan & dolly zoom per scene (disabled under reduced motion)
    const dir = i % 2 === 0 ? 1 : -1;
    const scaleA = prefersReducedMotion ? 1.0 : 1.0 + localT * 0.085;
    const panXA = prefersReducedMotion ? 0 : dir * (localT - 0.5) * 0.025;
    const panYA = prefersReducedMotion ? 0 : (localT - 0.5) * -0.015;

    drawCover(images[i], scaleA, panXA, panYA, 1);

    // Smooth crossfade during the last 38% of each segment
    const fadeStart = 0.62;
    if (localT > fadeStart && images[i + 1]) {
      const fadeT = (localT - fadeStart) / (1 - fadeStart);
      const eased = fadeT * fadeT * (3 - 2 * fadeT); // smoothstep
      const scaleB = prefersReducedMotion ? 1.0 : 1.04 - eased * 0.04;
      const panXB = prefersReducedMotion ? 0 : -dir * (1 - eased) * 0.015;
      drawCover(images[i + 1], scaleB, panXB, 0, eased);
    }
  }

  function updateActs(progress) {
    let nextAct = 0;
    for (let i = 0; i < ACT_RANGES.length; i++) {
      if (progress >= ACT_RANGES[i][0] && progress < ACT_RANGES[i][1]) {
        nextAct = i;
        break;
      }
    }

    if (nextAct !== activeAct) {
      activeAct = nextAct;
      acts.forEach((el, idx) => el.classList.toggle('is-active', idx === activeAct));
      railSteps.forEach((btn, idx) => btn.classList.toggle('is-active', idx === activeAct));
      if (sceneIndexEl) {
        sceneIndexEl.textContent = String(activeAct + 1).padStart(2, '0');
      }
    }

    if (scrollCue) {
      scrollCue.classList.toggle('is-hidden', progress > 0.06);
    }
  }

  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(img);
      img.src = src;
    });
  }

  async function initMedia() {
    try {
      const res = await fetch('./assets/media-manifest.json', { cache: 'no-cache' });
      if (res.ok) {
        manifest = await res.json();
      }
    } catch (_) {
      manifest = FALLBACK_MANIFEST;
    }

    if (manifest.mode === 'frames') {
      const isMobile = window.innerWidth <= 768;
      const cfg = isMobile && manifest.mobile ? manifest.mobile : manifest.desktop;
      const urls = [];
      for (let n = 1; n <= cfg.count; n++) {
        const padded = String(n).padStart(cfg.pad || 4, '0');
        urls.push(cfg.pathPattern.replace('{index}', padded));
      }
      images = new Array(urls.length);
      images[0] = await loadImage(urls[0]);
      render(currentProgress);

      const priorityCount = Math.min(15, urls.length);
      await Promise.all(
        urls.slice(1, priorityCount).map(async (u, idx) => {
          images[idx + 1] = await loadImage(u);
        })
      );
      render(currentProgress);

      for (let i = priorityCount; i < urls.length; i += 8) {
        const slice = urls.slice(i, i + 8);
        Promise.all(
          slice.map(async (u, offset) => {
            images[i + offset] = await loadImage(u);
          })
        );
      }
    } else {
      const urls = manifest.scenes || FALLBACK_MANIFEST.scenes;
      images = new Array(urls.length);
      images[0] = await loadImage(urls[0]);
      render(currentProgress);
      await Promise.all(
        urls.slice(1).map(async (u, idx) => {
          images[idx + 1] = await loadImage(u);
        })
      );
      render(currentProgress);
    }
  }

  function initScrollAndAnimations() {
    const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (hasGSAP) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    if (!prefersReducedMotion && typeof window.Lenis !== 'undefined') {
      lenis = new window.Lenis({
        duration: 1.15,
        smoothWheel: true,
        touchMultiplier: 1.4
      });

      if (hasGSAP) {
        lenis.on('scroll', window.ScrollTrigger.update);
        window.gsap.ticker.add((time) => lenis.raf(time * 1000));
        window.gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => {
          lenis.raf(t);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }
    }

    const tick = () => {
      if (Math.abs(targetProgress - currentProgress) > 0.0004) {
        currentProgress += (targetProgress - currentProgress) * 0.14;
        render(currentProgress);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const onScrollProgress = (progress) => {
      targetProgress = progress;
      updateActs(progress);
    };

    if (hasGSAP && !prefersReducedMotion) {
      window.ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => onScrollProgress(self.progress)
      });

      window.ScrollTrigger.create({
        trigger: '#manifesto',
        start: 'top 12%',
        onEnter: () => {
          header.classList.add('is-light');
          waFloat.classList.add('is-visible');
        },
        onLeaveBack: () => {
          header.classList.remove('is-light');
          waFloat.classList.remove('is-visible');
        }
      });

      document.querySelectorAll('.reveal').forEach((el) => {
        window.gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            once: true
          }
        });
      });
    } else {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      window.addEventListener('scroll', () => {
        const rect = stage.getBoundingClientRect();
        const scrollable = Math.max(1, stage.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
        onScrollProgress(progress);
        const pastHero = rect.bottom <= window.innerHeight * 0.25;
        header.classList.toggle('is-light', pastHero);
        waFloat.classList.toggle('is-visible', pastHero);
      }, { passive: true });
    }

    railSteps.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.goto || 0);
        const scrollable = Math.max(1, stage.offsetHeight - window.innerHeight);
        const destY = stage.offsetTop + scrollable * ACT_TARGETS[idx];
        if (lenis) {
          lenis.scrollTo(destY, { duration: 1.1 });
        } else {
          window.scrollTo({ top: destY, behavior: 'smooth' });
        }
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -24, duration: 1.1 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  initMedia();
  initScrollAndAnimations();
})();
