/* =============================================
   NUMERO HIMANSHU — Script
   Scroll Reveal + Interaction Enhancements
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ========== SCROLL REVEAL ==========
  // Reveal elements as they enter the viewport
  const revealElements = document.querySelectorAll(
    '.hero__badge, .hero__sub-badge, .hero__headline, .hero__subheadline, .pillars, .video-section, .cta-button, .social-proof, .site-footer'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ========== CTA BUTTON RIPPLE ==========
  const ctaButton = document.getElementById('cta-book-call');
  if (ctaButton) {
    ctaButton.addEventListener('click', function (e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  // Add ripple animation dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleEffect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ========== PILLAR HOVER SOUND FEEDBACK (Optional visual) ==========
  const pillars = document.querySelectorAll('.pillar');
  pillars.forEach(pillar => {
    pillar.addEventListener('mouseenter', () => {
      const icon = pillar.querySelector('.pillar__icon');
      if (icon) {
        icon.style.transform = 'scale(1.08) rotate(-2deg)';
        setTimeout(() => {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
      }
    });
  });

  // ========== COUNTER ANIMATION (Social Proof) ==========
  const countElement = document.querySelector('.social-proof__count strong');
  if (countElement) {
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounter(countElement, 0, 2000, 1500);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(countElement);
  }

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      element.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========== SMOOTH PARALLAX ON BADGE (subtle) ==========
  const badge = document.querySelector('.hero__badge');
  if (badge && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const offset = scrollY * 0.08;
      badge.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

});
