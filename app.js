import './src/config/env.js'
import express from 'express'
import './src/config/env.js'
import loginRoute from './src/routes/logIn.js'
import userRoute from './src/routes/user.js'
import favoritesRoute from './src/routes/favorites.js'

// setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// root check
app.get('/', (req, res) => {
  res.status(200).json({status: 'OK', message: 'server is running'})
});

// route handlers
app.use('/login', loginRoute)
app.use('/u/:user1/favorites', favoritesRoute)
app.use('/u', userRoute)


// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});