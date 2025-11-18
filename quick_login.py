#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laundry_pal.settings')
django.setup()

from django.contrib.auth.models import User

def create_superuser():
    # Create a superuser for easy login
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Created superuser: admin / admin123")
    else:
        print("Superuser 'admin' already exists")
    
    # Ensure testuser exists
    if not User.objects.filter(username='testuser').exists():
        user = User.objects.create_user('testuser', 'test@example.com', 'testpass123')
        print("Created test user: testuser / testpass123")
    else:
        print("Test user 'testuser' already exists")

if __name__ == '__main__':
    create_superuser()
