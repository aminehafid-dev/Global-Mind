import re, shutil, sys
from pathlib import Path

# الاستخدام:
# python tools/organize_sources.py "المرحلة الاولى"          <-- معاينة فقط
# python tools/organize_sources.py "المرحلة الاولى" --apply  <-- نسخ فعلي

if len(sys.argv) < 2:
    print("يرجى تحديد مسار المجلد المصدر:")
    print("  python tools/organize_sources.py \"المسار_إلى_المجلد\" [--apply]")
    sys.exit(1)

SRC = Path(sys.argv[1])            # المجلد اللي فيه كل الملفات
DST = Path("source")
APPLY = "--apply" in sys.argv      # بدون هاد الخيار: معاينة فقط

# خريطة لتحويل أسماء الأسابيع بالعربية
ARABIC_WEEKS = {
    "الاول": 1, "الأول": 1, "1": 1,
    "الثاني": 2, "2": 2,
    "الثالث": 3, "3": 3,
    "الرابع": 4, "4": 4,
    "الخامس": 5, "5": 5,
    "السادس": 6, "6": 6,
    "السابع": 7, "7": 7,
    "الثامن": 8, "8": 8,
}

def subject(path: Path):
    """تحديد المادة من اسم الملف أو المسار الحاضن"""
    name = path.name.lower()
    full_path = str(path).lower()
    
    # 1. فحص بادئة الاسم
    if name.startswith(("ar_", "arabe", "arabic")) or "عرب" in name:
        return "arabic"
    if name.startswith(("math", "maths")) or "رياض" in name:
        return "math"
    if name.startswith(("fr_", "fra", "francais", "français")) or "فرنس" in name:
        return "french"
        
    # 2. فحص المسار الكامل في حال كان اسم الملف غير دال
    if any(k in full_path for k in ["\\arabe\\", "/arabe/", "\\arabic\\", "/arabic/", "عربية", "عربي"]):
        return "arabic"
    if any(k in full_path for k in ["\\math\\", "/math/", "\\maths\\", "/maths/", "رياضيات"]):
        return "math"
    if any(k in full_path for k in ["\\francais\\", "/francais/", "\\français\\", "/français/", "فرنسية"]):
        return "french"
        
    return None

def week(path: Path):
    """استخراج رقم الأسبوع من اسم الملف أو المجلدات الحاضنة"""
    name = path.name
    full_str = str(path)

    # 1. البحث في اسم الملف (SEM5, SEM_5, Semaine 1, S1...)
    m = re.search(r"(?:sem|semaine)[_\s]?(\d+)", name, re.I)
    if m:
        return int(m.group(1))

    # 2. البحث في المسار الكامل عن SEMX
    m_path = re.search(r"(?:sem|semaine)[_\s]?(\d+)", full_str, re.I)
    if m_path:
        return int(m_path.group(1))

    # 3. فحص أسماء الأسابيع المكتوبة بالعربية في المجلدات
    for ar_w, num in ARABIC_WEEKS.items():
        if re.search(rf"(?:اسبوع|أسبوع|الاسبوع|الأسبوع)\s*{ar_w}", full_str, re.I):
            return num

    return None

unknown = []
count_matched = 0

print(f"{'='*60}")
print(f"وضع التشغيل: {'نسخ فعلي (--apply)' if APPLY else 'معاينة فقط (Dry-run)'}")
print(f"المصدر: {SRC.resolve()}")
print(f"الهدف: {DST.resolve()}")
print(f"{'='*60}\n")

for f in sorted(SRC.rglob("*.pptx")):
    s, w = subject(f), week(f)
    if not s or not w:
        unknown.append(f)
        continue

    count_matched += 1
    target = DST / s / f"week{w}" / f.name
    print(f"[{'نسخ' if APPLY else 'معاينة'}] {f.name}  ->  {target}")
    
    if APPLY:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, target)

print("\n" + "="*60)
print(f"إجمالي الملفات المصنفة: {count_matched}")

if unknown:
    print(f"\n⚠️ ملفات ما قدرتش نصنفها (صنفها يدوياً أو نحتاج إضافة نمط جديد لها) ({len(unknown)}):")
    for f in unknown:
        print(" -", f)
else:
    print("✅ تم تصنيف جميع الملفات بنجاح بنسبة 100%!")

if not APPLY:
    print("\nℹ️ هذه مجرد معاينة. لتنفيذ النقل والنسخ الفعلي:")
    print(f'   python tools/organize_sources.py "{SRC}" --apply')
