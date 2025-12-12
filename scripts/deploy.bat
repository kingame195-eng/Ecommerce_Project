@echo off
REM Deploy script cho Vercel (Windows)
REM Chạy: deploy.bat

echo.
echo 🚀 Bat dau deploy len Vercel...
echo.

REM 1. Build frontend
echo 📦 Building frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo ❌ Frontend build failed
  exit /b 1
)
cd ..

REM 2. Deploy frontend
echo.
echo 🌐 Deploying frontend to Vercel...
call vercel --prod

REM 3. Show info
echo.
echo ✅ Frontend deployed!
echo.
echo 📝 Next steps:
echo 1. Set VITE_API_URL in Vercel Environment Variables
echo 2. Make sure backend API is running
echo 3. Test: https://your-project.vercel.app
echo.
echo 🔗 View deployment:
echo    https://vercel.com/dashboard
echo.
pause
