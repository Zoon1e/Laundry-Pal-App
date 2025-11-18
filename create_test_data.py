#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, timedelta

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laundry_pal.settings')
django.setup()

from django.contrib.auth.models import User
from orders.models import Order, OrderItem
from decimal import Decimal

def create_test_data():
    # Get or create a test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"Created test user: {user.username}")
    else:
        print(f"Using existing user: {user.username}")
    
    # Create test orders with different statuses
    orders_data = [
        {
            'status': 'pending',
            'total_items': 5,
            'total_cost': Decimal('25.50'),
            'special_instructions': 'Please handle with care',
        },
        {
            'status': 'washing',
            'total_items': 8,
            'total_cost': Decimal('42.00'),
            'special_instructions': 'Extra starch on shirts',
        },
        {
            'status': 'drying',
            'total_items': 3,
            'total_cost': Decimal('18.75'),
            'special_instructions': '',
        },
        {
            'status': 'ready',
            'total_items': 12,
            'total_cost': Decimal('65.25'),
            'special_instructions': 'Fold carefully',
        },
        {
            'status': 'delivered',
            'total_items': 6,
            'total_cost': Decimal('31.50'),
            'special_instructions': '',
        },
    ]
    
    # Clear existing orders for this user
    Order.objects.filter(user=user).delete()
    
    for i, order_data in enumerate(orders_data):
        order = Order.objects.create(
            user=user,
            **order_data,
            estimated_completion=datetime.now() + timedelta(days=2+i)
        )
        
        # Add some order items
        items_data = [
            {'item_type': 'shirt', 'quantity': 3, 'unit_price': Decimal('5.00')},
            {'item_type': 'pants', 'quantity': 2, 'unit_price': Decimal('7.50')},
            {'item_type': 'dress', 'quantity': 1, 'unit_price': Decimal('12.00')},
        ]
        
        for item_data in items_data[:order_data['total_items']//3 + 1]:
            OrderItem.objects.create(
                order=order,
                **item_data
            )
        
        print(f"Created order #{order.order_number} with status: {order.status}")
    
    print(f"\nCreated {len(orders_data)} test orders for user: {user.username}")
    print("You can now view the orders at: http://127.0.0.1:8000/orders/")

if __name__ == '__main__':
    create_test_data()
