from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1
    fields = ['item_type', 'service_level', 'quantity', 'unit_price', 'total_price', 'instructions']
    readonly_fields = ['total_price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'total_items', 'total_cost', 'estimated_completion', 'created_at']
    list_filter = ['status', 'created_at', 'estimated_completion']
    search_fields = ['order_number', 'user__username', 'user__email', 'special_instructions']
    list_editable = ['status']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'reservation', 'status')
        }),
        ('Details', {
            'fields': ('total_items', 'total_cost', 'estimated_completion')
        }),
        ('Instructions', {
            'fields': ('special_instructions',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'item_type', 'service_level', 'quantity', 'unit_price', 'total_price']
    list_filter = ['item_type', 'service_level']
    search_fields = ['order__order_number', 'instructions', 'stain_notes']
    readonly_fields = ['total_price']
