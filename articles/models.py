from django.conf import settings
from django.db import models


class Article(models.Model):
	title = models.CharField(max_length=200)
	slug = models.SlugField(unique=True)
	content = models.TextField()
	author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return self.title


