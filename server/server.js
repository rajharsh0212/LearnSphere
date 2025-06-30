import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import authRoutes from './routes/auth.js';
import connectCloudinary from './configs/cloudinary.js';
import { stripeWebhook } from './controllers/webhooksController.js';
import courseRouter from './routes/course.router.js';
import userRouter from './routes/user.route.js';
import educatorRouter from './routes/educator.route.js';
import aiRouter from './routes/ai.route.js';

const app = express();

// Database and Cloudinary connections
await connectDB();
await connectCloudinary();

// Special route for Stripe webhook must come BEFORE express.json()
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

// General middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://learnsphere-beta.vercel.app',
    'https://learn-sphere-dusky.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);
app.use('/api/educator', educatorRouter);
app.use('/api/ai', aiRouter);

// Server initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});