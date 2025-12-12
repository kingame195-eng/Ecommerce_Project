@echo off
REM Tắt Input Method tiếng Việt
REM Chạy file này khi cần tắt IME

setlocal enabledelayedexpansion

echo ========================================
echo  Tắt Input Method Tiếng Việt
echo ========================================

REM Sử dụng Windows API để tắt IME
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "Add-Type 'using System.Runtime.InteropServices; [DllImport(\"user32.dll\")] public static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam); [DllImport(\"user32.dll\")] public static extern IntPtr GetForegroundWindow();' -Name User32 -Namespace Win32; [Win32.User32]::PostMessage([Win32.User32]::GetForegroundWindow(), 0x0050, [IntPtr]::Zero, (New-Object IntPtr 0x0409))"

echo.
echo ✅ IME đã tắt - Bây giờ bạn có thể gõ English thoải mái!
echo.
pause
