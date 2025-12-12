# Script tắt Input Method tiếng Việt khi gõ code
# Chạy: powershell -ExecutionPolicy Bypass -File disable-ime.ps1

Add-Type @"
using System;
using System.Runtime.InteropServices;

public class InputMethod {
    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();
    
    [DllImport("user32.dll")]
    public static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
    
    public const uint WM_INPUTLANGCHANGEREQUEST = 0x0050;
    
    public static void DisableIME() {
        // 0x0409 = English (US)
        PostMessage(GetForegroundWindow(), WM_INPUTLANGCHANGEREQUEST, IntPtr.Zero, (IntPtr)0x0409);
    }
}
"@

# Kích hoạt tắt IME
[InputMethod]::DisableIME()
Write-Host "✅ IME đã được tắt, bạn có thể gõ English thoải mái!" -ForegroundColor Green
