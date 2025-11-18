from django.conf import settings
from django.db import models


class Notification(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
	message = models.CharField(max_length=255)
	is_read = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return f"To {self.user}: {self.message[:30]}..."


