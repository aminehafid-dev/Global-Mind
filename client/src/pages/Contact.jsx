import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

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
            ? 'شكراً لتواصلك معنا! تم حفظ رسالتك في قاعدة البيانات وسنرد عليك قريباً.'
            : 'Thank you for reaching out! Your message was recorded in the SQL database.',
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
      // Offline / fallback
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
        <div className="container" style={{ maxWidth: '640px' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            <span style={{ fontSize: '3rem', display: 'inline-block', marginBottom: '0.5rem' }}>📬</span>
            <h1 data-i18n="contact.title">{t('contact.title')}</h1>
            <p style={{ marginBottom: '2rem', fontSize: '1.25rem', color: '#555' }} data-i18n="contact.subtitle">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ alignItems: 'stretch', textAlign: 'start', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
          >
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

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  htmlFor="name"
                  style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-color)' }}
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
                  placeholder={isAr ? 'الاسم الكامل أو اسم ولي الأمر' : 'Full Name or Parent Name'}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid var(--gray-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'inherit',
                    fontSize: '1.1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--primary-color)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--gray-light)')}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label
                  htmlFor="email"
                  style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-color)' }}
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
                  placeholder="parent@example.com"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid var(--gray-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'inherit',
                    fontSize: '1.1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--primary-color)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--gray-light)')}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="message"
                  style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-color)' }}
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
                  placeholder={isAr ? 'اكتب رسالتك أو استفسارك هنا...' : 'Write your message or inquiry here...'}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid var(--gray-light)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'inherit',
                    fontSize: '1.1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--primary-color)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--gray-light)')}
                />
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '14px', fontSize: '1.25rem' }}
                data-i18n="contact.submit_btn"
              >
                {loading ? (isAr ? '⏳ جارٍ الإرسال والتسجيل...' : '⏳ Sending & Saving...') : `📨 ${t('contact.submit_btn')}`}
              </motion.button>

              <AnimatePresence>
                {status.show && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      marginTop: '1.5rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      backgroundColor: status.isError ? '#ffebee' : '#e8f5e9',
                      color: status.isError ? 'var(--accent-orange)' : 'var(--accent-green)',
                      border: `1px solid ${status.isError ? '#ffcdd2' : '#a5d6a7'}`
                    }}
                  >
                    {status.isError ? '❌ ' : '✅ '} {status.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
