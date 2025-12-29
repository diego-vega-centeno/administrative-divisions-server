import './src/config/env.js'
import express from 'express'
import './src/config/env.js'
import loginRoute from './src/routes/logIn.js'

// setup
const app = express();
app.use(express.json());

// root check
app.get('/', (req, res) => {
  res.status(200).json({status: 'OK', message: 'server is running'})
});

// path handlers
app.post('/login', loginRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});