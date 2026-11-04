import { useTranslation } from 'react-i18next';

export default function Legal() {
  const { t } = useTranslation();

  return (
    <main>
      <section className="section">
        <div className="container">
          <h1
            style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '2rem' }}
            data-i18n="legal.title"
          >
            {t('legal.title')}
          </h1>

          <div className="card" style={{ textAlign: 'start', alignItems: 'stretch' }}>
            <h2 data-i18n="legal.privacy_title">{t('legal.privacy_title')}</h2>
            <p data-i18n="legal.privacy_desc">{t('legal.privacy_desc')}</p>

            <h2 style={{ marginTop: '2rem' }}>عدم جمع البيانات</h2>
            <p>
              لا نقوم بجمع أي بيانات شخصية (مثل الأسماء، أرقام الهواتف، أو العناوين) عن الأطفال الذين يستخدمون المنصة. لا يوجد تسجيل دخول ولا يتم إنشاء حسابات مستخدمين.
            </p>

            <h2 style={{ marginTop: '2rem' }}>لا توجد ملفات تعريف ارتباط للتتبع (Cookies)</h2>
            <p>
              لا نستخدم ملفات تعريف الارتباط لأغراض التتبع أو الإعلانات. يتم حفظ تقدم الطالب (النجوم والنقاط) محلياً فقط على جهاز المستخدم باستخدام خاصية <code>localStorage</code> في المتصفح. لا يتم إرسال هذه البيانات إلى أي خادم خارجي.
            </p>

            <h2 style={{ marginTop: '2rem' }}>حقوق النشر</h2>
            <p>جميع المحتويات التعليمية والرسومات الموجودة في المنصة هي ملك لـ "مدرسة العقل العالمي".</p>
          </div>
        </div>
      </section>
    </main>
  );
}
