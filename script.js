/* ============================================================
   BASTI GYM & FITNESS CLUB — script.js
   Handles: Navbar | Hamburger | Scroll Animations | Form
   ============================================================ */

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ────────────────────────────────────────────
     1. NAVBAR — sticky + scroll class
  ──────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ────────────────────────────────────────────
     2. ACTIVE NAV LINK — highlight current page
  ──────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ────────────────────────────────────────────
     3. HAMBURGER MENU — mobile toggle
  ──────────────────────────────────────────── */
  const hamburger  = document.querySelector('.hamburger');
  const navMobile  = document.querySelector('.nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile a');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
      // Prevent body scroll when menu is open
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMobile.classList.contains('open')) {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ────────────────────────────────────────────
     4. SCROLL ANIMATIONS — Intersection Observer
  ──────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ────────────────────────────────────────────
     5. SMOOTH SCROLL — anchor links
  ──────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height buffer
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ────────────────────────────────────────────
     6. CONTACT FORM — frontend validation + fake submit
  ──────────────────────────────────────────── */
  const contactForm   = document.getElementById('contactForm');
  const formSuccess   = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const name    = contactForm.querySelector('[name="name"]');
      const email   = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');
      let valid = true;

      [name, email, message].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e31010';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (email && email.value && !isValidEmail(email.value)) {
        email.style.borderColor = '#e31010';
        valid = false;
      }

      if (!valid) return;

      // Simulate sending — show success state
      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      }, 1200);
    });

    // Remove red border on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

  /* ────────────────────────────────────────────
     7. COUNTER ANIMATION — hero stats
  ──────────────────────────────────────────── */
  const counters = document.querySelectorAll('.num[data-target]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  /* ────────────────────────────────────────────
     8. GALLERY LIGHTBOX — simple overlay
  ──────────────────────────────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        // Only open lightbox if item has a real image
        const img = item.querySelector('img');
        if (img) {
          openLightbox(img.src, img.alt);
        }
      });
    });
  }

  /* ────────────────────────────────────────────
     9. "JOIN NOW" smooth scroll — if on same page
  ──────────────────────────────────────────── */
  document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scroll);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

/* ════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════ */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function animateCounter(el) {
  const target   = +el.getAttribute('data-target');
  const suffix   = el.getAttribute('data-suffix') || '';
  const duration = 1600;
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

function openLightbox(src, alt) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.93);
    display:flex;align-items:center;justify-content:center;
    cursor:zoom-out;
  `;

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  img.style.cssText = `
    max-width:90vw;max-height:90vh;
    object-fit:contain;border-radius:4px;
    box-shadow:0 0 60px rgba(0,0,0,0.8);
  `;

  const close = document.createElement('button');
  close.innerHTML = '✕';
  close.style.cssText = `
    position:absolute;top:20px;right:28px;
    background:none;border:none;color:#fff;
    font-size:1.8rem;cursor:pointer;opacity:0.7;
  `;
  close.onmouseover = () => (close.style.opacity = '1');
  close.onmouseleave = () => (close.style.opacity = '0.7');

  overlay.appendChild(img);
  overlay.appendChild(close);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const removeLightbox = () => {
    document.body.removeChild(overlay);
    document.body.style.overflow = '';
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === close) removeLightbox();
  });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') {
      removeLightbox();
      document.removeEventListener('keydown', esc);
    }
  });
}
