from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal


class PricingRule(models.Model):
    """Model for managing pricing rules for different services"""
    
    class ServiceCategory(models.TextChoices):
        WASH_FOLD = 'wash_fold', 'Wash & Fold'
        DRY_CLEAN = 'dry_clean', 'Dry Clean'
        PRESS_ONLY = 'press_only', 'Press Only'
        STAIN_TREATMENT = 'stain_treatment', 'Stain Treatment'
    
    class ItemCategory(models.TextChoices):
        SHIRT = 'shirt', 'Shirt'
        PANTS = 'pants', 'Pants'
        DRESS = 'dress', 'Dress'
        JACKET = 'jacket', 'Jacket'
        BEDDING = 'bedding', 'Bedding'
        TOWEL = 'towel', 'Towel'
        DELICATE = 'delicate', 'Delicate Items'
        OTHER = 'other', 'Other'
    
    service_category = models.CharField(max_length=20, choices=ServiceCategory.choices)
    item_category = models.CharField(max_length=20, choices=ItemCategory.choices)
    base_price = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
    express_multiplier = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('1.5'))
    rush_multiplier = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal('2.0'))
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['service_category', 'item_category']
        ordering = ['service_category', 'item_category']
    
    def __str__(self):
        return f"{self.get_service_category_display()} - {self.get_item_category_display()}: ${self.base_price}"


class AdminSettings(models.Model):
    """Model for storing admin-configurable settings"""
    
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.key}: {self.value[:50]}"


class AdminLog(models.Model):
    """Model for logging admin actions"""
    
    class ActionType(models.TextChoices):
        ORDER_UPDATE = 'order_update', 'Order Status Update'
        PRICE_CHANGE = 'price_change', 'Price Change'
        USER_ACTION = 'user_action', 'User Management'
        SETTINGS_CHANGE = 'settings_change', 'Settings Change'
        LOGIN = 'login', 'Admin Login'
        LOGOUT = 'logout', 'Admin Logout'
    
    admin_user = models.ForeignKey(User, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=20, choices=ActionType.choices)
    description = models.TextField()
    target_model = models.CharField(max_length=100, blank=True)  # Model name that was affected
    target_id = models.PositiveIntegerField(null=True, blank=True)  # ID of affected object
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.admin_user.username} - {self.get_action_type_display()} at {self.timestamp}"
