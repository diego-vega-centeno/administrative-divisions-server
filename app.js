import express from 'express'
import env from 'dotenv'

// setup
const app = express();
env.config();

// root check
app.get('/', (req, res) => {
  res.status(200).json({status: 'OK', message: 'server is running'})
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});