$WorkspacePath = $PSScriptRoot

$FrontendOut = Join-Path $WorkspacePath "frontend-code.md"
$BackendOut = Join-Path $WorkspacePath "backend-code.md"

$FrontendExtensions = @(".ts", ".html", ".css", ".scss")
$BackendExtensions = @(".cs")

Function Export-GitFiles {
    param(
        [string]$SubDir,
        [string]$OutFile,
        [string[]]$Extensions
    )
    
    Write-Host "Scanning $SubDir using git ls-files..."
    
    $Files = git ls-files $SubDir
    $Sb = [System.Text.StringBuilder]::new()
    
    $Count = 0
    foreach ($relativePath in $Files) {
        $ext = [System.IO.Path]::GetExtension($relativePath)
        
        if ($Extensions -contains $ext) {
            $Count++
            $fullPath = Join-Path $WorkspacePath $relativePath
            
            $lang = $ext.TrimStart('.')
            if ($lang -eq "ts") { $lang = "typescript" }
            if ($lang -eq "cs") { $lang = "csharp" }
            
            [void]$Sb.AppendLine("### File: $relativePath")
            [void]$Sb.AppendLine("```$lang")
            
            try {
                $content = Get-Content -Path $fullPath -Raw -ErrorAction SilentlyContinue
                if ($content) {
                    [void]$Sb.AppendLine($content)
                }
            } catch {}
            
            [void]$Sb.AppendLine("```")
            [void]$Sb.AppendLine("")
        }
    }
    
    [System.IO.File]::WriteAllText($OutFile, $Sb.ToString())
    Write-Host "Added $Count files to $(Split-Path $OutFile -Leaf)"
}

Write-Host "Generating frontend-code.md..."
Export-GitFiles -SubDir "src/frontend" -OutFile $FrontendOut -Extensions $FrontendExtensions

Write-Host "Generating backend-code.md..."
$BackendProjects = @("src/Budgetha.API", "src/Budgetha.Application", "src/Budgetha.Domain", "src/Budgetha.Infrastructure")

$BackendSb = [System.Text.StringBuilder]::new()
$TotalBackendCount = 0

foreach ($proj in $BackendProjects) {
    Write-Host "Scanning $proj using git ls-files..."
    $Files = git ls-files $proj
    
    foreach ($relativePath in $Files) {
        $ext = [System.IO.Path]::GetExtension($relativePath)
        
        if ($BackendExtensions -contains $ext) {
            $TotalBackendCount++
            $fullPath = Join-Path $WorkspacePath $relativePath
            
            [void]$BackendSb.AppendLine("### File: $relativePath")
            [void]$BackendSb.AppendLine("```csharp")
            
            try {
                $content = Get-Content -Path $fullPath -Raw -ErrorAction SilentlyContinue
                if ($content) {
                    [void]$BackendSb.AppendLine($content)
                }
            } catch {}
            
            [void]$BackendSb.AppendLine("```")
            [void]$BackendSb.AppendLine("")
        }
    }
}
[System.IO.File]::WriteAllText($BackendOut, $BackendSb.ToString())
Write-Host "Added $TotalBackendCount files to $(Split-Path $BackendOut -Leaf)"

Write-Host "Done! Files generated successfully:`n - frontend-code.md`n - backend-code.md"
Write-Host "You can close this window now."
Read-Host -Prompt "Press Enter to exit"
