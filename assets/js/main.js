// NADO777 Website JavaScript
(function() {
    'use strict';

    // Utility functions
    const utils = {
        // Device detection
        detectDeviceType() {
            const userAgent = navigator.userAgent;
            const isTablet = () => userAgent.match(/(iPad)/) || 
                (!userAgent.match(/(iPhone\sOS)\s([\d_]+)/) && 
                window.screen.height > window.screen.width && 
                /macintosh|mac os x/i.test(userAgent));
            const isMobile = () => /iPhone|Android.+Mobile/.test(userAgent) || 
                (navigator.maxTouchPoints && navigator.maxTouchPoints > 1 && 
                /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
            
            return {
                tablet: isTablet,
                mobile: isMobile,
                desktop: () => !isTablet() && !isMobile(),
                appleMobile: () => /iPhone|iPad/i.test(userAgent)
            };
        },

        // Media screen handling
        mediaScreen() {
            const deviceType = this.detectDeviceType();
            const isTablet = deviceType.tablet();
            const isDesktop = deviceType.desktop();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const aspectRatio = 750 / 1334;
            const device = 'mobile';
            let uiContain = '0';
            const maxWidth = windowWidth / windowHeight > aspectRatio ? aspectRatio * windowHeight : windowWidth;

            if (windowWidth > 450 && !isTablet) {
                uiContain = '1';
            }

            const html = document.querySelector('html');
            if (html) {
                html.style.setProperty('--lobby__max-width', uiContain === '1' ? maxWidth + 'px' : '100%');
                html.style.setProperty('--lobby__vh', windowHeight * 0.01 + 'px');
                html.setAttribute('data-device', device);
                html.setAttribute('data-ui-contain', uiContain);
                html.setAttribute('data-isdesktop', isDesktop ? '1' : '0');
            }

            return { device, size: 'small', uiContain };
        },

        // Prevent zoom on mobile
        preventZoom() {
            let lastTouchEnd = 0;
            document.addEventListener('touchstart', function(e) {
                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            });
            document.addEventListener('touchend', function(e) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
            document.addEventListener('gesturestart', function(e) {
                e.preventDefault();
            });
        },

        // Throttle function
        throttle(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Debounce function
        debounce(func, wait, immediate) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        }
    };

    // Loading screen management
    const loadingScreen = {
        init() {
            this.hideLoading();
        },

        hideLoading() {
            setTimeout(() => {
                const loadingElement = document.querySelector('.skeleton-screen-main');
                if (loadingElement) {
                    loadingElement.style.opacity = '0';
                    loadingElement.style.pointerEvents = 'none';
                    setTimeout(() => {
                        loadingElement.style.display = 'none';
                        document.body.classList.add('loaded');
                    }, 500);
                }
            }, 1500); // Show loading for 1.5 seconds
        }
    };

    // Navigation functionality
    const navigation = {
        init() {
            this.setupMobileMenu();
            this.setupSmoothScrolling();
            this.setupActiveNavigation();
        },

        setupMobileMenu() {
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const nav = document.querySelector('.main-nav');
            
            if (mobileToggle && nav) {
                mobileToggle.addEventListener('click', () => {
                    nav.classList.toggle('active');
                    mobileToggle.classList.toggle('active');
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                        nav.classList.remove('active');
                        mobileToggle.classList.remove('active');
                    }
                });
            }
        },

        setupSmoothScrolling() {
            const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const headerHeight = document.querySelector('.main-header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        setupActiveNavigation() {
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('section[id]');
            
            const updateActiveNav = () => {
                const scrollPosition = window.scrollY + 100;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                    }
                });
            };

            window.addEventListener('scroll', utils.throttle(updateActiveNav, 100));
        }
    };

    // Animation effects
    const animations = {
        init() {
            this.setupScrollAnimations();
            this.setupHoverEffects();
        },

        setupScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            const animatedElements = document.querySelectorAll(
                '.game-card, .promo-card, .social-link, .hero-content, .section-title'
            );
            
            animatedElements.forEach(el => {
                observer.observe(el);
            });
        },

        setupHoverEffects() {
            // Game cards hover effects
            const gameCards = document.querySelectorAll('.game-card');
            gameCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Button hover effects
            const buttons = document.querySelectorAll('.btn-primary');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 8px 24px rgba(0, 108, 255, 0.3)';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = '0 4px 16px rgba(0, 108, 255, 0.1)';
                });
            });
        }
    };

    // Game functionality
    const games = {
        init() {
            this.setupGameInteractions();
            this.loadGameImages();
        },

        setupGameInteractions() {
            const playButtons = document.querySelectorAll('.play-btn');
            playButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const gameCard = btn.closest('.game-card');
                    const gameTitle = gameCard.querySelector('.game-title').textContent;
                    this.showGameModal(gameTitle);
                });
            });

            // Game card click
            const gameCards = document.querySelectorAll('.game-card');
            gameCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('play-btn')) {
                        const gameTitle = card.querySelector('.game-title').textContent;
                        this.showGameInfo(gameTitle);
                    }
                });
            });
        },

        loadGameImages() {
            // Create placeholder images for games
            const gameImages = document.querySelectorAll('.game-image img');
            gameImages.forEach((img, index) => {
                // Create colorful gradient placeholders
                const colors = [
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                ];
                
                img.style.background = colors[index % colors.length];
                img.style.minHeight = '200px';
                
                // Set placeholder src
                img.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <rect width="400" height="225" fill="url(#grad${index})"/>
                        <text x="200" y="120" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">🎰</text>
                    </svg>
                `)}`;
            });
        },

        showGameModal(gameTitle) {
            // Simple alert for demo - in real implementation, would show proper modal
            alert(`Iniciando jogo: ${gameTitle}\n\nEm uma implementação real, isso abriria o jogo em uma nova janela ou modal.`);
        },

        showGameInfo(gameTitle) {
            console.log(`Mostrando informações do jogo: ${gameTitle}`);
        }
    };

    // Social media integration
    const social = {
        init() {
            this.setupSocialLinks();
        },

        setupSocialLinks() {
            const socialLinks = document.querySelectorAll('.social-link');
            socialLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Add tracking or analytics here
                    console.log(`Clique no link social: ${link.href}`);
                });
            });
        }
    };

    // Theme management
    const theme = {
        init() {
            this.updateThemeColor();
            this.setupResponsiveDesign();
        },

        updateThemeColor() {
            const themeColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--bg-primary').trim();
            
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            metaThemeColor.content = themeColor;
        },

        setupResponsiveDesign() {
            const handleResize = utils.debounce(() => {
                utils.mediaScreen();
                this.updateThemeColor();
            }, 250);

            window.addEventListener('resize', handleResize);
        }
    };

    // Form handling
    const forms = {
        init() {
            this.setupButtonInteractions();
        },

        setupButtonInteractions() {
            // Login/Register buttons
            const loginBtns = document.querySelectorAll('.btn:contains("Entrar")');
            const registerBtns = document.querySelectorAll('.btn:contains("Cadastrar")');
            
            document.querySelectorAll('.btn').forEach(btn => {
                if (btn.textContent.includes('Entrar')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showLoginForm();
                    });
                } else if (btn.textContent.includes('Cadastrar')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showRegisterForm();
                    });
                } else if (btn.textContent.includes('Começar a Jogar')) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showRegisterForm();
                    });
                }
            });
        },

        showLoginForm() {
            alert('Formulário de Login\n\nEm uma implementação real, isso abriria um modal de login.');
        },

        showRegisterForm() {
            alert('Formulário de Cadastro\n\nEm uma implementação real, isso abriria um modal de cadastro.');
        }
    };

    // Performance optimization
    const performance = {
        init() {
            this.lazyLoadImages();
            this.preloadCriticalResources();
        },

        lazyLoadImages() {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        },

        preloadCriticalResources() {
            // Preload critical images
            const criticalImages = [
                './assets/images/logo.png',
                './assets/images/hero-games.png'
            ];

            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        }
    };

    // Analytics and tracking
    const analytics = {
        init() {
            this.trackPageView();
            this.setupEventTracking();
        },

        trackPageView() {
            console.log('Page view tracked:', window.location.href);
        },

        setupEventTracking() {
            // Track button clicks
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn')) {
                    console.log('Button clicked:', e.target.textContent);
                }
            });

            // Track game interactions
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('play-btn')) {
                    const gameTitle = e.target.closest('.game-card').querySelector('.game-title').textContent;
                    console.log('Game play button clicked:', gameTitle);
                }
            });
        }
    };

    // Main initialization
    const app = {
        init() {
            // Initialize all modules
            utils.mediaScreen();
            utils.preventZoom();
            
            loadingScreen.init();
            navigation.init();
            animations.init();
            games.init();
            social.init();
            theme.init();
            forms.init();
            performance.init();
            analytics.init();

            // Set up global event listeners
            this.setupGlobalEvents();
            
            console.log('NADO777 website initialized successfully!');
        },

        setupGlobalEvents() {
            // Handle page visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    console.log('Page hidden');
                } else {
                    console.log('Page visible');
                }
            });

            // Handle online/offline status
            window.addEventListener('online', () => {
                console.log('Connection restored');
            });

            window.addEventListener('offline', () => {
                console.log('Connection lost');
            });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', app.init);
    } else {
        app.init();
    }

    // Expose utils globally for debugging
    window.NADO777 = {
        utils,
        loadingScreen,
        navigation,
        animations,
        games,
        social,
        theme,
        forms,
        performance,
        analytics
    };

})();