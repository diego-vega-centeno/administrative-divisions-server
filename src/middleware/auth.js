import passport from "../config/passport.js";

const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function (error, user, info) {
    if (error) return next(error);
    if (!user) return res.status(403).json({
      status: 'FAILURE',
      message: info.message || 'Failed authentication'
    });
    // Manually attach user to request because I'm using a callback
    req.user = user;
    next();
  })(req, res, next);
}

export {authenticateJWT}