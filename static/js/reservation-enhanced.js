// Enhanced Reservation Form with Smooth Transitions
document.addEventListener('DOMContentLoaded', function() {
    
    initFormAnimations();
    initPrioritySelection();
    initDateTimeEnhancements();
    initAddressAutocomplete();
    initCostCalculator();
    initFormValidation();
    initProgressIndicator();
    
    // Form field animations and interactions
    function initFormAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        // Stagger form field animations on load
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Enhanced floating label animations
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            const wrapper = input.closest('.input-wrapper');
            
            // Focus animations
            input.addEventListener('focus', function() {
                wrapper.style.transform = 'scale(1.02)';
                wrapper.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.15)';
                
                // Ripple effect
                createRipple(wrapper, event);
            });
            
            input.addEventListener('blur', function() {
                wrapper.style.transform = 'scale(1)';
                wrapper.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            });
            
            // Typing animation
            input.addEventListener('input', function() {
                const label = wrapper.querySelector('.floating-label');
                if (label) {
                    label.style.animation = 'labelPulse 0.3s ease';
                    setTimeout(() => label.style.animation = '', 300);
                }
            });
        });
    }
    
    // Interactive priority selection with animations
    function initPrioritySelection() {
        const priorityButtons = document.querySelectorAll('.priority-btn');
        
        priorityButtons.forEach(btn => {
            // Hover effects
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
                this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                
                // Glow effect based on priority
                const priority = this.dataset.priority;
                if (priority === 'express') {
                    this.style.boxShadow = '0 10px 25px rgba(255, 193, 7, 0.4)';
                } else if (priority === 'rush') {
                    this.style.boxShadow = '0 10px 25px rgba(220, 53, 69, 0.4)';
                }
            });
            
            btn.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(0) scale(1)';
                    this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }
            });
            
            // Selection animation
            btn.addEventListener('click', function() {
                // Remove active from others
                priorityButtons.forEach(b => {
                    b.classList.remove('active');
                    b.style.transform = 'translateY(0) scale(1)';
                    b.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                });
                
                // Activate this button
                this.classList.add('active');
                this.style.transform = 'translateY(-2px) scale(1.02)';
                
                // Pulse animation
                this.style.animation = 'priorityPulse 0.6s ease';
                setTimeout(() => this.style.animation = '', 600);
                
                // Update delivery time with animation
                updateDeliveryTime(this.dataset.priority);
                
                // Update cost estimate
                updateCostEstimate();
            });
        });
    }
    
    // Enhanced date/time picker interactions
    function initDateTimeEnhancements() {
        const dateInputs = document.querySelectorAll('input[type="datetime-local"]');
        
        dateInputs.forEach(input => {
            const wrapper = input.closest('.input-wrapper');
            
            // Calendar icon animation
            const icon = wrapper.querySelector('.input-icon');
            input.addEventListener('focus', function() {
                if (icon) {
                    icon.style.animation = 'iconBounce 0.5s ease';
                    icon.style.color = 'var(--bs-primary)';
                    
                    // Cost calculation based on service type and priority
                    const baseCosts = {
                        '1': 750,  // Wash & Fold
                        '2': 1250, // Dry Cleaning  
                        '3': 1750  // Premium Care
                    };
                    
                    const itemCosts = {
                        '1': 100, // Wash & Fold per item
                        '2': 400, // Dry Cleaning per item
                        '3': 250  // Premium Care per item
                    };
                    
                    const priorityCosts = {
                        'standard': 0,
                        'express': 500,
                        'rush': 1250
                    };
                }
            });
            
            input.addEventListener('blur', function() {
                if (icon) {
                    icon.style.animation = '';
                    icon.style.color = '#6c757d';
                }
            });
            
            // Date selection animation
            input.addEventListener('change', function() {
                wrapper.style.animation = 'fieldSuccess 0.5s ease';
                setTimeout(() => wrapper.style.animation = '', 500);
                
                // Auto-calculate delivery time if pickup is selected
                if (input.name === 'pickup_datetime') {
                    autoCalculateDelivery();
                }
            });
        });
    }
    
    // Address field enhancements
    function initAddressAutocomplete() {
        const addressField = document.querySelector('textarea[name="address"]');
        if (!addressField) return;
        
        const wrapper = addressField.closest('.form-group');
        
        // Typing indicator
        let typingTimer;
        addressField.addEventListener('input', function() {
            clearTimeout(typingTimer);
            
            // Show typing indicator
            showTypingIndicator(wrapper);
            
            typingTimer = setTimeout(() => {
                hideTypingIndicator(wrapper);
                validateAddress(this.value);
            }, 1000);
        });
        
        // Auto-resize animation
        addressField.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
    
    // Dynamic cost calculator with animations
    function initCostCalculator() {
        const costAlert = document.querySelector('.cost-estimate-alert');
        if (!costAlert) return;
        
        // Initial cost animation
        setTimeout(() => {
            costAlert.style.opacity = '0';
            costAlert.style.transform = 'translateY(-10px)';
            costAlert.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                costAlert.style.opacity = '1';
                costAlert.style.transform = 'translateY(0)';
            }, 100);
        }, 1000);
    }
    
    // Form validation with smooth feedback
    function initFormValidation() {
        const form = document.querySelector('form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Form submission animation
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Reservation...';
                submitBtn.disabled = true;
                
                // Add loading animation to form
                form.style.opacity = '0.7';
                form.style.pointerEvents = 'none';
            }
        });
    }
    
    // Progress indicator
    function initProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        const form = document.querySelector('form');
        if (form) {
            form.insertBefore(progressBar, form.firstChild);
            updateFormProgress();
            
            // Update progress on field changes
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', updateFormProgress);
                input.addEventListener('change', updateFormProgress);
            });
        }
    }
    
    // Helper functions
    function createRipple(element, event) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    function updateDeliveryTime(priority) {
        const deliveryAlert = document.querySelector('.delivery-time-alert');
        if (!deliveryAlert) return;
        
        const times = {
            'standard': '3-5 business days',
            'express': '24 hours',
            'rush': 'Same day'
        };
        
        // Animate update
        deliveryAlert.style.transform = 'scale(0.9)';
        deliveryAlert.style.opacity = '0.5';
        
        setTimeout(() => {
            deliveryAlert.textContent = `Estimated delivery: ${times[priority]}`;
            deliveryAlert.style.transform = 'scale(1)';
            deliveryAlert.style.opacity = '1';
        }, 200);
    }
    
    function updateCostEstimate() {
        const costAlert = document.querySelector('.cost-estimate-alert');
        if (!costAlert) return;
        
        // Simulate cost calculation
        const priority = document.querySelector('.priority-btn.active')?.dataset.priority || 'standard';
        const baseCost = 15;
        const multipliers = { standard: 1, express: 1.5, rush: 2 };
        const estimatedCost = baseCost * multipliers[priority];
        
        // Animate cost update
        costAlert.style.animation = 'costUpdate 0.8s ease';
        setTimeout(() => {
            costAlert.innerHTML = `<i class="fas fa-dollar-sign me-2"></i>Estimated cost: $${estimatedCost}`;
            costAlert.style.animation = '';
        }, 400);
    }
    
    function autoCalculateDelivery() {
        const pickupInput = document.querySelector('input[name="pickup_datetime"]');
        const deliveryInput = document.querySelector('input[name="delivery_datetime"]');
        
        if (pickupInput.value && deliveryInput) {
            const priority = document.querySelector('.priority-btn.active')?.dataset.priority || 'standard';
            const pickupDate = new Date(pickupInput.value);
            
            let deliveryDate = new Date(pickupDate);
            switch(priority) {
                case 'rush':
                    deliveryDate.setHours(deliveryDate.getHours() + 8);
                    break;
                case 'express':
                    deliveryDate.setDate(deliveryDate.getDate() + 1);
                    break;
                default:
                    deliveryDate.setDate(deliveryDate.getDate() + 3);
            }
            
            deliveryInput.value = deliveryDate.toISOString().slice(0, 16);
            
            // Animate the auto-fill
            const wrapper = deliveryInput.closest('.input-wrapper');
            wrapper.style.animation = 'autoFill 0.8s ease';
            setTimeout(() => wrapper.style.animation = '', 800);
        }
    }
    
    function showTypingIndicator(wrapper) {
        let indicator = wrapper.querySelector('.typing-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = '<i class="fas fa-circle"></i><i class="fas fa-circle"></i><i class="fas fa-circle"></i>';
            wrapper.appendChild(indicator);
        }
        indicator.style.opacity = '1';
    }
    
    function hideTypingIndicator(wrapper) {
        const indicator = wrapper.querySelector('.typing-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
        }
    }
    
    function validateAddress(address) {
        // Simple validation simulation
        const wrapper = document.querySelector('textarea[name="address"]').closest('.form-group');
        
        if (address.length > 10) {
            showFieldSuccess(wrapper);
        }
    }
    
    function validateField(field) {
        const wrapper = field.closest('.input-wrapper') || field.closest('.form-group');
        
        if (field.checkValidity()) {
            showFieldSuccess(wrapper);
        } else {
            showFieldError(wrapper, field.validationMessage);
        }
    }
    
    function showFieldSuccess(wrapper) {
        wrapper.classList.remove('field-error');
        wrapper.classList.add('field-success');
        
        // Success animation
        wrapper.style.animation = 'fieldSuccess 0.5s ease';
        setTimeout(() => wrapper.style.animation = '', 500);
    }
    
    function showFieldError(wrapper, message) {
        wrapper.classList.remove('field-success');
        wrapper.classList.add('field-error');
        
        // Error animation
        wrapper.style.animation = 'fieldError 0.5s ease';
        setTimeout(() => wrapper.style.animation = '', 500);
        
        // Show error message
        let errorMsg = wrapper.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            wrapper.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
        errorMsg.style.opacity = '1';
    }
    
    function clearFieldError(field) {
        const wrapper = field.closest('.input-wrapper') || field.closest('.form-group');
        wrapper.classList.remove('field-error');
        
        const errorMsg = wrapper.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.style.opacity = '0';
        }
    }
    
    function updateFormProgress() {
        const form = document.querySelector('form');
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        const filled = Array.from(inputs).filter(input => input.value.trim() !== '').length;
        const progress = (filled / inputs.length) * 100;
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
            
            // Color based on progress
            if (progress < 30) {
                progressFill.style.background = 'linear-gradient(90deg, #dc3545, #fd7e14)';
            } else if (progress < 70) {
                progressFill.style.background = 'linear-gradient(90deg, #fd7e14, #ffc107)';
            } else {
                progressFill.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
            }
        }
    }
});

// CSS Animations (to be injected)
const enhancedStyles = `
    .form-group {
        position: relative;
        margin-bottom: 1.5rem;
    }
    
    .input-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 123, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    .priority-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    
    .priority-btn.active {
        transform: translateY(-2px) scale(1.02) !important;
    }
    
    .typing-indicator {
        position: absolute;
        bottom: -25px;
        right: 10px;
        display: flex;
        gap: 3px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .typing-indicator i {
        font-size: 6px;
        color: var(--bs-primary);
        animation: typingDots 1.4s infinite;
    }
    
    .typing-indicator i:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator i:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    .form-progress-bar {
        height: 4px;
        background: rgba(0,0,0,0.1);
        border-radius: 2px;
        margin-bottom: 2rem;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #dc3545, #fd7e14);
        border-radius: 2px;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .field-success .form-control {
        border-color: #28a745;
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
    }
    
    .field-error .form-control {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    .error-message {
        position: absolute;
        bottom: -20px;
        left: 0;
        font-size: 0.875rem;
        color: #dc3545;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes labelPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes priorityPulse {
        0%, 100% { transform: translateY(-2px) scale(1.02); }
        50% { transform: translateY(-4px) scale(1.08); }
    }
    
    @keyframes iconBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes fieldSuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    @keyframes fieldError {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes costUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes autoFill {
        0% { background-color: transparent; }
        50% { background-color: rgba(40, 167, 69, 0.1); }
        100% { background-color: transparent; }
    }
    
    @keyframes typingDots {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
    }
    
    /* Enhanced hover effects */
    .form-control:focus {
        transform: scale(1.01);
        transition: all 0.3s ease;
    }
    
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    /* Smooth transitions for all interactive elements */
    * {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                   box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                   background-color 0.3s ease,
                   border-color 0.3s ease;
    }
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);
