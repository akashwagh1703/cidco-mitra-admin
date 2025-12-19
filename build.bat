@echo off
echo Building Admin Panel for cPanel...

REM Install dependencies
call npm install

REM Build for production
call npm run build

echo Build completed! Upload 'dist' folder contents to public_html/cidco-admin/

pause