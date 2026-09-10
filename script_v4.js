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

  // ========== LEAD CAPTURE POPUP ==========
  const popupOverlay = document.getElementById('popup-overlay');
  const leadForm = document.getElementById('lead-form');
  
  // Replace this with your deployed Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwkKsi67iQRBnL9ps2LRBVesHvR9076cSjmEx_IK8zNiuP-WVsYCNWmGV7plF6SvoIS/exec';

  // Show popup and lock body scroll
  if (popupOverlay) {
    popupOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // prevent scrolling while popup is active
  }

  if (leadForm) {
    const nameInput = document.getElementById('lead-name');
    const mobileInput = document.getElementById('lead-mobile');
    const emailInput = document.getElementById('lead-email');
    const submitBtn = document.getElementById('popup-submit');
    const btnText = submitBtn.querySelector('.popup__submit-text');
    const btnArrow = submitBtn.querySelector('.popup__submit-arrow');
    const btnLoading = submitBtn.querySelector('.popup__submit-loading');

    // Real-time validation for Mobile (only numbers)
    mobileInput.addEventListener('keypress', function(e) {
      // Prevent any key that is not a number
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });

    mobileInput.addEventListener('input', function(e) {
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
      if (this.value.length === 10) {
        this.classList.remove('error');
        document.getElementById('error-mobile').textContent = '';
      }
    });

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Name Validation
      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        document.getElementById('error-name').textContent = 'Name is required';
        isValid = false;
      } else {
        nameInput.classList.remove('error');
        document.getElementById('error-name').textContent = '';
      }

      // Mobile Validation
      if (mobileInput.value.length !== 10) {
        mobileInput.classList.add('error');
        document.getElementById('error-mobile').textContent = 'Enter a valid 10-digit number';
        isValid = false;
      } else {
        mobileInput.classList.remove('error');
        document.getElementById('error-mobile').textContent = '';
      }

      // Email Validation
      if (!validateEmail(emailInput.value)) {
        emailInput.classList.add('error');
        document.getElementById('error-email').textContent = 'Enter a valid email address';
        isValid = false;
      } else {
        emailInput.classList.remove('error');
        document.getElementById('error-email').textContent = '';
      }

      if (!isValid) return;

      // Loading State
      submitBtn.disabled = true;
      btnText.textContent = 'SAVING...';
      btnArrow.style.display = 'none';
      btnLoading.style.display = 'inline-block';

      const formData = {
        name: nameInput.value.trim(),
        mobile: mobileInput.value,
        email: emailInput.value.trim()
      };

      try {
        if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
          const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Scripts to bypass CORS issues from client
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
        } else {
          console.warn("Notice: Google Script URL is not set. Bypassing save to let you test the site.");
        }
        
        // Success (or bypassed)
        popupOverlay.style.animation = 'popupFadeIn 0.4s ease-out reverse both';
        
        setTimeout(() => {
          popupOverlay.style.display = 'none';
          document.body.style.overflow = 'auto'; // Restore scrolling
        }, 400);

      } catch (error) {
        // If it fails (e.g. network error), we log it but still let the user in
        // so they aren't permanently blocked from the site
        console.error('Submission Error:', error);
        
        popupOverlay.style.animation = 'popupFadeIn 0.4s ease-out reverse both';
        setTimeout(() => {
          popupOverlay.style.display = 'none';
          document.body.style.overflow = 'auto';
        }, 400);
      }
    });
  }

});
