-- ============================================================
-- École Esprit Global (مدرسة العقل العالمي)
-- Complete Seed Data
-- ============================================================

-- Clean existing data
DELETE FROM quizzes;
DELETE FROM lesson_words;
DELETE FROM lessons;
DELETE FROM subjects;

-- 1. Insert Subjects
INSERT INTO subjects (slug, name_ar, name_en, icon, display_order) VALUES
('arabic', 'اللغة العربية', 'Arabic', '📚', 1),
('math', 'الرياضيات', 'Mathematics', '🔢', 2),
('french', 'اللغة الفرنسية', 'French', '🇫🇷', 3),
('science', 'النشاط العلمي', 'Science', '🔬', 4);


-- Lesson: arabic / AR_N1_P1_SEM5_S1
INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (
  'AR_N1_P1_SEM5_S1',
  'arabic',
  'مراجعة الحروف: م - ر - ب',
  'درس مراجعة لحروف الميم، الراء، والباء. (الاسبوع 5 - الحصة 1)',
  'هذا هو حرف الميم (م). هذا هو حرف الراء (ر). هذا هو حرف الباء (ب). أقرأ الكلمات: رابَ، بوم، بَرَمَ، رَبابٍ، رَمى.',
  '',
  '["AR_N1_P1_SEM5_S1_img1.jpg","AR_N1_P1_SEM5_S1_img2.png"]',
  'assets/pdf/arabic/AR_N1_P1_SEM5_S1.pptx',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'AR_N1_P1_SEM5_S1',
  'qcm',
  'ما هي الكلمة التي تبدأ بحرف الميم (م)؟',
  '["راب","ماما","بوم"]',
  1,
  'أحسنت! كلمة ''ماما'' تبدأ بحرف الميم.',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'AR_N1_P1_SEM5_S1',
  'qcm',
  'كم عدد المقاطع في كلمة ''رابَ''؟',
  '["مقطع واحد","مقطعان","ثلاثة مقاطع"]',
  1,
  'رائع! كلمة ''رابَ'' تتكون من مقطعين: را - بَ.',
  2
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'AR_N1_P1_SEM5_S1',
  'qcm',
  'أي من الحروف التالية يشبه الطبق تحته نقطة؟',
  '["م","ر","ب"]',
  2,
  'ممتاز! حرف الباء (ب) يشبه الطبق وتحته نقطة.',
  3
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'AR_N1_P1_SEM5_S1',
  'qcm',
  'ما هو الصوت الذي نسمعه في بداية كلمة ''رَمى''؟',
  '["مَ","رَ","بَ"]',
  1,
  'أحسنت! كلمة ''رَمى'' تبدأ بالمقطع ''رَ''.',
  4
);

-- Lesson: arabic / AR_N1_P1_SEM5_S2
INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (
  'AR_N1_P1_SEM5_S2',
  'arabic',
  'مراجعة الحروف: س - ف - ل',
  'درس مراجعة لحروف السين، الفاء، واللام. (الاسبوع 5 - الحصة 2)',
  'هذا هو حرف السين (س). هذا هو حرف الفاء (ف). هذا هو حرف اللام (ل). استمع وتحدث: يودع مراد والديه ويذهب إلى المدرسة.',
  '',
  '["AR_N1_P1_SEM5_S2_img1.jpg","AR_N1_P1_SEM5_S2_img2.png"]',
  'assets/pdf/arabic/AR_N1_P1_SEM5_S2.pptx',
  2
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'AR_N1_P1_SEM5_S2',
  'qcm',
  'إلى أين يذهب مراد؟',
  '["إلى السوق","إلى المدرسة","إلى الملعب"]',
  1,
  'بطل! يذهب مراد إلى المدرسة كما ذكر في القصة.',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'AR_N1_P1_SEM5_S2',
  'qcm',
  'ماذا يوجد في قاعة الدرس؟',
  '["أشجار وأزهار","طاولات وخزانة","سرير وألعاب"]',
  1,
  'رائع! يوجد في قاعة الدرس طاولات وخزانة.',
  2
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'AR_N1_P1_SEM5_S2',
  'qcm',
  'ما هي الكلمة التي تبدأ بحرف اللام (ل)؟',
  '["ليمون","ساعة","فيل"]',
  0,
  'ممتاز! كلمة ''ليمون'' تبدأ بحرف اللام.',
  3
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'AR_N1_P1_SEM5_S2',
  'qcm',
  'من اختبأ في المحفظة؟',
  '["مراد","المعلمة","دودو"]',
  2,
  'أحسنت! دودو هو من اختبأ في المحفظة.',
  4
);

-- Lesson: math / ma-1
INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (
  'ma-1',
  'math',
  'الأعداد من 1 إلى 5',
  'هيا نتعلم كيف نعد الأشياء من واحد إلى خمسة.',
  '',
  '',
  '[]',
  '',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'ma-1',
  'qcm',
  'كم عدد أصابع اليد الواحدة؟',
  '["3","5","10"]',
  1,
  'بطل! في يدنا الواحدة 5 أصابع.',
  1
);

-- Lesson: french / fr-1
INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (
  'fr-1',
  'french',
  'La famille (العائلة)',
  'Apprenons les mots de la famille en français ! / نتعلم أفراد العائلة بالفرنسية!',
  'Dans une famille, il y a : Le père 👨 (الأب), La mère 👩 (الأم), Le frère 👦 (الأخ), La sœur 👧 (الأخت), Le grand-père 👴 (الجد) et La grand-mère 👵 (الجدة).',
  '',
  '[]',
  '',
  1
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-1',
  'Le père',
  '👨',
  'الأب',
  1
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-1',
  'La mère',
  '👩',
  'الأم',
  2
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-1',
  'Le frère',
  '👦',
  'الأخ',
  3
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-1',
  'La sœur',
  '👧',
  'الأخت',
  4
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-1',
  'Le grand-père',
  '👴',
  'الجد',
  5
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-1',
  'La grand-mère',
  '👵',
  'الجدة',
  6
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-1',
  'qcm',
  'Qui est ''le père'' ? 👨',
  '["الأب","الأم","العم"]',
  0,
  'Bravo ! ''Le père'' c''est l''homme qui prend soin de sa famille (الأب).',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-1',
  'qcm',
  'Comment dit-on ''الأم'' en français ? 👩',
  '["La sœur","La mère","La fille"]',
  1,
  'Très bien ! ''La mère'' signifie الأم.',
  2
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-1',
  'qcm',
  'Qui est ''le frère'' ? 👦',
  '["الجد","الأخ","الأب"]',
  1,
  'Super ! ''Le frère'' signifie الأخ.',
  3
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-1',
  'qcm',
  'Qui est ''la sœur'' ? 👧',
  '["الأخت","الخالة","الجدة"]',
  0,
  'Excellent ! ''La sœur'' signifie الأخت.',
  4
);

-- Lesson: french / fr-2
INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (
  'fr-2',
  'french',
  'L''école et la classe (المدرسة والقسم)',
  'Les affaires de l''école et de la classe. / أدوات المدرسة والفصل.',
  'À l''école, j''utilise : Le cartable 🎒, Le livre 📖, Le cahier 📓, Le stylo 🖊️, La règle 📏 et La gomme 🧼.',
  '',
  '[]',
  '',
  2
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-2',
  'Le cartable',
  '🎒',
  'المحفظة',
  1
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-2',
  'Le livre',
  '📖',
  'الكتاب',
  2
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-2',
  'Le cahier',
  '📓',
  'الدفتر',
  3
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-2',
  'Le stylo',
  '🖊️',
  'القلم',
  4
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-2',
  'La règle',
  '📏',
  'المسطرة',
  5
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-2',
  'La gomme',
  '🧼',
  'الممحاة',
  6
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-2',
  'qcm',
  'Avec quoi écrit-on sur le cahier ? 🖊️',
  '["Le stylo","La gomme","La règle"]',
  0,
  'Bravo ! On écrit avec le stylo (القلم).',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-2',
  'qcm',
  'Dans quoi range-t-on ses affaires d''école ? 🎒',
  '["Le cartable","La règle","Le crayon"]',
  0,
  'Parfait ! Le cartable (المحفظة) sert à ranger les affaires.',
  2
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-2',
  'qcm',
  'Que signifie ''le livre'' ? 📖',
  '["القلم","الكتاب","المسطرة"]',
  1,
  'Super ! ''Le livre'' signifie الكتاب.',
  3
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-2',
  'qcm',
  'À quoi sert ''la gomme'' ? 🧼',
  '["À effacer (المسح)","À découper (القص)","À mesurer (القياس)"]',
  0,
  'Excellent ! La gomme sert à effacer.',
  4
);

-- Lesson: french / fr-3
INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (
  'fr-3',
  'french',
  'Les couleurs (الألوان)',
  'Découvrons les belles couleurs ! / نكتشف الألوان الجميلة!',
  'Le rouge 🔴, Le bleu 🔵, Le jaune 🟡, Le vert 🟢, L''orange 🟠, Le blanc ⚪ et Le noir ⚫.',
  '',
  '[]',
  '',
  3
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-3',
  'Le rouge',
  '🔴',
  'أحمر',
  1
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-3',
  'Le bleu',
  '🔵',
  'أزرق',
  2
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-3',
  'Le jaune',
  '🟡',
  'أصفر',
  3
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-3',
  'Le vert',
  '🟢',
  'أخضر',
  4
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-3',
  'L''orange',
  '🟠',
  'برتقالي',
  5
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-3',
  'Le blanc',
  '⚪',
  'أبيض',
  6
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-3',
  'qcm',
  'De quelle couleur est le soleil ? ☀️',
  '["Bleu","Jaune","Vert"]',
  1,
  'Bravo ! Le soleil est jaune (أصفر).',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-3',
  'qcm',
  'De quelle couleur est la fraise ? 🍓',
  '["Rouge","Noir","Bleu"]',
  0,
  'Très bien ! La fraise est rouge (أحمر).',
  2
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-3',
  'qcm',
  'De quelle couleur est le ciel ? 🌤️',
  '["Jaune","Bleu","Orange"]',
  1,
  'Super ! Le ciel est bleu (أزرق).',
  3
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-3',
  'qcm',
  'De quelle couleur sont les feuilles des arbres ? 🍃',
  '["Vert","Blanc","Rouge"]',
  0,
  'Parfait ! Les feuilles sont vertes (أخضر).',
  4
);

-- Lesson: french / fr-4
INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (
  'fr-4',
  'french',
  'Les nombres de 1 à 5 (الأعداد من 1 إلى 5)',
  'Comptons ensemble de 1 à 5 en français ! / نعد معاً من 1 إلى 5 بالفرنسية!',
  '1 : Un  •  2 : Deux  •  3 : Trois  •  4 : Quatre  •  5 : Cinq',
  '',
  '[]',
  '',
  4
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-4',
  'Un (1)',
  '1️⃣',
  'واحد',
  1
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-4',
  'Deux (2)',
  '2️⃣',
  'اثنان',
  2
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-4',
  'Trois (3)',
  '3️⃣',
  'ثلاثة',
  3
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-4',
  'Quatre (4)',
  '4️⃣',
  'أربعة',
  4
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-4',
  'Cinq (5)',
  '5️⃣',
  'خمسة',
  5
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-4',
  'qcm',
  'Combien de doigts a une main ? ✋',
  '["Trois (3)","Cinq (5)","Deux (2)"]',
  1,
  'Bravo ! Une main a cinq doigts (5).',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-4',
  'qcm',
  'Quel nombre vient après ''un'' (1) ? 🔢',
  '["Deux (2)","Quatre (4)","Cinq (5)"]',
  0,
  'Très bien ! Après un vient deux.',
  2
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-4',
  'qcm',
  'Combien font 2 + 1 en français ? 🧮',
  '["Quatre","Trois","Cinq"]',
  1,
  'Super ! 2 + 1 = 3 (Trois).',
  3
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-4',
  'qcm',
  'Comment s''écrit le chiffre 4 en lettres ?',
  '["Quatre","Deux","Trois"]',
  0,
  'Parfait ! 4 s''écrit Quatre.',
  4
);

-- Lesson: french / fr-5
INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (
  'fr-5',
  'french',
  'Les animaux familiers (الحيوانات الأليفة)',
  'Les animaux de la maison et de la ferme. / حيوانات البيت والمزرعة.',
  'Le chat 🐱 fait miaou ! Le chien 🐶 fait ouaf ! L''oiseau 🐦 chante ! Le cheval 🐴 galope !',
  '',
  '[]',
  '',
  5
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-5',
  'Le chat',
  '🐱',
  'القط',
  1
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-5',
  'Le chien',
  '🐶',
  'الكلب',
  2
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-5',
  'L''oiseau',
  '🐦',
  'العصفور',
  3
);
INSERT INTO lesson_words (lesson_slug, label, emoji, translation, display_order) VALUES (
  'fr-5',
  'Le cheval',
  '🐴',
  'الحصان',
  4
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-5',
  'qcm',
  'Quel animal fait ''miaou'' ? 🐾',
  '["Le chien","Le chat","Le cheval"]',
  1,
  'Bravo ! C''est le chat (القط) qui fait miaou.',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-5',
  'qcm',
  'Quel animal aboie et fait ''ouaf'' ? 🐕',
  '["Le chien","L''oiseau","Le chat"]',
  0,
  'Très bien ! Le chien (الكلب) aboie.',
  2
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-5',
  'qcm',
  'Quel animal a des ailes et sait voler ? 🪽',
  '["Le cheval","L''oiseau","Le chat"]',
  1,
  'Super ! L''oiseau (الطائر) a des ailes et sait voler.',
  3
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'fr-5',
  'qcm',
  'Comment appelle-t-on ''الحصان'' en français ? 🐎',
  '["Le cheval","La vache","Le mouton"]',
  0,
  'Excellent ! ''Le cheval'' signifie الحصان.',
  4
);

-- Lesson: science / sc-1
INSERT INTO lessons (lesson_slug, subject_slug, title, description, content, video, images_json, pdf_link, display_order) VALUES (
  'sc-1',
  'science',
  'الحواس الخمس',
  'نتعرف على حواسنا الخمس وكيف نستخدمها.',
  '',
  '',
  '[]',
  '',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'sc-1',
  'qcm',
  'بماذا نرى الأشياء؟',
  '["بالعين","بالأذن","بالأنف"]',
  0,
  'ممتاز! نحن نرى الأشياء بالعين.',
  1
);
INSERT INTO quizzes (lesson_slug, type, question, options_json, correct_index, explanation, display_order) VALUES (
  'sc-1',
  'qcm',
  'بماذا نسمع الأصوات؟',
  '["بالأنف","بالعين","بالأذن"]',
  2,
  'أحسنت! نحن نسمع الأصوات بالأذن.',
  2
);

-- Sample Contact & Scores
INSERT INTO contacts (name, email, message, ip_address, status) VALUES ('Parent Test', 'parent@example.com', 'Bravo pour cette magnifique plateforme éducative !', '127.0.0.1', 'replied');
INSERT INTO scores (student_name, subject_slug, lesson_slug, score, total, stars) VALUES ('Adam', 'french', 'fr-1', 4, 4, 3);
INSERT INTO scores (student_name, subject_slug, lesson_slug, score, total, stars) VALUES ('Sara', 'arabic', 'AR_N1_P1_SEM5_S1', 4, 4, 3);
INSERT INTO scores (student_name, subject_slug, lesson_slug, score, total, stars) VALUES ('Youssef', 'math', 'ma-1', 1, 1, 3);
