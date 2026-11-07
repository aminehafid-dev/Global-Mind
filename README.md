# École Esprit Global (مدرسة العقل العالمي) 🎓

منصة تعليمية تفاعلية أونلاين لتلاميذ المستوى الأول ابتدائي (Grade 1)، تم تحويلها وتطويرها بالكامل باستخدام:
- **Frontend**: React 18 + Vite + Framer Motion (انتقالات وتأثيرات بصرية رائعة، متجاوب بالكامل Mobile-First، دعم ثنائي اللغة RTL/LTR).
- **Backend Node.js**: Express REST API + `node:sqlite` & MySQL2.
- **Backend PHP**: PHP 8.2+ REST API + PDO (متوافق مع MySQL و SQLite، جاهز للاستضافة على cPanel / XAMPP).
- **SQL Database**: قاعدة بيانات SQL متكاملة تضم المواد، الدروس، الكلمات، التمارين، النتائج والرسائل (`schema.sql` / `seed.sql`).
- **Deployment**: جاهز للنشر الفوري عبر Docker Compose, Nginx, cPanel, Vercel, Render.

---

## 🚀 المميزات والخصائص (Features)

1. **واجهة تفاعلية حديثة وانتقالات متحركة (Cool Animations)**:
   - انتقالات صفحات سلسة وسريعة مع Framer Motion تراعي اتجاه القراءة (RTL/LTR).
   - بطاقات مواد تفاعلية مع تأثير الرفع ثلاثي الأبعاد (3D Hover Lift) وحدود مضيئة وتمايل الأيقونات.
   - تأثير احتفالي ممتع عند إتمام التمارين والحصول على النجوم (Confetti & Stars burst).
   - نافذة لوحة الشرف والإنجازات (Trophy Modal) لعرض النجوم والنتائج المسجلة في قاعدة البيانات.

2. **قاعدة بيانات SQL متكاملة (SQL Database)**:
   - جداول متكاملة للمواد (`subjects`)، الدروس (`lessons`)، الكلمات (`lesson_words`)، التمارين (`quizzes`)، رسائل التواصل (`contacts`)، وسجل نقاط التلاميذ (`scores`).
   - ملفات SQL جاهزة للاستيراد: `database/schema.sql` (لـ SQLite و MySQL) و `database/seed.sql` للبيانات الأولية.

3. **خادمان متكاملان (Node.js & PHP Backends)**:
   - خادم Node.js Express وخادم PHP كلاهما يقدم نفس واجهات البرمجة (REST API) المتصلة بقاعدة بيانات SQL.
   - حماية من السبام عبر تقنية Honeypot لنموذج التواصل.
   - كاشينغ مدمج ومعالجة الأخطاء الآمنة.

4. **جاهزية تامة للنشر (Production Ready)**:
   - ملف `docker-compose.yml` لتشغيل النظام بضغطة زر واحدة (MySQL + Node API + PHP API + React Client Nginx).
   - ملفات `.htaccess` جاهزة للاستضافة المشتركة و cPanel.
   - دليل نشر شامل ومفصل في ملف `DEPLOYMENT.md`.

---

## 📁 هيكلة المشروع (Project Architecture)

```text
/
├── client/                     # واجهة المستخدم React + Vite + Framer Motion
│   ├── src/
│   │   ├── components/         # Navbar, Footer, AnimatedLayout, Confetti, TrophyModal
│   │   ├── pages/              # Home, Primary1, SubjectPage, Contact, About, Legal
│   │   ├── css/                # الأنماط والتأثيرات البصرية
│   │   └── utils/              # معالجة الصوت والنطق والتخزين
│   ├── public/                 # الأصول العامة، الصور، وملف .htaccess للـ SPA
│   ├── Dockerfile              # بناء Docker متعدد المراحل مع Nginx
│   └── nginx.conf              # إعدادات Nginx للـ SPA والـ Proxy
│
├── server/                     # خادم Node.js Express
│   ├── src/
│   │   ├── db/                 # مدير الاتصال بقاعدة بيانات SQL (SQLite & MySQL)
│   │   ├── routes/             # مسارات: lessons, contact, scores, stats, health
│   │   └── index.js            # نقطة البداية
│   └── Dockerfile
│
├── php-server/                 # خادم PHP 8.2 API
│   ├── public/
│   │   ├── index.php           # موجه REST API الرئيسي
│   │   ├── .htaccess           # توجيه Apache لـ cPanel
│   │   └── api/                # مسارات مباشرة بديلة (lessons.php, contact.php, ...)
│   ├── config.php              # إعدادات الاتصال والبيئة
│   ├── db.php                  # فئات ووظائف PDO للتعامل مع SQL
│   └── Dockerfile
│
├── database/                   # قاعدة البيانات وملفات SQL
│   ├── schema.sql              # هيكل الجداول لـ SQLite
│   ├── schema.mysql.sql        # هيكل الجداول لـ MySQL
│   ├── seed.sql                # البيانات الأولية لجميع المواد والدروس
│   └── ecole.sqlite            # قاعدة بيانات SQLite الجاهزة للاستخدام الفوري
│
├── docker-compose.yml          # تشغيل كامل النظام بحاويات Docker
├── DEPLOYMENT.md               # دليل النشر خطوة بخطوة
└── package.json                # سكربتات التشغيل والتطوير
```

---

## 🛠️ أوامر التشغيل السريع (Quick Start)

### 1. تثبيت الحزم:
```bash
npm install
```

### 2. التشغيل في بيئة التطوير:
- **مع خادم Node.js**:
  ```bash
  npm run dev
  ```
  *(يفتح React على http://localhost:3000 و Express على http://localhost:5000)*

- **مع خادم PHP**:
  ```bash
  npm run dev:php
  ```
  *(يفتح React على http://localhost:3000 و PHP على http://localhost:8000)*

- **تشغيل جميع الخوادم معاً**:
  ```bash
  npm run dev:all
  ```

### 3. بناء الواجهة للإنتاج:
```bash
npm run build
```

### 4. التشغيل عبر Docker Compose:
```bash
docker compose up -d --build
```

راجع ملف [DEPLOYMENT.md](file:///c:/Users/hp%20pavilion/Desktop/Project%20Master%20Gate/Global-Mind/DEPLOYMENT.md) للحصول على تفاصيل النشر على cPanel, VPS, و Cloud.
