param(
    [Parameter(Mandatory=$false, Position=0)]
    [string]$SourceDir = "المرحلة الاولى",
    [switch]$Apply
)

if (-not (Test-Path $SourceDir)) {
    Write-Host "المجلد المصدر غير موجود: $SourceDir" -ForegroundColor Red
    exit 1
}

$DestDir = "source"

$arabicWeeks = @{
    "الاول"  = 1; "الأول"  = 1; "1" = 1;
    "الثاني" = 2; "2"     = 2;
    "الثالث" = 3; "3"     = 3;
    "الرابع" = 4; "4"     = 4;
    "الخامس" = 5; "5"     = 5;
    "السادس" = 6; "6"     = 6;
    "السابع" = 7; "7"     = 7;
    "الثامن" = 8; "8"     = 8;
}

function Get-Subject([string]$path) {
    $n = $path.ToLower()
    if ($n -match 'ar_|arabe|arabic|عرب') { return "arabic" }
    if ($n -match 'math|maths|رياض') { return "math" }
    if ($n -match 'fr_|fra|francais|français|فرنس') { return "french" }
    return $null
}

function Get-Week([string]$fullName, [string]$name) {
    # 1. Search in filename for SEM5, Semaine 6, etc.
    if ($name -match '(?i)(?:sem|semaine)[_\s]?(\d+)') {
        return [int]$matches[1]
    }
    # 2. Search in full path for SEM5
    if ($fullName -match '(?i)(?:sem|semaine)[_\s]?(\d+)') {
        return [int]$matches[1]
    }
    # 3. Search for Arabic week names in folder path
    foreach ($key in $arabicWeeks.Keys) {
        if ($fullName -match "(?i)اسبوع\s*$key|أسبوع\s*$key|الاسبوع\s*$key|الأسبوع\s*$key") {
            return $arabicWeeks[$key]
        }
    }
    return $null
}

$files = Get-ChildItem -Path $SourceDir -Recurse -Filter *.pptx
$unknown = @()
$matchedCount = 0

foreach ($f in $files) {
    $subj = Get-Subject $f.FullName
    $wk = Get-Week $f.FullName $f.Name

    if (-not $subj -or -not $wk) {
        $unknown += $f.FullName
        continue
    }

    $matchedCount++
    $targetFolder = Join-Path $DestDir "$subj\week$wk"
    $targetFile = Join-Path $targetFolder $f.Name

    $actionText = if ($Apply) { "[نسخ]" } else { "[معاينة]" }
    Write-Host "$actionText $($f.Name) -> $targetFile" -ForegroundColor (if ($Apply) { "Green" } else { "Cyan" })

    if ($Apply) {
        if (-not (Test-Path $targetFolder)) {
            New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
        }
        Copy-Item -Path $f.FullName -Destination $targetFile -Force
    }
}

Write-Host "`n=================================================="
Write-Host "إجمالي الملفات المصنفة: $matchedCount" -ForegroundColor Green

if ($unknown.Count -gt 0) {
    Write-Host "`nملفات لم يتم تصنيفها تلقائياً ($($unknown.Count)):" -ForegroundColor Yellow
    foreach ($u in $unknown) {
        Write-Host " - $u" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ تم تصنيف جميع الملفات بنجاح دون أي ملف مجهول!" -ForegroundColor Green
}

if (-not $Apply) {
    Write-Host "`nℹ️ هذه مجرد معاينة. لتنفيذ النقل والنسخ الفعلي، أضف مفتاح -Apply في نهاية الأمر:" -ForegroundColor Yellow
    Write-Host "   .\organize_pptx.ps1 -Apply" -ForegroundColor White
}
