import './src/config/env.js'
import express from 'express'
import passport from './src/config/passport.js'
import loginRoute from './src/routes/logIn.js'
import userRoute from './src/routes/user.js'
import favoritesRoute from './src/routes/favorites.js'
import oauthGoogleRoute from './src/routes/oauthGoogle.js'
import apiRoute from './src/routes/apiRoute.js'
import { rateLimit } from 'express-rate-limit'
import cors from 'cors'

// setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// allow CORS for frontend
const allowedOrigin = process.env.NODE_ENV == 'development' ? process.env.FRONTEND_DEV_URL : process.env.FRONTEND_PROD_URL

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));


// API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    status: 'ERROR',
    message: 'API rate limit exceeded'
  }
});

app.use('api/v1/', apiLimiter);

// Initialize Passport
app.use(passport.initialize());

// endpoints
app.use('/login', loginRoute)
app.use('/api/favorites', favoritesRoute)
app.use('/api/users', userRoute)
app.use('/auth/google', oauthGoogleRoute)

// health check
app.get('/health', (req, res) => res.sendStatus(200));

// API
app.use('/api/v1/', apiRoute)

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