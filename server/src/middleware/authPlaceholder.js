/**
 * Phase 2 Authentication & Authorization Architecture Placeholder
 * 
 * Target Architecture:
 * - Roles: ['pupil', 'parent', 'teacher', 'admin']
 * - Passwords: Modern argon2id / bcrypt hashing with salt rounds >= 12
 * - Cookies: httpOnly, secure, sameSite: 'strict', path: '/'
 * - CSRF: Double Submit Cookie or Synchronizer Token Pattern
 */

export const ROLES = {
  PUPIL: 'pupil',
  PARENT: 'parent',
  TEACHER: 'teacher',
  ADMIN: 'admin'
};

export const AUTH_COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

/**
 * Placeholder for JWT or Session authentication check
 */
export const authenticateUser = (req, res, next) => {
  // Phase 2: verify session cookie or authorization header
  next();
};

/**
 * Role-Based Access Control (RBAC) middleware generator
 * Usage: requireRole(ROLES.TEACHER, ROLES.ADMIN)
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Phase 2: verify req.user.role is in allowedRoles
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource.'
      });
    }
    next();
  };
};

/**
 * CSRF Protection Placeholder
 */
export const verifyCsrf = (req, res, next) => {
  // Phase 2: Validate X-CSRF-Token against cookie secret
  next();
};
