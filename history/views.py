from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, timedelta
from orders.models import Order
from reservations.models import Reservation


@login_required
def history_view(request):
    """Display user's order and reservation history"""
    # Get filter parameters
    filter_type = request.GET.get('type', 'all')  # all, orders, reservations
    date_range = request.GET.get('range', '30')  # 7, 30, 90, all
    status_filter = request.GET.get('status', 'all')
    
    # Calculate date range
    if date_range != 'all':
        days = int(date_range)
        start_date = timezone.now() - timedelta(days=days)
    else:
        start_date = None
    
    # Get orders
    orders = Order.objects.filter(user=request.user)
    if start_date:
        orders = orders.filter(created_at__gte=start_date)
    if status_filter != 'all':
        orders = orders.filter(status=status_filter)
    
    # Get reservations
    reservations = Reservation.objects.filter(user=request.user)
    if start_date:
        reservations = reservations.filter(created_at__gte=start_date)
    if status_filter != 'all':
        reservations = reservations.filter(status=status_filter)
    
    # Combine and sort by date
    history_items = []
    
    if filter_type in ['all', 'orders']:
        for order in orders:
            history_items.append({
                'type': 'order',
                'id': order.id,
                'title': f'Order #{order.id}',
                'status': order.status,
                'date': order.created_at,
                'cost': order.total_cost,
                'items_count': order.total_items,
                'reservation': order.reservation,
                'completion_date': order.estimated_completion,
                'object': order
            })
    
    if filter_type in ['all', 'reservations']:
        for reservation in reservations:
            history_items.append({
                'type': 'reservation',
                'id': reservation.id,
                'title': f'Reservation #{reservation.id}',
                'status': reservation.status,
                'date': reservation.created_at,
                'pickup_time': reservation.pickup_time,
                'delivery_time': reservation.delivery_time,
                'service_type': reservation.get_service_type_display(),
                'priority': reservation.priority,
                'object': reservation
            })
    
    # Sort by date (newest first)
    history_items.sort(key=lambda x: x['date'], reverse=True)
    
    # Get statistics
    stats = {
        'total_orders': Order.objects.filter(user=request.user).count(),
        'completed_orders': Order.objects.filter(user=request.user, status='delivered').count(),
        'total_reservations': Reservation.objects.filter(user=request.user).count(),
        'completed_reservations': Reservation.objects.filter(user=request.user, status='completed').count(),
        'total_spent': sum(order.total_cost or 0 for order in Order.objects.filter(user=request.user)),
    }
    
    context = {
        'history_items': history_items,
        'stats': stats,
        'filter_type': filter_type,
        'date_range': date_range,
        'status_filter': status_filter,
    }
    
    return render(request, 'history/history.html', context)
