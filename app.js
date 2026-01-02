import './src/config/env.js'
import express from 'express'
import passport from './src/config/passport.js'
import loginRoute from './src/routes/logIn.js'
import userRoute from './src/routes/user.js'
import favoritesRoute from './src/routes/favorites.js'

// setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// root check
app.get('/', (req, res) => {
  res.status(200).json({status: 'OK', message: 'server is running'})
});

// endpoints
app.use('/login', loginRoute)
app.use('/api/favorites', favoritesRoute)
app.use('/api/users', userRoute)

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'ERROR', message: err.message || 'Something went wrong!' });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});