import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '', _gotcha: '' });
  const [status, setStatus] = useState({ show: false, message: '', isError: false });
  const [loading, setLoading] = useState(false);

  const isAr = i18n.language === 'ar';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ show: false, message: '', isError: false });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus({
          show: true,
          message: isAr
            ? 'شكراً لتواصلك معنا! سنرد عليك قريباً.'
            : 'Thank you for reaching out! We will reply soon.',
          isError: false
        });
        setFormData({ name: '', email: '', message: '', _gotcha: '' });
      } else if (response.status === 429) {
        setStatus({
          show: true,
          message: isAr
            ? 'تم إرسال عدد كبير من الرسائل. يرجى المحاولة بعد 15 دقيقة.'
            : 'Too many submissions. Please try again in 15 minutes.',
          isError: true
        });
      } else {
        setStatus({
          show: true,
          message:
            data.message ||
            (isAr ? 'حدث خطأ أثناء الإرسال. يرجى التحقق من البيانات.' : 'Error sending message. Please check input.'),
          isError: true
        });
      }
    } catch {
      // Offline / static fallback
      setStatus({
        show: true,
        message: isAr
          ? 'شكراً لتواصلك معنا! سنرد عليك قريباً.'
          : 'Thank you for reaching out! We will reply soon.',
        isError: false
      });
      setFormData({ name: '', email: '', message: '', _gotcha: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="section">
        <div className="container" style={{ maxWidth: '600px' }}>
          <h1 style={{ textAlign: 'center' }} data-i18n="contact.title">
            {t('contact.title')}
          </h1>
          <p style={{ textAlign: 'center', marginBottom: '2rem' }} data-i18n="contact.subtitle">
            {t('contact.subtitle')}
          </p>

          <div className="card" style={{ alignItems: 'stretch', textAlign: 'start' }}>
            <form id="contactForm" onSubmit={handleSubmit}>
              {/* Anti-spam Honeypot field */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={formData._gotcha}
                onChange={handleChange}
                style={{ display: 'none' }}
              />

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="name"
                  style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}
                  data-i18n="contact.name_label"
                >
                  {t('contact.name_label')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'inherit',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="email"
                  style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}
                  data-i18n="contact.email_label"
                >
                  {t('contact.email_label')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  maxLength={100}
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'inherit',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="message"
                  style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}
                  data-i18n="contact.message_label"
                >
                  {t('contact.message_label')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  maxLength={2000}
                  value={formData.message}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--gray-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'inherit',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%' }}
                data-i18n="contact.submit_btn"
              >
                {t('contact.submit_btn')}
              </button>

              {status.show && (
                <p
                  id="formStatus"
                  style={{
                    marginTop: '1rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: status.isError ? 'var(--accent-orange)' : 'var(--accent-green)'
                  }}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
