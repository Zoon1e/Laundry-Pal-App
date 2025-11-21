from django.core.management.base import BaseCommand
from django.utils import timezone
from orders.models import Order
from datetime import timedelta

class Command(BaseCommand):
    help = 'Automatically progress orders through statuses over time'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        
        # Status progression with time intervals (in minutes)
        progressions = [
            ('pending', 'confirmed', 5),
            ('confirmed', 'picked_up', 10),
            ('picked_up', 'washing', 15),
            ('washing', 'drying', 20),
            ('drying', 'folding', 15),
            ('folding', 'ready', 10),
            ('ready', 'out_for_delivery', 5),
            ('out_for_delivery', 'delivered', 10),
        ]
        
        updated_count = 0
        
        for current_status, next_status, minutes in progressions:
            time_threshold = now - timedelta(minutes=minutes)
            orders = Order.objects.filter(
                status=current_status,
                updated_at__lte=time_threshold
            )
            
            for order in orders:
                order.status = next_status
                order.save()
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Order #{order.order_number}: {current_status} → {next_status}'
                    )
                )
        
        if updated_count == 0:
            self.stdout.write(self.style.WARNING('No orders to progress'))
        else:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully progressed {updated_count} orders')
            )
