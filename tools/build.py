import argparse
import json
import re
import shutil
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

# ========================================================
# build.py – أداة معالجة واستخراج الدروس لجميع المواد
# الاستخدام:
#   python tools/build.py --subject math --week 1
#   python tools/build.py --subject math --all
#   python tools/build.py --subject arabic --all
#   python tools/build.py --subject french --all
# ========================================================

def load_config():
    config_path = Path("tools/config.json")
    if not config_path.exists():
        print(f"❌ ملف الإعدادات غير موجود: {config_path}")
        sys.exit(1)
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)

def extract_text_from_slide_xml(xml_content):
    """استخراج النصوص من وسم a:t داخل ملف XML الخاص بالشريحة"""
    try:
        root = ET.fromstring(xml_content)
        # XML namespace for PowerPoint drawingml
        ns = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
        texts = []
        for elem in root.findall('.//a:t', ns):
            if elem.text and elem.text.strip():
                texts.append(elem.text.strip())
        return texts
    except Exception:
        # Fallback regex if XML parsing encounters oddities
        matches = re.findall(r'<a:t[^>]*>(.*?)</a:t>', xml_content.decode('utf-8', errors='ignore'))
        return [m.strip() for m in matches if m.strip()]

def inspect_pptx(pptx_path, config, subject_cfg):
    """قراءة وفحص ملف البوربوينت واستخراج النصوص والصور"""
    lesson_id = pptx_path.stem
    slide_texts = []
    extracted_images = []
    
    assets_dir = Path(config["settings"].get("assets_dir", "assets"))
    assets_dir.mkdir(parents=True, exist_ok=True)
    max_images = config["settings"].get("max_images_per_lesson", 4)
    exclude_patterns = subject_cfg.get("exclude_slide_patterns", [])

    try:
        with zipfile.ZipFile(pptx_path, 'r') as z:
            # 1. استخراج النصوص من الشرائح
            slide_files = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
            
            # ترتيب الشرائح رقمياً
            def slide_num(name):
                m = re.search(r'slide(\d+)\.xml', name)
                return int(m.group(1)) if m else 999
            slide_files.sort(key=slide_num)

            for sf in slide_files:
                xml_data = z.read(sf)
                texts = extract_text_from_slide_xml(xml_data)
                if not texts:
                    continue
                
                joined_text = " ".join(texts)
                # تجاهل الشرائح غير التعليمية (أهداف، دليل، غلاف...)
                if any(p.lower() in joined_text.lower() for p in exclude_patterns):
                    continue
                
                slide_texts.append(texts)

            # 2. استخراج الصور
            media_files = [f for f in z.namelist() if f.startswith('ppt/media/') and f.lower().endswith(('.png', '.jpg', '.jpeg'))]
            # ترتيب الصور واستخراج الأولى منها
            for i, mf in enumerate(media_files[:max_images], start=1):
                ext = Path(mf).suffix.lower()
                target_img_name = f"{subject_cfg['assets_prefix']}_{lesson_id}_img{i}{ext}"
                target_img_path = assets_dir / target_img_name
                
                with z.open(mf) as src_img, open(target_img_path, 'wb') as dst_img:
                    shutil.copyfileobj(src_img, dst_img)
                extracted_images.append(target_img_name)

    except Exception as e:
        print(f"⚠️ تعذر فحص ملف البوربوينت {pptx_path.name}: {e}")
        return None

    all_flat_text = [t for st in slide_texts for t in st]
    if not all_flat_text:
        all_flat_text = [f"درس {lesson_id}"]

    # تحديد عنوان مناسب للدرس
    title = all_flat_text[0] if len(all_flat_text) > 0 else lesson_id
    if len(title) > 60:
        title = title[:57] + "..."

    content_summary = " • ".join(all_flat_text[:8])
    if len(content_summary) > 250:
        content_summary = content_summary[:247] + "..."

    return {
        "id": lesson_id,
        "title": title,
        "description": subject_cfg.get("default_description", "درس تعليمي تفاعلي."),
        "content": content_summary,
        "images": extracted_images,
        "pdfLink": str(pptx_path).replace("\\", "/"),
        "raw_texts": all_flat_text
    }

def generate_questions(subject_key, lesson_info, subject_cfg):
    """توليد أسئلة تفاعلية ملائمة لعمر 6 سنوات انطلاقاً من محتوى الدرس"""
    raw_texts = lesson_info.get("raw_texts", [])
    title = lesson_info.get("title", "")
    questions = []

    if subject_key == "math":
        # قوالب أسئلة الرياضيات (أعداد، عد، مقارنة)
        questions.append({
            "type": "qcm",
            "question": f"في هذا الدرس حول '{title}'، كم عدد الأصابع في اليد الواحدة؟ ✋",
            "options": ["3", "5", "10"],
            "correct": 1,
            "explanation": "بطل! في يدنا الواحدة 5 أصابع."
        })
        questions.append({
            "type": "qcm",
            "question": "ما هو العدد الذي يأتي مباشرة بعد العدد 2؟ 🔢",
            "options": ["1", "4", "3"],
            "correct": 2,
            "explanation": "رائع! العدد 3 يأتي بعد العدد 2."
        })
        questions.append({
            "type": "qcm",
            "question": "أي شكل من الأشكال التالية ليس له زوايا؟ ⚪",
            "options": ["المثلث", "الدائرة", "المربع"],
            "correct": 1,
            "explanation": "ممتاز! الدائرة شكل مستدير ليس له زوايا."
        })

    elif subject_key == "arabic":
        # قوالب أسئلة العربية (حروف، مقاطع، كلمات)
        sample_word = "كتاب"
        for t in raw_texts:
            clean = re.sub(r'[^\u0621-\u064A]', '', t)
            if 3 <= len(clean) <= 6:
                sample_word = clean
                break

        first_char = sample_word[0] if sample_word else "أ"
        questions.append({
            "type": "qcm",
            "question": f"ما هو الحرف الأول في كلمة '{sample_word}'؟ 📖",
            "options": [first_char, "م", "ر"],
            "correct": 0,
            "explanation": f"أحسنت! كلمة '{sample_word}' تبدأ بحرف '{first_char}'."
        })
        questions.append({
            "type": "qcm",
            "question": "كم عدد المقاطع الصوتية في كلمة 'مَدْرَسَة'؟ 🏫",
            "options": ["مقطعان", "ثلاثة مقاطع", "أربعة مقاطع"],
            "correct": 2,
            "explanation": "رائع! مَدْ - رَ - سَ - تِي تتكون من أربعة مقاطع."
        })
        questions.append({
            "type": "qcm",
            "question": "اختر الكلمة التي تنتهي بحرف التاء المربوطة (ة): 🌸",
            "options": ["وَلَد", "زَهْرَة", "قَلَم"],
            "correct": 1,
            "explanation": "ممتاز! كلمة 'زَهْرَة' تنتهي بتاء مربوطة."
        })

    elif subject_key == "french":
        # قوالب أسئلة الفرنسية (vocabulaire, écoute)
        questions.append({
            "type": "qcm",
            "question": "Comment dit-on 'الأب' en français ? 👨",
            "options": ["Le père", "La mère", "Le frère"],
            "correct": 0,
            "explanation": "Bravo ! 'Le père' signifie الأب."
        })
        questions.append({
            "type": "qcm",
            "question": "Quelle est la couleur du soleil ? ☀️",
            "options": ["Bleu", "Jaune", "Vert"],
            "correct": 1,
            "explanation": "Super ! Le soleil est jaune."
        })
        questions.append({
            "type": "qcm",
            "question": "Quel objet utilise-t-on pour écrire ? 🖊️",
            "options": ["La règle", "Le stylo", "La gomme"],
            "correct": 1,
            "explanation": "Excellent ! On écrit avec un stylo."
        })

    return questions

def main():
    parser = argparse.ArgumentParser(description="أداة بناء واستخراج دروس المنهاج لكل المواد")
    parser.add_argument("--subject", required=True, choices=["math", "arabic", "french"], help="المادة المطلوبة")
    parser.add_argument("--week", type=int, default=None, help="رقم الأسبوع المحدد (مثال: 1)")
    parser.add_argument("--all", action="store_true", help="معالجة جميع الأسابيع المتوفرة")
    args = parser.parse_args()

    if not args.week and not args.all:
        print("❌ يجب تحديد رقم أسبوع محدد (--week X) أو اختيار جميع الأسابيع (--all)")
        sys.exit(1)

    config = load_config()
    subject_key = args.subject
    subject_cfg = config["subjects"][subject_key]
    source_root = Path(config["settings"].get("source_dir", "source")) / subject_key
    lessons_json_path = Path(config["settings"].get("lessons_json", "data/lessons.json"))

    if not source_root.exists():
        print(f"❌ مجلد المصدر غير موجود: {source_root}")
        print(f"ℹ️ شغّل أولاً: python tools/organize_sources.py \"المرحلة الاولى\" --apply")
        sys.exit(1)

    # تحديد مجلدات الأسابيع المطلوب معالجتها
    if args.week:
        week_dirs = [source_root / f"week{args.week}"]
    else:
        week_dirs = sorted([d for d in source_root.iterdir() if d.is_dir() and d.name.startswith("week")],
                           key=lambda x: int(re.search(r'\d+', x.name).group()) if re.search(r'\d+', x.name) else 0)

    if not week_dirs or not any(d.exists() for d in week_dirs):
        print(f"⚠️ لم يتم العثور على مجلدات أسابيع داخل: {source_root}")
        sys.exit(1)

    print(f"\n{'='*60}")
    print(f"🚀 بدء معالجة مادة: {subject_cfg['name_ar']} ({subject_cfg['name_en']})")
    print(f"عدد الأسابيع المستهدفة: {len(week_dirs)}")
    print(f"{'='*60}\n")

    # تحميل ملف الدروس الحالي
    if lessons_json_path.exists():
        with open(lessons_json_path, "r", encoding="utf-8") as f:
            all_lessons_data = json.load(f)
    else:
        all_lessons_data = {}

    if subject_key not in all_lessons_data:
        all_lessons_data[subject_key] = {
            "title": f"{subject_cfg['name_ar']} / {subject_cfg['name_en']}",
            "lessons": []
        }

    existing_lessons = {l["id"]: l for l in all_lessons_data[subject_key].get("lessons", [])}
    new_lessons_count = 0

    for wdir in week_dirs:
        if not wdir.exists():
            continue
        pptx_files = sorted(wdir.glob(subject_cfg.get("file_pattern", "*.pptx")))
        print(f"📁 فحص {wdir.name} (يحتوي على {len(pptx_files)} ملفات PPTX):")

        for pf in pptx_files:
            info = inspect_pptx(pf, config, subject_cfg)
            if not info:
                continue

            # توليد أسئلة تفاعلية
            questions = generate_questions(subject_key, info, subject_cfg)

            lesson_entry = {
                "id": info["id"],
                "title": info["title"],
                "description": info["description"],
                "video": "",
                "images": info["images"],
                "content": info["content"],
                "pdfLink": info["pdfLink"],
                "questions": questions
            }

            existing_lessons[info["id"]] = lesson_entry
            new_lessons_count += 1
            print(f"  ✅ تم استخراج الدرس: {info['id']} ({len(info['images'])} صور، {len(questions)} أسئلة)")

    all_lessons_data[subject_key]["lessons"] = list(existing_lessons.values())

    # حفظ ملف lessons.json
    lessons_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(lessons_json_path, "w", encoding="utf-8") as f:
        json.dump(all_lessons_data, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"🎉 اكتملت المعالجة بنجاح!")
    print(f"تم تحديث مادة: {subject_cfg['name_ar']}")
    print(f"إجمالي الدروس الحالية في المادة: {len(all_lessons_data[subject_key]['lessons'])}")
    print(f"ملف المخرجات: {lessons_json_path}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
