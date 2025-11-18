from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import Notification


@login_required
def notification_list(request):
    """Get user's notifications as JSON"""
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')[:10]
    
    data = {
        'notifications': [
            {
                'id': notif.id,
                'message': notif.message,
                'is_read': notif.is_read,
                'created_at': notif.created_at.strftime('%b %d, %Y %I:%M %p'),
                'time_ago': get_time_ago(notif.created_at)
            }
            for notif in notifications
        ],
        'unread_count': notifications.filter(is_read=False).count()
    }
    
    return JsonResponse(data)


@login_required
@require_POST
def mark_as_read(request, notification_id):
    """Mark a specific notification as read"""
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return JsonResponse({'success': True})
    except Notification.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Notification not found'})


@login_required
@require_POST
def mark_all_read(request):
    """Mark all user notifications as read"""
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return JsonResponse({'success': True})


def get_time_ago(created_at):
    """Helper function to get human-readable time difference"""
    now = timezone.now()
    diff = now - created_at
    
    if diff.days > 0:
        return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    else:
        return "Just now"
