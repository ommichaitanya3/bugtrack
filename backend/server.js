const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bugRoutes = require('./routes/bugs');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'BugTrack API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/bugs', bugRoutes);

const startServer = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
};

startServer();
