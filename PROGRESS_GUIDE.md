# Automatic Order Progress Guide

## How It Works

Orders automatically progress through statuses over time:

1. **pending** → **confirmed** (5 minutes)
2. **confirmed** → **picked_up** (10 minutes)
3. **picked_up** → **washing** (15 minutes)
4. **washing** → **drying** (20 minutes)
5. **drying** → **folding** (15 minutes)
6. **folding** → **ready** (10 minutes)
7. **ready** → **out_for_delivery** (5 minutes)
8. **out_for_delivery** → **delivered** (10 minutes)

**Total time: ~90 minutes from pending to delivered**

## Usage

### Option 1: Manual Run (One-time)
```bash
python manage.py progress_orders
```

### Option 2: Automatic (Continuous)
```bash
auto_progress.bat
```
This runs every 60 seconds automatically. Press Ctrl+C to stop.

### Option 3: Windows Task Scheduler (Background)
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily, repeat every 1 minute
4. Action: Start program
5. Program: `python`
6. Arguments: `manage.py progress_orders`
7. Start in: `C:\Users\Rocket1174\Desktop\• 𝖅𝖔𝖔𝖓𝖎𝖊™\laundry_pal_app`

## Testing

1. Create a new order at `/orders/create/`
2. Run `python manage.py progress_orders` or start `auto_progress.bat`
3. Wait and refresh the order detail page to see status changes
4. Watch the progress bar increase automatically

## Customization

Edit `orders/management/commands/progress_orders.py` to change time intervals:
```python
progressions = [
    ('pending', 'confirmed', 5),  # Change 5 to desired minutes
    # ...
]
```
