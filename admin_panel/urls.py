from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    # Authentication
    path('login/', views.admin_login_view, name='login'),
    path('logout/', views.admin_logout_view, name='logout'),
    
    # Dashboard
    path('', views.dashboard_view, name='dashboard'),
    
    # Order Management
    path('orders/', views.orders_management_view, name='orders'),
    path('orders/update-status/<int:order_id>/', views.update_order_status, name='update_order_status'),
    
    # Pricing Management
    path('pricing/', views.pricing_management_view, name='pricing'),
    path('pricing/update/', views.update_pricing, name='update_pricing'),
    
    # User Management
    path('users/', views.users_management_view, name='users'),
    path('users/action/', views.user_action, name='user_action'),
    
    # Pending Orders
    path('orders/pending/', views.pending_orders_view, name='pending_orders'),
    
    # Admin Logs
    path('logs/', views.admin_logs_view, name='logs'),
]
