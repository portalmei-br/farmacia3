// Configuração do WhatsApp
const whatsappNumber = "5511951966608";

// Função otimizada para abrir WhatsApp com tracking
function openWhatsApp(message = "Olá! Gostaria de solicitar um orçamento.") {
    // Analytics tracking (se disponível)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'engagement',
            'event_label': message.substring(0, 50)
        });
    }
    
    // Feedback visual
    const clickedElement = event?.target;
    if (clickedElement) {
        clickedElement.classList.add('loading');
        setTimeout(() => {
            clickedElement.classList.remove('loading');
        }, 1000);
    }
    
    // Vibração em dispositivos móveis
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Função para rolar até a seção de produtos
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Sistema de Pop-up Inteligente Aprimorado
class SmartPopup {
    constructor() {
        this.popup = document.getElementById('popupOverlay');
        this.hasShown = sessionStorage.getItem('popupShown') === 'true';
        this.scrollThreshold = 60; // Porcentagem da página
        this.timeThreshold = 45000; // 45 segundos
        this.exitIntentEnabled = true;
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        if (this.hasShown) return;
        
        // Trigger por tempo (mais conservador)
        setTimeout(() => {
            if (!this.hasShown && !this.isVisible) {
                this.show();
            }
        }, this.timeThreshold);
        
        // Trigger por scroll
        this.setupScrollTrigger();
        
        // Trigger por exit intent (desktop apenas)
        if (!this.isMobile()) {
            document.addEventListener('mouseleave', this.handleExitIntent.bind(this));
        }
        
        // Trigger por inatividade (mobile)
        if (this.isMobile()) {
            this.setupInactivityTrigger();
        }
    }
    
    setupScrollTrigger() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                    if (scrollPercent > this.scrollThreshold && !this.hasShown && !this.isVisible) {
                        this.show();
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    setupInactivityTrigger() {
        let inactivityTimer;
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (!this.hasShown && !this.isVisible) {
                    this.show();
                }
            }, 30000); // 30 segundos de inatividade
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });
        
        resetTimer();
    }
    
    handleExitIntent(e) {
        if (e.clientY <= 0 && !this.hasShown && !this.isVisible) {
            this.show();
        }
    }
    
    show() {
        if (this.hasShown || this.isVisible) return;
        
        this.popup.classList.add('show');
        this.hasShown = true;
        this.isVisible = true;
        sessionStorage.setItem('popupShown', 'true');
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_shown', {
                'event_category': 'engagement'
            });
        }
        
        // Auto-hide após 30 segundos se não interagir
        setTimeout(() => {
            if (this.isVisible) {
                this.hide();
            }
        }, 30000);
    }
    
    hide() {
        this.popup.classList.remove('show');
        this.isVisible = false;
        document.body.style.overflow = '';
    }
    
    isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}

// Função para fechar popup
function closePopup() {
    const popup = document.getElementById('popupOverlay');
    popup.classList.remove('show');
    document.body.style.overflow = '';
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'popup_closed', {
            'event_category': 'engagement'
        });
    }
}

// Sistema de Animações de Scroll Otimizado
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        if (!('IntersectionObserver' in window)) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Elementos para animar
        const animatedElements = document.querySelectorAll(
            '.feature-card, .product-card, .contact-card, .trust-item, .section-header'
        );
        
        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Sistema de Header Inteligente
class SmartHeader {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.ticking = false;
        this.scrollThreshold = 100;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }
    
    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(this.updateHeader.bind(this));
            this.ticking = true;
        }
    }
    
    updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Efeito de background blur
        if (currentScrollY > this.scrollThreshold) {
            this.header.style.background = 'rgba(255, 255, 255, 0.95)';
            this.header.style.backdropFilter = 'blur(20px)';
            this.header.style.borderBottom = '1px solid rgba(229, 231, 235, 0.8)';
        } else {
            this.header.style.background = 'var(--white)';
            this.header.style.backdropFilter = 'none';
            this.header.style.borderBottom = '1px solid var(--gray-200)';
        }
        
        // Auto-hide header on scroll down (mobile apenas)
        if (this.isMobile()) {
            if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
        }
        
        this.lastScrollY = currentScrollY;
        this.ticking = false;
    }
    
    isMobile() {
        return window.innerWidth <= 768;
    }
}

// Sistema de Efeitos de Hover Aprimorados
class HoverEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCardEffects();
        this.setupButtonEffects();
        this.setupRippleEffect();
    }
    
    setupCardEffects() {
        const cards = document.querySelectorAll('.feature-card, .product-card, .contact-card');
        
        cards.forEach(card => {
            // Mouse events para desktop
            card.addEventListener('mouseenter', () => {
                if (!this.isMobile()) {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isMobile()) {
                    card.style.transform = 'translateY(0) scale(1)';
                }
            });
            
            // Touch events para mobile
            card.addEventListener('touchstart', (e) => {
                if (this.isMobile()) {
                    card.style.transform = 'scale(0.98)';
                    this.createRipple(e, card);
                }
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                if (this.isMobile()) {
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                    }, 150);
                }
            }, { passive: true });
        });
    }
    
    setupButtonEffects() {
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                if (this.isMobile()) {
                    button.style.transform = 'scale(0.95)';
                }
            }, { passive: true });
            
            button.addEventListener('touchend', () => {
                if (this.isMobile()) {
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                }
            }, { passive: true });
        });
    }
    
    setupRippleEffect() {
        const rippleElements = document.querySelectorAll('.btn-hero-primary, .btn-cta, .btn-contact-primary');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }
    
    createRipple(e, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - size / 2;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    isMobile() {
        return window.innerWidth <= 768;
    }
}

// Sistema de Performance e Otimizações
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.optimizeImages();
        this.setupServiceWorker();
    }
    
    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    preloadCriticalResources() {
        // Preload do WhatsApp
        const whatsappLink = `https://wa.me/${whatsappNumber}`;
        const linkPreload = document.createElement('link');
        linkPreload.rel = 'prefetch';
        linkPreload.href = whatsappLink;
        document.head.appendChild(linkPreload);
        
        // Preload de fontes críticas
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Slab:wght@400;600;700&display=swap';
        fontPreload.as = 'style';
        document.head.appendChild(fontPreload);
    }
    
    optimizeImages() {
        // Implementar lazy loading para imagens futuras
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Service worker básico para cache (implementar se necessário)
                console.log('Service Worker support detected');
            });
        }
    }
}

// Sistema de Analytics Avançado
class AnalyticsTracker {
    constructor() {
        this.startTime = Date.now();
        this.maxScroll = 0;
        this.interactions = 0;
        
        this.init();
    }
    
    init() {
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackInteractions();
        this.trackPerformance();
    }
    
    trackEvent(action, category = 'engagement', label = '', value = null) {
        if (typeof gtag !== 'undefined') {
            const eventData = {
                'event_category': category,
                'event_label': label
            };
            
            if (value !== null) {
                eventData.value = value;
            }
            
            gtag('event', action, eventData);
        }
        
        // Console log para debug
        console.log(`Event tracked: ${action} - ${category} - ${label}`);
    }
    
    trackScrollDepth() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                    if (scrollPercent > this.maxScroll) {
                        this.maxScroll = scrollPercent;
                        if (this.maxScroll % 25 === 0 && this.maxScroll > 0) {
                            this.trackEvent(`scroll_${this.maxScroll}`, 'scroll_depth');
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    trackTimeOnPage() {
        // Track em intervalos
        setInterval(() => {
            const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
            if (timeSpent % 30 === 0 && timeSpent > 0) { // A cada 30 segundos
                this.trackEvent('time_milestone', 'engagement', `${timeSpent}s`);
            }
        }, 30000);
        
        // Track no unload
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
            this.trackEvent('time_on_page', 'engagement', `${timeSpent}s`);
        });
    }
    
    trackInteractions() {
        document.addEventListener('click', (e) => {
            this.interactions++;
            
            // Track cliques em elementos importantes
            if (e.target.closest('.product-card')) {
                this.trackEvent('product_card_click', 'interaction');
            } else if (e.target.closest('.feature-card')) {
                this.trackEvent('feature_card_click', 'interaction');
            } else if (e.target.closest('button')) {
                const buttonText = e.target.textContent.trim().substring(0, 20);
                this.trackEvent('button_click', 'interaction', buttonText);
            }
        });
    }
    
    trackPerformance() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if ('performance' in window) {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
                    this.trackEvent('page_load_time', 'performance', '', loadTime);
                }
            }, 0);
        });
    }
}

// Sistema de Detecção de Dispositivo
class DeviceDetector {
    constructor() {
        this.init();
    }
    
    init() {
        this.detectDevice();
        this.setupResponsiveOptimizations();
        this.handleOrientationChange();
    }
    
    detectDevice() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isTouch = 'ontouchstart' in window;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet);
        document.body.classList.toggle('touch-device', isTouch);
        document.body.classList.toggle('ios', isIOS);
        document.body.classList.toggle('android', isAndroid);
        
        if (isMobile) {
            this.optimizeForMobile();
        }
    }
    
    optimizeForMobile() {
        // Ajustar viewport para mobile
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        
        // Otimizar animações para mobile
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                * {
                    -webkit-tap-highlight-color: transparent;
                }
                
                .feature-card, .product-card, .contact-card {
                    transition: transform 0.2s ease !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupResponsiveOptimizations() {
        window.addEventListener('resize', this.debounce(() => {
            this.detectDevice();
        }, 250));
    }
    
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectDevice();
            }, 100);
        });
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('FarmáciaSaúde - Site aprimorado carregado!');
    
    // Inicializar todos os sistemas
    new ScrollAnimations();
    new SmartHeader();
    new HoverEffects();
    new PerformanceOptimizer();
    new AnalyticsTracker();
    new DeviceDetector();
    
    // Inicializar popup inteligente
    new SmartPopup();
    
    // Event listeners para o popup
    document.addEventListener('click', (e) => {
        if (e.target.id === 'popupOverlay') {
            closePopup();
        }
    });
    
    // Escape key para fechar popup
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
    
    // Adicionar classes de animação aos elementos principais
    setTimeout(() => {
        const mainElements = document.querySelectorAll('.hero-content, .section-header');
        mainElements.forEach(element => {
            element.classList.add('fade-in-up');
        });
    }, 100);
    
    // Melhorar acessibilidade
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Otimização de performance na inicialização
window.addEventListener('load', function() {
    // Remover loading states
    document.body.classList.remove('loading');
    
    // Inicializar recursos não críticos
    setTimeout(() => {
        // Preload de recursos adicionais se necessário
        console.log('Recursos não críticos carregados');
    }, 2000);
});

// Tratamento de erros
window.addEventListener('error', function(e) {
    console.error('Erro no site:', e.error);
    
    // Tracking de erros (se analytics disponível)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error?.message || 'Unknown error',
            'fatal': false
        });
    }
});

// Exportar funções para uso global
window.FarmaciaUtils = {
    openWhatsApp,
    scrollToProducts,
    closePopup,
    isMobile: () => window.innerWidth <= 768,
    trackEvent: (action, category, label) => {
        if (window.analyticsTracker) {
            window.analyticsTracker.trackEvent(action, category, label);
        }
    }
};

// PWA Support básico
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Implementar service worker se necessário para PWA
        console.log('PWA support available');
    });
}

// Adicionar CSS de animações dinamicamente
const animationCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-blue) !important;
        outline-offset: 2px !important;
    }
    
    .loading-shimmer {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: loading-shimmer 1.5s infinite;
    }
    
    @keyframes loading-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);

