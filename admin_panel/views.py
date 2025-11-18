from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q, Count, Sum
from django.utils import timezone
from django.contrib.auth.models import User
import json

from orders.models import Order, OrderItem
from reservations.models import Reservation, ServiceType
from .models import PricingRule, AdminSettings, AdminLog


def is_admin_user(user):
    """Check if user is admin (staff or superuser)"""
    return user.is_authenticated and (user.is_staff or user.is_superuser)


def log_admin_action(user, action_type, description, target_model=None, target_id=None, request=None):
    """Helper function to log admin actions"""
    ip_address = None
    if request:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')
    
    AdminLog.objects.create(
        admin_user=user,
        action_type=action_type,
        description=description,
        target_model=target_model,
        target_id=target_id,
        ip_address=ip_address
    )


def admin_login_view(request):
    """Admin login page"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user and is_admin_user(user):
            login(request, user)
            log_admin_action(user, AdminLog.ActionType.LOGIN, f"Admin {username} logged in", request=request)
            messages.success(request, f'Welcome back, {user.first_name or user.username}!')
            return redirect('admin_panel:dashboard')
        else:
            messages.error(request, 'Invalid credentials or insufficient permissions.')
    
    return render(request, 'admin_panel/login.html')


@login_required
@user_passes_test(is_admin_user)
def admin_logout_view(request):
    """Admin logout"""
    log_admin_action(request.user, AdminLog.ActionType.LOGOUT, f"Admin {request.user.username} logged out", request=request)
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('admin_panel:login')


@login_required
@user_passes_test(is_admin_user)
def dashboard_view(request):
    """Admin dashboard with overview statistics"""
    # Get statistics
    total_orders = Order.objects.count()
    pending_orders = Order.objects.filter(status='pending').count()
    active_orders = Order.objects.filter(status__in=['confirmed', 'picked_up', 'washing', 'drying', 'folding', 'ready', 'out_for_delivery']).count()
    completed_orders = Order.objects.filter(status='delivered').count()
    
    total_users = User.objects.filter(is_staff=False, is_superuser=False).count()
    total_reservations = Reservation.objects.count()
    
    # Revenue statistics
    from django.db.models import Sum
    total_revenue = Order.objects.filter(status='delivered').aggregate(Sum('total_cost'))['total_cost__sum'] or 0
    
    # Recent orders
    recent_orders = Order.objects.select_related('user', 'reservation').order_by('-created_at')[:10]
    
    # Order status distribution
    status_distribution = Order.objects.values('status').annotate(count=Count('id')).order_by('status')
    
    context = {
        'total_orders': total_orders,
        'pending_orders': pending_orders,
        'active_orders': active_orders,
        'completed_orders': completed_orders,
        'total_users': total_users,
        'total_reservations': total_reservations,
        'total_revenue': total_revenue,
        'recent_orders': recent_orders,
        'status_distribution': status_distribution,
    }
    
    return render(request, 'admin_panel/dashboard.html', context)


@login_required
@user_passes_test(is_admin_user)
def orders_management_view(request):
    """Orders management page"""
    # Get filter parameters
    status_filter = request.GET.get('status', '')
    search_query = request.GET.get('search', '')
    date_from = request.GET.get('date_from', '')
    date_to = request.GET.get('date_to', '')
    
    # Base queryset
    orders = Order.objects.select_related('user', 'reservation').prefetch_related('items')
    
    # Apply filters
    if status_filter:
        orders = orders.filter(status=status_filter)
    
    if search_query:
        orders = orders.filter(
            Q(order_number__icontains=search_query) |
            Q(user__username__icontains=search_query) |
            Q(user__email__icontains=search_query) |
            Q(user__first_name__icontains=search_query) |
            Q(user__last_name__icontains=search_query)
        )
    
    if date_from:
        orders = orders.filter(created_at__date__gte=date_from)
    
    if date_to:
        orders = orders.filter(created_at__date__lte=date_to)
    
    # Pagination
    paginator = Paginator(orders.order_by('-created_at'), 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get all status choices for filter dropdown
    status_choices = Order.Status.choices
    
    context = {
        'page_obj': page_obj,
        'status_choices': status_choices,
        'current_filters': {
            'status': status_filter,
            'search': search_query,
            'date_from': date_from,
            'date_to': date_to,
        }
    }
    
    return render(request, 'admin_panel/orders_management.html', context)


@login_required
@user_passes_test(is_admin_user)
@require_http_methods(["POST"])
def update_order_status(request, order_id):
    """AJAX endpoint to update order status"""
    try:
        print(f"Updating order {order_id} with data: {request.POST}")
        
        order = get_object_or_404(Order, id=order_id)
        new_status = request.POST.get('status')
        
        print(f"Order found: {order.order_number}, current status: {order.status}, new status: {new_status}")
        
        if new_status not in dict(Order.Status.choices):
            print(f"Invalid status: {new_status}")
            return JsonResponse({'success': False, 'error': 'Invalid status'})
        
        old_status = order.status
        order.status = new_status
        order.save()
        
        print(f"Order status updated successfully")
        
        # Log the action
        log_admin_action(
            request.user,
            AdminLog.ActionType.ORDER_UPDATE,
            f"Updated order #{order.order_number} status from {old_status} to {new_status}",
            target_model='Order',
            target_id=order.id,
            request=request
        )
        
        response_data = {
            'success': True,
            'new_status': order.get_status_display(),
            'status_color': order.get_status_color(),
            'progress_percentage': order.get_progress_percentage()
        }
        
        print(f"Returning response: {response_data}")
        return JsonResponse(response_data)
        
    except Exception as e:
        print(f"Error updating order status: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@user_passes_test(is_admin_user)
def pricing_management_view(request):
    """Pricing management page"""
    pricing_rules = PricingRule.objects.all().order_by('service_category', 'item_category')
    
    context = {
        'pricing_rules': pricing_rules,
        'service_choices': PricingRule.ServiceCategory.choices,
        'item_choices': PricingRule.ItemCategory.choices,
    }
    
    return render(request, 'admin_panel/pricing_management.html', context)


@login_required
@user_passes_test(is_admin_user)
@require_http_methods(["POST"])
def update_pricing(request):
    """AJAX endpoint to update pricing"""
    try:
        rule_id = request.POST.get('rule_id')
        base_price = request.POST.get('base_price')
        express_multiplier = request.POST.get('express_multiplier')
        rush_multiplier = request.POST.get('rush_multiplier')
        
        if rule_id:
            # Update existing rule
            rule = get_object_or_404(PricingRule, id=rule_id)
            old_price = rule.base_price
        else:
            # Create new rule
            service_category = request.POST.get('service_category')
            item_category = request.POST.get('item_category')
            rule = PricingRule(service_category=service_category, item_category=item_category)
            old_price = 0
        
        rule.base_price = base_price
        rule.express_multiplier = express_multiplier
        rule.rush_multiplier = rush_multiplier
        rule.save()
        
        # Log the action
        action_desc = f"Updated pricing for {rule.get_service_category_display()} - {rule.get_item_category_display()}: ${old_price} → ${rule.base_price}"
        log_admin_action(
            request.user,
            AdminLog.ActionType.PRICE_CHANGE,
            action_desc,
            target_model='PricingRule',
            target_id=rule.id,
            request=request
        )
        
        return JsonResponse({'success': True, 'rule_id': rule.id})
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@user_passes_test(is_admin_user)
def users_management_view(request):
    """Users management page"""
    search_query = request.GET.get('search', '')
    
    users = User.objects.filter(is_staff=False, is_superuser=False)
    
    if search_query:
        users = users.filter(
            Q(username__icontains=search_query) |
            Q(email__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query)
        )
    
    # Add order statistics for each user
    users = users.annotate(
        total_orders=Count('orders'),
        total_spent=Sum('orders__total_cost')
    ).order_by('-date_joined')
    
    # Pagination
    paginator = Paginator(users, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'search_query': search_query,
    }
    
    return render(request, 'admin_panel/users_management.html', context)


@login_required
@user_passes_test(is_admin_user)
def admin_logs_view(request):
    """Admin activity logs"""
    action_filter = request.GET.get('action', '')
    admin_filter = request.GET.get('admin', '')
    
    logs = AdminLog.objects.select_related('admin_user')
    
    if action_filter:
        logs = logs.filter(action_type=action_filter)
    
    if admin_filter:
        logs = logs.filter(admin_user__username__icontains=admin_filter)
    
    # Pagination
    paginator = Paginator(logs.order_by('-timestamp'), 50)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get unique action types and admin users for filters
    action_choices = AdminLog.ActionType.choices
    admin_users = User.objects.filter(is_staff=True).values_list('username', flat=True)
    
    context = {
        'page_obj': page_obj,
        'action_choices': action_choices,
        'admin_users': admin_users,
        'current_filters': {
            'action': action_filter,
            'admin': admin_filter,
        }
    }
    
    return render(request, 'admin_panel/admin_logs.html', context)


@login_required
@user_passes_test(is_admin_user)
@require_http_methods(["POST"])
def user_action(request):
    """AJAX endpoint to perform user actions"""
    try:
        user_id = request.POST.get('user_id')
        action = request.POST.get('action')
        
        target_user = get_object_or_404(User, id=user_id)
        
        if action == 'activate':
            target_user.is_active = True
            action_desc = f"Activated user account: {target_user.username}"
        elif action == 'deactivate':
            target_user.is_active = False
            action_desc = f"Deactivated user account: {target_user.username}"
        elif action == 'make_staff':
            target_user.is_staff = True
            action_desc = f"Granted staff privileges to user: {target_user.username}"
        else:
            return JsonResponse({'success': False, 'error': 'Invalid action'})
        
        target_user.save()
        
        # Log the action
        log_admin_action(
            request.user,
            AdminLog.ActionType.USER_ACTION,
            action_desc,
            target_model='User',
            target_id=target_user.id,
            request=request
        )
        
        return JsonResponse({'success': True})
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})


@login_required
@user_passes_test(is_admin_user)
def pending_orders_view(request):
    """View for pending orders specifically"""
    pending_orders = Order.objects.filter(status='pending').select_related('user', 'reservation').prefetch_related('items').order_by('-created_at')
    
    # Pagination
    paginator = Paginator(pending_orders, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'pending_count': pending_orders.count(),
        'page_title': 'Pending Orders',
    }
    
    return render(request, 'admin_panel/pending_orders.html', context)
