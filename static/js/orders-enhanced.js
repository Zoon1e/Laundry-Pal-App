// Enhanced Orders JavaScript with Smooth Transitions
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize order animations
    initOrderAnimations();
    initFilterAndSort();
    initQuickActions();
    initProgressAnimations();
    initOrderStatusUpdates();
    
    // Order card animations on load
    function initOrderAnimations() {
        const orderCards = document.querySelectorAll('.order-card');
        
        // Stagger animation for order cards
        orderCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Hover effects for order cards
        orderCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            });
        });
    }
    
    // Filter and sort functionality with animations
    function initFilterAndSort() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const sortBtns = document.querySelectorAll('.sort-btn');
        const orderContainer = document.querySelector('.orders-container');
        
        // Filter functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const filter = this.dataset.filter;
                
                // Update active filter
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Animate filter
                animateFilter(filter);
            });
        });
        
        // Sort functionality
        sortBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const sort = this.dataset.sort;
                
                // Update active sort
                sortBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Animate sort
                animateSort(sort);
            });
        });
    }
    
    // Animated filtering
    function animateFilter(filter) {
        const orderCards = document.querySelectorAll('.order-card');
        
        // Fade out all cards
        orderCards.forEach(card => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
        });
        
        setTimeout(() => {
            orderCards.forEach(card => {
                const orderStatus = card.dataset.status || '';
                const shouldShow = filter === 'all' || orderStatus.includes(filter);
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        }, 200);
    }
    
    // Animated sorting
    function animateSort(sortType) {
        const container = document.querySelector('.orders-grid');
        const cards = Array.from(document.querySelectorAll('.order-card'));
        
        // Fade out
        cards.forEach(card => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
        });
        
        setTimeout(() => {
            // Sort cards
            cards.sort((a, b) => {
                switch(sortType) {
                    case 'newest':
                        return new Date(b.dataset.created) - new Date(a.dataset.created);
                    case 'oldest':
                        return new Date(a.dataset.created) - new Date(b.dataset.created);
                    case 'cost-high':
                        return parseFloat(b.dataset.cost) - parseFloat(a.dataset.cost);
                    case 'cost-low':
                        return parseFloat(a.dataset.cost) - parseFloat(b.dataset.cost);
                    default:
                        return 0;
                }
            });
            
            // Re-append sorted cards
            cards.forEach((card, index) => {
                container.appendChild(card);
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateX(0)';
                }, index * 50);
            });
        }, 300);
    }
    
    // Quick actions with smooth transitions
    function initQuickActions() {
        // Status update buttons
        document.querySelectorAll('.status-update-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.orderId;
                const newStatus = this.dataset.newStatus;
                
                // Add loading state
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
                this.disabled = true;
                
                // Simulate API call with smooth transition
                setTimeout(() => {
                    updateOrderStatus(orderId, newStatus);
                    this.innerHTML = '<i class="fas fa-check"></i> Updated!';
                    
                    setTimeout(() => {
                        this.innerHTML = this.dataset.originalText;
                        this.disabled = false;
                    }, 2000);
                }, 1000);
            });
        });
        
        // Quick view modal
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.orderId;
                showQuickViewModal(orderId);
            });
        });
    }
    
    // Progress bar animations
    function initProgressAnimations() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        // Animate progress bars on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.dataset.progress + '%';
                    
                    progressBar.style.width = '0%';
                    progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    setTimeout(() => {
                        progressBar.style.width = targetWidth;
                    }, 200);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }
    
    // Real-time status updates with animations
    function initOrderStatusUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            const orderCards = document.querySelectorAll('.order-card');
            orderCards.forEach(card => {
                // Random chance to update status (for demo)
                if (Math.random() < 0.1) {
                    animateStatusChange(card);
                }
            });
        }, 30000); // Check every 30 seconds
    }
    
    // Animate status change
    function animateStatusChange(orderCard) {
        const statusBadge = orderCard.querySelector('.status-badge');
        const progressBar = orderCard.querySelector('.progress-bar');
        
        // Pulse animation for status change
        statusBadge.style.animation = 'pulse 0.6s ease-in-out';
        
        // Update progress with smooth animation
        if (progressBar) {
            const currentProgress = parseInt(progressBar.style.width);
            const newProgress = Math.min(currentProgress + 10, 100);
            
            progressBar.style.transition = 'width 0.8s ease';
            progressBar.style.width = newProgress + '%';
        }
        
        // Show notification
        showStatusNotification(orderCard.dataset.orderNumber);
    }
    
    // Update order status
    function updateOrderStatus(orderId, newStatus) {
        const orderCard = document.querySelector(`[data-order-id="${orderId}"]`);
        if (orderCard) {
            // Smooth transition effect
            orderCard.style.transition = 'all 0.5s ease';
            orderCard.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                // Update status badge
                const statusBadge = orderCard.querySelector('.status-badge');
                statusBadge.textContent = newStatus;
                statusBadge.className = `badge status-badge bg-${getStatusColor(newStatus)}`;
                
                // Update progress
                const progressBar = orderCard.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = getStatusProgress(newStatus) + '%';
                }
                
                orderCard.style.transform = 'scale(1)';
            }, 250);
        }
    }
    
    // Quick view modal
    function showQuickViewModal(orderId) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closeQuickView()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Order #${orderId}</h5>
                    <button onclick="closeQuickView()" class="btn-close"></button>
                </div>
                <div class="modal-body">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading order details...</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animate modal in
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translateY(0) scale(1)';
        }, 10);
        
        // Load order details (simulate API call)
        setTimeout(() => {
            loadOrderDetails(orderId, modal);
        }, 1000);
    }
    
    // Load order details
    function loadOrderDetails(orderId, modal) {
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="order-timeline">
                <div class="timeline-item completed">
                    <i class="fas fa-check-circle"></i>
                    <span>Order Placed</span>
                </div>
                <div class="timeline-item completed">
                    <i class="fas fa-truck"></i>
                    <span>Picked Up</span>
                </div>
                <div class="timeline-item active">
                    <i class="fas fa-tint"></i>
                    <span>Washing</span>
                </div>
                <div class="timeline-item">
                    <i class="fas fa-wind"></i>
                    <span>Drying</span>
                </div>
                <div class="timeline-item">
                    <i class="fas fa-home"></i>
                    <span>Ready for Delivery</span>
                </div>
            </div>
            <div class="order-actions mt-3">
                <button class="btn btn-primary btn-sm">Track Location</button>
                <button class="btn btn-outline-secondary btn-sm">Contact Support</button>
            </div>
        `;
    }
    
    // Status notification
    function showStatusNotification(orderNumber) {
        const notification = document.createElement('div');
        notification.className = 'status-notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Order #${orderNumber} status updated!</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Helper functions
    function getStatusColor(status) {
        const colors = {
            'pending': 'warning',
            'confirmed': 'info',
            'picked_up': 'primary',
            'washing': 'info',
            'drying': 'info',
            'folding': 'info',
            'ready': 'success',
            'out_for_delivery': 'primary',
            'delivered': 'success'
        };
        return colors[status] || 'secondary';
    }
    
    function getStatusProgress(status) {
        const progress = {
            'pending': 10,
            'confirmed': 20,
            'picked_up': 30,
            'washing': 50,
            'drying': 65,
            'folding': 80,
            'ready': 90,
            'out_for_delivery': 95,
            'delivered': 100
        };
        return progress[status] || 0;
    }
    
    // Global functions
    window.closeQuickView = function() {
        const modal = document.querySelector('.quick-view-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.querySelector('.modal-content').style.transform = 'translateY(-20px) scale(0.9)';
            setTimeout(() => modal.remove(), 300);
        }
    };
    
    // Pulse button animation
    document.querySelectorAll('.pulse-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        btn.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
});

// CSS Animations (to be added to the template)
const additionalStyles = `
    .order-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
    }
    
    .pulse-btn {
        position: relative;
        overflow: hidden;
    }
    
    .pulse-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .pulse-btn:hover::before {
        width: 300px;
        height: 300px;
    }
    
    .quick-view-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1050;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translateY(-20px) scale(0.9);
        background: white;
        border-radius: 15px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .status-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bs-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .order-timeline {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .timeline-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .timeline-item.completed {
        background: rgba(40, 167, 69, 0.1);
        color: #28a745;
    }
    
    .timeline-item.active {
        background: rgba(0, 123, 255, 0.1);
        color: #007bff;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .loading-spinner {
        text-align: center;
        padding: 2rem;
    }
    
    .loading-spinner i {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--bs-primary);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
