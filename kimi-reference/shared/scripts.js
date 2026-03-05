/**
 * POLITICO Shared JavaScript Utilities
 * =====================================
 */

(function() {
  'use strict';

  // ========================================
  // Initialize Lucide Icons
  // ========================================
  function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    } else {
      // Retry after a short delay if lucide isn't loaded yet
      setTimeout(initLucideIcons, 100);
    }
  }

  // ========================================
  // Mobile Menu Toggle
  // ========================================
  function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');

    if (!menuBtn || !mobileMenu) return;

    function openMenu() {
      mobileMenu.classList.remove('-translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      
      if (backdrop) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Re-initialize icons in mobile menu
      setTimeout(() => {
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }, 50);
    }

    function closeMenu() {
      mobileMenu.classList.remove('translate-x-0');
      mobileMenu.classList.add('-translate-x-full');
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      
      if (backdrop) {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openMenu);
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }
    
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
        closeMenu();
      }
    });

    // Close menu on window resize (if switching to desktop)
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth >= 1024 && mobileMenu.getAttribute('aria-hidden') === 'false') {
          closeMenu();
        }
      }, 150);
    });
  }

  // ========================================
  // Header Scroll Behavior
  // ========================================
  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const scrollThreshold = 100;

    function updateHeader() {
      const currentScrollY = window.scrollY;
      
      // Add shadow when scrolled
      if (currentScrollY > scrollThreshold) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }

      // Hide/show header on scroll (optional - uncomment to enable)
      // if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
      //   // Scrolling down - hide header
      //   header.style.transform = 'translateY(-100%)';
      // } else {
      //   // Scrolling up - show header
      //   header.style.transform = 'translateY(0)';
      // }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================
  // Scroll-Triggered Animations
  // ========================================
  function initScrollAnimations() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements
      document.querySelectorAll('.scroll-animate').forEach(function(el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Optionally unobserve after animation
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(function(el) {
      observer.observe(el);
    });
  }

  // ========================================
  // Stagger Animation for Lists
  // ========================================
  function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    
    if (!staggerContainers.length) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          const delay = parseInt(entry.target.dataset.stagger) || 100;
          
          Array.from(children).forEach(function(child, index) {
            setTimeout(function() {
              child.classList.add('animate-fade-in-up');
            }, index * delay);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    staggerContainers.forEach(function(container) {
      observer.observe(container);
    });
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========================================
  // Lazy Loading Images
  // ========================================
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images
      document.querySelectorAll('img[data-src]').forEach(function(img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      return;
    }

    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // ========================================
  // Reading Progress Indicator
  // ========================================
  function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    const article = document.querySelector('article');
    if (!article) return;

    function updateProgress() {
      const articleRect = article.getBoundingClientRect();
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the article has been scrolled
      const scrolled = Math.max(0, -articleRect.top + windowHeight);
      const total = articleHeight + windowHeight;
      const progress = Math.min(100, Math.max(0, (scrolled / total) * 100));
      
      progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ========================================
  // Search Toggle
  // ========================================
  function initSearchToggle() {
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');

    if (!searchToggle || !searchOverlay) return;

    function openSearch() {
      searchOverlay.classList.remove('hidden');
      searchOverlay.classList.add('flex');
      document.body.style.overflow = 'hidden';
      
      if (searchInput) {
        setTimeout(function() {
          searchInput.focus();
        }, 100);
      }
    }

    function closeSearch() {
      searchOverlay.classList.add('hidden');
      searchOverlay.classList.remove('flex');
      document.body.style.overflow = '';
    }

    searchToggle.addEventListener('click', openSearch);
    
    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !searchOverlay.classList.contains('hidden')) {
        closeSearch();
      }
    });

    // Close on backdrop click
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });
  }

  // ========================================
  // Accordion Component
  // ========================================
  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(function(accordion) {
      const trigger = accordion.querySelector('[data-accordion-trigger]');
      const content = accordion.querySelector('[data-accordion-content]');
      const icon = accordion.querySelector('[data-accordion-icon]');

      if (!trigger || !content) return;

      trigger.addEventListener('click', function() {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        
        trigger.setAttribute('aria-expanded', !isExpanded);
        content.style.maxHeight = isExpanded ? '0' : content.scrollHeight + 'px';
        
        if (icon) {
          icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    });
  }

  // ========================================
  // Tab Component
  // ========================================
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function(tabContainer) {
      const triggers = tabContainer.querySelectorAll('[data-tab-trigger]');
      const panels = tabContainer.querySelectorAll('[data-tab-panel]');

      triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function() {
          const targetId = this.dataset.tabTrigger;

          // Update triggers
          triggers.forEach(function(t) {
            t.setAttribute('aria-selected', 'false');
            t.classList.remove('active');
          });
          this.setAttribute('aria-selected', 'true');
          this.classList.add('active');

          // Update panels
          panels.forEach(function(panel) {
            if (panel.dataset.tabPanel === targetId) {
              panel.classList.remove('hidden');
              panel.classList.add('block');
            } else {
              panel.classList.add('hidden');
              panel.classList.remove('block');
            }
          });
        });
      });
    });
  }

  // ========================================
  // Copy to Clipboard
  // ========================================
  function initCopyToClipboard() {
    document.querySelectorAll('[data-copy]').forEach(function(button) {
      button.addEventListener('click', function() {
        const textToCopy = this.dataset.copy;
        
        navigator.clipboard.writeText(textToCopy).then(function() {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          
          setTimeout(function() {
            button.textContent = originalText;
          }, 2000);
        }).catch(function(err) {
          console.error('Failed to copy:', err);
        });
      });
    });
  }

  // ========================================
  // Newsletter Form Validation
  // ========================================
  function initNewsletterForms() {
    document.querySelectorAll('.newsletter-signup__form').forEach(function(form) {
      form.addEventListener('submit', function(e) {
        const emailInput = form.querySelector('input[type="email"]');
        
        if (emailInput && !emailInput.value.trim()) {
          e.preventDefault();
          emailInput.focus();
          emailInput.classList.add('border-red-500');
          
          setTimeout(function() {
            emailInput.classList.remove('border-red-500');
          }, 3000);
        }
      });
    });
  }

  // ========================================
  // Utility Functions
  // ========================================
  window.POLITICO = window.POLITICO || {};
  
  window.POLITICO.utils = {
    // Debounce function
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
          timeout = null;
          func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle function
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(function() {
            inThrottle = false;
          }, limit);
        }
      };
    },

    // Format date
    formatDate: function(date, options) {
      const d = new Date(date);
      const defaults = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      return d.toLocaleDateString('en-US', Object.assign(defaults, options));
    },

    // Format time ago
    timeAgo: function(date) {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
      };

      for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
          return interval + ' ' + unit + (interval === 1 ? '' : 's') + ' ago';
        }
      }
      
      return 'Just now';
    }
  };

  // ========================================
  // Initialize Everything on DOM Ready
  // ========================================
  function init() {
    initLucideIcons();
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initStaggerAnimations();
    initSmoothScroll();
    initLazyLoading();
    initReadingProgress();
    initSearchToggle();
    initAccordions();
    initTabs();
    initCopyToClipboard();
    initNewsletterForms();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize icons after dynamic content loads
  window.POLITICO.refreshIcons = function() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

})();
