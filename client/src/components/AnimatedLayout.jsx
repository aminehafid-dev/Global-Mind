import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AnimatedLayout() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isRtl = i18n.language === 'ar';

  const offset = 24;
  const initialX = isRtl ? -offset : offset;
  const exitX = isRtl ? offset : -offset;

  const pageVariants = {
    initial: shouldReduceMotion
      ? { opacity: 1, x: 0, scale: 1 }
      : { opacity: 0, x: initialX, scale: 0.99 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1] // Custom smooth cubic-bezier
      }
    },
    exit: shouldReduceMotion
      ? { opacity: 1, x: 0, scale: 1 }
      : {
          opacity: 0,
          x: exitX,
          scale: 0.99,
          transition: {
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1]
          }
        }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: '100%', minHeight: 'calc(100vh - 160px)' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
