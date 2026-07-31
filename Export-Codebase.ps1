$ErrorActionPreference = "Stop"

$workspaceRoot = "d:\Projects\Budgetha\src"
$frontendDir = Join-Path $workspaceRoot "frontend"
$backendDirs = @("Budgetha.API", "Budgetha.Application", "Budgetha.Domain", "Budgetha.Infrastructure")

$frontendOutputFile = "d:\Projects\Budgetha\frontend_code.md"
$backendOutputFile = "d:\Projects\Budgetha\backend_code.md"

$excludeDirs = @("node_modules", "dist", ".angular", "bin", "obj", ".vs", ".git", "wwwroot", ".vscode")
$excludeExts = @(".dll", ".exe", ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".eot", ".ttf", ".woff", ".woff2", ".pdf", ".zip", ".pdb")

function Export-Files {
    param(
        [string]$Directory,
        [string]$OutputFile,
        [string]$Title
    )

    Write-Host "Exporting $Title to $OutputFile..."
    
    # Initialize the file
    "# $Title`n`n" | Out-File -FilePath $OutputFile -Encoding utf8

    Get-ChildItem -Path $Directory -Recurse -File | Where-Object {
        $skip = $false
        
        # Check extensions
        if ($excludeExts -contains $_.Extension.ToLower()) {
            $skip = $true
        }
        
        # Check directories in path
        foreach ($dir in $excludeDirs) {
            if ($_.FullName -match "\\$dir\\") {
                $skip = $true
                break
            }
        }
        
        return (-not $skip)
    } | ForEach-Object {
        $relativePath = $_.FullName.Substring($Directory.Length + 1)
        
        # Determine language for markdown block
        $ext = $_.Extension.ToLower()
        $lang = ""
        switch ($ext) {
            ".ts" { $lang = "typescript" }
            ".js" { $lang = "javascript" }
            ".html" { $lang = "html" }
            ".css" { $lang = "css" }
            ".cs" { $lang = "csharp" }
            ".json" { $lang = "json" }
            ".md" { $lang = "markdown" }
            Default { $lang = "" }
        }

        "## $relativePath`n" | Out-File -FilePath $OutputFile -Encoding utf8 -Append
        "````$lang" | Out-File -FilePath $OutputFile -Encoding utf8 -Append
        
        try {
            $content = Get-Content $_.FullName -Raw -ErrorAction Stop
            if ($content) {
                $content | Out-File -FilePath $OutputFile -Encoding utf8 -Append
            }
        } catch {
            "// Could not read file content" | Out-File -FilePath $OutputFile -Encoding utf8 -Append
        }
        
        "`````n" | Out-File -FilePath $OutputFile -Encoding utf8 -Append
    }
    
    Write-Host "Done exporting $Title."
}

# Export Frontend
Export-Files -Directory $frontendDir -OutputFile $frontendOutputFile -Title "Frontend Code"

# Export Backend
Write-Host "Exporting Backend Code to $backendOutputFile..."
"# Backend Code`n`n" | Out-File -FilePath $backendOutputFile -Encoding utf8

foreach ($dir in $backendDirs) {
    $fullPath = Join-Path $workspaceRoot $dir
    if (Test-Path $fullPath) {
        Get-ChildItem -Path $fullPath -Recurse -File | Where-Object {
            $skip = $false
            if ($excludeExts -contains $_.Extension.ToLower()) { $skip = $true }
            foreach ($exDir in $excludeDirs) {
                if ($_.FullName -match "\\$exDir\\") {
                    $skip = $true
                    break
                }
            }
            return (-not $skip)
        } | ForEach-Object {
            $relativePath = $_.FullName.Substring($workspaceRoot.Length + 1)
            $ext = $_.Extension.ToLower()
            $lang = if ($ext -eq ".cs") { "csharp" } elseif ($ext -eq ".json") { "json" } else { "" }

            "## $relativePath`n" | Out-File -FilePath $backendOutputFile -Encoding utf8 -Append
            "````$lang" | Out-File -FilePath $backendOutputFile -Encoding utf8 -Append
            
            try {
                $content = Get-Content $_.FullName -Raw -ErrorAction Stop
                if ($content) {
                    $content | Out-File -FilePath $backendOutputFile -Encoding utf8 -Append
                }
            } catch {
                "// Could not read file content" | Out-File -FilePath $backendOutputFile -Encoding utf8 -Append
            }
            
            "`````n" | Out-File -FilePath $backendOutputFile -Encoding utf8 -Append
        }
    }
}
Write-Host "Done exporting Backend Code."
Write-Host "Export complete! Files are at $frontendOutputFile and $backendOutputFile"
