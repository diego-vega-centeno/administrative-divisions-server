import passport from "../config/passport.js";

export const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', function (error, user, info) {
    if (error) return next(error);
    if (!user) return res.status(403).json({
      status: 'FAILURE',
      message: 'User not found'
    });
    next();
  })(req, res, next);
}