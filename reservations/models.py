from django.conf import settings
from django.db import models
from decimal import Decimal


class ServiceType(models.Model):
	name = models.CharField(max_length=100)
	description = models.TextField()
	base_price = models.DecimalField(max_digits=10, decimal_places=2)
	price_per_item = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
	is_active = models.BooleanField(default=True)
	
	def __str__(self):
		return self.name


class Reservation(models.Model):
	class Status(models.TextChoices):
		PENDING = 'pending', 'Pending'
		CONFIRMED = 'confirmed', 'Confirmed'
		IN_PROGRESS = 'in_progress', 'In Progress'
		COMPLETED = 'completed', 'Completed'
		CANCELLED = 'cancelled', 'Cancelled'
	
	class Priority(models.TextChoices):
		STANDARD = 'standard', 'Standard'
		EXPRESS = 'express', 'Express (24h)'
		RUSH = 'rush', 'Rush (Same Day)'

	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
	service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE, null=True, blank=True)
	pickup_datetime = models.DateTimeField()
	delivery_datetime = models.DateTimeField()
	address = models.CharField(max_length=255)
	phone_number = models.CharField(max_length=20, blank=True)
	notes = models.TextField(blank=True)
	priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.STANDARD)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
	estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	final_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self) -> str:
		return f"Reservation #{self.pk} for {self.user}"
	
	def get_status_color(self):
		colors = {
			'pending': 'warning',
			'confirmed': 'info',
			'in_progress': 'primary',
			'completed': 'success',
			'cancelled': 'danger'
		}
		return colors.get(self.status, 'secondary')
	
	def get_priority_color(self):
		colors = {
			'standard': 'secondary',
			'express': 'warning',
			'rush': 'danger'
		}
		return colors.get(self.priority, 'secondary')

from django.db import models

# Create your models here.
