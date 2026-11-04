import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <main>
      <section className="section" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card">
            <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              {isAr ? 'الصفحة غير موجودة (404)' : 'Page Not Found (404)'}
            </h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
              {isAr
                ? 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.'
                : 'Sorry, we could not find the page you were looking for.'}
            </p>
            <Link to="/" className="btn btn-primary">
              {isAr ? '🏠 العودة إلى الرئيسية' : '🏠 Return to Home'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
