$pptxFiles = Get-ChildItem -Path "المرحلة الاولى\arabe" -Recurse -Filter "*.pptx"
$output = @()

$count = 0
foreach ($file in $pptxFiles) {
    if ($count -ge 3) { break } # Limit to 3 files for now to test and not overload
    $count++
    
    $baseName = $file.BaseName
    $tempZip = "scratch\$baseName.zip"
    $tempDir = "scratch\$baseName"
    
    Copy-Item $file.FullName -Destination $tempZip -Force
    Expand-Archive -Path $tempZip -DestinationPath $tempDir -Force
    
    $slides = Get-ChildItem -Path "$tempDir\ppt\slides" -Filter "slide*.xml"
    $fullText = ""
    foreach ($slide in $slides) {
        $xmlContent = Get-Content $slide.FullName -Encoding UTF8
        $text = ($xmlContent -join ' ') -replace '<[^>]+>', ' ' -replace '\s+', ' '
        if ($text.Trim() -ne '') {
            $fullText += $text + " | "
        }
    }
    
    # Check for media
    $images = @()
    if (Test-Path "$tempDir\ppt\media") {
        $mediaFiles = Get-ChildItem -Path "$tempDir\ppt\media" -Include *.png,*.jpg,*.jpeg -Recurse
        $imgCount = 1
        foreach ($img in $mediaFiles) {
            $newImgName = "$baseName`_img$imgCount" + $img.Extension
            $destPath = "assets\$newImgName"
            Copy-Item $img.FullName -Destination $destPath -Force
            $images += $newImgName
            $imgCount++
        }
    }
    
    $obj = @{
        id = $baseName
        text = $fullText
        images = $images
        originalFile = $file.FullName
    }
    $output += $obj
}

$output | ConvertTo-Json -Depth 5 | Out-File -FilePath "scratch\extracted_arabic_lessons.json" -Encoding UTF8
