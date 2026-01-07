import './src/config/env.js'
import express from 'express'
import passport from './src/config/passport.js'
import loginRoute from './src/routes/logIn.js'
import userRoute from './src/routes/user.js'
import favoritesRoute from './src/routes/favorites.js'
import oauthGoogleRoute from './src/routes/oauthGoogle.js'

// setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// endpoints
app.use('/login', loginRoute)
app.use('/api/favorites', favoritesRoute)
app.use('/api/users', userRoute)
app.use('/auth/google', oauthGoogleRoute)

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'ERROR', message: err.message || 'Something went wrong!' });
});

// start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;