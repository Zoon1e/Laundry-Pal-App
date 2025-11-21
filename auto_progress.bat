@echo off
echo Starting automatic order progression...
echo Press Ctrl+C to stop
echo.

:loop
python manage.py progress_orders
timeout /t 60 /nobreak > nul
goto loop
