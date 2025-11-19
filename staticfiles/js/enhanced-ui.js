// Enhanced UI JavaScript with Advanced Animations
document.addEventListener('DOMContentLoaded', function() {
    
    // Page Loading Animation
    const pageLoader = document.createElement('div');
    pageLoader.className = 'page-loader';
    pageLoader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(pageLoader);
    
    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.remove();
            }, 500);
        }, 800);
    });
    
    // Enhanced Floating Laundry Icons Animation
    function createFloatingLaundryIcons() {
        // Remove any existing floating icons first
        const existingContainer = document.querySelector('.floating-laundry-icons');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-laundry-icons';
        
        // Define specific laundry-themed icons with their classes
        const laundryIcons = [
            { icon: '👕', class: 'cloth-1' },
            { icon: '👗', class: 'cloth-2' },
            { icon: '👖', class: 'cloth-3' },
            { icon: '🧥', class: 'cloth-4' },
            { icon: '👔', class: 'cloth-5' },
            { icon: '🧺', class: 'basket-1' },
            { icon: '🗑️', class: 'basket-2' },
            { icon: '🧴', class: 'basket-3' },
            { icon: '🧽', class: 'soap' },
            { icon: '💧', class: 'bubbles' }
        ];
        
        // Create floating icons with predefined positions and animations
        laundryIcons.forEach(item => {
            const element = document.createElement('div');
            element.className = `floating-icon ${item.class}`;
            element.textContent = item.icon;
            element.style.willChange = 'transform, opacity';
            floatingContainer.appendChild(element);
        });
        
        document.body.appendChild(floatingContainer);
        
        // Force a reflow to ensure the elements are rendered
        floatingContainer.offsetHeight;
        
        console.log('Floating laundry icons created:', laundryIcons.length, 'icons');
    }
    
    // Create floating icons after a small delay to ensure DOM is ready
    setTimeout(createFloatingLaundryIcons, 100);
    
    // Scroll Reveal Animation
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.scroll-reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
    
    // Enhanced Button Interactions
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
    });
    
    // Card Hover Effects with Parallax
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
    
    // Simple fixed navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.left = '0';
        navbar.style.right = '0';
        navbar.style.zIndex = '1000';
        navbar.style.background = '#ffffff';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        
        // Add padding to body to account for fixed navbar
        document.body.style.paddingTop = navbar.offsetHeight + 'px';
    }
    
    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Ripple Effect for Buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    // Add ripple effect CSS
    const rippleCSS = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = rippleCSS;
    document.head.appendChild(style);
    
    // Apply ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Intersection Observer for Advanced Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .hero-content').forEach(el => {
        observer.observe(el);
    });
    
    // Typing Animation for Hero Title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Apply typing animation to hero title if it exists
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }
    
    // Particle System removed
    
    // Performance optimization: Throttle scroll events
    function throttle(func, wait) {
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
    
    // Apply throttling to scroll events
    window.addEventListener('scroll', throttle(revealOnScroll, 16));
    
    // Force scrollbar to stay visible and functional
    function maintainScrollbar() {
        // Ensure content is scrollable
        document.body.style.minHeight = 'calc(100vh + 100px)';
        
        // Add CSS to prevent scrollbar hiding
        const scrollbarCSS = `
            html, body {
                overflow-y: scroll !important;
                scrollbar-width: auto !important;
            }
            
            ::-webkit-scrollbar {
                width: 18px !important;
                background: #e5e7eb !important;
                -webkit-appearance: none !important;
                pointer-events: auto !important;
            }
            
            ::-webkit-scrollbar-thumb {
                background: #3b82f6 !important;
                border-radius: 9px !important;
                border: 2px solid #e5e7eb !important;
                pointer-events: auto !important;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: #2563eb !important;
                pointer-events: auto !important;
            }
            
            ::-webkit-scrollbar-track {
                background: #e5e7eb !important;
                pointer-events: auto !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = scrollbarCSS;
        document.head.appendChild(style);
    }
    
    maintainScrollbar();
    
    // Prevent any scripts from hiding scrollbar
    setInterval(() => {
        if (document.documentElement.style.overflow === 'hidden' || 
            document.body.style.overflow === 'hidden') {
            document.documentElement.style.overflow = 'scroll';
            document.body.style.overflow = 'scroll';
        }
    }, 500);
    
    console.log('Enhanced UI animations loaded successfully! 🚀');
});
