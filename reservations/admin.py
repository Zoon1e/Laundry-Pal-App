from django.contrib import admin
from .models import Reservation, ServiceType


@admin.register(ServiceType)
class ServiceTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'base_price', 'price_per_item', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    list_editable = ['base_price', 'price_per_item', 'is_active']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'service_type', 'pickup_datetime', 'status', 'priority', 'estimated_cost', 'created_at']
    list_filter = ['status', 'priority', 'service_type', 'created_at']
    search_fields = ['user__username', 'user__email', 'address', 'notes']
    list_editable = ['status', 'priority']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'pickup_datetime'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'service_type', 'status', 'priority')
        }),
        ('Schedule', {
            'fields': ('pickup_datetime', 'delivery_datetime')
        }),
        ('Location & Contact', {
            'fields': ('address', 'phone_number')
        }),
        ('Pricing', {
            'fields': ('estimated_cost', 'final_cost')
        }),
        ('Additional Information', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
