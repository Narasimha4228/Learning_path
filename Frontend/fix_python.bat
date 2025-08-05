@echo off
setx PATH "%PATH%;C:\Users\chila\AppData\Local\Programs\Python\Python310;C:\Users\chila\AppData\Local\Programs\Python\Python310\Scripts" /M
python -m ensurepip --default-pip
python -m pip install --upgrade pip
echo Python path fixed!
pause
