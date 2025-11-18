from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Reservation


class ReservationListView(LoginRequiredMixin, ListView):
	model = Reservation
	template_name = 'reservations/reservation_list.html'
	context_object_name = 'reservations'
	paginate_by = 6

	def get_queryset(self):
		# Admin users can see all reservations, regular users only see their own
		if self.request.user.is_staff or self.request.user.is_superuser:
			return Reservation.objects.all().select_related('user', 'service_type').order_by('-created_at')
		else:
			return Reservation.objects.filter(user=self.request.user).order_by('-created_at')
	
	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		user_reservations = self.get_queryset()
		
		context['pending_count'] = user_reservations.filter(status='pending').count()
		context['confirmed_count'] = user_reservations.filter(status='confirmed').count()
		context['in_progress_count'] = user_reservations.filter(status='in_progress').count()
		context['completed_count'] = user_reservations.filter(status='completed').count()
		
		return context


class ReservationDetailView(LoginRequiredMixin, DetailView):
	model = Reservation

	def get_queryset(self):
		# Admin users can see all reservations, regular users only see their own
		if self.request.user.is_staff or self.request.user.is_superuser:
			return Reservation.objects.all().select_related('user', 'service_type')
		else:
			return Reservation.objects.filter(user=self.request.user)


class ReservationCreateView(LoginRequiredMixin, CreateView):
	model = Reservation
	template_name = 'reservations/reservation_form.html'
	fields = ['service_type', 'pickup_datetime', 'delivery_datetime', 'address', 'phone_number', 'notes', 'priority']
	success_url = reverse_lazy('reservations:reservation_list')

	def form_valid(self, form):
		form.instance.user = self.request.user
		return super().form_valid(form)


class ReservationUpdateView(LoginRequiredMixin, UpdateView):
	model = Reservation
	fields = ['pickup_datetime', 'delivery_datetime', 'address', 'notes', 'status']
	success_url = reverse_lazy('reservations:reservation_list')

	def get_queryset(self):
		# Admin users can see all reservations, regular users only see their own
		if self.request.user.is_staff or self.request.user.is_superuser:
			return Reservation.objects.all().select_related('user', 'service_type')
		else:
			return Reservation.objects.filter(user=self.request.user)


class ReservationDeleteView(LoginRequiredMixin, DeleteView):
	model = Reservation
	success_url = reverse_lazy('reservations:reservation_list')

	def get_queryset(self):
		# Admin users can see all reservations, regular users only see their own
		if self.request.user.is_staff or self.request.user.is_superuser:
			return Reservation.objects.all().select_related('user', 'service_type')
		else:
			return Reservation.objects.filter(user=self.request.user)

from django.shortcuts import render

# Create your views here.
