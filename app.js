import './src/config/env.js'
import express from 'express'
import passport from './src/config/passport.js'
import userRoute from './src/routes/userRoute.js'
import oauthGoogleRoute from './src/routes/oauthGoogle.js'
import apiRoute from './src/routes/apiRoute.js'
import countryRoute from './src/routes/countryRoute.js'
import layerRoute from './src/routes/layers.js'
import { rateLimit } from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { databaseErrorHandler, oauthErrorHandler, generalErrorHandler } from './src/routes/error-handlers.js'

// setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// allow CORS for frontend
const allowedOrigin = process.env.NODE_ENV == 'development' ? process.env.FRONTEND_DEV_URL : process.env.FRONTEND_PROD_URL
const frontendUrl = process.env.NODE_ENV == 'development' ? process.env.FRONTEND_DEV_URL : process.env.FRONTEND_PROD_URL;

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
app.use('/auth/google', oauthGoogleRoute)
app.use('/user', userRoute)
app.use('/layer', layerRoute)
app.use('/country', countryRoute)

// health check
app.get('/health', (req, res) => res.sendStatus(200));

// API
app.use('/api/v1/', apiRoute)

// error handlers
app.use(oauthErrorHandler);
app.use(databaseErrorHandler);
app.use(generalErrorHandler);

// start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;