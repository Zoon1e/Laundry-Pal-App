from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Article


class ArticleListView(ListView):
	model = Article
	context_object_name = 'articles'
	ordering = ['-created_at']


class ArticleDetailView(DetailView):
	model = Article


class ArticleCreateView(LoginRequiredMixin, CreateView):
	model = Article
	fields = ['title', 'slug', 'content']
	success_url = reverse_lazy('articles:list')

	def form_valid(self, form):
		form.instance.author = self.request.user
		return super().form_valid(form)


class ArticleUpdateView(LoginRequiredMixin, UpdateView):
	model = Article
	fields = ['title', 'slug', 'content']
	success_url = reverse_lazy('articles:list')


class ArticleDeleteView(LoginRequiredMixin, DeleteView):
	model = Article
	success_url = reverse_lazy('articles:list')


