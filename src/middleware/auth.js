import passport from "../config/passport.js";

const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (error, user, info) {
    if (error) return next(error);
    if (!user) return res.status(403).json({
      status: 'FAILURE',
      message: info.message || 'Failed authentication'
    });
    next();
  })(req, res, next);
}

export {authenticateJWT}