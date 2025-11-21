from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from .models import Order, OrderItem


class OrderListView(LoginRequiredMixin, ListView):
	model = Order
	template_name = 'orders/order_list.html'
	context_object_name = 'orders'
	paginate_by = 6

	def get_queryset(self):
		# Admin users can see all orders, regular users only see their own
		if self.request.user.is_staff or self.request.user.is_superuser:
			return Order.objects.all().select_related('user', 'reservation').prefetch_related('items').order_by('-created_at')
		else:
			return Order.objects.filter(user=self.request.user).select_related('reservation').prefetch_related('items').order_by('-created_at')
	
	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		user_orders = self.get_queryset()
		
		context['pending_count'] = user_orders.filter(status='pending').count()
		context['picked_up_count'] = user_orders.filter(status='picked_up').count()
		context['washing_count'] = user_orders.filter(status='washing').count()
		context['drying_count'] = user_orders.filter(status='drying').count()
		context['out_for_delivery_count'] = user_orders.filter(status='out_for_delivery').count()
		context['delivered_count'] = user_orders.filter(status='delivered').count()
		
		return context


class OrderDetailView(LoginRequiredMixin, DetailView):
	model = Order
	template_name = 'orders/order_detail.html'

	def get_queryset(self):
		# Admin users can see all orders, regular users only see their own
		if self.request.user.is_staff or self.request.user.is_superuser:
			return Order.objects.all().select_related('user', 'reservation').prefetch_related('items')
		else:
			return Order.objects.filter(user=self.request.user)


class OrderCreateView(LoginRequiredMixin, CreateView):
	model = Order
	fields = ['reservation', 'total_items', 'total_cost', 'special_instructions', 'estimated_completion']
	success_url = reverse_lazy('orders:list')

	def form_valid(self, form):
		form.instance.user = self.request.user
		form.instance.status = 'pending'
		return super().form_valid(form)


class OrderUpdateView(LoginRequiredMixin, UpdateView):
	model = Order
	fields = ['status', 'total_items', 'total_cost', 'special_instructions', 'estimated_completion']
	success_url = reverse_lazy('orders:list')

	def get_queryset(self):
		# Admin users can see all orders, regular users only see their own
		if self.request.user.is_staff or self.request.user.is_superuser:
			return Order.objects.all().select_related('user', 'reservation').prefetch_related('items')
		else:
			return Order.objects.filter(user=self.request.user)


class OrderDeleteView(LoginRequiredMixin, DeleteView):
	model = Order
	success_url = reverse_lazy('orders:list')

	def get_queryset(self):
		# Admin users can see all orders, regular users only see their own
		if self.request.user.is_staff or self.request.user.is_superuser:
			return Order.objects.all().select_related('user', 'reservation').prefetch_related('items')
		else:
			return Order.objects.filter(user=self.request.user)


class DebugTestView(TemplateView):
	template_name = 'orders/debug_test.html'
