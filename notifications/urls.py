from django.urls import path
from . import views
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='notifications/notification_list.html'), name='notifications_page'),
    path('api/notifications/', views.notification_list, name='notification_list'),
    path('api/notifications/<int:notification_id>/read/', views.mark_as_read, name='mark_as_read'),
    path('api/notifications/mark-all-read/', views.mark_all_read, name='mark_all_read'),
]
