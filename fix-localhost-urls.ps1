# PowerShell script to replace all localhost:5000 URLs with API_BASE_URL

$files = @(
    "E Com/src/DealerDashboard.jsx",
    "E Com/src/Dashboard.jsx",
    "E Com/src/Chatbot.jsx",
    "E Com/src/AdminDashboard.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Fixing $file..."
        $content = Get-Content $file -Raw
        $content = $content -replace 'http://localhost:5000', '${API_BASE_URL}'
        Set-Content $file $content -NoNewline
        Write-Host "✓ Fixed $file"
    } else {
        Write-Host "✗ File not found: $file"
    }
}

Write-Host "`nDone! All localhost URLs replaced with API_BASE_URL"
