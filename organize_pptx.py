import re, shutil, sys
from pathlib import Path

# الاستخدام:
# python organize_pptx.py "المرحلة الاولى"          <-- معاينة فقط
# python organize_pptx.py "المرحلة الاولى" --apply  <-- تنفيذ النسخ الفعلي

if len(sys.argv) < 2:
    print("يرجى تحديد مسار المجلد المصدر:")
    print("  python organize_pptx.py \"المرحلة الاولى\" [--apply]")
    sys.exit(1)

SRC = Path(sys.argv[1])            # المجلد اللي فيه كل الملفات
DST = Path("source")
APPLY = "--apply" in sys.argv      # بدون هاد الخيار: معاينة فقط

# خريطة لتحويل أسماء الأسابيع بالعربية والأرقام
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
    """تحديد المادة من اسم الملف أو من اسم المجلد الحاضن"""
    text = (path.name + " " + str(path.parent)).lower()
    if any(k in text for k in ["ar_", "arabe", "arabic", "عرب"]):
        return "arabic"
    if any(k in text for k in ["math", "maths", "رياض"]):
        return "math"
    if any(k in text for k in ["fr_", "fra", "francais", "français", "فرنس"]):
        return "french"
    return None

def week(path: Path):
    """استخراج رقم الأسبوع من اسم الملف أو المسار (SEM, Semaine, أو الأسبوع X)"""
    # 1. البحث عن صيغ مثل SEM5, SEM_5, Semaine 6
    m = re.search(r"(?:sem|semaine)[_\s]?(\d+)", path.name, re.I)
    if m:
        return int(m.group(1))
    
    # 2. البحث في المسار الكامل
    m_path = re.search(r"(?:sem|semaine)[_\s]?(\d+)", str(path), re.I)
    if m_path:
        return int(m_path.group(1))

    # 3. البحث عن أسماء الأسابيع بالعربية مثل 'الاسبوع الاول' أو 'الاسبوع 5'
    full_str = str(path)
    for ar_w, num in ARABIC_WEEKS.items():
        if f"اسبوع {ar_w}" in full_str or f"أسبوع {ar_w}" in full_str or f"الاسبوع {ar_w}" in full_str or f"الأسبوع {ar_w}" in full_str:
            return num

    return None

unknown = []
count_matched = 0

for f in sorted(SRC.rglob("*.pptx")):
    s, w = subject(f), week(f)
    if not s or not w:
        unknown.append(f)
        continue

    count_matched += 1
    target = DST / s / f"week{w}" / f.name
    print(f"[{'نسخ' if APPLY else 'معاينة'}] {f.name} -> {target}")
    
    if APPLY:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, target)

print("\n" + "="*50)
print(f"إجمالي الملفات المصنفة: {count_matched}")

if unknown:
    print(f"\nملفات لم يتم تصنيفها تلقائياً ({len(unknown)}):")
    for f in unknown:
        print(" -", f)
else:
    print("✅ تم تصنيف جميع الملفات بنجاح دون أي ملف مجهول!")

if not APPLY:
    print("\nℹ️ هذه مجرد معاينة. لتنفيذ النقل والنسخ الفعلي، أضف --apply في نهاية الأمر.")
