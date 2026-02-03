/**
 * Main JavaScript file (Professional version)
 * - One scroll loop (rAF) for performance
 * - Defensive checks (no runtime errors)
 * - Smooth scroll with navbar offset + mobile collapse handling
 * - Stats animation runs on load (once)
 * - Reveal animations: uses AOS if available, otherwise fallback observer
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===========================
    // Cache DOM
    // ===========================
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');
    const animatedBg = document.querySelector('.animated-bg');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroSection = document.querySelector('.hero-section');

    // Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    // ===========================
    // Helpers
    // ===========================
    const getNavbarHeight = () => (navbar ? navbar.offsetHeight : 0);

    const hasBootstrap = () => typeof window.bootstrap !== 'undefined';

    const closeMobileMenuIfOpen = () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (!navbarCollapse) return;

        if (navbarCollapse.classList.contains('show')) {
            // Bootstrap Collapse only if available
            if (hasBootstrap()) {
                const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
                bsCollapse.hide();
            } else {
                // Fallback (in case Bootstrap JS isn't loaded)
                navbarCollapse.classList.remove('show');
            }
        }
    };

    const isHashLink = (href) => typeof href === 'string' && href.startsWith('#') && href.length > 1;

    const smoothScrollTo = (targetEl) => {
        if (!targetEl) return;
        const y = targetEl.getBoundingClientRect().top + window.pageYOffset - getNavbarHeight();

        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
    };

    // ===========================
    // Navbar Scroll Effect
    // ===========================
    const updateNavbar = (scrollY) => {
        if (!navbar) return;

        if (scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };

    // ===========================
    // Active Navigation Link
    // ===========================
    const updateActiveLink = (scrollY) => {
        if (!navLinks.length || !sections.length) return;

        const offset = getNavbarHeight() + 20; // margem extra pra não “piscar”
        let currentId = null;

        sections.forEach((section) => {
            const top = section.offsetTop - offset;
            const bottom = top + section.offsetHeight;

            if (scrollY >= top && scrollY < bottom) {
                currentId = section.getAttribute('id');
            }
        });

        if (!currentId) return;

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const shouldBeActive = href === `#${currentId}`;
            link.classList.toggle('active', shouldBeActive);
        });
    };

    // ===========================
    // Smooth Scroll (Nav + CTA)
    // ===========================
    const initSmoothScroll = () => {
        // Menu links
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // se não é hash válido, deixa seguir normal
                if (!isHashLink(href)) return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                smoothScrollTo(target);
                closeMobileMenuIfOpen();
            });
        });

        // CTA links (somente os que apontam para âncoras)
        const ctaButtons = document.querySelectorAll('.btn-cta, .btn-gradient');
        ctaButtons.forEach((btn) => {
            const href = btn.getAttribute('href');
            if (!isHashLink(href)) return;

            btn.addEventListener('click', (e) => {
                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                smoothScrollTo(target);
            });
        });
    };

    // ===========================
    // WhatsApp Links (Optional but professional)
    // Use class "cta-whatsapp" in <a> buttons you want to auto-fill
    // ===========================
    const initWhatsAppLinks = () => {
        const WHATSAPP_NUMBER = '5574991119184';
        const DEFAULT_MESSAGE = 'Olá! Gostaria de mais informações sobre os seus serviços.';

        const buttons = document.querySelectorAll('a.cta-whatsapp');
        if (!buttons.length) return;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
        buttons.forEach((a) => a.setAttribute('href', url));
    };

    // ===========================
    // Stats Counter Animation (run on load, once)
    // ===========================
    const animateStats = () => {
        if (statsAnimated) return;
        if (!statNumbers.length) return;

        statsAnimated = true;

        statNumbers.forEach((stat) => {
            const originalText = (stat.textContent || '').trim();
            const hasPlus = originalText.includes('+');
            const hasPercent = originalText.includes('%');

            const targetNumber = parseInt(originalText.replace(/\D/g, ''), 10);
            if (Number.isNaN(targetNumber)) return;

            let currentNumber = 0;
            const steps = 50;
            const duration = 2000;
            const increment = targetNumber / steps;
            const stepTime = duration / steps;

            const counter = setInterval(() => {
                currentNumber += increment;

                if (currentNumber >= targetNumber) {
                    currentNumber = targetNumber;
                    clearInterval(counter);
                }

                let display = Math.floor(currentNumber).toString();
                if (hasPlus) display += '+';
                if (hasPercent) display += '%';

                stat.textContent = display;
            }, stepTime);
        });
    };

    // ===========================
    // Parallax Effect
    // ===========================
    const parallaxEffect = (scrollY) => {
        if (!animatedBg) return;

        const speed = 0.25; // um pouco mais leve
        animatedBg.style.transform = `translateY(${scrollY * speed}px)`;
    };

    // ===========================
    // Mouse Move Glow Effect (hero)
    // ===========================
    const initHeroGlow = () => {
        if (!heroSection) return;

        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;

            heroSection.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0, 217, 255, 0.05) 0%, transparent 50%)`;
        });
    };

    // ===========================
    // Button hover glow (keep simple, no layout trashing)
    // ===========================
    const initButtonHoverGlow = () => {
        const buttons = document.querySelectorAll('.btn-gradient, .btn-cta');
        buttons.forEach((btn) => {
            btn.addEventListener('mouseenter', () => {
                btn.style.filter = 'brightness(1.15)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.filter = 'brightness(1)';
            });
        });
    };

    // ===========================
    // Reveal Animations
    // - If AOS exists: init AOS
    // - Else: fallback IntersectionObserver for [data-aos]
    // ===========================
    const initRevealAnimations = () => {
        // Prefer AOS if user included it
        if (window.AOS && typeof window.AOS.init === 'function') {
            window.AOS.init({
                duration: 650,
                easing: 'ease-out',
                once: true,
                offset: 80
            });
            return;
        }

        // Fallback observer
        const elements = document.querySelectorAll('[data-aos]');
        if (!elements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            });
        }, observerOptions);

        elements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };

    // ===========================
    // Scroll Indicator Hide
    // ===========================
    const updateScrollIndicator = (scrollY) => {
        if (!scrollIndicator) return;

        if (scrollY > 300) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    };

    // ===========================
    // Accessibility: ESC closes mobile menu
    // ===========================
    const initKeyboardAccessibility = () => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenuIfOpen();
            }
        });
    };

    // ===========================
    // Close mobile menu when clicking outside
    // ===========================
    const initOutsideClickClose = () => {
        document.addEventListener('click', (e) => {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const navbarToggler = document.querySelector('.navbar-toggler');

            if (!navbarCollapse || !navbarToggler) return;
            if (!navbarCollapse.classList.contains('show')) return;

            const clickedInsideMenu = navbarCollapse.contains(e.target);
            const clickedToggler = navbarToggler.contains(e.target);

            if (!clickedInsideMenu && !clickedToggler) {
                closeMobileMenuIfOpen();
            }
        });
    };

    // ===========================
    // One scroll loop (rAF) — professional performance
    // ===========================
    let ticking = false;

    const onScroll = () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

            updateNavbar(scrollY);
            updateActiveLink(scrollY);
            parallaxEffect(scrollY);
            updateScrollIndicator(scrollY);

            ticking = false;
        });
    };

    // ===========================
    // Init
    // ===========================
    initSmoothScroll();
    initWhatsAppLinks();
    initHeroGlow();
    initButtonHoverGlow();
    initRevealAnimations();
    initKeyboardAccessibility();
    initOutsideClickClose();

    // Initial state
    onScroll();

    // Scroll listener (passive = melhor performance)
    window.addEventListener('scroll', onScroll, { passive: true });

    // Run stats when full page is loaded (fonts/images ok)
    window.addEventListener('load', () => {
        animateStats();
        document.body.classList.add('loaded');

        console.log('%c🚀 Dev Website', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
        console.log('%cDesenvolvido em Senhor do Bonfim - BA', 'color: #a855f7; font-size: 12px;');
    });
});
