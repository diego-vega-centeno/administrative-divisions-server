// import passport from "passport";

// export const authenticateJWT = (req, res, next) => {
//   passport.authenticate('jwt', function (error, user, info){
//     if(error) return next(error);
//     console.log(user);
//     if(!user) return res.status(403).json({
//       status: 'FAILED',
//       message: 'User not found'
//     });
//     next();
//   })
// }