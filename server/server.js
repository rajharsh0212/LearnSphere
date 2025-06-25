import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import authRoutes from './routes/auth.js';
import connectCloudinary from './configs/cloudinary.js';
const app= express();
await connectDB();
await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/auth',  authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});