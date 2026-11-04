import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AnimatedLayout() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isRtl = i18n.language === 'ar';

  const offset = 20;
  // In RTL, slide from opposite direction compared to LTR
  const initialX = isRtl ? -offset : offset;
  const exitX = isRtl ? offset : -offset;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: initialX }}
        animate={{ opacity: 1, x: 0 }}
        exit={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: exitX }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ width: '100%' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
