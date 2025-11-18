from django.conf import settings
from django.db import models
from decimal import Decimal


class Order(models.Model):
	class Status(models.TextChoices):
		PENDING = 'pending', 'Pending'
		CONFIRMED = 'confirmed', 'Confirmed'
		PICKED_UP = 'picked_up', 'Picked Up'
		WASHING = 'washing', 'Washing'
		DRYING = 'drying', 'Drying'
		FOLDING = 'folding', 'Folding'
		READY = 'ready', 'Ready for Delivery'
		OUT_FOR_DELIVERY = 'out_for_delivery', 'Out for Delivery'
		DELIVERED = 'delivered', 'Delivered'

	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
	reservation = models.ForeignKey('reservations.Reservation', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
	order_number = models.CharField(max_length=20, unique=True, blank=True)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
	total_items = models.PositiveIntegerField(default=0)
	total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
	special_instructions = models.TextField(blank=True)
	estimated_completion = models.DateTimeField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self) -> str:
		return f"Order #{self.order_number or self.pk} ({self.get_status_display()})"
	
	def save(self, *args, **kwargs):
		if not self.order_number:
			# First save to get the pk
			super().save(*args, **kwargs)
			# Then generate order number with pk
			from django.utils import timezone
			now = timezone.now()
			self.order_number = f"LP{self.pk:04d}{now.strftime('%m%d')}"
			super().save(update_fields=['order_number'])
		else:
			super().save(*args, **kwargs)
	
	def get_status_color(self):
		colors = {
			'pending': 'secondary',
			'confirmed': 'info',
			'picked_up': 'primary',
			'washing': 'primary',
			'drying': 'primary',
			'folding': 'warning',
			'ready': 'success',
			'out_for_delivery': 'warning',
			'delivered': 'success'
		}
		return colors.get(self.status, 'secondary')
	
	def get_progress_percentage(self):
		status_progress = {
			'pending': 0,
			'confirmed': 10,
			'picked_up': 20,
			'washing': 40,
			'drying': 60,
			'folding': 80,
			'ready': 90,
			'out_for_delivery': 95,
			'delivered': 100
		}
		return status_progress.get(self.status, 0)
	
	def get_status_icon(self):
		status_icons = {
			'pending': 'clock',
			'confirmed': 'check-circle',
			'picked_up': 'truck',
			'washing': 'soap',
			'drying': 'wind',
			'folding': 'hands',
			'ready': 'check-circle',
			'out_for_delivery': 'shipping-fast',
			'delivered': 'check-circle'
		}
		return status_icons.get(self.status, 'clock')


class OrderItem(models.Model):
	class ItemType(models.TextChoices):
		SHIRT = 'shirt', 'Shirt'
		PANTS = 'pants', 'Pants'
		DRESS = 'dress', 'Dress'
		JACKET = 'jacket', 'Jacket'
		BEDDING = 'bedding', 'Bedding'
		TOWEL = 'towel', 'Towel'
		DELICATE = 'delicate', 'Delicate Items'
		OTHER = 'other', 'Other'
	
	class ServiceLevel(models.TextChoices):
		WASH_FOLD = 'wash_fold', 'Wash & Fold'
		DRY_CLEAN = 'dry_clean', 'Dry Clean'
		PRESS_ONLY = 'press_only', 'Press Only'
		STAIN_TREATMENT = 'stain_treatment', 'Stain Treatment'

	order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
	item_type = models.CharField(max_length=20, choices=ItemType.choices)
	service_level = models.CharField(max_length=20, choices=ServiceLevel.choices, default=ServiceLevel.WASH_FOLD)
	quantity = models.PositiveIntegerField(default=1)
	unit_price = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
	total_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
	instructions = models.CharField(max_length=255, blank=True)
	stain_notes = models.TextField(blank=True)

	def __str__(self) -> str:
		return f"{self.get_item_type_display()} x{self.quantity} ({self.get_service_level_display()})"
	
	def save(self, *args, **kwargs):
		self.total_price = self.unit_price * self.quantity
		super().save(*args, **kwargs)

from django.db import models

# Create your models here.
