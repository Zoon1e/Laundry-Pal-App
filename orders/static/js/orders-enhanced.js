document.addEventListener('DOMContentLoaded', function() {
    // Add click handler for order cards
    const orderCards = document.querySelectorAll('.order-card');
    
    orderCards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        });
        
        // Add click handler to show order details
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link or button
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            
            const orderId = this.dataset.orderId;
            if (orderId) {
                window.location.href = `/orders/${orderId}/`;
            }
        });
    });
    
    // Add animation to status badges
    const statusBadges = document.querySelectorAll('.status-badge');
    statusBadges.forEach(badge => {
        badge.style.opacity = '0';
        badge.style.animation = 'fadeIn 0.5s ease-in-out forwards';
        badge.style.animationDelay = `${Math.random() * 0.5}s`;
    });
    
    // Toggle map visibility
    const toggleMapBtn = document.getElementById('toggleMapBtn');
    const mapContainer = document.getElementById('mapContainer');
    
    if (toggleMapBtn && mapContainer) {
        toggleMapBtn.addEventListener('click', function() {
            mapContainer.classList.toggle('d-none');
            this.innerHTML = mapContainer.classList.contains('d-none') ? 
                '<i class="fas fa-map"></i> Show Map' : 
                '<i class="fas fa-list"></i> Hide Map';
            
            // Trigger map resize when shown
            if (!mapContainer.classList.contains('d-none')) {
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    if (window.map) {
                        window.map.invalidateSize();
                    }
                }, 300);
            }
        });
    }
    
    // Add animation to order cards
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.order-card');
        cards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight - 100) {
                card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`;
            }
        });
    };
    
    // Initial animation
    animateOnScroll();
    
    // Animate on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .order-card {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        
        .order-card.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .status-badge {
            transition: all 0.3s ease;
        }
        
        .status-badge:hover {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
});

// Add map to window object for easier access
if (typeof initializeMap === 'function') {
    window.initializeMap = initializeMap;
}
