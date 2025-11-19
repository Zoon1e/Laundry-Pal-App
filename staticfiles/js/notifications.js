// Notifications functionality
class NotificationManager {
    constructor() {
        this.notificationsList = document.getElementById('notificationsList');
        this.notificationBadge = document.getElementById('notificationBadge');
        this.markAllReadBtn = document.getElementById('markAllRead');
        this.dropdownButton = document.getElementById('notificationsDropdown');
        
        this.init();
    }
    
    init() {
        if (!this.notificationsList) return;
        
        // Load notifications on page load
        this.loadNotifications();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Auto-refresh notifications every 30 seconds
        setInterval(() => this.loadNotifications(), 30000);
    }
    
    setupEventListeners() {
        // Mark all as read
        if (this.markAllReadBtn) {
            this.markAllReadBtn.addEventListener('click', () => this.markAllAsRead());
        }
        
        // Refresh notifications when dropdown is opened
        if (this.dropdownButton) {
            this.dropdownButton.addEventListener('click', () => {
                setTimeout(() => this.loadNotifications(), 100);
            });
        }
    }
    
    async loadNotifications() {
        try {
            const response = await fetch('/notifications/api/notifications/');
            if (!response.ok) throw new Error('Failed to load notifications');
            
            const data = await response.json();
            this.renderNotifications(data.notifications);
            this.updateBadge(data.unread_count);
            
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.showError('Failed to load notifications');
        }
    }
    
    renderNotifications(notifications) {
        if (!notifications || notifications.length === 0) {
            this.notificationsList.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="fas fa-bell-slash fa-2x mb-2"></i>
                    <p class="mb-0">No notifications yet</p>
                </div>
            `;
            return;
        }
        
        const notificationsHtml = notifications.map(notification => `
            <div class="dropdown-item notification-item ${notification.is_read ? 'read' : 'unread'}" 
                 data-notification-id="${notification.id}">
                <div class="d-flex align-items-start">
                    <div class="notification-icon me-3">
                        <i class="fas fa-info-circle text-primary"></i>
                    </div>
                    <div class="flex-grow-1">
                        <p class="mb-1 notification-message">${notification.message}</p>
                        <small class="text-muted notification-time">${notification.time_ago}</small>
                    </div>
                    ${!notification.is_read ? `
                        <button class="btn btn-sm btn-outline-primary mark-read-btn" 
                                data-notification-id="${notification.id}"
                                title="Mark as read">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        this.notificationsList.innerHTML = notificationsHtml;
        
        // Add click handlers for mark as read buttons
        this.notificationsList.querySelectorAll('.mark-read-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const notificationId = btn.dataset.notificationId;
                this.markAsRead(notificationId);
            });
        });
    }
    
    updateBadge(unreadCount) {
        // Update both the old dropdown badge and new nav badge
        const badges = [this.notificationBadge, document.getElementById('navNotificationBadge')];
        
        badges.forEach(badge => {
            if (badge) {
                if (unreadCount > 0) {
                    badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                    badge.style.display = 'block';
                    
                    // Add pulse animation for new notifications
                    badge.style.animation = 'pulse 1s ease-in-out';
                    setTimeout(() => {
                        if (badge) {
                            badge.style.animation = '';
                        }
                    }, 1000);
                } else {
                    badge.style.display = 'none';
                }
            }
        });
    }
    
    async markAsRead(notificationId) {
        try {
            const response = await fetch(`/notifications/api/notifications/${notificationId}/read/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                // Refresh notifications
                this.loadNotifications();
                this.showSuccess('Notification marked as read');
            } else {
                throw new Error('Failed to mark notification as read');
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            this.showError('Failed to mark notification as read');
        }
    }
    
    async markAllAsRead() {
        try {
            const response = await fetch('/notifications/api/notifications/mark-all-read/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCSRFToken(),
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                // Refresh notifications
                this.loadNotifications();
                this.showSuccess('All notifications marked as read');
            } else {
                throw new Error('Failed to mark all notifications as read');
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            this.showError('Failed to mark all notifications as read');
        }
    }
    
    getCSRFToken() {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
        return csrfToken ? csrfToken.value : '';
    }
    
    showSuccess(message) {
        this.showToast(message, 'success');
    }
    
    showError(message) {
        this.showToast(message, 'error');
    }
    
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        // Add to page
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        toastContainer.appendChild(toast);
        
        // Show toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove from DOM after hiding
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Notification creation helper
class NotificationCreator {
    static async createNotification(userId, message) {
        // This would typically be called from server-side code
        // For demo purposes, we'll simulate creating notifications
        console.log(`Creating notification for user ${userId}: ${message}`);
    }
    
    // Simulate notifications for demo
    static createDemoNotifications() {
        const demoMessages = [
            "Your laundry order #1234 is ready for pickup!",
            "Reservation confirmed for tomorrow at 2:00 PM",
            "Special offer: 20% off premium care services",
            "Your order has been picked up and is being processed",
            "Reminder: Your scheduled pickup is in 1 hour"
        ];
        
        // This would normally be done server-side
        console.log('Demo notifications would be created:', demoMessages);
    }
}

// Initialize notifications when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if user is authenticated (notifications dropdown exists)
    if (document.getElementById('notificationsDropdown')) {
        window.notificationManager = new NotificationManager();
        
        // For demo purposes, you can uncomment this to create sample notifications
        // NotificationCreator.createDemoNotifications();
    }
});

// CSS animations for notifications
const notificationStyles = `
<style>
.notification-item {
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s ease;
}

.notification-item:hover {
    background-color: #f8f9fa;
}

.notification-item.unread {
    background-color: #e3f2fd;
    border-left: 3px solid #2196f3;
}

.notification-item.read {
    opacity: 0.8;
}

.notification-icon {
    width: 30px;
    text-align: center;
}

.notification-message {
    font-size: 0.9rem;
    line-height: 1.4;
}

.notification-time {
    font-size: 0.8rem;
}

.mark-read-btn {
    opacity: 0;
    transition: opacity 0.2s ease;
}

.notification-item:hover .mark-read-btn {
    opacity: 1;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.dropdown-menu {
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    border: none;
    border-radius: 10px;
}

.dropdown-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    padding: 1rem;
    border-radius: 10px 10px 0 0;
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', notificationStyles);
