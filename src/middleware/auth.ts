import type { NextFunction, Response, Request } from "express";
import passport from "../config/passport.js";

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    function (error: Error, user: Express.User, info: { message: string }) {
      if (error) return next(error);
      if (!user)
        return res.status(403).json({
          code: "auth_failed",
          message: info.message || "Failed authentication",
        });
      // Manually attach user to request because I'm using a callback
      req.user = user;
      next();
    },
  )(req, res, next);
};

export { authenticateJWT };
