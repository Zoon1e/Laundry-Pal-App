from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Post


class PostListView(ListView):
	model = Post
	context_object_name = 'posts'
	ordering = ['-created_at']


class PostDetailView(DetailView):
	model = Post


class PostCreateView(LoginRequiredMixin, CreateView):
	model = Post
	fields = ['title', 'content']
	success_url = reverse_lazy('forum:list')

	def form_valid(self, form):
		form.instance.author = self.request.user
		return super().form_valid(form)


class PostUpdateView(LoginRequiredMixin, UpdateView):
	model = Post
	fields = ['title', 'content']
	success_url = reverse_lazy('forum:list')


class PostDeleteView(LoginRequiredMixin, DeleteView):
	model = Post
	success_url = reverse_lazy('forum:list')


